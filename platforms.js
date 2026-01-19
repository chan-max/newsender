// 各平台热搜配置
const weibo = require('./platforms/weibo');
const douyin = require('./platforms/douyin');
const zhihu = require('./platforms/zhihu');
const bilibili = require('./platforms/bilibili');
const ks = require('./platforms/ks');
const toutiao = require('./platforms/toutiao');
const douban = require('./platforms/douban');

const PLATFORMS = {
    weibo,
    douyin,
    zhihu,
    bilibili,
    ks,
    toutiao,
    douban
};

module.exports = PLATFORMS;
