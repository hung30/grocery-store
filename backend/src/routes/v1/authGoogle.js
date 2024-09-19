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
    failureRedirect: "http://localhost:3000/login",
  }),
  async (req, res) => {
    // Đăng nhập thành công, chuyển hướng về trang chủ
    const { password, ...userInfo } = req.user;
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_PRIVATE_KEY,
      "1m"
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
      `http://localhost:3000/product?user=${encodeURIComponent(
        JSON.stringify(userInfo)
      )}`
    );
  }
);

export const authGoogle = router;
