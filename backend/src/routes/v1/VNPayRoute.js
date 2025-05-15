import express from "express";
import { env } from "~/config/environment";
import { authMiddleware } from "~/middlewares/authMiddleware";
import { orderService } from "~/services/orderService";
import moment from "moment";
import crypto from "crypto";
import querystring from "querystring";

function sortObject(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

const router = express.Router();

router.post(
  "/create_payment_url",
  authMiddleware.isAuthorized,
  async (req, res) => {
    try {
      const data = await req.body;
      const ipAddress = req.ip === "::1" ? "127.0.0.1" : req.ip;
      console.log(ipAddress);
      const date = new Date();
      const createDate = moment(date).format("YYYYMMDDHHmmss");

      const createdOrder = await orderService.createNewOrderForOnlinePayment(
        req.jwtDecoded._id,
        data
      );
      const orderId = createdOrder._id.toString();

      const vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: env.VNPAY_TMN_CODE,
        vnp_Locale: "vn",
        vnp_CurrCode: "VND",
        vnp_TxnRef: orderId,
        vnp_OrderInfo: "Payment",
        vnp_OrderType: "other",
        vnp_Amount: parseFloat(data.totalPrice) * 100,
        vnp_ReturnUrl: env.VNPAY_RETURN_URL,
        vnp_IpAddr: ipAddress,
        vnp_CreateDate: createDate,
      };

      //ký VNPAY
      const sortedParams = sortObject(vnp_Params);
      const signData = require("querystring").stringify(sortedParams, "&", "=");

      const hmac = crypto.createHmac("sha512", env.VNPAY_HASH_SECRET);
      const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
      sortedParams.vnp_SecureHash = signed;

      const paymentUrl =
        `${env.VNPAY_URL}?` + querystring.stringify(sortedParams, "&", "=");
      res.json({ paymentUrl });
    } catch (error) {
      console.error("Lỗi tạo URL thanh toán:", error);
      return res
        .status(500)
        .json({ message: "Lỗi tạo URL thanh toán", error: error.message });
    }
  }
);

// router.get("/payment-return", async (req, res) => {
//   try {
//     const vnp_Params = req.query;
//     const secureHash = vnp_Params.vnp_SecureHash;

//     delete vnp_Params.vnp_SecureHash;
//     delete vnp_Params.vnp_SecureHashType;

//     const sortedParams = sortObject(vnp_Params);
//     const signData = querystring.stringify(sortedParams, "&", "=");

//     const hmac = crypto.createHmac("sha512", env.VNPAY_HASH_SECRET);
//     const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

//     if (secureHash === signed) {
//       if (vnp_Params.vnp_ResponseCode === "00") {
//         const orderId = vnp_Params.vnp_TxnRef;
//         await orderService.updateOrderStatusById(
//           orderId,
//           "673212a4f823c69a6e65659c"
//         );
//         return res.redirect(`${env.URL_FRONTEND}/order?message=success`);
//       } else {
//         const orderId = vnp_Params.vnp_TxnRef;
//         await orderService.deleteOrderById(orderId);
//         return res.redirect(`${env.URL_FRONTEND}/product?message=fail`);
//       }
//     } else {
//       return res.status(400).send("Sai chữ ký");
//     }
//   } catch (error) {
//     console.error("Lỗi xử lý vnpay_return:", error);
//     return res
//       .status(500)
//       .json({ message: "Lỗi xử lý thanh toán", error: error.message });
//   }
// });

router.get("/payment-return", async (req, res) => {
  try {
    const vnp_Params = req.query;
    const secureHash = vnp_Params.vnp_SecureHash;

    delete vnp_Params.vnp_SecureHash;
    delete vnp_Params.vnp_SecureHashType;

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, "&", "=");

    const hmac = crypto.createHmac("sha512", env.VNPAY_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    if (secureHash === signed) {
      if (vnp_Params.vnp_ResponseCode === "00") {
        const orderId = vnp_Params.vnp_TxnRef;
        await orderService.updateOrderStatusById(
          orderId,
          "673212a4f823c69a6e65659c"
        );
        return res.redirect(`${env.URL_FRONTEND}/order?message=success`);
      } else {
        const orderId = vnp_Params.vnp_TxnRef;
        await orderService.deleteOrderById(orderId);
        // Chuyển hướng đến PaymentErrorPage với thông tin lỗi
        const errorParams = new URLSearchParams({
          ...vnp_Params,
          message: "Lỗi xử lý thanh toán",
          error: "Giao dịch không thành công",
        });
        return res.redirect(
          `${env.URL_FRONTEND}/order/payment-return?${errorParams.toString()}`
        );
      }
    } else {
      // Chuyển hướng đến PaymentErrorPage khi sai chữ ký
      const errorParams = new URLSearchParams({
        ...vnp_Params,
        message: "Lỗi xử lý thanh toán",
        error: "Sai chữ ký",
      });
      return res.redirect(
        `${env.URL_FRONTEND}/order/payment-return?${errorParams.toString()}`
      );
    }
  } catch (error) {
    const vnp_Params = req.query;
    const orderId = vnp_Params.vnp_TxnRef;
    await orderService.deleteOrderById(orderId);
    const errorParams = new URLSearchParams({
      ...req.query,
      message: "Lỗi xử lý thanh toán",
      error: error.message || "Lỗi không xác định",
    });

    return res.redirect(
      `${env.URL_FRONTEND}/order/payment-return?${errorParams.toString()}`
    );
  }
});

export const VNPayRoute = router;
