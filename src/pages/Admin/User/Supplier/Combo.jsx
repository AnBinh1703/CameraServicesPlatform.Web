import { Button, Form, Input, Modal, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import moment from 'moment';
import {
  createComboOfSupplier,
  getAllCombosOfSupplier,
  updateComboOfSupplier,
} from "../../../../api/comboApi";

const Combo = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState(null);

  const columns = [
    {
      title: "Combo ID",
      dataIndex: "comboId",
      key: "comboId",
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
      render: (text) => moment(text).format('DD/MM/YYYY HH:mm:ss'),
    },
    {
      title: "Status",
      dataIndex: "isDisable",
      key: "isDisable",
      render: (isDisable) => (
        <span className={isDisable ? "text-red-500" : "text-green-500"}>
          {isDisable ? "Disabled" : "Active"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="space-x-2">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button 
            type={record.isDisable ? "primary" : "default"}
            danger={!record.isDisable}
            onClick={() => handleToggleStatus(record)}
          >
            {record.isDisable ? "Enable" : "Disable"}
          </Button>
        </div>
      ),
    },
  ];

  const fetchCombos = async () => {
    setLoading(true);
    try {
      const response = await getAllCombosOfSupplier();
      if (response.isSuccess) {
        setCombos(response.data || []);
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

  const handleToggleStatus = async (record) => {
    try {
      const response = await updateComboOfSupplier({
        ...record,
        isDisable: !record.isDisable
      });
      
      if (response.isSuccess) {
        message.success(`Combo ${record.isDisable ? 'enabled' : 'disabled'} successfully`);
        fetchCombos();
      } else {
        message.error(response.messages[0]);
      }
    } catch (error) {
      message.error("Failed to update combo status");
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setEditingId(null);
          form.resetFields();
          setModalVisible(true);
        }}
        style={{ marginBottom: 16 }}
      >
        Create New Combo
      </Button>

      <Table
        columns={columns}
        dataSource={combos}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title={editingId ? "Edit Combo" : "Create Combo"}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input combo name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input price!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingId ? "Update" : "Create"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Combo;
