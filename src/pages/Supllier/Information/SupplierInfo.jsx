import React from "react";
import { Button } from "antd";

const SupplierInfo = ({ supplierInfo, showModal }) => {
  if (!supplierInfo) {
    return (
      <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg p-4">
        <p>Không có thông tin nhà cung cấp</p>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-2xl shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Thông tin nhà cung cấp
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Chi tiết và thông tin về nhà cung cấp.
        </p>
        <Button type="primary" onClick={showModal}>
          Cập nhật thông tin
        </Button>
        <div className="flex justify-center bg-white px-4 py-5 sm:px-6">
          <img
            className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
            src={supplierInfo.supplierLogo}
            alt="Supplier Logo"
          />
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Tên</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {supplierInfo.supplierName}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {supplierInfo.email}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Số điện thoại</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {supplierInfo.contactNumber}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Địa chỉ</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {supplierInfo.supplierAddress}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {supplierInfo.supplierDescription}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SupplierInfo;
