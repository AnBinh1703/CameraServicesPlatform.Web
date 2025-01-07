import { Table, message } from "antd";
import { useEffect, useState } from "react";
import { getUserById } from "../../../api/accountApi";
import { getRatingById } from "../../../api/ratingApi";
import { ratingColumns } from "./columns";
import RatingDetailModal from "./RatingDetailModal";

const RatingsTable = ({
  data,
  loading,
  pagination,
  onChange,
  productDetails,
  getColumnSearchProps,
  handleViewDetails,
}) => {
  const [userDetails, setUserDetails] = useState({});
  const [selectedRating, setSelectedRating] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userMap = {};
      for (const rating of data) {
        if (rating.accountID && !userDetails[rating.accountID]) {
          const userResponse = await getUserById(rating.accountID);
          if (userResponse?.result) {
            userMap[rating.accountID] = userResponse.result;
          }
        }
      }
      setUserDetails((prev) => ({ ...prev, ...userMap }));
    };

    fetchUserDetails();
  }, [data]);

  const onViewDetails = async (record) => {
    try {
      const response = await getRatingById(record.ratingID);
      if (response?.isSuccess && response?.result) {
        setSelectedRating(response.result);
        setModalVisible(true);
      } else {
        message.error("Không thể tải thông tin đánh giá");
      }
    } catch (error) {
      console.error("Error in onViewDetails:", error);
      message.error("Có lỗi xảy ra khi xem chi tiết");
    }
  };

  const columns = ratingColumns(
    getColumnSearchProps,
    productDetails,
    onViewDetails,
    userDetails
  );

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="ratingID"
        pagination={pagination}
        onChange={onChange}
        loading={loading}
      />
      <RatingDetailModal
        visible={modalVisible}
        rating={selectedRating}
        onCancel={() => {
          setModalVisible(false);
          setSelectedRating(null);
        }}
      />
    </>
  );
};

export default RatingsTable;
