import { Input, Layout, Spin, Typography } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import PersonalModal from "../Common/Account/PersonalModal";
import ProductList from "./Product/ProductList";
import ProposalProductFollowHobby from "./Product/ProposalProductFollowHobby";
import ProposalProductFollowJobBuy from "./Product/ProposalProductFollowJobBuy";
import Rating from "./Rating/Rating";
const { Header, Content } = Layout;
const { Title } = Typography;
const { Search } = Input;

const Home = () => {
  const { user } = useSelector((state) => state.user || {});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isJobHobbyModalOpen, setIsJobHobbyModalOpen] = useState(false);

  const showUpdateAccountModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    if (user && user.job === null && user.hobby === null) {
      setIsJobHobbyModalOpen(true);
    }
  }, [user]);

  const images = [
    {
      url: "https://th.bing.com/th/id/R.71e5cd9565219e6a53ef5805025b4bc6?rik=VDvYSPf2D5ty%2bw&pid=ImgRaw&r=0",
      title: "Nhanh tay lên!",
      description: "Phiếu giảm giá lên tới 10%",
    },
    {
      url: "https://koala.sh/api/image/v2-3cfnz-6x48e.jpg?width=1344&height=768&dream",
      title: "Chạm đến sắc màu",
      description: "Nắm trọn khoẳng khắc",
      renderOverlay: () => null, // Add renderOverlay for consistency
    },
    {
      url: "https://th.bing.com/th/id/OIP.gm94XOQvsa0S89QhcaLtCwAAAA?w=474&h=287&rs=1&pid=ImgDetMain",
      title: "Nút chạm khắc ghi",
      description: "Chỉ cần chạm nhẹ, bạn nắm trọn khoảng khắc bạn muốn ",
      renderOverlay: () => null, // Add renderOverlay for consistency
    },
  ];
  const logoSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    arrows: true,
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <Suspense fallback={<Spin tip="Loading Home component..." />}>
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img
              className="w-full h-96 object-cover rounded-md"
              src={image.url}
              alt={`Slide ${index + 1}`}
            />
            <div className="absolute bottom-0 left-0 bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-2xl font-bold">{image.title}</h2>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </Slider>

      <ProductList />
      <section className="my-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Đề xuất</h2>
        </div>

        {user ? (
          <>
            {user.hobby && <ProposalProductFollowHobby />}
            {user.job && <ProposalProductFollowJobBuy />}
          </>
        ) : null}

        {isJobHobbyModalOpen && (
          <PersonalModal onClose={() => setIsJobHobbyModalOpen(false)} />
        )}
      </section>
      <Rating />
      <h2 className="text-2xl font-bold mb-4">Các thương hiệu đồng hành </h2>

      <Slider {...logoSettings}>
        <div className="px-2">
          <img
            src="https://upload.wikimedia.org/wikipedia/sq/thumb/5/54/Canon_logo.jpg/250px-Canon_logo.jpg"
            alt="Canon"
            className="mx-auto"
            width="250"
            height="250"
          />
        </div>
        <div className="px-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRx0wgnyFOMBu_akXZK0Nuaf21w_cdJ8SI_Pr0FneO4essV4mSfVVzjbeuGEMW7i1f64Vk&usqp=CAU"
            alt="Sony"
            className="mx-auto"
            width="250"
            height="250"
          />
        </div>
        <div className="px-2">
          <img
            src="https://logos-world.net/wp-content/uploads/2023/03/Nikon-Logo-1965.png"
            alt="Nikon"
            className="mx-auto"
            width="250"
            height="250"
          />
        </div>
        <div className="px-2">
          <img
            src="https://logodix.com/logo/1145209.png"
            alt="Fujifilm"
            className="mx-auto"
            width="250"
            height="250"
          />
        </div>
        <div className="px-2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSazCWo0bI2fIW0YdCpymFK-das9FQQlT8Rpw&s"
            alt="Ricoh"
            className="mx-auto"
            width="250"
            height="250"
          />
        </div>
        <div className="px-2">
          <img
            src="https://cnicphday.wordpress.com/wp-content/uploads/2018/10/logo-leica.png"
            alt="Leica"
            className="mx-auto"
            width="250"
            height="250"
          />
        </div>
      </Slider>
    </Suspense>
  );
};

export default Home;
