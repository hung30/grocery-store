import { message } from "antd";
import React, { useContext, useState } from "react";
import authorizedAxiosInstance from "../../utils/authorizedAxios";
import { LoadingContext } from "../../contexts/LoadingContext";
import { env } from "../../config/environment";

export default function ContactPage() {
  const { setIsLoading } = useContext(LoadingContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      message.error("Vui lòng điền đầy đủ các trường!");
      return;
    }

    try {
      setIsLoading(true);
      await authorizedAxiosInstance.post(
        `${env.API_URL}/v1/users/send-contact-email`,
        formData
      );
      message.success("Gửi thành công!");
      setFormData({ name: "", email: "", message: "" });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <section className="p-5 dark:text-white">
        <div className="text-center">
          <h2 className="text-center text-3xl font-normal pb-3">
            Thông tin liên hệ
          </h2>
          <p className="text-center text-sm py-1">
            Địa chỉ: Số 75A đường 16A thôn 7 xã Hoà Thuận
          </p>
          <p className="text-center text-sm py-1">Điện thoại: 0123 456 789</p>
          <p className="text-center text-sm py-1">
            Email: hungbmt303@gmail.com
          </p>
          <h2 className="text-center text-3xl font-normal py-3">
            Form liên hệ
          </h2>
        </div>
        <form
          onSubmit={handleSubmit}
          className="max-w-lg mx-auto bg-white p-5 rounded-md border dark:bg-neutral-900"
        >
          <label htmlFor="name" className="block mb-2">
            Họ và tên:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:bg-gray-300"
            required
          />
          <label htmlFor="email" className="block mb-2">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md dark:bg-gray-300"
            required
          />
          <label htmlFor="message" className="block mb-2">
            Nội dung:
          </label>
          <textarea
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300 rounded-md resize-none dark:bg-gray-300"
            required
          ></textarea>
          <div className="text-center">
            <button
              type="submit"
              className="w-20 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Gửi
            </button>
          </div>
        </form>
      </section>
    </>
  );
}
