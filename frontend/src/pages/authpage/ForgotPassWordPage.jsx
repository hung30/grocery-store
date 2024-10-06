import React, { useState, useEffect, useContext } from "react";
import Input from "../../components/textfield/Input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { LoadingContext } from "../../contexts/LoadingContext";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const { setIsLoading } = useContext(LoadingContext);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await authorizedAxiosInstance.post(`${env.API_URL}/v1/otp/send-otp`, {
        email,
      });
      setIsLoading(false);
      setStep(2);
      setCountdown(60);
      setIsResendDisabled(true);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await authorizedAxiosInstance.post(
        `${env.API_URL}/v1/otp/verify-otp`,
        {
          email,
          otp,
        }
      );
      setToken(res.data.verifyOtp);
      setIsLoading(false);
      setStep(3);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleResendOtp = () => {
    // Gửi lại mã OTP
    setCountdown(60);
    setIsResendDisabled(true);
  };

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Mật khẩu không được để trống")
        .matches(
          /^(?=.*[A-Z])/,
          "Mật khẩu phải chứa ít nhất một chữ cái viết hoa"
        )
        .matches(
          /^(?=.*[!@#$%^&*])/,
          "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
        )
        .matches(/^(?=.*[0-9])/, "Mật khẩu phải chứa ít nhất một số")
        .matches(/^.{6,}$/, "Mật khẩu phải có độ dài tối thiểu là 6 ký tự")
        .trim()
        .strict(),
      confirmPassword: Yup.string()
        .required("Mật khẩu không được để trống")
        .oneOf([Yup.ref("password"), null], "Mật khẩu phải trùng nhau"),
    }),
    onSubmit: async (values) => {
      const { password } = values;
      try {
        setIsLoading(true);
        await authorizedAxiosInstance.put(
          `${env.API_URL}/v1/users/reset-password`,
          { password },
          { headers: { Authorization: token } }
        );
        setIsLoading(false);
        message.success("Đổi mật khẩu thành công");
        navigate("/login");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      {step === 1 && (
        <form
          onSubmit={handleEmailSubmit}
          className="bg-white p-6 rounded shadow-md w-80"
        >
          <div className="text-2xl text-blue-500 font-medium text-center uppercase">
            Quên mật khẩu
          </div>
          <div className="text-gray-500 mb-10 text-center">
            Nhập email để nhận mã OTP
          </div>

          <Input
            type="email"
            placeholder="Email"
            setData={(e) => setEmail(e.target.value)}
          />
          <div className="text-end mb-10 mt-1">
            <div>
              Đã nhớ mật khẩu?{" "}
              <span>
                <a href="/login" className="text-blue-500 ">
                  Đăng nhập
                </a>
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded"
          >
            Gửi OTP
          </button>
        </form>
      )}
      {step === 2 && (
        <form
          onSubmit={handleOtpSubmit}
          className="bg-white p-6 rounded shadow-md w-80"
        >
          <div className="text-2xl text-blue-500 font-medium text-center uppercase">
            Nhập OTP
          </div>
          <div className="text-gray-500 mb-10 text-center">
            Nhập mã OTP đã được gửi đến email của bạn
          </div>

          <Input
            type="text"
            placeholder="OTP"
            setData={(e) => setOtp(e.target.value)}
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded mt-4"
          >
            Xác thực OTP
          </button>
          <div className="mt-4 text-center text-gray-500">
            {isResendDisabled ? (
              <span>Không nhận được OTP? Gửi lại trong {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                className="text-blue-500 underline"
              >
                Gửi lại OTP
              </button>
            )}
          </div>
        </form>
      )}
      {step === 3 && (
        <form
          onSubmit={formik.handleSubmit}
          className="bg-white p-6 rounded shadow-md w-80"
        >
          <div className="text-2xl text-blue-500 font-medium text-center uppercase">
            Thay đổi mật khẩu
          </div>
          <div className="text-gray-500 mb-10 text-center">
            Đổi lại mật khẩu mới cho bạn
          </div>
          <div className="flex flex-col mb-14 gap-4">
            <Input
              type="password"
              id="password"
              name="password"
              placeholder="Mật khẩu"
              setData={formik.handleChange}
              error={formik.touched.password && formik.errors.password}
            />
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Nhập lai mật khẩu"
              setData={formik.handleChange}
              error={
                formik.touched.confirmPassword && formik.errors.confirmPassword
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            Đổi mật khẩu
          </button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;