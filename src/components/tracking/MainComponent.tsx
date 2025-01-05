import React from 'react';
import { useOrderTracking } from '../../hooks/useOrderTracking';
import OrderHeader from './OrderHeader';
import StepsProgress from './StepsProgress';
import { orderSteps } from '../../utils/orderSteps';

const MainComponent = ({ order, onUpdate }) => {
  const {
    orderDetails,
    loading,
    beforeImageUrl,
    afterImageUrl,
    extendsData,
  } = useOrderTracking(order);

  const currentStep = orderSteps.findIndex(
    (step) =>
      step.status === order.orderStatus ||
      (Array.isArray(step.status) && step.status.includes(order.orderStatus))
  );

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OrderHeader order={order} />
        <StepsProgress currentStep={currentStep} steps={orderSteps} />
        {/* ... Rest of the component ... */}
      </div>
    </div>
  );
};

export default MainComponent;
