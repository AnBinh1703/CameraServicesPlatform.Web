import { Button, Card, Form, message, Select, Spin, Steps } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import "../../../../styles/custom-antd.css"; // Add this import
import { createOrderWithPayment } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";
import { getSupplierById } from "../../../../api/supplierApi";
import {
  getProductVouchersByProductId,
  getVoucherById,
} from "../../../../api/voucherApi";

import DeliveryMethodBuy from "./DeliveryMethodBuy";
import OrderConfirmationBuy from "./OrderConfirmationBuy";
import OrderReviewBuy from "./OrderReviewBuy";
import ProductDetailsInfoBuy from "./ProductDetailsInfoBuy";
import VoucherSelectionBuy from "./VoucherSelectionBuy";

const { Option } = Select;
const { Step } = Steps;

const CreateOrderBuy = () => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [product, setProduct] = useState(null);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState(0);
  const [supplierInfo, setSupplierInfo] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { productID, supplierID } = location.state || {};
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);
  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        const productData = await getProductById(productID);
        if (productData) {
          setProduct(productData);
        } else {
          message.error("Không tìm thấy sản phẩm.");
        }
      } catch (error) {
        message.error("Không thể lấy thông tin sản phẩm.");
      }
      setLoadingProduct(false);
    };

    fetchProduct();
  }, [productID]);

  useEffect(() => {
    const fetchVouchers = async () => {
      setLoadingVouchers(true);
      try {
        const voucherData = await getProductVouchersByProductId(
          productID,
          1,
          10
        );
        if (voucherData) {
          setVouchers(voucherData);
          console.log("voucherData", voucherData);
        } else {
          message.error("Không có voucher khả dụng.");
        }
      } catch (error) {
        message.error("Không thể lấy voucher.");
      }
      setLoadingVouchers(false);
    };

    fetchVouchers();
  }, [productID]);

  useEffect(() => {
    const fetchSupplierInfo = async () => {
      if (deliveryMethod === 1 && supplierID) {
        try {
          const supplierData = await getSupplierById(supplierID);
          if (
            supplierData &&
            supplierData.result &&
            supplierData.result.items.length > 0
          ) {
            setSupplierInfo(supplierData.result.items[0]);
          } else {
            message.error("Không thể lấy thông tin nhà cung cấp.");
          }
        } catch (error) {
          message.error("Không thể lấy thông tin nhà cung cấp.");
        }
      }
    };

    fetchSupplierInfo();
  }, [deliveryMethod, supplierID]);

  const handleVoucherSelect = async (e) => {
    const vourcherID = e.target.value;
    setSelectedVoucher(vourcherID);
    if (vourcherID) {
      try {
        const voucherDetails = await getVoucherById(vourcherID);
        setSelectedVoucherDetails(voucherDetails);
        console.log("voucherDetails", voucherDetails);
        console.log(
          "voucherDetails.discountAmount",
          voucherDetails.discountAmount
        );
        calculateTotalAmount(vourcherID);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết voucher:", error);
      }
    } else {
      setSelectedVoucherDetails(null);
      calculateTotalAmount(null);
    }
  };

  const calculateTotalAmount = async (vourcherID) => {
    if (!product) {
      console.error("Sản phẩm không được xác định");
      return;
    }

    let discount = 0;
    if (vourcherID) {
      try {
        const voucherDetails = await getVoucherById(vourcherID);

        if (voucherDetails) {
          discount = Number(voucherDetails.discountAmount) || 0;
        } else {
          console.error("Không tìm thấy chi tiết voucher");
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết voucher:", error);
      }
    }

    const productPrice = Number(product.priceBuy);
    const total = productPrice - discount;

    setTotalAmount(total);
    console.log("discount", discount);
    console.log("productPrice", productPrice);
    console.log("total", total);
  };
  const onFinish = async (values) => {
    const orderData = {
      supplierID: supplierID || "",
      accountID: accountId || "",
      productID: product?.productID || "",
      vourcherID: selectedVoucher,
      productPrice: product.priceBuy || 0,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      totalAmount: totalAmount || 0,
      products: [
        {
          productID: product?.productID || "",
          productName: product?.productName || "",
          productDescription: product?.productDescription || "",
          price: product.priceBuy || 0,
          quality: product?.quality,
        },
      ],
      orderDetailRequests: [
        {
          productID: product?.productID || "",
          productPrice: product?.priceBuy || 0,
          productQuality: product?.quality,
          discount: selectedVoucher
            ? vouchers.find((voucher) => voucher.vourcherID === selectedVoucher)
                ?.discountAmount || 0
            : 0,
          productPriceTotal: totalAmount || 0,
        },
      ],
      orderType: 0,
      shippingAddress: values.shippingAddress || "",
      deliveryMethod: deliveryMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await createOrderWithPayment(orderData);
      if (response.isSuccess && response.result) {
        message.success(
          "Tạo đơn hàng thành công. Đang chuyển hướng đến thanh toán..."
        );
        window.location.href = response.result;
      } else {
        message.error("Không thể khởi tạo thanh toán.");
      }
    } catch (error) {
      message.error(
        "Không thể tạo đơn hàng. " + (error.response?.data?.title || "")
      );
      console.error(error);
    }
  };

  const steps = [
    {
      title: "Chi tiết sản phẩm",
      content: (
        <ProductDetailsInfoBuy 
          product={product} 
          loading={loadingProduct}
          form={form} // Add form prop
        />
      ),
    },
    {
      title: "Phương thức giao hàng",
      content: (
        <DeliveryMethodBuy
          deliveryMethod={deliveryMethod}
          setDeliveryMethod={setDeliveryMethod}
          supplierInfo={supplierInfo}
          form={form} // Add form prop
        />
      ),
    },
    {
      title: "Chọn Voucher",
      content: (
        <VoucherSelectionBuy
          vouchers={vouchers}
          selectedVoucher={selectedVoucher}
          setSelectedVoucher={setSelectedVoucher}
          handleVoucherSelect={handleVoucherSelect}
          selectedVoucherDetails={selectedVoucherDetails}
        />
      ),
    },
    {
      title: "Xem lại đơn hàng",
      content: (
        <OrderReviewBuy
          product={product}
          form={form}
          deliveryMethod={deliveryMethod}
          supplierInfo={supplierInfo}
          selectedVoucherDetails={selectedVoucherDetails}
          totalAmount={totalAmount}
        />
      ),
    },
    {
      title: "Xác nhận",
      content: (
        <OrderConfirmationBuy
          selectedVoucherDetails={selectedVoucherDetails}
          totalAmount={totalAmount}
        />
      ),
    },
  ];

  const next = () => {
    setCurrentStep(currentStep + 1);
  };

  const prev = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <Card title="Tạo đơn hàng mua">
      {loadingProduct || loadingVouchers ? (
        <Spin />
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Steps current={currentStep}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content" style={{ marginTop: "16px" }}>
            {steps[currentStep].content}
          </div>
          <div className="steps-action" style={{ marginTop: "16px" }}>
            {currentStep > 0 && (
              <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
                Quay lại
              </Button>
            )}
            {currentStep < steps.length - 1 && (
              <Button type="primary" onClick={() => next()}>
                Tiếp theo
              </Button>
            )}
            {currentStep === steps.length - 1 && (
              <Button type="primary" htmlType="submit">
                Tạo đơn hàng
              </Button>
            )}
          </div>
        </Form>
      )}
    </Card>
  );
};

export default CreateOrderBuy;
