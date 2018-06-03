'use strict';
module.exports = app => {
    class apiAutoService extends app.Service {
        constructor(ctx) {
            super(ctx);
            if(this.modelName){
              this.modelName = this.firstUpper(this.modelName);
              this.model = ctx.model[this.modelName];
            }
        }

        async index(modelName, params){
          let page = params.page || 1;
          let limit = params.limit || 10;
          params.page = undefined;
          params.limit = undefined;
          console.log(limit)
          return await this.getModel(modelName).find(params).skip((page - 1) * limit).limit(limit);
        }

        async show(modelName, params){
          return await this.getModel(modelName).findOne(params);
        }

        async count(modelName, params){
          return await this.getModel(modelName).count(params);
        }

        async create(modelName, params){
          return await (new (this.getModel(modelName))(params)).save();
        }

        async update(modelName, params){
          return await this.getModel(modelName).update({id:params.id}, {$set:params});
        }

        async desotry(modelName, params){
          return await this.getModel(modelName).remove(params);
        }

        getModel(modelName){
          modelName = this.firstUpper(modelName);
          return this.model = this.ctx.model[modelName];
        }

        firstUpper(str){
          return str.replace(/(\w)/,function(v){return v.toUpperCase()});
        }
    }

    return apiAutoService;
};
