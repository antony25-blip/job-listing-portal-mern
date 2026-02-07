const ensureAuthenticated = require('../middleware/Auth');
const { signup, login, googleLogin, me } = require('../controllers/AuthController');
const { signupValidation, loginValidation } = require('../middleware/AuthValidation');
const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/google-login', googleLogin);
router.get('/me', ensureAuthenticated, me);

module.exports = router;