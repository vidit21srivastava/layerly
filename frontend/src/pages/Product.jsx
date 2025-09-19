import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import ProductItems from '../components/ProductItems';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const {
    currency,
    addToCart,
    updateCartItemQuantity,
    cartItems,
    backendURL,
    token
  } = useContext(ShopContext);

  const [productData, setProductData] = useState(null);
  const [selectedColor, setSelectedColor] = useState('White');
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${backendURL}/api/product/single/${productId}`);
        console.log('Product response:', response.data);

        if (response.data.success) {
          const product = response.data.product;
          setProductData(product);
          setSelectedColor(product.availableColors?.[0] || 'White');
          await fetchRelatedProducts(product.category);
        } else {
          setError(response.data.message || 'Product not found');
        }
      } catch (error) {
        console.error('Fetch product error:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId && backendURL) {
      fetchProduct();
    }
  }, [productId, backendURL]);

  const fetchRelatedProducts = async (category) => {
    try {
      const response = await axios.get(`${backendURL}/api/product/list`);
      if (response.data.success) {
        const related = response.data.products
          .filter(item => item.category === category && item._id !== productId)
          .slice(0, 6);
        setRelatedProducts(related);
      }
    } catch (error) {
      console.error('Fetch related products error:', error);
    }
  };

  const getCartQuantity = () => {
    if (cartItems[productId] && cartItems[productId][selectedColor]) {
      return cartItems[productId][selectedColor];
    }
    return 0;
  };

  const currentQuantity = getCartQuantity();
  const isInCart = currentQuantity > 0;

  const currentImage = productData?.imagesByColor?.[selectedColor] ||
    productData?.imagesByColor?.get?.(selectedColor);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(productId, selectedColor, 1);
    } catch (error) {
      // To Do
    }
  };

  const handleQuantityChange = async (change) => {
    if (!token) {
      toast.error('Please login to update cart');
      return;
    }

    const newQuantity = currentQuantity + change;
    try {
      await updateCartItemQuantity(productId, selectedColor, newQuantity);


    } catch (error) {
      toast.error('Failed to update cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The product you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/catalogue')}
            className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors mr-4"
          >
            Browse Products
          </button>
          <button
            onClick={() => navigate('/')}
            className="bg-orange-400 text-white px-6 py-3 rounded-lg hover:bg-orange-500 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-10 border-t border-t-gray-300">
      {/* Main Product Section */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="relative">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              {currentImage ? (
                <img
                  className="w-full h-full object-cover"
                  src={currentImage}
                  alt={productData.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                  No image available
                </div>
              )}


              {productData.bestseller && (
                <div className="absolute top-4 left-4 bg-orange-400 text-white px-3 py-1 text-sm font-semibold rounded-2xl shadow-sm">
                  BESTSELLER
                </div>
              )}
            </div>
          </div>


          <div >
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {productData.name}
              </h1>
              <p className="text-sm text-gray-500 mt-1 mb-3">
                {productData.category}
              </p>
            </div>


            <div className="border-t border-gray-200 pt-6">
              <p className="text-3xl font-bold text-gray-900">
                {currency}{productData.price}
              </p>
            </div>


            {productData.availableColors && productData.availableColors.length > 0 && (
              <div className="pt-3">
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">
                    {selectedColor}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    {productData.availableColors.map((color, index) => {
                      const colorImage = productData?.imagesByColor?.[color] ||
                        productData?.imagesByColor?.get?.(color);

                      return (
                        <div
                          key={index}
                          onClick={() => setSelectedColor(color)}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg border-2 cursor-pointer transition-all duration-200 overflow-hidden ${selectedColor === color
                            ? 'border-gray-800 ring-2 ring-gray-400 scale-105'
                            : 'border-gray-300 hover:border-gray-400'
                            }`}
                        >
                          {colorImage ? (
                            <img
                              src={colorImage}
                              alt={`${productData.name} in ${color}`}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextElementSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}

                          <div
                            className="w-full h-full flex items-center justify-center text-xs font-medium text-gray-700"
                            style={{
                              display: colorImage ? 'none' : 'flex',
                              backgroundColor: `#${getColorHex(color)}`,
                              color: color === 'White' || color === 'Gray' ? '#374151' : '#ffffff'
                            }}
                          >
                            {color}
                          </div>


                          <div className="sr-only">{color}</div>
                        </div>
                      );
                    })}
                  </div>

                </div>
              </div>
            )}


            <div className="border-t border-gray-200 pt-6 mb-2">
              {!isInCart ? (
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    handleAddToCart()
                  }}
                  className="w-full bg-gray-900 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-orange-400 transition-colors duration-200 active:scale-95 transform"
                >
                  Add to Cart
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-center">

                  <div className="flex items-center justify-between sm:justify-start bg-gray-100 rounded-lg p-3 sm:p-2 max-w-[200px] mx-auto sm:mx-0 sm:flex-shrink-0 sm:w-auto">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200 active:scale-95 transform"
                    >
                      <span className="text-gray-600 font-medium text-xl leading-none">−</span>
                    </button>
                    <span className="px-4 py-2 text-lg font-semibold text-gray-900 min-w-[3rem] text-center">
                      {currentQuantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors duration-200 active:scale-95 transform"
                    >
                      <span className="text-gray-600 font-medium text-xl leading-none">+</span>
                    </button>
                  </div>


                  <button
                    onClick={() => navigate('/cart')}
                    className="w-full sm:flex-1 bg-orange-400 text-white py-4 px-8 rounded-lg font-bold text-lg hover:bg-orange-500 transition-colors duration-200 min-h-[48px]"
                  >
                    View Cart
                  </button>
                </div>

              )}
            </div>


            <div className="border-t border-gray-200 pt-4">
              <p className='text-lg '>Description</p>
              <div className="">

                <p className="text-gray-700 text-md leading-relaxed">
                  {productData.description}
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>


      <section className="max-w-6xl mx-auto px-4 py-8 border-t border-gray-200 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Policies</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-6 text-center">
                <img
                  src={assets.quality_icon}
                  alt="Quality"
                  className="w-12 h-12"
                />
                <p className="text-gray-700 font-semibold text-sm">
                  High Quality 3D Prints
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-6 text-center">
                <img
                  src={assets.fastforward}
                  alt="FastForward"
                  className="w-12 h-12"
                />
                <p className="text-gray-700 font-semibold text-sm">
                  Fast-Forward Processing of Orders
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-6 text-center">
                <img
                  src={assets.moneysaving}
                  alt="Saving"
                  className="w-12 h-12"
                />
                <p className="text-gray-700 font-semibold text-sm">
                  Most Affordable Pricing
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-6 text-center">
                <img
                  src={assets.support_img}
                  alt="Support"
                  className="w-12 h-12"
                />
                <p className="text-gray-700 font-semibold text-sm">
                  Contact us at Ease
                </p>
              </div>
            </div>
          </div>


          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">FAQs</h2>
            <div className="space-y-4">

              <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => toggleFAQ(1)}
                  className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                >
                  How long does Delivery take?
                  <img
                    src={assets.dropdown_icon}
                    alt="Toggle"
                    className={`w-3 transition-transform duration-300 ${openIndex === 1 ? "rotate-270" : "rotate-90"}`}
                  />
                </button>
                {openIndex === 1 && (
                  <div className="px-5 pb-4 text-gray-600">
                    <p>Orders are usually delivered within 5–7 working days, depending on your location.</p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => toggleFAQ(2)}
                  className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                >
                  Can I cancel my Order once Placed?
                  <img
                    src={assets.dropdown_icon}
                    alt="Toggle"
                    className={`w-3 transition-transform duration-300 ${openIndex === 2 ? "rotate-270" : "rotate-90"}`}
                  />
                </button>
                {openIndex === 2 && (
                  <div className="px-5 pb-4 text-gray-600">
                    <p>To cancel your order, you must call us at +91 96648 51323 (as listed in the Contact section). If order processing has not yet begun, we may provide a refund. For refunds, please email us your bank account or UPI details along with your Order ID.</p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => toggleFAQ(3)}
                  className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                >
                  How long does Order Processing takes?
                  <img
                    src={assets.dropdown_icon}
                    alt="Toggle"
                    className={`w-3 transition-transform duration-300 ${openIndex === 3 ? "rotate-270" : "rotate-90"}`}
                  />
                </button>
                {openIndex === 3 && (
                  <div className="px-5 pb-4 text-gray-600">
                    <p>Order processing begins within 24–48 hours of order placement. You will receive an email notification when processing starts.</p>
                  </div>
                )}
              </div>

              <div className="border border-gray-200 rounded-xl bg-white shadow-sm">
                <button
                  onClick={() => toggleFAQ(4)}
                  className="w-full flex justify-between items-center text-left font-medium text-gray-800 px-5 py-4"
                >
                  How to add information for Customizable items?
                  <img
                    src={assets.dropdown_icon}
                    alt="Toggle"
                    className={`w-3 transition-transform duration-300 ${openIndex === 4 ? "rotate-270" : "rotate-90"}`}
                  />
                </button>
                {openIndex === 4 && (
                  <div className="px-5 pb-4 text-gray-600">
                    <p>At checkout, enter the text to be printed in the Info field. For multiple items, format it as "Product_Name - Text_to_be_printed".</p>
                  </div>
                )}
              </div>


            </div>
          </div>
        </div>
      </section>


      {relatedProducts.length > 0 && (
        <div className="mx-auto  border-t border-gray-200 pt-8">
          <div className="text-left py-2 text-xl mb-8">
            <h2 className="delius-unicase-regular text-md sm:text-lg lg:text-xl font-normal text-gray-700">
              RELATED PRODUCTS
            </h2>
            <hr className="w-16 border-none h-[2px] sm:h-[2px] bg-gray-500 ml-36" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 gap-y-6">
            {relatedProducts.map((item, index) => (
              <ProductItems
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                product={item}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const getColorHex = (colorName) => {
  const colorMap = {
    'Black': '000000',
    'Gray': '6B7280',
    'Red': 'EF4444',
    'Orange': 'F97316',
    'White': 'FFFFFF'
  };
  return colorMap[colorName] || '000000';
};

export default Product;

