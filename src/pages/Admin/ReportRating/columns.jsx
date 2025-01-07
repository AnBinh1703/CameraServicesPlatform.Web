import { EyeOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Rate, Space, Tag, Typography } from "antd";
import moment from "moment";
import { getProductReportById } from "../../../api/productReportApi";

const { Text } = Typography;

export const userReportColumns = (
  getColumnSearchProps,
  handleViewDetails,

  handleUserReportApprove,
  handleUserReportReject
) => [
  {
    title: "Mã báo cáo",
    dataIndex: "reportID",
    key: "reportID",
    ...getColumnSearchProps("reportID"),
  },
  {
    title: "Người báo cáo",
    dataIndex: "accountId",
    key: "accountId",
    render: (accountId) => (
      <Space>
        <UserOutlined />
        <Text>{accountId || "N/A"}</Text>
      </Space>
    ),
    ...getColumnSearchProps("accountId"),
  },
  {
    title: "Loại báo cáo",
    dataIndex: "reportType",
    key: "reportType",
    render: (reportType) => {
      const types = {
        0: <Tag color="blue">Sản phẩm</Tag>,
        1: <Tag color="orange">Dịch vụ</Tag>,
        2: <Tag color="red">Người dùng</Tag>,
      };
      return types[reportType] || <Tag>Không xác định</Tag>;
    },
  },
  {
    title: "Nội dung",
    dataIndex: "reportDetails",
    key: "reportDetails",
    render: (text) => text || "Không có nội dung",
    ...getColumnSearchProps("reportDetails"),
  },
  {
    title: "Phản hồi",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Ngày báo cáo",
    dataIndex: "reportDate",
    key: "reportDate",
    render: (date) =>
      moment(date).isValid() ? moment(date).format("DD/MM/YYYY HH:mm") : "N/A",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      const statusTypes = {
        0: <Tag color="blue">Chờ xử lý</Tag>,
        1: <Tag color="green">Đã xử lý</Tag>,
        2: <Tag color="red">Từ chối</Tag>,
      };
      return statusTypes[status] || <Tag>Không xác định</Tag>;
    },
  },
  {
    title: "Thao tác",
    key: "actions",
    render: (_, record) => (
      <Space>
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        />
        {record.status === 0 && (
          <>
            <Button
              type="primary"
              style={{ background: "#52c41a" }}
              size="small"
              onClick={() => handleUserReportApprove(record)}
            >
              Duyệt
            </Button>
            <Button
              danger
              type="primary"
              size="small"
              onClick={() => handleUserReportReject(record)}
            >
              Từ chối
            </Button>
          </>
        )}
      </Space>
    ),
  },
];

export const productReportColumns = (
  getColumnSearchProps,
  productDetails,
  handleViewDetails,
  handleApprove,
  handleReject
) => [
  {
    title: "Mã báo cáo",
    dataIndex: "productReportID",
    key: "productReportID",
    ...getColumnSearchProps("productReportID"),
  },
  {
    title: "Sản phẩm",
    dataIndex: "productID",
    key: "productID",
    render: (productId) => (
      <Space direction="vertical" size="small">
        <span>Mã: {productId}</span>
        <span>Tên: {productDetails[productId]?.name || "N/A"}</span>
      </Space>
    ),
    ...getColumnSearchProps("productID"),
  },
  {
    title: "Trạng thái",
    dataIndex: "statusType",
    key: "statusType",
    render: (status) => {
      const colors = {
        Pending: "blue",
        Approved: "green",
        Rejected: "red",
      };
      return <Tag color={colors[status] || "default"}>{status}</Tag>;
    },
  },
  {
    title: "Lý do",
    dataIndex: "reason",
    key: "reason",
    ...getColumnSearchProps("reason"),
  },
  {
    title: "Phản hồi",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Ngày bắt đầu",
    dataIndex: "startDate",
    key: "startDate",
    render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
  },
  {
    title: "Ngày kết thúc",
    dataIndex: "endDate",
    key: "endDate",
    render: (date) => moment(date).format("DD/MM/YYYY HH:mm"),
  },
  {
    title: "Thao tác",
    key: "actions",
    render: (_, record) => (
      <Space>
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={async () => {
            const details = await getProductReportById(record.productReportID);
            if (details) {
              handleViewDetails(details.result);
            }
          }}
        />
        {record.statusType === "Pending" && (
          <>
            <Button
              type="primary"
              style={{ background: "#52c41a" }}
              size="small"
              onClick={() => handleApprove(record)}
            >
              Duyệt
            </Button>
            <Button
              danger
              type="primary"
              size="small"
              onClick={() => handleReject(record)}
            >
              Từ chối
            </Button>
          </>
        )}
      </Space>
    ),
  },
];

export const ratingColumns = (
  getColumnSearchProps,
  productDetails,
  handleViewDetails,
  userDetails
) => [
  {
    title: "Mã đánh giá",
    dataIndex: "ratingID",
    key: "ratingID",
    ...getColumnSearchProps("ratingID"),
  },
  {
    title: "Sản phẩm",
    dataIndex: "productID",
    key: "productID",
    render: (productId) => (
      <Space direction="vertical" size="small">
        <Text strong>{productDetails[productId]?.name || "N/A"}</Text>
        <Text type="secondary" style={{ fontSize: "12px" }}>
          Mã: {productId}
        </Text>
      </Space>
    ),
    ...getColumnSearchProps("productID"),
    width: 250,
  },
  {
    title: "Người đánh giá",
    dataIndex: "accountID",
    key: "accountID",
    render: (accountID) => {
      const user = userDetails[accountID];
      return (
        <Space direction="vertical" size="small">
          {user ? (
            <>
              <Text strong>{`${user.lastName} ${user.firstName}`}</Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                <UserOutlined style={{ marginRight: 5 }} />
                {accountID}
              </Text>
              <Text type="secondary" copyable style={{ fontSize: "12px" }}>
                {user.email}
              </Text>
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {user.phoneNumber}
              </Text>
            </>
          ) : (
            <Text type="secondary">N/A</Text>
          )}
        </Space>
      );
    },
    width: 250,
  },
  {
    title: "Số sao",
    dataIndex: "ratingValue",
    key: "ratingValue",
    render: (rating) => (
      <Space>
        <Rate disabled defaultValue={rating} style={{ fontSize: "16px" }} />
        <Text type="secondary">({rating})</Text>
      </Space>
    ),
    width: 200,
  },
  {
    title: "Nội dung",
    dataIndex: "reviewComment",
    key: "reviewComment",
    render: (comment) => (
      <Text className="line-clamp-2" style={{ maxWidth: 300 }}>
        {comment}
      </Text>
    ),
    ...getColumnSearchProps("reviewComment"),
  },
  {
    title: "Ngày tạo",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (date) => (
      <Space direction="vertical" size="small" style={{ fontSize: "12px" }}>
        <Text>{moment(date).format("DD/MM/YYYY")}</Text>
        <Text type="secondary">{moment(date).format("HH:mm")}</Text>
      </Space>
    ),
    sorter: (a, b) => moment(a.createdAt).unix() - moment(b.createdAt).unix(),
    width: 120,
  },
  {
    title: "Thao tác",
    key: "actions",
    render: (_, record) => (
      <Button
        type="link"
        icon={<EyeOutlined />}
        onClick={() => handleViewDetails(record)}
      />
    ),
  },
];
