module.exports = app => {
    const mongoose = app.mongoose;
    const AutoIncrement = require('mongoose-sequence')(mongoose);
    const schema = new mongoose.Schema({
        id:{type: Number,index: true, unique: true},
        title:{type: String},
        content: {type: String},
        created: {type: Number, default: Date.now()},
    });
    schema.plugin(AutoIncrement, {id:"topic_id", inc_field: 'id'});
    return mongoose.model('kb_topic', schema);
};
