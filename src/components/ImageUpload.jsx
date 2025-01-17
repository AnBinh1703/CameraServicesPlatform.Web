import React, { useState } from "react";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

const ImageUpload = ({ fileList, handleFileChange, handleRemoveFile }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url?.substring(file.url.lastIndexOf('/') + 1));
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </div>
  );

  const handleChange = async ({ fileList: newFileList }) => {
    const processedFileList = await Promise.all(
      newFileList.map(async (file) => {
        if (!file.url && !file.preview && file.originFileObj) {
          file.preview = await getBase64(file.originFileObj);
        }
        return {
          ...file,
          status: 'done'
        };
      })
    );
    handleFileChange({ fileList: processedFileList });
  };

  return (
    <>
      <Upload
        accept="image/*"
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        onRemove={handleRemoveFile}
        beforeUpload={() => false}
        multiple={false}
        maxCount={1}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="preview"
          style={{ width: '100%' }}
          src={previewImage}
        />
      </Modal>
    </>
  );
};

export default ImageUpload;
