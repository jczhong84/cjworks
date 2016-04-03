var bcrypt = require('bcrypt-nodejs');
var crypto = require('crypto');
var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  username: { type: String, lowercase: true, unique: true },
//  password: String,
//  passwordResetToken: String,
//  passwordResetExpires: Date,
/*
  profile: {
    name: { type: String, default: '' },
    gender: { type: String, default: '' },
    location: { type: String, default: '' },
    website: { type: String, default: '' },
    picture: { type: String, default: '' }
  }
*/
}, { timestamps: true });

var User = mongoose.model('User', userSchema);

module.exports = User;
