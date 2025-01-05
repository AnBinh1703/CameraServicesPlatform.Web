import React, { useState } from 'react';
import { createProductReport } from '../../../../api/productReportApi';
import { createRating } from '../../../../api/ratingApi';

const ReportRatingDialog = ({ 
  isOpen, 
  onClose, 
  order,
  accountID,
  mode // 'report' or 'rating'
}) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      alert('Vui lòng nhập nội dung');
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'report') {
        const reportData = {
          supplierID: order.supplierID,
          productID: order.orderDetails[0]?.productID,
          statusType: 0,
          startDate: new Date().toISOString(), // Add current date for startDate
          endDate: new Date().toISOString(), // Add current date for endDate
          reason: comment,
          accountID: accountID,
          productReportResponse: comment // Add this required field
        };
        const response = await createProductReport(reportData);
        if (response?.isSuccess) {
          alert('Báo cáo thành công');
          onClose();
        } else {
          alert(response?.messages?.[0] || 'Có lỗi xảy ra khi gửi báo cáo');
        }
      } else {
        const response = await createRating(
          order.orderDetails[0]?.productID,
          accountID,
          rating,
          comment
        );
        if (response?.isSuccess) {
          alert('Đánh giá thành công');
          onClose();
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Có lỗi xảy ra khi gửi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">
          {mode === 'report' ? 'Báo cáo sản phẩm' : 'Đánh giá sản phẩm'}
        </h3>
        
        {mode === 'rating' && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đánh giá
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className={`p-2 rounded ${
                    rating >= value ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>
        )}

        <textarea
          className="w-full p-2 border rounded-lg mb-4 h-32"
          placeholder={mode === 'report' ? "Nhập lý do báo cáo..." : "Nhập nhận xét..."}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            disabled={isSubmitting}
          >
            Đóng
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang xử lý..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportRatingDialog;
