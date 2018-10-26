var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var config = require('../config/config');
var jwt = require('jsonwebtoken');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  admin:{
    type: Boolean,
    required: true
  }
});

UserSchema.pre('save', function(next) {
  if (this.isModified('password')) {
      this.password = this._hashPassword(this.password);
  }
  return next();
});

UserSchema.methods = {
  _hashPassword(password) {
    return bcrypt.hashSync(password);
  },
  authenticateUser(password) {
    return bcrypt.compareSync(password, this.password);
  },
  createToken() {
    // create a token
    var token = jwt.sign({ id: this._id }, process.env.JWT_WORD || config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    return token   
  },  
  toJson() {
    return {
      _id: this._id,
      username: this.username,
      token: this.createToken()
    }
  },
};

module.exports = mongoose.model('User', UserSchema);