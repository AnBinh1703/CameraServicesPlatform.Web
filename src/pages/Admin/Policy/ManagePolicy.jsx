import {
  Button,
  DatePicker,
  Divider,
  Input,
  message,
  Modal,
  Table,
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

  // Fetch policies from API
  const fetchPolicies = async () => {
    try {
      const response = await getAllPolicies(pageIndex, pageSize);
      if (response && response.isSuccess) {
        setPolicies(response.result || []);
        setFilteredPolicies(response.result || []); // Initialize filtered policies
      } else {
        message.error("Error fetching policies.");
      }
    } catch (error) {
      message.error("Error fetching policies.");
      console.error(error);
    }
  };

  const handleDeletePolicy = async (policyID) => {
    try {
      await deletePolicyById(policyID);
      message.success("Policy deleted successfully!");
      fetchPolicies(); // Refresh policies after deletion
    } catch (error) {
      message.error("Error deleting policy.");
      console.error(error);
    }
  };

  const handleUpdatePolicy = async (policyID, updatedPolicyData) => {
    try {
      const response = await updatePolicyById(policyID, updatedPolicyData);
      if (response && response.isSuccess) {
        message.success("Policy updated successfully!");
        fetchPolicies(); // Refresh policies after updating
        setIsUpdating(false); // Close the modal after updating
      } else {
        message.error("Error updating policy.");
      }
    } catch (error) {
      message.error("Error updating policy.");
      console.error(error);
    }
  };

  const handleViewDetail = async (policyID) => {
    if (!policyID) {
      message.error("Invalid policy ID.");
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

  const columns = [
    {
      title: "Mã Chính Sách",
      dataIndex: "policyID",
      key: "policyID",
    },
    {
      title: "Loại Chính Sách",
      dataIndex: "policyType",
      key: "policyType",
    },
    {
      title: "Nội Dung",
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
      title: "Đối Tượng Áp Dụng",
      dataIndex: "applicableObject",
      key: "applicableObject",
    },
    {
      title: "Ngày Hiệu Lực",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (date) => moment(date).format('DD/MM/YYYY'),
    },
    {
      title: "Giá Trị",
      dataIndex: "value",
      key: "value",
      render: (value) => moment(value).format('DD/MM/YYYY'),
    },
    {
      title: "Thao Tác",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button type="primary" size="small" onClick={() => handleViewDetail(record.policyID)}>
            Xem
          </Button>
          <Button type="default" size="small" onClick={() => {
            setIsUpdating(true);
            setSelectedPolicy(record);
          }}>
            Sửa
          </Button>
          <Button type="danger" size="small" onClick={() => handleDeletePolicy(record.policyID)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px", background: '#f5f5f5' }}>
      <div style={{ background: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '24px' }}>Quản Lý Chính Sách</h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <Input.Search
            placeholder="Tìm kiếm chính sách..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: "300px" }}
          />
          <Button type="primary" onClick={handleCreatePolicy}>
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
        />
      </div>

      {/* View Detail Modal */}
      <Modal
        title="Chi Tiết Chính Sách"
        open={isViewingDetail}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>
        ]}
        width={600}
      >
        {selectedPolicy ? (
          <div style={{ padding: '12px' }}>
            <div style={{ marginBottom: '12px' }}>
              <strong>Mã Chính Sách:</strong> {selectedPolicy.policyID}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Loại Chính Sách:</strong> {selectedPolicy.policyType}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Nội Dung:</strong> {selectedPolicy.policyContent}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Đối Tượng Áp Dụng:</strong> {selectedPolicy.applicableObject}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Ngày Hiệu Lực:</strong> {moment(selectedPolicy.effectiveDate).format('DD/MM/YYYY')}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <strong>Giá Trị:</strong> {moment(selectedPolicy.value).format('DD/MM/YYYY')}
            </div>
          </div>
        ) : (
          <p>Không có dữ liệu</p>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh Sửa Chính Sách"
        open={isUpdating}
        onCancel={handleModalClose}
        footer={null}
        width={600}
      >
        {selectedPolicy ? (
          <div style={{ padding: '12px' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Loại Chính Sách:</strong>
              </div>
              <Input
                value={selectedPolicy.policyType}
                onChange={(e) => setSelectedPolicy({...selectedPolicy, policyType: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Nội Dung:</strong>
              </div>
              <Input.TextArea
                value={selectedPolicy.policyContent}
                onChange={(e) => setSelectedPolicy({...selectedPolicy, policyContent: e.target.value})}
                rows={4}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Đối Tượng Áp Dụng:</strong>
              </div>
              <Input
                value={selectedPolicy.applicableObject}
                onChange={(e) => setSelectedPolicy({...selectedPolicy, applicableObject: e.target.value})}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Ngày Hiệu Lực:</strong>
              </div>
              <DatePicker
                value={selectedPolicy.effectiveDate ? moment(selectedPolicy.effectiveDate) : null}
                onChange={(date, dateString) => setSelectedPolicy({...selectedPolicy, effectiveDate: dateString})}
                style={{ width: '100%' }}
                format="DD/MM/YYYY"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px' }}>
                <strong>Giá Trị:</strong>
              </div>
              <Input
                value={selectedPolicy.value}
                onChange={(e) => setSelectedPolicy({...selectedPolicy, value: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
              <Button onClick={handleModalClose}>
                Hủy
              </Button>
              <Button type="primary" onClick={() => handleUpdatePolicy(selectedPolicy.policyID, selectedPolicy)}>
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
        title="Thêm Chính Sách Mới"
        open={isCreating}
        onCancel={handleModalClose}
        footer={null}
        width={600}
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
