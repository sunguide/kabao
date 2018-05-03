module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        id:{type: Number},
        subject:{type: String},
        from: {type: String},
        to: {type: String},
        body: {type: String},
        attachment: {type: String},
        created: {type: Number},
    });

    return mongoose.model('kb_user_email', schema);
}
