const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const auth = require("../middleware/auth");

const cardController = require("../controllers/cardController");
const commentCardController = require("../controllers/commentCardController");

router.post('/:listId', [
    check('name', "name_required").not().isEmpty(),
], auth, cardController.createCard);

router.get('/:listId', auth, cardController.getCardsList);

router.put('/:cardId', auth, cardController.updateCard);
router.delete('/:cardId', auth, cardController.deleteList);

module.exports = router;