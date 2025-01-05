import moment from 'moment';
import { OrderHeaderProps } from '../../types/tracking-order.types';

const OrderHeader: React.FC<OrderHeaderProps> = ({ order }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Đơn hàng #{order?.orderID}
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Ngày đặt: {moment(order?.orderDate).format("DD/MM/YYYY HH:mm")}
        </p>
      </div>
      <div className="text-right">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            order?.orderStatus === 1
              ? "bg-blue-100 text-blue-800"
              : order?.orderStatus === 2
              ? "bg-green-100 text-green-800"
              : order?.orderStatus === 3
              ? "bg-yellow-100 text-yellow-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {order?.orderType === 0 ? "Mua" : "Thuê"}
        </span>
      </div>
    </div>
  </div>
);

export default OrderHeader;
