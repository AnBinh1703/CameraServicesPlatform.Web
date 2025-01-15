import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { getCategoryById } from "../../api/categoryApi";
import {
  getImageProductAfterByOrderId,
  getImageProductBeforeByOrderId,
  getOrderDetailsById,
  getOrdersByAccount,
  purchaseOrder,
  updateOrderStatusPlaced,
} from "../../api/orderApi";
import { getSupplierById } from "../../api/supplierApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import OrderDetails from "./manageinfo/OrderDetails";
import OrderList from "./manageinfo/OrderList";

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
  10: { text: "Hoàn tiền thành công ", color: "brown", icon: "fa-undo" },
  11: { text: "Hoàn trả tiền đặt cọc", color: "gold", icon: "fa-piggy-bank" },
  12: { text: "Gia hạn", color: "violet", icon: "fa-calendar-plus" },
};

const orderTypeMap = {
  0: { text: "Mua", color: "indigo", icon: "fa-shopping-bag" },
  1: { text: "Thuê", color: "green", icon: "fa-warehouse" },
};

const deliveryStatusMap = {
  0: { text: "Nhận tại cửa hàng", color: "blue", icon: "fa-store" },
  1: { text: "Giao hàng tận nơi", color: "green", icon: "fa-truck" },
  2: { text: "Trả lại", color: "red", icon: "fa-undo" },
};

const OrderHistory = () => {
  const { user } = useSelector((state) => state.user || {});
  const [orders, setOrders] = useState([]);
  const [isOrderDetail, setIsOrderDetail] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [dataDetai, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryMap, setCategoryMap] = useState({});
  const [supplierMap, setSupplierMap] = useState({});
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      console.log("Fetching orders for user ID:", user.id);
      const response = await getOrdersByAccount(user.id, 1, 100);
      console.log("API response:", response);
      if (response.isSuccess) {
        setOrders(response.result || []);
      } else {
        message.error("Không thể tải danh sách đơn hàng.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
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
        const beforeImageResponse = await getImageProductBeforeByOrderId(id);
        const afterImageResponse = await getImageProductAfterByOrderId(id);
        setBeforeImage(beforeImageResponse.result);
        setAfterImage(afterImageResponse.result);
      } else {
        message.error("Không thể tải chi tiết đơn hàng.");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (dataDetai.length > 0) {
      console.log("Chi tiết đơn hàng", dataDetai);
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
      message.error("Lỗi khi tải thông tin danh mục hoặc nhà cung cấp.");
    }
  };

  const handleClick = (order) => {
    setIsOrderDetail(true);
    fetchOrderDetails(order.orderID);
  };

  const handlePaymentAgain = async (orderId) => { // Change parameter to orderId
    try {
      setIsLoading(true);
      const data = await purchaseOrder(orderId); // Now using orderId directly
      if (data.isSuccess && data.result) {
        window.location.href = data.result;
      } else {
        message.error("Không thể thực hiện thanh toán.");
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  const openUploadPopup = (orderId, type) => {
    setSelectedOrderId(orderId);
    setUploadType(type);
    setIsUploadPopupOpen(true);
  };

  const closeUploadPopup = () => {
    setIsUploadPopupOpen(false);
    setUploadType(null);
    setSelectedOrderId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="border-b border-gray-200 pb-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div>
                    <a href="/" className="text-gray-400 hover:text-gray-500">
                      <i className="fas fa-home"></i>
                      <span className="sr-only">Trang chủ</span>
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <i className="fas fa-chevron-right text-gray-400 text-sm"></i>
                    <span className="ml-4 text-sm font-medium text-gray-500">
                      Lịch sử đơn hàng
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
            <h1 className="mt-2 text-2xl font-bold leading-7 text-gray-900 sm:text-3xl">
              Lịch sử đơn hàng
            </h1>
          </div>
        </div>

        {/* Main content */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingComponent isLoading={true} title="Đang tải đơn hàng..." />
          </div>
        ) : (
          <div className="p-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {!isOrderDetail ? (
                <OrderList
                  orders={orders}
                  supplierMap={supplierMap}
                  orderStatusMap={orderStatusMap}
                  deliveryStatusMap={deliveryStatusMap}
                  orderTypeMap={orderTypeMap}
                  handleClick={handleClick}
                  handlePaymentAgain={handlePaymentAgain}
                  updateOrderStatusPlaced={updateOrderStatusPlaced}
                  openUploadPopup={openUploadPopup}
                />
              ) : (
                <OrderDetails
                  dataDetai={dataDetai}
                  supplierMap={supplierMap}
                  categoryMap={categoryMap}
                  beforeImage={beforeImage}
                  afterImage={afterImage}
                  setIsOrderDetail={setIsOrderDetail}
                />
              )}
              {/* Upload popup */}
              {isUploadPopupOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                  <ImageUploadPopup
                    orderId={selectedOrderId}
                    type={uploadType}
                    onClose={closeUploadPopup}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
