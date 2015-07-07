var express     = require('express');
var app         = express();
var middlewares = require('express-middlewares-js');
app.use('/weixin', middlewares.xmlBodyParser({
    type : 'text/xml'
}));

/*
 Alternative way

 var xmlBodyParser = require('express-xml-parser');
 app.use('/weixin', xmlBodyParser({
 type: 'text/xml',
 limit: '1mb'
 }));

 */

var Wechat = require('nodejs-wechat');
var opt    = {
    token : "tjpu-roc",
    url   : '/weixin'
};
var wechat = new Wechat(opt);

app.get('/weixin', wechat.verifyRequest.bind(wechat));
app.post('/weixin', wechat.handleRequest.bind(wechat));

// you can also work with other restful routes
app.use('/api', middlewares.bodyParser());
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
wechat.on('text', function (session) {
    console.log(session);
    session.replyTextMsg('Hello World');
});
wechat.on('image', function (session) {
    session.replyNewsMsg([{
        Title       : '新鲜事',
        Description : '点击查看今天的新鲜事',
        PicUrl      : 'http://..',
        Url         : 'http://..'
    }]);
});
wechat.on('voice', function (session) {
    session.replyMsg({
        Title        : 'This is Music',
        MsgType      : 'music',
        Description  : 'Listen to this music and guess ths singer',
        MusicUrl     : 'http://..',
        HQMusicUrl   : 'http://..',
        ThumbMediaId : '..'
    });
});

module.exports = app;
//app.listen(8080);