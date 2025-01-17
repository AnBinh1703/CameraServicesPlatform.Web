import { useState } from "react";
import {
  RiBarChartBoxLine,
  RiStore2Line,
  RiFileWarningFill,
  RiCoupon3Line,
  RiExchangeDollarLine,
  RiHome8Line,
  RiMenuFoldFill,
  RiMenuUnfoldFill,
  RiPriceTag2Fill,
  RiSettings3Line,
  RiShoppingBag2Fill,
  RiBuilding4Line,
  RiUser2Fill,
  RiFileTextLine,
  RiShieldUserLine,
  RiMoneyDollarBoxLine,
  RiFileListFill,
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
      { name: "THỐNG KÊ", link: "dashboard", icon: <RiBarChartBoxLine /> },
      { name: "DANH MỤC", link: "manage-category", icon: <RiPriceTag2Fill /> },
      { name: "SẢN PHẨM", link: "manage-product", icon: <RiStore2Line /> },
      { name: "VOUCHER", link: "manage-voucher", icon: <RiCoupon3Line /> },
      {
        name: "GIAO DỊCH",
        link: "manage-transaction-system",
        icon: <RiExchangeDollarLine />,
      },
      { name: "NHÀ CUNG CẤP", link: "manage-suppplier", icon: <RiBuilding4Line /> },
      {
        name: "QUẢN LÍ GÓI ĐĂNG KÍ",
        link: "manage-combo",
        icon: <RiFileTextLine />,
      },
    ],

    SUPPLIER: [
      { name: "THỐNG KÊ", link: "dashboard", icon: <RiBarChartBoxLine /> },
      { name: "ĐĂNG KÍ GÓI", link: "personal-supplier", icon: <RiHome8Line /> },
      {
        name: "VOUCHER",
        link: "manage-voucher-of-supplier",
        icon: <RiCoupon3Line />,
      },
      {
        name: "QUẢN LÍ SẢN PHẨM",
        link: "manage-product-of-supplier",
        icon: <RiStore2Line />,
      },
      {
        name: "QUẢN LÍ ĐƠN HÀNG",
        link: "manage-order",
        icon: <RiShoppingBag2Fill />,
      },
      {
        name: "QUẢN LÍ ĐIỀU KHOẢN HỢP ĐỒNG",
        link: "manage-contract-template",
        icon: <RiFileListFill />,
      },
      {
        name: "SẢN PHẨM BỊ BÁO CÁO",
        link: "manage-product-report-by-supplier",
        icon: <RiFileWarningFill />,
      },
      {
        name: "TRÁCH NHIỆM VÀ QUYỀN LỢI",
        link: "responsibilities-rights",
        icon: <RiShieldUserLine />,
      },
    ],

    ADMIN: [
      { name: "THỐNG KÊ", link: "dashboard", icon: <RiBarChartBoxLine /> },
      { name: "NGƯỜI DÙNG", link: "manage-user", icon: <RiUser2Fill /> },
      {
        name: "TỔNG QUẢN LÍ SẢN PHẨM HỆ THỐNG",
        link: "manage-product",
        icon: <RiStore2Line />,
      },
      { name: "QUẢN LÍ GÓI", link: "manage-combo", icon: <RiFileTextLine /> },
      {
        name: "QUẢN LÍ CHÍNH SÁCH",
        link: "manage-policy",
        icon: <RiSettings3Line />,
      },
      {
        name: "BÁO CÁO - ĐÁNH GIÁ",
        link: "report-rating",
        icon: <RiFileWarningFill />,
      },
      { name: "CẤU HÌNH", link: "settings", icon: <RiSettings3Line /> },
      { name: "GIAO DỊCH", link: "transaction-ad", icon: <RiMoneyDollarBoxLine /> },
    ],
  };

  const renderMenu = (items) => {
    if (!items) return null;
    return items.map((item) => (
      <li key={item.link} className="my-2">
        <NavLink
          to={`${item.link}`}
          className={`flex items-center p-3.5 rounded-xl transition-all duration-300 group ${
            location.pathname.includes(item.link)
              ? "bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-lg shadow-teal-100"
              : "text-gray-600 hover:bg-teal-50/80 hover:text-teal-600 hover:translate-x-1"
          }`}
        >
          {item.icon && (
            <span
              className={`w-6 h-6 transition-all duration-300 ${
                location.pathname.includes(item.link)
                  ? "scale-110 text-white"
                  : "group-hover:scale-110"
              }`}
            >
              {item.icon}
            </span>
          )}
          <span
            className={`ml-3.5 font-medium text-sm ${
              !isOpen && "hidden"
            } whitespace-nowrap transition-opacity duration-200`}
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
        className={`h-screen bg-white transition-all duration-300 ease-in-out ${
          isOpen ? "w-80" : "w-20"
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
            className="p-2.5 rounded-xl hover:bg-teal-50 text-teal-600 transition-all duration-200 hover:shadow-sm"
          >
            {isOpen ? (
              <RiMenuFoldFill size={24} />
            ) : (
              <RiMenuUnfoldFill size={24} />
            )}
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {roleName && renderMenu(menuItems[roleName])}
          </ul>
        </nav>
      </div>
      {/* ...existing main content... */}
    </div>
  );
};

export default SideBar;
