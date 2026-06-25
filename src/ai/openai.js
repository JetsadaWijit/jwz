/**
 * @fileoverview Library for interacting with the OpenAI API.
 * Provides askAi, getCompletion, and getTokenUsage functions.
 */

const https = require('https');

/**
 * Sends a chat completion request to the OpenAI API.
 * 
 * @param {string} model - The model name (e.g., 'gpt-4o').
 * @param {string} token - OpenAI API key.
 * @param {string} systemPrompt - System message for context.
 * @param {string} message - User message.
 * @returns {Promise<Object>} Resolves with the full JSON response.
 */
async function askAi(model, token, systemPrompt, message) {
    /** @private {string} */
    const data = JSON.stringify({
        model: model,
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
        ]
    });

    /** @private {Object} */
    const options = {
        hostname: 'api.openai.com',
        path: '/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            /** @private {string} */
            let body = '';
            res.on('data', (chunk) => { body += chunk; });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (err) {
                    reject(err);
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

/**
 * Extracts the AI completion message from the API response.
 * 
 * @param {Object} json - The full JSON response from OpenAI.
 * @returns {string} The completion text or empty string if not found.
 */
function getCompletion(json) {
    if (json && json.choices && json.choices[0] && json.choices[0].message) {
        return String(json.choices[0].message.content || '');
    }
    return '';
}

/**
 * Extracts the total token usage from the API response.
 * 
 * @param {Object} json - The full JSON response from OpenAI.
 * @returns {number} Total tokens used, or 0 if not found.
 */
function getTokenUsage(json) {
    if (json && json.usage && typeof json.usage.total_tokens === 'number') {
        return json.usage.total_tokens;
    }
    return 0;
}

module.exports = { askAi, getCompletion, getTokenUsage };
