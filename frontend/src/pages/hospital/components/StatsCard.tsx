import  { type ReactNode } from 'react'
interface StatsCardProps {
  title: string
  value: string | number
  description: string
  icon: ReactNode
}
const StatsCard = ({ title, value, description, icon }: StatsCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-gray-700 font-medium">{title}</h3>
        <div className="text-gray-500">{icon}</div>
      </div>
      <div className="flex flex-col">
        <span className="text-3xl font-bold text-gray-800">{value}</span>
        <span className="text-sm text-gray-600 mt-1">{description}</span>
      </div>
    </div>
  )
}
export default StatsCard