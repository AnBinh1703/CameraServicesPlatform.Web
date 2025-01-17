import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Space, Table, Tag } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  createComboOfSupplier,
  getAllCombosOfSupplier,
  getComboById,
  updateComboOfSupplier,
} from "../../../../api/comboApi";
import { getSupplierById } from "../../../../api/supplierApi"; // Add this import

const Combo = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);
  const [comboDetails, setComboDetails] = useState({});
  const [supplierDetails, setSupplierDetails] = useState({});

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Tìm kiếm ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => confirm()}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Tìm
          </Button>
          <Button
            onClick={() => clearFilters()}
            size="small"
            style={{ width: 90 }}
          >
            Đặt lại
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
  });

  const fetchComboDetails = async (comboId) => {
    try {
      const response = await getComboById(comboId);
      if (response.isSuccess) {
        setComboDetails((prev) => ({
          ...prev,
          [comboId]: response.result,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch combo details:", error);
    }
  };

  const fetchSupplierDetails = async (supplierId) => {
    try {
      const response = await getSupplierById(supplierId);
      if (response?.isSuccess) {
        setSupplierDetails((prev) => ({
          ...prev,
          [supplierId]: response.result,
        }));
      }
      console.log(
        "Fetching supplier details",
        response.result.items?.[0].supplierName
      );
    } catch (error) {
      console.error("Failed to fetch supplier details:", error);
    }
  };

  const columns = [
    {
      title: "Mã Combo",
      dataIndex: "comboId",
      key: "comboId",
      ...getColumnSearchProps("comboId"),
      sorter: (a, b) => a.comboId.localeCompare(b.comboId),
    },
    {
      title: "Tên NCC",
      dataIndex: "supplierID",
      key: "supplierName",
      render: (supplierId) =>
        supplierDetails[supplierId]?.supplierName || "Đang tải...",
      ...getColumnSearchProps("supplierID"),
      sorter: (a, b) => {
        const nameA = supplierDetails[a.supplierID]?.supplierName || "";
        const nameB = supplierDetails[b.supplierID]?.supplierName || "";
        return nameA.localeCompare(nameB);
      },
    },
    {
      title: "Tên Combo",
      dataIndex: "comboId",
      key: "comboName",
      render: (comboId) => comboDetails[comboId]?.comboName || "Đang tải...",
      ...getColumnSearchProps("comboName"),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
      sorter: (a, b) => moment(a.startTime).unix() - moment(b.startTime).unix(),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => moment(text).format("DD/MM/YYYY HH:mm:ss"),
      sorter: (a, b) => moment(a.endTime).unix() - moment(b.endTime).unix(),
    },
    {
      title: "Trạng thái",
      dataIndex: "isDisable",
      key: "isDisable",
      render: (isDisable) => (
        <Tag
          color={isDisable ? "success" : "error"}
          icon={isDisable ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
        >
          {isDisable ? "Còn hiệu lực " : "Hết Hạn"}
        </Tag>
      ),
      filters: [
        { text: "Hết Hạn", value: false },
        { text: "Còn hiệu lực", value: true },
      ],
      onFilter: (value, record) => record.isDisable === value,
    },
  ];

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const response = await getAllCombosOfSupplier();
      console.log("Fetched combos:", response.result); // Add this line to log the data
      if (response.isSuccess) {
        setCombos(response.result || []);
        // Fetch supplier details for each combo
        response.result?.forEach((combo) => {
          fetchSupplierDetails(combo.supplierID);
          fetchComboDetails(combo.comboId);
        });
      } else {
        message.error(response.messages[0]);
      }
    } catch (error) {
      message.error("Failed to fetch combos");
    }
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    try {
      let response;
      if (editingId) {
        response = await updateComboOfSupplier({ ...values, id: editingId });
      } else {
        response = await createComboOfSupplier(values);
      }

      if (response.isSuccess) {
        message.success(
          `Combo ${editingId ? "updated" : "created"} successfully`
        );
        setModalVisible(false);
        form.resetFields();
        fetchCombos();
      } else {
        message.error(response.messages[0]);
      }
    } catch (error) {
      message.error("Operation failed");
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={combos}
        loading={loading}
        rowKey="id"
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
        }}
      />
    </div>
  );
};

export default Combo;
