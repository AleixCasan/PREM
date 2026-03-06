import React from 'react';
import { ActionCardProps } from '../../types';

const ActionCard: React.FC<ActionCardProps> = ({ 
  title, 
  description, 
  value, 
  subValue, 
  buttonText, 
  onButtonClick 
}) => {
  return (
    <div className="bg-white p-5 md:p-10 rounded-[24px] md:rounded-[32px] border border-gray-100 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 card-shadow">
      <div>
        <h3 className="text-lg md:text-2xl font-black text-gray-900 mb-3 md:mb-8 tracking-tight uppercase">{title}</h3>
        
        {value !== undefined && (
          <div className="mb-3 md:mb-6">
            <span className="text-3xl md:text-6xl font-black text-gray-900 tracking-tighter">{value}</span>
            {subValue && (
              <p className="text-prem-gold text-[9px] md:text-xs font-black mt-1 md:mt-3 uppercase tracking-widest">{subValue}</p>
            )}
          </div>
        )}
        
        <p className="text-gray-400 font-medium leading-relaxed mb-4 md:mb-12 text-xs md:text-base">
          {description}
        </p>
      </div>

      <button
        onClick={onButtonClick}
        className="w-full gold-gradient text-white py-3.5 md:py-4.5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-sm transition-all shadow-xl active:scale-[0.98] uppercase tracking-widest"
      >
        {buttonText}
      </button>
    </div>
  );
};

export default ActionCard;