module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        name:{type: String},
        small_cover: {type: String},
        full_name: {type: String},
        toGroup: {type: Boolean},
        plain: {type: String},
        success: {type: Boolean},
        created: {type: Number},
    });

    return mongoose.model('kb_bank', schema);
}
