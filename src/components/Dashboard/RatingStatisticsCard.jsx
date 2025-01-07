import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic } from "antd";

const cardStyle = {
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
  border: 'none',
  ':hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 8px 16px rgba(0,0,0,0.15)'
  }
};

const RatingStatisticsCard = ({ ratingStats }) => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} lg={8}>
        <Card style={cardStyle} hoverable>
          <Statistic
            title={<span style={{ fontSize: '16px', color: '#595959' }}>Tổng Số Đánh Giá</span>}
            value={ratingStats?.totalRatings || 0}
            prefix={<StarFilled style={{ color: '#faad14' }} />}
            valueStyle={{ color: '#1890ff', fontWeight: 'bold', fontSize: '28px' }}
          />
        </Card>
      </Col>
      <Col xs={24} sm={12} lg={8}>
        <Card style={cardStyle} hoverable>
          <Statistic
            title={<span style={{ fontSize: '16px', color: '#595959' }}>Đánh Giá Trung Bình</span>}
            value={ratingStats?.averageRating || 0}
            precision={1}
            prefix={<StarFilled style={{ color: '#faad14' }} />}
            suffix="/5"
            valueStyle={{ color: '#1890ff', fontWeight: 'bold', fontSize: '28px' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default RatingStatisticsCard;
