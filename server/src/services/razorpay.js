/**
 * RAZORPAY SERVICE
 */
import Razorpay from 'razorpay';

const isConfigured = Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);

if (!isConfigured) {
  console.warn('⚠️  Razorpay credentials not configured. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env.');
}

export const razorpay = isConfigured
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : {
      orders: {
        create: async () => {
          throw new Error('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in server/.env');
        },
      },
    };
