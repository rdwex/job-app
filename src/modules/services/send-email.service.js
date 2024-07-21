import nodemailer from "nodemailer";

export const sendEmailService = async ({
  to = "",
  subject = "",
  textMessage = "",
  htmlMessage = "",
  attachments = [],
} = {}) => {

  const transport = nodemailer.createTransport({
    host: "localhost",
    port: 587, // 465,
    secure: false, // true = 465 , false = 587
    // TLS = true
    auth: {
      user: "radwaaa.e@gmail.com",
      pass: "janjjhflidwkzlwa",
    }, // credentials
    service: "gmail",
    tls: {
      rejectUnauthorized: true,
    },
  });

  const info = await transport.sendMail({
    from: "No-Reply <radwaaa.e@gmail.com>",
    to,
    subject,
    text: textMessage,
    html: htmlMessage,
    attachments,
  });
  return info;
};
