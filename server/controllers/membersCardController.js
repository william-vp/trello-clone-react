const Board = require('../models/Board')
const Card = require('../models/Card')
const User = require('../models/User')
const MemberBoard = require('../models/MemberBoard')
const MemberCard = require('../models/MemberCard')
const { validationResult } = require('express-validator')

exports.addMember = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(202).json({
            errors: errors.array(),
            details: "data_send_incomplete",
            msg: "Datos enviados incorrectos"
        });
    }
    const { users, boardCode } = req.body
    const { cardId } = req.params

    const { uid } = req.user;

    if (!uid) {
        return res.status(403).json({ code: "not_auth" });
    }

    let user = await User.findOne({ uid }); //validar user exists

    let board = await Board.findOne({ code: boardCode }).populate('user'); //validar board exists
    if (!board) return res.status(404).json({ code: "board_not_exists" });

    console.log(cardId)
    let card = await Card.findById(cardId); //validar card exists
    if (!card) return res.status(404).json({ code: "card_not_exists" });

    if (user._id.toString() !== board.user._id.toString()) {
        return res.status(403).json({
            msg: "El usuario no tiene permisos para realizar esta acción",
            details: "user_not_authorized"
        });
    }

    try {
        for (let member of users) {
            let user = await User.findById(member.user._id);

            let member_exists_board = await MemberBoard.findOne()
                .where('board').gte(board._id)
                .and([{ user: user._id }]);
            if (!member_exists_board) {
                return res.status(200).json({
                    msg: "El usuario no es miembro del tablero",
                    details: "error"
                });
            }

            if (user) {
                let member_exists = await MemberCard.findOne()
                    .where('card').gte(card._id)
                    .and([{ user: user._id }]);
                console.log(member_exists)
                if (member_exists) continue
                const newMember = new MemberCard();
                newMember.user = user._id
                newMember.card = card._id
                await newMember.save();
            }
        }

        let members_card = await MemberCard.find({ card: card._id }).populate('user');
        return res.status(200).json({
            members_card,
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message, details: "error" });
    }
}

exports.getMembersCard = async (req, res) => {
    const { uid } = req.user;

    if (!uid) {
        return res.status(403).json({ code: "not_auth" });
    }

    let user = await User.findOne({ uid }); //validar user exists
    if (!user) {
        return res.status(200).json({
            msg: "El usuario no existe",
            details: "user_not_exists"
        });
    }

    const { cardId } = req.params
    let card = await Card.findById(cardId); //validar board exists
    if (!card) return res.status(400).json({ code: "card_not_exists" });
    let members = await MemberCard.find({ card: card._id }).populate('user')
    return res.status(200).json({ members, code: "success" });
}

exports.searchUsersCard = async (req, res) => {
    const { uid } = req.user;

    if (!uid) {
        return res.status(403).json({ code: "not_auth" });
    }

    const { query, boardCode } = req.body
    const { cardId } = req.params

    let board = await Board.findOne({ code: boardCode }).populate('user'); //validar board exists
    if (!board) return res.status(404).json({ code: "board_not_exists" });

    let users = await MemberBoard.find({ board: board._id })
        .populate('user');

    users = users.filter(u => u.user.name.includes(query) || u.user.email.includes(query))

    let card = await Card.findById(cardId).populate('user'); //validar board exists

    let users_not_in_board = []
    for (let member of users) {
        let member_exists = await MemberCard.findOne()
            .where('card').gte(card._id)
            .and([{ user: member._id }]);
        if (!member_exists) {
            if (member._id.toString() !== card.user._id.toString()) {
                users_not_in_board.push(member)
            }
        }
    }

    return res.status(200).json({ users: users_not_in_board, code: "success" });
}

exports.getCard = async (req, res) => {
    const { uid } = req.user;

    if (!uid) {
        return res.status(403).json({ code: "not_auth" });
    }

    let user = await User.findOne({ uid }); //validar user exists
    if (!user) {
        return res.status(200).json({
            msg: "El usuario no existe",
            details: "user_not_exists"
        });
    }

    const { boardCode } = req.params
    let board = await Board.findOne({ code: boardCode })
        .populate('user');
    if (!board) {
        return res.status(200).json({
            msg: "El tablero no existe",
            details: "board_not_exists"
        });
    }
    return res.status(200).json({ board, code: "success" });
}

exports.deleteUserCard = async (req, res) => {

    const { uid } = req.user;

    if (!uid) {
        return res.status(403).json({ code: "not_auth" });
    }

    let user = await User.findOne({ uid }); //validar user exists
    if (!user) {
        return res.status(200).json({
            msg: "El usuario no existe",
            details: "user_not_exists"
        });
    }

    const { memberId } = req.params
    let member = await MemberBoard.findById(memberId).populate('board'); //validar user exists
    if (!member) return res.status(403).json({
        code: "member_not_exists",
        msg: "El miembro ya no existe en este tablero"
    });

    let board = await Board.findOne({ code: member.board.code }).populate('user'); //validar board exists
    if (!board) return res.status(404).json({ code: "group_not_exists" });

    if (user._id.toString() !== board.user._id.toString()) {
        return res.status(403).json({
            msg: "El usuario no tiene permisos para realizar esta acción",
            details: "user_not_authorized"
        });
    }

    try {
        await MemberBoard.deleteOne({ _id: member._id })
        return res.status(200).json({ success: true, code: "success" });
    } catch (e) {
        return res.status(500).json({ msg: e.message, code: "error" });
    }

}

