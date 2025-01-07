import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  getAllActiveAccounts,
  getAllInactiveAccounts,
  getAllStaff,
} from "../../../../api/staffApi";
import LoadingComponent from "../../../../components/LoadingComponent/LoadingComponent";

const ManageStaff = () => {
  const [staffData, setStaffData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState("all"); // 'all', 'active', 'inactive'

  const fetchStaff = async (page = 1, pageSize = 10) => {
    setLoading(true);
    let data;

    switch (filterType) {
      case "active":
        data = await getAllActiveAccounts(page, pageSize);
        break;
      case "inactive":
        data = await getAllInactiveAccounts(page, pageSize);
        break;
      default:
        data = await getAllStaff(page, pageSize);
    }

    console.log("Fetched data:", data); // Debug log

    if (data?.result) {
      setStaffData(data.result.items);
      setPagination({
        ...pagination,
        total: data.result.totalPages * pageSize || data.result.items.length,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStaff(pagination.current, pagination.pageSize);
  }, [filterType]); // Re-fetch when filter changes

  const columns = [
    {
      title: "Tên",
      key: "name",
      render: (_, record) => {
        return record.firstName && record.lastName
          ? `${record.firstName} ${record.lastName}`
          : record.name || "N/A";
      },
    },
    {
      title: "Số điện thoại",
      dataIndex:
        filterType === "all" ? ["account", "phoneNumber"] : "phoneNumber",
      key: "phone",
    },
    {
      title: "Email",
      dataIndex: filterType === "all" ? ["account", "email"] : "email",
      key: "email",
    },
    {
      title: "Giới tính",
      dataIndex: filterType === "all" ? ["account", "gender"] : "gender",
      key: "gender",
      render: (gender) => {
        switch (gender) {
          case 0:
            return "Nam";
          case 1:
            return "Nữ";
          case 2:
            return "Khác";
          default:
            return "Không xác định";
        }
      },
    },
    {
      title: "Trạng thái",
      key: "status",
      render: (_, record) => {
        if (filterType === "all") {
          return (
            <span
              className={`px-2 py-1 rounded-full ${
                record.staffStatus === "active"
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {record.staffStatus === "active" ? (
                <>
                  <CheckCircleOutlined /> Hoạt động
                </>
              ) : (
                <>
                  <CloseCircleOutlined /> Không hoạt động
                </>
              )}
            </span>
          );
        }
        return record.isVerified ? (
          <span className="text-green-600">
            <CheckCircleOutlined /> Đã xác thực
          </span>
        ) : (
          <span className="text-red-600">
            <CloseCircleOutlined /> Chưa xác thực
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="primary" icon={<EditOutlined />}>
            Sửa
          </Button>
          <Button danger icon={<DeleteOutlined />}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    fetchStaff(pagination.current, pagination.pageSize);
  };

  const handleFilterChange = (type) => {
    setFilterType(type);
    setPagination({
      ...pagination,
      current: 1, // Reset to first page when filter changes
    });
  };

  return (
    <div className="p-6">
      <LoadingComponent isLoading={loading} title={"Đang tải dữ liệu"} />
      <h2 className="text-center font-bold text-primary text-2xl mb-6">
        Quản Lý Nhân Viên
      </h2>

      <div className="flex justify-between items-center mb-6">
        <Space size="middle">
          <Button
            type={filterType === "all" ? "primary" : "default"}
            onClick={() => handleFilterChange("all")}
            size="large"
            className="min-w-[150px]"
          >
            Tất cả nhân viên
          </Button>
          <Button
            type={filterType === "active" ? "primary" : "default"}
            onClick={() => handleFilterChange("active")}
            size="large"
            icon={<CheckCircleOutlined />}
            className="min-w-[150px]"
          >
            Đang hoạt động
          </Button>
          <Button
            type={filterType === "inactive" ? "primary" : "default"}
            onClick={() => handleFilterChange("inactive")}
            size="large"
            icon={<CloseCircleOutlined />}
            className="min-w-[150px]"
          >
            Ngưng hoạt động
          </Button>
        </Space>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <Table
          columns={columns}
          dataSource={staffData}
          rowKey={filterType === "all" ? "staffID" : "id"}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} nhân viên`,
            pageSizeOptions: ["10", "20", "50"],
          }}
          loading={loading}
          onChange={handleTableChange}
          className="rounded-lg overflow-hidden"
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default ManageStaff;
