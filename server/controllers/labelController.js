const Label = require('../models/Label')
const {validationResult} = require('express-validator')

exports.createLabel = async (req, res) => {
    const errors = validationResult(req); //validation
    if (!errors.isEmpty()) {
        return res.status(202).json({
            errors: errors.array(),
            details: "data_send_incomplete",
            msg: "Datos enviados incorrectos"
        });
    }

    const {name_en, name_es, color} = req.body;
    const exists_label = await Label.findOne({name_en});
    if (exists_label) {
        return res.status(200).json({
            msg: "La etiqueta ya existe",
            details: "label_exists"
        });
    }
    try {
        const label = new Label(req.body);
        await label.save();
        return res.status(200).json({
            label,
            details: "success"
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({msg: e.message, details: "error"});
    }
}

exports.getLabels = async (req, res) => {
    const {uid} = req.user;

    if (!uid) {
        return res.status(403).json({code: "not_auth"});
    }

    let labels = await Label.find();
    return res.status(200).json({labels, code: "success"});
}

exports.updateLabel = async (req, res) => {
    const {uid} = req.user;
    if (!uid) return res.status(403).json({code: "not_auth"});

    let label = await Label.findOne({uid}); //validar user exists
    if (!label) return res.status(403).json({code: "label_not_exists"});

    const {name_en, name_es, color} = req.body;
    try {
        const dataLabel = label
        if (name_en) dataLabel.name_en = name_en
        if (name_es) dataLabel.name_es = name_es
        if (color) dataLabel.color = color
        label = await Label.findByIdAndUpdate(
            {_id: label._id},
            {$set: dataLabel},
            {new: true}
        );
        return res.status(200).json({label, code: "success"});
    } catch (e) {
        return res.status(500).json({msg: e.message, code: "error"});
    }
}