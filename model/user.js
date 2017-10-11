var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');
var userSchema = new Schema({
    email: {
    type: String,
    unique: true,
    required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
      type: String,
      default: 'mail not sent'
    }

});

userSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return next(err);
                }
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

userSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

var gamer = module.exports = mongoose.model('User', userSchema);

module.exports.getUsers = function(callback, limit) {
    gamer.find(callback);
}
