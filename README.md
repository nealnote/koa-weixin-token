# Koa weixin-token

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]


weixin-token for koa.

## Install

```
npm install koa-weixin-token
```

## API

```js
app.use(require('koa-weixin-token')({
  appid: 'YOUR_WEIXIN_APPID',
  secret: 'YOUR_WEIXIN_SECRET'
}));
```

### this.weixinToken/weixinJsApiTicket

```js
app.use(funciton* (){
  this.body = {
    token: this.weixinToken,
    jsapiTicket: this.weixinJsApiTicket
  };
});
```

[npm-url]: https://npmjs.org/package/koa-weixin-token
[github-url]: https://github.com/nealnote/koa-weixin-token