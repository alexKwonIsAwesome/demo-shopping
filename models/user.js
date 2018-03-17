const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

// {
//     email: 'khwalex@gmail.com',
//     password: 'asdfasdfasdfasdf',
//     tokens: [{
//         access: 'auth',
//         token: 'asdfasa98302klj;lksdfasdf'
//     }]
// }

var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 8,
    },
    tokens: [{
        access: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            require: true
        }
    }]
});

// Defining Model Instance method => access .methods
// overriding toJSON();
UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = async function () {
    try {
        var user = this;
        var access = 'auth';
        var token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123').toString();
    
        user.tokens = user.tokens.concat([{ access, token }]);
        await user.save();
        return token;
    } catch (e) {
        return e;
    }
};

// Defining Model method => access .statics
UserSchema.statics.findByToken = async function (token) {
    try {
        var User = this;
        var decoded;
    
        decoded = jwt.verify(token, 'abc123');

        return User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth' 
        })
    } catch (e) {
        return Promise.reject();
    }
}

UserSchema.pre('save', function (next) {
    var user = this;

    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})

var User = mongoose.model('User', UserSchema);

module.exports = { User };