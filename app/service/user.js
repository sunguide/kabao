'use strict';
module.exports = app => {
    class user extends app.Service {
        constructor(ctx) {
            super(ctx);
        }
        async create(data) {
            return await (new this.ctx.model.User(data)).save();
        }

        async find(uid){
            return await (new this.ctx.model.User()).find({id:uid});
        }
        async update(uid, data){
            return await this.ctx.model.User.update({id:uid},{$set:data});
        }

        async delete(){

        }

        async encrpt(){

        }

        //信用卡
        async addCard(){

        }

        async removeCard(){

        }

        async getCardList(){

        }
    }

    return user;
};
