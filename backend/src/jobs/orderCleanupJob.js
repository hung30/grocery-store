import cron from "node-cron";
import { orderModel } from "~/models/orderModel";
import { orderService } from "~/services/orderService";

export const startOrderCleanupJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = Date.now();
      const expiredOrders = await orderModel.getExpiredOrders();

      if (expiredOrders.length === 0) return;

      for (const order of expiredOrders) {
        await orderService.updateOrderStatusById(
          order._id,
          "67321305f823c69a6e65659f"
        );
      }
    } catch (error) {
      console.error("Lỗi trong cron job tự động huỷ đơn hàng:", error);
    }
  });

  console.log("✅ Đã khởi động cron job tự động huỷ đơn hàng");
};
