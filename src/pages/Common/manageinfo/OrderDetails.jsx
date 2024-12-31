import React from "react";
import { formatDateTime } from "../../../utils/util";

const OrderDetails = ({
  dataDetai,
  supplierMap,
  categoryMap,
  beforeImage,
  afterImage,
  setIsOrderDetail,
}) => (
  <div className="lg:col-span-4 bg-white shadow-xl rounded-lg p-6">
    <button
      onClick={() => {
        setIsOrderDetail(false);
      }}
      className="text-teal-600 hover:text-teal-800 mb-4 flex items-center"
    >
      <i className="fa-solid fa-arrow-left mr-2"></i> Quay lại
    </button>
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-teal-600 text-center">
        Thông tin chi tiết
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 border-b">Tên sản phẩm</th>
              <th className="py-3 px-4 border-b">Giá</th>
              <th className="py-3 px-4 border-b">Chất lượng</th>
              <th className="py-3 px-4 border-b">Tổng giá</th>
              <th className="py-3 px-4 border-b">Giảm giá</th>
              <th className="py-3 px-4 border-b">Số seri</th>
              <th className="py-3 px-4 border-b">Tên nhà cung cấp</th>
              <th className="py-3 px-4 border-b">Danh mục</th>
              <th className="py-3 px-4 border-b">Ngày tạo</th>
              <th className="py-3 px-4 border-b">Ngày cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {dataDetai.length > 0 ? (
              dataDetai.map((orderdetails) => (
                <tr key={orderdetails.productID} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">
                    {orderdetails.product.productName || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(
                      orderdetails.product.priceBuy || orderdetails.productPrice
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {orderdetails.product.quality}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(orderdetails.productPriceTotal)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(orderdetails.discount || 0)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {orderdetails.product.serialNumber || "N/A"}
                  </td>
                  <td className="py-3 px-4 border-b">
                    <div>
                      <strong>Tên nhà cung cấp:</strong>
                      {supplierMap[orderdetails.product.supplierID]
                        ?.supplierName || " "}
                    </div>
                    <div>
                      <strong>Địa chỉ:</strong>
                      {supplierMap[orderdetails.product.supplierID]
                        ?.supplierAddress || " "}
                    </div>
                    <div>
                      <strong>Mô tả:</strong>
                      {supplierMap[orderdetails.product.supplierID]
                        ?.supplierDescription || " "}
                    </div>
                    <div>
                      <strong>Số điện thoại liên hệ:</strong>
                      {supplierMap[orderdetails.product.supplierID]
                        ?.contactNumber || ""}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {categoryMap[orderdetails.product.categoryID] || "N/A"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDateTime(orderdetails.product.createdAt)}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {formatDateTime(orderdetails.product.updatedAt)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="10" className="text-center py-4">
                  Không tìm thấy sản phẩm nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center space-x-4 mt-4">
        {beforeImage && (
          <div>
            <h4 className="text-lg font-semibold text-teal-600">
              Ảnh sản phẩm trước khi thuê
            </h4>
            <img
              src={beforeImage}
              alt="Before"
              className="max-w-xs rounded-lg shadow-md"
            />
          </div>
        )}
        {afterImage && (
          <div>
            <h4 className="text-lg font-semibold text-teal-600">
              Ảnh sản phẩm sau khi thuê
            </h4>
            <img
              src={afterImage}
              alt="After"
              className="max-w-xs rounded-lg shadow-md"
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

export default OrderDetails;
