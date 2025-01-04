import { Button, Card, Form, Spin, Steps, message } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import "../../../../styles/custom-antd.css"; // Add this import

import { getContractTemplateByProductId } from "../../../../api/contractTemplateApi";
import { createOrderRentWithPayment } from "../../../../api/orderApi";
import { getProductById } from "../../../../api/productApi";
import { getSupplierById } from "../../../../api/supplierApi";
import {
  getProductVouchersByProductId,
  getVoucherById,
} from "../../../../api/voucherApi";
import { getNewReservationMoney } from "../../../../api/systemAdminApi"; // Add this import

import DeliveryMethod from "./DeliveryMethod";
import OrderConfirmation from "./OrderConfirmation";
import OrderReview from "./OrderReview";
import ProductDetailsInfoRent from "./ProductDetailsInfoRent";
import VoucherSelection from "./VoucherSelection";

const { Step } = Steps;

const CreateOrderRent = () => {
  const [form] = Form.useForm();
  const [product, setProduct] = useState(null);

  const [totalAmount, setTotalAmount] = useState(0);
  const [durationUnit, setDurationUnit] = useState(null);
  const [durationValue, setDurationValue] = useState(null);
  const [productPriceRent, setProductPriceRent] = useState(0);
  const [rentalStartDate, setRentalStartDate] = useState(null);
  const [rentalEndDate, setRentalEndDate] = useState(null);
  const [shippingAddress, setShippingAddress] = useState("");
  const [returnDate, setReturnDate] = useState(null);
  const [reservationMoney, setReservationMoney] = useState();  
  const location = useLocation();
  const { productID, supplierID } = location.state || {};
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState();
  const [supplierInfo, setSupplierInfo] = useState(null);
  const [contractTemplate, setContractTemplate] = useState([]);
  const [showContractTerms, setShowContractTerms] = useState(false);
  //vouchers
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [loadingVouchers, setLoadingVouchers] = useState(true);
  const [selectedVoucherDetails, setSelectedVoucherDetails] = useState(null);

  const user = useSelector((state) => state.user.user || {});
  const accountId = user.id;

  // Fetch product details and contract template
  useEffect(() => {
    const fetchProductAndContractTemplate = async () => {
      try {
        if (productID) {
          const productData = await getProductById(productID);
          if (productData) {
            setProduct(productData);
            form.setFieldsValue({ supplierID });

            // Fetch contract template
            const contractTemplateData = await getContractTemplateByProductId(
              productID
            );
            setContractTemplate(contractTemplateData);
          } else {
            message.error("Product not found or could not be retrieved.");
          }
        }
      } catch (error) {
        message.error("Failed to fetch product details or contract template.");
      }
      setLoadingProduct(false);
    };

    fetchProductAndContractTemplate();
  }, [productID]);

  useEffect(() => {
    const fetchSupplierInfo = async () => {
      if (supplierID) {
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
          console.error("Error fetching supplier:", error);
          message.error("Không thể lấy thông tin nhà cung cấp.");
        }
      }
    };

    fetchSupplierInfo();
  }, [supplierID]);

  // Fetch vouchers by product ID

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

  // Add new useEffect for reservation money
  useEffect(() => {
    const fetchReservationMoney = async () => {
      try {
        const response = await getNewReservationMoney();
        if (response.isSuccess && response.result) {
          setReservationMoney(response.result.reservationMoney);
        } else {
          message.error("Failed to fetch reservation money.");
        }
      } catch (error) {
        console.error("Error fetching reservation money:", error);
        message.error("Failed to fetch reservation money.");
      }
    };

    fetchReservationMoney();
  }, []);

  // Handle voucher selection
  const handleVoucherSelect = async (e) => {
    const voucherID = e.target.value;
    setSelectedVoucher(voucherID);
    try {
      const voucherDetails = await getVoucherById(voucherID);
      setSelectedVoucherDetails(voucherDetails);
      calculateTotalAmount(voucherDetails);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết voucher:", error);
    }
  };

  // Calculate total amount
  const calculateTotalAmount = (voucherDetails) => {
    if (!product) return;

    let discountAmount = 0;
    if (voucherDetails) {
      discountAmount = voucherDetails.discountAmount;
    }

    const total =
      productPriceRent - discountAmount + (product?.depositProduct || 0);
    setTotalAmount(total);
  };

  const toggleContractTerms = () => {
    setShowContractTerms(!showContractTerms);
  };

  const onFinish = async (values) => {
    console.log("Success:", values);
    console.log("Delivery Method:", deliveryMethod);
    console.log("Product Price Rent:", productPriceRent);
    console.log("Duration Unit:", durationUnit);
    console.log("Duration Value:", durationValue);
    console.log("Rental Start Date:", rentalStartDate);
    console.log("Rental End Date:", rentalEndDate);
    console.log("Return Date:", returnDate);
    if (!product) {
      message.error("Product information is incomplete.");
      return;
    }

    const orderData = {
      supplierID: supplierID || "",
      accountID: accountId || "",
      productID: product?.productID || "",
      productPriceRent: productPriceRent,
      voucherID: selectedVoucher,
      orderDate: new Date().toISOString(),
      orderStatus: 0,
      totalAmount: totalAmount,
      orderType: 0,
      shippingAddress: shippingAddress,
      deposit: product?.depositProduct || 0,
      rentalStartDate: rentalStartDate.toISOString(),
      rentalEndDate: rentalEndDate.toISOString(),
      durationUnit: durationUnit,
      durationValue: durationValue,
      returnDate: returnDate.toISOString(),
      deliveryMethod: deliveryMethod,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isExtend: false,
      isPayment: true,
      reservationMoney: reservationMoney,
    };

    try {
      const response = await createOrderRentWithPayment(orderData);
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
        <ProductDetailsInfoRent
          product={product}
          contractTemplate={contractTemplate}
          durationUnit={durationUnit}
          setDurationUnit={setDurationUnit}
          durationValue={durationValue}
          setDurationValue={setDurationValue}
          productPriceRent={productPriceRent}
          setProductPriceRent={setProductPriceRent}
          loading={loadingProduct}
          showContractTerms={showContractTerms}
          toggleContractTerms={toggleContractTerms}
          rentalStartDate={rentalStartDate}
          setRentalStartDate={setRentalStartDate}
          rentalEndDate={rentalEndDate}
          setRentalEndDate={setRentalEndDate}
          returnDate={returnDate}
          setReturnDate={setReturnDate}
          form={form} // Add form prop
        />
      ),
    },
    {
      title: "Phương thức giao hàng",
      content: (
        <DeliveryMethod
          shippingAddress={shippingAddress}
          setShippingAddress={setShippingAddress}
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
        <VoucherSelection
          vouchers={vouchers}
          selectedVoucher={selectedVoucher}
          setSelectedVoucher={setSelectedVoucher}
          handleVoucherSelect={handleVoucherSelect}
          selectedVoucherDetails={selectedVoucherDetails}
          form={form} // Add form prop
        />
      ),
    },
    {
      title: "Xem lại đơn hàng",
      content: (
        <OrderReview
          product={product}
          form={form}
          deliveryMethod={deliveryMethod}
          supplierInfo={supplierInfo}
          selectedVoucherDetails={selectedVoucherDetails}
          totalAmount={totalAmount}
          contractTemplate={contractTemplate}
          depositProduct={product?.depositProduct}
          productPriceRent={productPriceRent}
          reservationMoney={reservationMoney}
        />
      ),
    },
    {
      title: "Xác nhận",
      content: (
        <OrderConfirmation
          totalAmount={totalAmount}
          depositProduct={product?.depositProduct}
          selectedVoucherDetails={selectedVoucherDetails}
          productPriceRent={productPriceRent}
          reservationMoney={reservationMoney}
          form={form} // Add form prop
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
    <Card title="Tạo đơn hàng thuê">
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

export default CreateOrderRent;
