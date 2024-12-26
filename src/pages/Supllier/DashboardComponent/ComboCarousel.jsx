import { AppstoreOutlined } from "@ant-design/icons";
import { Button, Card, Descriptions, Modal, Table, Typography } from "antd";
import React, { useState } from "react";
import { getComboById } from "../../../api/comboApi"; // Adjust the import path as necessary

const formatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const calculateRemainingTime = (endTime) => {
  const now = new Date();
  const end = new Date(endTime);
  const remainingTime = end - now;
  return remainingTime > 0 ? remainingTime : 0;
};

const durationMap = {
  0: 1,
  1: 2,
  2: 3,
  3: 5,
};

const ComboCarousel = ({ combos, totalCombos, totalDuration }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comboDetails, setComboDetails] = useState(null);

  const viewDetails = async (id) => {
    try {
      const combo = await getComboById(id);
      setComboDetails(combo.result);
      console.log("Combo details:", combo.result); // Log combo details to verify
      setIsModalVisible(true);
    } catch (error) {
      console.error("Failed to fetch combo details:", error);
      setComboDetails(null);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setComboDetails(null);
  };

  const columns = [
    {
      title: "Tên Combo",
      dataIndex: "comboName",
      key: "comboName",
    },
    {
      title: "Giá Combo",
      dataIndex: "comboPrice",
      key: "comboPrice",
      render: (text) => formatter.format(text),
    },
    {
      title: "Bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => formatDateTime(text),
    },
    {
      title: "Kết Thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => {
        const remainingTime = calculateRemainingTime(text);
        return remainingTime > 0
          ? `${formatDateTime(text)} (Còn lại: ${Math.ceil(
              remainingTime / (1000 * 60 * 60 * 24)
            )} ngày)`
          : `${formatDateTime(text)} (Đã hết hạn)`;
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => viewDetails(record.comboId)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <Card
      title={
        <span>
          <AppstoreOutlined /> Gói Combo Đăng Kí
        </span>
      }
    >
      {combos.length > 0 ? (
        <>
          <Table
            dataSource={combos}
            columns={columns}
            rowKey="comboOfSupplierId"
            pagination={false}
          />
          <Modal
            title="Chi tiết Combo"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {comboDetails && (
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Tên Combo">
                  {comboDetails.comboName}
                </Descriptions.Item>
                <Descriptions.Item label="Giá Combo">
                  {formatter.format(comboDetails.comboPrice)}
                </Descriptions.Item>

                <Descriptions.Item label="Thời lượng Combo">
                  {durationMap[comboDetails.durationCombo]} Tháng
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {formatDateTime(comboDetails.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày cập nhật">
                  {formatDateTime(comboDetails.updatedAt)}
                </Descriptions.Item>
              </Descriptions>
            )}
          </Modal>
        </>
      ) : (
        <Typography.Text>Không có Combo nào.</Typography.Text>
      )}
    </Card>
  );
};

export default ComboCarousel;
