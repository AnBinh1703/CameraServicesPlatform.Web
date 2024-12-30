import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  getComboById,
  getExpiredCombosOfSupplier,
} from "../../../api/comboApi";
import { getSupplierById } from "../../../api/supplierApi";
const ExpiredCombosOfSupplier = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Tên gói dịch vụ",
      dataIndex: "comboName",
      key: "comboName",
      width: 200,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      width: 200,
    },

    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      width: 200,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      width: 200,
      render: (text) => new Date(text).toLocaleString(),
    },
    {
      title: "Mail sắp hết hạn",
      dataIndex: "isMailNearExpired",
      key: "isMailNearExpired",
      width: 150,
      render: (value) => (
        <span className={value ? "text-green-500" : "text-red-500"}>
          {value ? (
            <>
              <CheckCircleOutlined /> Đã gửi
            </>
          ) : (
            <>
              <CloseCircleOutlined /> Chưa gửi
            </>
          )}
        </span>
      ),
    },
    {
      title: "Mail hết hạn",
      dataIndex: "isSendMailExpired",
      key: "isSendMailExpired",
      width: 150,
      render: (value) => (
        <span className={value ? "text-green-500" : "text-red-500"}>
          {value ? (
            <>
              <CheckCircleOutlined /> Đã gửi
            </>
          ) : (
            <>
              <CloseCircleOutlined /> Chưa gửi
            </>
          )}
        </span>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isDisable",
      key: "isDisable",
      width: 120,
      render: (value) => (
        <span className={value ? "text-red-500" : "text-green-500"}>
          {value ? (
            <>
              <CloseCircleOutlined /> Vô hiệu
            </>
          ) : (
            <>
              <CheckCircleOutlined /> Hoạt động
            </>
          )}
        </span>
      ),
    },
  ];

  const fetchAdditionalData = async (items) => {
    const enrichedData = await Promise.all(
      items.map(async (item) => {
        const comboResponse = await getComboById(item.comboId);
        const supplierResponse = await getSupplierById(item.supplierID);

        return {
          ...item,
          comboName: comboResponse.isSuccess
            ? comboResponse.result.comboName
            : "N/A",
          supplierName:
            (supplierResponse?.isSuccess &&
              supplierResponse?.result?.items?.[0]?.supplierName) ||
            "N/A",
        };
      })
    );
    return enrichedData;
  };

  const fetchData = async () => {
    setLoading(true);
    const response = await getExpiredCombosOfSupplier();
    if (response.isSuccess) {
      const enrichedData = await fetchAdditionalData(response.result);
      setData(enrichedData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-50 text-medium text-gray-500 rounded-lg w-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Gói đã hết hạn</h3>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={false}
        rowKey="comboOfSupplierId"
      />
    </div>
  );
};

export default ExpiredCombosOfSupplier;
