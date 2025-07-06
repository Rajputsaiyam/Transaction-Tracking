import  { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Edit, Check, X } from 'lucide-react'
import { categories } from '../data/categories'

export default function BudgetChart({ transactions, budgets, onUpdateBudget }) {
  const [editingBudget, setEditingBudget] = useState(null)
  const [budgetAmount, setBudgetAmount] = useState('')

  const categorySpending = categories.map(cat => {
    const spent = transactions
      .filter(t => t.category === cat.name)
      .reduce((sum, t) => sum + t.amount, 0)
    const budget = budgets.find(b => b.category === cat.name)?.amount || 0
    
    return {
      category: cat.name,
      budget,
      spent,
      remaining: Math.max(0, budget - spent)
    }
  }).filter(cat => cat.budget > 0 || cat.spent > 0)

  const handleEditBudget = (category, currentBudget) => {
    setEditingBudget(category)
    setBudgetAmount(currentBudget.toString())
  }

  const handleSaveBudget = (category) => {
    const amount = Number(budgetAmount)
    if (amount >= 0) {
      onUpdateBudget(category, amount)
    }
    setEditingBudget(null)
    setBudgetAmount('')
  }

  const handleCancelEdit = () => {
    setEditingBudget(null)
    setBudgetAmount('')
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4">Set Category Budgets</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map(cat => {
            const budget = budgets.find(b => b.category === cat.name)?.amount || 0
            const spent = transactions
              .filter(t => t.category === cat.name)
              .reduce((sum, t) => sum + t.amount, 0)
            
            return (
              <div key={cat.name} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{cat.name}</span>
                  {editingBudget === cat.name ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        className="w-20 px-2 py-1 text-sm border rounded"
                        placeholder="0"
                      />
                      <button
                        onClick={() => handleSaveBudget(cat.name)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditBudget(cat.name, budget)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                                   <p>Budget: ₹{budget.toFixed(2)}</p>
                  <p>Spent: ₹{spent.toFixed(2)}</p> 
                  <p className={spent > budget && budget > 0 ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                    {budget === 0 ? 'No budget set' : 
                                         spent > budget ? `Over by ₹${(spent - budget).toFixed(2)}` : 
                     `Under by ₹${(budget - spent).toFixed(2)}`} 
                  </p>
                  {budget > 0 && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${spent > budget ? 'bg-red-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min((spent / budget) * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1">{((spent / budget) * 100).toFixed(0)}% used</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {categorySpending.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={categorySpending} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
            <YAxis />
            <Tooltip 
              formatter={(value, name) => [
                `₹${Number(value).toFixed(2)}`, 
                name === 'spent' ? 'Spent' : 'Budget'
              ]} 
            />
            <Legend />
            <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
            <Bar dataKey="spent" fill="#EF4444" name="Spent" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">Set budgets to see comparison</p>
      )}
    </div>
  )
}
 