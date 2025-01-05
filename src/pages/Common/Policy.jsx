import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import {
  getAllPolicies,
  getPoliciesByApplicableObject,
} from "../../api/policyApi"; // Adjust the import based on your file structure
import { ApplicableObject, getPolicyType } from "../../utils/constant"; // Adjust the import based on your file structure

const Policy = () => {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;
  const [policyType, setPolicyType] = useState(null); // New state for policy type

  const [expandedPolicy, setExpandedPolicy] = useState(null);

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const result =
          policyType !== null
            ? await getPoliciesByApplicableObject(
                policyType,
                pageIndex,
                pageSize
              )
            : await getAllPolicies(pageIndex, pageSize);
        console.log("API Result:", result); // Log the API result
        if (result && result.isSuccess) {
          if (Array.isArray(result.result)) {
            // Handle case where result is an array
            setPolicies(result.result);
            setTotalPages(Math.ceil(result.result.length / pageSize));
          } else if (result.result.items) {
            // Handle case where result is an object with items and totalPages
            setPolicies(result.result.items);
            setTotalPages(
              result.result.totalPages > 0 ? result.result.totalPages : 1
            );
          } else {
            setError("Không thể lấy chính sách.");
          }
        } else {
          setError("Không thể lấy chính sách.");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chính sách:", error);
        setError("Đã xảy ra lỗi khi lấy chính sách.");
      }
      setLoading(false);
    };

    fetchPolicies();
  }, [pageIndex, pageSize, policyType]);

  const togglePolicy = (policyID) => {
    setExpandedPolicy(expandedPolicy === policyID ? null : policyID);
  };

  const handlePrevious = () => {
    if (pageIndex > 1) setPageIndex(pageIndex - 1);
  };

  const handleNext = () => {
    if (pageIndex < totalPages) setPageIndex(pageIndex + 1);
  };

  const handlePolicyTypeChange = (type) => {
    if (policyType === type) {
      setPolicyType(null); // Reset to show all policies if the same button is double-clicked
    } else {
      setPolicyType(type);
    }
    setPageIndex(1); // Reset to first page when policy type changes
  };

  return (
    <div>
      <header className="bg-gray-900 shadow p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div>
            <span className="bg-teal-500 text-white px-3 py-1 rounded">
              TRUNG TÂM TRỢ GIÚP
            </span>
            <h1 className="text-4xl font-extrabold mt-2 text-white">
              Chúng tôi có thể giúp gì cho bạn!
            </h1>
          </div>
          <div className="mt-4 md:mt-0">
            <img
              src="https://thumb.ac-illust.com/96/96cdd9d61cb741de486486073b0f821a_t.jpeg"
              alt="Đại diện hỗ trợ khách hàng"
              className="rounded-full w-28 h-28 object-cover border-2 border-white shadow-lg"
            />
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto mt-10 px-4">
        <section className="mt-10">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">
            Các Chính Sách Hiện Có
          </h2>
          <div className="mb-6 flex space-x-2">
            <button
              onClick={() => handlePolicyTypeChange(ApplicableObject.System)}
              className={`px-5 py-2 rounded-full transition-colors duration-300 ${
                policyType === ApplicableObject.System
                  ? "bg-teal-600 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-teal-400 hover:text-white"
              }`}
            >
              HỆ THỐNG
            </button>
            <button
              onClick={() => handlePolicyTypeChange(ApplicableObject.Supplier)}
              className={`px-5 py-2 rounded-full transition-colors duration-300 ${
                policyType === ApplicableObject.Supplier
                  ? "bg-teal-600 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-teal-400 hover:text-white"
              }`}
            >
              NHÀ CUNG CẤP
            </button>
            <button
              onClick={() => handlePolicyTypeChange(ApplicableObject.Member)}
              className={`px-5 py-2 rounded-full transition-colors duration-300 ${
                policyType === ApplicableObject.Member
                  ? "bg-teal-600 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-teal-400 hover:text-white"
              }`}
            >
              THÀNH VIÊN
            </button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center">
              <svg
                className="animate-spin h-10 w-10 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-label="Loading"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              <span className="ml-3 text-teal-500 text-lg">Đang tải...</span>
            </div>
          ) : error ? (
            <p className="text-red-600 text-center text-lg" role="alert">
              {error}
            </p>
          ) : policies.length > 0 ? (
            <>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {policies.map((policy) => (
                  <li
                    key={policy.policyID}
                    className="bg-white border border-gray-200 rounded-lg p-6 shadow hover:shadow-2xl transition-shadow duration-300"
                  >
                    <h3 className="font-semibold text-2xl text-gray-800">
                      {policy.policyContent}
                    </h3>
                    <button
                      className="mt-4 text-teal-500 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded transition-colors duration-300"
                      onClick={() => togglePolicy(policy.policyID)}
                      aria-expanded={expandedPolicy === policy.policyID}
                      aria-controls={`policy-details-${policy.policyID}`}
                    >
                      {expandedPolicy === policy.policyID
                        ? "Thu gọn"
                        : "Xem chi tiết"}
                    </button>
                    {expandedPolicy === policy.policyID && (
                      <div
                        id={`policy-details-${policy.policyID}`}
                        className="mt-4 bg-gray-100 p-4 rounded-lg transition-all duration-300"
                      >
                        <p className="text-gray-700">
                          <strong>Loại chính sách:</strong>
                          {getPolicyType(policy.policyType)}
                        </p>
                        <p className="text-gray-700">
                          <strong>Hiệu lực:</strong>
                          {new Date(policy.effectiveDate).toLocaleString()}
                        </p>
                        <p className="text-gray-700">
                          <strong>ID chính sách:</strong> {policy.policyID}
                        </p>
                        {/* Thêm thông tin khác nếu cần */}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
              <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                  onClick={handlePrevious}
                  disabled={pageIndex === 1}
                  className={`px-5 py-2 rounded-full transition-colors duration-300 ${
                    pageIndex === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  }`}
                  aria-disabled={pageIndex === 1}
                >
                  Trước
                </button>
                <span className="text-lg text-gray-700">
                  Trang {pageIndex} / {totalPages}
                </span>
                <button
                  onClick={handleNext}
                  disabled={pageIndex === totalPages}
                  className={`px-5 py-2 rounded-full transition-colors duration-300 ${
                    pageIndex === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-teal-600 text-white hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  }`}
                  aria-disabled={pageIndex === totalPages}
                >
                  Tiếp theo
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              Không có chính sách nào để hiển thị.
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default Policy;
