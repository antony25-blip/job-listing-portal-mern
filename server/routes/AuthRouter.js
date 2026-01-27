const { signup, login, googleLogin } = require('../controllers/AuthController');
const { signupValidation, loginValidation } = require('../middleware/AuthValidation');
const router = require('express').Router();

router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.post('/google-login', googleLogin);
router.get('/me', require('../middleware/Auth'), require('../controllers/AuthController').me);
module.exports = router;