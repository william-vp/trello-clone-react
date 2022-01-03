const Board = require('../models/Board')
const User = require('../models/User')
const List = require('../models/List')
const MemberBoard = require('../models/MemberBoard')
const {validationResult} = require('express-validator')

exports.createList = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(202).json({
            errors: errors.array(),
            details: "data_send_incomplete",
            msg: "Datos enviados incorrectos"
        });
    }

    console.log(req.body)

    const {uid} = req.user;

    if (!uid) {
        return res.status(403).json({code: "not_auth"});
    }

    let user = await User.findOne({uid}); //validar user exists
    if (!user) {
        return res.status(403).json({
            msg: "El usuario no existe",
            details: "user_not_exists"
        });
    }

    let board = await Board.findOne({code: req.params.boardCode}); //validar user exists
    if (!board) {
        return res.status(404).json({
            msg: "El tablero no existe",
            details: "board_not_exists"
        });
    }

    if (user._id.toString() !== board.user.toString()) {
        let member_authorized = await MemberBoard.findOne()
            .where('board').gte(board._id)
            .and([{user: user._id}]);
        if (!member_authorized) {
            return res.status(403).json({
                msg: "No tienes permiso para realizar esta acción",
                details: "user_not_authorized"
            });
        }
    }


    const {name} = req.body;
    const exists_list = await List.findOne({name});
    if (exists_list) {
        return res.status(200).json({
            msg: "Una lista con el mismo nombre ya existe en el tablero",
            details: "list_exists"
        });
    }

    try {
        const list = new List(req.body);
        list.user = user._id
        list.board = board._id
        list.name = name
        await list.save();

        return res.status(200).json({
            list,
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({msg: e.message, details: "error"});
    }
}

exports.getLists = async (req, res) => {
    const {uid} = req.user;
    if (!uid) {
        return res.status(403).json({code: "not_auth"});
    }

    let user = await User.findOne({uid}); //validar user exists
    if (!user) {
        return res.status(200).json({
            msg: "El usuario no existe",
            details: "user_not_exists"
        });
    }

    let board = await Board.findOne({code: req.params.boardCode}); //validar user exists
    if (!board) {
        return res.status(404).json({
            msg: "El tablero no existe",
            details: "board_not_exists"
        });
    }
    
    let lists = await List.find({board: board._id});
    return res.status(200).json({lists, code: "success"});
}

exports.updateList = async (req, res) => {
    const {uid} = req.user;
    if (!uid) return res.status(403).json({code: "not_auth"});

    const {listId} = req.params
    let list = await List.findById(listId); //validar user exists
    if (!list) return res.status(403).json({code: "list_not_exists", msg: "La lista ya no existe"});

    const {name} = req.body;
    try {
        const dataList = list
        if (name) dataList.name = name
        dataList.updated_at = Date.now();

        list = await List.findByIdAndUpdate(
            {_id: list._id},
            {$set: dataList},
            {new: true}
        ).populate('user');
        return res.status(200).json({list, code: "success"});
    } catch (e) {
        return res.status(500).json({msg: e.message, code: "error"});
    }
}

exports.deleteList = async (req, res) => {
    const {uid} = req.user;
    if (!uid) return res.status(403).json({code: "not_auth"});

    const {listId} = req.params
    let list = await List.findById(listId); //validar user exists
    if (!list) return res.status(403).json({code: "list_not_exists", msg: "La lista ya no existe"});

    try {
        await List.deleteOne({_id: list._id})
        return res.status(200).json({success: true, code: "success"});
    } catch (e) {
        return res.status(500).json({msg: e.message, code: "error"});
    }
}

