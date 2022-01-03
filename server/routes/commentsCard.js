const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const auth = require("../middleware/auth");

const commentCardController = require("../controllers/commentCardController");

/* comment */
router.post('/:cardId', [
    check('text', "text_required").not().isEmpty(),
    check('cardId', "cardId_required").not().isEmpty(),
], auth, commentCardController.createComment);

router.put('/:commentId', [
    check('text', "text_required").not().isEmpty(),
    check('commentId', "commentId_required").not().isEmpty(),
], auth, commentCardController.editComment);

router.delete('/:commentId', [], auth, commentCardController.deleteComment);

router.get('/:cardId', [
    check('cardId', "cardId_required").not().isEmpty(),
], auth, commentCardController.getCommentsCard);

router.get('/:cardId/getCommentsCardLength', [
    check('cardId', "cardId_required").not().isEmpty(),
], auth, commentCardController.getCommentsCardLength);

module.exports = router;