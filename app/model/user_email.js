module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        user_id: {type: Number, index: true},
        subject: {type: String},
        from: {type: String, required:true},
        to: {type: String, index:true},
        html: {type: String},
        attachment: {type: String},
        created: {type: Number, default: Date.now()},
    });

    return mongoose.model('kb_user_email', schema);
}
