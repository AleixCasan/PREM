
import React from 'react';
import { Menu } from 'lucide-react';
import { User, ViewType, Notification } from '../types';
import NotificationBell from './NotificationBell';

interface HeaderProps {
  user: User;
  t: (key: any) => string;
  onToggleSidebar: () => void;
  onNavigate: (view: ViewType) => void;
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, 
  t, 
  onToggleSidebar, 
  onNavigate,
  notifications,
  onMarkAsRead
}) => {
  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar}
          className="p-2.5 bg-gray-50 text-gray-400 hover:text-prem-gold hover:bg-white rounded-xl transition-all shadow-sm border border-transparent hover:border-gray-100"
          title="Toggle Menu"
        >
          <Menu size={20} />
        </button>
        <span className="hidden sm:inline text-gray-400 font-bold text-sm tracking-widest uppercase">{t('header_gestec')}</span>
      </div>

      <div className="flex items-center gap-4 lg:gap-8">
        <div className="flex items-center gap-3">
          <NotificationBell notifications={notifications} onMarkAsRead={onMarkAsRead} />
          
          <div className="flex items-center gap-3 lg:gap-5 bg-white px-4 lg:px-6 py-2 rounded-full border border-gray-100 shadow-sm">
            <span className="hidden md:inline text-[10px] font-black text-gray-300 uppercase tracking-widest">{t('header_balance')}</span>
            <span className="text-base lg:text-xl font-black text-prem-gold leading-none">{user.premsBalance} <span className="text-[10px] lg:text-xs font-bold uppercase">prems</span></span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate(ViewType.MI_PERFIL)}
            className="w-10 h-10 lg:w-12 lg:h-12 gold-gradient rounded-full flex items-center justify-center text-white font-black text-xs lg:text-sm shadow-lg border-2 border-white ring-1 ring-gray-100 hover:scale-105 active:scale-95 transition-all outline-none focus:ring-2 focus:ring-prem-gold/50"
            title={t('nav_profile')}
          >
            {user.initials}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
