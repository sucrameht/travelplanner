import { useState, useEffect } from 'react';
import { Calendar, Plus, Route, Plane, ChevronDown, ChevronUp, Trash2, ArrowRight } from 'lucide-react';
import axios from 'axios';
import AddStopModal from './AddStopModal';
import SuggestedEvents from './SuggestedEvents';
import AddFlightModal from './AddFlightModal';
import FlightCard from './FlightCard';
import AddTravelMethodModal from './AddTravelMethodModal';
import ViewTravelMethodModal from './ViewTravelMethodModal';

export default function ItineraryTab({ trip }) {
  const [itinerary, setItinerary] = useState({});
  const [flights, setFlights] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlightModalOpen, setIsFlightModalOpen] = useState(false);
  const [isFlightSectionExpanded, setIsFlightSectionExpanded] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [draggedEvent, setDraggedEvent] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const [draggedStop, setDraggedStop] = useState(null);
  const [dragOverStop, setDragOverStop] = useState(null);
  const [isOverDeleteZone, setIsOverDeleteZone] = useState(false);
  const [travelMethods, setTravelMethods] = useState([]);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);
  const [isViewTravelModalOpen, setIsViewTravelModalOpen] = useState(false);
  const [selectedFromStop, setSelectedFromStop] = useState(null);
  const [selectedToStop, setSelectedToStop] = useState(null);

  // Generate all days for the trip
  const generateDays = () => {
    const days = [];
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    
    let currentDate = new Date(start);
    let dayNumber = 1;
    
    while (currentDate <= end) {
      days.push({
        dayNumber,
        date: new Date(currentDate),
        dateString: currentDate.toISOString().split('T')[0]
      });
      currentDate.setDate(currentDate.getDate() + 1);
      dayNumber++;
    }
    
    return days;
  };

  const days = generateDays();

  // Fetch itinerary from backend
  const fetchItinerary = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/trips/${trip.id}/itinerary/`);
      // Group by date
      const grouped = {};
      if (Array.isArray(response.data)) {
        response.data.forEach(stop => {
          if (!grouped[stop.date]) {
            grouped[stop.date] = [];
          }
          grouped[stop.date].push(stop);
        });
      }
      setItinerary(grouped);
    } catch (error) {
      console.error("Error fetching itinerary:", error);
      setItinerary({});
    }
  };

  // Fetch flights
  const fetchFlights = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/trips/${trip.id}/flights/`);
      setFlights(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching flights:", error);
      setFlights([]);
    }
  };

  const fetchTravelMethods = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/travel-methods/`);
      const tripMethods = response.data.filter(tm => tm.trip === trip.id);
      setTravelMethods(tripMethods);
    } catch (error) {
      console.error("Error fetching travel methods:", error);
      setTravelMethods([]);
    }
  };

  useEffect(() => {
    fetchItinerary();
    fetchFlights();
    fetchTravelMethods();
  }, [trip.id]);

  const handleAddFlight = async (flightData) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/trips/${trip.id}/flights/`, flightData);
      setIsFlightModalOpen(false);
      await fetchFlights();
    } catch (error) {
      console.error("Error adding flight:", error);
      alert("Failed to add flight: " + (error.response?.data?.error || "Please check the flight number and try again"));
    }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/api/flights/${flightId}/`);
      await fetchFlights();
    } catch (error) {
      console.error("Error deleting flight:", error);
      alert("Failed to delete flight");
    }
  };

  const handleAddStop = (dayInfo) => {
    setSelectedDay(dayInfo);
    setIsModalOpen(true);
  };

  const handleSubmitStop = async (stopData) => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/trips/${trip.id}/itinerary/`, {
        ...stopData,
        date: selectedDay.dateString,
        trip: trip.id
      });
      setIsModalOpen(false);
      setSelectedDay(null);
      await fetchItinerary();
    } catch (error) {
      console.error("Error adding stop:", error);
      alert("Failed to add stop: " + (error.response?.data?.detail || "Please check the backend server"));
    }
  };

  const handleAddTravelMethod = (fromStop, toStop) => {
    setSelectedFromStop(fromStop);
    setSelectedToStop(toStop);
    const existingMethods = getTravelMethodsForConnection(fromStop.id, toStop.id);
    if (existingMethods.length > 0) {
      setIsViewTravelModalOpen(true);
    } else {
      setIsTravelModalOpen(true);
    }
  };

  const handleEditTravelMethod = () => {
    setIsViewTravelModalOpen(false);
    setIsTravelModalOpen(true);
  };

  const handleSubmitTravelMethod = async (methods) => {
    try {
      const existing = travelMethods.filter(
        tm => tm.from_stop === selectedFromStop.id && tm.to_stop === selectedToStop.id
      );
      for (const tm of existing) {
        await axios.delete(`http://127.0.0.1:8000/api/travel-methods/${tm.id}/`);
      }

      for (let i = 0; i < methods.length; i++) {
        const method = methods[i];
        await axios.post(`http://127.0.0.1:8000/api/travel-methods/`, {
          trip: trip.id,
          from_stop: selectedFromStop.id,
          to_stop: selectedToStop.id,
          mode: method.mode,
          distance: parseFloat(method.distance),
          duration: parseFloat(method.duration),
          estimated_cost: parseFloat(method.estimatedCost || 0),
          line_number: method.lineNumber || '',
          boarding_stop: method.boardingStop || '',
          alighting_stop: method.alightingStop || '',
          number_of_stops: parseInt(method.numberOfStops || 0),
          order: i
        });
      }

      setIsTravelModalOpen(false);
      setSelectedFromStop(null);
      setSelectedToStop(null);
      await fetchTravelMethods();
    } catch (error) {
      console.error("Error saving travel method:", error);
      alert("Failed to save travel method");
    }
  };

  const getTravelMethodsForConnection = (fromStopId, toStopId) => {
    return travelMethods
      .filter(tm => tm.from_stop === fromStopId && tm.to_stop === toStopId)
      .sort((a, b) => a.order - b.order);
  };

  const calculateDayStats = (dateString) => {
    const stops = itinerary[dateString] || [];
    const totalTime = stops.reduce((sum, stop) => sum + (parseFloat(stop.duration) || 0), 0);
    const totalCost = stops.reduce((sum, stop) => sum + (parseFloat(stop.estimated_cost) || 0), 0);
    return { stopCount: stops.length, totalTime, totalCost };
  };

  // Drag and drop handlers for new events
  const handleDragStart = (e, event) => {
    setDraggedEvent(event);
    e.dataTransfer.effectAllowed = 'copy';
  };

  // Drag and drop handlers for existing stops
  const handleStopDragStart = (e, stop, dayString) => {
    setDraggedStop({ stop, originalDay: dayString });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleStopDragOver = (e, stopId) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverStop(stopId);
  };

  const handleStopDrop = async (e, targetStop, targetDay) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedStop) return;
    
    setDragOverStop(null);
    
    // Reorder stops within the same day or move to different day
    try {
      const stops = itinerary[targetDay] || [];
      const targetIndex = stops.findIndex(s => s.id === targetStop.id);
      
      // Update the dragged stop's date
      await axios.patch(`http://127.0.0.1:8000/api/itinerary/${draggedStop.stop.id}/`, {
        date: targetDay
      });
      
      await fetchItinerary();
      setDraggedStop(null);
    } catch (error) {
      console.error('Error reordering stop:', error);
    }
  };

  const handleDragOver = (e, dayInfo) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverDay(dayInfo.dateString);
  };

  const handleDragLeave = (e) => {
    setDragOverDay(null);
  };

  const handleDeleteDragOver = (e) => {
    e.preventDefault();
    setIsOverDeleteZone(true);
  };

  const handleDeleteDragLeave = () => {
    setIsOverDeleteZone(false);
  };

  const handleDeleteDrop = async (e) => {
    e.preventDefault();
    setIsOverDeleteZone(false);
    
    if (!draggedStop) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/api/itinerary/${draggedStop.stop.id}/`);
      await fetchItinerary();
      setDraggedStop(null);
    } catch (error) {
      console.error('Error deleting stop:', error);
    }
  };

  const handleDrop = async (e, dayInfo) => {
    e.preventDefault();
    setDragOverDay(null);
    
    // Handle moving existing stop to new day
    if (draggedStop) {
      try {
        await axios.patch(`http://127.0.0.1:8000/api/itinerary/${draggedStop.stop.id}/`, {
          date: dayInfo.dateString
        });
        await fetchItinerary();
        setDraggedStop(null);
      } catch (error) {
        console.error('Error moving stop:', error);
      }
      return;
    }
    
    if (!draggedEvent) return;

    try {
      // Add the dragged event as a stop
      await axios.post(`http://127.0.0.1:8000/api/trips/${trip.id}/itinerary/`, {
        location: draggedEvent.name,
        activity: draggedEvent.description,
        duration: draggedEvent.duration,
        estimated_cost: draggedEvent.estimatedCost,
        date: dayInfo.dateString,
        trip: trip.id,
        notes: `Category: ${draggedEvent.category}`
      });
      
      await fetchItinerary();
      setDraggedEvent(null);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Itinerary - 2/3 width */}
      <div className="lg:col-span-2 space-y-6">
        {/* Delete Zone */}
        {draggedStop && (
          <div
            onDragOver={handleDeleteDragOver}
            onDragLeave={handleDeleteDragLeave}
            onDrop={handleDeleteDrop}
            className={`sticky top-4 z-10 p-6 rounded-xl border-2 border-dashed transition-all ${
              isOverDeleteZone
                ? 'bg-red-100 border-red-500'
                : 'bg-red-50 border-red-300'
            }`}
          >
            <div className="flex items-center justify-center gap-3 text-red-600">
              <Trash2 size={24} />
              <p className="font-semibold">
                {isOverDeleteZone ? 'Release to delete' : 'Drag here to remove activity'}
              </p>
            </div>
          </div>
        )}
        
        {/* Flight Information Section */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div 
          className="flex justify-between items-center p-6 cursor-pointer hover:bg-gray-50 transition"
          onClick={() => setIsFlightSectionExpanded(!isFlightSectionExpanded)}
        >
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Plane className="text-blue-600" size={20} />
            Flight Information
            {flights.length > 0 && (
              <span className="text-sm font-normal text-gray-500">({flights.length} flight{flights.length !== 1 ? 's' : ''})</span>
            )}
          </h3>
          <div className="flex items-center gap-2">
            {isFlightSectionExpanded && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFlightModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={18} />
                Add Flight
              </button>
            )}
            {isFlightSectionExpanded ? (
              <ChevronUp className="text-gray-600" size={24} />
            ) : (
              <ChevronDown className="text-gray-600" size={24} />
            )}
          </div>
        </div>

        {isFlightSectionExpanded && (
          <div className="px-6 pb-6 border-t border-gray-200 pt-4">
            {flights.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-xl">
                <Plane className="mx-auto text-gray-300 mb-3" size={48} />
                <p className="text-gray-400 mb-2">No flights added yet</p>
                <p className="text-sm text-gray-400">Add your flight details to see boarding pass information</p>
              </div>
            ) : (
              <div className="space-y-4">
                {flights.map(flight => (
                  <FlightCard 
                    key={flight.id} 
                    flight={flight}
                    onDelete={handleDeleteFlight}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Days Itinerary */}
      {days.map((day) => {
        const stats = calculateDayStats(day.dateString);
        const stops = itinerary[day.dateString] || [];

        return (
          <div 
            key={day.dateString} 
            className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
              dragOverDay === day.dateString 
                ? 'border-teal-500 shadow-lg bg-teal-50' 
                : 'border-gray-200'
            }`}
            onDragOver={(e) => handleDragOver(e, day)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, day)}
          >
            {/* Day Header */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="text-teal-600" size={20} />
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Day {day.dayNumber}</h3>
                    <p className="text-sm text-gray-600">
                      {day.date.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-600">
                  <p>{stats.stopCount} stops · {stats.totalTime}h</p>
                  <p className="font-medium">${stats.totalCost.toFixed(2)} estimated</p>
                </div>
              </div>
            </div>

            {/* Stops List */}
            <div className="p-6">
              {dragOverDay === day.dateString && (
                <div className="mb-4 p-4 border-2 border-dashed border-teal-400 rounded-lg bg-teal-50 text-center">
                  <p className="text-teal-600 font-medium">Drop here to add to Day {day.dayNumber}</p>
                </div>
              )}
              
              {stops.length === 0 ? (
                <div className="text-center py-8">
                  <Route className="mx-auto text-gray-300 mb-3" size={48} />
                  <p className="text-gray-400 mb-2">No stops planned yet</p>
                  <p className="text-sm text-gray-400 mb-4">Add your first destination for this day</p>
                  <button
                    onClick={() => handleAddStop(day)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                  >
                    <Plus size={18} />
                    Add Stop
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {stops.map((stop, index) => (
                    <div key={stop.id}>
                      {/* Stop Card */}
                      <div 
                        draggable
                        onDragStart={(e) => handleStopDragStart(e, stop, day.dateString)}
                        onDragOver={(e) => handleStopDragOver(e, stop.id)}
                        onDrop={(e) => handleStopDrop(e, stop, day.dateString)}
                        className={`flex gap-4 p-4 rounded-lg transition cursor-move ${
                          dragOverStop === stop.id 
                            ? 'bg-teal-100 border-2 border-teal-400' 
                            : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                        }`}
                      >
                        <div className="flex-shrink-0 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{stop.location}</h4>
                          {stop.activity && <p className="text-sm text-gray-600 mt-1">{stop.activity}</p>}
                          {stop.notes && <p className="text-sm text-gray-500 mt-1 italic">{stop.notes}</p>}
                          <div className="flex gap-4 mt-2 text-xs text-gray-500">
                            {stop.time && <span>⏰ {stop.time}</span>}
                            {stop.duration && <span>⏱️ {stop.duration}h</span>}
                            {stop.estimated_cost > 0 && <span>💰 ${stop.estimated_cost}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Travel Method Button */}
                      {index < stops.length - 1 && (
                        <div className="relative h-12 flex items-center justify-center">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t-2 border-dashed border-gray-300"></div>
                          </div>
                          <button
                            onClick={() => handleAddTravelMethod(stop, stops[index + 1])}
                            className="relative px-3 py-1.5 bg-white border-2 border-gray-300 rounded-full text-xs font-medium text-gray-600 hover:border-teal-500 hover:text-teal-600 hover:bg-teal-50 transition flex items-center gap-1.5 shadow-sm"
                          >
                            <ArrowRight size={14} />
                            {(() => {
                              const methods = getTravelMethodsForConnection(stop.id, stops[index + 1].id);
                              if (methods.length > 0) {
                                const totalDuration = methods.reduce((sum, m) => sum + parseFloat(m.duration), 0);
                                const transferCount = methods.length - 1;
                                return `${totalDuration} min • ${transferCount > 0 ? `${transferCount} transfer${transferCount !== 1 ? 's' : ''}` : methods[0].mode}`;
                              }
                              return 'Add Travel';
                            })()}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => handleAddStop(day)}
                    className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-teal-500 hover:text-teal-600 transition flex items-center justify-center gap-2"
                  >
                    <Plus size={18} />
                    Add Stop
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <AddStopModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDay(null);
        }}
        onSubmit={handleSubmitStop}
        day={selectedDay}
      />
      </div>

      {/* Suggested Events Sidebar - 1/3 width */}
      <div className="lg:col-span-1">
        <SuggestedEvents 
          destination={trip.destination} 
          onDragStart={handleDragStart}
        />
      </div>

      <AddFlightModal
        isOpen={isFlightModalOpen}
        onClose={() => setIsFlightModalOpen(false)}
        onSubmit={handleAddFlight}
      />

      <AddTravelMethodModal
        isOpen={isTravelModalOpen}
        onClose={() => {
          setIsTravelModalOpen(false);
          setSelectedFromStop(null);
          setSelectedToStop(null);
        }}
        onSubmit={handleSubmitTravelMethod}
        fromStop={selectedFromStop}
        toStop={selectedToStop}
        existingMethods={selectedFromStop && selectedToStop ? getTravelMethodsForConnection(selectedFromStop.id, selectedToStop.id) : null}
      />

      <ViewTravelMethodModal
        isOpen={isViewTravelModalOpen}
        onClose={() => {
          setIsViewTravelModalOpen(false);
          setSelectedFromStop(null);
          setSelectedToStop(null);
        }}
        onEdit={handleEditTravelMethod}
        fromStop={selectedFromStop}
        toStop={selectedToStop}
        travelMethods={selectedFromStop && selectedToStop ? getTravelMethodsForConnection(selectedFromStop.id, selectedToStop.id) : []}
      />
    </div>
  );
}
