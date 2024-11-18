import React, { useContext } from "react";
import UserHeader from "../../components/header/UserHeader";
import Input from "../../components/textfield/Input";
import authorizedAxiosInstance from "./../../utils/authorizedAxios";
import { env } from "../../config/environment";
import { LoadingContext } from "./../../contexts/LoadingContext";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";

function UserPage() {
  const { setIsLoading } = useContext(LoadingContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const formik = useFormik({
    initialValues: {
      telephone: user?.telephone || "",
      name: user?.name || "",
      address: user?.address || "",
    },
    validationSchema: Yup.object({
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
      address: Yup.string()
        .required("Địa chỉ không được để trống")
        .min(1, "Địa chỉ phải lớn hơn 1 ký tự")
        .max(200, "Địa chỉ phải bé hơn 200 ký tự")
        .trim()
        .strict(),
    }),
    onSubmit: async (values) => {
      try {
        const data = {
          telephone: values.telephone,
          name: values.name,
          address: values.address,
          email: user?.email,
        };
        setIsLoading(true);
        await authorizedAxiosInstance.put(
          `${env.API_URL}/v1/users/${user._id}`,
          data
        );
        setIsLoading(false);
        message.success("Sửa thông tin thành công");
        navigate("/");
      } catch (error) {
        setIsLoading(false);
        console.error(error);
      }
    },
  });
  return (
    <div className="">
      <UserHeader />
      {user && (
        <div className="flex flex-col justify-start items-center">
          <div className="w-full p-10  md:w-1/2 lg:w-1/3 xl:w-1/4">
            <div className="text-2xl text-blue-500 font-medium text-center uppercase">
              {user.name + ","}
            </div>
            <div className="text-gray-500 mb-10 text-center dark:text-white">
              Bạn có thể chỉnh sửa thông tin cá nhân tại đây
            </div>
            <form onSubmit={formik.handleSubmit} autoComplete="off">
              <div className="flex flex-col mb-14 gap-4">
                <Input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Tên *"
                  value={formik.values.name}
                  setData={formik.handleChange}
                  error={formik.touched.name && formik.errors.name}
                />
                <Input
                  type="text"
                  id="address"
                  name="address"
                  placeholder="Địa chỉ *"
                  value={formik.values.address}
                  setData={formik.handleChange}
                  error={formik.touched.address && formik.errors.address}
                />
                <Input
                  type="text"
                  id="telephone"
                  name="telephone"
                  placeholder="Số điện thoại *"
                  value={formik.values.telephone}
                  setData={formik.handleChange}
                  error={formik.touched.telephone && formik.errors.telephone}
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white px-4 py-2 rounded"
              >
                Cập nhật
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
