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

## Usage Options

### Basic redirect

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

### Redirect with custom status code

```js
var connect = require('connect');
var redirects = require('superstatic-redirects');

var app = connect();

app.use(redirects({
  '/some-url': {
    status: 302,
    url: '/redirect-url'
  }
}));

http.createServer(app).listen(3000, function (err) {
  
});
```

### Segmented value redirect

Any value in the url that begins with a `:` will be considered a segment. This segment will replace the same value in the redirect url. This usage also works like the cusotm status codes example.

```js
var connect = require('connect');
var redirects = require('superstatic-redirects');

var app = connect();

app.use(redirects({
  // "/old/test/path/here" would redirect to "/new/test/path/here"
  '/old/:value/path/:loc': '/new/:value/path/:loc'
}));

http.createServer(app).listen(3000, function (err) {
  
});
```

## Run Tests

```
npm install
npm test
```
