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

    async getCreditBanks() {
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

    async crawlerStart(){
      let series = [];
      let $this = this;
      for(let i = 1; i < 10; i++){
        let res = await request.get('https://credit.u51.com/kaku/p/1');
        let $ = cheerio.load(res.text,{decodeEntities: false});
        $(".creditList li").each((i, item) => {
          let url = $(item).find(".creditPic").attr("href");
          $this.getCreditCardSeriesInfo("https://credit.u51.com"+url);
        });
      }

    }
    async getCreditCardInfo(url) {
      let res = await request.get(url);
      let $ = cheerio.load(res.text,{decodeEntities: false});

      let tags = $('.mr-com.tags').text();
      let creditFeature = [];
      $("#creditTs ul li").each(function (i, item) {
        creditFeature.push($(item).text());
      });
      let creditHotLine = this.itemNodeHandle($('#hotLine dl'), $);
      let creditIntro = this.itemNodeHandle($('#creditIntro dl'), $);
      let creditChargeRule = this.itemNodeHandle($('#sfIntro dl'), $);
      let creditLostRule = this.itemNodeHandle($('#gsRule dl'), $);
      let creditBaseInfo = $("#baseInfo p").text();
      let city = "全国";
      let type = "";
      let level = "";
      let org = "";
      let currency = "";
      let longest_free = "";
      //信用卡属性
      $(".hd-b .hd-b-item dl").each(function (i, item) {
        switch ($(item).find("dt").text().trim()){
          case '发卡城市':
            city = $(item).find("dd").text();
            break;
          case '卡片类型':
            type = $(item).find("dd").text();
            break;
          case '卡等级':
            level = $(item).find("dd").text();
            break;
          case '卡组织':
            org = $(item).find("dd").text();
            break;
          case '卡币种':
            currency = $(item).find("dd").text();
            break;
          case '最长免息期':
            longest_free = $(item).find("dd").text();
            break;
          default:
        }
      });

      let creditCardInfo = {
        'url': url,
        'cover': $('.pic img').attr('data-original'),
        'slogan': $('.intro dd').text(),
        'features': $('.intro dt').html(),
        'tags': tags,
        'credit_annual_fee':creditBaseInfo,
        'credit_feature':creditFeature,
        'credit_hot_line': creditHotLine,
        'credit_intro': creditIntro,
        'credit_charge_rule': creditChargeRule,
        'credit_lost_rule': creditLostRule,
        'city': city,
        'type': type,
        'level': level,
        'org': org,
        'currency':currency,
        'longest_free':longest_free
      };
      console.log(creditCardInfo)
      return creditCardInfo;
    }

    async getCreditCardSeriesInfo(url) {
      let res = await request.get(url);
      let $ = cheerio.load(res.text,{decodeEntities: false});

      let tags = $('.mr-com.tags').text();
      let creditFeature = [];
      $("#creditTs ul li").each(function (i, item) {
        creditFeature.push($(item).text());
      });
      let creditSeries = [];
      $("#creditSet ul li").each(function (i, item) {

        creditSeries.push({
          'url': $(item).find('a').attr("href"),
          'name': $(item).find('.item-r h3').text(),
          'cover': $(item).find('.pic img').attr('data-original'),
          'tags': $(item).find('.item-r p').text()
        });
      });

      let creditIntro = this.itemNodeHandle($('#creditIntro dl'), $);

      let creditChargeRule = this.itemNodeHandle($('#chargeRule'), $);

      let creditCardSeriesInfo = {
        'url': url,
        'cover': $('.pic img').attr('data-original'),
        'slogen': $('.intro dt span').text(),
        'address': $('.intro dd').text(),
        'tags': tags,
        'credit_feature': creditFeature,
        'credit_series': creditSeries,
        'credit_intro': creditIntro,
        'credit_charge_rule': creditChargeRule
      };
      console.log(creditCardSeriesInfo);
      return creditCardSeriesInfo;
    }


    itemNodeHandle(item,$){
      let items = [];
      $(item).find("dt").each(function(i, item){
        items.push({
          'title': $(item).text(),
          'content': $(item).next().html()
        });
      });
      return items;
    }
  }

  return crawler;
};
