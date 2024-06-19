import React, { useState } from "react";
import Input from "../../components/textfield/Input";

export default function RegisterPage() {
  const [userEmail, setUserEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const registerHandle = () => {
    console.log(userEmail);
    console.log(telephone);
    console.log(password);
    console.log(confirmPassword);
    console.log("xử lý đky tại đây");
  };
  return (
    <div className="flex flex-col justify-start items-center">
      <div className="w-full p-10  md:w-1/2 lg:w-1/3 xl:w-1/4 mt-8">
        <div className="text-2xl text-blue-500 font-medium text-center uppercase">
          Đăng ký
        </div>
        <div className="text-gray-500 mb-10 text-center">
          Tạo tài khoản mới của bạn
        </div>
        <div className="flex flex-col mb-14 gap-4">
          <Input type="text" placeholder="Email" setData={userEmail} />
          <Input
            type="text"
            placeholder="Số điện thoại"
            setData={setTelephone}
          />
          <Input type="password" placeholder="Mật khẩu" setData={setPassword} />
          <Input
            type="password"
            placeholder="Nhập lai mật khẩu"
            setData={setConfirmPassword}
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          onClick={registerHandle}
        >
          Đăng ký
        </button>
        <div className="text-center p-3">
          Đã có tài khoản?,{" "}
          <span className="text-blue-500">
            <a href="/login">Đăng nhập</a>
          </span>
        </div>
      </div>
    </div>
  );
}
