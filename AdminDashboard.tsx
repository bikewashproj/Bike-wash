import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Truck, Filter, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Mock bookings data
const mockBookings = [
  {
    id: 'b1',
    userDetails: {
      name: 'John Smith',
      phone: '555-123-4567',
      address: '123 Main St, Anytown'
    },
    bikeDetails: {
      name: 'Trek Domane',
      number: 'BK-1234',
      color: 'Blue'
    },
    washCenter: {
      id: '1',
      name: 'Downtown Bike Spa',
      address: '123 Main St, Downtown',
      rating: 4.8,
      distance: '1.2 km',
      price: 25
    },
    status: 'pending',
    pickupTime: '2:30 PM',
    dropoffTime: '4:30 PM',
    createdAt: new Date(Date.now() - 30 * 60000).toISOString()
  },
  {
    id: 'b2',
    userDetails: {
      name: 'Jane Doe',
      phone: '555-987-6543',
      address: '456 Oak Ave, Somewhere'
    },
    bikeDetails: {
      name: 'Specialized Allez',
      number: 'BK-5678',
      color: 'Red'
    },
    washCenter: {
      id: '2',
      name: 'Uptown Bike Wash',
      address: '456 Oak Ave, Uptown',
      rating: 4.5,
      distance: '2.5 km',
      price: 20
    },
    status: 'in-progress',
    pickupTime: '1:00 PM',
    dropoffTime: '3:00 PM',
    createdAt: new Date(Date.now() - 90 * 60000).toISOString()
  },
  {
    id: 'b3',
    userDetails: {
      name: 'Mike Johnson',
      phone: '555-456-7890',
      address: '789 Pine St, Elsewhere'
    },
    bikeDetails: {
      name: 'Giant Defy',
      number: 'BK-9012',
      color: 'Black'
    },
    washCenter: {
      id: '3',
      name: 'Riverside Bike Care',
      address: '789 River Rd, Riverside',
      rating: 4.9,
      distance: '3.7 km',
      price: 30
    },
    status: 'completed',
    pickupTime: '10:00 AM',
    dropoffTime: '12:00 PM',
    createdAt: new Date(Date.now() - 240 * 60000).toISOString()
  }
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { getBookings, updateBookingStatus } = useBooking();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'in-progress' | 'completed' | 'all'>('all');
  const [bookings, setBookings] = useState(mockBookings);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !user?.isAdmin) {
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  const handleUpdateStatus = (id: string, newStatus: 'pending' | 'in-progress' | 'completed' | 'cancelled') => {
    const updatedBookings = bookings.map(booking => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
    updateBookingStatus(id, newStatus);
  };

  const filteredBookings = bookings.filter(booking => {
    // Filter by tab
    if (activeTab !== 'all' && booking.status !== activeTab) {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        booking.userDetails.name.toLowerCase().includes(searchLower) ||
        booking.bikeDetails.name.toLowerCase().includes(searchLower) ||
        booking.bikeDetails.number.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'in-progress':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">In Progress</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Completed</span>;
      case 'cancelled':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">Admin Dashboard</h1>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex -mb-px overflow-x-auto">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'all'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  All Bookings
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'pending'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setActiveTab('in-progress')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'in-progress'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setActiveTab('completed')}
                  className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm ${
                    activeTab === 'completed'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Completed
                </button>
              </nav>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bike Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wash Center
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timing
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{booking.userDetails.name}</div>
                          <div className="text-sm text-gray-500">{booking.userDetails.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.bikeDetails.name}</div>
                          <div className="text-sm text-gray-500">
                            {booking.bikeDetails.number} ({booking.bikeDetails.color})
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{booking.washCenter?.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">Pickup: {booking.pickupTime}</div>
                          <div className="text-sm text-gray-500">Dropoff: {booking.dropoffTime}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(booking.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {booking.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'in-progress')}
                                className="text-blue-600 hover:text-blue-900 flex items-center"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Accept
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900 flex items-center"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </div>
                          )}
                          
                          {booking.status === 'in-progress' && (
                            <button
                              onClick={() => handleUpdateStatus(booking.id, 'completed')}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Mark Complete
                            </button>
                          )}
                          
                          {booking.status === 'completed' && (
                            <span className="text-gray-500">No actions</span>
                          )}
                          
                          {booking.status === 'cancelled' && (
                            <span className="text-gray-500">No actions</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                        No bookings found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;