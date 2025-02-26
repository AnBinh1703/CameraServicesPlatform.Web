import { DatePicker, Input } from "antd";
import moment from "moment";
import React from "react";
import Highlighter from "react-highlight-words";

export const getColumnSearchProps = (
  dataIndex,
  searchText,
  setSearchText,
  searchedColumn,
  setSearchedColumn
) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div style={{ padding: 8 }}>
      <Input
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={(e) =>
          setSelectedKeys(e.target.value ? [e.target.value] : [])
        }
        onPressEnter={() =>
          handleSearch(
            selectedKeys,
            confirm,
            dataIndex,
            setSearchText,
            setSearchedColumn
          )
        }
        style={{ marginBottom: 8, display: "block" }}
      />
    </div>
  ),

  onFilter: (value, record) =>
    record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : "",
  onFilterDropdownOpenChange: (visible) => {
    if (visible) {
      setTimeout(() => document.getElementById("search-input").select(), 100);
    }
  },
  render: (text) =>
    searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
        searchWords={[searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ""}
      />
    ) : (
      text
    ),
});

export const getColumnDateSearchProps = (dataIndex) => ({
  filterDropdown: ({ setSelectedKeys }) => (
    <div style={{ padding: 8 }}>
      <DatePicker
        onChange={(date, dateString) =>
          setSelectedKeys(dateString ? [dateString] : [])
        }
        style={{ marginBottom: 8, display: "block" }}
      />
    </div>
  ),

  onFilter: (value, record) =>
    record[dataIndex]
      ? moment(record[dataIndex]).format("DD-MM-YYYY") === value
      : "",
});
