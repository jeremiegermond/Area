const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const User = new Schema({
    name: {
        type: String,
        trim: true,
        required: [true, 'Name is required']
    },
    firstname: {
        type: String,
        required: [true, 'Firstname is required']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    }
}, {
    timestamps: true
})

User.pre('save', function (next) {
    if (!this.isModified('password')) {
        return next()
    }
    this.password = bcrypt.hashSync(this.password, 10)
    next()
})

User.methods.isValidPassword = async function(password) {
    const user = this;
    const compare = await bcrypt.compare(password, user.password);
  
    return compare;
  }

module.exports = mongoose.model('User', User)