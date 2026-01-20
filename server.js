const express = require('express');
const chalk = require('chalk');
const HotSearchCrawler = require('./main');

const app = express();
const PORT = process.env.PORT || 1575;

// 中间件
app.use(express.json());

// 健康检查接口
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        service: 'newsender'
    });
});

// 获取热搜数据（不发送到飞书）
app.get('/api/hotsearch', async (req, res) => {
    try {
        console.log(chalk.blue('📊 收到获取热搜请求'));
        const crawler = new HotSearchCrawler();
        await crawler.fetchAllPlatforms();
        
        const response = {
            success: true,
            timestamp: new Date().toISOString(),
            data: crawler.results,
            summary: {
                total: crawler.results.length,
                success: crawler.results.filter(r => r.success).length,
                failed: crawler.errors.length,
                duration: Date.now() - crawler.startTime
            }
        };
        
        res.json(response);
    } catch (error) {
        console.error(chalk.red('❌ 获取热搜失败:'), error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 获取热搜数据并发送到飞书（使用 AI，如果启用）
app.get('/api/hotsearch/send', async (req, res) => {
    try {
        console.log(chalk.blue('📤 收到发送热搜到飞书请求'));
        const crawler = new HotSearchCrawler();
        await crawler.fetchAllPlatforms();
        
        // 发送到飞书
        const sendSuccess = await crawler.sendToFeishu();
        
        const response = {
            success: sendSuccess,
            timestamp: new Date().toISOString(),
            data: crawler.results,
            message: sendSuccess ? '热搜数据已成功发送到飞书' : '热搜数据获取成功，但发送到飞书失败',
            summary: {
                total: crawler.results.length,
                success: crawler.results.filter(r => r.success).length,
                failed: crawler.errors.length,
                duration: Date.now() - crawler.startTime
            }
        };
        
        res.status(sendSuccess ? 200 : 500).json(response);
    } catch (error) {
        console.error(chalk.red('❌ 发送热搜失败:'), error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 获取热搜数据并发送原始信息到飞书（不使用 AI）
app.get('/api/hotsearch/send/raw', async (req, res) => {
    try {
        console.log(chalk.blue('📤 收到发送原始热搜到飞书请求（不使用 AI）'));
        const crawler = new HotSearchCrawler();
        await crawler.fetchAllPlatforms();
        
        // 发送原始消息到飞书（不使用 AI）
        const sendSuccess = await crawler.sendToFeishuRaw();
        
        const response = {
            success: sendSuccess,
            timestamp: new Date().toISOString(),
            data: crawler.results,
            message: sendSuccess ? '热搜原始数据已成功发送到飞书' : '热搜数据获取成功，但发送到飞书失败',
            summary: {
                total: crawler.results.length,
                success: crawler.results.filter(r => r.success).length,
                failed: crawler.errors.length,
                duration: Date.now() - crawler.startTime
            }
        };
        
        res.status(sendSuccess ? 200 : 500).json(response);
    } catch (error) {
        console.error(chalk.red('❌ 发送原始热搜失败:'), error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 触发完整流程（兼容原有功能）
app.get('/api/run', async (req, res) => {
    try {
        console.log(chalk.blue('🚀 收到运行完整流程请求'));
        const crawler = new HotSearchCrawler();
        await crawler.run();
        
        res.json({
            success: true,
            message: '热搜数据获取并发送完成',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error(chalk.red('❌ 运行失败:'), error.message);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// 根路径
app.get('/', (req, res) => {
    res.json({
        service: 'Newsender - 热搜获取并发送到飞书',
        version: '1.0.0',
        endpoints: {
            'GET /health': '健康检查',
            'GET /api/hotsearch': '获取热搜数据（不发送）',
            'GET /api/hotsearch/send': '获取热搜数据并发送到飞书（使用 AI，如果启用）',
            'GET /api/hotsearch/send/raw': '获取热搜数据并发送原始信息到飞书（不使用 AI）',
            'GET /api/run': '运行完整流程（获取并发送）'
        },
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(chalk.green(`\n🚀 Newsender 服务已启动`));
    console.log(chalk.gray(`📍 服务地址: http://localhost:${PORT}`));
    console.log(chalk.gray(`📊 API 文档: http://localhost:${PORT}/\n`));
});

// 处理未捕获的错误
process.on('unhandledRejection', (error) => {
    console.error(chalk.red('未处理的 Promise 拒绝:'), error);
});

process.on('uncaughtException', (error) => {
    console.error(chalk.red('未捕获的异常:'), error);
    process.exit(1);
});
