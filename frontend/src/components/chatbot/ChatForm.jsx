import { ArrowUpOutlined } from "@ant-design/icons";
import React, { useRef } from "react";

function ChatForm({ chatHistory, setChatHistory, generateBotResponse }) {
  const inputRef = useRef();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";

    //update chat history with the user's message
    setChatHistory((history) => [
      ...history,
      { role: "user", message: userMessage },
    ]);

    setTimeout(() => {
      //add a "Thinking..." placeholder for the bot's response
      setChatHistory((history) => [
        ...history,
        { role: "model", message: "Thinking..." },
      ]);
      // call the function to generate the bot's response
      generateBotResponse([
        ...chatHistory,
        {
          role: "user",
          message: `Sử dụng các chi tiết được cung cấp ở trên, vui lòng giải quyết truy vấn này ${userMessage}`,
        },
      ]);
    }, 600);
  };

  return (
    <form
      action="#"
      className="chat-form flex items-center bg-white outline outline-1 outline-[#CCCCE5] rounded-[32px] shadow-[0_0_8px_rgba(0,0,0,0.06)] focus-within:outline-2 focus-within:outline-[#3B82F6]"
      onSubmit={handleFormSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        placeholder="Message..."
        className="ct-message-input"
        required
      />
      <button className="ct-chat-button">
        <ArrowUpOutlined />
      </button>
    </form>
  );
}

export default ChatForm;
