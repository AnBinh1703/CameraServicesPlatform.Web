import { Tabs } from "antd";
import { useState } from "react";
import ManageUserList from "./ManageUserList";
import CreateStaffForm from "./Staff/CreateStaffForm";
import ManageStaffList from "./Staff/ManageStaff";
import Combo from "./Supplier/Combo";
import ManageSupplier from "./Supplier/ManageSupplier";
import SendActivationCode from "./Supplier/SendActiveSupplier";

const ManageUser = () => {
  const [activeSupplierTab, setActiveSupplierTab] = useState("list");
  const [activeStaffTab, setActiveStaffTab] = useState("list"); // Add this state

  const items = [
    {
      key: "1",
      label: "Danh Sách Người Dùng",
      children: <ManageUserList />,
    },
    {
      key: "2",
      label: "Danh Sách Nhà Cung Cấp",
      children: (
        <div className="md:flex gap-4">
          <ul className="flex-column space-y-2 text-sm font-medium text-gray-500 dark:text-gray-400 md:w-64">
            <li>
              <a
                onClick={() => setActiveSupplierTab("list")}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full cursor-pointer ${
                  activeSupplierTab === "list"
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 me-2 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                Danh sách nhà cung cấp
              </a>
            </li>
            <li>
              <a
                onClick={() => setActiveSupplierTab("activate")}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full cursor-pointer ${
                  activeSupplierTab === "activate"
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                </svg>
                Cấp quyền hoạt động
              </a>
            </li>
            <li>
              <a
                onClick={() => setActiveSupplierTab("combo")}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full cursor-pointer ${
                  activeSupplierTab === "combo"
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 0H1C0.447715 0 0 0.447715 0 1V5C0 5.55228 0.447715 6 1 6H5C5.55228 6 6 5.55228 6 5V1C6 0.447715 5.55228 0 5 0Z" />
                </svg>
                Quản lý gói Combo của các nhà cung cấp
              </a>
            </li>
          </ul>
          <div className="flex-1 p-6 bg-white shadow-sm rounded-lg">
            {activeSupplierTab === "list" ? (
              <ManageSupplier />
            ) : activeSupplierTab === "activate" ? (
              <SendActivationCode />
            ) : (
              <Combo />
            )}
          </div>
        </div>
      ),
    },
    {
      key: "3",
      label: "Quản lí nhân viên",
      children: (
        <div className="md:flex gap-4">
          <ul className="flex-column space-y-2 text-sm font-medium text-gray-500 dark:text-gray-400 md:w-64">
            <li>
              <a
                onClick={() => setActiveStaffTab("list")}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full cursor-pointer ${
                  activeStaffTab === "list"
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 me-2 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                </svg>
                Danh sách nhân viên
              </a>
            </li>
            <li>
              <a
                onClick={() => setActiveStaffTab("create")}
                className={`inline-flex items-center px-4 py-3 rounded-lg w-full cursor-pointer ${
                  activeStaffTab === "create"
                    ? "text-white bg-blue-700 dark:bg-blue-600"
                    : "hover:text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white"
                }`}
              >
                <svg
                  className="w-4 h-4 me-2 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M18 7.5h-.423l-.452-1.09.3-.3a1.5 1.5 0 0 0 0-2.121L16.01 2.575a1.5 1.5 0 0 0-2.121 0l-.3.3-1.089-.452V2A1.5 1.5 0 0 0 11 .5H9A1.5 1.5 0 0 0 7.5 2v.423l-1.09.452-.3-.3a1.5 1.5 0 0 0-2.121 0L2.576 3.99a1.5 1.5 0 0 0 0 2.121l.3.3L2.423 7.5H2A1.5 1.5 0 0 0 .5 9v2A1.5 1.5 0 0 0 2 12.5h.423l.452 1.09-.3.3a1.5 1.5 0 0 0 0 2.121l1.415 1.413a1.5 1.5 0 0 0 2.121 0l.3-.3 1.09.452V18A1.5 1.5 0 0 0 9 19.5h2a1.5 1.5 0 0 0 1.5-1.5v-.423l1.09-.452.3.3a1.5 1.5 0 0 0 2.121 0l1.415-1.414a1.5 1.5 0 0 0 0-2.121l-.3-.3.452-1.09H18a1.5 1.5 0 0 0 1.5-1.5V9A1.5 1.5 0 0 0 18 7.5Zm-8 6a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
                </svg>
                Thêm nhân viên mới
              </a>
            </li>
          </ul>
          <div className="flex-1 p-6 bg-white shadow-sm rounded-lg">
            {activeStaffTab === "list" ? (
              <ManageStaffList />
            ) : activeStaffTab === "create" ? (
              <CreateStaffForm />
            ) : null}{" "}
            {/* Fixed the incomplete ternary operator */}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-center font-bold text-primary text-xl">
        QUẢN TRỊ NGƯỜI DÙNG TẠI HỆ THỐNG CAMERA SERVICE PLATFORM
      </h1>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  );
};

export default ManageUser;
