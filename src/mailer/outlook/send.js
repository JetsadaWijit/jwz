const nodemailer = require('nodemailer');

async function sendEmail(sender, password, receiver, subject, text) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Outlook365',
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