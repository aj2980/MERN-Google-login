
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, Home } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import enhanced styles

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Cart: Loading cart and user info from localStorage');
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        if (parsedCart && typeof parsedCart === 'object') {
          setCart(parsedCart);
          console.log('Cart: Loaded cart from localStorage:', parsedCart);
        } else {
          setCart({});
          console.log('Cart: Parsed cart is empty or invalid:', parsedCart);
        }
      } catch (error) {
        console.error('Cart: Error parsing cart from localStorage:', error);
        setCart({});
      }
    } else {
      setCart({});
      console.log('Cart: No cart found in localStorage');
    }
    const data = localStorage.getItem('user-info');
    if (data) {
      try {
        setUserInfo(JSON.parse(data));
        console.log('Cart: User info loaded:', JSON.parse(data));
      } catch (error) {
        console.error('Cart: Error parsing user info from localStorage:', error);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (cart !== null) {
      console.log('Cart: Saving cart to localStorage:', cart);
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const handleIncrement = (productId) => {
    console.log('Cart: Incrementing quantity for product:', productId);
    setCart((prev) => {
      if (!prev || !prev[productId]) {
        console.error('Cart: Product not found in cart:', productId);
        alert('Product not found in cart.');
        return prev || {};
      }
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: (prev[productId].quantity || 0) + 1,
        },
      };
    });
  };

  const handleDecrement = (productId) => {
    console.log('Cart: Decrementing quantity for product:', productId);
    setCart((prev) => {
      if (!prev || !prev[productId]) {
        console.error('Cart: Product not found in cart:', productId);
        alert('Product not found in cart.');
        return prev || {};
      }
      const updated = { ...prev };
      if (updated[productId].quantity > 1) {
        updated[productId] = {
          ...updated[productId],
          quantity: updated[productId].quantity - 1,
        };
      } else {
        delete updated[productId];
      }
      return updated;
    });
  };

  const handleRemove = (productId) => {
    console.log('Cart: Removing product:', productId);
    setCart((prev) => {
      if (!prev || !prev[productId]) {
        console.error('Cart: Product not found in cart:', productId);
        alert('Product not found in cart.');
        return prev || {};
      }
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  const handleCheckout = async () => {
    const items = Object.values(cart || {}).map(item => ({
      productId: item.id,
      quantity: item.quantity,
    }));
    if (items.length === 0) {
      alert('Your cart is empty!');
      console.log('Cart: Checkout attempted with empty cart');
      return;
    }
    console.log('Cart: Sending checkout request with items:', items);
    try {
      const response = await fetch('http://localhost:3000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items, userEmail: userInfo?.email }),
      });
      const data = await response.json();
      console.log('Cart: Checkout response:', data);
      if (response.ok && data.success) {
        setCart({});
        localStorage.removeItem('cart');
        console.log('Cart: Checkout successful, cart cleared');
        alert(data.message || 'Checkout successful!');
        navigate('/dashboard');
      } else {
        console.log('Cart: Checkout failed:', data.message);
        alert(data.message || 'Checkout failed. Please try again.');
      }
    } catch (error) {
      console.error('Cart: Checkout error:', error);
      alert('Checkout failed. Please try again.');
    }
  };

  const stripePromise = loadStripe(
    'pk_test_51RmW7eI7GzydU2gDmmR8tdufSaaYbHWzszTxGk58tnVstCNwz0PcxGnJxf9hrmbB7kQ9z32FIaRGNeYZ8bLozZFq00nObH0f0M'
  );

  const handlePayment = async () => {
    const items = Object.values(cart || {});
    if (items.length === 0) {
      alert('Your cart is empty!');
      console.log('Cart: Payment attempted with empty cart');
      return;
    }
    console.log('Cart: Initiating payment with items:', items);
    const stripe = await stripePromise;
    try {
      const response = await fetch('http://localhost:3000/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          userEmail: userInfo?.email,
        }),
      });
      const session = await response.json();
      console.log('Cart: Stripe session response:', session);
      if (!response.ok) {
        throw new Error(session.message || 'Failed to create checkout session');
      }
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });
      if (result.error) {
        console.log('Cart: Stripe redirect error:', result.error);
        alert(result.error.message);
      }
    } catch (error) {
      console.error('Cart: Payment error:', error);
      alert('Payment initiation failed. Please try again.');
    }
  };

  if (isLoading) {
    console.log('Cart: Rendering loading state');
    return <div className="container">Loading...</div>;
  }

  if (!cart || Object.keys(cart).length === 0) {
    console.log('Cart: Rendering empty cart view');
    return (
      <div className="container fade-in">
        <h2>Your Cart is Empty</h2>
        <button
          className="btn-primary-custom"
          onClick={() => navigate('/dashboard')}
          aria-label="Continue Shopping"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  console.log('Cart: Rendering cart with items:', cart);
  const totalCartItems = Object.values(cart).reduce((acc, item) => acc + item.quantity, 0);
  const totalBill = Object.values(cart).reduce((acc, item) => acc + item.quantity * item.price, 0);

  return (
    <div className="container fade-in">
      <h2>Your Cart</h2>
      <div className="row">
        <div className="col-md-8">
          {Object.values(cart).map((item) => (
            <div key={item.id} className="cart-item-card slide-in">
              <img src={item.imageUrl} alt={item.name} />
              <div className="flex-grow-1">
                <h5>{item.name}</h5>
                <p>₹{item.price.toLocaleString()}</p>
                <div className="quantity-controls">
                  <button
                    onClick={() => handleDecrement(item.id)}
                    className="btn-secondary-custom"
                    aria-label={`Decrease quantity of ${item.name}`}
                    disabled={!item.quantity}
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.id)}
                    className="btn-secondary-custom"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="btn-danger-custom"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="text-end">
                <p className="fw-bold">₹{(item.quantity * item.price).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="col-md-4">
          <div className="cart-summary slide-in">
            <h5>Cart Summary</h5>
            <p>Total Items: {totalCartItems}</p>
            <p>Total Amount: ₹{totalBill.toLocaleString()}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary-custom w-100 mb-2"
              aria-label="Return to Home"
            >
              <Home size={16} className="me-2" /> Return to Home
            </button>
            <button
              onClick={handleCheckout}
              className="btn-primary-custom w-100 mb-2"
              aria-label="Checkout"
            >
              Checkout
            </button>
            <button
              onClick={handlePayment}
              className="btn-primary-custom w-100"
              aria-label="Proceed to Payment"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
