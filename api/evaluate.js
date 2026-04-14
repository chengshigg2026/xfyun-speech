/**
 * 科大讯飞语音评测 API - Vercel Serverless Function
 * 部署到 Vercel 后可直接调用
 */

const crypto = require('crypto');

// 科大讯飞配置
const XFYUN_CONFIG = {
    appId: '355b5e24',
    apiKey: '2b589db91bc92b619687f24ce17fd971',
    apiSecret: 'NGQwMDllM2IyZGRjZWZlMjBhYmZhZWRk',
    host: 'ise-api.xfyun.cn',
    path: '/v2/open-ise'
};

// 生成鉴权URL
function generateAuthUrl() {
    const date = new Date().toUTCString();
    
    const signatureOrigin = `host: ${XFYUN_CONFIG.host}\ndate: ${date}\nGET ${XFYUN_CONFIG.path} HTTP/1.1`;
    const signature = crypto
        .createHmac('sha256', XFYUN_CONFIG.apiSecret)
        .update(signatureOrigin)
        .digest('base64');
    
    const authorizationOrigin = `api_key="${XFYUN_CONFIG.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authorization = Buffer.from(authorizationOrigin).toString('base64');
    
    const url = `wss://${XFYUN_CONFIG.host}${XFYUN_CONFIG.path}?host=${XFYUN_CONFIG.host}&date=${encodeURIComponent(date)}&authorization=${encodeURIComponent(authorization)}`;
    
    return url;
}

// CORS 头
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
};

export default async function handler(req, res) {
    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(200, corsHeaders);
        res.end();
        return;
    }

    // 健康检查
    if (req.method === 'GET') {
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify({ 
            status: 'ok', 
            service: '科大讯飞语音评测API',
            timestamp: new Date().toISOString()
        }));
        return;
    }

    // POST 评测请求
    if (req.method === 'POST') {
        try {
            const body = req.body || {};
            const { audio, text } = body;

            if (!audio || !text) {
                res.writeHead(400, corsHeaders);
                res.end(JSON.stringify({ error: '缺少音频或文本参数' }));
                return;
            }

            // 生成鉴权URL
            const wsUrl = generateAuthUrl();
            
            // 由于 Vercel Serverless 不支持 WebSocket 长连接
            // 我们返回鉴权URL，让前端直接连接科大讯飞
            res.writeHead(200, corsHeaders);
            res.end(JSON.stringify({
                wsUrl: wsUrl,
                appId: XFYUN_CONFIG.appId,
                text: text,
                audio: audio
            }));

        } catch (error) {
            console.error('API错误:', error);
            res.writeHead(500, corsHeaders);
            res.end(JSON.stringify({ error: error.message }));
        }
        return;
    }

    res.writeHead(405, corsHeaders);
    res.end(JSON.stringify({ error: 'Method not allowed' }));
}
