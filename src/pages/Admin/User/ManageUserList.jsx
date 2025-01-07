import { SearchOutlined, UpOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Input,
  message,
  Pagination,
  Select,
  Space,
} from "antd"; // Add DatePicker
import moment from "moment"; // Add moment for date handling
import { useEffect, useState } from "react";
import { getAllAccount } from "../../../api/accountApi";
import {
  getAllActiveAccounts,
  getAllInactiveAccounts,
} from "../../../api/staffApi";
import LoadingComponent from "../../../components/LoadingComponent/LoadingComponent";
import { genderLabels } from "../../../utils/constant";
import GetInformationAccount from "./GetInformationAccount";

const { Option } = Select;

const ManageUserList = () => {
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(1);
  const itemsPerPage = 10;
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    gender: "",
    status: "",
    createdAt: null, // Add this line
  });
  const [filterType, setFilterType] = useState("all"); // Add this

  const [selectedAccountId, setSelectedAccountId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async (page) => {
    try {
      setIsLoading(true);
      let data;

      switch (filterType) {
        case "active":
          data = await getAllActiveAccounts(page, itemsPerPage);
          break;
        case "inactive":
          data = await getAllInactiveAccounts(page, itemsPerPage);
          break;
        default:
          data = await getAllAccount(page, itemsPerPage);
      }

      if (data.isSuccess) {
        setAccounts(data.result?.items || []);
        setTotalItems(data.result.totalPages || 1);
      }
    } catch (error) {
      message.error("Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, filterType]); // Add filterType dependency

  const handleFilterChange = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  // Updated filter function with null checks
  const filteredAccounts = accounts.filter((item) => {
    // Skip filtering if item is null/undefined
    if (!item) return false;

    const fullName = item.firstName && item.lastName 
      ? `${item.firstName} ${item.lastName}`.toLowerCase()
      : '';
    const status = item.isVerified ? "true" : "false";
    const dateMatch =
      !searchTerm.createdAt ||
      moment(item.createdAt).format("DD-MM-YYYY") ===
        moment(searchTerm.createdAt).format("DD-MM-YYYY");

    return (
      fullName.includes(searchTerm.name.toLowerCase()) &&
      (item.email?.toLowerCase() || '').includes(searchTerm.email.toLowerCase()) &&
      (item.phoneNumber?.toLowerCase() || '').includes(searchTerm.phone.toLowerCase()) &&
      (item.mainRole?.toLowerCase() || '').includes(searchTerm.role.toLowerCase()) &&
      (genderLabels[item.gender] || "Không xác định")
        .toLowerCase()
        .includes(searchTerm.gender.toLowerCase()) &&
      status.includes(searchTerm.status.toLowerCase()) &&
      dateMatch
    );
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleResetSearch = () => {
    setSearchTerm({
      name: "",
      email: "",
      phone: "",
      role: "",
      gender: "",
      status: "",
      createdAt: null, // Add this line
    });
    fetchData(1);
  };

  const handleDoubleClick = (user) => {
    setSelectedAccountId(user.id);
    setModalVisible(true);
  };

  const isNewAccount = (createdAt) => {
    if (!createdAt) return false;
    const today = moment().startOf("day");
    const accountDate = moment(createdAt).startOf("day");
    return today.isSame(accountDate);
  };

  return (
    <div className="p-6">
      <LoadingComponent isLoading={isLoading} title={"Đang tải dữ liệu"} />
      <h2 className="text-center font-bold text-primary text-2xl mb-6">
        Danh Sách Người Dùng
      </h2>

      <div className="flex justify-between items-center gap-4 mb-6">
        <Space size="middle">
          <Button
            type={filterType === "all" ? "primary" : "default"}
            onClick={() => handleFilterChange("all")}
            size="large"
            className="min-w-[150px]"
          >
            Tất cả người dùng
          </Button>
          <Button
            type={filterType === "active" ? "primary" : "default"}
            onClick={() => handleFilterChange("active")}
            size="large"
            icon={<CheckCircleOutlined />}
            className="min-w-[150px]"
          >
            Đã xác thực
          </Button>
          <Button
            type={filterType === "inactive" ? "primary" : "default"}
            onClick={() => handleFilterChange("inactive")}
            size="large"
            icon={<CloseCircleOutlined />}
            className="min-w-[150px]"
          >
            Chưa xác thực
          </Button>
        </Space>

        <Space>
          <Button
            onClick={() => setIsSearchVisible(!isSearchVisible)}
            type="primary"
            icon={isSearchVisible ? <UpOutlined /> : <SearchOutlined />}
            size="large"
          >
            {isSearchVisible ? "Ẩn tìm kiếm" : "Hiển thị tìm kiếm"}
          </Button>
          <Button 
            onClick={handleResetSearch} 
            type="primary" 
            danger
            icon={<ReloadOutlined />}
            size="large"
          >
            Làm mới
          </Button>
        </Space>
      </div>

      {/* Search section with improved styling */}
      {isSearchVisible && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
            <div>
              <label>Tên:</label>
              <Input
                placeholder="Tìm theo tên..."
                value={searchTerm.name}
                onChange={(e) =>
                  setSearchTerm({ ...searchTerm, name: e.target.value })
                }
                className="border rounded-lg p-2 shadow-md"
              />
            </div>
            <div>
              <label>Email:</label>
              <Input
                placeholder="Tìm theo email..."
                value={searchTerm.email}
                onChange={(e) =>
                  setSearchTerm({ ...searchTerm, email: e.target.value })
                }
                className="border rounded-lg p-2 shadow-md"
              />
            </div>
            <div>
              <label>Số điện thoại:</label>
              <Input
                placeholder="Tìm theo số điện thoại..."
                value={searchTerm.phone}
                onChange={(e) =>
                  setSearchTerm({ ...searchTerm, phone: e.target.value })
                }
                className="border rounded-lg p-2 shadow-md"
              />
            </div>
            <div>
              <label>Quyền:</label>
              <Input
                placeholder="Tìm theo quyền..."
                value={searchTerm.role}
                onChange={(e) =>
                  setSearchTerm({ ...searchTerm, role: e.target.value })
                }
                className="border rounded-lg p-2 shadow-md"
              />
            </div>
            <div>
              <label>Giới tính:</label>
              <Select
                placeholder="Chọn giới tính"
                value={searchTerm.gender}
                onChange={(value) =>
                  setSearchTerm({ ...searchTerm, gender: value })
                }
                className="w-full"
              >
                <Option value="">Tất cả</Option>
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
              </Select>
            </div>
            <div>
              <label>Trạng thái:</label>
              <Select
                placeholder="Chọn trạng thái"
                value={searchTerm.status}
                onChange={(value) =>
                  setSearchTerm({ ...searchTerm, status: value })
                }
                className="w-full"
              >
                <Option value="">Tất cả</Option>
                <Option value="true">Đã xác thực</Option>
                <Option value="false">Chưa xác thực</Option>
              </Select>
            </div>
            <div>
              <label>Ngày tạo:</label>
              <DatePicker
                placeholder="Chọn ngày tạo"
                value={searchTerm.createdAt ? moment(searchTerm.createdAt) : null}
                onChange={(date) =>
                  setSearchTerm({ ...searchTerm, createdAt: date })
                }
                className="w-full"
                format="DD/MM/YYYY"
              />
            </div>
          </div>
        </div>
      )}

      {/* Table with improved styling */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary text-white">
              <tr className="h-10">
                <th className="text-center">STT</th>
                <th className="text-center">ID</th>
                <th className="text-center">Tên</th>
                <th className="text-center">Email</th>
                <th className="text-center">Số điện thoại</th>
                <th className="text-center">Quyền</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Giới tính</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.length > 0 ? (
                filteredAccounts.map((item, index) => (
                  <tr
                    key={item.id}
                    className="h-10 hover:bg-gray-100"
                    onDoubleClick={() => handleDoubleClick(item)}
                  >
                    <td className="text-center">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="text-center">
                      {item.id}
                      {isNewAccount(item.createdAt) && (
                        <span className="ml-2 px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded-full">
                          New
                        </span>
                      )}
                    </td>
                    <td className="text-center">{`${item.firstName} ${item.lastName}`}</td>
                    <td className="text-center lowercase text-wrap">
                      {item.email}
                    </td>
                    <td className="text-center">{item.phoneNumber}</td>
                    <td className="text-center">{item.mainRole}</td>
                    <td className="text-center">
                      {item.isVerified ? (
                        <span className="text-green-600">
                          <CheckCircleOutlined /> Đã xác thực
                        </span>
                      ) : (
                        <span className="text-red-600">
                          <CloseCircleOutlined /> Chưa xác thực
                        </span>
                      )}
                    </td>
                    <td className="text-center">
                      {genderLabels[item.gender] || "Không xác định"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center py-4">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination with improved spacing */}
      <div className="flex justify-center mt-6">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={totalItems * itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
      <GetInformationAccount
        accountId={selectedAccountId}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default ManageUserList;
