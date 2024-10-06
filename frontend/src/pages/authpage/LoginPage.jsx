import { useContext, useState } from "react";
import Input from "../../components/textfield/Input";
import authorizedAxiosInstance from "./../../utils/authorizedAxios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../redux/authSlice";
import { env } from "../../config/environment";
import { LoadingContext } from "../../contexts/LoadingContext";
import googleLogo from "../../assets/googleLogo.png";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setIsLoading } = useContext(LoadingContext);
  const loginHandle = async () => {
    try {
      const data = {
        email: userEmail,
        password: password,
      };
      setIsLoading(true);

      const res = await authorizedAxiosInstance.post(
        `${env.API_URL}/v1/users/login`,
        data
      );
      localStorage.setItem("userInfo", JSON.stringify(res.data.userInfo));
      dispatch(loginSuccess(res.data.userInfo));
      setIsLoading(false);
      navigate("/product");
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col justify-start items-center">
      <div className="w-full p-10  md:w-1/2 lg:w-1/3 xl:w-1/4 mt-8">
        <div className="text-2xl text-blue-500 font-medium text-center uppercase">
          Chào mừng trở lại
        </div>
        <div className="text-gray-500 mb-10 text-center">
          Đăng nhập vào tài khoản của bạn
        </div>
        <div className="flex flex-col mb-4 gap-4">
          <Input
            type="email"
            placeholder="Email"
            setData={(e) => setUserEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Mật khẩu"
            setData={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-end text-blue-500 mb-10 mt-[-10px]">
          <a href="/forgot-password">Quên mật khẩu?</a>
        </div>
        <button
          className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          onClick={loginHandle}
        >
          Đăng nhập
        </button>
        <div className="text-center p-3 mb-4">
          Không có tài khoản?,{" "}
          <span className="text-blue-500">
            <a href="/register">Đăng ký</a>
          </span>
        </div>
        <div className="flex justify-center items-center mb-4">
          <div className="ct-subheadline-deco-line"></div>
          <div className="ct-subheadline-label">Hoặc</div>
          <div className="ct-subheadline-deco-line"></div>
        </div>
        <div className="text-gray-500">
          <div className="text-center text-xl  mb-2">Đăng nhập với: </div>
          <a
            href={`${env.API_URL}/v1/auth-google/google`}
            className="flex flex-row justify-center items-center gap-2"
          >
            <img src={googleLogo} width={40} height={40} alt="google" />
            <div className="text-lg">Google</div>
          </a>
        </div>
      </div>
    </div>
  );
}
