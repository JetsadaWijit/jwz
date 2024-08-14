const nodemailer = require('nodemailer');

async function sendEmail(sender, password, receiver, subject, text) {
    const transporter = nodemailer.createTransport({
        service: 'Outlook365',
        auth: {
            user: sender,
            pass: password,
        },
    });

    return transporter.sendMail({
        from: sender,
        to: receiver,
        subject: subject,
        text: text,
    });
}
