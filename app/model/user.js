module.exports = app => {
    const mongoose = app.mongoose;
    const AutoIncrement = require('mongoose-sequence')(mongoose);
    const schema = new mongoose.Schema({
        id:{type: Number,index: true, unique: true},
        nickname:{type: String, unique: true},
        realname: {type: String},
        phone: {type: String, unique: true},
        email: {type: String, unique: true},
        email_password: {type: String},
        email_host: {type: String},
        email_port: {type: String},
        password: {type: String},
        created: {type: Number, default: Date.now()},
    });
    schema.plugin(AutoIncrement, {id:"user_id", inc_field: 'id'});
    return mongoose.model('kb_user', schema);
};
