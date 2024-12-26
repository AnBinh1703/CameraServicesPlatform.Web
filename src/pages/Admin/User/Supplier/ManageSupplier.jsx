import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { deleteSupplier, getAllSuppliers } from "../../../../api/supplierApi";
import LoadingComponent from "../../../../components/LoadingComponent/LoadingComponent";

const ManageSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  // Function to fetch suppliers based on pageIndex, pageSize, and search term
  const fetchSuppliers = async (pageIndex, pageSize, searchTerm = "") => {
    setLoading(true);
    try {
      const response = await getAllSuppliers(pageIndex, pageSize, searchTerm);
      if (response && response.result) {
        setSuppliers(response.result.items);
        setTotalPages(response.result.totalPages);
      } else {
        message.error("Failed to fetch suppliers");
      }
    } catch (error) {
      console.error("Error fetching suppliers:", error);
      message.error("Error fetching suppliers");
    } finally {
      setLoading(false);
    }
  };

  // Fetch suppliers when the component loads or pageIndex/pageSize changes
  useEffect(() => {
    fetchSuppliers(pageIndex, pageSize, searchTerm);
  }, [pageIndex, pageSize, searchTerm]);

  // Handle search functionality
  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageIndex(1); // Reset pageIndex when searching
  };

  // Handle delete supplier
  const handleDeleteSupplier = async (supplierId) => {
    setLoading(true);
    try {
      const response = await deleteSupplier(supplierId);
      if (response) {
        message.success("Supplier deleted successfully");
        fetchSuppliers(pageIndex, pageSize, searchTerm); // Reload suppliers after deletion
      } else {
        message.error("Failed to delete supplier");
      }
    } catch (error) {
      message.error("Error deleting supplier");
    } finally {
      setLoading(false);
    }
  };

  // Columns for the supplier table
  const columns = [
    {
      title: "Supplier ID",
      dataIndex: "supplierID",
      key: "supplierID",
    },
    {
      title: "Account ID",
      dataIndex: "accountID",
      key: "accountID",
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
    },
    {
      title: "Supplier Description",
      dataIndex: "supplierDescription",
      key: "supplierDescription",
    },
    {
      title: "Supplier Address",
      dataIndex: "supplierAddress",
      key: "supplierAddress",
    },
    {
      title: "Contact Number",
      dataIndex: "contactNumber",
      key: "contactNumber",
    },
    {
      title: "Supplier Logo",
      dataIndex: "supplierLogo",
      key: "supplierLogo",
    },
    {
      title: "Account Balance",
      dataIndex: "accountBalance",
      key: "accountBalance",
    },
    {
      title: "Block Reason",
      dataIndex: "blockReason",
      key: "blockReason",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditSupplier(record)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            onClick={() => handleDeleteSupplier(record.supplierID)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  // Pagination handler
  const handleTableChange = (pagination) => {
    setPageIndex(pagination.current);
    setPageSize(pagination.pageSize);
  };

  // Render supplier table with search bar
  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Search suppliers"
          enterButton={<SearchOutlined />}
          onSearch={handleSearch}
        />
      </Space>

      {loading ? (
        <LoadingComponent />
      ) : (
        <Table
          columns={columns}
          dataSource={suppliers}
          rowKey="supplierID"
          pagination={{
            current: pageIndex,
            pageSize,
            total: totalPages * pageSize,
          }}
          onChange={handleTableChange}
        />
      )}
    </div>
  );
};

export default ManageSupplier;
