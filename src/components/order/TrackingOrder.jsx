import { Modal } from 'antd';
import { useEffect } from 'react';
import { useOrderActions } from '../../hooks/useOrderActions';
import { ORDER_STEPS, ORDER_DETAILS_COLUMNS, EXTEND_COLUMNS } from '../../constants/orderConstants';
import OrderHeader from './OrderHeader';
import StepsComponent from './StepsComponent';
import OrderDetailsTable from './OrderDetailsTable';
import ImagesComponent from './ImagesComponent';
import ActionsComponent from './ActionsComponent';

const TrackingOrder = ({ order, onUpdate }) => {
  const {
    cancelMessage,
    setCancelMessage,
    handleCompleteOrder,
    // ... other actions
  } = useOrderActions(onUpdate);

  // ... minimal state management and effects

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderHeader order={order} />
        <StepsComponent currentStep={currentStep} steps={ORDER_STEPS} />
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ... simplified layout ... */}
        </div>
        
        {/* Modals */}
        <Modal
          title="Tạo chi tiết trả hàng"
          visible={showReturnDetailForm}
          onCancel={() => setShowReturnDetailForm(false)}
          footer={null}
          width={800}
        >
          <CreateReturnDetailForm
            orderID={selectedOrderID}
            onSuccess={() => setShowReturnDetailForm(false)}
          />
        </Modal>
      </div>
    </div>
  );
};

export default TrackingOrder;
