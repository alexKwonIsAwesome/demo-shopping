const mongoose = require('mongoose');
const validator = require('validator');

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

var User = mongoose.model('User', UserSchema);

module.exports = { User };