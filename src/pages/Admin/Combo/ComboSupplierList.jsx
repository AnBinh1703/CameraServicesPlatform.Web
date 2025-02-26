import {
  CheckOutlined,
  CloseOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { ConfigProvider, Input } from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  getAllCombosOfSupplier,
  getComboById,
  getComboOfSupplierById,
  updateComboOfSupplier,
} from "../../../api/comboApi";
import { getAllSuppliers, getSupplierById } from "../../../api/supplierApi";

const ComboSupplierList = ({ refresh }) => {
  const [combos, setCombos] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCombo, setSelectedCombo] = useState(null);
  const [newCombo, setNewCombo] = useState({
    comboId: "",
    supplierID: "",
    startTime: "",
    endTime: "",
    isDisable: false,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showViewForm, setShowViewForm] = useState(false);
  const [viewCombo, setViewCombo] = useState(null);

  useEffect(() => {
    const fetchCombosAndSuppliers = async () => {
      setLoading(true);
      try {
        const [comboResponse, supplierResponse] = await Promise.all([
          getAllCombosOfSupplier(),
          getAllSuppliers(1, 100), // Ensure pageIndex and pageSize are provided
        ]);

        if (
          comboResponse &&
          comboResponse.isSuccess &&
          supplierResponse &&
          supplierResponse.isSuccess
        ) {
          const combosWithNames = await Promise.all(
            comboResponse.result.map(async (combo) => {
              const supplierResponse = await getSupplierById(combo.supplierID);
              const comboResponse = await getComboById(combo.comboId);
              if (supplierResponse && comboResponse) {
                return {
                  ...combo,
                  supplierName: supplierResponse.result.items[0].supplierName,
                  comboName: comboResponse.result.comboName,
                };
              }
              return combo;
            })
          );
          setCombos(combosWithNames);
          setSuppliers(supplierResponse.result.items);
        } else {
          console.error(
            comboResponse ? comboResponse.messages : "Failed to fetch combos"
          );
          console.error(
            supplierResponse
              ? supplierResponse.messages
              : "Failed to fetch suppliers"
          );
        }
      } catch (error) {
        console.error("Error fetching combos and suppliers:", error);
      }
      setLoading(false);
    };

    fetchCombosAndSuppliers();
  }, [refresh]);

  const handleViewDetails = async (comboSupplierId, isView = false) => {
    try {
      setLoading(true); // Add loading state while fetching
      const response = await getComboOfSupplierById(comboSupplierId);
      if (response.isSuccess) {
        const [supplierResponse, comboResponse] = await Promise.all([
          getSupplierById(response.result.supplierID),
          getComboById(response.result.comboId),
        ]);

        if (supplierResponse && comboResponse) {
          const comboDetail = {
            ...response.result,
            supplierName: supplierResponse.result.items[0].supplierName,
            comboName: comboResponse.result.comboName,
            startTime: dayjs(response.result.startTime),
            endTime: dayjs(response.result.endTime),
          };

          if (isView) {
            setViewCombo(comboDetail);
            setShowViewForm(true); // This opens the view modal
            setShowUpdateForm(false); // Make sure update modal is closed
          } else {
            setSelectedCombo(comboDetail);
            setShowUpdateForm(true); // This opens the update modal
            setShowViewForm(false); // Make sure view modal is closed
          }
        }
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCombo = async () => {
    const response = await updateComboOfSupplier(selectedCombo);
    if (response.isSuccess) {
      const supplierResponse = await getSupplierById(
        response.result.supplierID
      );
      const comboResponse = await getComboById(response.result.comboId);
      if (supplierResponse && comboResponse) {
        setCombos(
          combos.map((combo) =>
            combo.comboOfSupplierId === selectedCombo.comboOfSupplierId
              ? {
                  ...response.result,
                  supplierName: supplierResponse.result.items[0].supplierName,
                  comboName: comboResponse.result.comboName,
                }
              : combo
          )
        );
      } else {
        setCombos(
          combos.map((combo) =>
            combo.comboOfSupplierId === selectedCombo.comboOfSupplierId
              ? response.result
              : combo
          )
        );
      }
      setSelectedCombo(null);
      setShowUpdateForm(false);
    } else {
      console.error(response.messages);
    }
  };

  const filteredCombos = combos.filter(
    (combo) =>
      combo.comboName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      combo.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <ConfigProvider>
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Danh sách gói của nhà cung cấp
        </h2>
        <Input
          placeholder="Tìm kiếm gói hoặc nhà cung cấp"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />

        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Gói ID</th>
              <th className="py-2">Tên Gói</th>
              <th className="py-2">Tên Nhà Cung Cấp</th>
              <th className="py-2">Thời Gian Bắt Đầu</th>
              <th className="py-2">Thời Gian Kết Thúc</th>
              <th className="py-2">Hiệu lực</th>
            </tr>
          </thead>
          <tbody>
            {filteredCombos.map((combo) => (
              <tr key={combo.comboOfSupplierId}>
                <td className="border px-4 py-2">{combo.comboId}</td>
                <td className="border px-4 py-2">{combo.comboName}</td>
                <td className="border px-4 py-2">{combo.supplierName}</td>
                <td className="border px-4 py-2">
                  {dayjs(combo.startTime).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="border px-4 py-2">
                  {dayjs(combo.endTime).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="border px-4 py-2">
                  {combo.isDisable ? (
                    <span className="text-green-500">
                      <CheckOutlined />
                    </span>
                  ) : (
                    <span className="text-red-500">
                      <CloseOutlined />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ConfigProvider>
  );
};

export default ComboSupplierList;
