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
  }, []);

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
            <NavLink to="/personal-review">Đánh giá</NavLink>
            <NavLink to="/personal-order-history">Lịch sử đơn hàng</NavLink>
            <NavLink to="/create-report-form">Báo cáo </NavLink>
          </li>
          {roleName === "ADMIN" && (
            <NavLink to="/admin">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "STAFF" && (
            <NavLink to="/staff">
              <li>
                <span>Trang quản trị</span>
              </li>
            </NavLink>
          )}
          {roleName === "SUPPLIER" && (
            <NavLink to="/supllier">
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

        <Link
          to="/wishlist"
          className="hidden md:block  font-semibold no-underline text-primary  hover:text-gray-500"
        >
          Yêu thích
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
          to="/information-supplier"
          className="text-black hover:text-gray-500 no-underline"
        >
          Nhà cung cấp
        </NavLink>
        <NavLink
          to="/category"
          className="text-black hover:text-gray-500 no-underline"
        >
          Danh mục
        </NavLink>
        <NavLink
          to="/product-for-rent"
          className="text-black hover:text-gray-500 no-underline"
        >
          Sản phẩm cho thuê
        </NavLink>
        <NavLink
          to="/product-for-buy"
          className="text-black hover:text-gray-500 no-underline"
        >
          Sản phẩm mua
        </NavLink>
        <NavLink
          to="/policy"
          className="text-black hover:text-gray-500 no-underline"
        >
          Chính sách
        </NavLink>
        <NavLink
          to="/about"
          className="text-black hover:text-gray-500 no-underline"
        >
          Về chúng tôi
        </NavLink>

        <NavLink
          to="/contact"
          className="text-black hover:text-gray-500 no-underline"
        >
          Liên hệ
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
              to="/wishlist"
              className="hidden md:block  font-semibold no-underline text-primary  hover:text-gray-500"
            >
              Wishlist
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
