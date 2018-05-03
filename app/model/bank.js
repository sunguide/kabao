module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        id:{type: Number},
        name:{type: String},
        full_name: {type: String},
        alias: {type: String},
        icon: {type: String},
        logo: {type: String},
        created: {type: Number},
    });

    return mongoose.model('kb_bank', schema);
}
