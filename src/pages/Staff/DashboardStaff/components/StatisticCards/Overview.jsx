import { Card, Col, Row, Statistic } from 'antd';
import { colors } from '../../constants/colors';
// Import icons...

export const Overview = ({ statistics }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={6}>
        <Card style={statCardStyle}>
          <Statistic
            title="Tổng người dùng"
            value={statistics.users}
            prefix={<UserOutlined style={{ color: colors.primary }} />}
          />
        </Card>
      </Col>
      {/* Other statistic cards... */}
    </Row>
  );
};
