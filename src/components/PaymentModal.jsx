import React from 'react';
import { X, CreditCard, Building2 } from 'lucide-react';

const PaymentModal = ({
  isOpen,
  onClose,
  onPaymentMethodSelect,
  amount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Select Payment Method</h2>
        <p className="text-gray-600 mb-6">Total Amount: ${amount.toFixed(2)}</p>
        
        <div className="space-y-4">
          <button
            onClick={() => onPaymentMethodSelect('online')}
            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-blue-600 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Pay Online</h3>
                <p className="text-sm text-gray-600">Secure payment with credit card</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => onPaymentMethodSelect('onsite')}
            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-colors"
          >
            <div className="flex items-center">
              <Building2 className="w-6 h-6 text-green-600 mr-3" />
              <div className="text-left">
                <h3 className="font-semibold text-gray-800">Pay On-site</h3>
                <p className="text-sm text-gray-600">Pay at the venue before your session</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;