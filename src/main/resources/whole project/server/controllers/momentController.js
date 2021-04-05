const mongoose = require('mongoose');
const passport = require('passport');

const User = mongoose.model('User');
const Moments = mongoose.model('Moment');

// Get currently logged in user
const getMoment = (req, res) => {
  User.findById(req.payload.id).then(function (user) {
    if (!user) {
      return res.sendStatus(401).send('The user does not exist.');
    }
    let userName = user.username;
    Moments.find({user: user._id}).then(function (moments) {
		userMoments = moments.map((moment) => {
			return {user: userName, contents: moment.contents, created_time: moment.createdAt, comments: moment.comments, like:moment.like}
		})
		return res.json({"moments": userMoments});
    });
  });
};

module.exports = {
  getMoment,
};