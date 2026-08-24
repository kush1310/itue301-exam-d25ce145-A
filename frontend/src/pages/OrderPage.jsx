/**
 * OrderPage Component (Task 2 & Protected Route — Zomato Design System)
 *
 * Facilitates custom order creation for authenticated customers.
 *
 * Implements form state management with useState:
 * - selectedRestaurant (state 1)
 * - itemName (state 2)
 * - quantity (state 3)
 * - unitPrice (state 4)
 * - deliveryAddress (state 5)
 *
 * Real-time reactive updates:
 * - Live Order Summary preview calculating subtotal, packaging fee, 5% GST, and grand total.
 * - Dynamic display of selected restaurant menu suggestions.
 * - History of previous orders fetched via GET /api/v1/orders.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShoppingBag,
  Store,
  MapPin,
  Plus,
  Minus,
  CheckCircle,
  AlertCircle,
  Receipt,
  Clock,
  Send,
  PackageCheck,
  Utensils
} from 'lucide-react';

const OrderPage = () => {
  const { customer } = useAuth();
  const [searchParams] = useSearchParams();

  // Task 2: Form state variables managed with useState
  const [restaurantsList, setRestaurantsList] = useState([]);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(searchParams.get('restaurantId') || '');
  const [itemName, setItemName] = useState('Margherita Woodfired Pizza');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(280);
  const [deliveryAddress, setDeliveryAddress] = useState(
    customer?.address || 'Hostel Block A, Room 302, CHARUSAT Campus, Changa'
  );

  // Submission & History States
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Load available restaurants for selection dropdown
  useEffect(() => {
    axios
      .get('/api/v1/restaurants')
      .then((res) => {
        if (res.data && res.data.success) {
          const list = res.data.data;
          setRestaurantsList(list);
          if (!selectedRestaurantId && list.length > 0) {
            const firstOpen = list.find((r) => r.isOpen) || list[0];
            setSelectedRestaurantId(firstOpen._id);
          }
        }
      })
      .catch((err) => console.error('[ORDER_PAGE_LOAD_ERROR]', err));
  }, []);

  // Fetch previous orders for the logged-in customer
  const fetchCustomerOrders = () => {
    setOrdersLoading(true);
    axios
      .get('/api/v1/orders')
      .then((res) => {
        if (res.data && res.data.success) {
          setCustomerOrders(res.data.data);
        }
        setOrdersLoading(false);
      })
      .catch((err) => {
        console.error('[FETCH_ORDERS_ERROR]', err);
        setOrdersLoading(false);
      });
  };

  useEffect(() => {
    fetchCustomerOrders();
  }, []);

  // Compute currently selected restaurant object
  const currentRestaurant = restaurantsList.find((r) => r._id === selectedRestaurantId);

  // Whenever restaurant changes, update default item if menu exists
  const handleRestaurantChange = (newRestaurantId) => {
    setSelectedRestaurantId(newRestaurantId);
    const target = restaurantsList.find((r) => r._id === newRestaurantId);
    if (target && target.menu && target.menu.length > 0) {
      setItemName(target.menu[0].name);
      setUnitPrice(target.menu[0].price);
    }
  };

  // Select quick item from current restaurant's menu
  const handleSelectMenuItem = (item) => {
    setItemName(item.name);
    setUnitPrice(item.price);
  };

  // Meaningful live reactive calculations (Displaying entered/selected values dynamically)
  const itemSubtotal = quantity * unitPrice;
  const deliveryFee = 30;
  const taxAmount = Math.round(itemSubtotal * 0.05); // 5% GST
  const grandTotal = itemSubtotal + deliveryFee + taxAmount;

  /**
   * handleOrderSubmit
   * Dispatches POST /api/v1/orders with JWT Bearer auth
   */
  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    if (!selectedRestaurantId) {
      setSubmitError('Please select a restaurant to place an order.');
      setSubmitting(false);
      return;
    }

    if (!itemName || itemName.trim() === '') {
      setSubmitError('Please enter or select a valid food item name.');
      setSubmitting(false);
      return;
    }

    if (quantity < 1) {
      setSubmitError('Quantity must be at least 1.');
      setSubmitting(false);
      return;
    }

    const payload = {
      restaurantId: selectedRestaurantId,
      items: [
        {
          name: itemName.trim(),
          quantity: Number(quantity),
          price: Number(unitPrice)
        }
      ],
      totalAmount: grandTotal,
      deliveryAddress: deliveryAddress.trim(),
      status: 'pending'
    };

    try {
      const response = await axios.post('/api/v1/orders', payload);
      if (response.data && response.data.success) {
        setSubmitSuccess({
          message: 'Order placed and saved successfully in MongoDB (HTTP 201 Created)!',
          orderId: response.data.data._id
        });
        setSubmitting(false);
        fetchCustomerOrders();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error?.message ||
        'Failed to create order. Please check validation rules.';
      setSubmitError(errorMessage);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="border-b border-[#f4f4f2] pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2f2] text-[#cb202d] text-[12px] font-bold uppercase tracking-wider mb-2 border border-[#fecaca]">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Protected Customer Route</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2d2d2d] tracking-tight">
            Checkout & Food Ordering Form
          </h1>
          <p className="text-[14px] text-[#828282] font-medium mt-1">
            Placing order for <span className="text-[#2d2d2d] font-bold">{customer?.name}</span> ({customer?.email}).
          </p>
        </div>

        <div className="px-4 py-2 rounded-[12px] bg-white border border-[#e8e8e8] text-[12px] font-bold text-[#2d2d2d] shadow-xs">
          Role: <span className="text-[#cb202d] font-extrabold">{customer?.role || 'Customer'}</span>
        </div>
      </div>

      {/* Main Grid: Order Form (Left 7 Cols) & Reactive Summary (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white border border-[#f4f4f2] hover:border-[#e8e8e8] rounded-[16px] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-[#f4f4f2] pb-4">
            <Utensils className="w-5 h-5 text-[#cb202d]" />
            <h2 className="text-[18px] font-bold text-[#2d2d2d]">Configure Food Items</h2>
          </div>

          {/* Success Banner */}
          {submitSuccess && (
            <div className="p-4 rounded-[12px] bg-[#edf7ed] border border-[#c8e6c9] flex items-start gap-3 shadow-xs">
              <CheckCircle className="w-5 h-5 text-[#24963f] shrink-0 mt-0.5" />
              <div className="text-[13px] text-[#24963f]">
                <p className="font-bold">{submitSuccess.message}</p>
                <p className="text-[11px] text-[#24963f]/80 font-mono mt-0.5">
                  Order ID: #{submitSuccess.orderId}
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {submitError && (
            <div className="p-4 rounded-[12px] bg-[#fef2f2] border border-[#fecaca] flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-[#cb202d] shrink-0 mt-0.5" />
              <div className="text-[13px] text-[#cb202d]">
                <p className="font-bold">Validation Error</p>
                <p className="text-[11px] text-[#cb202d]/80">{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-5">
            {/* Field 1: Selected Restaurant (State 1) */}
            <div className="space-y-1.5">
              <label htmlFor="order-restaurant-select" className="block text-[12px] font-bold text-[#2d2d2d] uppercase tracking-wider">
                1. Select Campus Restaurant *
              </label>
              <select
                id="order-restaurant-select"
                value={selectedRestaurantId}
                onChange={(e) => handleRestaurantChange(e.target.value)}
                className="w-full px-4 py-3 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[12px] text-[#2d2d2d] text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d] shadow-xs"
                required
              >
                <option value="" disabled>-- Select a Campus Restaurant --</option>
                {restaurantsList.map((rest) => (
                  <option key={rest._id} value={rest._id}>
                    {rest.name} ({rest.cuisine}) {rest.isOpen ? '— [Open Now]' : '— [Closed]'}
                  </option>
                ))}
              </select>
              {currentRestaurant && !currentRestaurant.isOpen && (
                <p className="text-[12px] text-[#cb202d] font-semibold">
                  Notice: This restaurant is marked as Closed.
                </p>
              )}
            </div>

            {/* Quick Menu Selection Chips */}
            {currentRestaurant?.menu && currentRestaurant.menu.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-[#828282] uppercase tracking-wider">
                  Menu Shortcuts for {currentRestaurant.name}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentRestaurant.menu.map((menuItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectMenuItem(menuItem)}
                      className={`px-3 py-1.5 rounded-[8px] text-[12px] font-bold border transition-all ${
                        itemName === menuItem.name
                          ? 'bg-[#fef2f2] text-[#cb202d] border-[#fecaca] shadow-xs'
                          : 'bg-white text-[#2d2d2d] border-[#e8e8e8] hover:border-[#cb202d]/40'
                      }`}
                    >
                      {menuItem.name} — ₹{menuItem.price}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Field 2 & 3: Item Name and Unit Price */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              <div className="sm:col-span-8 space-y-1.5">
                <label htmlFor="order-item-name" className="block text-[12px] font-bold text-[#2d2d2d] uppercase tracking-wider">
                  2. Food Item Name *
                </label>
                <input
                  id="order-item-name"
                  type="text"
                  placeholder="e.g. Margherita Pizza, Veg Dimsums..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[12px] text-[#2d2d2d] text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d] shadow-xs"
                  required
                />
              </div>

              <div className="sm:col-span-4 space-y-1.5">
                <label htmlFor="order-unit-price" className="block text-[12px] font-bold text-[#2d2d2d] uppercase tracking-wider">
                  Price (₹) *
                </label>
                <input
                  id="order-unit-price"
                  type="number"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[12px] text-[#2d2d2d] text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d] shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Field 4: Quantity Stepper */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-bold text-[#2d2d2d] uppercase tracking-wider">
                3. Quantity *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-2.5 rounded-[8px] bg-[#f4f4f2] text-[#2d2d2d] hover:bg-[#e8e8e8] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-14 text-center text-[16px] font-black text-[#2d2d2d] bg-[#f4f4f2] py-2 rounded-[8px] border border-[#e8e8e8]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-2.5 rounded-[8px] bg-[#f4f4f2] text-[#2d2d2d] hover:bg-[#e8e8e8] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-[13px] font-bold text-[#828282] ml-2">
                  Item Subtotal: ₹{itemSubtotal}
                </span>
              </div>
            </div>

            {/* Field 5: Delivery Address */}
            <div className="space-y-1.5">
              <label htmlFor="order-delivery-address" className="block text-[12px] font-bold text-[#2d2d2d] uppercase tracking-wider">
                4. Campus Delivery Address *
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3.5 text-[#828282]">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  id="order-delivery-address"
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Hostel Block A, Room 302 / CSPIT IT Dept"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[12px] text-[#2d2d2d] text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d] shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-order-button"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-[12px] font-bold text-white bg-[#cb202d] hover:bg-[#a81723] shadow-lg shadow-[#cb202d]/20 transition-all disabled:opacity-50 text-[14px]"
            >
              {submitting ? (
                <LoadingSpinner message="Validating and placing order in MongoDB..." />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Place Order (₹{grandTotal})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Reactive Order Summary (Right 5 Cols - Task 2) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-[#f4f4f2] rounded-[16px] p-6 shadow-xs space-y-5 sticky top-24">
            <div className="flex items-center gap-2 border-b border-[#f4f4f2] pb-3">
              <Receipt className="w-5 h-5 text-[#cb202d]" />
              <h3 className="text-[17px] font-bold text-[#2d2d2d]">Order Summary</h3>
            </div>

            <div className="space-y-4 text-[14px]">
              {/* Selected Restaurant Display */}
              <div className="p-3.5 rounded-[12px] bg-[#f4f4f2] border border-[#e8e8e8] space-y-1">
                <span className="text-[11px] font-bold text-[#828282] uppercase tracking-wider block">
                  Restaurant
                </span>
                <span className="font-bold text-[#2d2d2d] text-[15px] block">
                  {currentRestaurant?.name || 'No restaurant selected'}
                </span>
                <span className="text-[12px] text-[#828282] block">
                  {currentRestaurant?.cuisine || '—'}
                </span>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#828282] uppercase tracking-wider block">
                  Bill Summary
                </span>
                <div className="flex items-center justify-between text-[#2d2d2d] text-[13px] py-1 border-b border-[#f4f4f2]">
                  <span className="font-semibold">{itemName || '—'} × {quantity}</span>
                  <span className="font-mono font-bold">₹{itemSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-[#828282] text-[13px] py-1 border-b border-[#f4f4f2]">
                  <span>Delivery Charge</span>
                  <span className="font-mono font-semibold">₹{deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between text-[#828282] text-[13px] py-1 border-b border-[#f4f4f2]">
                  <span>GST (5%)</span>
                  <span className="font-mono font-semibold">₹{taxAmount}</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[16px] font-extrabold text-[#2d2d2d]">To Pay</span>
                <span className="text-2xl font-black text-[#cb202d] font-mono">₹{grandTotal}</span>
              </div>

              {/* Delivery Destination */}
              <div className="p-3 rounded-[12px] bg-[#f4f4f2] text-[12px] space-y-0.5">
                <span className="text-[#828282] font-bold block uppercase text-[10px]">
                  Delivering To:
                </span>
                <p className="text-[#2d2d2d] font-medium line-clamp-2">
                  {deliveryAddress || 'No address provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Orders History Section */}
      <section className="space-y-5 pt-6 border-t border-[#f4f4f2]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-[#cb202d]" />
            <h2 className="text-[20px] font-bold text-[#2d2d2d]">Your Previous Orders</h2>
          </div>
          <span className="text-[12px] font-bold text-[#828282] font-mono">
            {customerOrders.length} orders
          </span>
        </div>

        {ordersLoading ? (
          <LoadingSpinner message="Retrieving orders from MongoDB..." />
        ) : customerOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-[#2d2d2d] text-[15px]">
                      {order.restaurantId?.name || 'Restaurant Record'}
                    </h3>
                    <p className="text-[12px] text-[#828282] font-medium">
                      {order.restaurantId?.cuisine} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      order.status === 'delivered'
                        ? 'bg-[#edf7ed] text-[#24963f] border border-[#c8e6c9]'
                        : order.status === 'preparing'
                        ? 'bg-[#fff8e1] text-[#f57f17] border border-[#ffe082]'
                        : order.status === 'cancelled'
                        ? 'bg-[#fef2f2] text-[#cb202d] border border-[#fecaca]'
                        : 'bg-[#e3f2fd] text-[#1976d2] border border-[#bbdefb]'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 text-[13px] text-[#2d2d2d] font-medium">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.name} × {it.quantity}</span>
                      <span className="font-mono font-semibold">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-[#f4f4f2] flex items-center justify-between text-[12px] font-semibold">
                  <span className="text-[#828282]">Customer: {order.customerId?.name}</span>
                  <span className="font-bold text-[#cb202d] font-mono text-[14px]">
                    Paid: ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-[16px] border border-[#f4f4f2] text-[#828282] text-[14px] font-medium shadow-xs">
            No orders placed yet. Select a restaurant and place your first meal above!
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderPage;
