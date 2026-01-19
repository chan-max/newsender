// 配置文件
module.exports = {
    // 飞书Webhook地址（请替换为你的实际webhook地址）
    feishuWebhook: process.env.FEISHU_WEBHOOK || 'https://open.feishu.cn/open-apis/bot/v2/hook/77213058-0955-487d-8376-863ca5845ab4',
    
    // 请求超时时间（毫秒）
    timeout: 10000,
    
    // 重试次数
    retryTimes: 3,
    
    // 重试间隔（毫秒）
    retryDelay: 1000,
    
    // AI配置
    ai: {
        enabled: true, // 是否启用AI整理
        model: 'free-qwen',
        apiKey: 'sk-6b30d334c13b4995a85400958e7f1ea7',
        baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        modelName: 'qwen-vl-max-latest',
        maxTokens: 4096,
        temperature: 0.7
    }
};
