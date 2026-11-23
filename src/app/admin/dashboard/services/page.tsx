
"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Plus,
  Search,
  Scissors,
  Clock3,
  Pencil,
  Trash2,
  ImagePlus,
  X,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Layers3,
} from "lucide-react";
import { authClient } from "@/app/lib/auth-client";
import { API_BASE_URL } from "@/app/lib/api";

type Service = {
  _id: string;
  serviceName: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  status: "active" | "inactive";
};

const initialForm = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  status: "active",
};

const categories = ["Hair", "Skin", "Nails", "Makeup", "Spa", "Other"];

export default function ManageServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const getToken = async () => {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Session expired. Please login again.");
    }

    return data.token;
  };

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);

      const token = await getToken();
      const response = await fetch(`${API_BASE_URL}/admin/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to load services.");
      }

      setServices(result.data || []);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load services.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  useEffect(() => {
    if (!image) {
      setPreview("");
      return;
    }

    const imageUrl = URL.createObjectURL(image);
    setPreview(imageUrl);

    return () => URL.revokeObjectURL(imageUrl);
  }, [image]);

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  const resetForm = () => {
    setForm(initialForm);
    setImage(null);
    setPreview("");
    setEditingId(null);

    const input = document.getElementById("service-image") as HTMLInputElement | null;
    if (input) input.value = "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setSaving(true);
      setMessage("");

      const token = await getToken();

      let imageUrl = editingId
        ? services.find((service) => service._id === editingId)?.image || ""
        : "";

      if (image) {
        const formData = new FormData();
        formData.append("image", image);

        const uploadResponse = await fetch(`${API_BASE_URL}/admin/upload-image`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(uploadResult.message || "Image upload failed.");
        }

        imageUrl = uploadResult.data.url;
      }

      if (!imageUrl) {
        throw new Error("Please select a service image.");
      }

      const payload = {
        ...form,
        serviceName: form.serviceName.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        duration: Number(form.duration),
        image: imageUrl,
      };

      const url = editingId
        ? `${API_BASE_URL}/admin/services/${editingId}`
        : `${API_BASE_URL}/admin/services`;

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save service.");
      }

      showMessage(
        editingId ? "Service updated successfully!" : "New service added successfully!"
      );

      resetForm();
      await loadServices();
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "Something went wrong.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingId(service._id);

    setForm({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      status: service.status,
    });

    setImage(null);
    setPreview("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      const token = await getToken();

      const response = await fetch(`${API_BASE_URL}/admin/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Delete failed.");
      }

      showMessage("Service deleted successfully!");
      await loadServices();
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Delete failed.", "error");
    }
  };

  const handleStatusChange = async (service: Service) => {
    try {
      const token = await getToken();
      const newStatus = service.status === "active" ? "inactive" : "active";

      const response = await fetch(`${API_BASE_URL}/admin/services/${service._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Status update failed.");
      }

      showMessage(`Service is now ${newStatus}.`);
      await loadServices();
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Status update failed.", "error");
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceName.toLowerCase().includes(search.toLowerCase()) ||
      service.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || service.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const activeCount = services.filter((service) => service.status === "active").length;
  const inactiveCount = services.length - activeCount;

  return (
    <div className="min-h-screen bg-[#faf8f6] px-4 py-7 text-[#292321] sm:px-6 lg:px-9">
      <div className="mx-auto max-w-7xl space-y-8">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#b77970]">
              <Sparkles size={15} />
              SalonBook Administration
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Manage Services
            </h1>
            <p className="mt-2 text-sm text-[#8b817d]">
              Create and manage your salon services in one place.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              document.getElementById("service-form")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#a85f58] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#914c46]"
          >
            <Plus size={18} />
            Add New Service
          </button>
        </div>

        {/* Notification */}
        {message && (
          <div
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              messageType === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{message}</span>
            <button
              onClick={() => setMessage("")}
              className="ml-auto"
              aria-label="Close message"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#eee5e1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8b817d]">Total Services</span>
              <div className="rounded-xl bg-[#f7ece9] p-3 text-[#a85f58]">
                <Layers3 size={21} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold">{services.length}</p>
            <p className="mt-1 text-xs text-[#9b918c]">All listed services</p>
          </div>

          <div className="rounded-2xl border border-[#eee5e1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8b817d]">Active Services</span>
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                <CheckCircle2 size={21} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold">{activeCount}</p>
            <p className="mt-1 text-xs text-[#9b918c]">Available to customers</p>
          </div>

          <div className="rounded-2xl border border-[#eee5e1] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#8b817d]">Inactive Services</span>
              <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                <Scissors size={21} />
              </div>
            </div>
            <p className="mt-4 text-3xl font-bold">{inactiveCount}</p>
            <p className="mt-1 text-xs text-[#9b918c]">Currently unavailable</p>
          </div>
        </div>

        {/* Add / Edit Form */}
        <section
          id="service-form"
          className="overflow-hidden rounded-2xl border border-[#eee5e1] bg-white shadow-sm"
        >
          <div className="border-b border-[#f0e9e6] px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#f8eeeb] p-3 text-[#a85f58]">
                {editingId ? <Pencil size={21} /> : <Plus size={21} />}
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {editingId ? "Update Service" : "Create New Service"}
                </h2>
                <p className="mt-1 text-xs text-[#968b86]">
                  Fill in the details below to manage your salon offering.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-7">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold">Service Name *</label>
                <input
                  required
                  value={form.serviceName}
                  onChange={(e) => setForm({ ...form, serviceName: e.target.value })}
                  placeholder="e.g. Premium Hair Cut"
                  className="w-full rounded-xl border border-[#e9dfdb] bg-[#fdfcfb] px-4 py-3 text-sm outline-none transition focus:border-[#b77970] focus:ring-2 focus:ring-[#b77970]/10"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full rounded-xl border border-[#e9dfdb] bg-[#fdfcfb] px-4 py-3 text-sm outline-none transition focus:border-[#b77970]"
                >
                  <option value="">Choose a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Price (৳) *</label>
                <input
                  required
                  min="1"
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="500"
                  className="w-full rounded-xl border border-[#e9dfdb] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#b77970]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">Duration (minutes) *</label>
                <input
                  required
                  min="1"
                  type="number"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="30"
                  className="w-full rounded-xl border border-[#e9dfdb] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#b77970]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">Description *</label>
              <textarea
                required
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Write a short description about this service..."
                className="w-full resize-y rounded-xl border border-[#e9dfdb] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#b77970]"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="mb-2 block text-sm font-semibold">Service Image *</label>

              <label
                htmlFor="service-image"
                className="flex min-h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-[#e6d6d1] bg-[#fdfaf9] p-5 text-center transition hover:border-[#b77970] hover:bg-[#fbf4f1]"
              >
                {preview || (editingId && services.find((s) => s._id === editingId)?.image) ? (
                  <div className="relative w-full">
                    <img
                      src={preview || services.find((s) => s._id === editingId)?.image}
                      alt="Service preview"
                      className="mx-auto h-44 max-w-full rounded-xl object-cover"
                    />
                    <p className="mt-3 text-xs font-medium text-[#a85f58]">
                      Click to change image
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 rounded-full bg-[#f5e9e5] p-4 text-[#a85f58]">
                      <UploadCloud size={28} />
                    </div>
                    <span className="text-sm font-semibold">Click to upload service image</span>
                    <span className="mt-2 text-xs text-[#9b918c]">
                      PNG, JPG or WebP · Maximum 5MB
                    </span>
                  </>
                )}
              </label>

              <input
                id="service-image"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                className="hidden"
              />
            </div>

            <div className="max-w-xs">
              <label className="mb-2 block text-sm font-semibold">Service Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full rounded-xl border border-[#e9dfdb] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#b77970]"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-[#f0e9e6] pt-5">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#a85f58] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#914c46] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? (
                  <RefreshCw size={17} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
                {saving ? "Saving..." : editingId ? "Update Service" : "Save Service"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex items-center gap-2 rounded-xl border border-[#e9dfdb] px-6 py-3 text-sm font-semibold text-[#6e625d] transition hover:bg-[#faf7f5]"
                >
                  <X size={17} />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* Services List - Table Layout */}
        <section className="space-y-5">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold">All Services</h2>
              <p className="mt-1 text-sm text-[#968b86]">
                Manage your existing salon services.
              </p>
            </div>

            <button
              onClick={loadServices}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#e9dfdb] bg-white px-4 py-2.5 text-sm font-medium text-[#6e625d] transition hover:bg-[#faf7f5] disabled:opacity-60"
            >
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col gap-3 rounded-2xl border border-[#eee5e1] bg-white p-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a79b96]" size={18} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search service name or category..."
                className="w-full rounded-xl border border-[#eee5e1] bg-[#fdfcfb] py-3 pl-10 pr-4 text-sm outline-none focus:border-[#b77970]"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="rounded-xl border border-[#eee5e1] bg-[#fdfcfb] px-4 py-3 text-sm outline-none focus:border-[#b77970] sm:min-w-44"
            >
              <option value="All">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="rounded-2xl border border-[#eee5e1] bg-white p-14 text-center">
              <RefreshCw className="mx-auto animate-spin text-[#a85f58]" size={28} />
              <p className="mt-3 text-sm text-[#968b86]">Loading services...</p>
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#e6d6d1] bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f8eeeb] text-[#a85f58]">
                <ImagePlus size={25} />
              </div>
              <h3 className="mt-4 font-bold">No services found</h3>
              <p className="mt-2 text-sm text-[#968b86]">
                Try another search or add a new salon service.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-[#eee5e1] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-[#eee5e1] bg-[#fcf8f6] text-xs uppercase tracking-wider text-[#8b817d]">
                      <th className="px-5 py-4 font-semibold">Service</th>
                      <th className="px-5 py-4 font-semibold">Category</th>
                      <th className="px-5 py-4 font-semibold">Price</th>
                      <th className="px-5 py-4 font-semibold">Duration</th>
                      <th className="px-5 py-4 font-semibold">Status</th>
                      <th className="px-5 py-4 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f1eae7]">
                    {filteredServices.map((service) => (
                      <tr key={service._id} className="transition hover:bg-[#fdfaf9]">
                        <td className="px-5 py-4">
                          <div className="flex min-w-[260px] items-center gap-3">
                            <img
                              src={service.image}
                              alt={service.serviceName}
                              className="h-14 w-14 shrink-0 rounded-xl border border-[#eee5e1] object-cover"
                            />
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold text-[#332b28]">
                                {service.serviceName}
                              </p>
                              <p className="mt-1 max-w-[260px] truncate text-xs text-[#968b86]">
                                {service.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex rounded-full bg-[#f8eeeb] px-3 py-1.5 text-xs font-semibold text-[#a85f58]">
                            {service.category}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm font-bold text-[#a85f58]">
                          ৳{service.price.toLocaleString("en-BD")}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm text-[#6e625d]">
                          <span className="inline-flex items-center gap-2">
                            <Clock3 size={15} className="text-[#a79b96]" />
                            {service.duration} min
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                              service.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {service.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStatusChange(service)}
                              title={service.status === "active" ? "Deactivate service" : "Activate service"}
                              className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                                service.status === "active"
                                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                              }`}
                            >
                              {service.status === "active" ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => handleEdit(service)}
                              title="Edit service"
                              className="rounded-lg border border-[#eee5e1] p-2 text-[#6e625d] transition hover:border-[#d9c2bb] hover:bg-[#faf4f1] hover:text-[#a85f58]"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(service._id)}
                              title="Delete service"
                              className="rounded-lg border border-red-100 p-2 text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-col gap-1 border-t border-[#f1eae7] bg-[#fcf8f6] px-5 py-3 text-xs text-[#968b86] sm:flex-row sm:items-center sm:justify-between">
                <span>Showing {filteredServices.length} of {services.length} services</span>
                <span>Scroll horizontally to view all columns on smaller screens</span>
              </div>
            </div>
          )}
        </section>

        <div className="border-t border-[#eee5e1] py-5 text-center text-xs text-[#a79b96]">
          SalonBook Admin Panel · Service Management
        </div>
      </div>
    </div>
  );
}
