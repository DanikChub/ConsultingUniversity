const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

function getCompletionEmailHtml(userName, programName) {
    return `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Поздравляем с окончанием программы</title>
    </head>
    <body style="margin:0; padding:0; font-family: 'Helvetica', Arial, sans-serif; background-color:#f4f4f7;">
        <table width="100%" bgcolor="#f4f4f7" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
            <tr>
                <td align="center">
                    <table width="600" bgcolor="#ffffff" cellpadding="0" cellspacing="0" style="border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.1);">
                        <tr>
                            <td align="center" style="padding: 40px 20px; background: linear-gradient(90deg, #4f46e5, #6366f1); color: #ffffff;">
                                <h1 style="margin:0; font-size: 28px;">Поздравляем, ${userName}!</h1>
                                <p style="margin:5px 0 0; font-size:16px;">Вы успешно завершили программу <strong>${programName}</strong></p>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 30px 40px; text-align: center;">
                                <p style="font-size: 16px; color: #4a5568; line-height: 1.5;">
                                    Мы гордимся вашим достижением и рады видеть ваши успехи. Теперь вы можете получить доступ к сертификату или пересмотреть материалы программы.
                                </p>

                               
                                <a href="#" style="
                                    display:inline-block;
                                    margin-top:20px;
                                    padding:12px 24px;
                                    background-color:#4f46e5;
                                    color:#ffffff;
                                    text-decoration:none;
                                    border-radius:8px;
                                    font-weight:bold;
                                ">Перейти к сертификату</a>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px 40px; background-color:#f4f4f7; text-align:center; font-size:12px; color:#9ca3af;">
                                Это автоматическое сообщение, пожалуйста, не отвечайте на него.<br/>
                                © ${new Date().getFullYear()} Онлайн-школа
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    `;
}


async function sendCompletionEmail(toEmail, userName, programName) {
    try {
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: toEmail,
            subject: 'Поздравляем с окончанием программы!',
            html: getCompletionEmailHtml(userName, programName),
        });
    } catch (err) {
        console.error('Ошибка отправки письма:', err);
    }
}

module.exports = { sendCompletionEmail };