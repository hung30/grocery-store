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

// Hàm hỗ trợ lấy tiêu đề và nội dung email dựa trên statusId
const getEmailContent = (statusId, orderId) => {
  const statusMap = {
    "67321261f823c69a6e65659b": {
      subject: "Đơn hàng của bạn đang chờ xác nhận",
      message:
        "Đơn hàng #{orderId} của bạn đã được đặt thành công và đang chờ xác nhận. Chúng tôi sẽ thông báo khi đơn hàng được xử lý.",
    },
    "673212a4f823c69a6e65659c": {
      subject: "Đơn hàng của bạn đã được xác nhận",
      message:
        "Đơn hàng #{orderId} của bạn đã được xác nhận. Chúng tôi đang chuẩn bị hàng để giao đến bạn.",
    },
    "673212b8f823c69a6e65659d": {
      subject: "Đơn hàng của bạn đang được vận chuyển",
      message:
        "Đơn hàng #{orderId} của bạn đang trên đường giao đến bạn. Vui lòng chuẩn bị để nhận hàng.",
    },
    "673212d1f823c69a6e65659e": {
      subject: "Đơn hàng của bạn đã được giao",
      message:
        "Đơn hàng #{orderId} của bạn đã được giao thành công. Cảm ơn bạn đã mua sắm với chúng tôi!",
    },
    "67321305f823c69a6e65659f": {
      subject: "Đơn hàng của bạn đã bị hủy",
      message:
        "Đơn hàng #{orderId} của bạn đã bị hủy theo yêu cầu. Nếu có thắc mắc, vui lòng liên hệ với chúng tôi.",
    },
  };

  const content = statusMap[statusId] || {
    subject: "Cập nhật trạng thái đơn hàng",
    message: "Trạng thái đơn hàng #{orderId} của bạn đã được cập nhật.",
  };

  return {
    subject: content.subject.replace("#{orderId}", orderId),
    message: content.message.replace("#{orderId}", orderId),
  };
};

// Hàm gửi email thông báo trạng thái đơn hàng
export const sendOrderStatusEmail = async (userEmail, orderId, statusId) => {
  try {
    const { subject, message } = getEmailContent(statusId, orderId);

    const mailOptions = {
      from: env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thông báo trạng thái đơn hàng</h2>
          <p>Xin chào,</p>
          <p>${message}</p>
          <p>Mã đơn hàng: <strong>${orderId}</strong></p>
          <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email ${env.EMAIL_USER}.</p>
          <p>Trân trọng,<br>Đội ngũ hỗ trợ</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email thông báo đã được gửi" };
  } catch (error) {
    console.log(error);
    throw new Error(`Gửi email thất bại: ${error.message}`);
  }
};
