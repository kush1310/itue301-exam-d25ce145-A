/**
 * AdminPanel Component (Task 2: Lazy Loaded via React.lazy + Suspense)
 *
 * Provides central platform administration controls:
 * - Real-time inspection of all campus customer orders
 * - Status transition modification (PATCH /api/v1/orders/:id/status)
 * - Metric aggregation (Total Gross Volume, Pending Queue, Delivered Deliveries)
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Filter,
  DollarSign,
  Package,
  Layers
} from 'lucide-react';

const AdminPanel = () => {
  const { customer, isAuthenticated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [updateFeedback, setUpdateFeedback] = useState(null);

  const statusOptions = ['pending', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'];

  const fetchAllOrders = () => {
    setLoading(true);
    setError(null);

    axios
      .get('/api/v1/orders')
      .then((res) => {
        if (res.data && res.data.success) {
          setOrders(res.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('[ADMIN_FETCH_ORDERS_ERROR]', err);
        setError(
          err.response?.data?.error?.message ||
            'Failed to load administrative orders. Authentication required.'
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  /**
   * handleStatusUpdate (Task 3: PATCH /api/v1/orders/:id/status)
   */
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    setUpdateFeedback(null);

    try {
      const res = await axios.patch(`/api/v1/orders/${orderId}/status`, {
        status: newStatus
      });

      if (res.data && res.data.success) {
        setUpdateFeedback({
          orderId,
          type: 'success',
          message: `Status updated to '${newStatus}'.`
        });
        // Update local state smoothly
        setOrders((prev) =>
          prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
        );
      }
      setUpdatingOrderId(null);
    } catch (err) {
      setUpdateFeedback({
        orderId,
        type: 'error',
        message: err.response?.data?.error?.message || 'Failed to update order status.'
      });
      setUpdatingOrderId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (statusFilter === 'ALL') return true;
    return order.status === statusFilter;
  });

  const totalGrossRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);
  const pendingCount = orders.filter((ord) => ord.status === 'pending').length;
  const preparingCount = orders.filter((ord) => ord.status === 'preparing').length;
  const deliveredCount = orders.filter((ord) => ord.status === 'delivered').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-2">
            Task 2: Lazy-Loaded Administrative Route
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Admin Oversight Panel
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Platform monitoring and real-time lifecycle management for all QuickBite campus orders.
          </p>
        </div>

        <button
          onClick={fetchAllOrders}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-300 hover:text-white hover:border-slate-700 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-400' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-extrabold text-white">{orders.length}</div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider">
            <span>Gross Platform Volume</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">
            ₹{totalGrossRevenue}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider">
            <span>Active Kitchen Queue</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">
            {pendingCount + preparingCount}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs uppercase tracking-wider">
            <span>Completed Deliveries</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-blue-400">{deliveredCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-900/90 border border-slate-800 rounded-xl">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
            statusFilter === 'ALL'
              ? 'bg-orange-500 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All Orders ({orders.length})
        </button>
        {statusOptions.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg capitalize transition-colors ${
              statusFilter === st
                ? 'bg-slate-800 text-orange-400 border border-orange-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {st} ({orders.filter((o) => o.status === st).length})
          </button>
        ))}
      </div>

      {/* Orders Table / List */}
      {loading ? (
        <LoadingSpinner message="Loading administrative orders..." />
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Order Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs text-orange-400 font-bold">
                    #{order._id.substring(order._id.length - 8)}
                  </span>
                  <span className="font-bold text-white text-base">
                    {order.restaurantId?.name || 'Restaurant Record'}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({order.restaurantId?.cuisine || '—'})
                  </span>
                </div>

                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    <span className="text-slate-500">Customer: </span>
                    <span className="font-semibold text-slate-200">
                      {order.customerId?.name || 'Customer'}
                    </span>{' '}
                    ({order.customerId?.email || 'N/A'})
                  </div>
                  <div>
                    <span className="text-slate-500">Items: </span>
                    {order.items?.map((it) => `${it.name} (${it.quantity}x)`).join(', ')}
                  </div>
                  <div>
                    <span className="text-slate-500">Delivery To: </span>
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>
              </div>

              {/* Status Selector & Amount */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-800">
                <div className="text-right sm:pr-4 sm:border-r border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                    Order Total
                  </span>
                  <span className="text-xl font-extrabold text-orange-400 font-mono">
                    ₹{order.totalAmount}
                  </span>
                </div>

                {/* Status Updater Dropdown (Task 3: PATCH /api/v1/orders/:id/status) */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 block uppercase font-semibold">
                    Change Lifecycle Status:
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingOrderId === order._id}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:ring-2 focus:ring-orange-500 focus:outline-none capitalize"
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-400 text-sm">
          No orders match the selected filter.
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
