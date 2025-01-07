import { StarFilled } from "@ant-design/icons";
import { Card, Progress, Typography } from "antd";

const { Text } = Typography;

const RatingDistributionCard = ({ ratingStats }) => {
  return (
    <Card 
      title={<Text strong style={{ fontSize: '18px' }}>Phân Bố Đánh Giá</Text>}
      style={{ 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        background: 'linear-gradient(145deg, #ffffff, #f0f2f5)',
        border: 'none'
      }}
    >
      {ratingStats?.ratingDistribution?.map((dist) => (
        <div key={dist.ratingValue} style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Text strong style={{ width: '100px', fontSize: '15px' }}>
              <StarFilled style={{ color: '#faad14', marginRight: '8px' }} />
              {dist.ratingValue} sao
            </Text>
            <Text type="secondary" style={{ marginLeft: '12px' }}>
              ({dist.count} đánh giá)
            </Text>
          </div>
          <Progress
            percent={(dist.count / ratingStats.totalRatings) * 100}
            format={(percent) => `${percent.toFixed(1)}%`}
            strokeColor={{
              '0%': '#108ee9',
              '100%': '#87d068',
            }}
            strokeWidth={14}
            status="active"
          />
        </div>
      ))}
    </Card>
  );
};

export default RatingDistributionCard;
