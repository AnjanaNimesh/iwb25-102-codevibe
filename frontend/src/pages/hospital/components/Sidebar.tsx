import { Link, useLocation } from 'react-router-dom'
import {
  HeartIcon,
  HomeIcon,
  UsersIcon,
  DropletIcon,
  ActivityIcon,
  SettingsIcon,
} from 'lucide-react'
const Sidebar = () => {
  const location = useLocation()
  const isActive = (path: string) => {
    return location.pathname === path
      ? 'bg-red-50 text-red-600'
      : 'text-gray-700 hover:bg-gray-100'
  }
  return (
    <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <HeartIcon className="h-6 w-6 text-red-500" />
          <h1 className="ml-2 text-xl font-bold text-gray-800">Blood Bank</h1>
        </div>
      </div>
      <nav className="mt-4">
        <Link to="/hospital/dashboard" className={`flex items-center px-4 py-3 ${isActive('/')}`}>
          <HomeIcon className="h-5 w-5 mr-3" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/hospital/donors"
          className={`flex items-center px-4 py-3 ${isActive('/donors')}`}
        >
          <UsersIcon className="h-5 w-5 mr-3" />
          <span>Donors</span>
        </Link>
        <Link
          to="/hospital/blood-stock"
          className={`flex items-center px-4 py-3 ${isActive('/blood-stock')}`}
        >
          <DropletIcon className="h-5 w-5 mr-3" />
          <span>Blood Stock</span>
        </Link>
        <Link
          to="/hospital/patient-requests"
          className={`flex items-center px-4 py-3 ${isActive('/patient-requests')}`}
        >
          <HeartIcon className="h-5 w-5 mr-3" />
          <span>Patient Requests</span>
        </Link>
        <Link
          to="/hospital/campaigns"
          className={`flex items-center px-4 py-3 ${isActive('/donation-status')}`}
        >
          <ActivityIcon className="h-5 w-5 mr-3" />
          <span>Campaigns</span>
        </Link>
      </nav>
    </div>
  )
}
export default Sidebar