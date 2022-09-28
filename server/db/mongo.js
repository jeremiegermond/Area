const mongoose = require('mongoose')
const clientOptions = {
    useNewUrlParser: true,
    dbName: 'mongodb'
}

exports.initDbConnection = async () => {
    try {
        await mongoose.connect(process.env.URL_MONGO || 'mongodb://user_area:pass_area@mongo')
        console.log('db connected')
    } catch (e) {
        console.log(e)
        throw e
    }
}