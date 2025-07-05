/**
 * @fileoverview Library for interacting with the OpenRouter API.
 * Provides askAi, getCompletion, and getTokenUsage functions.
 */

const https = require('https');

/**
 * Sends a chat completion request to the OpenRouter API.
 * 
 * @param {string} model - The model name (e.g., 'openai/gpt-3.5-turbo', 'google/gemini-pro', etc).
 * @param {string} token - OpenRouter API key (starts with 'org-...').
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
        hostname: 'openrouter.ai',
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'HTTP-Referer': 'https://github.com/JetsadaWijit/npmjs', // Replace with your domain for OpenRouter TOS compliance
            'X-Title': 'Npmjs Library'
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
 * @param {Object} json - The full JSON response from OpenRouter.
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
 * @param {Object} json - The full JSON response from OpenRouter.
 * @returns {number} Total tokens used, or 0 if not found.
 */
function getTokenUsage(json) {
    if (json && json.usage && typeof json.usage.total_tokens === 'number') {
        return json.usage.total_tokens;
    }
    return 0;
}

module.exports = { askAi, getCompletion, getTokenUsage };
