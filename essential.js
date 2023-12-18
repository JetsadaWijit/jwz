const fs = require('fs');
const path = require('path');

function readPropertiesFile(filePath) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n');
    const config = {};

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && trimmedLine.includes('=')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim();
        config[key.trim()] = value;
        }
    });

    return config;
}

function replacePlaceholders(url, replacements) {
    for (const placeholder in replacements) {
        const placeholderValue = replacements[placeholder];
        url = url.replace(new RegExp(`\\$\\{${placeholder}\\}`, 'g'), placeholderValue);
    }
    return url;
}

module.exports = { 
    // Essential
    readPropertiesFile,
    replacePlaceholders
}