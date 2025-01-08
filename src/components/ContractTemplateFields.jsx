import { Button, Col, Form, Input, Row } from "antd";
import React, { useState } from "react"; // Added useState import
import { useSelector } from "react-redux";
import {
  createContractTemplate,
  getContractTemplateByAccountId,
} from "../api/contractTemplateApi";

const ContractTemplateFields = ({ onSubmit }) => {
  const { user } = useSelector((state) => state.user || {});
  const [form] = Form.useForm();
  const accountID = user.id; // Added declaration
  console.log(accountID);
  const [productID, setProductID] = useState(null); // Added state for productID

  const handleFinish = (values) => {
    onSubmit(values);
  };

  const handleOpenModal = (id, prodID) => { // Added function to open modal and set productID
    setProductID(prodID);
    setIsContractModalVisible(true); // Assuming setIsContractModalVisible is defined
  };

  const handleItemClick = async (accountID) => {
    try {
      const result = await getContractTemplateByAccountId(accountID);
      const templates = result.result?.items;
      const fetchedProductID = result.result?.productID; // Extract productID
      setProductID(fetchedProductID); // Save productID

      templates.forEach(async (template) => {
        const newTemplate = {
          contractTerms: template.contractTerms,
          templateDetails: template.templateDetails,
          penaltyPolicy: template.penaltyPolicy,
          accountID: user.id,
          productID: fetchedProductID, // Use saved productID
        };
        await createContractTemplate(newTemplate);
      });
    } catch (error) {
      console.error("Error creating contract templates:", error);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="templateName"
            label="Tên Mẫu Hợp Đồng"
            rules={[
              { required: true, message: "Vui lòng nhập tên mẫu hợp đồng!" },
            ]}
          >
            <Input placeholder="Nhập tên mẫu hợp đồng" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="penaltyPolicy"
            label="Chính Sách Phạt"
            rules={[
              { required: true, message: "Vui lòng nhập chính sách phạt!" },
            ]}
          >
            <Input.TextArea placeholder="Nhập chính sách phạt" rows={3} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="contractTerms"
        label="Điều Khoản Hợp Đồng"
        rules={[
          { required: true, message: "Vui lòng nhập điều khoản hợp đồng!" },
        ]}
      >
        <Input.TextArea placeholder="Nhập điều khoản hợp đồng" rows={4} />
      </Form.Item>
      <Form.Item
        name="templateDetails"
        label="Chi Tiết Mẫu Hợp Đồng"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập chi tiết mẫu hợp đồng!",
          },
        ]}
      >
        <Input.TextArea placeholder="Nhập chi tiết mẫu hợp đồng" rows={4} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Tạo Mẫu Hợp Đồng
        </Button>
      </Form.Item>
      <Button onClick={() => handleItemClick(accountID)}>
        Tạo Hàng Loạt Mẫu Hợp Đồng
      </Button>
      <Button onClick={() => handleOpenModal(accountID, user.productID)}>
        Mở Modal Hợp Đồng
      </Button>
    </Form>
  );
};

export default ContractTemplateFields;
