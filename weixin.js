'use strict';

/**
 * Module dependencies.
 */
const Emitter = require('events');
const Url = require('url');

const request = require('co-request');
const debug = require('debug')('weixin:token');

const defaultExpires = 7200; // default 7200 sec
const beforeExpires = 100; // before expires 100sec update token

class Weixin extends Emitter {
  /**
   * Initialize
   */
  constructor(opts) {
    super();

    opts = Object.assign({
      'intval': 20, // retry time 20sec
    }, opts);

    debug('weixin.options', opts);

    this.appid = opts.appid || '';
    this.secret = opts.secret || '';

    this.intval = opts.intval;
    this._timer = null;
    this.updateToken();
  }

  _parseUrl(url, query) {
    return Url.format( Object.assign(Url.parse(url), {'query': query}) );
  }
  /**
   * TODO: check signature
   *
   * @return {Boolean}
   */
  checkSignature() {
    return true;
  }

  updateToken() {
    var context = this;
    var data = {
      'grant_type': 'client_credential',
      'appid': this.appid,
      'secret': this.secret
    };
    var setTimer = (() => {
      // error retry in 20s
      context._timer = setTimeout(() => {
        context.updateToken();
      }, context.intval * 1000);
    });
    var url = context._parseUrl('https://api.weixin.qq.com/cgi-bin/token', data);

    return request({
      method: 'GET',
      url: url
    }).then((response) => {
      var ret = JSON.parse(response.body);

      if( response.body && response.body.length && !ret.errcode ) {
        debug('updateToken', ret);
        context._setToken(ret);
      }else{
        setTimer()
      }
    }, (err) => {
      setTimer()
    });
  }

  _setToken(data) {
    data = data || {};

    var context = this;
    var token = data.access_token || '';
    var expires = data.expires_in || defaultExpires;
    var timer = (expires - beforeExpires) * 1000;

    context.token = token;
    context.expires = Date.now() + (expires * 1000);

    context.emit('token', token, expires);
    // update token before token expire
    context._timer = setTimeout(() => {
      context.updateToken()
    }, timer);

    context.updateTicket();
  }

  getToken() {
    return this.token;
  }

  getTicket() {
    return this.ticket;
  }

  updateTicket() {
    var context = this;
    var data = {
      'access_token': context.getToken(),
      'type': 'jsapi'
    };
    var setTimer = (() => {
      // error retry in 20s
      context._jsapiTimer = setTimeout(() => {
        context.updateTicket()
      }, context.intval * 1000);
    });
    var url = context._parseUrl('https://api.weixin.qq.com/cgi-bin/ticket/getticket', data);

    return request({
      method: 'GET',
      url: url
    }).then((response) => {
      var ret = JSON.parse(response.body);
      var token;
      var expires;

      if( response.body && response.body.length && !ret.errcode ) {
        debug('updateTicket', ret);

        token = ret.ticket || '';
        expires = ret.expires_in || defaultExpires;

        context.ticket = token;
        context.emit('ticket', token, expires);

      }else{
        setTimer()
      }
    }, (err) => {
      setTimer()
    });
  }
};

module.exports = Weixin;

