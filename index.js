
'use strict';

const debug = require('debug')('koa-weixin-token');
const Weixin = require('./weixin');

exports = module.exports = (opt) => {
  var weixin = new Weixin(opt);

  debug('options', opt);

  return function* weixinToken(next){
    define(this);
    yield* next;
  };

  function define(ctx){
    var context = ctx.context || ctx
    var response = ctx.response
    var request = ctx.request

    context.__defineGetter__('weixinToken', function () {
      return weixin.getToken();
    })

    response.__defineGetter__('weixinToken', function () {
      return this.ctx.weixinToken;
    })
    
    context.__defineGetter__('weixinJsApiTicket', function () {
      return weixin.getTicket();
    })

    response.__defineGetter__('weixinJsApiTicket', function () {
      return this.ctx.weixinJsApiTicket;
    })
  }
};