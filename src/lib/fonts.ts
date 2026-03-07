import localFont from "next/font/local";

export const sfPro = localFont({
  src: [
    {
      path: "../../public/fonts/sf-pro/SF-Pro-Display-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/sf-pro/SF-Pro-Display-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/sf-pro/SF-Pro-Display-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/sf-pro/SF-Pro-Display-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/sf-pro/SF-Pro-Display-Heavy.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-sf-pro",
  display: "swap",
});
