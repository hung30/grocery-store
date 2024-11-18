import React, { useState } from "react";
import EyeIcon from "../icons/EyeIcon";
import EyeSlashIcon from "../icons/EyeSlashIcon";

export default function Input(props) {
  const {
    type,
    id,
    name,
    setData,
    placeholder,
    error,
    autoComplete = "on",
    value = "",
  } = props;
  const [inputType, setInputType] = useState(type);
  const [icon, setIcon] = useState(type === "password" ? <EyeIcon /> : null);

  const togglePasswordVisibility = () => {
    if (inputType === "password") {
      setInputType("text");
      setIcon(<EyeSlashIcon />);
    } else {
      setInputType("password");
      setIcon(<EyeIcon />);
    }
  };
  return (
    <div>
      <div className="relative">
        {value ? (
          <input
            type={inputType}
            id={id}
            name={name}
            placeholder={placeholder}
            onChange={setData}
            autoComplete={autoComplete}
            value={value}
            className={`p-2 bg-slate-200 border-[1px] rounded outline-none hover:border-gray-500 focus:border-gray-500 placeholder:text-gray-500 pr-10 w-full duration-500 ${
              error ? "border-red-500" : ""
            }`}
          />
        ) : (
          <input
            type={inputType}
            id={id}
            name={name}
            placeholder={placeholder}
            onChange={setData}
            autoComplete={autoComplete}
            className={`p-2 bg-slate-200 border-[1px] rounded outline-none hover:border-gray-500 focus:border-gray-500 placeholder:text-gray-500 pr-10 w-full duration-500 ${
              error ? "border-red-500" : ""
            }`}
          />
        )}
        {type === "password" && (
          <span
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
          >
            {icon}
          </span>
        )}
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
    </div>
  );
}
