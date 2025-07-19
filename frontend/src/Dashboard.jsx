import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Star, LogOut, Search } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';

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

  // Replace with your Stripe public key
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TechStore
            </h1>
            <div className="hidden md:block flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  aria-label="Search products"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <ShoppingCart className="w-6 h-6 text-gray-600 hover:text-indigo-600 transition-colors" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </div>
              {userInfo ? (
                <div className="flex items-center space-x-2">
                  <img
                    src={userInfo.image}
                    alt={userInfo.name}
                    className="w-8 h-8 rounded-full border-2 border-indigo-500 hover:scale-105 transition-transform duration-200"
                  />
                  <span className="text-sm font-medium text-gray-900 hidden sm:block">{userInfo.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium hidden sm:block">Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="text-gray-600 hover:text-indigo-600 transition-colors"
                >
                  Login
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-700 to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in">
            Welcome {userInfo?.name || 'Guest'} to TechStore
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Discover the latest electronics at unbeatable prices
          </p>
          <button className="bg-white text-indigo-700 px-8 py-3 rounded-lg font-semibold hover:shadow-xl hover:bg-indigo-50 transform hover:-translate-y-1 transition-all duration-300">
            Shop Now
          </button>
        </div>
      </section>

      {/* Products Row */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Products</h2>
        <div className="flex overflow-x-auto space-x-6">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              className="flex-none w-64 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 truncate-text">{product.name}</h3>
                <div className="flex items-center mb-3">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
                <p className="text-xl font-bold text-gray-900 mb-4">₹{product.price.toLocaleString()}</p>
                {cart[product.id] ? (
                  <div className="flex items-center justify-between bg-indigo-50 rounded-lg p-2">
                    <button
                      onClick={() => handleDecrement(product.id)}
                      className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-4 py-2 font-semibold text-indigo-700">{cart[product.id].quantity}</span>
                    <button
                      onClick={() => handleIncrement(product.id)}
                      className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center space-x-2"
                    aria-label={`Add ${product.name} to cart`}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cart Summary (Fixed Bottom) */}
      {Object.values(cart).length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-40">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Cart Summary</h2>
            <div className="space-y-4">
              {Object.values(cart).map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
                    <div>
                      <p className="font-medium text-gray-900 truncate-text">{item.name}</p>
                      <p className="text-sm text-gray-500">₹{item.price.toLocaleString()} x {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">₹{(item.quantity * item.price).toLocaleString()}</p>
                </div>
              ))}
              <hr className="my-4" />
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total ({totalCartItems} items)</span>
                <span>₹{totalBill.toLocaleString()}</span>
              </div>
              <button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg font-semibold hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                aria-label="Proceed to payment"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;