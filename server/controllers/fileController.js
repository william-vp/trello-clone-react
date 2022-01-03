const File = require('../models/File')
const User = require('../models/User')
const List = require('../models/List')
const Card = require('../models/Card')
const { validationResult } = require('express-validator')
const multer = require('multer')
const shortid = require('shortid')
const fs = require("fs")
var stream = require('stream');
var path = require('path');

exports.upload = async (req, res) => {
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

    if (!uid) return res.status(403).json({ code: "not_auth" });

    let card = await Card.findById(req.params.cardId);

    let name, extension, originalName;
    const config = {
        limits: { fileSize: 1024 * 1024 * 10 },
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, __dirname + "/../uploads/files/")
            },
            filename: (req, file, callback) => {
                extension = file.originalname.substring(file.originalname.lastIndexOf('.', file.originalname.length));
                name = `${shortid.generate()}.${extension}`
                originalName = file.originalname
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
            /*   DELETE
            if (file.route) {
                if (!file.route.includes("http")) {
                    fs.unlinkSync(__dirname + `/../uploads/files/${user.photoUrl}`);
                }
            } */
            const file = new File(req.body);
            file.name = originalName
            file.route = req.file.filename
            file.card = card._id
            file.user = user._id
            await file.save();

            return res.status(200).json({
                file,
                details: "success"
            });
        } else {
            console.log(error);
            return res.status(500).json({ details: "error", err: error });
        }
    })

}

exports.getFiles = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    let card = await Card.findById(req.params.cardId);
    let files = await File.find({ card: card._id }).populate('user')
    return res.status(200).json({ files, code: "success" });
}

exports.getFilesLength = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    let card = await Card.findById(req.params.cardId);
    let files = await File.count({ card: card._id })
    return res.status(200).json({ files, code: "success" });
}

exports.updateCard = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    const { cardId } = req.params
    let card = await Card.findById(cardId); //validar user exists
    if (!card) return res.status(403).json({ code: "card_not_exists", msg: "La tarjeta ya no existe" });

    const { description } = req.body;
    try {
        const dataCard = card
        if (description) dataCard.description = description
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

exports.delete = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    const { fileId } = req.params

    let file = await File.findById(fileId); //validar user exists
    if (!file) return res.status(403).json({ code: "file_not_exist", msg: "El archivo ya no existe" });

    try {
        if (file.route) {
            if (!file.route.includes("http")) {
                fs.unlinkSync(__dirname + `/../uploads/files/${file.route}`);
            }
        }

        await File.deleteOne({ _id: file._id })
        return res.status(200).json({ success: true, code: "success" });
    } catch (e) {
        return res.status(500).json({ msg: e.message, code: "error" });
    }
}

exports.download = async (req, res) => {
    const { uid } = req.user;
    if (!uid) return res.status(403).json({ code: "not_auth" });

    const { fileId } = req.params

    let file = await File.findById(fileId); //validar user exists
    if (!file) return res.status(403).json({ code: "file_not_exist", msg: "El archivo ya no existe" });

    try {
        const dirname = __dirname.replace("controllers", "")
        const route = dirname + "/uploads/files/" + file.route;
        console.log(route)
        return res.download(route)
    } catch (e) {
        return res.status(500).json({ msg: e.message, code: "error" });
    }
}

