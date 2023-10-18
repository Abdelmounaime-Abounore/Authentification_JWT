const nodemailer = require("nodemailer")

const sendEmail = async(email, subject, link) => {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const htmlTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Email Verification</title>
        </head>
        <body>
            <div>
                <h2>"${subject}"</h2>
                <p><a href="${link}">Verify your email</a></p>
            </div>
        </body>
        </html>
        `;

        await transporter.sendMail({
            from: "abdelmounaim.abounore@gmail.com",
            to: email,
            subject: subject,
            html: htmlTemplate
        });

        console.log("Email sent Succefully");

    } catch (error) {
        console.log("email not send");
        console.log(error);
    }
}

module.exports = {sendEmail}