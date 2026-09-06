const { Paddle, Environment } = require('@paddle/paddle-node');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const PADDLE_API_KEY = process.env.PADDLE_API_KEY;
    if (!PADDLE_API_KEY) {
      return res.status(500).json({ message: 'Paddle credentials are not configured' });
    }

    const paddle = new Paddle(PADDLE_API_KEY, {
        environment: Environment.sandbox // Change to Environment.production for live
    });

    const { bookingId, amount, currency, email, name, description } = req.body;

    const transaction = await paddle.transactions.create({
      items: [
        {
          price: {
            description: description || `Meeting with ${name}`,
            unitPrice: {
              amount: amount * 100, // Amount in cents
              currencyCode: currency || 'USD'
            },
            product: {
              name: 'Consultation Booking',
              taxCategory: 'standard'
            }
          },
          quantity: 1
        }
      ],
      customData: {
        bookingId: bookingId
      },
      customer: {
        email: email,
        name: name
      }
    });

    res.status(200).json({ success: true, transactionId: transaction.id, checkoutUrl: transaction.checkout.url });
  } catch (error) {
    console.error('Paddle API Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
