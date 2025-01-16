import { useState } from "react";
import {
  RiDashboardLine,
  RiFileListLine,
  RiFileWarningLine,
  RiGiftLine,
  RiHandCoinLine,
  RiHome4Line,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiPriceTag3Line,
  RiSettings4Line,
  RiShoppingBag3Line,
  RiStore3Line,
  RiUser3Line,
} from "react-icons/ri";
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
      { name: "THỐNG KÊ", link: "dashboard", icon: <RiDashboardLine /> },
      { name: "DANH MỤC", link: "manage-category", icon: <RiPriceTag3Line /> },
      { name: "SẢN PHẨM", link: "manage-product", icon: <RiStore3Line /> },
      { name: "VOUCHER", link: "manage-voucher", icon: <RiGiftLine /> },
      {
        name: "GIAO DỊCH",
        link: "manage-transaction-system",
        icon: <RiFileListLine />,
      },
      { name: "NHÀ CUNG CẤP", link: "manage-suppplier" },
      {
        name: "QUẢN LÍ GÓI ĐĂNG KÍ",
        link: "manage-combo",
        icon: <RiSettings4Line />,
      },
    ],

    SUPPLIER: [
      { name: "THỐNG KÊ", link: "dashboard", icon: <RiDashboardLine /> },
      { name: "ĐĂNG KÍ GÓI", link: "personal-supplier", icon: <RiHome4Line /> },
      {
        name: "VOUCHER",
        link: "manage-voucher-of-supplier",
        icon: <RiGiftLine />,
      },
      {
        name: "QUẢN LÍ SẢN PHẨM",
        link: "manage-product-of-supplier",
        icon: <RiStore3Line />,
      },
      {
        name: "QUẢN LÍ ĐƠN HÀNG",
        link: "manage-order",
        icon: <RiShoppingBag3Line />,
      },
      {
        name: "QUẢN LÍ ĐIỀU KHOẢN HỢP ĐỒNG",
        link: "manage-contract-template",
        icon: <RiFileListLine />,
      },
      {
        name: "SẢN PHẨM BỊ BÁO CÁO",
        link: "manage-product-report-by-supplier",
        icon: <RiFileWarningLine />,
      },
      {
        name: "TRÁCH NHIỆM VÀ QUYỀN LỢI",
        link: "responsibilities-rights",
        icon: <RiHandCoinLine />,
      },
      // {
      //   name: "BÁO CÁO - ĐÁNH GIÁ",
      //   link: "report-rating",
      //   icon: <RiSettings4Line />,
      // },
    ],

    ADMIN: [
      { name: "THỐNG KÊ", link: "dashboard", icon: <RiDashboardLine /> },
      { name: "NGƯỜI DÙNG", link: "manage-user", icon: <RiUser3Line /> },
      {
        name: "TỔNG QUẢN LÍ SẢN PHẨM HỆ THỐNG",
        link: "manage-product",
        icon: <RiStore3Line />,
      },
      { name: "QUẢN LÍ GÓI", link: "manage-combo", icon: <RiFileListLine /> },
      {
        name: "QUẢN LÍ CHÍNH SÁCH",
        link: "manage-policy",
        icon: <RiSettings4Line />,
      },
      // {
      //   name: "BÁO CÁO - ĐÁNH GIÁ",
      //   link: "report-rating",
      //   icon: <RiSettings4Line />,
      // },

      { name: "CẤU HÌNH", link: "settings", icon: <RiSettings4Line /> },
      { name: "GIAO DỊCH", link: "transaction-ad", icon: <RiSettings4Line /> },
    ],
  };

  const renderMenu = (items) => {
    if (!items) return null;
    return items.map((item) => (
      <li key={item.link} className="my-1">
        <NavLink
          to={`${item.link}`}
          className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
            location.pathname.includes(item.link)
              ? "bg-teal-600 text-white shadow-md"
              : "text-gray-600 hover:bg-teal-50 hover:text-teal-600 hover:translate-x-1"
          }`}
        >
          {item.icon && (
            <span
              className={`w-6 h-6 transition-transform duration-200 ${
                location.pathname.includes(item.link) ? "scale-110" : ""
              }`}
            >
              {item.icon}
            </span>
          )}
          <span
            className={`ml-3 font-medium ${
              !isOpen && "hidden"
            } whitespace-nowrap`}
          >
            {item.name}
          </span>
        </NavLink>
      </li>
    ));
  };

  return (
    <div className="flex">
      <div
        className={`h-screen bg-white transition-all duration-300 ${
          isOpen ? "w-72" : "w-20"
        } border-r border-gray-100 shadow-sm`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {isOpen && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Logo
            </h1>
          )}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors duration-200"
          >
            {isOpen ? (
              <RiMenuFoldLine size={24} />
            ) : (
              <RiMenuUnfoldLine size={24} />
            )}
          </button>
        </div>
        <nav className="p-3">
          <ul className="space-y-1">
            {roleName && renderMenu(menuItems[roleName])}
          </ul>
        </nav>
      </div>
      {/* ...existing main content... */}
    </div>
  );
};

export default SideBar;
