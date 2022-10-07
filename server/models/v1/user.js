const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

const UserKeys = new Schema({
    service: {
        type: String,
        required: [true, 'Service name is required'],
    },
    public_key: {
        type: String,
        required: [true, 'Public key is required'],
    },
    private_key: {
        type: String,
        required: [true, 'Private key is required'],
    }
})

const User = new Schema({
    username: {
        type: String,
        trim: true,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    keys: [{
        type: Schema.ObjectId, ref: 'UserKeys'
    }],
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