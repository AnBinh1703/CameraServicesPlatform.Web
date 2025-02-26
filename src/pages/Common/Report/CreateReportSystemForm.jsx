import { Button, Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createReport, getReportsByAccountId } from "../../../api/reportApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";

const reportTypeMap = {
  0: "Hệ thống",
  1: "Nhà cung cấp",
};

const statusMap = {
  0: { text: "Chờ xử lý", color: "yellow" },
  1: { text: "Đã xử lý", color: "green" },
  2: { text: "Từ chối", color: "red" },
};

const CreateReportSystemForm = () => {
  const { user } = useSelector((state) => state.user || {});
  const [reportType, setReportType] = useState(0);
  const [reportDetails, setReportDetails] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setReportDetails("");
    setReportType(0);
  };

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const response = await getReportsByAccountId(user.id, 1, 10);
      if (response?.isSuccess) {
        setReports(response.result.items || []);
      }
    } catch (error) {
      console.error("Lỗi khi tải báo cáo:", error);
      message.error("Không thể tải danh sách báo cáo");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchReports();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reportDetails.trim()) {
      message.error("Vui lòng nhập nội dung báo cáo");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createReport({
        accountId: user.id,
        reportType,
        reportDetails: reportDetails.trim(),
      });

      if (response?.isSuccess) {
        message.success("Gửi báo cáo thành công");
        setReportDetails("");
        fetchReports();
        handleCancel();
      } else {
        message.error("Không thể gửi báo cáo");
      }
    } catch (error) {
      console.error("Lỗi khi gửi báo cáo:", error);
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") {
      return "Chưa cập nhật";
    }
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <div className="container mx-auto p-4">
      <LoadingComponent isLoading={isLoading} title="Đang xử lý..." />

      <Button type="primary" onClick={showModal} className="mb-4 bg-blue-500">
        Tạo báo cáo mới
      </Button>

      <Modal
        title="Gửi báo cáo"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">Loại báo cáo:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {Object.entries(reportTypeMap).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Nội dung:</label>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              className="w-full p-2 border rounded min-h-[100px]"
              placeholder="Nhập nội dung báo cáo..."
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button onClick={handleCancel}>Hủy</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              className="bg-blue-500"
            >
              Gửi báo cáo
            </Button>
          </div>
        </form>
      </Modal>

      {reports.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Lịch sử báo cáo</h2>
          <div className="space-y-6">
            {reports.map((report) => (
              <div
                key={report.reportID}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="font-semibold text-lg">
                        {reportTypeMap[report.reportType]}
                      </p>
                      <p className="text-gray-600">{report.reportDetails}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusMap[report.status].color === "yellow"
                          ? "bg-yellow-100 text-yellow-800"
                          : statusMap[report.status].color === "blue"
                          ? "bg-blue-100 text-blue-800"
                          : statusMap[report.status].color === "green"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {statusMap[report.status].text}
                    </span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    {report.message && (
                      <p className="text-gray-700 mb-2">
                        <span className="font-medium">Phản hồi:</span>{" "}
                        {report.message}
                      </p>
                    )}
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <p>Mã báo cáo: {report.reportID}</p>
                      <p>Ngày báo cáo: {formatDate(report.reportDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateReportSystemForm;
