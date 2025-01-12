import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";
import { getUserById } from "../../../api/accountApi"; // Add this import
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
        const ratingsWithProductAndUser = await Promise.all(
          data.result.map(async (rating) => {
            try {
              const productResponse = await getProductById(rating.productID);
              const userData = await getUserById(rating.accountID);

              // Extract product data and image URL
              const product = productResponse?.productName;
              const productImage =
                productResponse?.listImage?.[0]?.image || null;
              // console.log("product info", productResponse);
              // console.log("image info", productImage);
              console.log("name user", userData);
              return {
                ...rating,
                productName: product || "N/A",
                productImage: productImage,
                userName: `${userData.result.firstName} ${userData.result.lastName}`,
              };
            } catch (err) {
              console.error(
                "Error fetching data for rating:",
                rating.productID,
                err
              );
              return {
                ...rating,
                productName: "N/A",
                productImage: null,
                userName: "N/A",
              };
            }
          })
        );
        setRatings(ratingsWithProductAndUser);
      } catch (err) {
        console.error("Error in fetchRatings:", err);
        setError("Lỗi khi lấy đánh giá");
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  const openModal = () => setIsModalOpen(true);

  if (loading) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-md mb-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-500 p-4 rounded-lg shadow">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Đánh giá từ khách hàng
        </h1>
        <div className="grid gap-6">
          {ratings.map((rating) => (
            <div
              key={rating.ratingID}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="w-full md:w-1/4">
                  {rating.productImage ? (
                    <img
                      src={rating.productImage}
                      alt={rating.productName}
                      className="w-full h-48 object-cover rounded-lg shadow-sm hover:opacity-90 transition-opacity duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/150x150";
                      }}
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {rating.productName}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Mã sản phẩm: #{rating.productID}
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      Đánh giá bởi: {rating.userName}
                    </p>
                    <div className="flex items-center gap-1 my-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`w-5 h-5 ${
                            i < rating.ratingValue
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mt-2">
                      "{rating.reviewComment}"
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Đánh giá vào: {new Date(rating.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Rating;
