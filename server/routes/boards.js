const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");

const boardController = require("../controllers/boardController");

router.get('/', auth, boardController.getBoards);

router.get('/:boardCode', auth, boardController.getBoard);

router.post('/', [
    check('name', "name_en_required").not().isEmpty(),
    check('visibility', "visibility_required").not().isEmpty(),
], auth, boardController.createBoard);
router.put('/:boardId', auth, boardController.updateBoard);
router.put('/avatar/:boardId', auth, boardController.uploadCover);

router.post('/search', auth, boardController.searchUserBoards);


module.exports = router;