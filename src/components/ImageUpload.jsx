import React from "react";
import { Button, Upload, message, Card } from "antd"; // Added Card
import { UploadOutlined } from "@ant-design/icons";

const ImageUpload = ({ file, filePreview, handleFileChange, handleRemoveFile }) => {
  return (
    <>
      <Upload
        name="file"
        listType="picture"
        beforeUpload={(file) => {
          const isImage = file.type.startsWith("image/");
          if (!isImage) {
            message.error("Chỉ có thể tải lên hình ảnh!");
          }
          const isLt2M = file.size / 1024 / 1024 < 2;
          if (!isLt2M) {
            message.error("Hình ảnh phải nhỏ hơn 2MB!");
          }
          return isImage && isLt2M;
        }}
        onChange={handleFileChange}
        onRemove={handleRemoveFile}
        showUploadList={false}
        accept="image/*" // Ensure only images can be selected
      >
        <Button icon={<UploadOutlined />} type="primary">
          Tải lên hình ảnh
        </Button>
      </Upload>
      {filePreview && (
        <Card
          hoverable
          style={{ marginTop: 16 }}
          cover={<img alt="Preview" src={filePreview} />}
        >
          <Button type="danger" onClick={handleRemoveFile} block>
            Xóa Hình Ảnh
          </Button>
        </Card>
      )}
    </>
  );
};

export default ImageUpload;
