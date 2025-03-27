import React, { useState } from "react";
import {
  CommentOutlined,
  CustomerServiceOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { FloatButton } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../redux/darkModeSlice";
import Chatbot from "../chatbot/Chatbot";

function FloatButtonComponent() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.darkMode.darkMode);
  const [open, setOpen] = useState(false);
  const [showChatBot, setShowChatBot] = useState(false);

  const handleDarkMode = () => {
    dispatch(toggleDarkMode());
    setOpen(false);
  };

  const handleOpenChange = (newOpen) => {
    setOpen(newOpen);
  };

  const handleShowChatBot = () => {
    setShowChatBot(!showChatBot);
    setOpen(false);
  };

  return (
    <>
      <FloatButton.Group
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
        style={{
          insetInlineEnd: 24,
        }}
        icon={<CustomerServiceOutlined />}
      >
        <FloatButton
          type={darkMode ? "primary" : "default"}
          icon={darkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={handleDarkMode}
        />
        <FloatButton icon={<CommentOutlined />} onClick={handleShowChatBot} />
      </FloatButton.Group>
      {showChatBot && <Chatbot onToggleChatbot={handleShowChatBot} />}
    </>
  );
}

export default FloatButtonComponent;
