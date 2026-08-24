/**
 * AdminPanel Component (Task 2: Lazy Loaded via React.lazy + Suspense — Zomato Design System)
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
  Package
} from 'lucide-react';

const AdminPanel = () => {
  const { customer } = useAuth();

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
            'Failed to load administrative orders. Admin authorization required.'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-7">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#f4f4f2] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fef2f2] text-[#cb202d] text-[12px] font-bold uppercase tracking-wider mb-2 border border-[#fecaca]">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Task 2: Lazy-Loaded Admin Route</span>
          </div>
          <h1 className="text-3xl font-bold text-[#2d2d2d] tracking-tight">
            Administrator Oversight Panel
          </h1>
          <p className="text-[14px] text-[#828282] mt-1 font-medium">
            Live order monitoring, kitchen dispatch tracking, and status lifecycle management.
          </p>
        </div>

        <button
          onClick={fetchAllOrders}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white border border-[#e8e8e8] text-[12px] font-bold text-[#2d2d2d] hover:border-[#cb202d] shadow-xs transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#cb202d]' : ''}`} />
          <span>Refresh Database</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#828282] text-[11px] uppercase font-bold tracking-wider">
            <span>Total Orders</span>
            <Package className="w-4 h-4 text-[#828282]" />
          </div>
          <div className="text-3xl font-black text-[#2d2d2d]">{orders.length}</div>
        </div>

        <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#828282] text-[11px] uppercase font-bold tracking-wider">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-[#24963f]" />
          </div>
          <div className="text-3xl font-black text-[#24963f] font-mono">
            ₹{totalGrossRevenue}
          </div>
        </div>

        <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#828282] text-[11px] uppercase font-bold tracking-wider">
            <span>Active Kitchen Queue</span>
            <Clock className="w-4 h-4 text-[#f57f17]" />
          </div>
          <div className="text-3xl font-black text-[#f57f17]">
            {pendingCount + preparingCount}
          </div>
        </div>

        <div className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] shadow-xs space-y-1">
          <div className="flex items-center justify-between text-[#828282] text-[11px] uppercase font-bold tracking-wider">
            <span>Delivered Orders</span>
            <CheckCircle2 className="w-4 h-4 text-[#1976d2]" />
          </div>
          <div className="text-3xl font-black text-[#1976d2]">{deliveredCount}</div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[12px]">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`px-4 py-2 text-[12px] font-bold rounded-[8px] transition-all ${
            statusFilter === 'ALL'
              ? 'bg-[#cb202d] text-white shadow-xs'
              : 'text-[#2d2d2d] hover:bg-white'
          }`}
        >
          All Orders ({orders.length})
        </button>
        {statusOptions.map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3 py-2 text-[12px] font-bold rounded-[8px] capitalize transition-all ${
              statusFilter === st
                ? 'bg-white text-[#cb202d] shadow-xs'
                : 'text-[#828282] hover:text-[#2d2d2d]'
            }`}
          >
            {st} ({orders.filter((o) => o.status === st).length})
          </button>
        ))}
      </div>

      {/* Orders List */}
      {loading ? (
        <LoadingSpinner message="Loading orders from MongoDB..." />
      ) : error ? (
        <div className="p-6 rounded-[16px] bg-[#fef2f2] border border-[#fecaca] text-[#cb202d] text-[14px] font-medium shadow-xs">
          {error}
        </div>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="p-6 rounded-[16px] bg-white border border-[#f4f4f2] hover:border-[#e8e8e8] shadow-xs hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              {/* Order Info */}
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-[12px] text-[#cb202d] font-bold bg-[#fef2f2] px-2.5 py-0.5 rounded-[6px] border border-[#fecaca]">
                    #{order._id.substring(order._id.length - 8)}
                  </span>
                  <span className="font-bold text-[#2d2d2d] text-[16px]">
                    {order.restaurantId?.name || 'Restaurant Record'}
                  </span>
                  <span className="text-[12px] font-medium text-[#828282]">
                    ({order.restaurantId?.cuisine || '—'})
                  </span>
                </div>

                <div className="text-[13px] text-[#2d2d2d] space-y-1 font-medium">
                  <div>
                    <span className="text-[#828282]">Customer: </span>
                    <span className="font-bold text-[#2d2d2d]">
                      {order.customerId?.name || 'Customer'}
                    </span>{' '}
                    ({order.customerId?.email || 'N/A'})
                  </div>
                  <div>
                    <span className="text-[#828282]">Items: </span>
                    {order.items?.map((it) => `${it.name} (${it.quantity}x)`).join(', ')}
                  </div>
                  <div>
                    <span className="text-[#828282]">Delivery Address: </span>
                    <span>{order.deliveryAddress}</span>
                  </div>
                </div>
              </div>

              {/* Status Selector & Amount */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-[#f4f4f2]">
                <div className="text-right sm:pr-4 sm:border-r border-[#f4f4f2]">
                  <span className="text-[10px] text-[#828282] block uppercase font-bold">
                    Order Total
                  </span>
                  <span className="text-2xl font-black text-[#cb202d] font-mono">
                    ₹{order.totalAmount}
                  </span>
                </div>

                {/* Status Updater Dropdown (Task 3: PATCH /api/v1/orders/:id/status) */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#828282] block uppercase font-bold">
                    Update Status:
                  </span>
                  <select
                    value={order.status}
                    disabled={updatingOrderId === order._id}
                    onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                    className="px-3.5 py-2 bg-[#f4f4f2] border border-[#e8e8e8] rounded-[8px] text-[12px] font-bold text-[#2d2d2d] focus:ring-2 focus:ring-[#cb202d]/20 focus:border-[#cb202d] focus:outline-none capitalize shadow-xs"
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
        <div className="p-12 text-center bg-white rounded-[16px] border border-[#f4f4f2] text-[#828282] text-[14px] font-medium shadow-xs">
          No orders match the selected filter.
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
