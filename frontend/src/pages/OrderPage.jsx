/**
 * OrderPage Component (Task 2 & Protected Route)
 *
 * Facilitates custom order creation for authenticated customers.
 *
 * Implements form state management with useState:
 * - selectedRestaurant (state 1)
 * - itemName (state 2)
 * - quantity (state 3)
 * - unitPrice (state 4)
 * - deliveryAddress (state 5)
 * - cartItems (state 6)
 *
 * Real-time reactive updates:
 * - Live Order Summary preview calculating subtotal, packaging fee, delivery fee, and grand total.
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
  PackageCheck
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
          // Default to first open restaurant if none selected
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
          message: 'Order created and persisted successfully in MongoDB (HTTP 201 Created)!',
          orderId: response.data.data._id
        });
        setSubmitting(false);
        // Refresh customer orders list
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-500/10 text-orange-400 text-xs font-semibold uppercase tracking-wider mb-2">
          Protected Customer Route
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Create & Place Food Order
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Logged in as <span className="text-white font-semibold">{customer?.name}</span> ({customer?.email}).
        </p>
      </div>

      {/* Main Grid: Order Form (Left) & Reactive Order Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container (8 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <ShoppingBag className="w-5 h-5 text-orange-400" />
            <h2 className="text-xl font-bold text-white">Order Details Form</h2>
          </div>

          {/* Success Banner */}
          {submitSuccess && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-200">
                <p className="font-semibold">{submitSuccess.message}</p>
                <p className="text-xs text-emerald-300/80 font-mono mt-0.5">
                  Order ID: {submitSuccess.orderId}
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {submitError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-sm text-rose-200">
                <p className="font-semibold">Order Placement Error</p>
                <p className="text-xs text-rose-300/80">{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-5">
            {/* Field 1: Selected Restaurant (State 1) */}
            <div className="space-y-2">
              <label htmlFor="order-restaurant-select" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                1. Select Restaurant *
              </label>
              <div className="relative">
                <select
                  id="order-restaurant-select"
                  value={selectedRestaurantId}
                  onChange={(e) => handleRestaurantChange(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                >
                  <option value="" disabled>-- Select a Campus Eatery --</option>
                  {restaurantsList.map((rest) => (
                    <option key={rest._id} value={rest._id}>
                      {rest.name} ({rest.cuisine}) {rest.isOpen ? '— [Open Now]' : '— [Closed]'}
                    </option>
                  ))}
                </select>
              </div>
              {currentRestaurant && !currentRestaurant.isOpen && (
                <p className="text-xs text-rose-400 font-medium">
                  Notice: This restaurant is currently marked as Closed.
                </p>
              )}
            </div>

            {/* Quick Menu Selection Tags if available */}
            {currentRestaurant?.menu && currentRestaurant.menu.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Popular Menu Shortcuts for {currentRestaurant.name}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentRestaurant.menu.map((menuItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectMenuItem(menuItem)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        itemName === menuItem.name
                          ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
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
              <div className="sm:col-span-8 space-y-2">
                <label htmlFor="order-item-name" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  2. Food Item Name *
                </label>
                <input
                  id="order-item-name"
                  type="text"
                  placeholder="e.g. Margherita Pizza, Veg Dimsums..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>

              <div className="sm:col-span-4 space-y-2">
                <label htmlFor="order-unit-price" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Unit Price (₹) *
                </label>
                <input
                  id="order-unit-price"
                  type="number"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            {/* Field 4: Quantity Stepper */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                3. Quantity *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center text-lg font-bold text-white bg-slate-950 py-2.5 rounded-xl border border-slate-800">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-xs text-slate-400 ml-2">
                  Subtotal: ₹{itemSubtotal}
                </span>
              </div>
            </div>

            {/* Field 5: Delivery Address */}
            <div className="space-y-2">
              <label htmlFor="order-delivery-address" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                4. Delivery Address & Campus Location *
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-slate-500">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  id="order-delivery-address"
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Hostel Block A, Room 302 / CSPIT IT Dept"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-order-button"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-lg shadow-orange-500/25 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <LoadingSpinner message="Validating & saving order in MongoDB..." />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Confirm and Place Order (₹{grandTotal})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Reactive Order Summary Preview (Right 5 Cols - Task 2) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5 sticky top-24">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Receipt className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-bold text-white">Live Reactive Summary</h3>
            </div>

            <div className="space-y-4 text-sm">
              {/* Selected Restaurant Display */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Selected Restaurant
                </span>
                <span className="font-bold text-white text-base">
                  {currentRestaurant?.name || 'No restaurant selected'}
                </span>
                <span className="text-xs text-orange-400 block">
                  {currentRestaurant?.cuisine || '—'}
                </span>
              </div>

              {/* Selected Items Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Order Items Breakdown
                </span>
                <div className="flex items-center justify-between text-slate-300 text-xs py-1 border-b border-slate-800/60">
                  <span className="font-medium">{itemName || '—'} × {quantity}</span>
                  <span className="font-mono font-semibold">₹{itemSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-xs py-1 border-b border-slate-800/60">
                  <span>Standard Campus Delivery Fee</span>
                  <span className="font-mono font-semibold">₹{deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400 text-xs py-1 border-b border-slate-800/60">
                  <span>GST (5%)</span>
                  <span className="font-mono font-semibold">₹{taxAmount}</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-base font-extrabold text-white">Total Amount Due</span>
                <span className="text-2xl font-black text-orange-400 font-mono">₹{grandTotal}</span>
              </div>

              {/* Target Delivery Location Display */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs space-y-1">
                <span className="text-slate-500 font-semibold block uppercase text-[10px]">
                  Delivering To:
                </span>
                <p className="text-slate-300 line-clamp-2">
                  {deliveryAddress || 'No address provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Orders History Section (GET /api/v1/orders with Mongoose Population) */}
      <section className="space-y-6 pt-6 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-orange-400" />
            <h2 className="text-2xl font-bold text-white">Your Order History</h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {customerOrders.length} records populated
          </span>
        </div>

        {ordersLoading ? (
          <LoadingSpinner message="Retrieving customer order history from database..." />
        ) : customerOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {order.restaurantId?.name || 'Restaurant Record'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {order.restaurantId?.cuisine} · {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : order.status === 'preparing'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        : order.status === 'cancelled'
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.name} × {it.quantity}</span>
                      <span className="font-mono">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Customer: {order.customerId?.name}</span>
                  <span className="font-bold text-orange-400 font-mono text-sm">
                    Total: ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            No orders placed yet. Submit the form above to place your first QuickBite order!
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderPage;
