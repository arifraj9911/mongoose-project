import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.node_env === "production",
    auth: {
      user: "arif.raj9911@gmail.com",
      pass: "crii urrc veoj kibz",
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: "arif.raj9911@gmail.com", // sender address
    to, // list of receivers
    subject: "Reset Password within 10 minutes!", // Subject line
    text: "Hello world?", // plain text body
    html, // html body
  });
};
