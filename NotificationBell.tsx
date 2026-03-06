import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Calendar, CreditCard, Info, CheckCircle2, AlertCircle } from 'lucide-react';
import { Notification, NotificationType } from '../types';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'session': return <Calendar className="text-blue-500" size={16} />;
      case 'payment': return <CreditCard className="text-amber-500" size={16} />;
      case 'success': return <CheckCircle2 className="text-green-500" size={16} />;
      case 'error': return <AlertCircle className="text-red-500" size={16} />;
      case 'warning': return <AlertCircle className="text-orange-500" size={16} />;
      default: return <Info className="text-gray-400" size={16} />;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Ara mateix';
    if (diffInSeconds < 3600) return `Fa ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `Fa ${Math.floor(diffInSeconds / 3600)} h`;
    return date.toLocaleDateString('ca-ES', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 bg-gray-50 text-gray-400 hover:text-prem-gold hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100 relative group"
      >
        <Bell size={20} className={unreadCount > 0 ? 'animate-swing' : ''} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white animate-in zoom-in duration-300">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-[24px] shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Notificacions</h3>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{unreadCount} pendents</span>
          </div>

          <div className="max-h-[400px] overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Bell size={32} className="mx-auto text-gray-100 mb-3" />
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No tens cap notificació</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-5 hover:bg-gray-50 transition-colors cursor-pointer relative group ${!notification.isRead ? 'bg-prem-gold/5' : ''}`}
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        !notification.isRead ? 'bg-white shadow-sm border border-gray-100' : 'bg-gray-50'
                      }`}>
                        {getIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className={`text-xs font-black uppercase tracking-tight truncate ${!notification.isRead ? 'text-gray-900' : 'text-gray-500'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[8px] font-bold text-gray-300 uppercase shrink-0 ml-2">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className={`text-[10px] leading-relaxed ${!notification.isRead ? 'text-gray-600 font-bold' : 'text-gray-400 font-medium'}`}>
                          {notification.message}
                        </p>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="absolute top-1/2 -translate-y-1/2 right-2 w-1.5 h-1.5 bg-prem-gold rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-4 border-t border-gray-50 bg-gray-50/30 text-center">
              <button className="text-[9px] font-black text-prem-gold uppercase tracking-widest hover:underline">
                Veure-ho tot
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
