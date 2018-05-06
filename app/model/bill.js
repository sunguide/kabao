module.exports = app => {
    const mongoose = app.mongoose;
    const schema = new mongoose.Schema({
        id:{type: Number},
        user_id:{type: Number, default:0},
        statement_date: {type: Number},//账单日
        payment_date: {type: Number}, //到期还款日
        credit_limit: {type: Number}, //信用额度
        current_amount_due: {type: Number, default: 0}, //本期应还款额
        minimum_amount_ue: {type: Number, default: 0}, //最低还款额
        rewards_points_balance: {type: Number, default:0}, //积分余额
        currency:{type: String}, //货币单位
        created:{type: Number, default: Date.now()}
    });

    return mongoose.model('kb_bill', schema);
};
