// backend/utils/whatsapp.js
const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const sendOrderNotification = async (order) => {
  try {
    // Format the message
    const items = order.orderItems.map(item => `${item.qty}x ${item.name}`).join('\n');
    
    const messageBody = `
🐻 *NEW CACTUS BEAR ORDER!* 🐻
---------------------------
💰 Amount: ₦${order.totalPrice}
👤 Customer: ${order.user.name}
📧 Email: ${order.user.email}
---------------------------
📦 *Items:*
${items}
---------------------------
✅ Payment: Paid via Flutterwave
ID: ${order._id}
`;

    // Send to YOUR number (08075309404)
    // Note: In Twilio Sandbox, you send from the sandbox number.
    // Ensure your number starts with country code: +2348075309404
    await client.messages.create({
      from: 'whatsapp:+14155238886', // This will be your Twilio Sender ID
      to: 'whatsapp:+2348075309404', 
      body: messageBody
    });

    console.log('WhatsApp notification sent successfully');
  } catch (error) {
    console.error('Error sending WhatsApp:', error.message);
    // Don't crash the app if WhatsApp fails, just log it
  }
};

module.exports = sendOrderNotification;