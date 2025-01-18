import {
  Breadcrumb,
  Button,
  Modal,
  Rate,
  Spin,
  Typography,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaRegSadCry } from "react-icons/fa"; // Import heart icons
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCategoryById } from "../../../api/categoryApi";
import { getProductById } from "../../../api/productApi";
import { getRatingsByProductId } from "../../../api/ratingApi";
import { getSupplierById } from "../../../api/supplierApi";
import {
  createWishlist,
  deleteWishlistItem,
  getWishlistByAccountId,
} from "../../../api/wishlistApi";
const { Title, Paragraph } = Typography;

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isWishlisted, setIsWishlisted] = useState(false); // State to track wishlist status
  const [ratings, setRatings] = useState([]); // State to store ratings
  const [wishlistId, setWishlistId] = useState(null);
  const [averageRating, setAverageRating] = useState(0); // State to store average rating

  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;
  const navigate = useNavigate();

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (accountId) {
        const wishlistData = await getWishlistByAccountId(accountId);
        if (wishlistData && wishlistData.result) {
          const wishlistItem = wishlistData.result.find(
            (item) => item.productID === parseInt(id)
          );
          if (wishlistItem) {
            setIsWishlisted(true);
            setWishlistId(wishlistItem.wishlistID);
          }
        }
      }
    };

    const loadProduct = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        console.log("Product data:", data);

        if (data) {
          setProduct(data);

          const supplierData = await getSupplierById(data.supplierID, 1, 1);
          const categoryData = await getCategoryById(data.categoryID);
          console.log("Category data:", categoryData);

          if (
            supplierData &&
            supplierData.result &&
            Array.isArray(supplierData.result.items) &&
            supplierData.result.items.length > 0
          ) {
            const supplier = supplierData.result.items[0];
            setSupplierName(supplier.supplierName);
          }

          if (categoryData && categoryData.result) {
            // Adjust this part based on the actual structure of categoryData
            const category = categoryData.result;
            setCategoryName(category.categoryName);
            console.log("Category name:", category.categoryName);
          } else {
            console.log(
              "Category data is not in the expected format or is empty."
            );
          }
          const ratingsData = await getRatingsByProductId(id, 1, 10);
          if (ratingsData && ratingsData.result) {
            setAverageRating(ratingsData.result.averageRating);
            setRatings(ratingsData.result.reviewComments.map((comment, index) => ({
              ratingID: index,
              ratingValue: ratingsData.result.averageRating,
              reviewComment: comment,
              createdAt: new Date().toISOString(), // Assuming current date for simplicity
            })));
          }
        }
      } catch (error) {
        console.error("Failed to load product:", error);
        message.error("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
    checkWishlistStatus();
  }, [id, accountId]);

  const showImageModal = (image) => {
    setSelectedImage(image);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedImage("");
  };

  const handleCreateOrderRent = (product) => {
    navigate("/create-order-rent", {
      state: {
        productID: product.productID,
        supplierID: product.supplierID,
        product,
      },
    });
  };

  const handleCreateOrderBuy = (product) => {
    navigate("/create-order-buy", {
      state: {
        productID: product.productID,
        supplierID: product.supplierID,
        product,
      },
    });
  };

  const handleAddToWishlist = async () => {
    if (!accountId) {
      message.warning("Vui lòng đăng nhập để quản lý danh sách yêu thích");
      return;
    }

    try {
      if (isWishlisted && wishlistId) {
        const result = await deleteWishlistItem(wishlistId);
        console.log("Delete result:", result);

        if (result?.isSuccess || result?.status === 200 || result === true) {
          message.success("Đã xóa sản phẩm khỏi danh sách yêu thích!");
          setIsWishlisted(false);
          setWishlistId(null);
        } else {
          message.error("Không thể xóa khỏi danh sách yêu thích");
        }
      } else {
        const data = {
          accountId: accountId,
          productID: product.productID,
        };
        const result = await createWishlist(data);
        if (result) {
          message.success("Đã thêm sản phẩm vào danh sách yêu thích!");
          const wishlistData = await getWishlistByAccountId(accountId);
          if (wishlistData && wishlistData.result) {
            const wishlistItem = wishlistData.result.find(
              (item) => item.productID === product.productID
            );
            if (wishlistItem) {
              setWishlistId(wishlistItem.wishlistID);
              setIsWishlisted(true);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error managing wishlist:", error);
      message.error("Không thể quản lý danh sách yêu thích.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6">
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item href="/">Trang chủ</Breadcrumb.Item>
          <Breadcrumb.Item>{categoryName}</Breadcrumb.Item>
          <Breadcrumb.Item>{product?.productName}</Breadcrumb.Item>
        </Breadcrumb>

        {loading ? (
          <Spin size="large" className="flex justify-center mt-10" />
        ) : (
          product && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Image Gallery Section */}
                <div className="lg:w-1/2">
                  <div className="relative group">
                    {product.listImage && product.listImage.length > 0 ? (
                      <img
                        src={product.listImage[0].image}
                        alt={product.productName}
                        className="w-full h-[500px] object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                        onClick={() =>
                          showImageModal(product.listImage[0].image)
                        }
                      />
                    ) : (
                      <div className="w-full h-[500px] bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500">
                          Không có hình ảnh
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Product Details Section */}
                <div className="lg:w-1/2">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800">
                        {product.productName}
                      </h1>
                      <p className="text-gray-600 mt-2">
                        {product.productDescription}
                      </p>
                    </div>
                    <button
                      onClick={handleAddToWishlist}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title={
                        isWishlisted
                          ? "Xóa khỏi danh sách yêu thích"
                          : "Thêm vào danh sách yêu thích"
                      }
                    >
                      {isWishlisted ? (
                        <FaRegHeart size={24} className="text-gray-400" />
                      ) : (
                        <FaHeart size={24} className="text-red-500" />
                      )}
                    </button>
                  </div>

                  {/* Pricing Grid Section */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {product.pricePerHour && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Giá theo giờ</p>
                        <p className="text-xl font-bold text-green-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.pricePerHour)}
                        </p>
                      </div>
                    )}
                    {product.pricePerDay && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Giá theo ngày</p>
                        <p className="text-xl font-bold text-green-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.pricePerDay)}
                        </p>
                      </div>
                    )}
                    {product.pricePerWeek && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Giá theo tuần</p>
                        <p className="text-xl font-bold text-green-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.pricePerWeek)}
                        </p>
                      </div>
                    )}
                    {product.pricePerMonth && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-500">Giá theo tháng</p>
                        <p className="text-xl font-bold text-green-600">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(product.pricePerMonth)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Deposit Information */}
                  {product.depositProduct && (
                    <div className="bg-yellow-50 p-4 rounded-lg mb-6">
                      <p className="text-sm text-yellow-700">Tiền đặt cọc</p>
                      <p className="text-xl font-bold text-yellow-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(product.depositProduct)}
                      </p>
                    </div>
                  )}

                  {/* Product Information Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Số sê-ri</p>
                      <p className="font-medium">{product.serialNumber}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Số lần cho thuê</p>
                      <p className="font-medium">{product.countRent} lần</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Chất lượng</p>
                      <p className="font-medium capitalize">
                        {product.quality}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Đánh giá</p>
                      <div className="flex items-center">
                        <Rate disabled defaultValue={averageRating} />
                        <span className="ml-2">{averageRating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Dates Information */}
                  <div className="text-sm text-gray-500 space-y-2 mb-6">
                    <p>
                      Ngày tạo:{" "}
                      {new Date(product.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                    <p>
                      Cập nhật:{" "}
                      {new Date(product.updatedAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    {product.status === 0 && (
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => handleCreateOrderBuy(product)}
                        className="flex-1 h-12 text-lg bg-blue-600 hover:bg-blue-700"
                      >
                        Đặt mua ngay
                      </Button>
                    )}
                    {product.status === 1 && (
                      <Button
                        type="primary"
                        size="large"
                        onClick={() => handleCreateOrderRent(product)}
                        className="flex-1 h-12 text-lg bg-green-600 hover:bg-green-700"
                      >
                        Thuê ngay
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Đánh giá sản phẩm</h2>
                {ratings.length > 0 ? (
                  <div className="grid gap-4">
                    {ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <div className="flex items-center gap-4 mb-2">
                          <Rate disabled defaultValue={averageRating} />
                          <span className="text-gray-600">
                            {averageRating}/5
                          </span>
                        </div>
                        <p className="text-gray-700 mb-2">
                          {rating.reviewComment}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <FaRegSadCry
                      size={32}
                      className="mx-auto mb-2 text-gray-400"
                    />
                    <p className="text-gray-500">Chưa có đánh giá nào</p>
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* Image Modal */}
        <Modal
          open={isModalVisible}
          footer={null}
          onCancel={handleCancel}
          width={800}
          className="image-modal"
        >
          {selectedImage && (
            <img
              src={selectedImage}
              alt={product?.productName}
              className="w-full h-auto"
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ProductDetailPage;
