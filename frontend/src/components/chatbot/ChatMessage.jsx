import { RobotOutlined } from "@ant-design/icons";
import React from "react";

const ChatMessage = ({ chat }) => {
  return (
    !chat.hideInChat && (
      <div
        className={`ct-message ${
          chat.role === "model" ? "bot" : "user"
        }-message ${chat.isError && "text-red-500"}`}
        style={chat.role === "user" ? { alignItems: "flex-end" } : {}}
      >
        {chat.role === "model" && (
          <RobotOutlined
            style={{
              height: 35,
              width: 35,
              padding: 6,
              // flexShrink: 0,
              color: "#fff",
              // alignSelf: "flex-end",
              marginBottom: 2,
              background: "#3B82F6",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        )}
        <p className="message-text">{chat.message}</p>
      </div>
    )
  );
};

export default ChatMessage;
