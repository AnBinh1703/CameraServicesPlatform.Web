import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons"; // Đảm bảo bạn đã import các icon này
import { Button, Col, Form, message, Modal, Row, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { getAccountById } from "../../../api/accountApi"; // Ensure this API function is implemented

const GetInformationAccount = ({ accountId, visible, onCancel, mainRole }) => {
  // Thêm tham số mainRole
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAccountData = async () => {
      if (accountId) {
        setLoading(true);
        try {
          const data = await getAccountById(accountId);
          if (data.isSuccess) {
            setAccountData(data.result);
          } else {
            message.error("Lấy dữ liệu tài khoản không thành công.");
          }
        } catch (error) {
          message.error("Đã xảy ra lỗi khi lấy dữ liệu tài khoản.");
        }
        setLoading(false);
      }
    };

    fetchAccountData();
  }, [accountId]);

  const handleCopyData = () => {
    if (accountData) {
      const dataToCopy = `${accountData.email}`;

      navigator.clipboard
        .writeText(dataToCopy)
        .then(() => {
          message.success("Dữ liệu email đã được sao chép vào clipboard!");
        })
        .catch(() => {
          message.error("Sao chép email tài khoản không thành công.");
        });
    }
  };

  return (
    <Modal
      title="Thông tin tài khoản"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      centered
      width={800} // Set a specific width for the modal
    >
      {loading ? (
        <Spin />
      ) : (
        <Form layout="vertical" style={{ padding: "20px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<strong>Mã tài khoản</strong>}>
                <span>{accountData?.id}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<strong>Họ</strong>}>
                <span>{accountData?.firstName}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<strong>Tên</strong>}>
                <span>{accountData?.lastName}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<strong>Email</strong>}>
                <span>{accountData?.email}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<strong>Tên người dùng</strong>}>
                <span>{accountData?.userName}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<strong>Số điện thoại</strong>}>
                <span>{accountData?.phoneNumber}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<strong>Địa chỉ</strong>}>
                <span>{accountData?.address || "Chưa cung cấp địa chỉ"}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<strong>Giới tính</strong>}>
                <span>
                  {accountData?.gender !== undefined
                    ? accountData.gender === 0
                      ? "Nam"
                      : "Nữ"
                    : "Không xác định"}
                </span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<strong>Nghề nghiệp</strong>}>
                <span>{accountData?.job || "Chưa cung cấp nghề nghiệp"}</span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<strong>Sở thích</strong>}>
                <span>{accountData?.hobby || "Chưa cung cấp sở thích"}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<strong>Supplier ID</strong>}>
                <span>
                  {accountData?.supplierID || "No supplier ID provided"}
                </span>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<strong>Đã xác minh</strong>}>
                <span style={{ display: "flex", alignItems: "center" }}>
                  {accountData?.isVerified ? (
                    <>
                      <CheckCircleOutlined
                        style={{ color: "green", marginRight: 8 }}
                      />
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined
                        style={{ color: "red", marginRight: 8 }}
                      />
                    </>
                  )}
                </span>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label={<strong>Mặt trước của CMND/CCCD</strong>}>
                <img
                  src={
                    accountData?.frontOfCitizenIdentificationCard ||
                    "https://placehold.co/400x200"
                  }
                  alt="Mặt trước của CMND"
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "10px",
                    borderRadius: "5px",
                  }} // Added border-radius for better aesthetics
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label={<strong>Mặt sau của CMND/CCCD</strong>}>
                <img
                  src={
                    accountData?.backOfCitizenIdentificationCard ||
                    "https://placehold.co/400x200"
                  }
                  alt="Mặt sau của CMND"
                  style={{
                    width: "100%",
                    height: "auto",
                    marginTop: "10px",
                    borderRadius: "5px",
                  }} // Added border-radius for better aesthetics
                />
              </Form.Item>
            </Col>
          </Row>
          <Button type="primary" onClick={handleCopyData}>
            Sao chép email tài khoản
          </Button>
        </Form>
      )}
    </Modal>
  );
};

export default GetInformationAccount;
