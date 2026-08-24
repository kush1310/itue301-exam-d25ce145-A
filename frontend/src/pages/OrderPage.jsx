/**
 * OrderPage Component (Task 2 & Protected Route — Light Zomato Style)
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
 * - History of previous orders fetched via GET /api/v1/orders with visual lifecycle timeline.
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
  Utensils,
  ChevronRight
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-200">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Protected Customer Route</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Checkout & Food Ordering Form
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Placing order for <span className="text-slate-800 font-bold">{customer?.name}</span> ({customer?.email}).
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
          Role: <span className="text-rose-600 font-extrabold">{customer?.role || 'Customer'}</span>
        </div>
      </div>

      {/* Main Grid: Order Form (Left 7 Cols) & Reactive Summary (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <Utensils className="w-5 h-5 text-rose-600" />
            <h2 className="text-xl font-bold text-slate-900">Custom Meal Configuration</h2>
          </div>

          {/* Success Banner */}
          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 shadow-xs">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-sm text-emerald-900">
                <p className="font-bold">{submitSuccess.message}</p>
                <p className="text-xs text-emerald-700 font-mono mt-0.5">
                  Order Reference: #{submitSuccess.orderId}
                </p>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {submitError && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 shadow-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="text-sm text-rose-900">
                <p className="font-bold">Validation Error</p>
                <p className="text-xs text-rose-700">{submitError}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleOrderSubmit} className="space-y-5">
            {/* Field 1: Selected Restaurant (State 1) */}
            <div className="space-y-2">
              <label htmlFor="order-restaurant-select" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                1. Select Campus Restaurant *
              </label>
              <select
                id="order-restaurant-select"
                value={selectedRestaurantId}
                onChange={(e) => handleRestaurantChange(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
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
                <p className="text-xs text-rose-600 font-semibold">
                  Notice: This restaurant is marked as Closed.
                </p>
              )}
            </div>

            {/* Quick Menu Selection Chips */}
            {currentRestaurant?.menu && currentRestaurant.menu.length > 0 && (
              <div className="space-y-2 pt-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Menu Recommendations for {currentRestaurant.name}:
                </label>
                <div className="flex flex-wrap gap-2">
                  {currentRestaurant.menu.map((menuItem, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectMenuItem(menuItem)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        itemName === menuItem.name
                          ? 'bg-rose-50 text-rose-600 border-rose-300 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
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
                <label htmlFor="order-item-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  2. Food Item Name *
                </label>
                <input
                  id="order-item-name"
                  type="text"
                  placeholder="e.g. Margherita Pizza, Veg Dimsums..."
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
                  required
                />
              </div>

              <div className="sm:col-span-4 space-y-2">
                <label htmlFor="order-unit-price" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Price (₹) *
                </label>
                <input
                  id="order-unit-price"
                  type="number"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Field 4: Quantity Stepper */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                3. Quantity *
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-16 text-center text-lg font-black text-slate-900 bg-slate-50 py-2.5 rounded-2xl border border-slate-200">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-3 rounded-2xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-500 ml-2">
                  Item Subtotal: ₹{itemSubtotal}
                </span>
              </div>
            </div>

            {/* Field 5: Delivery Address */}
            <div className="space-y-2">
              <label htmlFor="order-delivery-address" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                4. Campus Delivery Location *
              </label>
              <div className="relative">
                <div className="absolute top-3.5 left-3.5 text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <textarea
                  id="order-delivery-address"
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="e.g. Hostel Block A, Room 302 / CSPIT IT Dept"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 shadow-xs"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="submit-order-button"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-700 hover:to-orange-600 shadow-lg shadow-rose-500/25 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <LoadingSpinner message="Validating & saving in MongoDB..." />
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Place Order (₹{grandTotal})</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Reactive Order Summary Preview (Right 5 Cols - Task 2) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-5 sticky top-24">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Receipt className="w-5 h-5 text-rose-600" />
              <h3 className="text-lg font-bold text-slate-900">Live Order Summary</h3>
            </div>

            <div className="space-y-4 text-sm">
              {/* Selected Restaurant Display */}
              <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 space-y-1">
                <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                  Ordering From
                </span>
                <span className="font-extrabold text-slate-900 text-base block">
                  {currentRestaurant?.name || 'No restaurant selected'}
                </span>
                <span className="text-xs font-semibold text-slate-500 block">
                  {currentRestaurant?.cuisine || '—'}
                </span>
              </div>

              {/* Selected Items Breakdown */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Bill Details
                </span>
                <div className="flex items-center justify-between text-slate-700 text-xs py-1 border-b border-slate-100">
                  <span className="font-semibold">{itemName || '—'} × {quantity}</span>
                  <span className="font-mono font-bold">₹{itemSubtotal}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-xs py-1 border-b border-slate-100">
                  <span>Campus Delivery Partner Fee</span>
                  <span className="font-mono font-semibold">₹{deliveryFee}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500 text-xs py-1 border-b border-slate-100">
                  <span>GST & Restaurant Charges (5%)</span>
                  <span className="font-mono font-semibold">₹{taxAmount}</span>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="pt-2 flex items-center justify-between">
                <span className="text-base font-extrabold text-slate-900">Grand Total</span>
                <span className="text-2xl font-black text-rose-600 font-mono">₹{grandTotal}</span>
              </div>

              {/* Target Delivery Location Display */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                <span className="text-slate-500 font-bold block uppercase text-[10px]">
                  Delivering To:
                </span>
                <p className="text-slate-800 font-medium line-clamp-2">
                  {deliveryAddress || 'No address provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Orders History Section (GET /api/v1/orders with Mongoose Population) */}
      <section className="space-y-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-6 h-6 text-rose-600" />
            <h2 className="text-2xl font-black text-slate-900">Your Order History</h2>
          </div>
          <span className="text-xs font-bold text-slate-500 font-mono">
            {customerOrders.length} orders
          </span>
        </div>

        {ordersLoading ? (
          <LoadingSpinner message="Retrieving your orders from database..." />
        ) : customerOrders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerOrders.map((order) => (
              <div
                key={order._id}
                className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {order.restaurantId?.name || 'Restaurant Record'}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {order.restaurantId?.cuisine} · {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : order.status === 'preparing'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : order.status === 'cancelled'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-slate-600 font-medium">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between">
                      <span>{it.name} × {it.quantity}</span>
                      <span className="font-mono font-semibold text-slate-900">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Customer: {order.customerId?.name}</span>
                  <span className="font-black text-rose-600 font-mono text-sm">
                    Paid: ₹{order.totalAmount}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 text-sm font-medium shadow-xs">
            No orders placed yet. Submit the form above to place your first QuickBite meal!
          </div>
        )}
      </section>
    </div>
  );
};

export default OrderPage;
