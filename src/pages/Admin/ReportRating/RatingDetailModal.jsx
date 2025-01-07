import { UserOutlined } from "@ant-design/icons";
import { Descriptions, Modal, Rate, Space, Spin, Typography } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { getUserById } from "../../../api/accountApi";
import { getProductById } from "../../../api/productApi";

const { Text } = Typography;

const RatingDetailModal = ({ visible, rating, onCancel }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      if (rating) {
        setLoading(true);
        try {
          const [productResponse, userResponse] = await Promise.all([
            getProductById(rating.productID),
            getUserById(rating.accountID),
          ]);

          setProductDetails(productResponse);
          if (userResponse?.result) {
            setUserDetails(userResponse.result);
          }
        } catch (error) {
          console.error("Error fetching details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchDetails();
  }, [rating]);

  if (!rating) return null;

  return (
    <Modal
      title="Chi tiết đánh giá"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Spin spinning={loading}>
        <Descriptions column={1} bordered>
          <Descriptions.Item label="Mã đánh giá">
            <Text copyable>{rating.ratingID}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Sản phẩm">
            <Space direction="vertical">
              <Text>
                Mã: <Text copyable>{rating.productID}</Text>
              </Text>
              {productDetails && (
                <>
                  <Text strong>{productDetails.productName}</Text>
                  <Text type="secondary">{productDetails.description}</Text>
                </>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Người đánh giá">
            <Space direction="vertical">
              <Text>
                Mã: <Text copyable>{rating.accountID}</Text>
              </Text>
              {userDetails && (
                <>
                  <Text strong>
                    <UserOutlined style={{ marginRight: 8 }} />
                    {`${userDetails.lastName} ${userDetails.firstName}`}
                  </Text>
                  <Text type="secondary" copyable>
                    {userDetails.email}
                  </Text>
                  <Text type="secondary">{userDetails.phoneNumber}</Text>
                </>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Đánh giá">
            <Space>
              <Rate disabled defaultValue={rating.ratingValue} />
              <Text>({rating.ratingValue}/5)</Text>
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Nội dung">
            {rating.reviewComment}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {moment(rating.createdAt).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
      </Spin>
    </Modal>
  );
};

export default RatingDetailModal;
