import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Star, LogOut, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const data = localStorage.getItem('user-info');
    if (data) {
      try {
        setUserInfo(JSON.parse(data));
      } catch (error) {
        console.error('Error parsing user-info:', error);
      }
    }

    fetch('http://localhost:3000/products')
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(cart).length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const handleLogout = () => {
    localStorage.removeItem('user-info');
    navigate('/login');
  };

  const handleAddToCart = (product) => {
    setCart((prev) => ({
      ...prev,
      [product.id]: { ...product, quantity: (prev[product.id]?.quantity || 0) + 1 },
    }));
  };

  const handleIncrement = (productId) => {
    setCart((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], quantity: prev[productId].quantity + 1 },
    }));
  };

  const handleDecrement = (productId) => {
  setCart((prev) => {
    if (!prev[productId]) return prev; // safety check
    const currentQty = prev[productId].quantity;

    if (currentQty > 1) {
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity: currentQty - 1,
        },
      };
    } else {
      const { [productId]: _, ...rest } = prev; // remove product
      return rest;
    }
  });
};


  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCartItems = Object.values(cart).reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <div className="container-fluid">
      {/* Header */}
      <motion.header
        className="bg-light shadow-sm sticky-top"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center">
            <motion.h1
              className="text-primary fw-bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              TechStore
            </motion.h1>

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
                />
              </div>
            </div>

            <div className="d-flex align-items-center">
              <div
                className="position-relative me-3"
                onClick={() => navigate('/cart')}
                style={{ cursor: 'pointer' }}
              >
                <motion.div whileHover={{ scale: 1.2 }}>
                  <ShoppingCart className="text-muted" />
                </motion.div>
                {totalCartItems > 0 && (
                  <motion.span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    {totalCartItems}
                  </motion.span>
                )}
              </div>

              {userInfo ? (
                <div className="d-flex align-items-center">
                  <motion.img
                    src={userInfo.image}
                    alt={userInfo.name}
                    className="rounded-circle border border-primary me-2"
                    style={{ width: '40px', height: '40px' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  />
                  <span className="d-none d-sm-inline text-dark fw-medium">
                    {userInfo.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn btn-link text-muted ms-3"
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
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="bg-primary text-white text-center py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="container">
          <motion.h2
            className="display-4 fw-bold"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome {userInfo?.name || 'Guest'} to TechStore
          </motion.h2>
          <p className="lead">Discover the latest electronics at unbeatable prices</p>
          <motion.button
            className="btn btn-light btn-lg mt-3"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            Shop Now
          </motion.button>
        </div>
      </motion.section>

      {/* Products */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-4">Our Products</h2>
          <div className="row">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                className="col-md-3 mb-4"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="card h-100 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <div className="d-flex align-items-center mb-2">
                      <div className="text-warning me-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i < Math.floor(product.rating) ? 'fill-current' : ''
                            }
                          />
                        ))}
                      </div>
                      <span className="text-muted">
                        ({product.reviews} reviews)
                      </span>
                    </div>
                    <p className="card-text fw-bold">
                      ₹{product.price.toLocaleString()}
                    </p>
                    {cart[product.id] ? (
                      <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded">
                        <button
                          onClick={() => handleDecrement(product.id)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <Minus />
                        </button>
                        <motion.span
                          className="fw-bold"
                          key={cart[product.id].quantity}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          {cart[product.id].quantity}
                        </motion.span>
                        <button
                          onClick={() => handleIncrement(product.id)}
                          className="btn btn-outline-secondary btn-sm"
                        >
                          <Plus />
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => handleAddToCart(product)}
                        className="btn btn-primary w-100"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <ShoppingCart className="me-2" />
                        Add to Cart
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
