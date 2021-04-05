const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {secret} = require('../config');

// Define the fields for the MongoDB user
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
      index: true,
    },
    lastname: String,
    firstname: String,
    major: String,
    headline: String,
    aboutSection: String,
    location: String,
    website: String,
    linkedin: String,
    graduation: String,
    image: String,
    hash: String,
    salt: String,
    resetPasswordToken: {
      type: String,
      required: false,
    },

    resetPasswordExpires: {
      type: Date,
      required: false,
    },
  },
  {timestamps: true}
);

// Make sure that the username isn't already taken
UserSchema.plugin(uniqueValidator, {message: 'is already taken.'});

// Check if the password is valid
UserSchema.methods.validPassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
  return this.hash === hash;
};

// Store the database
UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, 'sha512')
    .toString('hex');
};

// Compare password
UserSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

// Create a new JSON web token for authentication
UserSchema.methods.generateJWT = function () {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign(
    {
      id: this._id,
      username: this.username,
      exp: parseInt(exp.getTime() / 1000),
    },
    secret
  );
};

// Return JSON for the user
UserSchema.methods.toAuthJSON = function () {
  return {
    _id:this._id,
    lastname: this.lastname,
    firstname: this.firstname,
    major: this.major,
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    headline: this.headline,
    aboutSection: this.aboutSection,
    location: this.location,
    website: this.website,
    linkedin: this.linkedin,
    graduation: this.graduation,
    image:
      this.image || 'https://static.productionready.io/images/smiley-cyrus.jpg',
  };
};

UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordExpires = Date.now() + 3600000; // expires in an hour
};

mongoose.model('User', UserSchema);
