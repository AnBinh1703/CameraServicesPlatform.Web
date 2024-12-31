import { useState } from "react";
import {
  FaBoxOpen,
  FaChartPie,
  FaClipboardList,
  FaCogs,
  FaGift,
  FaHome,
  FaTags,
  FaUser,
} from "react-icons/fa";
import { MdClose, MdMenu } from "react-icons/md";
import { useSelector } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import "tailwindcss/tailwind.css";

const SideBar = () => {
  const roleName = useSelector((state) => state.user?.role || "");
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);

  const location = useLocation();

  const menuItems = {
    STAFF: [
      { name: "THỐNG KÊ", link: "dashboard", icon: <FaChartPie /> },
      { name: "DANH MỤC", link: "manage-category", icon: <FaTags /> },
      { name: "SẢN PHẨM", link: "manage-product", icon: <FaBoxOpen /> },
      { name: "VOUCHER", link: "manage-voucher", icon: <FaGift /> },
      {
        name: "GIAO DỊCH",
        link: "manage-transaction-system",
        icon: <FaClipboardList />,
      },
      { name: "QUẢN LÍ GÓI ĐĂNG KÍ", link: "manage-combo", icon: <FaCogs /> },
    ],

    SUPPLIER: [
      { name: "THỐNG KÊ", link: "dashboard", icon: <FaChartPie /> },
      { name: "Đăng kí Gói", link: "personal-supplier", icon: <FaHome /> },
      { name: "VOUCHER", link: "manage-voucher-of-supplier", icon: <FaGift /> },
      {
        name: "QUẢN LÍ SẢN PHẨM",
        link: "manage-product-of-supplier",
        icon: <FaBoxOpen />,
      },
      {
        name: "QUẢN LÍ ĐƠN HÀNG",
        link: "manage-order",
        icon: <FaClipboardList />,
      },
      {
        name: "QUẢN LÍ ĐIỂU KHOẢN HỢP ĐÔNG",
        link: "manage-contract-template",
        icon: <FaCogs />,
      },
      {
        name: "SẢN PHẨM BỊ BÁO CÁO",
        link: "manage-product-report-by-supplier",
        icon: <FaClipboardList />,
      },
    ],
    ADMIN: [
      { name: "THỐNG KÊ", link: "dashboard", icon: <FaChartPie /> },
      { name: "Người dùng", link: "manage-user", icon: <FaUser /> },
      {
        name: "Tổng quản lí sản phẩm hệ thống",
        link: "manage-product",
        icon: <FaBoxOpen />,
      },
      {
        name: "Quản lí Gói",
        link: "manage-combo",
        icon: <FaClipboardList />,
      },
      {
        name: "Quản lí chính sách",
        link: "manage-policy",
        icon: <FaClipboardList />,
      },
      {
        name: "Cấu hình",
        link: "settings",
        icon: <FaClipboardList />,
      },
    ],
  };

  const renderMenu = (items) => {
    if (!items) return null;
    return items.map((item) => (
      <li key={item.link} className="my-2">
        <NavLink
          to={`${item.link}`}
          className={`flex items-center p-2 rounded-lg transition-colors duration-200 ${
            location.pathname.includes(item.link)
              ? "bg-teal-600 text-white"
              : "text-gray-800 hover:bg-teal-100 hover:text-teal-600"
          }`}
        >
          {item.icon && <span className="w-6 h-6">{item.icon}</span>}
          <span className={`ml-3 ${!isOpen && "hidden"}`}>{item.name}</span>
        </NavLink>
      </li>
    ));
  };

  return (
    <div className="flex">
      <div
        className={`h-screen bg-white transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        } border-r border-gray-200`}
      >
        <div className="flex items-center justify-between p-4">
          {isOpen && <h1 className="text-2xl font-bold text-teal-600">Logo</h1>}
          <button onClick={toggleSidebar} className="focus:outline-none">
            {isOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
        <nav className="px-2">
          <ul>{roleName && renderMenu(menuItems[roleName])}</ul>
        </nav>
      </div>
      {/* ...existing main content... */}
    </div>
  );
};

export default SideBar;
