import React, { useContext } from "react";
import UserHeader from "../../components/header/UserHeader";
import { LoadingContext } from "../../contexts/LoadingContext";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { message } from "antd";
import Input from "../../components/textfield/Input";

function ChangePasswordPage() {
  const { setIsLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));

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
      const data = {
        password,
        userId: user?._id,
      };
      console.log(data);
      try {
        setIsLoading(true);
        await authorizedAxiosInstance.put(
          `${env.API_URL}/v1/users/reset-password`,
          data
        );
        setIsLoading(false);
        const updatedUser = {
          ...user,
          isPasswordEmpty: false,
        };
        localStorage.setItem("userInfo", JSON.stringify(updatedUser));
        message.success("Đổi mật khẩu thành công");
        navigate("/");
      } catch (error) {
        setIsLoading(false);
        console.log(error);
      }
    },
  });
  return (
    <div className="">
      <UserHeader />
      <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-neutral-900 py-10">
        <form
          onSubmit={formik.handleSubmit}
          className="bg-gray-100 p-6 rounded shadow-md w-80 dark:bg-neutral-900 dark:shadow-none"
        >
          <div className="text-2xl text-blue-500 font-medium text-center uppercase">
            Thay đổi mật khẩu
          </div>
          <div className="text-gray-500 mb-10 text-center  dark:text-white">
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
              placeholder="Nhập lại mật khẩu"
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
      </div>
    </div>
  );
}

export default ChangePasswordPage;
