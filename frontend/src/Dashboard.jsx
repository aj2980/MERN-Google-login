import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Star, LogOut, Search } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import 'bootstrap/dist/css/bootstrap.min.css';

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 1200,
    image: "https://plus.unsplash.com/premium_photo-1679513691474-73102089c117?q=80&w=1113&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviews: 120
  },
  {
    id: 2,
    name: "Gaming Mouse",
    price: 700,
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=647&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.2,
    reviews: 85
  },
  {
    id: 3,
    name: "Smart Watch",
    price: 2200,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviews: 200
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: 1500,
    image: "https://images.unsplash.com/photo-1531104985437-603d6490e6d4?q=80&w=1139&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.3,
    reviews: 150
  }
];

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [cart, setCart] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user-info');
    const userData = JSON.parse(data);
    setUserInfo(userData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    navigate('/login');
  };

  const handleAddToCart = (product) => {
    setCart(prev => ({
      ...prev,
      [product.id]: { ...product, quantity: (prev[product.id]?.quantity || 0) + 1 }
    }));
  };

  const handleIncrement = (productId) => {
    setCart(prev => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: prev[productId].quantity + 1
      }
    }));
  };

  const handleDecrement = (productId) => {
    setCart(prev => {
      const updated = { ...prev };
      if (updated[productId].quantity > 1) {
        updated[productId].quantity -= 1;
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  //  Stripe public key
  const stripePromise = loadStripe("pk_test_51RmW7eI7GzydU2gDmmR8tdufSaaYbHWzszTxGk58tnVstCNwz0PcxGnJxf9hrmbB7kQ9z32FIaRGNeYZ8bLozZFq00nObH0f0M");

  const handlePayment = async () => {
    const stripe = await stripePromise;

    const response = await fetch("http://localhost:3000/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        items: Object.values(cart),
        userEmail: userInfo.email // Include user email
      })
    });

    const session = await response.json();

    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id
    });

    if (result.error) {
      alert(result.error.message);
    }
  };

  const totalCartItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
  const totalBill = Object.values(cart).reduce((acc, item) => acc + item.quantity * item.price, 0);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      {/* Header */}
      <header className="bg-light shadow-sm sticky-top">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="text-primary fw-bold">TechStore</h1>
            <div className="d-none d-md-block flex-grow-1 mx-4">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0">
                  <Search className="text-muted" />
                </span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control border-start-0"
                  aria-label="Search products"
                />
              </div>
            </div>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <ShoppingCart className="text-muted" />
                {totalCartItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalCartItems}
                  </span>
                )}
              </div>
              {userInfo ? (
                <div className="d-flex align-items-center">
                  <img
                    src={userInfo.image}
                    alt={userInfo.name}
                    className="rounded-circle border border-primary me-2"
                    style={{ width: '40px', height: '40px' }}
                  />
                  <span className="d-none d-sm-inline text-dark fw-medium">{userInfo.name}</span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-link text-muted ms-3"
                    aria-label="Logout"
                  >
                    <LogOut />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="btn btn-link text-muted"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-white text-center py-5">
        <div className="container">
          <h2 className="display-4 fw-bold">Welcome {userInfo?.name || 'Guest'} to TechStore</h2>
          <p className="lead">Discover the latest electronics at unbeatable prices</p>
          <button className="btn btn-light btn-lg mt-3">Shop Now</button>
        </div>
      </section>

      {/* Products Row */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Our Products</h2>
          <div className="row">
            {filteredProducts.map(product => (
              <div key={product.id} className="col-md-3 mb-4">
                <div className="card h-100 shadow-sm">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="card-img-top "
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <div className="d-flex align-items-center mb-2">
                      <div className="text-warning me-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={i < Math.floor(product.rating) ? 'fill-current' : ''} />
                        ))}
                      </div>
                      <span className="text-muted">({product.reviews} reviews)</span>
                    </div>
                    <p className="card-text fw-bold">₹{product.price.toLocaleString()}</p>
                    {cart[product.id] ? (
                      <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded">
                        <button
                          onClick={() => handleDecrement(product.id)}
                          className="btn btn-outline-secondary btn-sm"
                          aria-label={`Decrease quantity of ${product.name}`}
                        >
                          <Minus />
                        </button>
                        <span className="fw-bold">{cart[product.id].quantity}</span>
                        <button
                          onClick={() => handleIncrement(product.id)}
                          className="btn btn-outline-secondary btn-sm"
                          aria-label={`Increase quantity of ${product.name}`}
                        >
                          <Plus />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary w-100"
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart className="me-2" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cart Summary (Fixed Bottom) */}
      {Object.values(cart).length > 0 && (
        <div className="fixed-bottom bg-white border-top shadow-lg p-3">
          <div className="container">
            <h2 className="h5">Cart Summary</h2>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                {Object.values(cart).map(item => (
                  <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                    <img src={item.image} alt={item.name} className="rounded me-2" style={{ width: '50px', height: '50px' }} />
                    <div>
                      <p className="mb-0">{item.name}</p>
                      <small className="text-muted">₹{item.price.toLocaleString()} x {item.quantity}</small>
                    </div>
                    <p className="fw-bold mb-0">₹{(item.quantity * item.price).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="text-end">
                <p className="mb-1">Total ({totalCartItems} items):</p>
                <p className="h5 fw-bold">₹{totalBill.toLocaleString()}</p>
                <button
                  onClick={handlePayment}
                  className="btn btn-success mt-2"
                  aria-label="Proceed to payment"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;