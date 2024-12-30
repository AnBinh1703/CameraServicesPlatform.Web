import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  ConfigProvider,
  DatePicker,
  Input,
  Modal,
  Select,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  createComboOfSupplier,
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
    startTime: null,  // Changed from "" to null
    endTime: null,    // Changed from "" to null
    isDisable: false,
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableCombos, setAvailableCombos] = useState([]); // Add this state

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

  useEffect(() => {
    const fetchAvailableCombos = async () => {
      try {
        const response = await getAllCombosOfSupplier();
        if (response && response.isSuccess) {
          const combosData = await Promise.all(
            response.result.map(async (combo) => {
              const comboDetails = await getComboById(combo.comboId);
              return {
                id: combo.comboId,
                name: comboDetails.result.comboName
              };
            })
          );
          setAvailableCombos(combosData);
        }
      } catch (error) {
        console.error("Error fetching available combos:", error);
      }
    };
    fetchAvailableCombos();
  }, []);

  const handleViewDetails = async (comboSupplierId) => {
    const response = await getComboOfSupplierById(comboSupplierId);
    if (response.isSuccess) {
      const supplierResponse = await getSupplierById(
        response.result.supplierID
      );
      const comboResponse = await getComboById(response.result.comboId);
      if (supplierResponse && comboResponse) {
        setSelectedCombo({
          ...response.result,
          supplierName: supplierResponse.result.items[0].supplierName,
          comboName: comboResponse.result.comboName,
          startTime: dayjs(response.result.startTime),
          endTime: dayjs(response.result.endTime),
        });
        setShowUpdateForm(true);
      } else {
        console.error("Failed to fetch supplier or combo details");
      }
    } else {
      console.error(response.messages);
    }
  };

  const handleCreateCombo = async () => {
    // Format dates properly before sending to API
    const formattedCombo = {
      ...newCombo,
      startTime: newCombo.startTime ? newCombo.startTime.format() : null,
      endTime: newCombo.endTime ? newCombo.endTime.format() : null,
    };
    
    const response = await createComboOfSupplier(formattedCombo);
    if (response.isSuccess) {
      const supplierResponse = await getSupplierById(
        response.result.supplierID
      );
      const comboResponse = await getComboById(response.result.comboId);
      if (supplierResponse && comboResponse) {
        setCombos([
          ...combos,
          {
            ...response.result,
            supplierName: supplierResponse.result.items[0].supplierName,
            comboName: comboResponse.result.comboName,
          },
        ]);
      } else {
        setCombos([...combos, response.result]);
      }
      setNewCombo({
        comboId: "",
        supplierID: "",
        startTime: null,  // Changed from "" to null
        endTime: null,    // Changed from "" to null
        isDisable: false,
      });
      setShowCreateForm(false);
    } else {
      console.error(response.messages);
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
          Danh sách combo của nhà cung cấp
        </h2>
        <Input
          placeholder="Tìm kiếm combo hoặc nhà cung cấp"
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setShowCreateForm(true)}
          className="mb-4"
        >
          Tạo Combo Mới
        </Button>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">Combo ID</th>
              <th className="py-2">Tên Combo</th>
              <th className="py-2">Tên Nhà Cung Cấp</th>
              <th className="py-2">Thời Gian Bắt Đầu</th>
              <th className="py-2">Thời Gian Kết Thúc</th>
              <th className="py-2">Hiệu lực</th>
              {/* <th className="py-2">Hành Động</th> */}
            </tr>
          </thead>
          <tbody>
            {filteredCombos.map((combo) => (
              <tr key={combo.comboOfSupplierId}>
                <td className="border px-4 py-2">{combo.comboId}</td>
                <td className="border px-4 py-2">{combo.comboName}</td>
                <td className="border px-4 py-2">{combo.supplierName}</td>
                <td className="border px-4 py-2">
                  {dayjs(combo.startTime).format("DD-MM-YYYY HH:mm:ss")}
                </td>
                <td className="border px-4 py-2">
                  {dayjs(combo.endTime).format("DD-MM-YYYY HH:mm:ss")}
                </td>
                <td className="border px-4 py-2">
                  {combo.isDisable ? (
                    <span className="text-red-500">
                      <CloseOutlined />
                    </span>
                  ) : (
                    <span className="text-green-500">
                      <CheckOutlined />
                    </span>
                  )}
                </td>
                {/* <td className="border px-4 py-2">
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleViewDetails(combo.comboOfSupplierId)}
                  >
                    Xem
                  </Button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          title="Cập Nhật Combo của Nhà Cung Cấp"
          visible={showUpdateForm}
          onOk={handleUpdateCombo}
          onCancel={() => setShowUpdateForm(false)}
        >
          {selectedCombo && (
            <div>
              <Select
                value={selectedCombo.comboId}
                onChange={(value) =>
                  setSelectedCombo({ ...selectedCombo, comboId: value })
                }
                placeholder="Chọn Combo"
                className="mb-2 w-full"
              >
                {combos.map((combo) => (
                  <Select.Option key={combo.comboId} value={combo.comboId}>
                    {combo.comboName}
                  </Select.Option>
                ))}
              </Select>
              <Select
                value={selectedCombo.supplierID}
                onChange={(value) =>
                  setSelectedCombo({ ...selectedCombo, supplierID: value })
                }
                placeholder="Chọn Nhà Cung Cấp"
                className="mb-2 w-full"
              >
                {suppliers.map((supplier) => (
                  <Select.Option
                    key={supplier.supplierID}
                    value={supplier.supplierID}
                  >
                    {supplier.supplierName}
                  </Select.Option>
                ))}
              </Select>
              <DatePicker
                showTime
                value={dayjs(selectedCombo.startTime)}
                onChange={(date) =>
                  setSelectedCombo({ ...selectedCombo, startTime: date })
                }
                placeholder="Thời Gian Bắt Đầu"
                className="mb-2 w-full"
              />
              <DatePicker
                showTime
                value={dayjs(selectedCombo.endTime)}
                onChange={(date) =>
                  setSelectedCombo({ ...selectedCombo, endTime: date })
                }
                placeholder="Thời Gian Kết Thúc"
                className="mb-2 w-full"
              />
              <Checkbox
                checked={selectedCombo.isDisable}
                onChange={(e) =>
                  setSelectedCombo({
                    ...selectedCombo,
                    isDisable: e.target.checked,
                  })
                }
              >
                Bị Vô Hiệu Hóa
              </Checkbox>
            </div>
          )}
        </Modal>

        <Modal
          title="Tạo Combo Mới của Nhà Cung Cấp"
          visible={showCreateForm}
          onOk={handleCreateCombo}
          onCancel={() => setShowCreateForm(false)}
        >
          <Select
            value={newCombo.comboId || undefined}
            onChange={(value) => setNewCombo({ ...newCombo, comboId: value })}
            placeholder="Chọn Combo"
            className="mb-2 w-full"
          >
            {availableCombos.map((combo) => (
              <Select.Option key={combo.id} value={combo.id}>
                {combo.name}
              </Select.Option>
            ))}
          </Select>
          <Select
            value={newCombo.supplierID || undefined}
            onChange={(value) =>
              setNewCombo({ ...newCombo, supplierID: value })
            }
            placeholder="Chọn Nhà Cung Cấp"
            className="mb-2 w-full"
          >
            {suppliers.map((supplier) => (
              <Select.Option
                key={supplier.supplierID}
                value={supplier.supplierID}
              >
                {supplier.supplierName}
              </Select.Option>
            ))}
          </Select>
          <DatePicker
            showTime
            value={newCombo.startTime ? dayjs(newCombo.startTime) : null}
            onChange={(date) => setNewCombo({ ...newCombo, startTime: date })}
            placeholder="Thời Gian Bắt Đầu"
            className="mb-2 w-full"
          />
          <DatePicker
            showTime
            value={newCombo.endTime ? dayjs(newCombo.endTime) : null}
            onChange={(date) => setNewCombo({ ...newCombo, endTime: date })}
            placeholder="Thời Gian Kết Thúc"
            className="mb-2 w-full"
          />
          <Checkbox
            checked={newCombo.isDisable}
            onChange={(e) =>
              setNewCombo({ ...newCombo, isDisable: e.target.checked })
            }
          >
            Bị Vô Hiệu Hóa
          </Checkbox>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default ComboSupplierList;
