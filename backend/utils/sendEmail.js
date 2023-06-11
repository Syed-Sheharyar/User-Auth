const nodemailer = require("nodemailer")

const sendEmail = async (options)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        service: process.env.MAIL_SERVICE,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: options.email,
        subject: options.subject,
        text: options.message
    }
    
    await transporter.sendMail(mailOptions)
}

module.exports = sendEmail