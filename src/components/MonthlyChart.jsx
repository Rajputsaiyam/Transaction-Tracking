import  { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function MonthlyChart({ transactions }) {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    acc[month] = (acc[month] || 0) + transaction.amount
    return acc
  }, {})

  const data = Object.entries(monthlyData)
    .map(([month, amount]) => ({ month, amount }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  if (data.length === 0) {
    return <p className="text-gray-500 text-center py-8">No data to display</p>
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
               <Tooltip formatter={(value) => `₹${Number(value).toFixed(2)}`} /> 
        <Bar dataKey="amount" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
 