
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/app/lib/auth-client";
import {
  Search,
  RefreshCw,
  Receipt,
  CheckCircle2,
  Wallet,
  CalendarDays,
} from "lucide-react";

const API = "http://localhost:5000";

type Transaction = {
  _id: string;
  customerName?: string;
  customerEmail?: string;
  serviceName?: string;
  appointmentDate?: string;
  amount?: number;
  currency?: string;
  stripeCheckoutSessionId?: string;
  status?: string;
  transactionDate?: string;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchTransactions() {
    try {
      setLoading(true);
      setError("");

      const tokenResult = await authClient.token();
      const token = tokenResult.data?.token;

      if (!token) throw new Error("Please sign in again.");

      const response = await fetch(`${API}/admin/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load transactions.");
      }

      setTransactions(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((item) => {
    const value = search.toLowerCase();

    return (
      item.customerName?.toLowerCase().includes(value) ||
      item.customerEmail?.toLowerCase().includes(value) ||
      item.serviceName?.toLowerCase().includes(value) ||
      item.stripeCheckoutSessionId?.toLowerCase().includes(value)
    );
  });

  const totalAmount = transactions.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#faf8f5] p-5 md:p-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-rose-500">
              ADMIN MANAGEMENT
            </p>
            <h1 className="mt-1 text-3xl font-bold text-gray-900">
              Transactions
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              View and monitor all customer payment transactions.
            </p>
          </div>

          <button
            onClick={fetchTransactions}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Transactions</p>
              <Receipt className="text-rose-500" size={22} />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              {transactions.length}
            </h2>
            <p className="mt-1 text-xs text-gray-400">All recorded payments</p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Total Paid Amount</p>
              <Wallet className="text-green-600" size={22} />
            </div>
            <h2 className="mt-3 text-3xl font-bold text-gray-900">
              ৳{totalAmount.toLocaleString("en-BD")}
            </h2>
            <p className="mt-1 text-xs text-gray-400">Successful payments</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-bold text-gray-900">Payment History</h2>
              <p className="mt-1 text-xs text-gray-500">
                {filteredTransactions.length} transactions found
              </p>
            </div>

            <div className="relative w-full sm:max-w-sm">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search customer, service or session..."
                className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-rose-400"
              />
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[950px] text-left">
              <thead>
                <tr className="border-y border-gray-100 bg-gray-50 text-xs uppercase text-gray-500">
                  <th className="px-4 py-4">Customer</th>
                  <th className="px-4 py-4">Service</th>
                  <th className="px-4 py-4">Appointment Date</th>
                  <th className="px-4 py-4">Amount</th>
                  <th className="px-4 py-4">Session ID</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Transaction Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-gray-800">
                          {item.customerName || "Unknown"}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.customerEmail || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-4 font-medium text-gray-700">
                        {item.serviceName || "—"}
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.appointmentDate || "—"}
                      </td>

                      <td className="px-4 py-4 font-bold text-gray-900">
                        {item.currency || "BDT"}{" "}
                        {Number(item.amount || 0).toLocaleString("en-BD")}
                      </td>

                      <td className="px-4 py-4 text-xs text-gray-500">
                        {item.stripeCheckoutSessionId
                          ? `${item.stripeCheckoutSessionId.slice(0, 18)}...`
                          : "—"}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                          <CheckCircle2 size={14} />
                          {item.status || "Paid"}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-gray-600">
                        {item.transactionDate
                          ? new Date(item.transactionDate).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
