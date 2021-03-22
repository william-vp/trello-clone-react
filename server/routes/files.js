const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const auth = require("../middleware/auth");

const fileController = require("../controllers/fileController");

router.get('/:fileId/download', auth, fileController.download);
router.get('/:cardId', auth, fileController.getFiles);
router.post('/:cardId', auth, fileController.upload);
router.delete('/:fileId', auth, fileController.delete);

module.exports = router;
