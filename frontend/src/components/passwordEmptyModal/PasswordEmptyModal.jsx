import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PasswordEmptyModal() {
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user?.isPasswordEmpty) {
      setShowNotification(true);
    }
  }, []);

  const handleOk = () => {
    setShowNotification(false);
    navigate("/user/change-password");
  };

  const handleCancel = () => {
    setShowNotification(false);
  };
  return (
    <Modal
      title="Thông báo quan trọng"
      open={showNotification}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
    >
      <p>Mật khẩu của bạn đang để trống. Hãy đổi mật khẩu ngay!</p>
    </Modal>
  );
}

export default PasswordEmptyModal;
