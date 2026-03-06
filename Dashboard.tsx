import React from 'react';
import { User, ViewType, Sede } from '../types';
import ActionCard from './shared/ActionCard';
import StatCard from './shared/StatCard';
import DashboardCalendar from './DashboardCalendar';
import GeminiInsights from './GeminiInsights';
import { Trophy, Zap, Target, Brain } from 'lucide-react';

interface DashboardProps {
  user: User;
  bookings: any[];
  sessions: any[];
  onNavigate: (view: ViewType, sede?: Sede, session?: any) => void;
  t: (key: any) => string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, bookings, sessions, onNavigate, t }) => {
  const renderSkillIcon = (iconName: string) => {
    const props = { size: 16 };
    switch (iconName) {
      case 'zap': return <Zap {...props} />;
      case 'target': return <Target {...props} />;
      case 'trophy': return <Trophy {...props} />;
      case 'brain': return <Brain {...props} />;
      default: return null;
    }
  };

  const skillItems = [
    { key: 'tecnica', label: t('skill_tech'), iconName: 'zap', color: 'gold-gradient' },
    { key: 'fisico', label: t('skill_phys'), iconName: 'target', color: 'bg-black' },
    { key: 'tactica', label: t('skill_tact'), iconName: 'trophy', color: 'gold-gradient' },
    { key: 'mentalidad', label: t('skill_ment'), iconName: 'brain', color: 'bg-black' },
  ];

  return (
    <div className="space-y-6 md:space-y-12 py-1 md:py-6 animate-in fade-in duration-700">
      {/* 1. SECCIÓ DE BENVINGUDA */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-8">
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-black text-gray-900 mb-0.5 md:mb-2 tracking-tighter uppercase">{t('dashboard_title')}</h1>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
               <p className="text-gray-400 font-medium text-sm md:text-lg">{t('dashboard_welcome')}, <span className="text-gray-900 font-extrabold">{user.name}</span></p>
               <div className="flex items-center gap-2 mt-1 md:mt-2">
                  <span className="text-[8px] md:text-[10px] font-black uppercase text-prem-gold tracking-widest">{t('level_label')} {user.level}</span>
                  <div className="w-24 md:w-48 h-1 md:h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full gold-gradient transition-all duration-1000 ease-out" 
                      style={{ width: `${user.xp}%` }}
                    ></div>
                  </div>
                  <span className="text-[8px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">{user.xp}% XP</span>
               </div>
            </div>
          </div>
        </div>
        <div className="flex w-full md:w-auto">
          <button 
            onClick={() => onNavigate(ViewType.NUEVA_RESERVA)}
            className="w-full md:w-auto px-5 py-3 md:py-4 gold-gradient text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 hover:scale-105 active:scale-95 transition-all"
          >
            {t('dashboard_new_res')}
          </button>
        </div>
      </section>

      {/* 2. ANÀLISI DEL JUGADOR (IA) */}
      <div className="w-full">
        <GeminiInsights user={user} />
      </div>

      {/* 3. BLOCS D'ACCIÓ (BALANCE, TECNIFICACIONS, BOTIGA) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
        <ActionCard 
          title={t('dashboard_tecnis_title')}
          value={user.premsBalance}
          subValue={t('dashboard_tecnis_sub')}
          description={t('dashboard_tecnis_desc')}
          buttonText={t('dashboard_tecnis_btn')}
          onButtonClick={() => onNavigate(ViewType.COMPRAR_PREMS)}
        />
        <ActionCard 
          title={t('dashboard_tecni_title')}
          description={t('dashboard_tecni_desc')}
          buttonText={t('dashboard_new_res')}
          onButtonClick={() => onNavigate(ViewType.NUEVA_RESERVA)}
        />
        <ActionCard 
          title={t('dashboard_shop_title')}
          description={t('dashboard_shop_desc')}
          buttonText={t('dashboard_shop_btn')}
          onButtonClick={() => onNavigate(ViewType.MIS_COMPRAS)}
        />
      </div>

      {/* 4. CALENDARI DE PRÒXIMS ENTRENAMENTS */}
      <div className="w-full">
        <DashboardCalendar 
          t={t} 
          bookings={bookings} 
          sessions={sessions}
          onReserve={(session) => onNavigate(ViewType.NUEVA_RESERVA, undefined, session)}
        />
      </div>

      {/* 5. EVOLUCIÓ TÈCNICA (FINAL DE PÀGINA ABANS DE STATS) */}
      <div className="bg-white rounded-[24px] md:rounded-[40px] p-5 md:p-10 border border-gray-100 shadow-xl card-shadow flex flex-col relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-4 md:p-6 opacity-[0.05] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Zap size={100} className="text-prem-gold md:w-[140px] md:h-[140px]" />
         </div>
         <div className="relative z-10">
            <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tighter mb-4 md:mb-8">Evolució Tècnica</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              {skillItems.map((skill) => (
                <div key={skill.key} className="space-y-1.5 md:space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-prem-gold">{renderSkillIcon(skill.iconName)}</span>
                      <span className="text-[9px] md:text-[10px] font-black uppercase text-gray-400 tracking-widest">{skill.label}</span>
                    </div>
                    <span className="text-[10px] md:text-xs font-black text-gray-900">{(user.skills as any)[skill.key]}%</span>
                  </div>
                  <div className="w-full h-1 md:h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${skill.color} transition-all duration-1000 delay-300`} 
                      style={{ width: `${(user.skills as any)[skill.key]}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>

      {/* 6. ESTADÍSTIQUES (ESTANCIAS) A BAIX DE TOT */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        <StatCard 
          title={t('stat_next')}
          value={bookings.length}
          linkText={t('stat_view_res')}
          onLinkClick={() => onNavigate(ViewType.MIS_RESERVAS)}
          iconName="zap"
        />
        <StatCard 
          title={t('stat_done')}
          value={12}
          linkText={t('stat_view_res')}
          onLinkClick={() => onNavigate(ViewType.MIS_RESERVAS)}
          iconName="trophy"
        />
        <StatCard 
          title={t('stat_spent')}
          value={`18`}
          linkText={t('stat_view_hist')}
          onLinkClick={() => onNavigate(ViewType.HISTORIAL)}
          iconName="target"
        />
        <StatCard 
          title={t('stat_kids')}
          value={1}
          linkText={t('stat_view_kids')}
          onLinkClick={() => onNavigate(ViewType.MIS_HIJOS)}
          iconName="brain"
        />
      </div>
    </div>
  );
};

export default Dashboard;