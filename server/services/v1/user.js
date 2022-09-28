const User = require('../../models/v1/user')

exports.getById = async (req, res) => {
    const { id } = req.params

    try {
        const user  = await User.findById(id)
        if (user)
            return res.status(200).json(user)
        return res.status(404).json('user_not_found')
    } catch (e) {
        return res.status(501).json(e)
    }
}