import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { getRatingsByAccountId } from "../../api/ratingApi";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";

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
  5: {
    text: "Thanh toán thất bại",
    color: "cyan",
    icon: "fa-money-bill-wave",
  },
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

const PersonalReview = () => {
  const { user } = useSelector((state) => state.user || {});
  const [isLoading, setIsLoading] = useState(false);
  const [accountRatings, setAccountRatings] = useState({
    averageRating: 0,
    reviewComments: [],
  });

  const fetchAccountRatings = async () => {
    try {
      setIsLoading(true);
      const response = await getRatingsByAccountId(user.id, 1, 10);
      if (response?.isSuccess) {
        setAccountRatings(response.result);
      }
    } catch (error) {
      console.error("Lỗi khi tải đánh giá:", error);
      message.error("Không thể tải đánh giá");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAccountRatings();
    }
  }, [user]);

  const renderRatingsOverview = () => (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-3">Tổng quan đánh giá của bạn</h3>
      <div className="flex items-center mb-2">
        <span className="mr-2">Đánh giá trung bình:</span>
        <span className="text-yellow-500">
          {"★".repeat(Math.round(accountRatings.averageRating))}
        </span>
        <span className="ml-1">
          ({accountRatings.averageRating.toFixed(1)})
        </span>
      </div>
      {accountRatings.reviewComments.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Nhận xét gần đây:</h4>
          <ul className="list-disc pl-5">
            {accountRatings.reviewComments.map((comment, index) => (
              <li key={index} className="text-gray-600">
                {comment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <LoadingComponent isLoading={isLoading} title="Đang tải dữ liệu..." />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white shadow-lg rounded-lg p-6">
          {renderRatingsOverview()}
        </div>
      </div>
    </div>
  );
};

export default PersonalReview;
