const User = require('../../models/v1/user')
const {json} = require("express");
const passport = require('passport');
const jwt = require('jsonwebtoken');

exports.getById = async (req, res) => {
    const {id} = req.params

    try {
        const user = await User.findById(id)
        if (user)
            return res.status(200).json(user)
        return res.status(404).json('user_not_found')
    } catch (e) {
        return res.status(501).json(e)
    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const user = await User.find()
        if (user)
            return res.status(200).json(user)
        return res.status(404).json('no_users_found')
    } catch (e) {
        return res.status(501).json(e)
    }
}


exports.add = async (req, res) => {
    const temp = {};

    ({
        username: temp.username,
        password: temp.password
    } = req.body)
    Object.keys(temp).forEach((key) => (temp[key] == null) && delete temp[key])
    try {
        let user = await User.create(temp)
        return res.status(201).json(user)
    } catch (error) {
        return res.status(501).json(error)
    }
}

exports.update = async (req, res) => {
    const temp = {};

    ({
        username: temp.username,
        password: temp.password
    } = req.body)

    try {
        let user = await User.findOne({username: temp.username})
        if (user) {
            Object.keys(temp).forEach((key) => {
                if (!!temp[key]) {
                    user[key] = temp[key]
                }
            });
            await user.save()
            return res.status(201).json(user)
        }

        return res.status(404).json('user_not_found')
    } catch (error) {
        console.log(error)
        return res.status(501).json(error)
    }
}

exports.delete = async (req, res) => {
    const {id} = req.body

    try {
        await User.deleteOne({_id: id})
        return res.status(201).json('delete_ok')
    } catch (error) {
        return res.status(501).json(error)
    }
}

exports.signUp = async (req, res) => {
    passport.authenticate('signup', { session: false }),
        async (req, res, next) => {
            res.json({
                message: 'Signup successful',
                user: req.user
            });
    }
}

exports.login = async (req, res, next) => {
    passport.authenticate( 'login',
        async (err, user, info) => {
            try {
                if (err || !user) {
                    const error = new Error('An error occurred.');
                    return next(error);
                }
                req.login( user,
                    { session: false },
                    async (error) => {
                        if (error) return next(error);
                        const body = { _id: user._id, username: user.username };
                        const token = jwt.sign({ user: body }, 'TOP_SECRET');
                        return res.json({ token });
                    }
                );
            } catch (error) {
                return next(error);
            }
        }
    ) (req, res, next);
}