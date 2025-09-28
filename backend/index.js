const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
require('./models/dbConnect');
const authRoutes = require('./routes/authRoutes');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || "sk_test_fake");
const PORT = process.env.PORT || 3000;
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
        images: [item.imageUrl],
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



const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1200,
    imageUrl: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 120
  },
  {
    id: 2,
    name: "Gaming Mouse",
    price: 700,
    imageUrl: "https://dellstatic.luroconnect.com/media/catalog/product/cache/74ae05ef3745aec30d7f5a287debd7f5/5/7/570-abmx.jpg",
    rating: 4.2,
    reviews: 85
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 2200,
    imageUrl: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 200
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 1500,
    imageUrl: "https://images.unsplash.com/photo-1531104985437-603d6490e6d4?q=80&w=1139&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.3,
    reviews: 150
  },
  {
    id: 5,
    name: "Laptop",
    price: 45000,
    imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviews: 300
  },
  {
    id: 6,
    name: "Wireless Keyboard",
    price: 900,
    imageUrl: "https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.4,
    reviews: 95
  },
  {
    id: 7,
    name: "4K Monitor",
    price: 25000,
    imageUrl: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1189&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.6,
    reviews: 180
  },
  {
    id: 8,
    name: "USB-C Hub",
    price: 600,
    imageUrl: "https://images.unsplash.com/photo-1572721546624-05bf65ad7679?q=80&w=1073&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.1,
    reviews: 70
  }
];


app.get("/products", (req, res) => {
  console.log("Products fetched");
  res.json(products);
});

// POST /checkout → accept items, log order, return success
app.post("/checkout", (req, res) => {
  const { items, userEmail } = req.body;
  if (!items || !Array.isArray(items) || items.some(item => !item.productId || !item.quantity)) {
    console.log("Invalid order received:", items);
    return res.status(400).json({ success: false, message: "Invalid cart items" });
  }
  console.log("New Order Received for:", userEmail);
  console.table(items.map(item => ({ productId: item.productId, quantity: item.quantity })));
  res.json({ success: true, message: "Order placed successfully!" });
});


const server = app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

module.exports = app; // ✅ export app for tests
