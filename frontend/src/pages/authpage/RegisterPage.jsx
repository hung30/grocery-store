// import React, { useContext } from "react";
// import Input from "../../components/textfield/Input";
// import authorizedAxiosInstance from "./../../utils/authorizedAxios";
// import { env } from "../../config/environment";
// import { LoadingContext } from "./../../contexts/LoadingContext";
// import { Link, useNavigate } from "react-router-dom";
// import { message } from "antd";
// import { useFormik } from "formik";
// import * as Yup from "yup";

// export default function RegisterPage() {
//   const { setIsLoading } = useContext(LoadingContext);
//   const navigate = useNavigate();

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       telephone: "",
//       name: "",
//       password: "",
//       confirmPassword: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string()
//         .required("Email không được để trống")
//         .email("Email không hợp lệ")
//         .trim()
//         .strict(),
//       telephone: Yup.string()
//         .required("Số điện thoại không được để trống")
//         .min(10, "Số điện thoại không hợp lệ")
//         .max(10, "Số điện thoại không hợp lệ")
//         .trim()
//         .strict(),
//       name: Yup.string()
//         .required("Tên không được để trống")
//         .min(1, "Tên phải lớn hơn 1 ký tự")
//         .max(30, "Tên phải bé hơn 30 ký tự")
//         .trim()
//         .strict(),
//       password: Yup.string()
//         .required("Mật khẩu không được để trống")
//         .matches(
//           /^(?=.*[A-Z])/,
//           "Mật khẩu phải chứa ít nhất một chữ cái viết hoa"
//         )
//         .matches(
//           /^(?=.*[!@#$%^&*])/,
//           "Mật khẩu phải chứa ít nhất một ký tự đặc biệt"
//         )
//         .matches(/^(?=.*[0-9])/, "Mật khẩu phải chứa ít nhất một số")
//         .matches(/^.{6,}$/, "Mật khẩu phải có độ dài tối thiểu là 6 ký tự")
//         .trim()
//         .strict(),
//       confirmPassword: Yup.string()
//         .required("Mật khẩu không được để trống")
//         .oneOf([Yup.ref("password"), null], "Mật khẩu phải trùng nhau"),
//     }),
//     onSubmit: async (values) => {
//       try {
//         setIsLoading(true);
//         const { confirmPassword, ...data } = values;
//         await authorizedAxiosInstance.post(`${env.API_URL}/v1/users`, data);
//         setIsLoading(false);
//         message.success("Đăng ký thành công");
//         navigate("/login");
//       } catch (error) {
//         setIsLoading(false);
//         console.error(error);
//       }
//     },
//   });

//   return (
//     <div className="flex flex-col justify-start items-center">
//       {/* <div className="w-full p-10  md:w-1/2 lg:w-1/3 xl:w-1/4 mt-8"> */}
//       <div className="w-full p-10  md:w-1/2 lg:w-1/3 mt-8">
//         <div className="text-2xl text-blue-500 font-medium text-center uppercase">
//           Đăng ký
//         </div>
//         <div className="text-gray-500 mb-10 text-center dark:text-white">
//           Tạo tài khoản mới của bạn
//         </div>
//         <form onSubmit={formik.handleSubmit} autoComplete="off">
//           <div className="flex flex-col mb-14 gap-4">
//             <div className="relative">
//               <Input
//                 type="text"
//                 id="email"
//                 name="email"
//                 placeholder="Email *"
//                 setData={formik.handleChange}
//                 error={formik.touched.email && formik.errors.email}
//               />
//             </div>
//             <Input
//               type="text"
//               id="telephone"
//               name="telephone"
//               placeholder="Số điện thoại *"
//               setData={formik.handleChange}
//               error={formik.touched.telephone && formik.errors.telephone}
//             />
//             <Input
//               type="text"
//               id="name"
//               name="name"
//               placeholder="Tên *"
//               setData={formik.handleChange}
//               error={formik.touched.name && formik.errors.name}
//             />
//             <Input
//               type="password"
//               id="password"
//               name="password"
//               placeholder="Mật khẩu *"
//               setData={formik.handleChange}
//               error={formik.touched.password && formik.errors.password}
//             />
//             <Input
//               type="password"
//               id="confirmPassword"
//               name="confirmPassword"
//               placeholder="Nhập lai mật khẩu *"
//               setData={formik.handleChange}
//               error={
//                 formik.touched.confirmPassword && formik.errors.confirmPassword
//               }
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white px-4 py-2 rounded"
//           >
//             Đăng ký
//           </button>
//         </form>
//         <div className="text-center p-3 dark:text-white">
//           Đã có tài khoản?,{" "}
//           <span className="text-blue-500">
//             <Link to="/login">Đăng nhập</Link>
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useContext, useEffect, useState } from "react";
import Input from "../../components/textfield/Input";
import authorizedAxiosInstance from "./../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { LoadingContext } from "./../../contexts/LoadingContext";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function RegisterPage() {
  const { setIsLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // Quản lý các bước: 1 - email, 2 - OTP, 3 - thông tin còn lại
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formik = useFormik({
    initialValues: {
      email: "",
      otp: "",
      telephone: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("Email không được để trống")
        .email("Email không hợp lệ")
        .trim()
        .strict(),
      otp:
        step === 2
          ? Yup.string().required("OTP không được để trống")
          : Yup.string(),
      telephone:
        step === 3
          ? Yup.string()
              .required("Số điện thoại không được để trống")
              .min(10, "Số điện thoại không hợp lệ")
              .max(10, "Số điện thoại không hợp lệ")
              .trim()
              .strict()
          : Yup.string(),
      name:
        step === 3
          ? Yup.string()
              .required("Tên không được để trống")
              .min(1, "Tên phải lớn hơn 1 ký tự")
              .max(30, "Tên phải bé hơn 30 ký tự")
              .trim()
              .strict()
          : Yup.string(),
      password:
        step === 3
          ? Yup.string()
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
              .matches(
                /^.{6,}$/,
                "Mật khẩu phải có độ dài tối thiểu là 6 ký tự"
              )
              .trim()
              .strict()
          : Yup.string(),
      confirmPassword:
        step === 3
          ? Yup.string()
              .required("Mật khẩu không được để trống")
              .oneOf([Yup.ref("password"), null], "Mật khẩu phải trùng nhau")
          : Yup.string(),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        if (step === 1) {
          // Gửi email để lấy OTP
          await authorizedAxiosInstance.post(
            `${env.API_URL}/v1/otp/send-otp-to-register`,
            {
              email: values.email,
            }
          );
          setStep(2);
          setCountdown(60);
          message.success("OTP đã được gửi đến email của bạn");
        } else if (step === 2) {
          // Xác thực OTP
          await authorizedAxiosInstance.post(
            `${env.API_URL}/v1/otp/verify-otp-to-register`,
            {
              email: values.email,
              otp: values.otp,
            }
          );
          setStep(3);
          message.success("Xác thực OTP thành công");
        } else if (step === 3) {
          // Đăng ký hoàn tất
          const { confirmPassword, otp, ...data } = values;
          await authorizedAxiosInstance.post(`${env.API_URL}/v1/users`, data);
          message.success("Đăng ký thành công");
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleResendOtp = async () => {
    // Gửi lại mã OTP

    try {
      setIsLoading(true);
      await authorizedAxiosInstance.post(
        `${env.API_URL}/v1/otp/send-otp-to-register`,
        {
          email: formik.values.email,
        }
      );
      setIsLoading(false);
      setCountdown(60);
      setIsResendDisabled(true);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="w-full p-10 md:w-1/2 lg:w-1/3 mt-8">
        <div className="text-2xl text-blue-500 font-medium text-center uppercase">
          Đăng ký
        </div>
        <div className="text-gray-500 mb-10 text-center dark:text-white">
          {step === 1 && "Nhập email của bạn"}
          {step === 2 &&
            `Nhập mã OTP đã được gửi đến email ${formik.values.email}`}
          {step === 3 && "Hoàn tất thông tin đăng ký"}
        </div>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="flex flex-col mb-14 gap-4">
            {step === 1 && (
              <Input
                type="text"
                id="email"
                name="email"
                placeholder="Email *"
                setData={formik.handleChange}
                error={formik.touched.email && formik.errors.email}
              />
            )}
            {step === 2 && (
              <div>
                <Input
                  type="text"
                  id="otp"
                  name="otp"
                  placeholder="Mã OTP *"
                  setData={formik.handleChange}
                  error={formik.touched.otp && formik.errors.otp}
                />
                <div className="mt-4 text-center text-gray-500 dark:text-white">
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
              </div>
            )}
            {step === 3 && (
              <>
                <Input
                  type="text"
                  id="telephone"
                  name="telephone"
                  placeholder="Số điện thoại *"
                  setData={formik.handleChange}
                  error={formik.touched.telephone && formik.errors.telephone}
                />
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Tên *"
                  setData={formik.handleChange}
                  error={formik.touched.name && formik.errors.name}
                />
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Mật khẩu *"
                  setData={formik.handleChange}
                  error={formik.touched.password && formik.errors.password}
                />
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Nhập lại mật khẩu *"
                  setData={formik.handleChange}
                  error={
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                  }
                />
              </>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            {step === 1 ? "Gửi OTP" : step === 2 ? "Xác nhận OTP" : "Đăng ký"}
          </button>
        </form>
        <div className="text-center p-3 dark:text-white">
          Đã có tài khoản?,{" "}
          <span className="text-blue-500">
            <Link to="/login">Đăng nhập</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
