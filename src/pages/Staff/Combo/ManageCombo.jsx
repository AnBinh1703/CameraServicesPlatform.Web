import { Tabs } from "antd";
import React, { useState } from "react";
import ComboList from "./ComboList";
import ComboSupplierList from "./ComboSupplierList";
import ExpiredCombosOfSupplier from "./ExpiredCombosOfSupplier";
import NearExpiredCombosOfSupplier from "./NearExpiredCombosOfSupplier";

const ManageCombo = () => {
  const [refreshList, setRefreshList] = useState(false);
  const [activeSupplierTab, setActiveSupplierTab] = useState("supplier");

  const renderSupplierContent = () => {
    switch (activeSupplierTab) {
      case "supplier":
        return <ComboSupplierList refresh={refreshList} />;
      case "near-expired":
        return <NearExpiredCombosOfSupplier />;
      case "expired":
        return <ExpiredCombosOfSupplier />;
      default:
        return <ComboSupplierList refresh={refreshList} />;
    }
  };

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="font-medium text-lg text-gray-700">
          Danh sách combo
        </span>
      ),
      children: <ComboList refresh={refreshList} />,
    },
    {
      key: "2",
      label: (
        <span className="font-medium text-lg text-gray-700">
          Quản lí gói đăng kí cho nhà cung cấp
        </span>
      ),
      children: (
        <div className="md:flex gap-4">
          <ul className="flex-column space-y-4 text-sm font-medium text-gray-500 md:me-4 mb-4 md:mb-0">
            <li>
              <button
                onClick={() => setActiveSupplierTab("supplier")}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                  activeSupplierTab === "supplier"
                    ? "text-white bg-blue-700"
                    : "text-gray-900 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Quản lí gói đăng kí cho nhà cung cấp
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSupplierTab("near-expired")}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                  activeSupplierTab === "near-expired"
                    ? "text-white bg-blue-700"
                    : "text-gray-900 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Gói sắp hết hạn
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveSupplierTab("expired")}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full ${
                  activeSupplierTab === "expired"
                    ? "text-white bg-blue-700"
                    : "text-gray-900 bg-gray-50 hover:bg-gray-100"
                }`}
              >
                Gói đã hết hạn
              </button>
            </li>
          </ul>
          <div className="flex-1">
            {renderSupplierContent()}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-white rounded-lg shadow-lg max-w-1xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        TRANG QUẢN LÍ COMBO - STAFF
      </h1>
      <Tabs
        defaultActiveKey="1"
        items={tabItems}
        className="custom-tabs"
        tabBarStyle={{
          padding: "1rem",
          backgroundColor: "#f1f5f9",
          borderRadius: "4px",
          fontSize: "1rem",
        }}
        tabBarExtraContent={<span className="text-gray-500 italic"></span>}
      />
      <style jsx>{`
        @media (forced-colors: active) {
          /* Styles for forced colors mode */
          body {
            background-color: Window;
            color: WindowText;
          }
          .custom-tabs {
            background-color: Window;
            border-color: WindowText;
          }
          .ant-tabs-card {
            background-color: Window;
          }
        }
      `}</style>
    </div>
  );
};

export default ManageCombo;
