const nodemailer = require('nodemailer');

async function sendEmail(sender, password, receiver, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Outlook365',
            // The Outlook365 preset resolves to port 587 with secure: false, so the
            // socket opens in cleartext and is upgraded by STARTTLS afterwards.
            // Without this, nodemailer only upgrades when the server advertises
            // STARTTLS, so a server that omits it gets the password in the clear.
            // Never set opportunisticTLS or ignoreTLS here: both restore that hole.
            requireTLS: true,
            auth: {
                user: sender,
                pass: password,
            },
        });

        const info = await transporter.sendMail({
            from: sender,
            to: receiver,
            subject: subject,
            text: text,
        });

        return info;
    } catch (error) {
        throw error;
    }
}

module.exports = sendEmail;