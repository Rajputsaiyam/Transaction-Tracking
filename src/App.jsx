import  { useState, useEffect } from 'react'
import { Plus, TrendingUp, DollarSign, Target, Calendar } from 'lucide-react'
import TransactionForm from './components/TransactionForm'
import TransactionList from './components/TransactionList'
import MonthlyChart from './components/MonthlyChart'
import CategoryChart from './components/CategoryChart'
import BudgetChart from './components/BudgetChart'
import { categories } from './data/categories'

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [budgets, setBudgets] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions')
    const savedBudgets = localStorage.getItem('budgets')
    if (savedTransactions) setTransactions(JSON.parse(savedTransactions))
    if (savedBudgets) setBudgets(JSON.parse(savedBudgets))
  }, [])

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets))
  }, [budgets])

  const addTransaction = (transaction) => {
    const newTransaction = { ...transaction, id: Date.now().toString() }
    setTransactions([newTransaction, ...transactions])
    setShowForm(false)
  }

  const updateTransaction = (id, transaction) => {
    setTransactions(transactions.map(t => t.id === id ? { ...transaction, id } : t))
    setEditingTransaction(null)
    setShowForm(false)
  }

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id))
  }

  const updateBudget = (category, amount) => {
    setBudgets(prev => {
      const existing = prev.find(b => b.category === category)
      if (existing) {
        return prev.map(b => b.category === category ? { ...b, amount } : b)
      }
      return [...prev, { category, amount }]
    })
  }

  const totalExpenses = transactions.reduce((sum, t) => sum + t.amount, 0)
  const recentTransactions = transactions.slice(0, 5)
  const thisMonth = new Date().toISOString().slice(0, 7)
  const thisMonthExpenses = transactions
    .filter(t => t.date.startsWith(thisMonth))
    .reduce((sum, t) => sum + t.amount, 0)
  
  const categoryTotals = categories.map(cat => ({
    name: cat.name,
    value: transactions.filter(t => t.category === cat.name).reduce((sum, t) => sum + t.amount, 0),
    color: cat.color
  })).filter(cat => cat.value > 0)

  const topCategory = categoryTotals.reduce((max, cat) => 
    cat.value > (max?.value || 0) ? cat : max, null)

  const getSpendingInsights = () => {
    const insights = []
    
    if (thisMonthExpenses > 0) {
      const avgDaily = thisMonthExpenses / new Date().getDate()
           insights.push(`Average daily spending: ₹${avgDaily.toFixed(2)}`) 
    }
    
    if (topCategory) {
      const percentage = ((topCategory.value / totalExpenses) * 100).toFixed(1)
      insights.push(`${topCategory.name} is ${percentage}% of total expenses`)
    }
    
    const overBudgetCategories = categories.filter(cat => {
      const budget = budgets.find(b => b.category === cat.name)?.amount || 0
      const spent = transactions
        .filter(t => t.category === cat.name && t.date.startsWith(thisMonth))
        .reduce((sum, t) => sum + t.amount, 0)
      return budget > 0 && spent > budget
    })
    
    if (overBudgetCategories.length > 0) {
      insights.push(`${overBudgetCategories.length} categories over budget this month`)
    }
    
    return insights
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Personal Finance Visualizer</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add Transaction</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expenses</p>
                               <p className="text-2xl font-bold text-gray-900">₹{totalExpenses.toFixed(2)}</p> 
                <p className="text-xs text-gray-500 mt-1">All time</p>
              </div>
              <TrendingUp className="h-8 w-8 text-red-500" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                               <p className="text-2xl font-bold text-gray-900">₹{thisMonthExpenses.toFixed(2)}</p> 
                <p className="text-xs text-gray-500 mt-1">{new Date().toLocaleDateString('en-US', { month: 'long' })}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Top Category</p>
                <p className="text-lg font-bold text-gray-900">
                  {topCategory ? topCategory.name : 'None'}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                                   {topCategory ? `₹${topCategory.value.toFixed(2)}` : 'No data'} 
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold text-gray-900">{categoryTotals.length}</p>
                <p className="text-xs text-gray-500 mt-1">With transactions</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
            <MonthlyChart transactions={transactions} />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
            <CategoryChart data={categoryTotals} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Budget vs Actual</h2>
          <BudgetChart 
            transactions={transactions} 
            budgets={budgets} 
            onUpdateBudget={updateBudget}
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Spending Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getSpendingInsights().map((insight, index) => (
              <div key={index} className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-sm text-blue-800">{insight}</p>
              </div>
            ))}
            {getSpendingInsights().length === 0 && (
              <div className="col-span-3 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-gray-600">Add more transactions to see insights</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {recentTransactions.map(transaction => (
                <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
                  </div>
                                   <p className="font-semibold text-red-600">₹{transaction.amount.toFixed(2)}</p> 
                </div>
              ))}
              {recentTransactions.length === 0 && (
                <p className="text-gray-500 text-center py-4">No transactions yet</p>
              )}
            </div>
          </div>

          <TransactionList 
            transactions={transactions}
            onEdit={(transaction) => {
              setEditingTransaction(transaction)
              setShowForm(true)
            }}
            onDelete={deleteTransaction}
          />
        </div>
      </div>

      {showForm && (
        <TransactionForm
          onSubmit={editingTransaction 
            ? (data) => updateTransaction(editingTransaction.id, data)
            : addTransaction
          }
          onClose={() => {
            setShowForm(false)
            setEditingTransaction(null)
          }}
          initialData={editingTransaction}
        />
      )}
    </div>
  )
}
 