import  { Edit, Trash } from 'lucide-react'

export default function TransactionList({ transactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
        <p className="text-gray-500 text-center py-8">No transactions yet. Add your first transaction!</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">All Transactions</h2>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {transactions.map(transaction => (
          <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium">{transaction.description}</p>
                               <p className="font-semibold text-red-600">₹{transaction.amount.toFixed(2)}</p> 
              </div>
              <p className="text-sm text-gray-600">{transaction.category} • {transaction.date}</p>
            </div>
            <div className="flex space-x-2 ml-4">
              <button 
                onClick={() => onEdit(transaction)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button 
                onClick={() => onDelete(transaction.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
 