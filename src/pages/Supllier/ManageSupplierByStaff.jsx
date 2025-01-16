import { Button, Descriptions, Modal, Space, Table, message } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getAllSuppliers, getSupplierById } from "../../api/supplierApi";

const ManageSupplierByStaff = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchSuppliers = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const response = await getAllSuppliers(page, pageSize);
      if (response?.isSuccess) {
        setSuppliers(response.result.items);
        setPagination({
          ...pagination,
          total: response.result.totalPages * pageSize,
          current: page,
          pageSize: pageSize,
        });
      } else {
        message.error("Failed to fetch suppliers");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error fetching suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers(pagination.current, pagination.pageSize);
  }, []);

  const handleTableChange = (pagination) => {
    fetchSuppliers(pagination.current, pagination.pageSize);
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const columns = [
    {
      title: "Mã nhà cung cấp",
      dataIndex: "supplierID",
      key: "supplierID",
      width: 200,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Mô tả",
      dataIndex: "supplierDescription",
      key: "supplierDescription",
      ellipsis: true,
    },
    {
      title: "Địa chỉ",
      dataIndex: "supplierAddress",
      key: "supplierAddress",
      ellipsis: true,
    },
    {
      title: "Số điện thoại",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => (
        <span
          className={`${record.isDisable ? "text-red-500" : "text-green-500"}`}
        >
          {record.isDisable ? "Vô hiệu hóa" : "Đang hoạt động"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleViewDetails(record.supplierID)}
          >
            Xem chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  const handleViewDetails = async (id) => {
    try {
      const response = await getSupplierById(id);
      if (response?.isSuccess) {
        setSelectedSupplier(response.result.items?.[0]);
        // console.log(response.result.items?.[0]);
        setIsModalVisible(true);
      } else {
        message.error("Failed to fetch supplier details");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("Error fetching supplier details");
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedSupplier(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Quản lý nhà cung cấp
        </h1>
      </div>

      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="supplierID"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
        scroll={{ x: 1300 }}
        className="bg-white rounded-lg shadow"
      />

      <Modal
        title={<span className="text-lg">Chi tiết nhà cung cấp</span>}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        width={800}
      >
        {selectedSupplier && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Mã nhà cung cấp" span={2}>
              {selectedSupplier.supplierID}
            </Descriptions.Item>
            <Descriptions.Item label="Mã tài khoản" span={2}>
              {selectedSupplier.accountID}
            </Descriptions.Item>
            <Descriptions.Item label="Tên nhà cung cấp" span={2}>
              {selectedSupplier.supplierName}
            </Descriptions.Item>
            {selectedSupplier.supplierLogo && (
              <Descriptions.Item label="Logo" span={2}>
                <img
                  src={selectedSupplier.supplierLogo}
                  alt="Supplier Logo"
                  className="max-w-[200px] h-auto"
                />
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Mô tả" span={2}>
              {selectedSupplier.supplierDescription}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ" span={2}>
              {selectedSupplier.supplierAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại" span={2}>
              {selectedSupplier.contactNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo" span={2}>
              {moment(selectedSupplier.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật" span={2}>
              {moment(selectedSupplier.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={2}>
              <span
                className={`${
                  selectedSupplier.isDisable ? "text-red-500" : "text-green-500"
                }`}
              >
                {selectedSupplier.isDisable ? "Vô hiệu hóa" : "Đang hoạt động"}
              </span>
            </Descriptions.Item>
            {selectedSupplier.blockReason && (
              <Descriptions.Item label="Lý do khóa" span={2}>
                {selectedSupplier.blockReason}
              </Descriptions.Item>
            )}
            {selectedSupplier.blockedAt && (
              <Descriptions.Item label="Thời gian khóa" span={2}>
                {moment(selectedSupplier.blockedAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>
            )}
            {selectedSupplier.img && (
              <Descriptions.Item label="Hình ảnh" span={2}>
                <img
                  src={selectedSupplier.img}
                  alt="Supplier Image"
                  className="max-w-[200px] h-auto"
                />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default ManageSupplierByStaff;
