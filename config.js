// 配置文件
module.exports = {
    // 飞书Webhook地址（请替换为你的实际webhook地址）
    // 优先级：环境变量 > 默认值
    feishuWebhook: process.env.FEISHU_WEBHOOK || 'https://open.feishu.cn/open-apis/bot/v2/hook/77213058-0955-487d-8376-863ca5845ab4',
    
    // 请求超时时间（毫秒）
    timeout: parseInt(process.env.TIMEOUT) || 10000,
    
    // 重试次数
    retryTimes: parseInt(process.env.RETRY_TIMES) || 3,
    
    // 重试间隔（毫秒）
    retryDelay: parseInt(process.env.RETRY_DELAY) || 1000,
    
    // AI配置
    ai: {
        enabled: process.env.AI_ENABLED !== 'false', // 默认启用，可通过环境变量禁用
        model: process.env.AI_MODEL || 'free-qwen',
        apiKey: process.env.AI_API_KEY || 'sk-6b30d334c13b4995a85400958e7f1ea7',
        baseURL: process.env.AI_BASE_URL || 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        modelName: process.env.AI_MODEL_NAME || 'qwen-vl-max-latest',
        maxTokens: parseInt(process.env.AI_MAX_TOKENS) || 4096,
        temperature: parseFloat(process.env.AI_TEMPERATURE) || 0.7
    }
};
