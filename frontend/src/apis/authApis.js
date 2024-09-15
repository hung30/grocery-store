import { env } from "../config/environment";
import authorizedAxiosInstance from "../utils/authorizedAxios";

export const handleLogoutAPI = async () => {
  localStorage.removeItem("userInfo");
  return await authorizedAxiosInstance.delete(`${env.API_URL}/v1/users/logout`);
};

export const refreshTokenAPI = async () => {
  return await authorizedAxiosInstance.put(
    `${env.API_URL}/v1/users/refresh-token`
  );
};
