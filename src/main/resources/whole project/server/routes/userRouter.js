const userRouter = require('express').Router();
const userController = require('../controllers/userController');
const passwordController = require('../controllers/passwordController');
const auth = require('./authRouter');

// Get logged in user's information: /user
userRouter.get('/', auth.required, function (req, res, next) {
    userController.getUser(req, res, next);
});

// Update user information: /user
userRouter.put('/', auth.required, function (req, res, next) {
    userController.updateUser(req, res, next);
});

// Post data to sign in a user: /user/sign-in
userRouter.post('/sign-in', function (req, res, next) {
    userController.signInUser(req, res, next);
});

// Post data to sign up a new user: /user
userRouter.post('/', function (req, res, next) {
    userController.signUpUser(req, res, next);
});

// Delete user: /user
userRouter.delete('/', auth.required, function (req, res, next) {
    userController.deleteUser(req, res, next);
});

userRouter.post('/recover', auth.optional, function (req, res, next) {
    passwordController.recover(req, res, next);
});

userRouter.get('/reset/:token', auth.optional, function (req, res, next) {
    passwordController.reset(req, res, next);
});

userRouter.post('/reset/:token', auth.optional, function (req, res, next) {
    passwordController.resetPassword(req, res, next);
});

module.exports = userRouter;
