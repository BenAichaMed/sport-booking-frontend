import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import axios from 'axios';
import {
  MapPin,
  Calendar,
  Search,
  Filter,
  ChevronDown,
  Star,
  Clock,
  DollarSign,
  X
} from 'lucide-react';
import Loader from '../components/Loader';

const allAmenities = ['Lighting', 'Equipment Rental', 'Parking', 'Showers', 'Coaching', 'Cafe', 'Indoor', 'Lockers', 'Water Fountains', 'Scoreboard'];
const sportTypes = ['Tennis', 'Padel', 'Basketball', 'Football'];
const locations = ['New York', 'Chicago', 'Los Angeles', 'Miami', 'Houston'];

function CourtList() {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('rating-desc');
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: [],
    priceRange: [0, 100],
    date: format(new Date(), 'yyyy-MM-dd'),
    location: '',
    amenities: []
  });

  const [courts, setCourts] = useState([]);

  const filterPayload = useMemo(() => ({
    type: filters.type.join(','),
    location: filters.location,
    amenities: filters.amenities.join(','),
    priceRange: filters.priceRange.join(','),
    date: filters.date
  }), [filters]);
  
  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      try {
        const res = await axios.post('http://localhost:5000/api/courts/search', filterPayload, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        setCourts(res.data.courts);
      } catch (error) {
        console.error('Error fetching courts:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchCourts();
  }, [filterPayload]);
  
  

  const filteredAndSortedCourts = useMemo(() => {
    let result = [...courts];

    // Apply filters
    if (filters.type.length > 0) {
      result = result.filter(court => filters.type.includes(court.type));
    }
    if (filters.location) {
      result = result.filter(court => court.location.toLowerCase().includes(filters.location.toLowerCase()));
    }
    if (filters.amenities.length > 0) {
      result = result.filter(court =>
        filters.amenities.every(amenity => court.amenities.includes(amenity))
      );
    }
    result = result.filter(court => court.price >= filters.priceRange[0] && court.price <= filters.priceRange[1]);

    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        return result.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return result.sort((a, b) => b.price - a.price);
      case 'rating-desc':
        return result.sort((a, b) => b.averageRating - a.averageRating);
      case 'name-asc':
        return result.sort((a, b) => a.name.localeCompare(b.name));
      default:
        return result;
    }
  }, [filters, sortOption, courts]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFilter = (type, array) => {
    if (array.includes(type)) {
      return array.filter(t => t !== type);
    }
    return [...array, type];
  };

  if (loading) {
    return <div><Loader /></div>;
  }
 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by location..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <input
                type="date"
                className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500"
                value={filters.date}
                onChange={(e) => handleFilterChange('date', e.target.value)}
              />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Filter className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters Panel */}
          {isFilterOpen && (
            <div className="mt-4 p-6 bg-white rounded-lg border animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Sport Types */}
                <div>
                  <h3 className="font-semibold mb-3">Sport Type</h3>
                  <div className="space-y-2">
                    {sportTypes.map(type => (
                      <label key={type} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.type.includes(type)}
                          onChange={() => handleFilterChange('type', toggleFilter(type, filters.type))}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h3 className="font-semibold mb-3">Price Range</h3>
                  <div className="space-y-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${filters.priceRange[0]}</span>
                      <span>${filters.priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {allAmenities.map(amenity => (
                      <label key={amenity} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={filters.amenities.includes(amenity)}
                          onChange={() => handleFilterChange('amenities', toggleFilter(amenity, filters.amenities))}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        {amenity}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.type.length > 0 || filters.amenities.length > 0) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.type.map(type => (
                    <span key={type} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
                      {type}
                      <X
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleFilterChange('type', filters.type.filter(t => t !== type))}
                      />
                    </span>
                  ))}
                  {filters.amenities.map(amenity => (
                    <span key={amenity} className="px-3 py-1 bg-green-100 text-green-800 rounded-full flex items-center gap-1">
                      {amenity}
                      <X
                        className="w-4 h-4 cursor-pointer"
                        onClick={() => handleFilterChange('amenities', filters.amenities.filter(a => a !== amenity))}
                      />
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Court Listing */}
      {!filteredAndSortedCourts.length && (
         <div className="flex flex-col items-center justify-center h-screen">
         <h2 className="text-2xl font-bold mb-4">No Available Courts</h2>
         <p className="text-gray-600 text-center">
           We couldn't find any courts matching your criteria. Please adjust your filters and try again.
         </p>
       </div>)}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sort Options */}
       {filteredAndSortedCourts.length > 0 && (

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Available Courts</h2>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>)}
        
        

        {/* Court Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCourts.map((court) => (
            <div
              key={court._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/courts/${court._id}`)}
            >
              <div className="relative h-48">
                <img
                  src={court.image}
                  alt={court.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-semibold">{court.averageRating}</span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{court.name}</h3>
                  <span className="text-blue-600 font-bold">${court.price}/hr</span>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{court.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Available Today</span>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {court.amenities.slice(0, 3).map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                  {court.amenities.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      +{court.amenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourtList;