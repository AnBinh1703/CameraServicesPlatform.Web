import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Input, Modal, Pagination, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { getAllVouchers } from "../../../api/voucherApi";  
import moment from "moment";

const VoucherList = () => {
  const [vouchers, setVouchers] = useState([]);
  const [originalVouchers, setOriginalVouchers] = useState([]);  
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [visible, setVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoading(true);
      try {
        const response = await getAllVouchers(pageIndex, pageSize);
        if (response && response.isSuccess) {
          setVouchers(response.result);
          setOriginalVouchers(response.result);  
          setTotal(response.result.length);  
        } else {
          console.error("Không thể tải danh sách voucher:", response.messages);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách voucher:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, [pageIndex, pageSize]);

  const handleRowDoubleClick = (voucher) => {
    setSelectedVoucher(voucher);
    setVisible(true);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    if (value) {
      const filteredVouchers = originalVouchers.filter(
        (voucher) =>
          voucher.vourcherCode.toLowerCase().includes(value.toLowerCase()) ||
          voucher.description.toLowerCase().includes(value.toLowerCase())
      );
      setVouchers(filteredVouchers);
      setTotal(filteredVouchers.length);
    } else {
      setVouchers(originalVouchers);
      setTotal(originalVouchers.length);
    }
  };

  const columns = [
    {
      title: "Mã Voucher",
      dataIndex: "vourcherCode",
      key: "vourcherCode",
      className: "font-semibold",
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      className: "text-gray-600",
    },
    {
      title: "Giá Trị Giảm",
      dataIndex: "discountAmount",
      key: "discountAmount",
      render: (text) => (
        <span className="text-blue-600 font-medium">{text.toLocaleString()} VNĐ</span>
      ),
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "validFrom",
      key: "validFrom",
      render: (text) => (
        <span className="text-gray-600">
          {moment(text).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
    },
    {
      title: "Ngày Kết Thúc",
      dataIndex: "expirationDate",
      key: "expirationDate",
      render: (text) => (
        <span className="text-gray-600">
          {moment(text).format("DD/MM/YYYY HH:mm")}
        </span>
      ),
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <span className="text-green-600 flex items-center">
            <CheckCircleOutlined className="mr-1" /> Đang hoạt động
          </span>
        ) : (
          <span className="text-red-600 flex items-center">
            <CloseCircleOutlined className="mr-1" /> Ngừng hoạt động
          </span>
        ),
    },
  ];

  return (
    <div className="bg-white p-4 rounded-lg">
      <Input.Search
        placeholder="Nhập mã voucher hoặc mô tả để tìm kiếm..."
        onChange={(e) => handleSearch(e.target.value)}
        className="mb-4"
        allowClear
      />
      {loading ? (
        <div className="text-center py-8">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Table
            dataSource={vouchers}
            columns={columns}
            rowKey="vourcherID"
            pagination={false}
            onRow={(record) => ({
              onDoubleClick: () => handleRowDoubleClick(record),
              className: "cursor-pointer hover:bg-gray-50",
            })}
            className="border rounded-lg"
          />
          <Pagination
            current={pageIndex}
            total={total}
            pageSize={pageSize}
            onChange={(page) => setPageIndex(page)}
            showSizeChanger
            onShowSizeChange={(current, size) => setPageSize(size)}
            className="mt-4 text-right"
            showTotal={(total) => `Tổng cộng: ${total} voucher`}
          />
          <Modal
            title="Thông Tin Chi Tiết Voucher"
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
            width={600}
          >
            {selectedVoucher && (
              <div className="space-y-3">
                <p className="flex justify-between border-b pb-2">
                  <strong>Mã Voucher:</strong>
                  <span>{selectedVoucher.vourcherCode}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <strong>Mô Tả:</strong>
                  <span>{selectedVoucher.description}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <strong>Giá Trị Giảm:</strong>
                  <span>{selectedVoucher.discountAmount.toLocaleString()} VNĐ</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <strong>Ngày Bắt Đầu:</strong>
                  <span>{moment(selectedVoucher.validFrom).format("DD/MM/YYYY HH:mm")}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <strong>Ngày Kết Thúc:</strong>
                  <span>{moment(selectedVoucher.expirationDate).format("DD/MM/YYYY HH:mm")}</span>
                </p>
                <p className="flex justify-between border-b pb-2">
                  <strong>Trạng Thái:</strong>
                  <span className={selectedVoucher.isActive ? "text-green-600" : "text-red-600"}>
                    {selectedVoucher.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </span>
                </p>
              </div>
            )}
          </Modal>
        </>
      )}
    </div>
  );
};

export default VoucherList;
