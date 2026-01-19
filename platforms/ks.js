module.exports = {
    name: '快手',
    url: 'https://www.kuaishou.com/?isHome=1',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://www.kuaishou.com/'
    },
    parser: function(html) {
        try {
            const items = [];
            // 提取 VisionHotRankItem 数据
            const itemRegex = /"VisionHotRankItem:([^"]+)":\s*({[^}]*"rank":[^}]*"id":[^}]*"name":[^}]*"hotValue":[^}]*})/g;
            let match;

            while ((match = itemRegex.exec(html))) {
                try {
                    const jsonStr = match[2];
                    const cleanJson = jsonStr
                        .replace(/\\u002F/g, '/')
                        .replace(/([a-zA-Z_][a-zA-Z0-9_]*):/g, '"$1":')
                        .replace(/,\s*}/g, '}');

                    const obj = JSON.parse(cleanJson);
                    items.push({
                        name: obj.name || obj.id,
                        title: obj.name || obj.id,
                        hot: obj.hotValue,
                        rank: obj.rank + 1
                    });
                } catch (e) {
                    // 简单解析方式
                    const rankMatch = match[2].match(/"rank":\s*(\d+)/);
                    const nameMatch = match[2].match(/"name":\s*"([^"]+)"/);
                    const hotMatch = match[2].match(/"hotValue":\s*"([^"]+)"/);

                    if (rankMatch && nameMatch) {
                        items.push({
                            name: nameMatch[1],
                            title: nameMatch[1],
                            hot: hotMatch ? hotMatch[1] : null,
                            rank: parseInt(rankMatch[1]) + 1
                        });
                    }
                }
            }

            items.sort((a, b) => a.rank - b.rank);
            return items.slice(0, 10);
        } catch (error) {
            console.error('快手热搜解析错误:', error);
            return [];
        }
    },
    enabled: true
};
