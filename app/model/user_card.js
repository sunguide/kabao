module.exports = app => {
    const mongoose = app.mongoose;
    const AutoIncrement = require('mongoose-sequence')(mongoose);
    const schema = new mongoose.Schema({
        id:{type: Number,index: true, unique: true},
        bank_id:{type: Number, index: true},
        card_id: {type: Number, index: true},
        card_number: {type: String, index: true},
        statement_date: {type: Number},//账单日
        payment_date: {type: Number}, //到期还款日
        credit_limit: {type: Number}, //信用额度
        rewards_points_balance: {type: Number, default:0}, //积分余额
        currency:{type: String}, //货币单位
        valid_thru:{type: Number},//有效日期
        created: {type: Number, default: Date.now()},
    });
    schema.plugin(AutoIncrement, {id:"user_card_id", inc_field: 'id'});
    return mongoose.model('kb_user_card', schema);
};
