import { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2 } from 'lucide-react';
import axios from 'axios';
import AddExpenseModal from './AddExpenseModal';

export default function ExpensesTab({ trip }) {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch expenses from backend
  const fetchExpenses = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/trips/${trip.id}/expenses/`);
      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      setExpenses([]);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [trip.id]);

  const handleAddExpense = async (expenseData) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/trips/${trip.id}/expenses/`, {
        ...expenseData,
        trip: trip.id
      });
      setIsModalOpen(false);
      await fetchExpenses();
    } catch (error) {
      console.error("Error adding expense:", error);
      alert("Failed to add expense: " + (error.response?.data?.detail || "Please check the backend server"));
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/api/expenses/${expenseId}/`);
      await fetchExpenses();
    } catch (error) {
      console.error("Error deleting expense:", error);
      alert("Failed to delete expense");
    }
  };

  // Calculate totals
  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0);
  const budget = parseFloat(trip.budget || 0);
  const remaining = budget - totalSpent;
  const percentUsed = budget > 0 ? (totalSpent / budget) * 100 : 0;

  // Group expenses by category
  const expensesByCategory = expenses.reduce((acc, exp) => {
    const category = exp.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(exp);
    return acc;
  }, {});

  const categoryTotals = Object.keys(expensesByCategory).map(category => ({
    category,
    total: expensesByCategory[category].reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
  }));

  return (
    <div className="space-y-6">
      {/* Budget Overview */}
      <div className="bg-gradient-to-r from-teal-800 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-lg">
            <Wallet size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Budget Overview</h3>
            <p className="text-3xl font-bold mt-1">
              ${totalSpent.toFixed(2)} <span className="text-lg font-normal">/ ${budget.toFixed(2)}</span>
            </p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-3 overflow-hidden">
          <div 
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(percentUsed, 100)}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between mt-2 text-sm">
          <span>${remaining.toFixed(2)} remaining</span>
          <span>{percentUsed.toFixed(0)}% used</span>
        </div>
      </div>

      {/* Balance Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold mb-4">Balance Summary</h3>
        <div className="space-y-3">
          {categoryTotals.length === 0 ? (
            <p className="text-gray-400 text-sm">No expenses by category yet</p>
          ) : (
            categoryTotals.map(({ category, total }) => (
              <div key={category} className="flex justify-between items-center">
                <span className="text-gray-700">{category}</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Expenses</h3>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          >
            <Plus size={18} />
            Add
          </button>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <Wallet className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-400 mb-2">No expenses yet</p>
            <p className="text-sm text-gray-400">Track your spending as you go</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div key={expense.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold text-gray-900">{expense.description}</h4>
                    <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded">
                      {expense.category || 'Other'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(expense.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-gray-900">${parseFloat(expense.amount).toFixed(2)}</span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <AddExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
}
