import { DeleteOutlined, DownOutlined, RobotOutlined } from "@ant-design/icons";
import { useEffect, useRef, useState } from "react";
import ChatForm from "./ChatForm";
import ChatMessage from "./ChatMessage";
import { env } from "../../config/environment";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { generateProductDescription } from "../../utils/generateProductDescription";
import { Tooltip, Modal } from "antd";

function Chatbot({ onToggleChatbot }) {
  const [products, setProducts] = useState([]);
  const [chatHistory, setChatHistory] = useState(() => {
    // Lấy chatHistory từ localStorage khi khởi tạo, nếu không có thì dùng giá trị mặc định
    const savedHistory = localStorage.getItem("chatHistory");
    return savedHistory
      ? JSON.parse(savedHistory)
      : [
          {
            hideInChat: true,
            role: "model",
            message: "",
          },
        ];
  });

  const chatBodyRef = useRef();
  const chatbotRef = useRef();

  // Lấy dữ liệu products từ API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await authorizedAxiosInstance.get(
          `${env.API_URL}/v1/products`
        );
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  // Cập nhật chatHistory khi products thay đổi
  useEffect(() => {
    if (products.length > 0) {
      setChatHistory((prev) => [
        {
          hideInChat: true,
          role: "model",
          message: generateProductDescription(products),
        },
        ...prev.filter((msg) => !msg.hideInChat), // Giữ lại các tin nhắn khác
      ]);
    }
  }, [products]);

  // Lưu chatHistory vào localStorage mỗi khi nó thay đổi
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const generateBotResponse = async (history) => {
    const updateHistory = (message, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.message !== "Thinking..."),
        { role: "model", message, isError },
      ]);
    };
    history = history.map(({ role, message }) => ({
      role,
      parts: [{ text: message }],
    }));

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents: history }),
    };

    try {
      const res = await fetch(env.GEMINI_API_URL, requestOptions);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error.message || "Có lỗi");
      }

      const apiResponseText = data.candidates[0].content.parts[0].text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .trim();

      updateHistory(apiResponseText);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  useEffect(() => {
    chatBodyRef.current.scrollTo({
      top: chatBodyRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [chatHistory]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        onToggleChatbot();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onToggleChatbot]);

  const handleDeleteChatHistory = () => {
    Modal.confirm({
      title: 'Xác nhận',
      content: 'Bạn có chắc chắn muốn xóa không?',
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk() {
        setChatHistory([
          {
            hideInChat: true,
            role: "model",
            message: "",
          },
        ]);
        localStorage.removeItem("chatHistory");
      },
      onCancel() {
        console.log('Hủy bỏ thao tác!');
      },
    });
  }

  return (
    <div className="chatbot">
      <div
        ref={chatbotRef}
        className="chatbot-popup fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:translate-x-0 sm:translate-y-0 sm:top-auto sm:left-auto sm:bottom-4 sm:right-20 w-[380px] overflow-hidden bg-white rounded-2xl shadow-[0_0_128px_0_rgba(0,0,0,0.1),_0_32px_64px_-48px_rgba(0,0,0,0.5)]"
      >
        <div className="chat-header flex items-center justify-between bg-blue-400 px-4 py-4">
          <div className="header-info flex items-center gap-3">
            <div style={{}}>
              <RobotOutlined
                style={{
                  height: 35,
                  width: 35,
                  padding: 6,
                  fontSize: 18,
                  flexShrink: 0,
                  color: "#3B82F6",
                  background: "#fff",
                  borderRadius: "50%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </div>
            <div className="logo-text text-white text-xl font-semibold">
              Chatbot
            </div>
          </div>
          <div className="header-buttons flex items-center gap-2">
            <Tooltip title="Xoá lịch sử chat">
              <button className="h-10 w-10 border-none outline-none text-red-500 cursor-pointer text-xl pt-0.5 rounded-full  bg-none flex justify-center items-center duration-200 ease-in-out hover:bg-black/10" onClick={handleDeleteChatHistory}>
                <DeleteOutlined />
              </button>
            </Tooltip>
            <button
              className="h-10 w-10 border-none outline-none text-white cursor-pointer text-xl pt-0.5 rounded-full  bg-none flex justify-center items-center duration-200 ease-in-out hover:bg-black/10"
              onClick={onToggleChatbot}
            >
              <DownOutlined />
            </button>
          </div>
        </div>

        <div
          ref={chatBodyRef}
          className="chat-body flex flex-col gap-5 h-[460px] sm:h-[400px] mb-20 overflow-y-auto py-6 px-5 scrollbar-thin scrollbar-colored"
        >
          <div className="ct-message bot-message">
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
            <p className="message-text">
              Xin chào! <br /> Tôi có thể giúp gì cho bạn?
            </p>
          </div>

          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>

        <div className="chat-footer absolute bottom-0 w-full bg-white pt-[15px] px-[22px] pb-[20px]">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
            generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
}

export default Chatbot;
