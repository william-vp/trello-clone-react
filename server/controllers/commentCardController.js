const Board = require('../models/Board')
const User = require('../models/User')
const List = require('../models/List')
const MemberBoard = require('../models/MemberBoard')
const Card = require('../models/Card')
const CommentCard = require('../models/CommentCard')
const { validationResult } = require('express-validator')

//TODO member get, create comment
exports.getCommentsCard = async (req, res) => {
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

    const card = await Card.findById(req.params.cardId);
    if (!card) {
        return res.status(404).json({
            msg: "La tarjeta seleccionada ya no existe.",
            details: "card_not_exists"
        });
    }

    let comments = await CommentCard.find({ card: card._id }).populate('user');
    return res.status(200).json({ comments, code: "success" });

}

exports.getCommentsCardLength = async (req, res) => {
    const card = await Card.findById(req.params.cardId);
    if (!card) {
        return res.status(404).json({
            msg: "La tarjeta seleccionada ya no existe.",
            details: "card_not_exists"
        });
    }

    let commentsLength = await (await CommentCard.find({ card: card._id })).length;
    return res.status(200).json({ commentsLength, code: "success" });
}


exports.createComment = async (req, res) => {
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

    const card = await Card.findById(req.body.cardId);
    if (!card) {
        return res.status(404).json({
            msg: "La tarjeta seleccionada ya no existe.",
            details: "card_not_exists"
        });
    }

    try {
        const comment = new CommentCard(req.body);
        comment.user = user._id
        comment.card = card._id
        await comment.save();
        return res.status(200).json({
            comment,
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message, details: "error" });
    }
}

exports.editComment = async (req, res) => {
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

    let comment = await CommentCard.findById(req.body.commentId);
    if (!comment) {
        return res.status(404).json({
            msg: "El comentario seleccionada ya no existe.",
            details: "comment_not_exists"
        });
    }

    try {
        const { text } = req.body
        const dataComment = {
            text,
            updated_at: Date.now()
        }
        comment = await CommentCard.findByIdAndUpdate(
            { _id: comment._id },
            { $set: dataComment },
            { new: true }
        );
        return res.status(200).json({
            comment,
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message, details: "error" });
    }
}

exports.deleteComment = async (req, res) => {
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

    let comment = await CommentCard.findById(req.params.commentId);
    if (!comment) {
        return res.status(404).json({
            msg: "El comentario seleccionada ya no existe.",
            details: "comment_not_exists"
        });
    }

    try {
        await CommentCard.findByIdAndDelete(comment._id);
        return res.status(200).json({
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message, details: "error" });
    }
}