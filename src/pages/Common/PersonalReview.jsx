import { Image, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "tailwindcss/tailwind.css";
import { getProductById } from "../../api/productApi";
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
  const [ratings, setRatings] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  const fetchProductDetails = async (productId) => {
    try {
      const product = await getProductById(productId);
      setProductDetails((prev) => ({
        ...prev,
        [productId]: product,
      }));
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchAccountRatings = async () => {
    try {
      setIsLoading(true);
      const response = await getRatingsByAccountId(user.id, 1, 10);
      if (response?.isSuccess) {
        setRatings(response.result);
        // Fetch product details for each rating
        response.result.forEach((rating) => {
          fetchProductDetails(rating.productID);
        });
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateAverageRating = () => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, rating) => acc + rating.ratingValue, 0);
    return sum / ratings.length;
  };

  const renderRatingEntry = (rating) => {
    const product = productDetails[rating.productID];
    const productImage = product?.listImage?.[0]?.image || "/placeholder-image.jpg";

    return (
      <div
        key={rating.ratingID}
        className="bg-white p-4 rounded-lg shadow mb-4"
      >
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0">
            <Image
              src={productImage}
              alt={product?.productName}
              className="w-full h-full object-cover rounded"
              fallback="/placeholder-image.jpg"
            />
          </div>
          <div className="flex-grow">
            <h4 className="font-semibold text-lg mb-1">
              {product?.productName || "Đang tải..."}
            </h4>
            <div className="flex justify-between items-center mb-2">
              <div className="text-yellow-500">
                {"★".repeat(rating.ratingValue)}
                {"☆".repeat(5 - rating.ratingValue)}
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(rating.createdAt)}
              </span>
            </div>
            <p className="text-gray-700">
              {rating.reviewComment || "Không có nhận xét"}
            </p>
            <div className="mt-2 text-sm text-gray-500">
              <span className="mr-4">ID: {rating.productID}</span>
              <span>Mã đánh giá: {rating.ratingID}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderRatingsOverview = () => (
    <div className="mb-6 p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-3">Tổng quan đánh giá</h3>
      <div className="flex items-center mb-2">
        <span className="mr-2">Đánh giá trung bình:</span>
        <span className="text-yellow-500">
          {"★".repeat(Math.round(calculateAverageRating()))}
          {"☆".repeat(5 - Math.round(calculateAverageRating()))}
        </span>
        <span className="ml-1">({calculateAverageRating().toFixed(1)})</span>
      </div>
      <div className="text-sm text-gray-600">
        Tổng số đánh giá: {ratings.length}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <LoadingComponent isLoading={isLoading} title="Đang tải dữ liệu..." />
      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {renderRatingsOverview()}
            <div className="space-y-4">
              {ratings.map((rating) => renderRatingEntry(rating))}
            </div>
          </div>
          <div className="lg:col-span-1">{/* Sidebar content if needed */}</div>
        </div>
      )}
    </div>
  );
};

export default PersonalReview;
