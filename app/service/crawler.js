'use strict';
const cheerio = require('cheerio');
const request = require('superagent');

module.exports = app => {
  class crawler extends app.Service {
    constructor(ctx) {
      super(ctx);
    }

    async getBanks() {
      let res = await request.get('https://kaku.51credit.com/tag/310100index.html');
      let $ = cheerio.load(res.text);
      let banks = [];
      $('#bank_all a').each(function (i, item) {
        let bank = {
          'id': $(item).attr('id'),
          'small_img': $(item).find('img').attr('src'),
          'name': $(item).find('em').text()
        };
        banks.push(bank);
      });
      return banks;
    }

    async getCreditCards() {
      let res = await request.get('https://credit.u51.com/kaku/p/1');
      let $ = cheerio.load(res.text);
      let banks = [];
      $('.search-bank li').each(function (i, item) {
        let bank = {
          'id': $(item).attr('id'),
          'small_img': $(item).find('img').attr('src'),
          'name': $(item).text()
        };
        banks.push(bank);
      });
      return banks;
    }

    async getCreditCardInfo(url) {
      let res = await request.get(url);
      let $ = cheerio.load(res.text);

      let tags = $('.mr-com.tags').text();
      let creditCardInfo = {
        'cover': $('.pic img').attr('data-original'),
        'slogen': $('.intro dt span').text(),
        'address': $('.intro dd').text(),
        'tags': tags
      };
      return creditCardInfo;
    }

    async getCreditCardSeriesInfo(url) {
      let res = await request.get(url);
      let $ = cheerio.load(res.text);

      let tags = $('.mr-com.tags').text();
      let creditFeature = [];
      $("#creditTs ul li").each(function (i, item) {
        creditFeature.push($(item).text());
      });
      let creditSeries = [];
      $("#creditSet ul li").each(function (i, item) {

        creditSeries.push({
          'name': $(item).find('.item-r h3').text(),
          'cover': $(item).find('.pic img').attr('data-original'),
          'tags': $(item).find('.item-r p').text()
        });
      });
      let creditIntro = this.itemNodeHandle($('#creditIntro dl'),$);
      let creditCardInfo = {
        'cover': $('.pic img').attr('data-original'),
        'slogen': $('.intro dt span').text(),
        'address': $('.intro dd').text(),
        'tags': tags,
        'credit_feature': creditFeature,
        'credit_series': creditSeries,
        'credit_intro': creditIntro
      };
      return creditCardInfo;
    }


    itemNodeHandle(item,$){
      let items = [];
      $(item).find("dt").each(function(i, item){
        items.push({
          'title': $(item).text(),
          'content': $(item).next().text()
        });
      });
      return items;
    }
    async getNews() {
      let lastId = await this.ctx.app.redis.get('xuangubao_last_id');
      let current = Math.floor(Date.now() / 1000);
      let results = await this.ctx.curl(`https://api.xuangubao.cn/api/pc/msgs?tailmark=${current}&limit=30&subjids=9,10,35,469`, {dataType: 'json'})
      console.log('start:getNews');
      if (results.data && results.data.NewMsgs) {
        let msgs = results.data.NewMsgs;
        msgs = msgs.reverse();
        let cookie = await this.ctx.service.xueqiu.getLoginCookie({
          username: 'sunguide2@wolfunds.com',
          password: 'sunguide1989'
        });
        console.log(cookie);
        for (let i = 0; i < msgs.length; i++) {
          if (msgs[i].Id <= lastId) {
            continue;
          } else {
            let message = msgs[i].Title;
            let title = '';
            if (msgs[i].Summary) {
              message = msgs[i].Summary;
              title = msgs[i].Title;
            }
            if (message) {
              message = message.replace('选股宝讯，', '');
              if (msgs[i].Stocks) {
                for (let k = 0; k < msgs[i].Stocks.length; k++) {
                  let stock_code = getStockCode(msgs[i].Stocks[k].Symbol);
                  message += '  $' + msgs[i].Stocks[k].Name + '(' + stock_code + ')$  ';
                }
              }

              if (msgs[i].BkjInfoArr) {
                for (let k = 0; k < msgs[i].BkjInfoArr.length; k++) {
                  message += ' #' + msgs[i].BkjInfoArr[k].Name + '# ';
                }
              }
              console.log(message);
              let posted = await this.ctx.service.xueqiu.post(message, title, cookie);
              if (posted) {
                await this.ctx.app.redis.set('xuangubao_last_id', msgs[i].Id);
              } else {
                console.log('post fail');
              }
            }
          }
        }
      } else {
        console.log('fetch xuangubao news fail');
        console.log(results);
      }

      function getStockCode(code) {
        if (code.indexOf('.SZ') > 0 || code.indexOf('.SH') || code.indexOf('.SS')) {
          code = code.split('.');
          if (code[1] === 'SS') {
            return 'SH' + code[0];
          }
          return code[1] + code[0];
        }
        return code;
      }

      return results;
    }
  }

  return crawler;
};
