import nodemailer from "nodemailer";
import { env } from "~/config/environment";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject: `Mã OTP của bạn: ${otp}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p><strong>${env.EMAIL_USER}</strong> gửi tới <strong>${to}</strong> một mã OTP.</p>
        <p>Sử dụng code này để nhập:</p>
        <h1 style="font-size: 36px; color: #333;">${otp}</h1>
        <p>Code này sẽ hết hạn trong 10 phút</p>
        <p><strong>Lưu ý:</strong> Không được chia sẻ mã này với bất kì ai!!</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendContactEmailToAdmin = async (data) => {
  const mailOptions = {
    from: data.email,
    to: env.EMAIL_USER,
    subject: `Liên hệ từ ${data.name}`,
    text: `Họ và tên: ${data.name}\nEmail: ${data.email}\nNội dung: ${data.message}`,
  };

  return await transporter.sendMail(mailOptions);
};

export const sendContactEmailToUser = async (data) => {
  const mailOptions = {
    from: env.EMAIL_USER,
    to: data.email,
    subject: "Xác nhận gửi liên hệ",
    text: `Cảm ơn ${data.name} đã liên hệ với chúng tôi!\nNội dung bạn gửi: ${data.message}\nChúng tôi sẽ phản hồi sớm nhất có thể.`,
  };

  return await transporter.sendMail(mailOptions);
};
