'use strict';
module.exports = app => {
    class user extends app.Service {
        constructor(ctx) {
            super(ctx);
        }

        //信用卡
        async add(userId, card){
          card.user_Id = userId;
          if(card.valid_thru){
              card.valid_thru = this.ctx.helper.format(card.valid_thru,"YYYYMM");
          }
          return await (new this.ctx.model.UserCard(card)).save();
        }

        async remove(id){
          return await this.ctx.model.UserCard.remove({id:id});

        }

        async find(params){
          return await this.ctx.model.UserCard.find({id:params.id});
        }

        async update(id, data){
            return await this.ctx.model.User.update({id:id}, {$set:data});
        }


        async list(params){
          return await this.ctx.model.UserCard.find({user_id:params.user_id});
        }
    }

    return user;
};
