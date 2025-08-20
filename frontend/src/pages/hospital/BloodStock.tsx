import { useState, useEffect } from "react";
import { DropletIcon, PlusIcon, AlertCircleIcon, Edit2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Types
interface BloodUnit {
  blood_name: string;
  quantity: number;
}

interface BloodGroupStockPayload {
  blood_name: string;
  quantity: number;
}

const API_BASE_URL = "http://localhost:9090/hospital";
const HOSPITAL_ID = 3;

const BloodStock = () => {
  const [bloodStock, setBloodStock] = useState<BloodUnit[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newStock, setNewStock] = useState<BloodGroupStockPayload>({
    blood_name: "O+",
    quantity: 1,
  });
  const [editStock, setEditStock] = useState<BloodGroupStockPayload>({
    blood_name: "",
    quantity: 1,
  });

  // Fetch
  const fetchBloodStock = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`
      );
      if (!res.ok) throw new Error("Failed to fetch blood stock");
      const data: BloodUnit[] = await res.json();
      setBloodStock(data);
    } catch (error) {
      console.error("Error fetching blood stock:", error);
    }
  };

  // Add
  const addBloodStock = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStock),
        }
      );
      if (!res.ok) throw new Error("Failed to save blood stock");
      await fetchBloodStock();
      setShowAddForm(false);
      setNewStock({ blood_name: "O+", quantity: 1 });
    } catch (error) {
      console.error("Error adding blood stock:", error);
    }
  };

  // Edit
  // const updateBloodStock = async () => {
  //   try {
  //     const res = await fetch(`${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(editStock),
  //     })
  //     if (!res.ok) throw new Error('Failed to update blood stock')
  //     await fetchBloodStock()
  //     setShowEditForm(false)
  //     setEditStock({ blood_name: '', quantity: 1 })
  //   } catch (error) {
  //     console.error('Error updating blood stock:', error)
  //   }
  // }
  const updateBloodStock = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/bloodgroups?hospital_id=${HOSPITAL_ID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blood_name: editStock.blood_name,
            quantity: editStock.quantity,
          }),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update blood stock: ${errorText}`);
      }

      const result = await res.json();
      console.log("Update result:", result); // debug output

      await fetchBloodStock();
      setShowEditForm(false);
      setEditStock({ blood_name: "", quantity: 1 });
    } catch (error) {
      console.error("Error updating blood stock:", error);
    }
  };

  useEffect(() => {
    fetchBloodStock();
  }, []);

  // Status
  const bloodStockWithStatus = bloodStock.map((item) => {
    let status = "Adequate";
    if (item.quantity <= 5) status = "Critical";
    else if (item.quantity <= 10) status = "Low";
    return { ...item, status };
  });

  const totalUnits = bloodStockWithStatus.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const chartData = bloodStockWithStatus.map((item) => ({
    name: item.blood_name,
    units: item.quantity,
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <DropletIcon className="h-6 w-6 text-red-500 mr-2" />
          <h1 className="text-2xl font-bold text-gray-800">
            Blood Stock Management
          </h1>
        </div>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-600 transition-colors"
          onClick={() => setShowAddForm(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Blood Stock
        </button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Blood Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={newStock.blood_name}
                onChange={(e) =>
                  setNewStock({ ...newStock, blood_name: e.target.value })
                }
              >
                {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(
                  (bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  )
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Units
              </label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={newStock.quantity}
                onChange={(e) =>
                  setNewStock({
                    ...newStock,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md"
              onClick={addBloodStock}
            >
              Add Stock
            </button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-semibold mb-4">Edit Blood Stock</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100"
                value={editStock.blood_name}
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Units
              </label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={editStock.quantity}
                onChange={(e) =>
                  setEditStock({
                    ...editStock,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md mr-2"
              onClick={() => setShowEditForm(false)}
            >
              Cancel
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              onClick={updateBloodStock}
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Total Stock */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Total Blood Stock</h2>
          <div className="text-4xl font-bold text-gray-800">{totalUnits}</div>
          <div className="text-gray-600 mt-1">Total units available</div>
        </div>
        {/* Critical */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Critical Levels</h2>
          <div className="flex items-center">
            <AlertCircleIcon className="h-5 w-5 text-red-500 mr-2" />
            <div className="text-gray-800">
              {
                bloodStockWithStatus.filter(
                  (item) => item.status === "Critical"
                ).length
              }{" "}
              blood types at critical levels
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {bloodStockWithStatus
              .filter((item) => item.status === "Critical")
              .map((item) => item.blood_name)
              .join(", ")}
          </div>
        </div>
        {/* Low */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Low Levels</h2>
          <div className="flex items-center">
            <AlertCircleIcon className="h-5 w-5 text-yellow-500 mr-2" />
            <div className="text-gray-800">
              {
                bloodStockWithStatus.filter((item) => item.status === "Low")
                  .length
              }{" "}
              blood types at low levels
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {bloodStockWithStatus
              .filter((item) => item.status === "Low")
              .map((item) => item.blood_name)
              .join(", ")}
          </div>
        </div>
      </div>

      {/* Chart & Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">
            Blood Stock Visualization
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="units" fill="#f44336" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Blood Stock Inventory</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Blood Group
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Units
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bloodStockWithStatus.map((item) => (
                  <tr key={item.blood_name}>
                    <td className="px-6 py-4">{item.blood_name}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === "Adequate"
                            ? "bg-green-100 text-green-800"
                            : item.status === "Low"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="text-blue-500 hover:text-blue-700 flex items-center"
                        onClick={() => {
                          setEditStock({
                            blood_name: item.blood_name,
                            quantity: item.quantity,
                          });
                          setShowEditForm(true);
                        }}
                      >
                        <Edit2 className="h-4 w-4 mr-1" /> Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BloodStock;
