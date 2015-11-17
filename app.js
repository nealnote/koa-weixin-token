
'use strict';

const Koa = require('koa');
const app = new Koa();

const weixin = require('./index');

var config = {
  appid: process.env.WEIXIN_APPID || '',
  secret: process.env.WEIXIN_SECRET || '',
  port: process.env.PORT || 3000
};

app.use(weixin({
  appid: config.appid,
  secret: config.secret
}));

app.use(function* (){
  this.body = {
    token: this.weixinToken,
    jsapiTicket: this.weixinJsApiTicket
  };
});

app.listen(config.port);
