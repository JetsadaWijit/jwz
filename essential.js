const fs = require('fs');

function readPropertiesFile(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Properties file not found: ${filePath}`);
    }

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
        url = url.replace(new RegExp(`\\$\\{${placeholder}\\}`, 'g'), replacements[placeholder]);
    }
    return url;
}

module.exports = { readPropertiesFile, replacePlaceholders };
