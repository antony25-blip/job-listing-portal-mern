const { signup, login, googleLogin } = require('../controllers/AuthController');
const { signupValidation, loginValidation } = require('../middleware/AuthValidation');
const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/google', googleLogin);

module.exports = router;