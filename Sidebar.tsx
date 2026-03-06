import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Map as MapIcon,
  CreditCard, 
  Calendar, 
  Users, 
  User, 
  ShoppingBag, 
  History, 
  LogOut, 
  ShieldCheck, 
  Dumbbell, 
  BarChart3,
  AlertTriangle, 
  X,
  Mail
} from 'lucide-react';
import { ViewType, User as UserType } from '../types';

interface SidebarProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  onLogout: () => void;
  t: (key: any) => string;
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate, onLogout, t, isOpen, onClose, user }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = useMemo(() => [
    { id: ViewType.DASHBOARD, label: t('nav_home'), iconName: 'home' },
    { id: ViewType.MAPA_SEUS, label: t('nav_map'), iconName: 'map' },
    { id: ViewType.COMPRAR_PREMS, label: t('nav_buy'), iconName: 'credit-card' },
    { id: ViewType.MIS_RESERVAS, label: t('nav_reservations'), iconName: 'calendar' },
    { id: ViewType.MIS_HIJOS, label: t('nav_kids'), iconName: 'users' },
    { id: ViewType.BUZON, label: t('nav_buzon'), iconName: 'mail' },
    { id: ViewType.MIS_COMPRAS, label: t('nav_purchases'), iconName: 'shopping-bag' },
  ], [t]);

  const renderIcon = (name: string, size = 18) => {
    switch (name) {
      case 'home': return <Home size={size} />;
      case 'map': return <MapIcon size={size} />;
      case 'credit-card': return <CreditCard size={size} />;
      case 'calendar': return <Calendar size={size} />;
      case 'users': return <Users size={size} />;
      case 'user': return <User size={size} />;
      case 'shopping-bag': return <ShoppingBag size={size} />;
      case 'history': return <History size={size} />;
      case 'mail': return <Mail size={size} />;
      default: return null;
    }
  };

  const showCoordination = user.role === 'Admin' || user.role === 'Coordinador';
  const showAdmin = user.role === 'Admin';
  const showCoach = user.role === 'Admin' || user.role === 'Coordinador' || user.role === 'Coach';
  const showQuickAccess = user.role !== 'Famil';

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[55] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      <aside 
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col h-full shrink-0 z-[60] transition-transform duration-300 ease-in-out transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:absolute lg:invisible'
        }`}
      >
        <div className="p-8 border-b border-gray-50 flex items-center justify-between">
          <h1 className="text-xl font-black text-prem-gold tracking-tighter uppercase">PREM ACADEMY</h1>
          <button onClick={onClose} className="lg:hidden p-2 text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-8 px-4 space-y-10">
          <div>
            <nav className="space-y-2">
              {menuItems.map((item, idx) => (
                <button
                  key={`${item.id}-${idx}`}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    currentView === item.id 
                    ? 'sidebar-active shadow-sm text-prem-gold bg-gray-50' 
                    : 'text-gray-400 hover:bg-gray-50 hover:text-prem-gold'
                  }`}
                >
                  <span className={currentView === item.id ? 'text-prem-gold' : 'text-gray-300'}>
                    {renderIcon(item.iconName)}
                  </span>
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {showQuickAccess && (
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 mb-6 px-3 tracking-widest">ACCESOS RÁPIDOS</p>
              <div className="space-y-3 px-1">
                {showAdmin && (
                  <button
                    onClick={() => onNavigate(ViewType.ADMIN_PANEL)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-xs font-bold transition-all shadow-sm ${
                      currentView === ViewType.ADMIN_PANEL 
                      ? 'bg-black text-prem-gold border-black' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-prem-gold'
                    }`}
                  >
                    <ShieldCheck size={16} className="text-prem-gold" />
                    {t('nav_admin')}
                  </button>
                )}
                {showCoordination && (
                  <button
                    onClick={() => onNavigate(ViewType.COORDINATION_PANEL)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-xs font-bold transition-all shadow-sm ${
                      currentView === ViewType.COORDINATION_PANEL 
                      ? 'bg-black text-prem-gold border-black' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-prem-gold'
                    }`}
                  >
                    <BarChart3 size={16} className="text-prem-gold" />
                    {t('nav_coord')}
                  </button>
                )}
                {showCoach && (
                  <button
                    onClick={() => onNavigate(ViewType.COACH_PANEL)}
                    className={`w-full flex items-center gap-3 px-4 py-3 border rounded-xl text-xs font-bold transition-all shadow-sm ${
                      currentView === ViewType.COACH_PANEL 
                      ? 'bg-black text-prem-gold border-black' 
                      : 'bg-white text-gray-600 border-gray-100 hover:border-prem-gold'
                    }`}
                  >
                    <Dumbbell size={16} className="text-prem-gold" />
                    {t('nav_coach')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-50">
          <button 
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={18} />
            {t('nav_logout')}
          </button>
        </div>
      </aside>

      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-sm rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">{t('logout_modal_title')}</h3>
              <p className="text-gray-400 font-medium mb-8">
                {t('logout_modal_desc')}
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={onLogout}
                  className="w-full py-4 gold-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
                >
                  {t('logout_confirm')}
                </button>
                <button 
                  onClick={() => setShowLogoutModal(false)}
                  className="w-full py-4 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all"
                >
                  {t('logout_cancel')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;