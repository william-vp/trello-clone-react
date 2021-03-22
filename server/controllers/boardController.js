const Board = require('../models/Board')
const User = require('../models/User')
const List = require('../models/List')
const Card = require('../models/Card')
const { validationResult } = require('express-validator')
const shortid = require('shortid')

exports.createBoard = async (req, res) => {
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
        return res.status(200).json({
            msg: "El usuario no existe",
            details: "user_not_exists"
        });
    }

    const { name, visibility, cover } = req.body;
    const exists_board = await Board.findOne({ name });
    if (exists_board) {
        return res.status(200).json({
            msg: "El tablero ya existe",
            details: "board_exists"
        });
    }
    try {
        const board = new Board(req.body);
        board.user = user._id
        board.code = shortid.generate()
        await board.save();

        const List1 = new List({
            name: 'To do',
            type: 'todo',
            user: user._id,
            board: board._id
        }).save();
        const List2 = new List({
            name: 'In Progress',
            type: 'doing',
            user: user._id,
            board: board._id
        }).save();
        const List3 = new List({
            name: 'Completed',
            type: 'done',
            user: user._id,
            board: board._id
        }).save();

        return res.status(200).json({
            board,
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ msg: e.message, details: "error" });
    }
}

exports.getBoards = async (req, res) => {
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

    let boards = await Board.find({ user: user._id });
    return res.status(200).json({ boards, code: "success" });
}

exports.getBoard = async (req, res) => {
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

    let lists = await List.find({ board: board._id });

    let listsC = []
    for (let i = 0; i < lists.length; i++) {
        const list = lists[i]._doc;
        let cards = await Card.find({ list: list._id })
            .select('_id, position')
            .sort({ position: 'asc' });
        let cardsCopy = []
        for (let i = 0; i < cards.length; i++) {
            cardsCopy[i] = cards[i]
        }
        listsC.push({ ...list, cards: cardsCopy })
    }

    if (!board) {
        return res.status(200).json({
            msg: "El tablero no existe",
            details: "board_not_exists"
        });
    }
    return res.status(200).json({ board, lists: listsC, code: "success" });
}

exports.updateBoard = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    const { boardId } = req.params
    let board = await Board.findById(boardId); //validar user exists
    if (!board) return res.status(403).json({ code: "board_not_exists" });

    const { name, visibility, coverUrl, description } = req.body;
    try {
        const dataBoard = board
        if (name) dataBoard.name_en = name
        if (visibility) dataBoard.visibility = visibility
        if (description) dataBoard.description = description
        if (coverUrl) dataBoard.coverUrl = coverUrl
        dataBoard.updated_at = Date.now();

        board = await Board.findByIdAndUpdate(
            { _id: board._id },
            { $set: dataBoard },
            { new: true }
        ).populate('user');
        return res.status(200).json({ board, code: "success" });
    } catch (e) {
        return res.status(500).json({ msg: e.message, code: "error" });
    }
}

exports.uploadCover = async (req, res) => {
    const { uid } = req.user;

    let user = await User.findOne({ uid }); //validar user exists
    if (!user) {
        return res.status(400).json({ msg: "El usuario no existe", code: "user_not_exists" });
    }

    const { boardId } = req.params
    let board = await Board.findById(boardId); //validar user exists
    if (!board) return res.status(403).json({ code: "label_not_exists" });

    const config = {
        limits: { fileSize: 1024 * 1024 * 10 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, __dirname + "/../uploads/boards/cover/")
            },
            filename: (req, file, callback) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.', file.originalname.length));
                const name = `${shortid.generate()}.${extension}`
                callback(null, name)
            },
            fileFilter: (req, file, callback) => {
                if (file.mimetype === "application/exe") { //validation extension file
                    return callback(null, true);
                }
            }
        })
    }
    const upload = multer(config).single('file');

    upload(req, res, async (error) => {
        if (!error) {
            if (board.cover) {
                if (!board.cover.includes("http")) {
                    fs.unlinkSync(__dirname + `/../uploads/boards/cover/${board.cover}`);
                }
            }

            const dataBoard = {
                cover: req.file.filename,
                updated_at: Date.now()
            }
            board = await Board.findByIdAndUpdate(
                { _id: board._id },
                { $set: dataBoard },
                { new: true }
            );
            return res.status(200).json({ board });
        } else {
            console.log(error);
            return res.status(500).json({ details: "error", err: error });
        }
    })
    //upload.single('file');
}
