import { Button, Input, message, Space, Spin, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  deleteContractTemplateById,
  getContractTemplateByAccountId,
} from "../../../api/contractTemplateApi";
import { getAllProduct } from "../../../api/productApi";
import UpdateContractTemplateForm from "./UpdateContractTemplateForm";

const { Search } = Input;

const ContractTemplateList = ({ refresh }) => {
  const [contractTemplates, setContractTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [products, setProducts] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(20); // Set page size to 10
  const [total, setTotal] = useState(0);
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  useEffect(() => {
    const fetchContractTemplates = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getContractTemplateByAccountId(accountId);
        setContractTemplates(data.result.items || data.result);
        setTotal(data.result.totalCount || data.result.length);
      } catch (error) {
        setError(error);
        message.error("Lỗi khi lấy danh sách mẫu hợp đồng.");
      } finally {
        setLoading(false);
      }
    };

    const fetchProducts = async () => {
      try {
        const data = await getAllProduct(1, 100);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Lỗi khi lấy danh sách sản phẩm.");
      }
    };

    fetchContractTemplates();
    fetchProducts();
  }, [refresh, accountId]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
    setPageIndex(1); // Reset to first page on search
  };

  const handleUpdate = (contractTemplateId) => {
    setSelectedTemplateId(contractTemplateId);
    setUpdateModalVisible(true);
  };

  const handleDelete = async (contractTemplateId) => {
    try {
      await deleteContractTemplateById(contractTemplateId);
      message.success("Xóa mẫu hợp đồng thành công.");
      setContractTemplates((prev) =>
        prev.filter(
          (template) => template.contractTemplateID !== contractTemplateId
        )
      );
    } catch (error) {
      message.error("Lỗi khi xóa mẫu hợp đồng.");
    }
  };

  const handleUpdateSuccess = () => {
    message.success("Cập nhật mẫu hợp đồng thành công.");
    setUpdateModalVisible(false);
    setPageIndex(1); // Optionally reset pagination after update
  };

  const getColumns = () => [
    {
      title: "Tên mẫu hợp đồng",
      dataIndex: "templateName",
      key: "templateName",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Tìm kiếm tên mẫu hợp đồng"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              size="small"
              style={{ width: 90 }}
            >
              Tìm kiếm
            </Button>
            <Button
              onClick={() => clearFilters()}
              size="small"
              style={{ width: 90 }}
            >
              Xóa
            </Button>
          </Space>
        </div>
      ),
      onFilter: (value, record) =>
        record.templateName.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: "Điều khoản hợp đồng",
      dataIndex: "contractTerms",
      key: "contractTerms",
    },
    {
      title: "Chi tiết mẫu hợp đồng",
      dataIndex: "templateDetails",
      key: "templateDetails",
    },
    {
      title: "Chính sách phạt",
      dataIndex: "penaltyPolicy",
      key: "penaltyPolicy",
    },
    {
      title: "Tên tài khoản",
      dataIndex: "accountID",
      key: "accountID",
      render: () => `${user.firstName} ${user.lastName}`,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "productID",
      key: "productID",
      render: (productID) => {
        const product = products.find(
          (product) => product.productID === productID
        );
        return product ? product.productName : "N/A";
      },
    },
    {
      title: "Hành động",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleUpdate(record.contractTemplateID)}
          >
            Cập nhật
          </Button>
          <Button
            type="danger"
            onClick={() => handleDelete(record.contractTemplateID)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách mẫu hợp đồng</h2>
      <Search
        placeholder="Tìm kiếm theo tên mẫu hợp đồng"
        onChange={handleSearch}
        enterButton
        style={{ marginBottom: 20 }}
      />
      {loading ? (
        <Spin tip="Đang tải..." />
      ) : error ? (
        <div>Lỗi: {error.message}</div>
      ) : (
        <Table
          dataSource={contractTemplates}
          columns={getColumns()}
          rowKey="contractTemplateID"
          pagination={{
            current: pageIndex,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setPageIndex(page);
              setPageSize(size);
            },
          }}
        />
      )}
      <UpdateContractTemplateForm
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        contractTemplateId={selectedTemplateId}
        onUpdateSuccess={handleUpdateSuccess}
      />
    </div>
  );
};

export default ContractTemplateList;
