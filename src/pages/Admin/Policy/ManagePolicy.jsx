import { 
  PlusOutlined, 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined 
} from "@ant-design/icons";
import {
  Button,
  Card,
  DatePicker,
  Input,
  message,
  Modal,
  Space,
  Table,
  Typography,
  Select,
  Divider,
  Alert,
  Tooltip
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  deletePolicyById,
  getAllPolicies,
  getPolicyById,
  updatePolicyById,
} from "../../../api/policyApi"; // Ensure correct import path
import CreatePolicy from "./CreatePolicy"; // Ensure you have this component

const { Text, Title } = Typography;

const ManagePolicy = () => {
  const [policies, setPolicies] = useState([]);
  const [filteredPolicies, setFilteredPolicies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const policyTypes = {
    0: "Hệ thống",
    1: "Nhà cung cấp",
    2: "Thành viên"
  };

  const applicableObjects = {
    0: "Hệ thống",
    1: "Nhà cung cấp",
    2: "Thành viên"
  };

  // Fetch policies from API
  const fetchPolicies = async () => {
    try {
      const response = await getAllPolicies(pageIndex, pageSize);
      if (response && response.isSuccess) {
        setPolicies(response.result || []);
        setFilteredPolicies(response.result || []); // Initialize filtered policies
      } else {
        message.error("Lỗi khi tải danh sách chính sách.");
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách chính sách.");
      console.error(error);
    }
  };

  const handleDeletePolicy = async (policyID) => {
    try {
      await deletePolicyById(policyID);
      message.success("Đã xóa chính sách thành công!");
      fetchPolicies(); // Refresh policies after deletion
    } catch (error) {
      message.error("Lỗi khi xóa chính sách.");
      console.error(error);
    }
  };

  const handleUpdatePolicy = async (policyID, updatedPolicyData) => {
    try {
      const response = await updatePolicyById(policyID, updatedPolicyData);
      if (response && response.isSuccess) {
        message.success("Cập nhật chính sách thành công!");
        fetchPolicies(); // Refresh policies after updating
        setIsUpdating(false); // Close the modal after updating
      } else {
        message.error("Lỗi khi cập nhật chính sách.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật chính sách.");
      console.error(error);
    }
  };

  const handleViewDetail = async (policyID) => {
    if (!policyID) {
      message.error("ID chính sách không hợp lệ.");
      return;
    }

    try {
      const response = await getPolicyById(policyID);
      if (response && response.isSuccess) {
        setSelectedPolicy(response.result);
        setIsViewingDetail(true);
      } else {
        message.error("Error fetching policy details.");
      }
    } catch (error) {
      message.error("Error fetching policy details.");
      console.error(error);
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    const filtered = policies.filter(
      (policy) =>
        (policy.policyType || "")
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        (policy.policyContent || "")
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()) ||
        (policy.applicableObject || "")
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase())
    );
    setFilteredPolicies(filtered);
  };

  useEffect(() => {
    fetchPolicies();
  }, [pageIndex]);

  const handleCreatePolicy = () => {
    setIsCreating(true);
  };

  const handleModalClose = () => {
    setIsCreating(false);
    setIsUpdating(false);
    setIsViewingDetail(false);
    setSelectedPolicy(null);
  };

  // Add confirm dialog before delete
  const showDeleteConfirm = (policyID) => {
    Modal.confirm({
      title: 'Xác nhận xóa chính sách',
      icon: <ExclamationCircleOutlined />,
      content: 'Bạn có chắc chắn muốn xóa chính sách này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => handleDeletePolicy(policyID),
    });
  };

  const columns = [
    {
      title: <Text strong>MÃ CHÍNH SÁCH</Text>,
      dataIndex: "policyID",
      key: "policyID",
    },
    {
      title: <Text strong>LOẠI CHÍNH SÁCH</Text>,
      dataIndex: "policyType",
      key: "policyType",
      render: (type) => policyTypes[type] || type,
    },
    {
      title: <Text strong>NỘI DUNG</Text>,
      dataIndex: "policyContent",
      key: "policyContent",
      render: (text) => (
        <div
          style={{
            maxWidth: "300px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: <Text strong>ĐỐI TƯỢNG ÁP DỤNG</Text>,
      dataIndex: "applicableObject",
      key: "applicableObject",
      render: (object) => applicableObjects[object] || object,
    },
    {
      title: <Text strong>NGÀY HIỆU LỰC</Text>,
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (date) => moment(date).format("DD/MM/YYYY"),
    },
    {
      title: <Text strong>GIÁ TRỊ</Text>,
      dataIndex: "value",
      key: "value",
      render: (value) => moment(value).format("DD/MM/YYYY"),
    },
    {
      title: <Text strong>THAO TÁC</Text>,
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Xem chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="middle"
              onClick={() => handleViewDetail(record.policyID)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="default"
              icon={<EditOutlined />}
              size="middle"
              onClick={() => {
                setIsUpdating(true);
                setSelectedPolicy(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="middle"
              onClick={() => showDeleteConfirm(record.policyID)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card
        className="shadow-lg rounded-lg overflow-hidden"
        title={
          <Space direction="vertical" size="small">
            <Title level={3} className="m-0">Quản Lý Chính Sách</Title>
            <Text type="secondary">Quản lý và cập nhật các chính sách hệ thống</Text>
          </Space>
        }
      >
        <Space direction="vertical" className="w-full" size="large">
          <Alert
            message="Lưu ý"
            description="Các thay đổi về chính sách sẽ ảnh hưởng trực tiếp đến hoạt động của hệ thống."
            type="info"
            showIcon
            className="mb-4"
          />

          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <Input.Search
              placeholder="Tìm kiếm chính sách..."
              allowClear
              enterButton={<SearchOutlined className="text-lg" />}
              size="large"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="max-w-md"
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreatePolicy}
              size="large"
              className="bg-blue-600 hover:bg-blue-500"
            >
              Thêm Chính Sách Mới
            </Button>
          </div>

          <Table
            dataSource={filteredPolicies}
            columns={columns}
            rowKey="policyID"
            pagination={{
              current: pageIndex,
              pageSize,
              onChange: (page) => setPageIndex(page),
              total: filteredPolicies.length,
              showSizeChanger: false,
              showTotal: (total) => `Tổng số: ${total} chính sách`,
            }}
            className="border rounded-lg shadow-sm"
            scroll={{ x: true }}
          />
        </Space>
      </Card>

      {/* View Detail Modal */}
      <Modal
        title={
          <Space align="center">
            <EyeOutlined />
            <span>Chi Tiết Chính Sách</span>
          </Space>
        }
        open={isViewingDetail}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        width={600}
        className="top-20"
      >
        {selectedPolicy ? (
          <div className="space-y-4">
            <Divider />
            <div className="grid grid-cols-2 gap-4">
              <div style={{ marginBottom: "12px" }}>
                <strong>Mã Chính Sách:</strong> {selectedPolicy.policyID}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Loại Chính Sách:</strong>{" "}
                {policyTypes[selectedPolicy.policyType] || selectedPolicy.policyType}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Nội Dung:</strong> {selectedPolicy.policyContent}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Đối Tượng Áp Dụng:</strong>{" "}
                {applicableObjects[selectedPolicy.applicableObject] || selectedPolicy.applicableObject}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Ngày Hiệu Lực:</strong>{" "}
                {moment(selectedPolicy.effectiveDate).format("DD/MM/YYYY")}
              </div>
              <div style={{ marginBottom: "12px" }}>
                <strong>Giá Trị:</strong>{" "}
                {moment(selectedPolicy.value).format("DD/MM/YYYY")}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Text type="secondary">Không có dữ liệu</Text>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title={
          <Space align="center">
            <EditOutlined />
            <span>Chỉnh Sửa Chính Sách</span>
          </Space>
        }
        open={isUpdating}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        className="top-20"
      >
        {selectedPolicy ? (
          <div style={{ padding: "12px" }}>
            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Loại Chính Sách:</strong>
              </div>
              <Select
                value={selectedPolicy.policyType}
                onChange={(value) => setSelectedPolicy({...selectedPolicy, policyType: value})}
                options={[
                  { value: 0, label: "Hệ thống" },
                  { value: 1, label: "Nhà cung cấp" },
                  { value: 2, label: "Thành viên" }
                ]}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Nội Dung:</strong>
              </div>
              <Input.TextArea
                value={selectedPolicy.policyContent}
                onChange={(e) =>
                  setSelectedPolicy({
                    ...selectedPolicy,
                    policyContent: e.target.value,
                  })
                }
                rows={4}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Đối Tượng Áp Dụng:</strong>
              </div>
              <Select
                value={selectedPolicy.applicableObject}
                onChange={(value) => setSelectedPolicy({...selectedPolicy, applicableObject: value})}
                options={[
                  { value: 0, label: "Hệ thống" },
                  { value: 1, label: "Nhà cung cấp" },
                  { value: 2, label: "Thành viên" }
                ]}
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Ngày Hiệu Lực:</strong>
              </div>
              <DatePicker
                value={
                  selectedPolicy.effectiveDate
                    ? moment(selectedPolicy.effectiveDate)
                    : null
                }
                onChange={(date, dateString) =>
                  setSelectedPolicy({
                    ...selectedPolicy,
                    effectiveDate: dateString,
                  })
                }
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <div style={{ marginBottom: "8px" }}>
                <strong>Giá Trị:</strong>
              </div>
              <Input
                value={selectedPolicy.value}
                onChange={(e) =>
                  setSelectedPolicy({
                    ...selectedPolicy,
                    value: e.target.value,
                  })
                }
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "24px",
              }}
            >
              <Button onClick={handleModalClose}>Hủy</Button>
              <Button
                type="primary"
                onClick={() =>
                  handleUpdatePolicy(selectedPolicy.policyID, selectedPolicy)
                }
              >
                Cập Nhật
              </Button>
            </div>
          </div>
        ) : (
          <p>Đang tải...</p>
        )}
      </Modal>

      {/* Create Policy Modal */}
      <Modal
        title={
          <Space align="center">
            <PlusOutlined />
            <span>Thêm Chính Sách Mới</span>
          </Space>
        }
        open={isCreating}
        onCancel={handleModalClose}
        footer={null}
        width={600}
        className="top-20"
      >
        <CreatePolicy
          onClose={handleModalClose}
          fetchPolicies={fetchPolicies}
        />
      </Modal>
    </div>
  );
};

export default ManagePolicy;
