import { useState, useEffect, type FormEvent } from 'react';
import api from '../api/axios';
import Modal from '../components/Modal';
import FormField from '../components/FormField';

interface Supplier {
  id: number;
  name: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
  cost_price: number;
  stock: number;
}

interface PurchaseOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_cost: number;
  subtotal: number;
  product: Product;
}

interface PurchaseOrder {
  id: number;
  supplier_id: number;
  status: string;
  total_cost: number;
  order_date: string;
  received_date: string | null;
  notes: string;
  supplier: Supplier;
  user: { name: string };
  items: PurchaseOrderItem[];
}

// Input for creating PO items
interface ItemInput {
  product_id: number;
  quantity: number;
  unit_cost: number;
}

export default function PurchaseOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [error, setError] = useState('');

  // Create form state
  const [supplierId, setSupplierId] = useState('');
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<ItemInput[]>([{ product_id: 0, quantity: 1, unit_cost: 0 }]);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/api/purchase-orders');
      setOrders(res.data.purchase_orders || []);
    } catch {
      setError('Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const res = await api.get('/api/suppliers');
      setSuppliers(res.data.suppliers || []);
    } catch { /* ignore */ }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data.products || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchOrders();
    fetchSuppliers();
    fetchProducts();
  }, []);

  const openCreate = () => {
    setSupplierId('');
    setOrderDate(new Date().toISOString().split('T')[0]);
    setNotes('');
    setItems([{ product_id: 0, quantity: 1, unit_cost: 0 }]);
    setError('');
    setCreateModalOpen(true);
  };

  const openView = (po: PurchaseOrder) => {
    setSelectedOrder(po);
    setViewModalOpen(true);
  };

  // Item management
  const addItem = () => setItems([...items, { product_id: 0, quantity: 1, unit_cost: 0 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index: number, field: keyof ItemInput, value: number) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.unit_cost), 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const validItems = items.filter(item => item.product_id > 0 && item.quantity > 0);
    if (validItems.length === 0) {
      setError('Add at least one item');
      return;
    }

    try {
      await api.post('/api/purchase-orders', {
        supplier_id: parseInt(supplierId),
        order_date: orderDate,
        notes,
        items: validItems,
      });
      setCreateModalOpen(false);
      fetchOrders();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      setError(axiosError.response?.data?.error || 'Failed to create purchase order');
    }
  };

  const handleReceive = async (po: PurchaseOrder) => {
    if (!confirm(`Mark PO #${po.id} as received? This will add stock to all items.`)) return;
    try {
      await api.put(`/api/purchase-orders/${po.id}/receive`);
      fetchOrders();
      setViewModalOpen(false);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      alert(axiosError.response?.data?.error || 'Failed to receive purchase order');
    }
  };

  const handleDelete = async (po: PurchaseOrder) => {
    if (!confirm(`Delete PO #${po.id}?`)) return;
    try {
      await api.delete(`/api/purchase-orders/${po.id}`);
      fetchOrders();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      alert(axiosError.response?.data?.error || 'Failed to delete');
    }
  };

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      received: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Purchase Orders</h1>
        <button onClick={openCreate} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md cursor-pointer">
          New Purchase Order
        </button>
      </div>

      {error && !createModalOpen && <p className="text-red-600 text-sm mb-4">{error}</p>}

      {/* Purchase Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">PO #</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No purchase orders yet</td></tr>
            ) : (
              orders.map((po) => (
                <tr key={po.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer" onClick={() => openView(po)}>
                  <td className="px-4 py-3 font-medium text-gray-900">#{po.id}</td>
                  <td className="px-4 py-3 text-gray-700">{po.supplier?.name}</td>
                  <td className="px-4 py-3 text-gray-500">{new Date(po.order_date).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-gray-500">{po.items?.length || 0} items</td>
                  <td className="px-4 py-3 font-medium text-gray-900">₱{po.total_cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  <td className="px-4 py-3">{statusBadge(po.status)}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex gap-2">
                      {po.status === 'pending' && (
                        <>
                          <button onClick={() => handleReceive(po)} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100 cursor-pointer">
                            Receive
                          </button>
                          <button onClick={() => handleDelete(po)} className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100 cursor-pointer">
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View PO Details Modal */}
      <Modal open={viewModalOpen} onClose={() => setViewModalOpen(false)} title={`Purchase Order #${selectedOrder?.id}`} wide>
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Supplier:</span>
                <span className="ml-2 font-medium">{selectedOrder.supplier?.name}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className="ml-2">{statusBadge(selectedOrder.status)}</span>
              </div>
              <div>
                <span className="text-gray-500">Order Date:</span>
                <span className="ml-2">{new Date(selectedOrder.order_date).toLocaleDateString()}</span>
              </div>
              <div>
                <span className="text-gray-500">Created By:</span>
                <span className="ml-2">{selectedOrder.user?.name}</span>
              </div>
              {selectedOrder.received_date && (
                <div>
                  <span className="text-gray-500">Received:</span>
                  <span className="ml-2">{new Date(selectedOrder.received_date).toLocaleDateString()}</span>
                </div>
              )}
              {selectedOrder.notes && (
                <div className="col-span-2">
                  <span className="text-gray-500">Notes:</span>
                  <span className="ml-2">{selectedOrder.notes}</span>
                </div>
              )}
            </div>

            <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Product</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Qty</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Unit Cost</th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items?.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="px-3 py-2 text-gray-700">{item.product?.name}</td>
                    <td className="px-3 py-2 text-right">{item.quantity}</td>
                    <td className="px-3 py-2 text-right">₱{item.unit_cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td className="px-3 py-2 text-right font-medium">₱{item.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-3 py-2 text-right font-medium text-gray-700">Total:</td>
                  <td className="px-3 py-2 text-right font-bold text-gray-900">₱{selectedOrder.total_cost.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>

            {selectedOrder.status === 'pending' && (
              <button onClick={() => handleReceive(selectedOrder)} className="w-full py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-md cursor-pointer">
                ✓ Mark as Received (Add Stock)
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Create PO Modal */}
      <Modal open={createModalOpen} onClose={() => setCreateModalOpen(false)} title="New Purchase Order" wide>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Supplier</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
              >
                <option value="">Select supplier...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <FormField label="Order Date" value={orderDate} onChange={setOrderDate} type="date" required />
          </div>

          <FormField label="Notes" value={notes} onChange={setNotes} placeholder="Optional notes" />

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-900">Items</label>
              <button type="button" onClick={addItem} className="text-xs text-indigo-600 hover:text-indigo-500 cursor-pointer">
                + Add Item
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1">
                    {index === 0 && <label className="block text-xs text-gray-500 mb-1">Product</label>}
                    <select
                      value={item.product_id}
                      onChange={(e) => updateItem(index, 'product_id', parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
                    >
                      <option value={0}>Select product...</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    {index === 0 && <label className="block text-xs text-gray-500 mb-1">Qty</label>}
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                      className="w-full px-2 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                  <div className="w-28">
                    {index === 0 && <label className="block text-xs text-gray-500 mb-1">Unit Cost</label>}
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unit_cost}
                      onChange={(e) => updateItem(index, 'unit_cost', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 rounded-md border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                  <div className="w-24 text-right">
                    {index === 0 && <label className="block text-xs text-gray-500 mb-1">Subtotal</label>}
                    <span className="text-sm font-medium text-gray-700 leading-[36px]">
                      ₱{(item.quantity * item.unit_cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  {items.length > 1 && (
                    <button type="button" onClick={() => removeItem(index)} className="text-red-400 hover:text-red-600 text-lg cursor-pointer pb-1">×</button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-3 pt-3 border-t border-gray-200">
              <span className="text-sm font-bold text-gray-900">
                Total: ₱{totalCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <button type="submit" className="w-full py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-md cursor-pointer">
            Create Purchase Order
          </button>
        </form>
      </Modal>
    </div>
  );
}
