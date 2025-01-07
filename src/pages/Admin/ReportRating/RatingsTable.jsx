import { Table } from "antd";
import { useEffect, useState } from "react";
import { ratingColumns } from "./columns";
import { getUserById } from "../../../api/accountApi";

const RatingsTable = ({ 
  data, 
  loading, 
  pagination, 
  onChange,
  productDetails,
  getColumnSearchProps,
  handleViewDetails
}) => {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userMap = {};
      for (const rating of data) {
        if (rating.accountID && !userDetails[rating.accountID]) {
          const userResponse = await getUserById(rating.accountID);
          if (userResponse?.result) {
            userMap[rating.accountID] = userResponse.result;
          }
        }
      }
      setUserDetails(prev => ({ ...prev, ...userMap }));
    };

    fetchUserDetails();
  }, [data]);

  const columns = ratingColumns(getColumnSearchProps, productDetails, handleViewDetails, userDetails);
  
  return (
    <Table
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={pagination}
      onChange={onChange}
      loading={loading}
    />
  );
};

export default RatingsTable;
