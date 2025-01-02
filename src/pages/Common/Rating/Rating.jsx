import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getProductById } from "../../../api/productApi";
import { getAllRatings } from "../../../api/ratingApi";

const Rating = () => {
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRating, setNewRating] = useState({
    productName: "",
    ratingValue: 0,
    reviewComment: "",
  });

  const userMap = {
    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
  };

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await getAllRatings();
        const ratingsWithProduct = await Promise.all(
          data.result.map(async (rating) => {
            try {
              const product = await getProductById(rating.productID);
              console.log("Fetched product:", product);
              return {
                ...rating,
                productName: product.productName,
                productImage:
                  product.listImage.length > 0 ? product.listImage[0] : null,
              };
            } catch (err) {
              console.error("Error fetching product:", err);
              return { ...rating, productName: "N/A", productImage: null };
            }
          })
        );
        setRatings(ratingsWithProduct);
      } catch (err) {
        setError("Lỗi khi lấy đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const openModal = () => setIsModalOpen(true);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Đánh giá</h1>
      <div className="flex justify-end mb-4"></div>
      <ul className="space-y-6">
        {ratings.map((rating) => (
          <li
            key={rating.ratingID}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <p className="font-semibold">Mã sản phẩm: {rating.productID}</p>
            <p className="font-semibold">Tên sản phẩm: {rating.productName}</p>
            {rating.productImage && (
              <img
                src={rating.productImage}
                alt={rating.productName}
                className="w-32 h-32 object-cover mt-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/150";
                }}
              />
            )}
            <p className="font-semibold">Tên tài khoản: {userMap.name}</p>
            <p className="font-semibold flex items-center">
              Đánh giá:
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < rating.ratingValue
                      ? "text-yellow-500 ml-1"
                      : "text-gray-300 ml-1"
                  }
                />
              ))}
            </p>
            <p className="font-semibold">Bình luận: {rating.reviewComment}</p>
            <p className="font-semibold">
              Ngày tạo: {new Date(rating.createdAt).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Rating;
