import express from "express";
import ms from "ms";
import passport from "passport";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/JwtProvider";

const router = express.Router();

// Route để bắt đầu quá trình đăng nhập với Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Route để xử lý callback từ Google
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${env.URL_FRONTEND}/login`,
  }),
  async (req, res) => {
    // Đăng nhập thành công, chuyển hướng về trang chủ
    const isPasswordEmpty = req.user.password === "" ? true : false;
    const userInfo = {
      _id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      telephone: req.user.telephone,
      address: req.user.address,
      isAdmin: req.user.isAdmin,
      isPasswordEmpty: isPasswordEmpty,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      "5m"
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_PRIVATE_KEY,
      "14m"
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: ms("14 days"),
    }),
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms("14 days"),
      });
    res.redirect(
      `${env.URL_FRONTEND}/product?user=${encodeURIComponent(
        JSON.stringify(userInfo)
      )}`
    );
  }
);

export const authGoogle = router;
