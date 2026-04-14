/**
 * 科大讯飞语音评测 API - Vercel Serverless Function
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

module.exports = async function handler(req, res) {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理 OPTIONS 预检请求
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // 健康检查
    if (req.method === 'GET') {
        return res.status(200).json({ 
            status: 'ok', 
            service: '科大讯飞语音评测API',
            timestamp: new Date().toISOString()
        });
    }

    // POST 评测请求
    if (req.method === 'POST') {
        try {
            const body = req.body || {};
            const { audio, text } = body;

            if (!audio || !text) {
                return res.status(400).json({ error: '缺少音频或文本参数' });
            }

            // 生成鉴权URL
            const wsUrl = generateAuthUrl();
            
            // 返回鉴权URL，让前端直接连接科大讯飞
            return res.status(200).json({
                wsUrl: wsUrl,
                appId: XFYUN_CONFIG.appId,
                text: text,
                audio: audio
            });

        } catch (error) {
            console.error('API错误:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
