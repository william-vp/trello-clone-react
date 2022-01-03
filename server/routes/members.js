const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");

const membersController = require("../controllers/membersController");

router.get('/:boardCode', auth, membersController.getMembersBoard);

router.post('/search/:boardCode', auth, membersController.searchUsersBoard);

router.delete('/:memberId', auth, membersController.deleteUserBoard);

router.post('/:boardCode', [
    check('users', "users_required").not().isEmpty(),
], auth, membersController.addMember);


module.exports = router;