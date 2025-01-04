import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="mt-4 p-4 bg-black text-white rounded-md border-t-2 border-red-600 container mx-auto">
      <div className="flex flex-col md:flex-row">
        <div className="px-5">
          <div className="flex items-center gap-2 mb-5">
            <h1 className="text-2xl font-bold text-red-600">
              CameraServicePlatform
            </h1>
          </div>
          <p className="opacity-75 mb-5">
            "Đặt lịch cùng chúng tôi để có những trải nghiệm tuyệt vời nhất!"
            <br />
          </p>
        </div>

        <div className="px-5">
          <h2 className="text-xl mb-5 text-red-600">
            Dịch vụ chăm sóc khách hàng
          </h2>
          <ul className="opacity-75">
            <li className="mb-2">
              <Link to="/policy" className="hover:text-red-300">
                Chính sách
              </Link>
            </li>
          </ul>
        </div>
        <div className="px-5">
          <h2 className="text-xl mb-5 text-red-600">Liên hệ</h2>
          <ul className="opacity-75">
            <li className="mb-2">
              Đại Học FPT Hồ Chí Minh, Quận 9, Thành Phố Hồ Chí Minh
            </li>
            <li className="mb-2">Email: example@gmail.com</li>
            <li className="mb-2">Phone: +84 366 967 957</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
