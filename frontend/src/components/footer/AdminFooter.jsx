import { Typography } from "antd";
import React from "react";

function AdminFooter() {
  return (
    <div className="h-[50px] flex justify-evenly items-center border-t border-t-[rgba(0,0,0,0.15)]">
      <Typography.Link href="tel:0794567833">0794567833</Typography.Link>
      <Typography.Link href="https://www.google.com" target={"_blank"}>
        Privacy Policy
      </Typography.Link>
      <Typography.Link
        href="https://www.facebook.com/dinhhung.304/"
        target={"_blank"}
      >
        Nguyễn Đình Hưng
      </Typography.Link>
    </div>
  );
}

export default AdminFooter;
