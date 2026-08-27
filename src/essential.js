const fs = require('fs');

/** The only transport this package will send a credential over. */
const REQUIRED_PROTOCOL = 'https:';

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

/**
 * Asserts that an endpoint is https, and returns it unchanged.
 *
 * Every request this package makes carries the caller's credential, so a request
 * sent over http would transmit that credential in cleartext. Endpoints are read
 * at call time from a properties file that ships inside the package, so this is
 * checked rather than assumed. A downgraded endpoint fails loudly here instead of
 * succeeding silently on the wire.
 *
 * @function requireHttpsUrl
 * @param {string} url - The endpoint to check.
 * @param {string} key - The properties key it came from, used in the error message.
 * @returns {string} The URL, unchanged, when it is https.
 * @throws {Error} If the URL is unparseable or its protocol is not https.
 */
function requireHttpsUrl(url, key) {
    let protocol;

    try {
        protocol = new URL(url).protocol;
    } catch (error) {
        throw new Error(`Endpoint "${key}" is not a valid URL.`);
    }

    if (protocol !== REQUIRED_PROTOCOL) {
        throw new Error(
            `Endpoint "${key}" must use https, but resolved to "${protocol}". ` +
            'Refusing to send the request, because it would transmit the credential in cleartext.'
        );
    }

    return url;
}

/**
 * Substitutes placeholders into an endpoint template and asserts the result is https.
 *
 * This is the request boundary: it checks the URL that is actually handed to the
 * HTTP client, so neither an edited properties file nor a substituted value can
 * downgrade the transport unnoticed.
 *
 * @function resolveSecureUrl
 * @param {string} template - The endpoint template from the properties file.
 * @param {Object} replacements - Placeholder names mapped to their values.
 * @param {string} key - The properties key the template came from.
 * @returns {string} The resolved https URL.
 * @throws {Error} If the resolved URL is unparseable or is not https.
 */
function resolveSecureUrl(template, replacements, key) {
    return requireHttpsUrl(replacePlaceholders(template, replacements), key);
}

module.exports = { readPropertiesFile, replacePlaceholders, requireHttpsUrl, resolveSecureUrl };
