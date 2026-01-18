import { X, MapPin, Clock, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { createPortal } from 'react-dom';

export default function ViewStopModal({ stop, onClose, dayInfo }) {
  if (!stop) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[99999]">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-start z-10">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{stop.location}</h2>
            {dayInfo && (
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <Calendar size={14} />
                {dayInfo.date.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Photo */}
        {stop.photo_url && (
          <div className="w-full h-64 overflow-hidden">
            <img 
              src={stop.photo_url} 
              alt={stop.location}
              className="w-full h-full object-cover"
              onError={(e) => { 
                e.target.parentElement.style.display = 'none'; 
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Activity Description */}
          {stop.activity && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Activity</h3>
              <p className="text-gray-900">{stop.activity}</p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stop.time && (
              <div className="flex items-start gap-2">
                <Clock size={18} className="text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Time</p>
                  <p className="font-medium">{stop.time}</p>
                </div>
              </div>
            )}

            {stop.duration && (
              <div className="flex items-start gap-2">
                <Clock size={18} className="text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{stop.duration}h</p>
                </div>
              </div>
            )}

            {stop.estimated_cost > 0 && (
              <div className="flex items-start gap-2">
                <DollarSign size={18} className="text-teal-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Estimated Cost</p>
                  <p className="font-medium">${stop.estimated_cost}</p>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {stop.notes && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Notes</h3>
              <p className="text-gray-600 italic">{stop.notes}</p>
            </div>
          )}

          {/* Links */}
          {stop.links && stop.links.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Useful Links</h3>
              <div className="space-y-2">
                {stop.links.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-teal-50 hover:bg-teal-100 rounded-lg transition group"
                  >
                    <ExternalLink size={16} className="text-teal-600 flex-shrink-0" />
                    <span className="text-teal-700 group-hover:text-teal-900 font-medium">
                      {link.label}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
