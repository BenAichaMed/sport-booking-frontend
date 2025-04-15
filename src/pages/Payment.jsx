import React, { useState } from 'react';
import { CreditCard, Building2, Loader2, CheckCircle } from 'lucide-react';

const Payment = () => {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);

  // Simulated booking details
  const bookingDetails = {
    court: 'Tennis Court 1',
    date: '2025-03-15',
    time: '14:00 - 15:00',
    price: 45.00,
  };

  const handlePaymentSelection = async (method) => {
    setPaymentMethod(method);
    
    if (method === 'online') {
      setProcessing(true);
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      setProcessing(false);
      setCompleted(true);
    } else if (method === 'onsite') {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              {paymentMethod === 'online' 
                ? 'Payment processed successfully.' 
                : 'Please pay at the venue before your session.'}
            </p>
            <div className="bg-gray-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-gray-800 mb-2">Booking Details</h3>
              <p className="text-gray-600">Court: {bookingDetails.court}</p>
              <p className="text-gray-600">Date: {bookingDetails.date}</p>
              <p className="text-gray-600">Time: {bookingDetails.time}</p>
              <p className="text-gray-600">Price: ${bookingDetails.price}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Choose Payment Method</h1>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-gray-800 mb-2">Booking Summary</h2>
          <p className="text-gray-600">Court: {bookingDetails.court}</p>
          <p className="text-gray-600">Date: {bookingDetails.date}</p>
          <p className="text-gray-600">Time: {bookingDetails.time}</p>
          <p className="text-gray-800 font-semibold mt-2">Total: ${bookingDetails.price}</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => handlePaymentSelection('online')}
            className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-blue-500 mr-3" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">Pay Online</p>
                <p className="text-sm text-gray-500">Secure payment with credit card</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => handlePaymentSelection('onsite')}
            className="w-full flex items-center justify-between p-4 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center">
              <Building2 className="w-6 h-6 text-blue-500 mr-3" />
              <div className="text-left">
                <p className="font-semibold text-gray-800">Pay on Site</p>
                <p className="text-sm text-gray-500">Pay at the venue before your session</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;