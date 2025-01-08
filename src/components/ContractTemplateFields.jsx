import { Button, Col, Form, Input, Row, message } from "antd"; // Added message
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  createContractTemplate,
  getContractTemplateByAccountId,
} from "../api/contractTemplateApi";

const ContractTemplateFields = ({ onSubmit, products = [], productID: initialProductID }) => { // Added initialProductID prop
  const { user } = useSelector((state) => state.user || {});
  const [form] = Form.useForm();
  const accountID = user.id;
  const [productID, setProductID] = useState(initialProductID); // Initialize with passed productID
  const [contractTemplates, setContractTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  // Use effect to update productID when initialProductID changes
  useEffect(() => {
    if (initialProductID) {
      setProductID(initialProductID);
      form.setFieldsValue({ ProductID: initialProductID });
    }
  }, [initialProductID, form]);

  const handleCreateTemplates = async () => {
    try {
      const values = await form.validateFields(); // Validate all fields first
      
      const templateProductID = initialProductID || productID;
      if (!templateProductID) {
        message.error("Không tìm thấy ID sản phẩm");
        return;
      }

      const newTemplate = {
        templateName: values.templateName, // Fix case to match API
        contractTerms: values.contractTerms,
        templateDetails: values.templateDetails,
        penaltyPolicy: values.penaltyPolicy,
        accountID: user.id,
        productID: templateProductID // Use the determined productID
      };

      const result = await createContractTemplate(newTemplate);
      
      if (result && result.isSuccess) {
        message.success("Mẫu hợp đồng đã được tạo thành công");
        form.resetFields();
        setContractTemplates([]);
        setSelectedTemplateId(null);
        if (onSubmit) {
          onSubmit(result);
        }
      } else {
        message.error(result?.messages?.[0] || "Lỗi khi tạo mẫu hợp đồng");
      }
    } catch (error) {
      console.error("Error creating contract templates:", error);
      if (error.errorFields) {
        message.error("Vui lòng điền đầy đủ thông tin");
      } else {
        message.error("Lỗi khi tạo mẫu hợp đồng");
      }
    }
  };

  const handleItemClick = async (accountID) => {
    try {
      const response = await getContractTemplateByAccountId(accountID);
      
      // Add proper null/undefined checks
      if (!response || !response.result) {
        setContractTemplates([]);
        return;
      }

      const templates = Array.isArray(response.result.items) ? response.result.items : [];
      const fetchedProductID = response.result.productID;
      
      if (fetchedProductID) {
        setProductID(fetchedProductID);
      }
      
      setContractTemplates(templates);
    } catch (error) {
      console.error("Error fetching contract templates:", error);
      message.error("Không thể tải mẫu hợp đồng");
      setContractTemplates([]);
    }
  };

  // **Added Function to Handle Template Selection**
  const handleTemplateSelect = (template) => {
    form.setFieldsValue({
      templateName: template.templateName,
      penaltyPolicy: template.penaltyPolicy,
      contractTerms: template.contractTerms,
      templateDetails: template.templateDetails,
    });
    setSelectedTemplateId(template.contractTemplateID);
    setProductID(template.productID); // **Set ProductID for Selected Template**
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleCreateTemplates}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="templateName"
            label="Tên Điều khoản Hợp Đồng"
            rules={[
              { required: true, message: "Vui lòng nhập tên mẫu hợp đồng!" },
            ]}
          >
            <Input placeholder="Nhập tên mẫu hợp đồng" />
          </Form.Item>
          <Form.Item
            name="penaltyPolicy"
            label="Chính Sách Phạt"
            rules={[
              { required: true, message: "Vui lòng nhập chính sách phạt!" },
            ]}
          >
            <Input.TextArea placeholder="Nhập chính sách phạt" rows={3} />
          </Form.Item>
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
            label="Chi Tiết Điều khoản Hợp Đồng"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập chi tiết mẫu hợp đồng!",
              },
            ]}
          >
            <Input.TextArea placeholder="Nhập chi tiết mẫu hợp đồng" rows={4} />
          </Form.Item>
          {/* **Hidden Field for ProductID (if single product) */}
          {(products?.length === 1) && (
            <Form.Item name="ProductID" hidden>
              <Input />
            </Form.Item>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Tạo Điều khoản Hợp Đồng
            </Button>
          </Form.Item>
          <Button onClick={() => handleItemClick(accountID)}>
          Xem Hàng Loạt Điều khoản Hợp Đồng
          </Button>
          
        </Col>
        <Col span={12}>
          <h3>Tạo Mẫu Hợp Đồng</h3>
          {contractTemplates.length > 0 ? (
            contractTemplates.map((template, index) => (
              <div
                key={template.contractTemplateID}
                onClick={() => handleTemplateSelect(template)} 
                style={{
                  background:
                    selectedTemplateId === template.contractTemplateID
                      ? "#e6f7ff" 
                      : "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                  marginBottom: "10px",
                  cursor: "pointer", // **Change Cursor on Hover**
                }}
              >
                <h4>Mẫu Hợp Đồng #{index + 1}</h4>

                <p>
                  <strong>Tên Mẫu Hợp Đồng:</strong> {template.templateName}
                </p>
                <p>
                  <strong>Điều Khoản Hợp Đồng:</strong> {template.contractTerms}
                </p>
                <p>
                  <strong>Chi Tiết Điều Khoản:</strong>{" "}
                  {template.templateDetails}
                </p>
                <p>
                  <strong>Chính Sách Phạt:</strong> {template.penaltyPolicy}
                </p>
              </div>
            ))
          ) : (
            <p>Không có mẫu hợp đồng nào được tìm thấy.</p>
          )}
        </Col>
      </Row>
    </Form>
  );
};

ContractTemplateFields.defaultProps = {
  products: [],
  onSubmit: () => {},
  productID: null
};

export default ContractTemplateFields;
