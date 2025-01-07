import { Button, Descriptions, Input, Modal, Space, message } from "antd";
import moment from "moment";
import { useState } from "react";
import {
  approveProductReport,
  rejectProductReport,
} from "../../../api/productReportApi";

const { TextArea } = Input;

const DetailModal = ({
  visible,
  onCancel,
  item,
  productDetails,
  onSuccess,
}) => {
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    try {
      setLoading(true);
      const result = await approveProductReport(
        item.productReportID,
        messageInput
      );
      if (result?.isSuccess) {
        message.success("Đã phê duyệt báo cáo thành công");
        onSuccess?.();
        onCancel();
      } else {
        message.error(result?.messages?.[0] || "Lỗi khi phê duyệt báo cáo");
      }
    } catch (error) {
      message.error("Lỗi khi phê duyệt báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      const result = await rejectProductReport(
        item.productReportID,
        messageInput
      );
      if (result?.isSuccess) {
        message.success("Đã từ chối báo cáo thành công");
        onSuccess?.();
        onCancel();
      } else {
        message.error(result?.messages?.[0] || "Lỗi khi từ chối báo cáo");
      }
    } catch (error) {
      message.error("Lỗi khi từ chối báo cáo");
    } finally {
      setLoading(false);
    }
  };

  const footer =
    item?.statusType === "Pending" ? (
      <>
        <TextArea
          placeholder="Nhập tin nhắn xử lý..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{ marginBottom: 16 }}
          rows={3}
        />
        <Space>
          <Button onClick={onCancel}>Hủy</Button>
          <Button
            type="primary"
            style={{ background: "#52c41a" }}
            onClick={handleApprove}
            loading={loading}
            disabled={!messageInput.trim()}
          >
            Duyệt
          </Button>
          <Button
            danger
            type="primary"
            onClick={handleReject}
            loading={loading}
            disabled={!messageInput.trim()}
          >
            Từ chối
          </Button>
        </Space>
      </>
    ) : null;

  return (
    <Modal
      title="Chi tiết báo cáo"
      visible={visible}
      onCancel={onCancel}
      footer={footer}
      width={800}
    >
      {item && (
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Mã báo cáo">
            {item.productReportID}
          </Descriptions.Item>
          <Descriptions.Item label="Sản phẩm">
            {productDetails[item.productID]?.name || "N/A"} (ID:{" "}
            {item.productID})
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {item.statusType}
          </Descriptions.Item>
          <Descriptions.Item label="Lý do">{item.reason}</Descriptions.Item>
          <Descriptions.Item label="Phản hồi">{item.message}</Descriptions.Item>
          <Descriptions.Item label="Ngày bắt đầu">
            {moment(item.startDate).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày kết thúc">
            {moment(item.endDate).format("DD/MM/YYYY HH:mm")}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailModal;
