const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");

const labelController = require("../controllers/labelController");

router.post('/', [
    check('name_en', "name_en_required").not().isEmpty(),
    check('name_es', "name_es_required").not().isEmpty(),
    check('color', "color_requires").not().isEmpty()
], labelController.createLabel);
//auth middleware

router.put('/', auth, labelController.updateLabel);

module.exports = router;