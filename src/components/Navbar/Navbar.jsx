import "font-awesome/css/font-awesome.min.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../images/image.png";
import { logout } from "../../redux/features/authSlice";
import { isEmptyObject } from "../../utils/util";

const NavBar = () => {
  const { user } = useSelector((state) => state.user || {});
  const dispatch = useDispatch();
  const [expand, setExpand] = useState(false);
  const [isFixed, setIsFixed] = useState(false);
  const roleName = useSelector((state) => state.user?.role || "");
  const navigate = useNavigate();

  useEffect(() => {
    const scrollHandler = () => {
      setIsFixed(window.scrollY >= 100);
    };
    window.addEventListener("scroll", scrollHandler);
    return () => window.removeEventListener("scroll", scrollHandler);
  }, [roleName]);

  const handleLogOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    dispatch(logout());
    navigate("/");
    toast.success("Đăng xuất thành công");
  };

  const renderDropDown = () => {
    return (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="cursor-pointer m-1 text-black"
        >
          <i className="fa-solid fa-user"></i>
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-box w-52"
        >
          <li>
            <NavLink to="/personal-information">Tài khoản</NavLink>
            <NavLink to="/personal-cart">Giỏ hàng</NavLink>
            <NavLink to="/personal-review">Đánh giá</NavLink>
            <NavLink to="/personal-order-history">Lịch sử đơn hàng</NavLink>
          </li>
          {roleName === "ADMIN" && (
            <NavLink to="/admin">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "isStaff" && (
            <NavLink to="/staff">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "isShop" && (
            <NavLink to="/management-shop">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          <li onClick={handleLogOut}>
            <a>Đăng xuất</a>
          </li>
        </ul>
      </div>
    );
  };

  return (
    <div
      className={`w-full transition-all duration-300 z-10 ${
        isFixed ? "bg-white shadow-xl py-2" : "bg-white shadow-md py-4"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <NavLink
          to="/"
          className="flex items-center gap-2 no-underline text-black"
        >
          <img src={logo} alt="Logo" className="h-12" />
        </NavLink>

        <div className="relative hidden md:flex items-center">
          <input
            type="text"
            placeholder="Nhập sản phẩm bạn đang tìm kiếm"
            className="border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
          />
          <button className="bg-red-500 text-white rounded-r-md px-6 py-2">
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
        <Link
          to="/gio-hang"
          className="hidden md:block  font-semibold no-underline text-primary  hover:text-gray-500"
        >
          Giỏ hàng
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            renderDropDown()
          ) : (
            <>
              <Link
                to="/login"
                className="no-underline font-semibold text-black hover:text-gray-500"
              >
                Đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hidden md:flex items-center flex-grow justify-center space-x-6">
        <NavLink to="/" className="text-black hover:text-gray-500 no-underline">
          Trang chủ
        </NavLink>
        <NavLink
          to="/lien-he"
          className="text-black hover:text-gray-500 no-underline"
        >
          Liên hệ
        </NavLink>
        <NavLink
          to="/san-pham-cho-thue"
          className="text-black hover:text-gray-500 no-underline"
        >
          Sản phẩm cho thuê
        </NavLink>
        <NavLink
          to="/san-pham-mua"
          className="text-black hover:text-gray-500 no-underline"
        >
          Sản phẩm mua
        </NavLink>
        <NavLink
          to="/chinh-sach"
          className="text-black hover:text-gray-500 no-underline"
        >
          Chính sách
        </NavLink>
        <NavLink
          to="/ve-chung-toi"
          className="text-black hover:text-gray-500 no-underline"
        >
          Về chúng tôi
        </NavLink>
      </div>

      {expand && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-red-100"
            >
              Trang chủ
            </Link>
            <Link
              to="/gio-hang"
              className="hidden md:block  font-semibold no-underline text-primary  hover:text-gray-500"
            >
              Giỏ hàng
            </Link>
            {isEmptyObject(user) ||
              (user == null && (
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-red-100"
                >
                  Đăng nhập
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
