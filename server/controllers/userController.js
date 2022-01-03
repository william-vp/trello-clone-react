const User = require('../models/User')
//const Group = require('../models/Group')
//const Category = require('../models/Category')
//const GroupMembers = require('../models/GroupMembers')
const bcrypt = require('bcrypt')
const multer = require('multer')
const shortid = require('shortid')
const {validationResult} = require('express-validator')
const fs = require("fs")

exports.createUser = async (req, res, next) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(202).json({
            errors: errors.array(),
            details: "data_send_incomplete",
            msg: "Datos enviados incorrectos"
        });
    }

    const {email, password, username} = req.body;
    const exists_email = await User.findOne({email});
    if (exists_email) {
        return res.status(200).json({
            msg: "El correo electrónico digitado ya esta en uso por una cuenta",
            details: "email_exists"
        });
    }
    const exists_username = await User.findOne({username})
    if (exists_username) {
        return res.status(200).json({msg: "El nombre de usuario digitado ya esta en uso", details: "username_exists"});
    }

    try {
        const user = new User(req.body);
        const salt = await bcrypt.genSalt(10);  //hash password
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        req.body.userId = user._id;
        next();
    } catch (e) {
        console.log(e);
        return res.status(500).json({msg: e.message, details: "error"});
    }
}

exports.getUser = async (req, res) => {
    const {uid} = req.user;

    if (!uid) {
        return res.status(403).json({code: "not_auth"});
    }

    let user = await User.findOne({uid}); //validar user exists
    if (!user) {
        const {email, name, lastName, firebase, photoUrl, uid} = req.user;
        let provider = "email"
        if (firebase) {
            provider = firebase.sign_in_provider
            provider = provider.split(".")[0]
        }
        try {
            const dataUser = {
                email, name, uid, provider, photoUrl
            }
            user = new User(dataUser);
            await user.save();
        } catch (e) {
            return res.status(500).json({msg: e.message, code: "error"});
        }
    }
    return res.status(200).json({user, code: "success"});
}

exports.uploadAvatar = async (req, res) => {
    const {uid} = req.user;

    let user = await User.findOne({uid}); //validar user exists
    if (!user) {
        return res.status(400).json({msg: "El usuario no existe", code: "user_not_exists"});
    }

    const config = {
        limits: {fileSize: 1024 * 1024 * 10},
        storage: fileStorage = multer.diskStorage({
            destination: (req, file, callback) => {
                callback(null, __dirname + "/../uploads/users/avatar/")
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
            if (user.photoUrl){
                if (!user.photoUrl.includes("http")) {
                    fs.unlinkSync(__dirname + `/../uploads/users/avatar/${user.photoUrl}`);
                }                
            }

            const dataProfile = {
                photoUrl: req.file.filename,
                updated_at: Date.now()
            }
            user = await User.findByIdAndUpdate(
                {_id: user._id},
                {$set: dataProfile},
                {new: true}
            );
            return res.status(200).json({user});
        } else {
            console.log(error);
            return res.status(500).json({details: "error", err: error});
        }
    })
    //upload.single('file');
}

exports.updateUser = async (req, res) => {
    const {uid} = req.user;
    if (!uid) return res.status(403).json({code: "not_auth"});

    let user = await User.findOne({uid}); //validar user exists
    if (!user) return res.status(403).json({code: "user_not_exists"});

    const {name, bio, phoneNumber} = req.body;
    try {
        const dataUser = user
        if (name) dataUser.name = name
        if (bio) dataUser.bio = bio
        if (phoneNumber) dataUser.phoneNumber = phoneNumber
        user = await User.findByIdAndUpdate(
            {_id: user._id},
            {$set: dataUser},
            {new: true}
        );
        return res.status(200).json({user, code: "success"});
    } catch (e) {
        return res.status(500).json({msg: e.message, code: "error"});
    }
}

exports.getGroupsJoined = async (req, res) => {
    try {
        const {uid} = req.user;
        if (!uid) return res.status(403).json({code: "not_auth"});

        let user = await User.findOne({uid}); //validar user exists
        if (!user) return res.status(403).json({code: "user_not_exists"});

//TODO quitar status
        let groups = [];
        let members = await GroupMembers.find()
            .where('user').gte(user._id)
        //.where('status').gt("ACTIVE")
        for (let member of members) {
            let group = await Group.findById(member.group)
                .where("user").ne(user._id)
                .populate('category')
                .populate('topic')
                .populate('user');
            if (group) groups.push(group)
        }

        return res.status(200).json({groups, code: "success"});
    } catch (e) {
        return res.status(500).json({msg: e.message, code: "error"});
    }
}

exports.getGroupsPending = async (req, res) => {
    try {
        const {uid} = req.user;
        if (!uid) return res.status(403).json({code: "not_auth"});

        let user = await User.findOne({uid}); //validar user exists
        if (!user) return res.status(403).json({code: "user_not_exists"});

        //TODO quitar status
        let groups = [];
        let members = await GroupMembers.find()
            .where('user').gte(user._id)
        //.where('status').gt("PENDING")
        for (let member of members) {
            let group = await Group.findById(member.group)
                .where("user").ne(user._id)
                .populate('category')
                .populate('topic')
                .populate('user');
            if (group) groups.push(group)
        }

        return res.status(200).json({groups, code: "success"});
    } catch (e) {
        return res.status(500).json({msg: e.message, code: "error"});
    }
}

exports.getGroupsCreated = async (req, res) => {
    try {
        const {uid} = req.user;
        if (!uid) return res.status(403).json({code: "not_auth"});
        console.log(uid)

        let user = await User.findOne({uid}); //validar user exists
        if (!user) return res.status(403).json({code: "user_not_exists"});

        let groups = await Group.find({user: user._id})
            .populate('category')
            .populate('topic')
            .populate('user');
        return res.status(200).json({groups, code: "success"});
    } catch (e) {
        return res.status(500).json({msg: e.message, code: "error"});
    }
}