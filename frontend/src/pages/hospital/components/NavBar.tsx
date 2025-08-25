import  { useState } from 'react'
import { BellIcon, UserIcon } from 'lucide-react'
import { Link} from "react-router-dom";
const NavBar = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  // Mock notifications data
  const notifications = [
    {
      id: 1,
      message: 'Low blood stock alert: O- units below threshold',
      time: '10 minutes ago',
      read: false,
    },
    {
      id: 2,
      message: 'New blood donation campaign scheduled',
      time: '1 hour ago',
      read: false,
    },
    {
      id: 3,
      message: '5 new donor registrations today',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 4,
      message: 'Weekly inventory report available',
      time: '1 day ago',
      read: true,
    },
  ]
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
      <div>
        {/* Left section - empty or can contain search or breadcrumbs */}
      </div>
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications)
              setShowProfileMenu(false)
            }}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 relative"
          >
            <BellIcon className="h-6 w-6" />
            {notifications.some((n) => !n.read) && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-20 border border-gray-200">
              <div className="py-2 px-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">
                  Notifications
                </h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${notification.read ? '' : 'bg-blue-50'}`}
                    >
                      <p className="text-sm text-gray-800">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {notification.time}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-gray-500">
                    No notifications
                  </p>
                )}
              </div>
              <div className="py-2 px-3 bg-gray-50 border-t border-gray-200 text-center">
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Profile Menu */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
          >
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Link to={"/hospital/hospitalprofile"}>
              <UserIcon className="h-5 w-5 text-gray-600" />
              </Link>
              
            </div>
          </button>
         
        </div>
      </div>
    </div>
  )
}
export default NavBar