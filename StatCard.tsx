import React from 'react';
import { Zap, Trophy, Target, Brain } from 'lucide-react';
import { StatCardProps } from '../../types';

const StatCard: React.FC<StatCardProps> = ({ title, value, linkText, onLinkClick, iconName }) => {
  const renderIcon = () => {
    switch (iconName) {
      case 'zap': return <Zap size={14} />;
      case 'trophy': return <Trophy size={14} />;
      case 'target': return <Target size={14} />;
      case 'brain': return <Brain size={14} />;
      default: return null;
    }
  };

  return (
    <div className="bg-white p-4 md:p-8 rounded-[20px] md:rounded-3xl border border-gray-100 group hover:border-prem-gold/40 hover:scale-[1.02] transition-all duration-300 card-shadow">
      <div className="flex items-center justify-between mb-1 md:mb-4">
        <h4 className="text-[7px] md:text-[10px] font-black text-gray-300 uppercase tracking-widest">{title}</h4>
        {iconName && <div className="text-prem-gold opacity-50 hidden sm:block">{renderIcon()}</div>}
      </div>
      <p className="text-xl md:text-3xl font-black text-gray-900 mb-2 md:mb-6 tracking-tight">{value}</p>
      <button 
        onClick={onLinkClick}
        className="text-[8px] md:text-xs font-black text-gray-400 hover:text-prem-gold transition-all flex items-center gap-1 group-hover:translate-x-1 uppercase tracking-widest"
      >
        {linkText}
      </button>
    </div>
  );
};

export default StatCard;