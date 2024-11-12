import React, { useContext } from "react";
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

  const formik = useFormik({
    initialValues: {
      email: "",
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
      telephone: Yup.string()
        .required("Số điện thoại không được để trống")
        .min(10, "Số điện thoại không hợp lệ")
        .max(10, "Số điện thoại không hợp lệ")
        .trim()
        .strict(),
      name: Yup.string()
        .required("Tên không được để trống")
        .min(1, "Tên phải lớn hơn 1 ký tự")
        .max(30, "Tên phải bé hơn 30 ký tự")
        .trim()
        .strict(),
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
      try {
        setIsLoading(true);
        const { confirmPassword, ...data } = values;
        await authorizedAxiosInstance.post(`${env.API_URL}/v1/users`, data);
        setIsLoading(false);
        message.success("Đăng ký thành công");
        navigate("/login");
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    },
  });

  return (
    <div className="flex flex-col justify-start items-center">
      <div className="w-full p-10  md:w-1/2 lg:w-1/3 xl:w-1/4 mt-8">
        <div className="text-2xl text-blue-500 font-medium text-center uppercase">
          Đăng ký
        </div>
        <div className="text-gray-500 mb-10 text-center">
          Tạo tài khoản mới của bạn
        </div>
        <form onSubmit={formik.handleSubmit} autoComplete="off">
          <div className="flex flex-col mb-14 gap-4">
            <Input
              type="text"
              id="email"
              name="email"
              placeholder="Email *"
              setData={formik.handleChange}
              error={formik.touched.email && formik.errors.email}
            />
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
              placeholder="Mật khẩu *"
              setData={formik.handleChange}
              error={formik.touched.password && formik.errors.password}
            />
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Nhập lai mật khẩu *"
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
            Đăng ký
          </button>
        </form>
        <div className="text-center p-3">
          Đã có tài khoản?,{" "}
          <span className="text-blue-500">
            <Link to="/login">Đăng nhập</Link>
          </span>
        </div>
      </div>
    </div>
  );
}
