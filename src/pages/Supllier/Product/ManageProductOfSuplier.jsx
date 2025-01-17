import { Tabs } from "antd";
import React, { useState } from "react";

import ProductListBySupplier from "./ProductListBySupplier";
const ManageProductOfSupplier = () => {
  const [refreshList, setRefreshList] = useState(false);

  const tabItems = [
    {
      key: "1",
      label: (
        <span className="font-medium text-lg text-gray-700">
          Sản phẩm của bạn
        </span>
      ),
      children: <ProductListBySupplier />,
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="p-8 bg-white rounded-lg shadow-lg max-w-1xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          TRANG QUẢN LÍ SẢN PHẨM
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
    </div>
  );
};

export default ManageProductOfSupplier;
