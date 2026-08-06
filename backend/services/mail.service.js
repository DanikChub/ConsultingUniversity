const nodemailer = require('nodemailer');
const path = require("path");


const transporter = nodemailer.createTransport({
    host: "smtp.yandex.ru",
    port: 465,
    secure: true,

    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },

    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
});



function getCompletionEmailHtml(
    userName,
    programName,
) {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8">
<tr>
<td align="center" style="padding:40px 15px;">

<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;">

<tr>
<td style="padding:40px 35px;">

<h2 style="margin:0 0 20px;color:#253858;">
Поздравляем, ${userName}!
</h2>

<p style="font-size:16px;line-height:26px;color:#555;">
Мы гордимся вашим достижением и рады видеть ваши успехи.
</p>

<p style="font-size:16px;line-height:26px;color:#555;">
Искренне поздравляем вас с успешным окончанием обучения по программе дополнительного профессионального образования:
</p>

<p style="font-size:16px;line-height:26px;color:#555;">
<strong>${programName}</strong>
</p>

<p style="font-size:16px;line-height:26px;color:#555;">
Ваш диплом будет отправлен в ближайшее время Почтой России по адресу, который вы указали при регистрации.
</p>


<h3 style="color:#253858;margin-top:35px;">
Как проверить подлинность диплома?
</h3>

<p style="font-size:16px;line-height:26px;color:#555;">
Все сведения о выданных документах переданы в государственный реестр.
</p>

<p style="font-size:16px;line-height:26px;color:#555;">
Проверить подлинность диплома можно на официальном сайте ФИС ФРДО.
</p>

<table cellpadding="0" cellspacing="0" style="margin-top:30px;">
<tr>
<td bgcolor="#2f8fd3" style="border-radius:6px;">
<a href="https://obrnadzor.gov.ru/activity/main_directions/reestr_of_issued_documents/"
style="
display:inline-block;
padding:14px 28px;
font-size:15px;
font-weight:bold;
color:#ffffff;
text-decoration:none;
">
Проверить диплом
</a>
</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>
<img
src="cid:footer-banner"
width="600"
style="display:block;width:100%;border:0;">
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
            attachments: [
                {
                    filename: "banner.webp",
                    path: path.resolve(__dirname, "../assets/banner.webp"),
                    cid: "footer-banner",
                },
            ]
        });
    } catch (err) {
        console.error('Ошибка отправки письма:', err);
    }
}



function getWelcomeEmailHtml(userName, login, password) {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8">
<tr>
<td align="center" style="padding:40px 15px;">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;">

<tr>
<td style="padding:40px 35px;">

<h2 style="margin:0 0 20px;color:#253858;">
Здравствуйте, ${userName}!
</h2>

<p style="font-size:16px;line-height:26px;color:#555;">
Для активации вашего аккаунта и получения возможности использовать все преимущества нашей системы необходимо войти в личный кабинет, используя следующие данные:
</p>

<table
width="100%"
cellpadding="12"
cellspacing="0"
style="
margin:25px 0;
background:#f6f8fb;
border:1px solid #dfe5ec;
border-radius:8px;
">

<tr>
<td width="150">
<b>Логин</b>
</td>
<td>${login}</td>
</tr>

<tr>
<td>
<b>Пароль</b>
</td>
<td>${password}</td>
</tr>

</table>

<table cellpadding="0" cellspacing="0" style="margin-top:10px;">
<tr>
<td bgcolor="#2f8fd3" style="border-radius:6px;">
<a
href="https://консалтинг-университет.рф/signin"
style="
display:inline-block;
padding:14px 28px;
font-size:15px;
font-weight:bold;
color:#ffffff;
text-decoration:none;
">
Войти в личный кабинет
</a>
</td>
</tr>
</table>

<h3 style="margin-top:35px;color:#253858;">
С чего начать?
</h3>

<ol style="font-size:16px;color:#555;line-height:28px;padding-left:20px;">

<li>
При первом входе система предложит изменить пароль.
</li>

<li>
Заполните профиль и добавьте свою фотографию.
</li>

<li>
Откройте программу и начните обучение.
</li>

</ol>

<hr style="margin:30px 0;border:none;border-top:1px solid #e3e8ee;">

<p style="font-size:15px;color:#555;line-height:24px;">

Все вопросы можно задать на электронную почту

<br><br>

<b>school@kv34.ru</b>

<br><br>

или уточнить по телефону

<br><br>

<b>8 800 550 56 90</b>

</p>

<p style="margin-top:25px;font-size:16px;color:#253858;">
Желаем продуктивного и интересного обучения!
</p>

</td>
</tr>

<tr>
<td>
<img
src="cid:footer-banner"
width="600"
style="display:block;width:100%;border:0;">
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

async function sendWelcomeEmail(toEmail, userName, login, password) {
    try {
        const info = await transporter.sendMail({
            from: `Консалтинг-Университет <${process.env.MAIL_USER}>`,
            to: toEmail,
            subject: "Добро пожаловать в Консалтинг-Университет",
            html: getWelcomeEmailHtml(userName, login, password),
            attachments: [
                {
                    filename: "banner.webp",
                    path: path.resolve(__dirname, "../assets/banner.webp"),
                    cid: "footer-banner",
                },
            ]
        });

        console.log("Welcome email sent:", {
            to: toEmail,
            messageId: info.messageId,
        });

        return {
            success: true,
        };
    } catch (err) {
        console.error("Ошибка отправки welcome-письма:", err);

        return {
            success: false,
            error: err.message,
        };
    }
}

function getDiplomaTrackingEmailHtml(userName, trackingNumber) {
    return `
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f6f8">
<tr>
<td align="center" style="padding:40px 15px;">

<table
width="600"
cellpadding="0"
cellspacing="0"
style="background:#ffffff;border-radius:10px;overflow:hidden;"
>

<tr>
<td style="padding:40px 35px;">

<h2 style="margin:0 0 20px;color:#253858;">
Добрый день, ${userName}!
</h2>

<p style="font-size:16px;line-height:26px;color:#555;">
Ваш диплом уже отправлен Почтой России по адресу, который вы указали при регистрации.
</p>

<p style="font-size:16px;line-height:26px;color:#555;margin-bottom:10px;">
Трек-номер для отслеживания:
</p>

<table
width="100%"
cellpadding="0"
cellspacing="0"
style="
margin:0 0 30px;
background:#f6f8fb;
border:1px solid #dfe5ec;
border-radius:8px;
"
>
<tr>
<td
align="center"
style="
padding:18px 20px;
font-size:20px;
font-weight:bold;
letter-spacing:1px;
color:#253858;
"
>
${trackingNumber}
</td>
</tr>
</table>

<h3 style="color:#253858;margin:35px 0 15px;">
Как проверить подлинность диплома?
</h3>

<p style="font-size:16px;line-height:26px;color:#555;">
Все сведения о выданных документах переданы в государственный реестр.
</p>

<p style="font-size:16px;line-height:26px;color:#555;">
Проверить подлинность диплома можно на официальном сайте ФИС ФРДО.
</p>

<table cellpadding="0" cellspacing="0" style="margin-top:30px;">
<tr>
<td bgcolor="#2f8fd3" style="border-radius:6px;">
<a
href="https://obrnadzor.gov.ru/activity/main_directions/reestr_of_issued_documents/"
style="
display:inline-block;
padding:14px 28px;
font-size:15px;
font-weight:bold;
color:#ffffff;
text-decoration:none;
"
>
Проверить диплом
</a>
</td>
</tr>
</table>

</td>
</tr>

<tr>
<td>
<img
src="cid:footer-banner"
width="600"
alt=""
style="display:block;width:100%;border:0;"
>
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

async function sendDiplomaTrackingEmail(
    toEmail,
    userName,
    trackingNumber,
) {
    try {
        const info = await transporter.sendMail({
            from: `Консалтинг-Университет <${process.env.MAIL_USER}>`,
            to: toEmail,
            subject: "Ваш диплом отправлен",
            html: getDiplomaTrackingEmailHtml(
                userName,
                trackingNumber,
            ),
            attachments: [
                {
                    filename: "banner.webp",
                    path: path.resolve(__dirname, "../assets/banner.webp"),
                    cid: "footer-banner",
                },
            ],
        });

        console.log("Diploma tracking email sent:", {
            to: toEmail,
            trackingNumber,
            messageId: info.messageId,
        });

        return {
            success: true,
        };
    } catch (err) {
        console.error(
            "Ошибка отправки письма с трек-номером:",
            err,
        );

        return {
            success: false,
            error: err.message,
        };
    }
}

module.exports = {
    sendCompletionEmail,
    sendWelcomeEmail,
    sendDiplomaTrackingEmail,
};