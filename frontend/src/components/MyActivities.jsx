import { useState, useEffect } from 'react';
import { Plus, Clock, DollarSign, GripVertical, ExternalLink, Edit, Trash2 } from 'lucide-react';
import axios from 'axios';
import AddMyActivityModal from './AddMyActivityModal';

export default function MyActivities({ tripId, onDragStart }) {
  const [activities, setActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/my-activities/`);
      const tripActivities = response.data.filter(activity => activity.trip === tripId);
      setActivities(tripActivities);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching my activities:', error);
      setActivities([]);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (tripId) {
      fetchActivities();
    }
  }, [tripId]);

  const handleSubmit = async (activityData) => {
    try {
      if (editingActivity) {
        // Update existing activity
        await axios.put(`http://127.0.0.1:8000/api/my-activities/${editingActivity.id}/`, {
          ...activityData,
          trip: tripId
        });
      } else {
        // Create new activity
        await axios.post(`http://127.0.0.1:8000/api/my-activities/`, {
          ...activityData,
          trip: tripId
        });
      }
      setIsModalOpen(false);
      setEditingActivity(null);
      await fetchActivities();
    } catch (error) {
      console.error('Error saving activity:', error);
      alert('Failed to save activity');
    }
  };

  const handleEdit = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleDelete = async (activityId) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;
    
    try {
      await axios.delete(`http://127.0.0.1:8000/api/my-activities/${activityId}/`);
      await fetchActivities();
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Failed to delete activity');
    }
  };

  const handleDragStart = (e, activity) => {
    const eventData = {
      name: activity.place,
      description: activity.activity,
      duration: parseFloat(activity.recommended_time),
      estimatedCost: parseFloat(activity.cost),
      category: 'My Activity',
      links: activity.links || [],
      photo_url: activity.photo_url || ''
    };
    onDragStart(e, eventData);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">📝</span>
          My Activities
        </h3>
        <button
          onClick={() => {
            setEditingActivity(null);
            setIsModalOpen(true);
          }}
          className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
          title="Add Activity"
        >
          <Plus size={18} />
        </button>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Drag activities to add them to your itinerary
      </p>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2">Loading...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-400 mb-2">No activities yet</p>
          <p className="text-sm text-gray-400">Click + to add your first activity</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              draggable
              onDragStart={(e) => handleDragStart(e, activity)}
              className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 cursor-move hover:shadow-lg transition-all"
            >
              {/* Header with drag handle */}
              <div className="flex items-start gap-2 mb-2">
                <GripVertical size={18} className="text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">{activity.place}</h4>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(activity);
                    }}
                    className="p-1 hover:bg-purple-100 rounded transition"
                    title="Edit"
                  >
                    <Edit size={14} className="text-purple-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(activity.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded transition"
                    title="Delete"
                  >
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              </div>

              {/* Photo */}
              {activity.photo_url && (
                <div className="mb-3">
                  <img 
                    src={activity.photo_url} 
                    alt={activity.place}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              )}

              {/* Activity Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{activity.activity}</p>

              {/* Meta Info */}
              <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-purple-600" />
                  <span>{activity.recommended_time}h</span>
                </div>
                {activity.cost > 0 && (
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} className="text-purple-600" />
                    <span>${parseFloat(activity.cost).toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Links */}
              {activity.links && activity.links.length > 0 && (
                <div className="space-y-1 pt-2 border-t border-purple-200">
                  {activity.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 hover:underline"
                    >
                      <ExternalLink size={12} />
                      <span className="truncate">{link.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <AddMyActivityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSubmit={handleSubmit}
        editingActivity={editingActivity}
      />
    </div>
  );
}
