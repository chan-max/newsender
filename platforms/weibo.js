module.exports = {
    name: '微博',
    url: 'https://weibo.com/ajax/side/hotSearch',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://weibo.com/',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
        'Connection': 'keep-alive',
    },
    parser: function(data) {
        try {
            if (data && data.ok === 1 && data.data && Array.isArray(data.data.realtime)) {
                return data.data.realtime.slice(0, 20).map((item, index) => ({
                    title: item.word || item.word_scheme,
                    hot: item.num || item.realpos,
                    rank: index + 1
                }));
            }
            if (data && data.data && data.data.realtime && Array.isArray(data.data.realtime)) {
                return data.data.realtime.slice(0, 20).map((item, index) => ({
                    title: item.word || item.word_scheme,
                    hot: item.num || item.realpos,
                    rank: index + 1
                }));
            }
            return [];
        } catch (error) {
            console.error('微博热搜解析错误:', error);
            return [];
        }
    },
    enabled: true
};
