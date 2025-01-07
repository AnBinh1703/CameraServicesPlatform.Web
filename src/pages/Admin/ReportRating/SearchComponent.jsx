import { SearchOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";

const SearchComponent = ({ searchInput, handleSearch, handleReset }) => {
  return (
    <div style={{ padding: 8 }}>
      <Input
        ref={searchInput}
        placeholder={`Tìm kiếm`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
        style={{ width: 188, marginBottom: 8, display: "block" }}
      />
      <Space>
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90 }}
        >
          Tìm
        </Button>
        <Button
          onClick={() => handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Đặt lại
        </Button>
      </Space>
    </div>
  );
};

export default SearchComponent;
