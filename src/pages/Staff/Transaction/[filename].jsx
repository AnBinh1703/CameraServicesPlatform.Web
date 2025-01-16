// ...existing imports...

// Add this consistent style block to all files
const containerStyle = {
  maxWidth: '100%',
  margin: '0 auto',
  padding: '0',
};

const tableStyle = {
  marginBottom: '16px',
  background: '#fff',
  borderRadius: '8px',
};

const cardStyle = {
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
};

// In the return statement of each component, update the wrapper structure:
return (
  <div style={containerStyle}>
    <Card bordered={false} className="criclebox" style={cardStyle}>
      <div className="mb-3">
        <Breadcrumb>
          <Breadcrumb.Item href="/">
            <HomeOutlined />
          </Breadcrumb.Item>
          <Breadcrumb.Item href="/staff">Nhân viên</Breadcrumb.Item>
          <Breadcrumb.Item>Your Page Title</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="table-responsive">
        <Title level={3} className="mb-3">
          Your Table Title
        </Title>
        
        <Table
          {...existingTableProps}
          style={tableStyle}
          size="middle"
          scroll={{ x: 'max-content' }}
          className="ant-table-content"
        />
      </div>

      <style jsx>{`
        .table-responsive {
          margin: -24px;
          padding: 24px;
        }
        .ant-card-body {
          padding: 24px;
        }
        .ant-table-wrapper {
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
        }
        .ant-pagination-custom {
          padding: 16px 24px;
          background: #fff;
          border-radius: 0 0 8px 8px;
        }
        .ant-breadcrumb {
          margin-bottom: 16px;
        }
        .criclebox {
          background: #fff;
          border-radius: 8px;
          margin-bottom: 24px;
        }
      `}</style>
    </Card>
  </div>
);
