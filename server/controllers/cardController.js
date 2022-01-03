const User = require('../models/User')
const List = require('../models/List')
const MemberBoard = require('../models/MemberBoard')
const CommentCard = require('../models/CommentCard')
const Card = require('../models/Card')
const { validationResult } = require('express-validator')

exports.createCard = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(202).json({
            errors: errors.array(),
            details: "data_send_incomplete",
            msg: "Datos enviados incorrectos"
        });
    }

    const { uid } = req.user;
    if (!uid) {
        return res.status(403).json({ code: "not_auth" });
    }

    let user = await User.findOne({ uid }); //validar user exists
    if (!user) {
        return res.status(403).json({
            msg: "El usuario no existe",
            details: "user_not_exists"
        });
    }

    let list = await List.findById(req.params.listId).populate('board'); //validar user exists
    if (!list) {
        return res.status(404).json({
            msg: "La lista ya no existe",
            details: "list_not_exists"
        });
    }

    if (user._id.toString() !== list.board.user.toString()) {
        let member_authorized = await MemberBoard.findOne()
            .where('board').gte(list.board._id)
            .and([{ user: user._id }]);
        if (!member_authorized) {
            return res.status(403).json({
                msg: "No tienes permiso para realizar esta acción",
                details: "user_not_authorized"
            });
        }
    }


    const { name } = req.body;
    const exists_card = await List.findOne({ name });
    if (exists_card) {
        return res.status(200).json({
            msg: "Una tarjeta con el mismo nombre ya existe en la lista",
            details: "list_exists"
        });
    }

    try {
        const cards = await Card.find({ list: list._id });
        const card = new Card(req.body);
        card.user = user._id
        card.list = list._id
        card.position = cards.length - 1
        await card.save();

        return res.status(200).json({
            card,
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message, details: "error" });
    }
}

exports.getCardsList = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    let user = await User.findOne({ uid }); //validar user exists
    if (!user) {
        return res.status(200).json({
            msg: "El usuario no existe",
            details: "user_not_exists"
        });
    }

    let list = await List.findById(req.params.listId); //validar user exists
    if (!list) {
        return res.status(404).json({
            msg: "La lista no existe",
            details: "list_not_exists"
        });
    }

    let cards = await Card.find({ list: list._id })
        .sort({ position: 'asc' })
        .populate('list');
    return res.status(200).json({ cards, code: "success" });
}

exports.updateCard = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    const { cardId } = req.params
    let card = await Card.findById(cardId); //validar user exists
    if (!card) return res.status(403).json({ code: "card_not_exists", msg: "La tarjeta ya no existe" });

    const { description, position, list } = req.body;
    console.log(list)
    try {
        const dataCard = card
        if (description) dataCard.description = description
        if (position !== null) dataCard.position = position
        if (list !== null) dataCard.list = list
        dataCard.updated_at = Date.now();

        card = await Card.findByIdAndUpdate(
            { _id: card._id },
            { $set: dataCard },
            { new: true }
        ).populate('user');
        return res.status(200).json({ card, code: "success" });
    } catch (e) {
        return res.status(500).json({ msg: e.message, code: "error" });
    }
}

exports.deleteList = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    const { listId } = req.params
    let list = await List.findById(listId); //validar user exists
    if (!list) return res.status(403).json({ code: "list_not_exists", msg: "La lista ya no existe" });

    try {
        await List.deleteOne({ _id: list._id })
        return res.status(200).json({ success: true, code: "success" });
    } catch (e) {
        return res.status(500).json({ msg: e.message, code: "error" });
    }
}