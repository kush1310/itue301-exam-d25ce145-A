/**
 * OwnerPortal Component (Dedicated Restaurant & Canteen Management)
 *
 * Provides comprehensive portal controls for Restaurant Owners:
 * - Real-time canteen operational controls (Open/Closed toggle)
 * - Canteen-specific analytics (Revenue, Order count, Menu size)
 * - Menu management (Add new food item, remove food item)
 * - Incoming orders list with live status transition modifier
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Store,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
  Power,
  Utensils,
  DollarSign,
  PackageCheck,
  Tag
} from 'lucide-react';

const OwnerPortal = () => {
  const { customer } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New Menu Item Form States
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Main');
  const [addingItem, setAddingItem] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  // Order status modification state
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const statusOptions = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

  const fetchPortalData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Assigned Restaurant
      const restRes = await axios.get('/api/v1/restaurants/my-restaurant');
      if (restRes.data && restRes.data.success) {
        setRestaurant(restRes.data.data);
      }

      // 2. Fetch Canteen Orders
      const orderRes = await axios.get('/api/v1/orders');
      if (orderRes.data && orderRes.data.success) {
        setOrders(orderRes.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error('[OWNER_PORTAL_FETCH_ERROR]', err);
      setError(
        err.response?.data?.error?.message ||
          'Failed to load restaurant portal. Make sure you are logged in as a Restaurant Owner.'
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortalData();
  }, []);

  /**
   * handleToggleStatus
   * Toggles canteen operational status between Open and Closed in real time.
   */
  const handleToggleStatus = async () => {
    if (!restaurant) return;
    try {
      const res = await axios.patch(`/api/v1/restaurants/${restaurant._id}/toggle-status`, {
        isOpen: !restaurant.isOpen
      });
      if (res.data && res.data.success) {
        setRestaurant(res.data.data);
        setActionMessage({
          type: 'success',
          text: `Canteen is now marked as ${res.data.data.isOpen ? 'Open' : 'Closed'}.`
        });
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to toggle status.'
      });
    }
  };

  /**
   * handleAddMenuItem
   */
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    if (!newItemName || !newItemPrice) return;
    setAddingItem(true);
    setActionMessage(null);

    try {
      const res = await axios.post(`/api/v1/restaurants/${restaurant._id}/menu`, {
        name: newItemName,
        price: Number(newItemPrice),
        category: newItemCategory
      });
      if (res.data && res.data.success) {
        setRestaurant(res.data.data);
        setNewItemName('');
        setNewItemPrice('');
        setActionMessage({
          type: 'success',
          text: `Added '${newItemName}' to menu successfully.`
        });
      }
      setAddingItem(false);
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to add menu item.'
      });
      setAddingItem(false);
    }
  };

  /**
   * handleDeleteMenuItem
   */
  const handleDeleteMenuItem = async (itemId, itemName) => {
    if (!window.confirm(`Remove "${itemName}" from menu?`)) return;
    try {
      const res = await axios.delete(`/api/v1/restaurants/${restaurant._id}/menu/${itemId}`);
      if (res.data && res.data.success) {
        setRestaurant(res.data.data);
        setActionMessage({
          type: 'success',
          text: `Removed '${itemName}' from menu.`
        });
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to delete menu item.'
      });
    }
  };

  /**
   * handleOrderStatusUpdate
   */
  const handleOrderStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const res = await axios.patch(`/api/v1/orders/${orderId}/status`, {
        status: newStatus
      });
      if (res.data && res.data.success) {
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
        );
        setActionMessage({
          type: 'success',
          text: `Order status updated to '${newStatus}'.`
        });
      }
      setUpdatingOrderId(null);
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to update status.'
      });
      setUpdatingOrderId(null);
    }
  };

  const totalCanteenRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'pending' || o.status === 'preparing').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#f4f4f2] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2f2] text-[#cb202d] text-[12px] font-bold uppercase tracking-wider mb-2 border border-[#fecaca]">
            <Store className="w-3.5 h-3.5" />
            <span>Restaurant Owner Portal</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2d2d2d] tracking-tight">
            {restaurant ? restaurant.name : 'Canteen Management Hub'}
          </h1>
          <p className="text-[14px] text-[#828282] mt-1 font-medium">
            Managed by <span className="text-[#2d2d2d] font-bold">{customer?.name}</span> ({customer?.email})
          </p>
        </div>

        <button
          onClick={fetchPortalData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white border border-[#e8e8e8] text-[12px] font-bold text-[#2d2d2d] hover:border-[#cb202d] shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#cb202d]' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Action Notifications */}
      {actionMessage && (
        <div
          className={`p-3.5 rounded-[12px] border text-[13px] font-semibold flex items-center justify-between shadow-xs ${
            actionMessage.type === 'success'
              ? 'bg-[#edf7ed] border-[#c8e6c9] text-[#24963f]'
              : 'bg-[#fef2f2] border-[#fecaca] text-[#cb202d]'
          }`}
        >
          <span>{actionMessage.text}</span>
          <button
            onClick={() => setActionMessage(null)}
            className="text-xs font-bold hover:underline ml-4"
          >
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <LoadingSpinner message="Loading your canteen dashboard..." />
      ) : error ? (
        <div className="p-6 rounded-[16px] bg-[#fef2f2] border border-[#fecaca] text-[#cb202d] text-[14px] font-medium shadow-xs">
          {error}
        </div>
      ) : restaurant ? (
        <div className="space-y-8">
          {/* Canteen Analytics Row & Real-Time Operational Switch */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Operational Switch Card */}
            <div className="p-5 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-3 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#828282] uppercase tracking-wider">
                <span>Canteen Status</span>
                <Power className="w-4 h-4 text-[#cb202d]" />
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-[16px] font-bold ${
                    restaurant.isOpen ? 'text-[#24963f]' : 'text-[#cb202d]'
                  }`}
                >
                  {restaurant.isOpen ? 'Open for Orders' : 'Closed'}
                </span>
                <button
                  onClick={handleToggleStatus}
                  className={`px-3 py-1.5 rounded-[8px] text-[12px] font-bold transition-colors ${
                    restaurant.isOpen
                      ? 'bg-[#fef2f2] text-[#cb202d] border border-[#fecaca] hover:bg-[#cb202d] hover:text-white'
                      : 'bg-[#edf7ed] text-[#24963f] border border-[#c8e6c9] hover:bg-[#24963f] hover:text-white'
                  }`}
                >
                  {restaurant.isOpen ? 'Switch to Closed' : 'Open Canteen'}
                </button>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="p-5 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#828282] uppercase tracking-wider">
                <span>Canteen Revenue</span>
                <DollarSign className="w-4 h-4 text-[#24963f]" />
              </div>
              <div className="text-3xl font-black text-[#24963f] font-mono">
                ₹{totalCanteenRevenue}
              </div>
            </div>

            {/* Active Queue */}
            <div className="p-5 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#828282] uppercase tracking-wider">
                <span>Active Kitchen Orders</span>
                <Clock className="w-4 h-4 text-[#f57f17]" />
              </div>
              <div className="text-3xl font-black text-[#f57f17]">
                {activeOrdersCount}
              </div>
            </div>

            {/* Menu Items Count */}
            <div className="p-5 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-[#828282] uppercase tracking-wider">
                <span>Active Menu Items</span>
                <Utensils className="w-4 h-4 text-[#2d2d2d]" />
              </div>
              <div className="text-3xl font-black text-[#2d2d2d]">
                {restaurant.menu ? restaurant.menu.length : 0}
              </div>
            </div>
          </div>

          {/* Section 2: Menu Management & Add Food Item Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Menu Items List (7 cols) */}
            <div className="lg:col-span-7 bg-white border border-[#f4f4f2] rounded-[16px] p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#f4f4f2] pb-3">
                <h2 className="text-[17px] font-bold text-[#2d2d2d] flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#cb202d]" />
                  <span>Current Menu Catalog</span>
                </h2>
                <span className="text-[12px] font-bold text-[#828282]">
                  {restaurant.menu?.length || 0} items
                </span>
              </div>

              {restaurant.menu && restaurant.menu.length > 0 ? (
                <div className="divide-y divide-[#f4f4f2] max-h-[380px] overflow-y-auto pr-1">
                  {restaurant.menu.map((item) => (
                    <div
                      key={item._id}
                      className="py-3 flex items-center justify-between gap-3 group"
                    >
                      <div>
                        <span className="font-bold text-[#2d2d2d] text-[14px] block">
                          {item.name}
                        </span>
                        <span className="text-[11px] text-[#828282] font-semibold bg-[#f4f4f2] px-2 py-0.5 rounded-[4px]">
                          {item.category || 'Main'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-bold font-mono text-[#2d2d2d] text-[14px]">
                          ₹{item.price}
                        </span>
                        <button
                          onClick={() => handleDeleteMenuItem(item._id, item.name)}
                          title="Remove item from menu"
                          className="p-1.5 rounded-[6px] text-[#828282] hover:text-[#cb202d] hover:bg-[#fef2f2] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[13px] text-[#828282] py-4">No menu items configured.</p>
              )}
            </div>

            {/* Add New Food Item Form (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-[#f4f4f2] rounded-[16px] p-6 shadow-xs space-y-4">
              <h2 className="text-[17px] font-bold text-[#2d2d2d] flex items-center gap-2 border-b border-[#f4f4f2] pb-3">
                <Plus className="w-4 h-4 text-[#cb202d]" />
                <span>Add Food Item</span>
              </h2>

              <form onSubmit={handleAddMenuItem} className="space-y-3">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#2d2d2d] uppercase tracking-wider">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Cheese Garlic Bread"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[10px] text-[#2d2d2d] text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#2d2d2d] uppercase tracking-wider">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="e.g. 150"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[10px] text-[#2d2d2d] text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#2d2d2d] uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[10px] text-[#2d2d2d] text-[13px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d]"
                  >
                    <option value="Starters">Starters / Appetizers</option>
                    <option value="Main">Main Course</option>
                    <option value="Breads">Breads & Rotis</option>
                    <option value="Beverage">Beverages & Shakes</option>
                    <option value="Dessert">Desserts & Sweets</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={addingItem}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-[10px] font-bold text-white bg-[#cb202d] hover:bg-[#a81723] shadow-md shadow-[#cb202d]/20 transition-all text-[13px] mt-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>{addingItem ? 'Adding to Menu...' : 'Add to Menu'}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Section 3: Incoming Canteen Orders & Status Management */}
          <div className="bg-white border border-[#f4f4f2] rounded-[16px] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#f4f4f2] pb-3">
              <h2 className="text-[17px] font-bold text-[#2d2d2d] flex items-center gap-2">
                <PackageCheck className="w-4 h-4 text-[#cb202d]" />
                <span>Incoming Canteen Orders</span>
              </h2>
              <span className="text-[12px] font-bold text-[#828282]">
                {orders.length} orders received
              </span>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="p-4 rounded-[12px] bg-[#f4f4f2] border border-[#e8e8e8] flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#cb202d]">
                          #{order._id.substring(order._id.length - 8)}
                        </span>
                        <span className="font-bold text-[#2d2d2d] text-[14px]">
                          Customer: {order.customerId?.name} ({order.customerId?.phone || 'No phone'})
                        </span>
                      </div>
                      <div className="text-[12px] text-[#828282]">
                        Items: {order.items?.map((it) => `${it.name} (${it.quantity}x)`).join(', ')}
                      </div>
                      <div className="text-[12px] text-[#828282]">
                        Delivery To: {order.deliveryAddress}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-[#828282] uppercase font-bold block">
                          Total
                        </span>
                        <span className="font-mono font-bold text-[15px] text-[#cb202d]">
                          ₹{order.totalAmount}
                        </span>
                      </div>

                      <select
                        value={order.status}
                        disabled={updatingOrderId === order._id}
                        onChange={(e) => handleOrderStatusUpdate(order._id, e.target.value)}
                        className="px-3 py-1.5 bg-white border border-[#e8e8e8] rounded-[8px] text-[12px] font-bold text-[#2d2d2d] focus:ring-2 focus:ring-[#cb202d]/20 capitalize shadow-xs"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[13px] text-[#828282] py-4 text-center">
                No orders received for this canteen yet.
              </p>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default OwnerPortal;
