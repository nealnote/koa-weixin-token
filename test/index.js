
'use strict';

const supertest = require('supertest');
const should = require('should');
const koa = require('koa');

const weixin = require('../');

describe('Weixin Token', () => {
  var app = App();

  app.use(function* (next) {
    this.body = {
      token: this.weixinToken,
      jsapiTicket: this.weixinJsApiTicket
    };
  });

  var request = supertest.agent(app.listen())

  describe('shold assert', () => {
    it('when no appid&secret supplied', (done) => {
      request
      .get('/')
      .expect(200)
      .end((err, res) => {
        should.not.exists(err);
        res.text.should.equal('{}');
        done();
      })
    });
  });
});

function App(){
  var app = koa();
  app.use(weixin())
  return app;
}