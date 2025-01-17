import { Button, Modal, Table, Tag } from "antd";
import moment from "moment";
import React, { useState } from "react";
import { getReturnDetailByOrderId } from "../../../../api/returnDetailApi"; // Ensure to import your api instance
import {
  deliveryStatusMap,
  orderStatusMap,
  orderTypeMap,
} from "./OrderStatusMaps";
import OrderTableFilters from "./OrderTableFilters";

const OrderBothTable = ({
  orders,
  pageIndex,
  pageSize,
  setPageIndex,
  setPageSize,
  setSelectedOrder,
  setIsTrackingModalVisible,
  setContractModalVisible,
}) => {
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const [returnDetail, setReturnDetail] = useState(null);
  const [returnDetailModalVisible, setReturnDetailModalVisible] =
    useState(false); // Add this line

  const handleSearch = (searchText) => {
    const filtered = orders.filter((order) =>
      order.accountName.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredOrders(filtered);
  };

  const handleReset = () => {
    setFilteredOrders(orders);
  };

  const handleFilter = ({ orderStatus, orderType }) => {
    let filtered = orders;
    if (orderStatus !== null) {
      filtered = filtered.filter((order) => order.orderStatus === orderStatus);
    }
    if (orderType !== null) {
      filtered = filtered.filter((order) => order.orderType === orderType);
    }
    setFilteredOrders(filtered);
  };

  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
      sorter: (a, b) => a.orderID.localeCompare(b.orderID),
    },
    {
      title: "Tên tài khoản",
      dataIndex: "accountName",
      key: "accountName",
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      key: "orderDate",
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
      render: (date) => moment(date).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Trạng thái đơn hàng",
      dataIndex: "orderStatus",
      key: "orderStatus",
      render: (status) => {
        const statusInfo = orderStatusMap[status];
        return statusInfo ? (
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.orderStatus - b.orderStatus,
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      sorter: (a, b) => a.totalAmount - b.totalAmount,
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "orderType",
      key: "orderType",
      render: (type) => {
        const typeInfo = orderTypeMap[type];
        return typeInfo ? (
          <Tag color={typeInfo.color}>{typeInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.orderType - b.orderType,
    },
    {
      title: "Địa chỉ giao hàng",
      dataIndex: "shippingAddress",
      key: "shippingAddress",
      sorter: (a, b) => a.shippingAddress.localeCompare(b.shippingAddress),
    },
    {
      title: "Phương thức giao hàng",
      dataIndex: "deliveriesMethod",
      key: "deliveriesMethod",
      render: (status) => {
        const deliveryInfo = deliveryStatusMap[status];
        return deliveryInfo ? (
          <Tag color={deliveryInfo.color}>{deliveryInfo.text}</Tag>
        ) : null;
      },
      sorter: (a, b) => a.deliveriesMethod - b.deliveriesMethod,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            type="primary"
            onClick={() => {
              setSelectedOrder(record);
              setIsTrackingModalVisible(true);
            }}
          >
            Theo dõi đơn hàng
          </Button>
          {record.orderType === 1 && (
            <>
              <Button
                type="default"
                onClick={() => {
                  setSelectedOrder(record);
                  setContractModalVisible(true);
                }}
                style={{ marginLeft: 8 }}
              >
                Hợp đồng
              </Button>
              {(record.orderStatus === 11 || record.orderStatus === 10) && (
                <Button
                  type="default"
                  onClick={async () => {
                    const returnDetail = await getReturnDetailByOrderId(
                      record.orderID
                    );
                    if (returnDetail) {
                      setReturnDetail(returnDetail.result);
                      setReturnDetailModalVisible(true);
                    }
                  }}
                  style={{ marginLeft: 8 }}
                >
                  Chi tiết trả hàng
                </Button>
              )}
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <>
      <OrderTableFilters
        onSearch={handleSearch}
        onReset={handleReset}
        onFilter={handleFilter}
      />
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="orderID"
        pagination={{
          current: pageIndex,
          pageSize: pageSize,
          total: filteredOrders.length,
          onChange: (page, pageSize) => {
            setPageIndex(page);
            setPageSize(pageSize);
          },
        }}
      />
      <Modal
        title="Chi tiết trả hàng"
        visible={returnDetailModalVisible}
        onCancel={() => setReturnDetailModalVisible(false)}
        footer={null}
      >
        {returnDetail && (
          <div>
            <p>Mã trả hàng: {returnDetail.returnID}</p>
            <p>Mã đơn hàng: {returnDetail.orderID}</p>
            <p>
              Ngày trả hàng:{" "}
              {moment(returnDetail.returnDate).format("DD/MM/YYYY HH:mm:ss")}
            </p>
            <p>Tình trạng: {returnDetail.condition}</p>
            <p>
              Phạt áp dụng:{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(returnDetail.penaltyApplied)}
            </p>
            <p>
              Ngày tạo:{" "}
              {moment(returnDetail.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </p>
            <p>
              Ngày cập nhật:{" "}
              {moment(returnDetail.updatedAt).format("DD/MM/YYYY HH:mm:ss")}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
};

export default OrderBothTable;
