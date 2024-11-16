import React from "react";

export default function Footer() {
  return (
    <div className="bg-blue-400 shadow dark:bg-slate-700 px-4 py-3 xs:py-5">
      <div className="flex flex-col xs:flex-row justify-center items-center">
        <span className="text-sm text-yellow-100 dark:text-white basis-1/2 text-start whitespace-nowrap">
          © 2023{" "}
          <a href="https://flowbite.com/" className="hover:underline">
            Flowbite™
          </a>
          . All Rights Reserved.
        </span>
        <div className="text-sm text-yellow-100 dark:text-white basis-1/2 text-end">
          Write by:{" "}
          <span className="text-yellow-300">
            <a href="https://www.facebook.com/dinhhung.304/">
              Nguyễn Đình Hưng
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
