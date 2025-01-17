import {
  CarOutlined,
  CheckCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Modal, Upload, message } from "antd";
import React, { useState } from "react";
import CreateReturnDetailForm from "../../ReturnDetail/CreateReturnDetailForm"; // Assuming you have this component

const ActionsComponent = ({
  order,
  showConfirm,
  handleReturnClick,
  returnInitiated,
  handleUploadBefore,
  handleUploadAfter,
}) => {
  const [showReturnDetailForm, setShowReturnDetailForm] = useState(false);
  const [selectedOrderID, setSelectedOrderID] = useState(null);
  const [beforeImageUrl, setBeforeImageUrl] = useState(null);
  const [afterImageUrl, setAfterImageUrl] = useState(null);

  const handleReturnButtonClick = (orderID) => {
    setSelectedOrderID(orderID);
    setShowReturnDetailForm(true);
  };

  const handleBeforeUpload = async (file) => {
    try {
      const url = await handleUploadBefore(file);
      setBeforeImageUrl(url);
      message.success("Ảnh trước khi giao hàng đã được tải lên thành công");
    } catch (error) {
      message.error("Không thể tải lên ảnh trước khi giao hàng");
    }
  };

  const handleAfterUpload = async (file) => {
    try {
      const url = await handleUploadAfter(file);
      setAfterImageUrl(url);
      message.success("Ảnh sau khi giao hàng đã được tải lên thành công");
    } catch (error) {
      message.error("Không thể tải lên ảnh sau khi giao hàng");
    }
  };

  return (
    <div className="steps-action" style={{ marginTop: 16 }}>
      {(order.orderStatus === 0 || order.orderStatus === 8) && (
        <Button
          type="primary"
          onClick={() => showConfirm("approve", order.orderID)}
          className="ml-2"
          icon={<CheckOutlined />}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Phê duyệt
        </Button>
      )}
      {(order.orderStatus === 0 ||
        order.orderStatus === 8 ||
        order.orderStatus === 5) && (
        <Button
          type="danger"
          onClick={() => showConfirm("cancel", order.orderID)}
          className="ml-2"
          icon={<CloseOutlined />}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Yêu cầu hủy đơn
        </Button>
      )}
      {/* {(order.orderStatus === 0 || order.orderStatus === 5) && (
        <Button
          type="danger"
          onClick={() => showConfirm("cancel", order.orderID)}
          className="ml-2"
          icon={<CloseOutlined />}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Chấp nhận hủy đơn
        </Button>
      )} */}
      {order.orderStatus === 6 && (
        <Button
          type="primary"
          onClick={() => showConfirm("accept-cancel", order.orderID)}
          className="ml-2"
          icon={<CheckCircleOutlined />}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Chấp nhận hủy
        </Button>
      )}
      {order.orderStatus === 1 && order.deliveriesMethod === 1 && (
        <Button
          type="default"
          onClick={() => showConfirm("ship", order.orderID)}
          className="ml-2"
          icon={<CarOutlined />}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Giao hàng
        </Button>
      )}
      {((order.orderStatus === 4 && order.orderType === 1) ||
        (order.orderStatus === 12 && order.orderType === 1) ||
        (order.orderStatus === 3 && order.orderType === 1)) && (
        <Button
          type="primary"
          onClick={() => handleReturnButtonClick(order.orderID)}
          className="ml-2"
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Trả hàng
        </Button>
      )}
      <Modal
        title="Tạo chi tiết trả hàng"
        visible={showReturnDetailForm}
        onCancel={() => setShowReturnDetailForm(false)}
        footer={null}
      >
        <CreateReturnDetailForm
          orderID={selectedOrderID}
          onSuccess={() => setShowReturnDetailForm(false)}
        />
      </Modal>
      {((order.orderStatus === 4 && order.orderType === 1) ||
        returnInitiated) && (
        <Button
          type="primary"
          onClick={() => showConfirm("complete", order.orderID)}
          className="ml-2"
          icon={<CheckCircleOutlined />}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Kết thúc đơn thuê
        </Button>
      )}
      {((order.orderStatus === 4 && order.orderType === 1) ||
        returnInitiated) && (
        <Button
          type="primary"
          onClick={() => showConfirm("pending-refund", order.orderID)}
          className="ml-2"
          icon={<CheckCircleOutlined />}
          style={{ marginRight: 8, marginBottom: 8 }}
        >
          Gửi yêu cầu hoàn tiền cho hệ thống
        </Button>
      )}
      {order.orderStatus === 7 &&
        order.pay(
          <Button
            type="primary"
            onClick={() => showConfirm("pending-refund", order.orderID)}
            className="ml-2"
            icon={<CheckCircleOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Gửi yêu cầu hoàn tiền cho hệ thống
          </Button>
        )}
      {order.orderStatus === 1 &&
        order.deliveriesMethod === 0 &&
        order.orderType === 1 && (
          <Button
            type="primary"
            onClick={() => showConfirm("update-placed", order.orderID)}
            className="ml-2"
            icon={<CheckCircleOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Khách đã đến nhận hàng
          </Button>
        )}
      {order.orderStatus === 1 && order.orderType === 1 && (
        <Upload
          customRequest={({ file }) => handleBeforeUpload(file)}
          showUploadList={false}
        >
          <Button
            icon={<UploadOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Thêm ảnh trước khi giao hàng
          </Button>
        </Upload>
      )}
      {order.orderStatus === 4 && order.orderType === 1 && (
        <Upload
          customRequest={({ file }) => handleAfterUpload(file)}
          showUploadList={false}
        >
          <Button
            icon={<UploadOutlined />}
            style={{ marginRight: 8, marginBottom: 8 }}
          >
            Thêm ảnh sau khi giao hàng
          </Button>
        </Upload>
      )}
      {beforeImageUrl && (
        <div>
          <h3>Ảnh trước khi giao hàng:</h3>
          <img
            src={beforeImageUrl}
            alt="Before Delivery"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
      {afterImageUrl && (
        <div>
          <h3>Ảnh sau khi giao hàng:</h3>
          <img
            src={afterImageUrl}
            alt="After Delivery"
            style={{ maxWidth: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default ActionsComponent;
