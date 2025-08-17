import { CheckCircleIcon, ClockIcon } from 'lucide-react'
interface BloodTypeCardProps {
  bloodType: string
  units: number
  isLow?: boolean
}
const BloodTypeCard = ({
  bloodType,
  units,
  isLow = false,
}: BloodTypeCardProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg text-center">
      <h3 className="text-xl font-bold mb-2">{bloodType}</h3>
      <div className="flex items-center justify-center">
        {units > 10 ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-1" />
        ) : (
          <ClockIcon className="h-5 w-5 text-amber-500 mr-1" />
        )}
        <span className={`font-medium ${isLow ? 'text-red-500' : ''}`}>
          {units} units
        </span>
      </div>
    </div>
  )
}
export default BloodTypeCard