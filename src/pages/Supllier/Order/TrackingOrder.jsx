import {
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Input, message, Modal, Table } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { getAllExtendsByOrderId, getExtendById } from "../../../api/extendApi";
import {
  acceptCancelOrder,
  addImgProductAfter,
  addImgProductBefore,
  cancelOrder,
  getImageProductAfterByOrderId,
  getImageProductBeforeByOrderId,
  updateOrderStatusApproved,
  updateOrderStatusCompleted,
  updateOrderStatusPendingRefund,
  updateOrderStatusPlaced,
  updateOrderStatusShipped,
} from "../../../api/orderApi";
import { getOrderDetails } from "../../../api/orderDetailApi";
import CreateReturnDetailForm from "../ReturnDetail/CreateReturnDetailForm";
import ActionsComponent from "./TrackingOrder/ActionsComponent";
import ImagesComponent from "./TrackingOrder/ImagesComponent";
import OrderDetailsTable from "./TrackingOrder/OrderDetailsTable";

const TrackingOrder = ({ order, onUpdate }) => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnDetailForm, setShowReturnDetailForm] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [returnInitiated, setReturnInitiated] = useState(false);
  const [beforeImageUrl, setBeforeImageUrl] = useState(null);
  const [afterImageUrl, setAfterImageUrl] = useState(null);
  const [extendsData, setExtendsData] = useState([]);
  const [cancelMessage, setCancelMessage] = useState("");

  useEffect(() => {
    const fetchImages = async (orderId) => {
      try {
        const beforeImageResponse = await getImageProductBeforeByOrderId(
          orderId
        );
        const afterImageResponse = await getImageProductAfterByOrderId(orderId);

        if (beforeImageResponse) {
          setBeforeImageUrl(beforeImageResponse.result);
        } else {
          message.error("Failed to fetch before image.");
        }

        if (afterImageResponse) {
          setAfterImageUrl(afterImageResponse.result);
        } else {
          message.error("Failed to fetch after image.");
        }
      } catch (error) {
        message.error("Error fetching images.");
      }
    };

    if (order?.orderID) {
      fetchImages(order.orderID);
    }
  }, [order]);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const data = await getOrderDetails(order.orderID);
        setOrderDetails(data.result || []);
      } catch (error) {
        message.error("Lỗi khi lấy chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    const fetchImages = async () => {
      try {
        const beforeImage = await getImageProductBeforeByOrderId(order.orderID);
        const afterImage = await getImageProductAfterByOrderId(order.orderID);
        setBeforeImageUrl(beforeImage?.url || null);
        setAfterImageUrl(afterImage?.url || null);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    if (order) {
      fetchOrderDetails();
      fetchImages();
    }
  }, [order]);

  useEffect(() => {
    if (order?.orderID) {
      fetchExtendsByOrderId(order.orderID);
    }
  }, [order]);

  const fetchExtendsByOrderId = async (orderID) => {
    setLoading(true);
    try {
      const result = await getAllExtendsByOrderId(orderID);
      console.log("API response:", result);
      if (result && result.isSuccess) {
        console.log("Fetched extends data:", result.result.items);
        setExtendsData(result.result.items || []);
      } else {
        console.error("Failed to fetch extends data.");
      }
    } catch (error) {
      console.error("Error fetching extends data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusCompleted(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được hoàn thành!");
        onUpdate(orderId, 2);
      } else {
        message.error("Không thể hoàn thành đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi hoàn thành đơn hàng.");
    }
  };

  const handleCancelOrder = async (orderId, message) => {
    try {
      const response = await cancelOrder(orderId, message);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được hủy!");
        onUpdate(orderId, 6);
      } else {
        message.error("Không thể hủy đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi hủy đơn hàng.");
    }
  };

  const handleShipOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusShipped(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được giao!");
        onUpdate(orderId, 4);
      } else {
        message.error("Không thể giao đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi giao đơn hàng.");
    }
  };

  const handleApproveOrder = async (orderId) => {
    try {
      const response = await updateOrderStatusApproved(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được phê duyệt!");
        onUpdate(orderId, 1);
      } else {
        message.error("Không thể phê duyệt đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi phê duyệt đơn hàng.");
    }
  };

  const handleAcceptCancelOrder = async (orderId) => {
    try {
      const response = await acceptCancelOrder(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được chấp nhận hủy!");
        onUpdate(orderId, 7); // Assuming 7 is the status for accepted cancellation
      } else {
        message.error("Không thể chấp nhận hủy đơn hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi chấp nhận hủy đơn hàng.");
    }
  };

  const handleUploadBefore = async (file) => {
    try {
      const response = await addImgProductBefore(order.orderID, file);
      if (response?.isSuccess) {
        message.success("Ảnh đã được thêm trước khi giao hàng!");
        setBeforeImageUrl(URL.createObjectURL(file)); // Update the state with the image URL
      } else {
        message.error("Không thể thêm ảnh trước khi giao hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi thêm ảnh trước khi giao hàng.");
    }
  };

  const handleUploadAfter = async (file) => {
    try {
      const response = await addImgProductAfter(order.orderID, file);
      if (response?.isSuccess) {
        message.success("Ảnh đã được thêm sau khi giao hàng!");
        setAfterImageUrl(URL.createObjectURL(file)); // Update the state with the image URL
      } else {
        message.error("Không thể thêm ảnh sau khi giao hàng.");
      }
    } catch (error) {
      message.error("Lỗi khi thêm ảnh sau khi giao hàng.");
    }
  };

  const handlePendingRefund = async (orderId) => {
    try {
      const response = await updateOrderStatusPendingRefund(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được cập nhật trạng thái chờ hoàn tiền!");
        onUpdate(orderId, 9);
      } else {
        message.error("Không thể cập nhật trạng thái chờ hoàn tiền.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái chờ hoàn tiền.");
    }
  };

  const handleUpdateOrderStatusPlaced = async (orderId) => {
    try {
      const response = await updateOrderStatusPlaced(orderId);
      if (response?.isSuccess) {
        message.success("Đơn hàng đã được cập nhật trạng thái 'Placed'!");
        onUpdate(orderId, 1); // Assuming 1 is the status for 'Placed'
      } else {
        message.error("Không thể cập nhật trạng thái 'Placed'.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái 'Placed'.");
    }
  };

  const showConfirm = (action, orderId) => {
    if (action === "cancel") {
      let localCancelMessage = "";
      Modal.confirm({
        title: "Bạn có chắc chắn muốn hủy đơn hàng này?",
        content: (
          <div>
            <p>Vui lòng nhập lý do hủy đơn:</p>
            <Input.TextArea
              onChange={(e) => (localCancelMessage = e.target.value)}
              placeholder="Nhập lý do hủy đơn hàng"
              rows={4}
            />
          </div>
        ),
        onOk() {
          handleCancelOrder(orderId, localCancelMessage);
        },
        okText: "Xác nhận",
        cancelText: "Hủy bỏ",
      });
      return;
    }

    Modal.confirm({
      title: "Bạn có chắc chắn?",
      content: `Bạn có muốn ${action} đơn hàng này không?`,
      onOk() {
        switch (action) {
          case "complete":
            handleCompleteOrder(orderId);
            break;
          case "cancel":
            handleCancelOrder(orderId);
            break;
          case "ship":
            handleShipOrder(orderId);
            break;
          case "approve":
            handleApproveOrder(orderId);
            break;
          case "accept-cancel":
            handleAcceptCancelOrder(orderId);
            break;
          case "upload-before":
            document.getElementById("uploadBeforeInput").click();
            break;
          case "upload-after":
            document.getElementById("uploadAfterInput").click();
            break;
          case "pending-refund":
            handlePendingRefund(orderId);
            break;
          case "update-placed":
            handleUpdateOrderStatusPlaced(orderId);
            break;
          default:
            break;
        }
      },
    });
  };

  const allSteps = [
    {
      title: "Chờ Phê duyệt đơn hàng",
      description: "Xác nhận và phê duyệt đơn hàng mới",
      status: 0,
      icon: <CheckOutlined />,
      action: "approve",
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-700",
    },
    {
      title: "Yêu cầu hủy đơn",
      description:
        "Sản phẩm không đủ đáp ứng yêu cầu dể giao dến tay khách hàng ",
      status: 0,
      icon: <CheckCircleOutlined />,
      action: "cancel",
      color: "yellow",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-700",
    },
    {
      title: "Xác nhận hủy đơn",
      description: "Chấp nhận yêu cầu hủy từ khách hàng",
      status: 6,
      icon: <CheckCircleOutlined />,
      action: "accept-cancel",
      color: "yellow",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-300",
      textColor: "text-yellow-700",
    },

    {
      title: "Đang xử lý",
      description: "Sản phẩm đang được vận chuyển đến khách hàng",
      status: 1,
      icon: <CarOutlined />,
      action: "ship",
      color: "purple",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-300",
      textColor: "text-purple-700",
    },
    {
      title: "Chờ trả hàng",
      description: "Đợi khách hàng trả sản phẩm",
      status: [12, 3],
      forOrderType: 1,
      icon: <SmileOutlined />,
      action: "ship",
      color: "indigo",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-300",
      textColor: "text-indigo-700",
    },
    {
      title: "Hoàn thành",
      description: "Đơn hàng đã được hoàn thành",
      status: [3, 4],
      icon: <CheckCircleOutlined />,
      action: "complete",
      color: "green",
      bgColor: "bg-green-50",
      borderColor: "border-green-300",
      textColor: "text-green-700",
    },
    {
      title: "Chờ hoàn tiền",
      description: "Đang xử lý hoàn tiền cho khách hàng",
      status: [2, 7],
      forOrderType: 1, // Add this property to indicate this step is only for rental orders
      icon: <CheckCircleOutlined />,
      action: "pending-refund",
      color: "orange",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-300",
      textColor: "text-orange-700",
    },
  ];

  // Filter steps based on orderType and orderStatus
  const steps = allSteps.filter((step) => {
    // Check if step should be included based on orderType
    const typeCheck =
      !step.forOrderType || step.forOrderType === order?.orderType;

    // Hide cancellation steps if status is not 6 or 7
    const hideCancellationSteps =
      ["Yêu cầu hủy đơn", "Xác nhận hủy đơn"].includes(step.title) &&
      ![6, 7].includes(order?.orderStatus);

    // Hide processing and later steps if order is cancelled or being cancelled
    const hideProcessingAndLater =
      [6, 7].includes(order?.orderStatus) &&
      ["Đang xử lý", "Chờ trả hàng", "Hoàn thành", "Chờ hoàn tiền"].includes(
        step.title
      );

    return typeCheck && !hideCancellationSteps && !hideProcessingAndLater;
  });

  const StepsComponent = ({ currentStep, steps }) => (
    <div className="w-full max-w-5xl mx-auto">
      <ol className="flex flex-col md:flex-row items-start md:items-center justify-between w-full p-4 space-y-4 md:space-y-0 md:space-x-8 xl:px-8">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;

          return (
            <li key={index} className={`flex-1 w-full`}>
              <div
                className={`relative flex flex-col items-center ${
                  index !== steps.length - 1
                    ? 'after:content-[""] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-4 after:inline-block dark:after:border-gray-700'
                    : ""
                }`}
              >
                <span
                  className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                    isActive
                      ? `${step.bgColor} ${step.borderColor}`
                      : isCompleted
                      ? "bg-green-100 border-green-500"
                      : "bg-gray-100 border-gray-300"
                  } border-2 transition-colors duration-200`}
                >
                  <span
                    className={`text-lg ${
                      isActive
                        ? step.textColor
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.icon}
                  </span>
                </span>
                <div className="mt-3 flex flex-col items-center">
                  <h3
                    className={`text-sm font-medium ${
                      isActive
                        ? step.textColor
                        : isCompleted
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-xs mt-1 text-center text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );

  const currentStep = steps.findIndex(
    (step) =>
      step.status === order.orderStatus ||
      (Array.isArray(step.status) && step.status.includes(order.orderStatus))
  );

  const extendColumns = [
    {
      title: "Mã gia hạn",
      dataIndex: "extendId",
      key: "extendId",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Đơn vị thời gian",
      dataIndex: "durationUnit",
      key: "durationUnit",
      render: (text) => {
        switch (text) {
          case 0:
            return "Giờ";
          case 1:
            return "Ngày";
          case 2:
            return "Tuần";
          case 3:
            return "Tháng";
          default:
            return text;
        }
      },
    },
    {
      title: "Giá trị thời gian",
      dataIndex: "durationValue",
      key: "durationValue",
    },
    {
      title: "Ngày trả gia hạn",
      dataIndex: "extendReturnDate",
      key: "extendReturnDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày bắt đầu gia hạn",
      dataIndex: "rentalExtendStartDate",
      key: "rentalExtendStartDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Ngày kết thúc gia hạn",
      dataIndex: "rentalExtendEndDate",
      key: "rentalExtendEndDate",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Tổng số tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
  ];

  const orderDetailsColumns = [
    {
      title: "Mã chi tiết đơn hàng",
      dataIndex: "orderDetailsID",
      key: "orderDetailsID",
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderID",
      key: "orderID",
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productName",
      key: "productName",
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "productQuality",
      key: "productQuality",
    },
    {
      title: "Tổng giá sản phẩm",
      dataIndex: "productPrice",
      key: "price",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Tổng giá sản phẩm",
      dataIndex: "productPriceTotal",
      key: "productPriceTotal",
      render: (text) =>
        new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(text),
    },
    {
      title: "Thời gian trả",
      dataIndex: "periodRental",
      key: "periodRental",
      render: (text) => moment(text).format("DD - MM - YYYY HH:mm"),
    },
  ];

  const handleReturnClick = (orderID) => {
    setSelectedOrderID(orderID);
    setShowReturnDetailForm(true);
    setReturnInitiated(true);
  };

  const handleExtendClick = async (extendID) => {
    const result = await getExtendById(extendID);
    if (result) {
      console.log("Extend data:", result);
    } else {
      console.error("Failed to fetch extend data.");
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Order Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Đơn hàng #{order?.orderID}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Ngày đặt: {moment(order?.orderDate).format("DD/MM/YYYY HH:mm")}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order?.orderStatus === 1
                    ? "bg-blue-100 text-blue-800"
                    : order?.orderStatus === 2
                    ? "bg-green-100 text-green-800"
                    : order?.orderStatus === 3
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {order?.orderType === 0 ? "Mua" : "Thuê"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 overflow-x-auto">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 px-4">
            Theo dõi tiến trình
          </h2>
          <StepsComponent currentStep={currentStep} steps={steps} />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Details */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Chi tiết đơn hàng
                </h2>
                <OrderDetailsTable
                  orderDetails={orderDetails}
                  columns={orderDetailsColumns}
                  loading={loading}
                />
              </div>
            </div>

            {/* Extends Table */}
            {order.orderStatus === 12 && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Thông tin gia hạn
                  </h2>
                  <Table
                    columns={extendColumns}
                    dataSource={extendsData}
                    rowKey="extendId"
                    pagination={false}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thao tác
              </h2>
              <ActionsComponent
                order={order}
                showConfirm={showConfirm}
                handleReturnClick={handleReturnClick}
                handleExtendClick={handleExtendClick}
                returnInitiated={returnInitiated}
                handleUploadBefore={handleUploadBefore}
                handleUploadAfter={handleUploadAfter}
              />
            </div>

            {/* Images Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Hình ảnh sản phẩm
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImagesComponent
                  beforeImageUrl={beforeImageUrl}
                  afterImageUrl={afterImageUrl}
                />
              </div>
              <input
                type="file"
                id="uploadBeforeInput"
                className="hidden"
                onChange={(e) => handleUploadBefore(e.target.files[0])}
              />
              <input
                type="file"
                id="uploadAfterInput"
                className="hidden"
                onChange={(e) => handleUploadAfter(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        {/* Return Detail Modal */}
        <Modal
          title={
            <h3 className="text-xl font-semibold text-gray-800">
              Tạo chi tiết trả hàng
            </h3>
          }
          visible={showReturnDetailForm}
          onCancel={() => setShowReturnDetailForm(false)}
          footer={null}
          width={800}
          className="rounded-lg"
        >
          <CreateReturnDetailForm
            orderID={selectedOrderID}
            onSuccess={() => setShowReturnDetailForm(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default TrackingOrder;
