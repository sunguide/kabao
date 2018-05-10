'use strict';
const cheerio = require('cheerio');
const request = require('superagent');
const MailParser = require("mailparse").MailParser;
const simpleParser = require('mailparse').simpleParser;
const moment = require('moment');
const Imap = require('imap');
const inspect = require('util').inspect;

module.exports = app => {
  class mail extends app.Service {
    constructor(ctx) {
      super(ctx);
    }

    getClient(user) {
      let server = this.getClientServerByEmail(user['email']);
      let client = new Imap({
        user: user['email'],
        password: user['email_password'],
        host: user['email_host'] ? user['email_host'] : server.host,
        port: user['email_port'] ? user['email_port'] : server.port,
        tls: true
      });
      console.log({
        user: user['email'],
        password: user['email_password'],
        host: user['email_host'] ? user['email_host'] : server.host,
        port: user['email_port'] ? user['email_port'] : server.port,
        tls: true
      });
      return client;
    }

    getClientServerByEmail(email) {
      let server = {
        host: '',
        port: 993
      };
      console.log(email);
      let domain = email.split("@")[1];
      switch (domain) {
        case 'qq.com':
          server.host = 'imap.qq.com';
          break;
        case '163.com':
          server.host = 'imap.qq.com';
          break;
        case '126.com':
          server.host = 'imap.qq.com';
          break;
        case 'gmail.com':
          server.host = 'imap.qq.com';
          break;
        case 'aliyun.com':
          server.host = 'imap.qq.com';
          break;
        case 'foxmail.com':
          server.host = 'imap.qq.com';
          break;
        default:
          server.host = 'imap.' + domain;
      }
      return server;
    }

    async getBoxes(user) {
      // let user = {
      //   user: user['email'],
      //   password: user['password'],
      //   host: 'imap.qq.com',
      //   port: 993,
      //   tls: true
      // };
      let imap = this.getClient(user);
      return new Promise((resolve, reject) => {
        imap.once('ready', function () {
          imap.getBoxes(function (err, boxes) {
            if (err) {
              reject(err);
            }
            imap.end();
            resolve(boxes);
          });
        });
        imap.once('error', function (err) {
          console.log(err);
        });

        imap.once('end', function () {
          console.log('Connection ended');
        });
        imap.connect();
      });
    }

    //获取需要抓取的邮箱
    async getAllBoxFolders(user) {
      let boxes = await this.getBoxes(user);

      let boxList = [];
      for (let key in boxes) {
        if (boxes[key]['children'] != null) {
          for (let ckey in boxes[key]['children']) {
            boxList.push(key + "/" + ckey);
          }
        } else {
          boxList.push(key);
        }
      }
      return boxList;
    }

    async getAllInboxFolder(user) {
      let boxFolders = await this.getAllBoxFolders(user);
      let explode = [
        "Sent Messages",
        "Drafts",
        "Deleted Messages",
        "Junk"
      ];
      let inboxFolders = [];
      for (let key in boxFolders) {
        if (explode.indexOf(boxFolders[key]) < 0) {
          inboxFolders.push(boxFolders[key]);
        }
      }
      return inboxFolders;
    }

    async search(user, folder) {
      let client = this.getClient(user);

      function openInbox(folder, cb) {
        if (typeof folder === "function") {
          cb = folder;
          folder = "INBOX";
        }
        if (!folder) {
          folder = "INBOX";
        }
        client.openBox(folder, true, cb);
      }
      return new Promise((resolve, reject) => {

        client.once('ready', function () {
          client.openBox(folder, true, function (err, box) {
            if (err) throw err;
            client.search(['ALL', ['SINCE', 'Feb 30, 2018']], function (err, results) {//搜寻2017-05-20以后未读的邮件
              if (err) throw err;

              console.log(results);

              var f = imap.fetch(results, {bodies: ''});//抓取邮件（默认情况下邮件服务器的邮件是未读状态）

              f.on('message', function (msg, seqno) {

                var mailparser = new MailParser();

                msg.on('body', function (stream, info) {

                  stream.pipe(mailparser);//将为解析的数据流pipe到mailparser

                  //邮件头内容
                  mailparser.on("headers", function (headers) {
                    console.log("邮件头信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                    console.log("邮件主题: " + headers.get('subject'));
                    console.log("发件人: " + headers.get('from').text);
                    console.log("收件人: " + headers.get('to').text);
                  });

                  //邮件内容

                  mailparser.on("data", function (data) {
                    if (data.type === 'text') {//邮件正文
                      console.log("邮件内容信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                      // console.log("邮件内容: " + data.html);
                    }
                    if (data.type === 'attachment') {//附件
                      console.log("邮件附件信息>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                      console.log("附件名称:" + data.filename);//打印附件的名称
                      // data.content.pipe(fs.createWriteStream(data.filename));//保存附件到当前目录下
                      // data.release();
                    }
                  });

                });
                msg.once('end', function () {
                  console.log(seqno + '完成');
                });
              });
              f.once('error', function (err) {
                console.log('抓取出现错误: ' + err);
              });
              f.once('end', function () {
                console.log('所有邮件抓取完成!');
                client.end();
              });
            });
          });
        });
        client.once('error', function (err) {
          console.log(err);
        });

        client.once('end', function () {
          console.log('Connection ended');
        });

        client.connect();
      });
    }
    async getAllInboxMails(user, options) {
      let boxes = await this.getAllInboxFolder(user);
      let emails = [];
      for(let k in boxes){
        app.logger.debug(boxes[k]);
        emails = emails.concat(await this.getTargetInboxMails(this.getClient(user), boxes[k], options));
      }
      return emails;
    }
    async getDefaultInboxMails(client, options) {
      return await this.getTargetInboxMails(client, "INBOX", options);
    }
    getTargetInboxMails(client, inbox, options){
      let day = 31;
      if(options !== undefined && options['day']){
        day = options.day;
      }
      let since = moment().subtract(day, 'days').format('LL');
      let mails = [];

      // imap.once('ready', function() {
      //   openInbox(function(err, box) {
      //     if (err) throw err;
      //     var f = imap.seq.fetch(box.messages.total + ':*', {
      //       bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      //       struct: true
      //     });
      //     f.on('message', function(msg, seqno) {
      //       console.log('Message #%d', seqno);
      //       var prefix = '(#' + seqno + ') ';
      //       msg.on('body', function(stream, info) {
      //         var buffer = '';
      //         stream.on('data', function(chunk) {
      //           buffer += chunk.toString('utf8');
      //         });
      //         stream.once('end', function() {
      //           console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
      //         });
      //       });
      //       msg.once('attributes', function(attrs) {
      //         // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      //       });
      //       msg.once('end', function() {
      //         console.log(prefix + 'Finished');
      //       });
      //     });
      //     f.once('error', function(err) {
      //       console.log('Fetch error: ' + err);
      //     });
      //     f.once('end', function() {
      //       console.log('Done fetching all messages!');
      //       imap.end();
      //     });
      //   });
      // });
      // let email = {
      //   'headers':{},
      //   'subject':'',
      //   'from':'',
      //   'date':'',
      //   'to':'',
      //   'body':'',
      //   'attachments':[],
      // };
      return new Promise((resolve, reject) => {
        client.once('ready', function () {
          client.openBox(inbox, true, function (err, box) {
            if (err) throw err;
            client.search(['ALL', ['SINCE', since]], function (err, results) {//搜寻2017-05-20以后所有的邮件
              if (err) throw err;
              if(results.length === 0){
                resolve([]);
                client.end();
                return;
              }
              let f = client.fetch(results, {bodies: ''});//抓取邮件（默认情况下邮件服务器的邮件是未读状态）
              f.on('message', function (msg, seqno) {
                msg.on('body', function (stream, info) {
                  //第一种方案：一个函数搞定，但是不能对附件忽略，耗时比较久
                  simpleParser(stream).then(mail => {
                    mail.attachments = [];
                    mails.push(mail);
                  }).catch(err => {
                    app.logger.error(err);
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
                msg.once('end', function () {
                  app.logger.debug(seqno + '完成');
                });
              });
              f.once('error', function (err) {
                app.logger.error('fetch email error: ' + err);
                reject(err);
              });
              f.once('end', function () {
                app.logger.debug('all email fetch finish!');
                client.end();
              });
            });
          });
        });

        client.once('error', function (err) {
          app.logger.error(err);
          reject(err);
        });

        client.once('end', function () {
          app.logger.debug(inbox+"-所有邮件抓取完成:" + mails.length);
          resolve(mails.reverse());
        });

        client.connect();
      });
    }
    getRecentEmails(user, day) {
      let since = moment().subtract(day, 'days').format('LL');
      let mails = [];
      let client = this.getClient(user);
      // imap = new Imap({
      //   user: 'sunguide@aliyun.com',
      //   password: 'woshini8',
      //   host: 'imap.aliyun.com',
      //   port: 993,
      //   tls: true
      // });
      function openInbox(cb) {
        client.openBox(folder, true, cb);
      }

      // imap.once('ready', function() {
      //   openInbox(function(err, box) {
      //     if (err) throw err;
      //     var f = imap.seq.fetch(box.messages.total + ':*', {
      //       bodies: 'HEADER.FIELDS (FROM TO SUBJECT DATE)',
      //       struct: true
      //     });
      //     f.on('message', function(msg, seqno) {
      //       console.log('Message #%d', seqno);
      //       var prefix = '(#' + seqno + ') ';
      //       msg.on('body', function(stream, info) {
      //         var buffer = '';
      //         stream.on('data', function(chunk) {
      //           buffer += chunk.toString('utf8');
      //         });
      //         stream.once('end', function() {
      //           console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
      //         });
      //       });
      //       msg.once('attributes', function(attrs) {
      //         // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      //       });
      //       msg.once('end', function() {
      //         console.log(prefix + 'Finished');
      //       });
      //     });
      //     f.once('error', function(err) {
      //       console.log('Fetch error: ' + err);
      //     });
      //     f.once('end', function() {
      //       console.log('Done fetching all messages!');
      //       imap.end();
      //     });
      //   });
      // });
      // let email = {
      //   'headers':{},
      //   'subject':'',
      //   'from':'',
      //   'date':'',
      //   'to':'',
      //   'body':'',
      //   'attachments':[],
      // };
      return new Promise((resolve, reject) => {
        client.once('ready', function () {
          openInbox(function (err, box) {
            if (err) throw err;
            client.search(['ALL', ['SINCE', since]], function (err, results) {//搜寻2017-05-20以后所有的邮件
              if (err) throw err;
              let f = client.fetch(results, {bodies: ''});//抓取邮件（默认情况下邮件服务器的邮件是未读状态）
              f.on('message', function (msg, seqno) {
                msg.on('body', function (stream, info) {
                  //第一种方案：一个函数搞定，但是不能对附件忽略，耗时比较久
                  simpleParser(stream).then(mail => {
                    mail.attachments = [];
                    mails.push(mail);
                  }).catch(err => {
                    app.logger.error(err);
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
                msg.once('end', function () {
                  app.logger.debug(seqno + '完成');
                });
              });
              f.once('error', function (err) {
                app.logger.error(err);
                reject(err);
              });
              f.once('end', function () {
                client.end();
              });
            });
          });
        });

        client.once('error', function (err) {
          app.logger.error(err);
          reject(err);
        });

        client.once('end', function () {
          app.logger.debug('Connection ended');
          resolve(mails.reverse());
        });

        client.connect();
      });
    }
  }
  return mail;
};
