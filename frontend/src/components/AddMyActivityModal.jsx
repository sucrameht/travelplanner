import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Trash2, ExternalLink } from 'lucide-react';

export default function AddMyActivityModal({ isOpen, onClose, onSubmit, editingActivity }) {
  const [formData, setFormData] = useState({
    place: '',
    activity: '',
    recommended_time: '',
    cost: '',
    photo_url: '',
    links: []
  });

  const [newLink, setNewLink] = useState({ label: '', url: '' });

  useEffect(() => {
    if (editingActivity) {
      setFormData({
        place: editingActivity.place || '',
        activity: editingActivity.activity || '',
        recommended_time: editingActivity.recommended_time || '',
        cost: editingActivity.cost || '',
        photo_url: editingActivity.photo_url || '',
        links: editingActivity.links || []
      });
    } else {
      setFormData({
        place: '',
        activity: '',
        recommended_time: '',
        cost: '',
        photo_url: '',
        links: []
      });
    }
  }, [editingActivity, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      place: '',
      activity: '',
      recommended_time: '',
      cost: '',
      photo_url: '',
      links: []
    });
    setNewLink({ label: '', url: '' });
  };

  const handleAddLink = () => {
    if (newLink.label && newLink.url) {
      setFormData({
        ...formData,
        links: [...formData.links, newLink]
      });
      setNewLink({ label: '', url: '' });
    }
  };

  const handleRemoveLink = (index) => {
    setFormData({
      ...formData,
      links: formData.links.filter((_, i) => i !== index)
    });
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-60 flex items-center justify-center p-4" 
      style={{ zIndex: 99999, margin: 0, padding: '1rem' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col relative" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            {editingActivity ? 'Edit Activity' : 'Add My Activity'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Place */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Place/Location *
            </label>
            <input
              type="text"
              value={formData.place}
              onChange={(e) => setFormData({ ...formData, place: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., Eiffel Tower, Central Park"
              required
            />
          </div>

          {/* Activity Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Activity Description *
            </label>
            <textarea
              value={formData.activity}
              onChange={(e) => setFormData({ ...formData, activity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              placeholder="Describe what you want to do here..."
              rows="4"
              required
            />
          </div>

          {/* Recommended Time */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Recommended Time (hours) *
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={formData.recommended_time}
              onChange={(e) => setFormData({ ...formData, recommended_time: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., 2.5"
              required
            />
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estimated Cost ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.cost}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="e.g., 50.00"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Photo URL
            </label>
            <input
              type="url"
              value={formData.photo_url}
              onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Optional: Add a photo URL from Unsplash, Google Images, etc.</p>
          </div>

          {/* Links Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Booking/Info Links
            </label>
            
            {/* Existing Links */}
            {formData.links.length > 0 && (
              <div className="space-y-2 mb-3">
                {formData.links.map((link, index) => (
                  <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                    <ExternalLink size={16} className="text-teal-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{link.label}</p>
                      <a 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs text-teal-600 hover:underline truncate block"
                      >
                        {link.url}
                      </a>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveLink(index)}
                      className="p-1 hover:bg-red-100 rounded transition"
                    >
                      <Trash2 size={16} className="text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Link */}
            <div className="border border-gray-200 rounded-lg p-3 space-y-2">
              <input
                type="text"
                value={newLink.label}
                onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Link label (e.g., Booking.com, TripAdvisor)"
              />
              <input
                type="url"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={handleAddLink}
                disabled={!newLink.label || !newLink.url}
                className="w-full py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Plus size={16} />
                Add Link
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium"
          >
            {editingActivity ? 'Update Activity' : 'Add Activity'}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
