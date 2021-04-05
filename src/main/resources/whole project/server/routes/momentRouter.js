const mongoose = require('mongoose');
const momentRouter = require('express').Router();
const auth = require('./authRouter');
const momentController = require('../controllers/momentController');

const moment = mongoose.model('Moment');
const User = mongoose.model('User');
const {getMoment} = momentController;


// get all image of an user :/
momentRouter.get('/', auth.optional, (req, res) => {
  momentController.getMoment(req, res);
});

module.exports = momentRouter;
