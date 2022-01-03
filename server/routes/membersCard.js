const express = require('express');
const router = express.Router();
const { check } = require('express-validator')
const auth = require("../middleware/auth");

const membersCardController = require("../controllers/membersCardController");

router.get('/:cardId', auth, membersCardController.getMembersCard);

router.post('/search/:cardId', auth, membersCardController.searchUsersCard);

router.delete('/:memberId', auth, membersCardController.deleteUserCard);

router.post('/:cardId', [
    check('users', "users_required").not().isEmpty(),
], auth, membersCardController.addMember);


module.exports = router;