import React, { useEffect, useState } from 'react';
import { UserOutlined, ShoppingOutlined, TeamOutlined, AppstoreOutlined, WarningOutlined, ShoppingCartOutlined, GiftOutlined, FileTextOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import { getUserCount, getReportCount, getProductCount, getSupplierCount, getStaffCount, getCategoryCount, getComboCount, getOrderCount, getProductReportCount } from '../../api/dasshboardmanageApi';

const StatisticsOverviewCard = () => {
  const [stats, setStats] = useState({
    userCount: 0,
    reportCount: 0,
    productCount: 0,
    supplierCount: 0,
    staffCount: 0,
    categoryCount: 0,
    comboCount: 0,
    orderCount: 0,
    productReportCount: 0
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [users, reports, products, suppliers, staff, categories, combos, orders, productReports] = 
          await Promise.all([
            getUserCount(),
            getReportCount(),
            getProductCount(),
            getSupplierCount(),
            getStaffCount(),
            getCategoryCount(),
            getComboCount(),
            getOrderCount(),
            getProductReportCount()
          ]);

        setStats({
          userCount: users,
          reportCount: reports,
          productCount: products,
          supplierCount: suppliers,
          staffCount: staff,
          categoryCount: categories,
          comboCount: combos,
          orderCount: orders,
          productReportCount: productReports
        });
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const statisticsData = [
    { title: 'Người Dùng', value: stats.userCount, icon: <UserOutlined />, color: '#1890ff' },
    { title: 'Sản Phẩm', value: stats.productCount, icon: <ShoppingOutlined />, color: '#52c41a' },
    { title: 'Nhà Cung Cấp', value: stats.supplierCount, icon: <TeamOutlined />, color: '#722ed1' },
    { title: 'Nhân Viên', value: stats.staffCount, icon: <TeamOutlined />, color: '#eb2f96' },
    { title: 'Danh Mục', value: stats.categoryCount, icon: <AppstoreOutlined />, color: '#faad14' },
    { title: 'Combo', value: stats.comboCount, icon: <GiftOutlined />, color: '#13c2c2' },
    { title: 'Đơn Hàng', value: stats.orderCount, icon: <ShoppingCartOutlined />, color: '#fa8c16' },
    { title: 'Báo Cáo', value: stats.reportCount, icon: <FileTextOutlined />, color: '#f5222d' },
    { title: 'Báo Cáo SP', value: stats.productReportCount, icon: <WarningOutlined />, color: '#ff4d4f' }
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <Row gutter={[8, 8]} style={{ flexWrap: 'nowrap', marginBottom: '8px' }}>
        {statisticsData.map((stat, index) => (
          <Col key={index} style={{ minWidth: '160px' }}>
            <Card
              hoverable
              bodyStyle={{ padding: '8px' }}
              style={{
                background: `linear-gradient(135deg, ${stat.color}15, ${stat.color}05)`,
                border: `1px solid ${stat.color}30`,
                borderRadius: '8px',
                height: '70px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: `${stat.color}15`,
                  borderRadius: '50%',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {React.cloneElement(stat.icon, { 
                    style: { 
                      fontSize: '18px', 
                      color: stat.color 
                    } 
                  })}
                </div>
                <div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '2px' }}>{stat.title}</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default StatisticsOverviewCard;
