import React, { useState, useEffect } from "react";
import { addImgProductBefore, addImgProductAfter } from "../../api/orderApi";
import { message } from "antd";

const ImageUploadPopup = ({ orderId, type, onClose }) => {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Log props when component mounts or props change
  useEffect(() => {
    console.log('ImageUploadPopup Props:', {
      orderId,
      type,
      hasCloseFunction: !!onClose
    });
  }, [orderId, type, onClose]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log('File selected:', {
      fileName: selectedFile?.name,
      fileType: selectedFile?.type,
      fileSize: selectedFile?.size,
      lastModified: selectedFile?.lastModified
    });

    if (selectedFile) {
      setFile(selectedFile);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log('Preview URL created');
        setPreviewUrl(reader.result);
      };
      reader.onerror = (error) => {
        console.error('FileReader error:', error);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.log('Upload attempted without file');
      message.error("Vui lòng chọn ảnh trước khi tải lên");
      return;
    }

    console.log('Starting upload process:', {
      orderId,
      type,
      fileName: file.name,
      fileSize: file.size
    });

    try {
      const formData = new FormData();
      formData.append('file', file);
      console.log('FormData created:', {
        hasFile: formData.has('file'),
        formDataEntries: Array.from(formData.entries())
      });

      const response = type === "before"
        ? await addImgProductBefore(orderId, file)
        : await addImgProductAfter(orderId, file);

      console.log('Upload response:', response);

      if (response.isSuccess) {
        console.log('Upload successful');
        message.success("Tải ảnh lên thành công");
        onClose();
      } else {
        console.error('Upload failed with response:', response);
        message.error(response.messages?.join(", ") || "Có lỗi xảy ra khi tải ảnh");
      }
    } catch (error) {
      console.error('Upload error:', {
        error,
        errorMessage: error.message,
        errorStack: error.stack
      });
      message.error("Có lỗi xảy ra khi tải ảnh");
    }
  };

  const handleClose = () => {
    console.log('Closing upload popup');
    setFile(null);
    setPreviewUrl(null);
    onClose();
  };

  // Log state changes
  useEffect(() => {
    console.log('State updated:', {
      hasFile: !!file,
      hasPreview: !!previewUrl
    });
  }, [file, previewUrl]);

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Tải ảnh {type === "before" ? "trước" : "sau"} đơn hàng
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Image Preview */}
        <div className="mb-6">
          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-600">
                Nhấn để chọn hoặc kéo thả ảnh vào đây
              </p>
            </div>
          )}
        </div>

        {/* File Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chọn ảnh
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Tải lên
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPopup;
