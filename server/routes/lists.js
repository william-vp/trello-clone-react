const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");

const listController = require("../controllers/listController");

router.post('/:boardCode', [
    check('name', "name_required").not().isEmpty(),
], auth, listController.createList);

router.put('/:listId', auth, listController.updateList);
router.delete('/:listId', auth, listController.deleteList);

module.exports = router;