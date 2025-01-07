import {
  FaDollarSign,
  FaFacebook,
  FaFileContract,
  FaHeadset,
  FaLinkedin,
  FaShippingFast,
  FaShoppingCart,
  FaTwitter,
  FaUsers,
} from "react-icons/fa";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

const About = () => {
  return (
    <div>
      <main className="p-8">
        {/* Phần giới thiệu */}
        <div className="flex">
          <div className="w-1/2 pr-4">
            <h1 className="text-4xl font-bold mb-4">
              Camera Services Platform
            </h1>
            <p className="text-gray-700 mb-4">
              Trong lĩnh vực nhiếp ảnh và quay phim, nhiều người gặp khó khăn
              trong việc thuê thiết bị chất lượng với chi phí hợp lý, trong khi
              nhiều chủ sở hữu máy ảnh để thiết bị đắt tiền không sử dụng.
            </p>
            <p className="text-gray-700">
              Chúng tôi cung cấp giải pháp cho thuê và mua lại máy ảnh kỹ thuật
              số, giúp kết nối nhu cầu và thiết bị, mang lại sự linh hoạt và
              tiết kiệm cho khách hàng.
            </p>
          </div>
          <div className="w-1/2">
            <img
              src="https://placehold.co/500x300"
              alt="Person holding a camera"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Thống kê */}
        <div className="flex justify-between mt-8">
          <div className="bg-white shadow-md p-4 text-center w-1/4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-500 hover:text-white">
            <FaUsers className="text-2xl mb-2" />
            <div className="text-2xl font-bold">100+</div>
            <div className="text-gray-500 hover:text-white">
              Người bán trên trang web
            </div>
          </div>
          <div className="bg-white shadow-md p-4 text-center w-1/4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-500 hover:text-white">
            <FaShoppingCart className="text-2xl mb-2" />
            <div className="text-2xl font-bold">100+</div>
            <div className="text-gray-500 hover:text-white">
              Đơn hàng hàng tháng
            </div>
          </div>
          <div className="bg-white shadow-md p-4 text-center w-1/4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-500 hover:text-white">
            <FaUsers className="text-2xl mb-2" />
            <div className="text-2xl font-bold">1000+</div>
            <div className="text-gray-500 hover:text-white">
              Khách hàng trên trang web
            </div>
          </div>
          <div className="bg-white shadow-md p-4 text-center w-1/4 transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-500 hover:text-white">
            <FaDollarSign className="text-2xl mb-2" />
            <div className="text-2xl font-bold">50+</div>
            <div className="text-gray-500 hover:text-white">
              Doanh số bán hàng
            </div>
          </div>
        </div>

        {/* Đội ngũ */}
        <div className="flex justify-between mt-8">
          {["Tom Cruise", "Emma Watson", "Will Smith"].map((name, index) => (
            <div key={index} className="text-center w-1/3">
              <img
                src="https://placehold.co/150x150"
                alt={name}
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <div className="text-xl font-bold">{name}</div>
              <div className="text-gray-500 mb-2">
                {name === "Duong Hoang Anh"
                  ? "Người sáng lập & CEO"
                  : name === "Tran Quoc Anh"
                  ? "Giám đốc điều hành"
                  : "Nhà thiết kế sản phẩm"}
              </div>
              <div className="flex justify-center space-x-2">
                <FaFacebook />
                <FaTwitter />
                <FaLinkedin />
              </div>
            </div>
          ))}
        </div>

        {/* Dịch vụ */}
        <div className="flex justify-between mt-8">
          <div className="text-center w-1/3 flex flex-col items-center">
            <FaShippingFast className="text-4xl mb-2" />
            <div className="text-xl font-bold">Giao dịch nhanh chóng</div>
          </div>
          <div className="text-center w-1/3 flex flex-col items-center">
            <FaHeadset className="text-4xl mb-2" />
            <div className="text-xl font-bold">Dịch vụ khách hàng 24/7</div>
          </div>
          <div className="text-center w-1/3 flex flex-col items-center">
            <FaFileContract className="text-4xl mb-2" />
            <div className="text-xl font-bold">Minh bạch về các điều khoản</div>
          </div>
        </div>
      </main>
    </div>
  );
};


export default About;
