import React, { useEffect, useState } from "react";

function OrderStatus(props) {
  const { statusName } = props;
  const [backgroundColor, setBackgroundColor] = useState("bg-blue-100");
  const [darkBackgroundColor, setDarkBackgroundColor] = useState("bg-blue-900");
  const [textColor, setTextColor] = useState("text-blue-800");
  const [darkTextColor, setDarkTextColor] = useState("text-blue-300");

  useEffect(() => {
    switch (statusName) {
      case "Đã xác nhận":
        setBackgroundColor("bg-green-100");
        setDarkBackgroundColor("bg-green-900");
        setTextColor("text-green-800");
        setDarkTextColor("text-green-300");
        break;
      case "Đang vận chuyển":
        setBackgroundColor("bg-yellow-100");
        setDarkBackgroundColor("bg-yellow-900");
        setTextColor("text-yellow-800");
        setDarkTextColor("text-yellow-300");
        break;
      case "Đã giao hàng":
        setBackgroundColor("bg-pink-100");
        setDarkBackgroundColor("bg-pink-900");
        setTextColor("text-pink-800");
        setDarkTextColor("text-pink-300");
        break;
      case "Đã huỷ":
        setBackgroundColor("bg-red-100");
        setDarkBackgroundColor("bg-red-900");
        setTextColor("text-red-800");
        setDarkTextColor("text-red-300");
        break;
      default:
        break;
    }
  }, [statusName]);
  return (
    <dd
      className={`me-2 mt-1.5 inline-flex items-center rounded px-2.5 py-0.5 text-xs font-medium ${backgroundColor} dark:${darkBackgroundColor} ${textColor} dark:${darkTextColor}`}
    >
      {statusName === "Chờ xác nhận" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="me-1 h-3 w-3"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18.5 4h-13m13 16h-13M8 20v-3.333a2 2 0 0 1 .4-1.2L10 12.6a1 1 0 0 0 0-1.2L8.4 8.533a2 2 0 0 1-.4-1.2V4h8v3.333a2 2 0 0 1-.4 1.2L13.957 11.4a1 1 0 0 0 0 1.2l1.643 2.867a2 2 0 0 1 .4 1.2V20H8Z"
          />
        </svg>
      )}
      {statusName === "Đã xác nhận" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="me-1 h-3 w-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      )}
      {statusName === "Đang vận chuyển" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="me-1 h-3 w-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
          />
        </svg>
      )}
      {statusName === "Đã giao hàng" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="me-1 h-3 w-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
          />
        </svg>
      )}
      {statusName === "Đã huỷ" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="me-1 h-3 w-3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      )}
      {statusName}
    </dd>
  );
}

export default OrderStatus;
