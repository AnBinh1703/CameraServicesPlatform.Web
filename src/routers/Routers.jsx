import React from "react";
import { Navigate, useRoutes } from "react-router-dom";
import CommonLayout from "../layouts/CommonLayout";
import ManagementLayOut from "../layouts/ManagementLayout/ManagementLayOut";
import ManagePolicy from "../pages/Admin/Policy/ManagePolicy";
import ManageUser from "../pages/Admin/User/ManageUser";
import CreateStaffForm from "../pages/Admin/User/Staff/CreateStaffForm";
import About from "../pages/Common/About";
import Cart from "../pages/Common/Cart";
import Category from "../pages/Common/Category";
import Contact from "../pages/Common/Contact";
import ErrorPage from "../pages/Common/ErrorPage";
import Home from "../pages/Common/Home";
import InformationSupplier from "../pages/Common/InformationSupplier";
import LoginPage from "../pages/Common/LoginPage";
import CreateOrderBuy from "../pages/Common/Order/CreateOrderBuy/CreateOrderBuy";
import PersonalInformation from "../pages/Common/PersonalInformation";
import Policy from "../pages/Common/Policy";
import ProductDetailPage from "../pages/Common/Product/ProductDetailPage";
import ProductPage from "../pages/Common/Product/ProductPage";
import ProductPageBuy from "../pages/Common/Product/ProductPageBuy";
import ProductPageRent from "../pages/Common/Product/ProductPageRent";

import ManageComboByAd from "../pages/Admin/Combo/ManageComboByAd";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import ManageReportRating from "../pages/Admin/ManageReportRating";
import Settings from "../pages/Admin/Settings";
import Transaction from "../pages/Admin/Transaction";
import CreateOrderRent from "../pages/Common/Order/CreateOrderRent/CreateOrderRent";
import OrderHistory from "../pages/Common/OrderHistory";
import PersonalReview from "../pages/Common/PersonalReview";
import ManageCreateReportForm from "../pages/Common/Report/ManageCreateReportForm";
import Responsibilities from "../pages/Common/Responsibilities";
import VerifyPayment from "../pages/Common/VerifyPayment";
import Wishlist from "../pages/Common/Wishlish/Wishlist";
import OrderDetail from "../pages/CommonManager/OrderDetail";
import RegisterSupplier from "../pages/CommonManager/RegisterSupplier";
import ManageCategory from "../pages/Staff/Category/ManageCategory";
import ManageCombo from "../pages/Staff/Combo/ManageCombo";
import DashboardStaff from "../pages/Staff/DashboardStaff";
import ManageProduct from "../pages/Staff/Product/ManageProduct";
import ManageTransactionSystem from "../pages/Staff/Transaction/ManageTransactionSystem";
import ManageVoucher from "../pages/Staff/Voucher/ManageVoucher";
import ManageContractTemplate from "../pages/Supllier/ContractTemplate/ManageContractTemplate";
import DashboardSupplier from "../pages/Supllier/DashboardSupplier";
import InformationSupplierDetail from "../pages/Supllier/InformationSupllierDetail";
import ManageOrder from "../pages/Supllier/Order/ManageOrder";
import PersonalPage from "../pages/Supllier/PersonalPage";
import DetailProduct from "../pages/Supllier/Product/DetailProduct";
import ManageProductOfSuplier from "../pages/Supllier/Product/ManageProductOfSuplier";
import ManageReportProductOfSupplier from "../pages/Supllier/ReportProduct/ManageReportProductOfSupplier";
import ManageVoucherOfSuplier from "../pages/Supllier/Voucher/ManageVoucherOfSuplier";
import ProtectedRouteAdmin from "./PrivateRoute/ProtectedRouteAdmin";
import ManageSupplierByStaff from "../pages/Supllier/ManageSupplierByStaff";
function Routers() {
  const routing = useRoutes([
    {
      path: "*",
      element: <ErrorPage />,
    },
    {
      path: "/",
      element: <CommonLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: "login", element: <LoginPage /> },
        { path: "verify-payment/*", element: <VerifyPayment /> },
        { path: "about", element: <About /> },
        { path: "contact", element: <Contact /> },
        { path: "policy", element: <Policy /> },
        { path: "cart", element: <Cart /> },
        { path: "personal-information", element: <PersonalInformation /> },
        { path: "register-supplier", element: <RegisterSupplier /> },
        { path: "product", element: <ProductPage /> },
        { path: "product-for-rent", element: <ProductPageRent /> },
        { path: "product-for-buy", element: <ProductPageBuy /> },
        { path: "create-order-buy", element: <CreateOrderBuy /> },
        { path: "create-order-rent", element: <CreateOrderRent /> },
        { path: "personal-review", element: <PersonalReview /> },
        { path: "personal-order-history", element: <OrderHistory /> },
        { path: "/product/:id", element: <ProductDetailPage /> },
        { path: "order-detail", element: <OrderDetail /> },
        { path: "category", element: <Category /> },
        { path: "information-supplier", element: <InformationSupplier /> },
        {
          path: "supplier-information-detail/:id",
          element: <InformationSupplierDetail />,
        },
        {
          path: "wishlist",
          element: <Wishlist />,
        },
        {
          path: "create-report-form",
          element: <ManageCreateReportForm />,
        },
      ],
    },
    {
      path: "admin",
      element: (
        <ProtectedRouteAdmin>
          <ManagementLayOut />
        </ProtectedRouteAdmin>
      ),
      children: [
        { path: "dashboard", element: <DashboardAdmin /> },

        {
          path: "manage-user",
          element: <ManageUser />,
        },
        {
          path: "report-rating",
          element: <ManageReportRating />,
        },
        {
          path: "settings",
          element: <Settings />,
        },
        { path: "manage-policy", element: <ManagePolicy /> },
        { path: "manage-category", element: <ManageCategory /> },
        { path: "manage-product", element: <ManageProduct /> },
        { path: "manage-combo", element: <ManageComboByAd /> },

        { path: "create-staff", element: <CreateStaffForm /> },
        { path: "transaction-ad", element: <Transaction /> },
      ],
    },
    {
      path: "supllier",
      element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        {
          path: "dashboard",
          element: <DashboardSupplier />,
        },
        {
          path: "personal-supplier",
          element: <PersonalPage />,
        },
        {
          path: "manage-voucher-of-supplier",
          element: <ManageVoucherOfSuplier />,
        },
        {
          path: "manage-product-of-supplier",
          element: <ManageProductOfSuplier />,
        },
        {
          path: "supplier-information-detail/:id",
          element: <InformationSupplierDetail />,
        },
        {
          path: "product/details/:productID",
          element: <DetailProduct />,
        },
        {
          path: "manage-order",
          element: <ManageOrder />,
        },
        {
          path: "manage-contract-template",
          element: <ManageContractTemplate />,
        },
        {
          path: "manage-product-report-by-supplier",
          element: <ManageReportProductOfSupplier />,
        },
        {
          path: "responsibilities-rights",
          element: <Responsibilities />,
        },
      ],
    },

    {
      path: "staff",
      element: <ManagementLayOut />,
      children: [
        { index: true, element: <Navigate to="dashboard" replace /> },
        { path: "dashboard", element: <DashboardStaff /> },
        { path: "manage-suppplier", element: <ManageSupplierByStaff /> },

        { path: "manage-category", element: <ManageCategory /> },
        { path: "manage-product", element: <ManageProduct /> },
        { path: "manage-voucher", element: <ManageVoucher /> },
        { path: "manage-combo", element: <ManageCombo /> },
        {
          path: "manage-transaction-system",
          element: <ManageTransactionSystem />,
        },
        {
          path: "report-rating",
          element: <ManageReportRating />,
        },
      ],
    },
  ]);

  return routing;
}

export default Routers;
