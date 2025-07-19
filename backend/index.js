const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./models/dbConnect');
const authRoutes = require('./routes/authRoutes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 8080;
const Purchase = require('./models/Purchase');
const nodemailer = require('nodemailer');

app.use(cors());
app.use(express.json());
app.use('/auth/', authRoutes);

app.use(cors({
  origin: 'http://localhost:5173',
}));

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Stripe Checkout Session Route
app.post('/create-checkout-session', async (req, res) => {
  const { items, userEmail } = req.body;

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'inr',
      product_data: {
        name: item.name,
        images: [item.image],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: 'http://localhost:5173/success',
      cancel_url: 'http://localhost:5173/cancel',
    });

    const totalAmount = items.reduce((total, item) => total + item.price * item.quantity, 0);

    const purchase = new Purchase({
      userEmail,
      items,
      totalAmount,
    });

    await purchase.save();

    // Send email notification using Nodemailer
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${userEmail}, jainabhishek624@gmail.com`, // Send to user and admin
      subject: 'Purchase Confirmation',
      text: ` ${userEmail},has  bought the following items:\n\n${items.map(item => `- ${item.name} (x${item.quantity})`).join('\n')}\n\nTotal amount: ₹${totalAmount}.\n\nBest regards,\nYour Company Name`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent successfully:', info.response);
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch all purchase details
app.get('/purchases', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});