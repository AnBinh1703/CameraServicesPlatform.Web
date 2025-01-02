import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  FileTextOutlined,
  HomeOutlined,
  IdcardOutlined,
  PhoneOutlined,
  SearchOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Input,
  message,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { getAllSuppliers, getSupplierById } from "../../../../api/supplierApi";

const { Title } = Typography;

const ManageSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  // Function to fetch suppliers based on pageIndex, pageSize, and search term
  const fetchSuppliers = async (pageIndex, pageSize, searchTerm = "") => {
    setLoading(true);
    try {
      const response = await getAllSuppliers(pageIndex, pageSize, searchTerm);
      if (response && response.result && response.isSuccess) {
        setSuppliers(response.result.items);
        setTotalPages(response.result.totalPages);
      } else {
        message.error("Failed to fetch suppliers");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      message.error("Error fetching suppliers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch suppliers when the component loads or pageIndex/pageSize changes
  useEffect(() => {
    fetchSuppliers(pageIndex, pageSize, searchTerm);
  }, [pageIndex, pageSize, searchTerm]);

  const handleViewDetails = async (supplierId) => {
    try {
      const response = await getSupplierById(supplierId);
      console.log("Supplier details response:", response.result);
      if (
        response &&
        response.result &&
        response.result.items &&
        response.result.items.length > 0
      ) {
        // Access the first item in the items array
        setSelectedSupplier(response.result.items[0]);
        setIsModalVisible(true);
      } else {
        message.error("Không thể tải thông tin nhà cung cấp");
      }
    } catch (error) {
      console.error("Error fetching supplier details:", error);
      message.error("Không thể tải thông tin nhà cung cấp");
    }
  };

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Tìm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });

  const columns = [
    {
      title: "Mã nhà cung cấp",
      dataIndex: "supplierID",
      key: "supplierID",
      ...getColumnSearchProps("supplierID"),
      width: 250,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      ...getColumnSearchProps("supplierName"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "contactNumber",
      key: "contactNumber",
      ...getColumnSearchProps("contactNumber"),
    },
    {
      title: "Địa chỉ",
      dataIndex: "supplierAddress",
      key: "supplierAddress",
      ...getColumnSearchProps("supplierAddress"),
    },
    {
      title: "Trạng thái",
      key: "isDisable",
      render: (_, record) => (
        <span>
          {record.isDisable ? (
            <CloseCircleOutlined style={{ color: "red" }} />
          ) : (
            <CheckCircleOutlined style={{ color: "green" }} />
          )}
        </span>
      ),
      filters: [
        { text: "Hoạt động", value: false },
        { text: "Đã khóa", value: true },
      ],
      onFilter: (value, record) => record.isDisable === value,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
      sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record.supplierID)}
        />
      ),
    },
  ];

  // Pagination handler
  const handleTableChange = (pagination) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Render supplier table with search bar
  return (
    <Card>
      <Title level={2} style={{ marginBottom: 20 }}>
        Quản lý nhà cung cấp
      </Title>
      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="supplierID"
        pagination={{
          current: pageIndex,
          pageSize,
          total: totalPages * pageSize,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} nhà cung cấp`,
        }}
        onChange={handleTableChange}
        loading={loading}
        bordered
        style={{ marginTop: 16 }}
        scroll={{ x: 1000 }}
      />

      <Modal
        title={<Title level={3}>Chi tiết nhà cung cấp</Title>}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={800}
        style={{ top: 20 }}
      >
        {selectedSupplier && (
          <Card bordered={false}>
            <Descriptions column={1} bordered>
              <Descriptions.Item
                label={
                  <>
                    <IdcardOutlined /> Mã nhà cung cấp
                  </>
                }
                span={2}
              >
                {selectedSupplier?.supplierID}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <UserOutlined /> Tên nhà cung cấp
                  </>
                }
                span={2}
              >
                {selectedSupplier?.supplierName}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <PhoneOutlined /> Số điện thoại
                  </>
                }
              >
                {selectedSupplier?.contactNumber}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <HomeOutlined /> Địa chỉ
                  </>
                }
                span={2}
              >
                {selectedSupplier?.supplierAddress}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <ClockCircleOutlined /> Ngày tạo
                  </>
                }
              >
                {moment(selectedSupplier?.createdAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <ClockCircleOutlined /> Cập nhật lúc
                  </>
                }
              >
                {moment(selectedSupplier?.updatedAt).format("DD/MM/YYYY HH:mm")}
              </Descriptions.Item>

              <Descriptions.Item label={<>Trạng thái</>}>
                <Badge
                  status={selectedSupplier?.isDisable ? "error" : "success"}
                  text={selectedSupplier?.isDisable ? "Đã khóa" : "Hoạt động"}
                />
              </Descriptions.Item>

              <Descriptions.Item
                label={
                  <>
                    <FileTextOutlined /> Mô tả
                  </>
                }
                span={2}
              >
                {selectedSupplier?.supplierDescription}
              </Descriptions.Item>

              {selectedSupplier?.blockReason && (
                <Descriptions.Item
                  label={
                    <>
                      <WarningOutlined /> Lý do chặn
                    </>
                  }
                  span={2}
                >
                  <span style={{ color: "#ff4d4f" }}>
                    {selectedSupplier.blockReason}
                  </span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </Modal>
    </Card>
  );
};

export default ManageSupplier;
