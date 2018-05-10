module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        user_id: {type: Number, index: true},
        message_id:{type: String, index: true, unique:true},
        subject: {type: String},
        from: {type: String, required:true},
        to: {type: String, index:true},
        html: {type: String},
        text: {type: String},
        attachments: {type: Array},
        date: {type: String},
        bill_type:{type: Number},//0:非账单,1:行用卡账单，2:其他
        created: {type: Number, default: Date.now()},
    });

    return mongoose.model('kb_user_email', schema);
};
