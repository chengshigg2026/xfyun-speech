const crypto = require('crypto');

const XFYUN_CONFIG = {
    appId: '355b5e24',
    apiKey: '2b589db91bc92b619687f24ce17fd971',
    apiSecret: 'NGQwMDllM2IyZGRjZWZlMjBhYmZhZWRk',
    host: 'ise-api.xfyun.cn',
    path: '/v2/open-ise'
};

function generateAuthUrl() {
    const date = new Date().toUTCString();
    const signatureOrigin = `host: ${XFYUN_CONFIG.host}\ndate: ${date}\nGET ${XFYUN_CONFIG.path} HTTP/1.1`;
    const signature = crypto.createHmac('sha256', XFYUN_CONFIG.apiSecret).update(signatureOrigin).digest('base64');
    const authorizationOrigin = `api_key="${XFYUN_CONFIG.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;
    const authorization = Buffer.from(authorizationOrigin).toString('base64');
    return `wss://${XFYUN_CONFIG.host}${XFYUN_CONFIG.path}?host=${XFYUN_CONFIG.host}&date=${encodeURIComponent(date)}&authorization=${encodeURIComponent(authorization)}`;
}

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json({ status: 'ok', service: '科大讯飞语音评测API' });
    }

    if (req.method === 'POST') {
        try {
            const { audio, text } = req.body || {};
            if (!audio || !text) {
                return res.status(400).json({ error: '缺少参数' });
            }
            const wsUrl = generateAuthUrl();
            return res.status(200).json({ wsUrl, appId: XFYUN_CONFIG.appId, text, audio });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
