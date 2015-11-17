# Koa weixin-token

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