'use strict';
const cheerio = require('cheerio');
const request = require('superagent');
const MailParser = require("mailparser").MailParser

module.exports = app => {
    class bill extends app.Service {
        constructor(ctx) {
            super(ctx);
        }
        async getRecent30DayBills() {

        }
    }

    return bill;
};
