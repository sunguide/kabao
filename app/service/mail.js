'use strict';
const cheerio = require('cheerio');
const request = require('superagent');
const MailParser = require("mailparse").MailParser;
const simpleParser = require('mailparse').simpleParser;
const moment = require('moment');
module.exports = app => {
    class mail extends app.Service {
        constructor(ctx) {
            super(ctx);
        }

        async search() {
            var Imap = require('imap'),
                inspect = require('util').inspect;

            var imap = new Imap({
                user: 'sunguide@qq.com',
                password: 'woshini88',
                host: 'imap.qq.com',
                port: 993,
                tls: true
            });

            function openInbox(cb) {
                imap.openBox('INBOX', true, cb);
            }

            imap.once('ready', function() {

              openInbox(function(err, box) {

                console.log("打开邮箱")

                if (err) throw err;

                imap.search(['ALL', ['SINCE', 'Feb 20, 2018']], function(err, results) {//搜寻2017-05-20以后未读的邮件

                  if (err) throw err;

                  console.log(results);
                  return;

                  var f = imap.fetch(results, { bodies: '' });//抓取邮件（默认情况下邮件服务器的邮件是未读状态）

                  f.on('message', function(msg, seqno) {

                    var mailparser = new MailParser();

                    msg.on('body', function(stream, info) {

                      stream.pipe(mailparser);//将为解析的数据流pipe到mailparser

                      //邮件头内容
                      mailparser.on("headers", function(headers) {
                        console.log("邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                        console.log("邮件主题: " + headers.get('subject'));
                        console.log("发件人: " + headers.get('from').text);
                        console.log("收件人: " + headers.get('to').text);
                      });

                      //邮件内容

                      mailparser.on("data", function(data) {
                        if (data.type === 'text') {//邮件正文
                          console.log("邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                          console.log("邮件内容: " + data.html);
                        }
                        if (data.type === 'attachment') {//附件
                          console.log("邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                          console.log("附件名称:"+data.filename);//打印附件的名称
                          // data.content.pipe(fs.createWriteStream(data.filename));//保存附件到当前目录下
                          // data.release();
                        }
                      });

                    });
                    msg.once('end', function() {
                      console.log(seqno + '完成');
                    });
                  });
                  f.once('error', function(err) {
                    console.log('抓取出现错误: ' + err);
                  });
                  f.once('end', function() {
                    console.log('所有邮件抓取完成!');
                    imap.end();
                  });
                });
              });
            });

            imap.once('error', function (err) {
                console.log(err);
            });

            imap.once('end', function () {
                console.log('Connection ended');
            });

            imap.connect();
        }

      getRecentEmails(day = 31) {
        let since = moment().subtract(day, 'days').format('LL');
        var Imap = require('imap'),
          inspect = require('util').inspect;
        let mails = [];
        var imap = new Imap({
          user: 'sunguide@qq.com',
          password: 'woshini88',
          host: 'imap.qq.com',
          port: 993,
          tls: true
        });
        function openInbox(cb) {
          imap.openBox('INBOX', true, cb);
        }

        return new Promise((resolve,reject) => {
          imap.once('ready', function() {
            openInbox(function(err, box) {
              console.log("打开邮箱")
              if (err) throw err;
              imap.search(['ALL', ['SINCE', since]], function(err, results) {//搜寻2017-05-20以后所有的邮件
                if (err) throw err;
                console.log(results);
                var f = imap.fetch(results, { bodies: '' });//抓取邮件（默认情况下邮件服务器的邮件是未读状态）
                f.on('message', function(msg, seqno) {
                  let email = {
                    'headers':{},
                    'subject':'',
                    'from':'',
                    'date':'',
                    'to':'',
                    'body':'',
                    'attachments':[],
                  };

                  msg.on('body', function(stream, info) {
                    //第一种方案：一个函数搞定，但是不能对附件忽略，耗时比较久
                    simpleParser(stream).then(mail => {
                        mail.attachments = [];
                        mails.push(mail);
                    }).catch(err => {
                        console.log(err)
                    });
                    //第二种方案，过滤掉附件的处理,
                    //需要解决数据丢失的问题
                    // let mail = {
                    //   'attachments':[]
                    // };
                    // let mailparser = new MailParser();
                    // stream.pipe(mailparser);//将为解析的数据流pipe到mailparser
                    // //邮件头内容
                    // mailparser.on("headers", function(headers) {
                    //   console.log("邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    //   console.log("邮件主题: " + headers.get('subject'));
                    //   // console.log("发件人: " + headers.get('from').text);
                    //   // console.log("收件人: " + headers.get('to').text);
                    //   mail.headers = headers;
                    //
                    // });
                    //
                    // //邮件内容
                    // mailparser.on("data", function(data) {
                    //   if (data.type === 'text') {//邮件正文
                    //     console.log("邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    //     console.log("邮件内容: " + data.html);
                    //     Object.keys(data).forEach(key => {
                    //         if (['text', 'html', 'textAsHtml'].includes(key)) {
                    //             mail[key] = data[key];
                    //         }
                    //     });
                    //   }
                    //   if (data.type === 'attachment') {//附件
                    //     console.log("邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    //     console.log("附件名称:"+data.filename);//打印附件的名称
                    //     // data.content.pipe(fs.createWriteStream(data.filename));//保存附件到当前目录下
                    //     data.content.on('end', () => {
                    //        // data.content = Buffer.concat(chunks, chunklen);
                    //        data.release();
                    //     });
                    //   }
                    // });
                    // mailparser.on("end", function(){
                    //   ['subject', 'references', 'date', 'to', 'from', 'to', 'cc', 'bcc', 'message-id', 'in-reply-to', 'reply-to'].forEach(key => {
                    //      if (mail.headers.has(key)) {
                    //          mail[key.replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = mail.headers.get(key);
                    //      }
                    //   });
                    //   mails.push(mail);
                    // });
                    //end
                  });
                  msg.once('end', function() {
                    console.log(seqno + '完成');
                  });
                });
                f.once('error', function(err) {
                  console.log('抓取出现错误: ' + err);
                  reject(err);
                });
                f.once('end', function() {
                  console.log('所有邮件抓取完成!');
                  imap.end();
                });
              });
            });
          });

          imap.once('error', function (err) {
            console.log(err);
            reject(err);
          });

          imap.once('end', function () {
            console.log('Connection ended');
            console.log("所有邮件抓取完成:"+mails.length);
            resolve(mails.reverse());
          });

          imap.connect();
        });
      }
    }
"select * from tablename group by advice order by yield"
"select distinct advice from tablename order by yield desc"
    return mail;
};
