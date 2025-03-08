import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface LocationData {
  village?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
}

// Mock data for wash centers
const washCenters = [
  {
    id: '1',
    name: 'Downtown Bike Spa',
    address: '123 Main St, Downtown',
    rating: 4.8,
    distance: '1.2 km',
    price: 25
  },
  {
    id: '2',
    name: 'Uptown Bike Wash',
    address: '456 Oak Ave, Uptown',
    rating: 4.5,
    distance: '2.5 km',
    price: 20
  },
  {
    id: '3',
    name: 'Riverside Bike Care',
    address: '789 River Rd, Riverside',
    rating: 4.9,
    distance: '3.7 km',
    price: 30
  },
  {
    id: '4',
    name: 'Hillside Bike Cleaners',
    address: '101 Hill St, Hillside',
    rating: 4.6,
    distance: '4.1 km',
    price: 22
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { 
    userDetails, 
    bikeDetails, 
    selectedCenter,
    updateUserDetails, 
    updateBikeDetails, 
    selectWashCenter,
    createBooking
  } = useBooking();
  
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCenters, setShowCenters] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [formErrors, setFormErrors] = useState({
    userName: '',
    userPhone: '',
    userAddress: '',
    bikeName: '',
    bikeNumber: '',
    bikeColor: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = () => {
    setLocationLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`
          );
          const data = await response.json();
          
          setLocationData({
            village: data.address.village || data.address.suburb || data.address.town,
            city: data.address.city || data.address.county,
            state: data.address.state,
            country: data.address.country,
            postcode: data.address.postcode
          });
        } catch (error) {
          setLocationError('Failed to fetch location details');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        setLocationError('Unable to retrieve your location');
        setLocationLoading(false);
      }
    );
  };

  const handleLocationAccess = () => {
    setIsLocationPopupOpen(false);
    getLocation();
  };

  const handleFindCenters = () => {
    // Validate form
    const errors = {
      userName: userDetails.name ? '' : 'Name is required',
      userPhone: userDetails.phone ? '' : 'Phone number is required',
      userAddress: userDetails.address ? '' : 'Address is required',
      bikeName: bikeDetails.name ? '' : 'Bike name is required',
      bikeNumber: bikeDetails.number ? '' : 'Bike number is required',
      bikeColor: bikeDetails.color ? '' : 'Bike color is required'
    };
    
    setFormErrors(errors);
    
    // Check if there are any errors
    if (Object.values(errors).some(error => error !== '')) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      setShowCenters(true);
    }, 1500);
  };

  const handleBookNow = () => {
    if (!selectedCenter) {
      return;
    }
    
    createBooking();
    navigate('/booking-confirmation');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="pt-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Location Display */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-8">
            <div className="flex items-center mb-2">
              <MapPin className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">Your Location</h3>
            </div>
            
            {locationLoading ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="ml-2 text-gray-600">Detecting location...</span>
              </div>
            ) : locationError ? (
              <div className="text-red-500 text-sm py-2">{locationError}</div>
            ) : locationData ? (
              <div className="text-gray-600">
                {[
                  locationData.village,
                  locationData.city,
                  locationData.state,
                  locationData.country,
                  locationData.postcode
                ]
                  .filter(Boolean)
                  .join(', ')}
              </div>
            ) : null}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-8">Book a Bike Wash</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Your Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={userDetails.name}
                  onChange={(e) => updateUserDetails({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your full name"
                />
                {formErrors.userName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.userName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={userDetails.phone}
                  onChange={(e) => updateUserDetails({ phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your phone number"
                />
                {formErrors.userPhone && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.userPhone}</p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  value={userDetails.address}
                  onChange={(e) => updateUserDetails({ address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter your address"
                />
                {formErrors.userAddress && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.userAddress}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Bike Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="bikeName" className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Name/Model
                </label>
                <input
                  type="text"
                  id="bikeName"
                  value={bikeDetails.name}
                  onChange={(e) => updateBikeDetails({ name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bike name or model"
                />
                {formErrors.bikeName && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.bikeName}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="bikeNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Number
                </label>
                <input
                  type="text"
                  id="bikeNumber"
                  value={bikeDetails.number}
                  onChange={(e) => updateBikeDetails({ number: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bike number"
                />
                {formErrors.bikeNumber && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.bikeNumber}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="bikeColor" className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Color
                </label>
                <input
                  type="text"
                  id="bikeColor"
                  value={bikeDetails.color}
                  onChange={(e) => updateBikeDetails({ color: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter bike color"
                />
                {formErrors.bikeColor && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.bikeColor}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="text-center mb-8">
            <button
              onClick={handleFindCenters}
              disabled={isLoading}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-300 disabled:opacity-70 flex items-center justify-center mx-auto"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding Centers...
                </span>
              ) : (
                <span className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Find Nearby Centers
                </span>
              )}
            </button>
          </div>
          
          {showCenters && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Nearby Wash Centers</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {washCenters.map((center) => (
                  <div 
                    key={center.id}
                    className={`bg-white rounded-lg shadow-md p-6 border-2 transition-colors duration-300 cursor-pointer ${
                      selectedCenter?.id === center.id ? 'border-blue-500' : 'border-transparent hover:border-gray-300'
                    }`}
                    onClick={() => selectWashCenter(center)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{center.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{center.address}</span>
                        </div>
                        <div className="flex items-center text-yellow-500 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(center.rating) ? 'fill-current' : ''}`} 
                            />
                          ))}
                          <span className="ml-1 text-gray-700">{center.rating}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 mb-1">{center.distance}</p>
                        <p className="text-lg font-bold text-blue-600">${center.price}</p>
                      </div>
                    </div>
                    
                    {selectedCenter?.id === center.id && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-3">
                          This center offers premium bike washing services with eco-friendly products.
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">Available today</p>
                          <div className="flex items-center text-blue-600 font-medium">
                            <span>Select</span>
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <button
                  onClick={handleBookNow}
                  disabled={!selectedCenter}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Book Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Location Access Popup */}
      {isLocationPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <div className="text-center mb-4">
              <MapPin className="h-12 w-12 text-blue-500 mx-auto" />
              <h3 className="text-xl font-bold mt-2">Location Access</h3>
            </div>
            <p className="text-gray-600 mb-6">
              BikeWash would like to access your location to find nearby wash centers. This helps us provide you with the most convenient options.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsLocationPopupOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Not Now
              </button>
              <button
                onClick={handleLocationAccess}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Allow Access
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4 flex items-center">
            <svg className="animate-spin h-6 w-6 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-700">Processing your request...</p>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Dashboard;