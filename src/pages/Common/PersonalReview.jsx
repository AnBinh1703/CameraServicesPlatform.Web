import { message, Modal } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { getCategoryById } from "../../api/categoryApi";
import { getOrderDetailsById, getOrdersByAccount } from "../../api/orderApi";
import { getSupplierById } from "../../api/supplierApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import { formatDateTime, formatPrice } from "../../utils/util";
import CreateRatingForm from "../Common/Rating/CreateRatingForm";
// import PersonalModal from "./Account/PersonalModal";

const orderStatusMap = {
  0: { text: "Chờ xử lý", color: "blue", icon: "fa-hourglass-start" },
  1: {
    text: "Sản phẩm sẵn sàng được giao",
    color: "green",
    icon: "fa-check-circle",
  },
  2: { text: "Hoàn thành", color: "yellow", icon: "fa-clipboard-check" },
  3: { text: "Đã nhận sản phẩm", color: "purple", icon: "fa-shopping-cart" },
  4: { text: "Đã giao hàng", color: "cyan", icon: "fa-truck" },
  5: { text: "Thanh toán thất bại", color: "cyan", icon: "fa-money-bill-wave" },
  6: { text: "Đang hủy", color: "lime", icon: "fa-box-open" },
  7: { text: "Đã hủy thành công", color: "red", icon: "fa-times-circle" },
  8: { text: "Đã Thanh toán", color: "orange", icon: "fa-money-bill-wave" },
  9: { text: "Hoàn tiền đang chờ xử lý", color: "pink", icon: "fa-clock" },
  10: { text: "Hoàn tiền", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
};

const orderTypeMap = {
  0: { text: "Mua", color: "indigo", icon: "fa-shopping-bag" },
  1: { text: "Thuê", color: "green", icon: "fa-warehouse" },
};

const deliveryStatusMap = {
  0: { text: "Nhận tại cửa hàng", color: "blue", icon: "fa-store" }, // LPH: Lấy Phát Hàng
  1: { text: "Giao hàng tận nơi", color: "green", icon: "fa-truck" },
  2: { text: "Trả lại", color: "red", icon: "fa-undo" },
};

const PersonalReview = () => {
  const { user } = useSelector((state) => state.user || {});
  const [orders, setOrders] = useState([]);
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [dataDetai, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});
  const [supplierMap, setSupplierMap] = useState({});
  const [isRatingFormOpen, setIsRatingFormOpen] = useState(false);
  const [selectedProductID, setSelectedProductID] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching orders for user ID:", user.id);
      const response = await getOrdersByAccount(user.id, 1, 100);
      console.log("API response:", response);
      if (response.isSuccess) {
        setOrders(response.result || []);
      } else {
        message.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) fetchOrders();
  }, [user]);

  const fetchOrderDetails = async (id) => {
    try {
      setIsLoading(true);
      const response = await getOrderDetailsById(id, 1, 100); // Adjust pageSize as needed
      if (response.isSuccess) {
        setData(response.result || []);
      } else {
        message.error("Failed to fetch order details.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("An error occurred, please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataDetai.length > 0) {
      fetchCategoryAndSupplierNames();
    }
  }, [dataDetai]);

  const fetchCategoryAndSupplierNames = async () => {
    const uniqueCategoryIDs = [
      ...new Set(dataDetai.map((detail) => detail.product.categoryID)),
    ].filter((id) => id);

    const uniqueSupplierIDs = [
      ...new Set(dataDetai.map((detail) => detail.product.supplierID)),
    ].filter((id) => id);

    try {
      const categoryPromises = uniqueCategoryIDs.map((id) =>
        getCategoryById(id)
      );
      const supplierPromises = uniqueSupplierIDs.map((id) =>
        getSupplierById(id, 1, 1)
      );

      const categories = await Promise.all(categoryPromises);
      const suppliers = await Promise.all(supplierPromises);

      const categoryDict = {};
      categories.forEach((res, index) => {
        const id = uniqueCategoryIDs[index];
        categoryDict[id] = res.isSuccess
          ? res.result?.categoryName || "Không xác định"
          : "Không xác định";
      });

      const supplierDict = {};
      suppliers.forEach((res, index) => {
        const id = uniqueSupplierIDs[index];
        supplierDict[id] =
          res && res.result && res.result.items.length > 0
            ? {
                supplierName: res.result.items[0].supplierName,
                supplierAddress:
                  res.result.items[0].supplierAddress || "Không xác định",
                supplierDescription:
                  res.result.items[0].supplierDescription || "Không xác định",
                contactNumber:
                  res.result.items[0].contactNumber || "Không xác định",
              }
            : {
                supplierName: "Không xác định",
                supplierAddress: "Không xác định",
                supplierDescription: "Không xác định",
                contactNumber: "Không xác định",
              };
      });

      setCategoryMap(categoryDict);
      setSupplierMap(supplierDict);
    } catch (error) {
      console.error("Error fetching category or supplier names:", error);
      message.error("Error fetching category or supplier names.");
    }
  };

  const handleClick = (order) => {
    setIsOrderDetail(true);

    fetchOrderDetails(order.orderID);
  };
  const StatusBadge = ({ status, map }) => {
    const statusInfo = map[status] || {
      text: "Thanh toán thất bại",
      color: "gray",
      icon: "fa-question-circle",
    };
    return (
      <span className="flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full bg-opacity-20">
        <i
          className={`fa-solid ${statusInfo.icon} text-${statusInfo.color}-500`}
        ></i>
        <span className={`text-${statusInfo.color}-700`}>
          {statusInfo.text}
        </span>
      </span>
    );
  };

  const renderOrderItems = (order) => (
    <tr key={order.orderID} onClick={() => handleClick(order)}>
      <td className="py-3 px-4 border-b">{order.orderID}</td>

      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderStatus} map={orderStatusMap} />
      </td>
      <td className="py-3 px-4 border-b hidden md:table-cell">
        {order.shippingAddress}
      </td>
      <td className="py-3 px-4 border-b hidden lg:table-cell">
        <StatusBadge status={order.deliveriesMethod} map={deliveryStatusMap} />
      </td>
      <td className="py-3 px-4 border-b">
        <StatusBadge status={order.orderType} map={orderTypeMap} />
      </td>
      <td className="py-3 px-4 border-b hidden sm:table-cell">
        {formatDateTime(order.orderDate)}
      </td>
      <td className="py-3 px-4 border-b">{formatPrice(order.totalAmount)}</td>
      <td>
        {(order.orderStatus === 2 ||
          order.orderStatus === 9 ||
          order.orderStatus === 10 ||
          order.orderStatus === 11) &&
          order.orderDetails?.map((detail) => (
            <React.Fragment key={detail.orderDetailsID}>
              <button
                className="bg-blue-500 text-white rounded-md py-2 px-4 my-2"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("Product ID:", detail.productID);
                  setSelectedProductID(detail.productID);
                  setIsRatingFormOpen(true);
                }}
              >
                Đánh giá sản phẩm
              </button>
              <Modal
                title="Submit a Rating"
                open={
                  isRatingFormOpen && selectedProductID === detail.productID
                }
                onCancel={() => setIsRatingFormOpen(false)}
                footer={null}
              >
                <CreateRatingForm
                  productID={detail.productID}
                  onClose={() => setIsRatingFormOpen(false)}
                />
              </Modal>
            </React.Fragment>
          ))}
      </td>
    </tr>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <LoadingComponent isLoading={isLoading} title="Loading data..." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {!isOrderDetail ? (
          <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-teal-600 mb-6 text-center">
              Đơn hàng của bạn
            </h2>
            {orders.length === 0 ? (
              <p className="text-center text-gray-500">No orders found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 border-b">Mã đơn hàng</th>

                      <th className="py-3 px-4 border-b">Trạng thái</th>
                      <th className="py-3 px-4 border-b hidden md:table-cell">
                        Địa chỉ giao hàng
                      </th>
                      <th className="py-3 px-4 border-b hidden lg:table-cell">
                        Phương thức giao hàng
                      </th>
                      <th className="py-3 px-4 border-b">Loại</th>
                      <th className="py-3 px-4 border-b hidden sm:table-cell">
                        Ngày đặt hàng
                      </th>
                      <th className="py-3 px-4 border-b">Tổng số tiền</th>
                      <th className="py-3 px-6 border-b"> </th>
                      <th className="py-3 px-6 border-b"> </th>
                      <th className="py-3 px-6 border-b"> </th>
                    </tr>
                  </thead>
                  <tbody>{orders.map(renderOrderItems)}</tbody>
                </table>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
export default PersonalReview;
