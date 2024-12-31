import { useSelector } from "react-redux";
import { useState } from "react";
import "tailwindcss/tailwind.css";
import LoadingComponent from "../../components/LoadingComponent/LoadingComponent";
import PersonalModal from "./Account/PersonalModal";
import UserInfo from "./manageinfo/UserInfo";

const jobDescriptions = {
  0: "Sinh viên",
  1: "Nhiếp ảnh gia chuyên nghiệp",
  2: "Nhiếp ảnh gia tự do",
  3: "Người sáng tạo nội dung",
  4: "Người mới bắt đầu",
  5: "Sinh viên nhiếp ảnh",
  6: "Người đam mê du lịch",
  7: "Người dùng thường xuyên",
  8: "Khác",
};

const hobbyDescriptions = {
  0: "Nhiếp ảnh phong cảnh",
  1: "Nhiếp ảnh chân dung",
  2: "Nhiếp ảnh động vật hoang dã",
  3: "Nhiếp ảnh đường phố",
  4: "Nhiếp ảnh macro",
  5: "Nhiếp ảnh thể thao",
  6: "Khác",
};

const PersonalInformation = () => {
  const { user } = useSelector((state) => state.user || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const userMap = {
    name: `${user?.firstName || ""} ${user?.lastName || ""}`,
    email: `${user?.email || ""}`,
    phone: `${user?.phoneNumber || ""}`,
    address: `${user?.address || ""}`,
    job: user?.job,
    hobby: user?.hobby,
    gender: user?.gender,
    bankName: `${user?.bankName || ""}`,
    accountNumber: `${user?.accountNumber || ""}`,
    accountHolder: `${user?.accountHolder || ""}`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Thông tin cá nhân</h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý thông tin cá nhân và tài khoản của bạn
          </p>
        </div>

        <div className="bg-white rounded-lg shadow transition-all duration-200 hover:shadow-md">
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              <UserInfo
                userMap={userMap}
                jobDescriptions={jobDescriptions}
                hobbyDescriptions={hobbyDescriptions}
                setIsUpdateModalOpen={setIsUpdateModalOpen}
              />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <LoadingComponent isLoading={isLoading} title="Đang tải..." />
          </div>
        )}

        {isUpdateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <PersonalModal onClose={() => setIsUpdateModalOpen(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInformation;
