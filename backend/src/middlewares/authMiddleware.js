import { StatusCodes } from "http-status-codes";
import { JwtProvider } from "~/providers/JwtProvider";
import { env } from "~/config/environment";

const isAuthorized = async (req, res, next) => {
  const accessToken = req.cookies?.accessToken;
  if (!accessToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessToken,
      env.ACCESS_TOKEN_PRIVATE_KEY
    );

    req.jwtDecoded = accessTokenDecoded;

    next();
  } catch (error) {
    // if accessToken expired
    if (error.message?.includes("jwt expired")) {
      return res
        .status(StatusCodes.GONE)
        .json({ message: "Need to refresh token" });
    }
    // if accessToken is invalid
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Unauthorized please login" });
  }
};

export const authMiddleware = { isAuthorized };
