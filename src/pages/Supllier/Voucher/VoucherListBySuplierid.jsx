import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  EyeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Descriptions,
  Form,
  Input,
  message,
  Modal,
  Spin,
  Switch,
  Table,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId } from "../../../api/accountApi";
import {
  getVouchersBySupplierId,
  updateVoucher,
} from "../../../api/voucherApi";

const VoucherListBySupplierId = () => {
  const user = useSelector((state) => state.user.user || {});
  const [supplierId, setSupplierId] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);

  const fetchSupplierId = async () => {
    if (user.id) {
      try {
        const response = await getSupplierIdByAccountId(user.id);
        console.log("Supplier ID Response:", response); // Debugging log
        if (response?.isSuccess) {
          setSupplierId(response.result);
        } else {
          message.error("Failed to get Supplier ID.");
        }
      } catch (error) {
        message.error("Error fetching Supplier ID.");
      }
    }
  };

  const fetchVouchers = async (pageIndex, pageSize, supplierId) => {
    if (!supplierId) return;
    setLoading(true);
    try {
      const response = await getVouchersBySupplierId(
        supplierId,
        pageIndex,
        pageSize
      );
      console.log("Vouchers Response:", response); // Debugging log
      if (response && Array.isArray(response.result)) {
        setVouchers(response.result);
        setTotalItems(response.totalCount || response.result.length);
        console.log("Vouchers State:", response.result); // Debugging log
      } else {
        setVouchers([]);
        setTotalItems(0);
      }
    } catch (error) {
      message.error("Failed to fetch vouchers.");
      setVouchers([]);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page, pageSize) => {
    setPageIndex(page);
    setPageSize(pageSize);
    fetchVouchers(page, pageSize, supplierId);
  };

  useEffect(() => {
    fetchSupplierId();
  }, [user]);

  useEffect(() => {
    if (supplierId) {
      fetchVouchers(pageIndex, pageSize, supplierId);
    }
  }, [supplierId, pageIndex, pageSize]);

  const handleViewDetails = (voucher) => {
    setSelectedVoucher(voucher);
    setViewModalVisible(true);
  };

  const handleUpdateVoucher = async () => {
    try {
      const values = await form.validateFields();
      const updatedVoucher = await updateVoucher({
        ...values,
        expirationDate: values.expirationDate
          ? values.expirationDate.toISOString()
          : null,
      });
      setVouchers((prevVouchers) =>
        prevVouchers.map((v) =>
          v.vourcherID === updatedVoucher.vourcherID ? updatedVoucher : v
        )
      );
      message.success("Voucher updated successfully.");
      setUpdateModalVisible(false);
    } catch (error) {
      console.error("Error updating voucher:", error);
      message.error("Failed to update voucher. Please try again.");
    }
  };

  const handleOpenUpdateModal = (voucher) => {
    setSelectedVoucher(voucher);
    form.setFieldsValue({
      vourcherID: voucher.vourcherID,
      description: voucher.description,
      expirationDate: voucher.expirationDate
        ? dayjs(voucher.expirationDate)
        : null,
      isActive: voucher.isActive,
    });
    setUpdateModalVisible(true);
  };

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const filteredVouchers = vouchers
    .filter((voucher) =>
      voucher.vourcherCode.toLowerCase().includes(searchText.toLowerCase())
    )
    .sort((a, b) => {
      const isAExpired = dayjs(a.expirationDate).isBefore(dayjs());
      const isBExpired = dayjs(b.expirationDate).isBefore(dayjs());
      if (isAExpired && !isBExpired) return 1;
      if (!isAExpired && isBExpired) return -1;
      return 0;
    });

  const handleOpenProductVoucher = (record) => {
    setSelectedRecord(record);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedProductId(null);
    form.resetFields();
  };

  const handleAddVoucher = async (values) => {
    try {
      const { productID, voucherID } = values;
      const response = await createProductVoucher(productID, voucherID);
      if (response) {
        message.success("Voucher added successfully!");
        setVouchers([...vouchers, { productID, voucherID }]);
      } else {
        message.error("Failed to add voucher.");
      }
    } catch (error) {
      console.error("Failed to add voucher:", error);
      message.error("Failed to add voucher.");
    }
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalItems / pageSize);
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <li key={i}>
          <a
            href="#"
            className={`flex items-center justify-center px-3 h-8 leading-tight ${
              pageIndex === i
                ? "z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700"
                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
            }`}
            onClick={() => handlePageChange(i, pageSize)}
          >
            {i}
          </a>
        </li>
      );
    }

    return (
      <nav aria-label="Page navigation example">
        <ul className="flex items-center -space-x-px h-8 text-sm">
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700"
              onClick={() => handlePageChange(pageIndex - 1, pageSize)}
              disabled={pageIndex === 1}
            >
              <span className="sr-only">Previous</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 1 1 5l4 4"
                />
              </svg>
            </a>
          </li>
          {pages}
          <li>
            <a
              href="#"
              className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700"
              onClick={() => handlePageChange(pageIndex + 1, pageSize)}
              disabled={pageIndex === totalPages}
            >
              <span className="sr-only">Next</span>
              <svg
                className="w-2.5 h-2.5 rtl:rotate-180"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 6 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 9 4-4-4-4"
                />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
    );
  };

  const columns = [
    {
      title: "Mã Voucher",
      dataIndex: "vourcherID",
      key: "vourcherID",
      sorter: (a, b) => a.vourcherID.localeCompare(b.vourcherID),
    },
    {
      title: "Mã Giảm Giá",
      dataIndex: "vourcherCode",
      key: "vourcherCode",
      sorter: (a, b) => a.vourcherCode.localeCompare(b.vourcherCode),
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: "Giá Trị Giảm Giá",
      dataIndex: "discountAmount",
      key: "discountAmount",
      sorter: (a, b) => a.discountAmount - b.discountAmount,
    },
    {
      title: "Ngày Bắt Đầu",
      dataIndex: "validFrom",
      key: "validFrom",
      sorter: (a, b) => dayjs(a.validFrom).unix() - dayjs(b.validFrom).unix(),
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expirationDate",
      key: "expirationDate",
      sorter: (a, b) =>
        dayjs(a.expirationDate).unix() - dayjs(b.expirationDate).unix(),
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
      defaultSortOrder: "descend",
    },
    {
      title: "Trạng Thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <CheckCircleOutlined style={{ color: "green" }} />
        ) : (
          <CloseCircleOutlined style={{ color: "red" }} />
        ),
      sorter: (a, b) => a.isActive - b.isActive,
    },
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Ngày Cập Nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      sorter: (a, b) => dayjs(b.updatedAt).unix() - dayjs(b.updatedAt).unix(),
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Hành Động",
      render: (_, record) => {
        const isExpired = dayjs(record.expirationDate).isBefore(dayjs());
        return (
          <div className="flex space-x-2">
            <Button
              onClick={() => handleViewDetails(record)}
              icon={<EyeOutlined />}
              type="primary"
              disabled={isExpired}
            >
              Xem Chi Tiết
            </Button>
            <Button
              onClick={() => handleOpenUpdateModal(record)}
              icon={<EditOutlined />}
              type="default"
              disabled={isExpired}
            >
              Cập Nhật
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h1 className="text-blue-500 mb-4 text-2xl font-semibold">
        DANH SÁCH VOUCHER
      </h1>
      <Input
        placeholder="Search by Voucher Code"
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={handleSearch}
        className="mb-4 rounded border border-gray-300 p-2"
      />
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin />
        </div>
      ) : (
        <>
          {filteredVouchers.length > 0 ? (
            <>
              <Table
                dataSource={filteredVouchers}
                columns={columns}
                rowKey="vourcherID"
                pagination={false}
                className="rounded-lg"
              />
              <div className="flex justify-end mt-4">
                {renderPagination()}
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">Không có dữ liệu!</div>
          )}
        </>
      )}
      {selectedVoucher && (
        <Modal
          title="Chi Tiết Voucher"
          open={viewModalVisible}
          onCancel={() => setViewModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setViewModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          <Descriptions
            bordered
            column={1}
            className="bg-gray-100 p-4 rounded-lg"
          >
            <Descriptions.Item label="Mã Giảm Giá">
              {selectedVoucher.vourcherCode}
            </Descriptions.Item>
            <Descriptions.Item label="Mô Tả">
              {selectedVoucher.description}
            </Descriptions.Item>
            <Descriptions.Item label="Giá Trị Giảm Giá">
              {selectedVoucher.discountAmount}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày Bắt Đầu">
              {dayjs(selectedVoucher.validFrom).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày Hết Hạn">
              {dayjs(selectedVoucher.expirationDate).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng Thái">
              {selectedVoucher.isActive ? (
                <CheckCircleOutlined className="text-green-500" />
              ) : (
                <CloseCircleOutlined className="text-red-500" />
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày Tạo">
              {dayjs(selectedVoucher.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày Cập Nhật">
              {dayjs(selectedVoucher.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        </Modal>
      )}
      {selectedVoucher && (
        <Modal
          title="Cập Nhật Voucher"
          open={updateModalVisible}
          onOk={handleUpdateVoucher}
          onCancel={() => setUpdateModalVisible(false)}
        >
          <Form form={form} layout="vertical" className="mb-4 font-bold">
            <Form.Item name="vourcherID" label="Mã Voucher">
              <Input disabled />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô Tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="expirationDate"
              label="Ngày Hết Hạn"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn" },
              ]}
            >
              <DatePicker
                showTime
                disabled={dayjs(selectedVoucher.expirationDate).isBefore(
                  dayjs()
                )}
                className="w-full"
              />
            </Form.Item>
            <Form.Item
              name="isActive"
              label="Trạng Thái Kích Hoạt"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Form>
        </Modal>
      )}
    </div>
  );
};

export default VoucherListBySupplierId;
