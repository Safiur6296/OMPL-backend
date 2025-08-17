const express = require('express');
const cors = require('cors');
const Razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'src')));

app.use(cors());

app.options('*', cors());

app.use(express.json());


// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Update the create-order endpoint
app.post('/api/create-order', async (req, res) => {
    try {
        const options = {
            amount: 100, // amount in smallest currency unit (paise)
            currency: "INR",
            receipt: "receipt_" + Date.now(),
            payment_capture: 1
        };

        const order = await razorpay.orders.create(options);

        res.json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            currency: order.currency
        });
    } catch (error) {
        console.error('Order creation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create order'
        });
    }
});

// Verify Razorpay payment
app.post('/api/verify-payment', async (req, res) => {
    const { orderId, paymentId, signature } = req.body;
    const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(orderId + '|' + paymentId)
        .digest('hex');

    if (generatedSignature === signature) {
        res.json({
            verified: true,
            message: 'Payment verified successfully'
        });
    } else {
        res.status(400).json({
            verified: false,
            error: 'Invalid payment signature'
        });
    }
});

// Razorpay webhook handler
app.post('/api/payment-webhook', async (req, res) => {
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest('hex');

    if (digest === req.headers['x-razorpay-signature']) {
        const payment = req.body.payload.payment.entity;
        if (payment.status === 'captured') {
            console.log('Payment successful:', payment.id);
            res.json({
                status: 'ok',
                message: 'Payment processed successfully'
            });
        }
    } else {
        res.status(400).json({ error: 'Invalid webhook signature' });
    }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'index.html'));
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});