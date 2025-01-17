import { message, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getSupplierIdByAccountId, getUserById } from "../../../api/accountApi";
import { getOrderOfSupplierId } from "../../../api/orderApi";
import OrderBothModals from "./OrderBoth/OrderBothModals";
import OrderBothTable from "./OrderBoth/OrderBothTable";

const OrderListBySupplier = ({ refresh }) => {
  const user = useSelector((state) => state.user.user || {});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [supplierId, setSupplierId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isTrackingModalVisible, setIsTrackingModalVisible] = useState(false);
  const [contractModalVisible, setContractModalVisible] = useState(false);

  useEffect(() => {
    const fetchSupplierId = async () => {
      if (user.id) {
        try {
          const response = await getSupplierIdByAccountId(user.id);
          if (response?.isSuccess) {
            setSupplierId(response.result);
          } else {
            message.error("Lấy ID Nhà cung cấp không thành công.");
          }
        } catch (error) {
          message.error("Lỗi khi lấy ID Nhà cung cấp.");
        }
      }
    };
    fetchSupplierId();
  }, [user.id]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (supplierId) {
        setLoading(true);
        try {
          const data = await getOrderOfSupplierId(
            supplierId,
            pageIndex,
            pageSize
          );
          if (data?.isSuccess) {
            // Fetch account names and include them in the orders
            const ordersWithAccountNames = await Promise.all(
              data.result.map(async (order) => {
                try {
                  const accountData = await getUserById(order.accountID);
                  if (accountData?.isSuccess) {
                    return {
                      ...order,
                      accountName: `${accountData.result.firstName} ${accountData.result.lastName}`,
                    };
                  }
                } catch (err) {
                  console.error(
                    `Error fetching account data for order ${order.orderID}:`,
                    err
                  );
                }
                return order;
              })
            );
            // Sort orders by date in descending order (newest first)
            const sortedOrders = ordersWithAccountNames.sort(
              (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
            );
            setOrders(sortedOrders || []);
          }
        } catch (err) {
          console.error("Error fetching orders:", err);
          setError("Lỗi khi lấy đơn hàng. Vui lòng thử lại sau.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [refresh, supplierId, pageIndex, pageSize]);

  const handleUpdateOrderStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderID === orderId ? { ...order, orderStatus: status } : order
      )
    );
  };

  if (loading) {
    return <Spin />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <OrderBothTable
        orders={orders}
        pageIndex={pageIndex}
        pageSize={pageSize}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        setSelectedOrder={setSelectedOrder}
        setIsTrackingModalVisible={setIsTrackingModalVisible}
        setContractModalVisible={setContractModalVisible}
      />
      <OrderBothModals
        selectedOrder={selectedOrder}
        isTrackingModalVisible={isTrackingModalVisible}
        contractModalVisible={contractModalVisible}
        handleCloseTrackingModal={() => setIsTrackingModalVisible(false)}
        handleCloseContractModal={() => setContractModalVisible(false)}
        handleUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </>
  );
};

export default OrderListBySupplier;
