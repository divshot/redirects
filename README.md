# superstatic-redirects

Superstatic custom redirects middleware

## Install

```
npm install superstatic-redirects --save
```

## Usage

As a Connect/Express middleware

```js
var connect = require('connect');
var redirects = require('superstatic-redirects');

var app = connect();

app.use(redirects({
  '/some-url': '/redirected-url'  
}));

http.createServer(app).listen(3000, function (err) {
  
});
```

In Superstatic

```js
var superstatic = require('superstatic');

var app = superstatic({
  // this config object can also just be the superstatic.json file
  // See https://github.com/divshot/superstatic#configuration
  config: {
    redirects: {
      '/some-url': '/redirect-url'
    }
  }
});

app.listen(3000, function (err) {
  
});
```

## Run Tests

```
npm install
npm test
```
