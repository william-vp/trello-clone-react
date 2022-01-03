const express = require('express');
const router = express.Router();
const {check} = require('express-validator')
const auth = require("../middleware/auth");

const userController = require("../controllers/userController");

/*router.post('/', [
    check('username', "El nombre es requerido").not().isEmpty(),
    check('email', "Verifica el correo electrónico").isEmail(),
    check('password', "Verifica la contraseña").isLength({min: 6})
], userController.createUser, profileController.createProfile);

router.put('/', auth, userController.updateUser);*/

router.post('/getUserAuth', auth, userController.getUser);
router.put('/avatar', auth, userController.uploadAvatar);
router.put('/', auth, userController.updateUser);

module.exports = router;