'use strict';
const cheerio = require('cheerio');
const fs = require('fs');
module.exports = app => {
    class bill extends app.Service {
        constructor(ctx) {
            super(ctx);
        }

    }

    return bill;
};
