
import React, { useState } from 'react';
import { CreditCard, Zap, Star, Trophy, X, Lock, CheckCircle2, Loader2, Info, Gift, Tag, Ticket, Repeat, History, ShoppingBag, Download } from 'lucide-react';
import { ViewType, Transaction, Pack } from '../../types';
import { generateInvoicePDF } from '../../services/invoiceService';

interface ComprarPremsProps {
  onPurchase: (prems: number, amount: number, packName: string) => Transaction;
  onNavigate?: (view: ViewType) => void;
  billingData: any;
  packs: Pack[];
}

const ComprarPrems: React.FC<ComprarPremsProps> = ({ onPurchase, onNavigate, billingData, packs }) => {
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [billingModes, setBillingModes] = useState<Record<string, 'single' | 'monthly'>>({});

  const renderPackIcon = (iconName: string) => {
    const props = { size: 24 };
    switch (iconName) {
      case 'ticket': return <Ticket {...props} />;
      case 'zap': return <Zap {...props} />;
      case 'star': return <Star {...props} />;
      case 'trophy': return <Trophy {...props} />;
      default: return null;
    }
  };

  const handleOpenCheckout = (pack: Pack) => {
    setSelectedPack(pack);
    setIsCheckoutOpen(true);
    setPaymentStatus('idle');
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStatus('processing');
    
    const isMonthly = billingModes[selectedPack!.id] === 'monthly';
    const finalAmount = isMonthly && selectedPack!.months 
      ? selectedPack!.price / selectedPack!.months 
      : selectedPack!.price;

    setTimeout(() => {
      if (selectedPack) {
        const tx = onPurchase(selectedPack.totalPrems, finalAmount, selectedPack.name);
        setLastTransaction(tx);
        setPaymentStatus('success');
      }
    }, 2000);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setSelectedPack(null);
    setPaymentStatus('idle');
    setLastTransaction(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 tracking-tighter uppercase">Comprar Prems</h1>
        <p className="text-gray-400 mt-1 italic font-medium text-xs md:text-base">Inverteix en el teu futur. Com més gran és el pack, menor és el cost per sessió.</p>
        
        <div className="mt-4 md:mt-6 inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-50 rounded-lg md:rounded-xl border border-gray-100">
          <Info size={14} md:size={16} className="text-prem-gold" />
          <span className="text-[10px] md:text-xs font-bold text-gray-500">Preu oficial per sessió: <span className="text-gray-900">35 PREMS</span></span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 items-end">
        {packs.map(pack => {
          const isMonthly = billingModes[pack.id] === 'monthly';
          const monthlyPrice = pack.months ? pack.price / pack.months : 0;
          
          return (
            <div 
              key={pack.id} 
              className={`relative bg-white rounded-[24px] md:rounded-[32px] border transition-all duration-500 hover:-translate-y-2 card-shadow group overflow-hidden flex flex-col justify-between h-full ${
                pack.popular ? 'border-prem-gold ring-4 ring-prem-gold/10 md:scale-105 z-10 shadow-2xl' : 'border-gray-100'
              }`}
            >
              {pack.popular && (
                <div className="absolute top-0 inset-x-0 h-1 md:h-1.5 gold-gradient"></div>
              )}
              
              <div className="p-6 md:p-8 pb-0">
                 <div className="flex justify-between items-start mb-4 md:mb-6">
                   <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg ${
                     pack.id === 3 ? 'bg-gray-900' : 
                     pack.id === 2 ? 'gold-gradient' : 
                     pack.id === 1 ? 'bg-blue-500' : 'bg-gray-400'
                   }`}>
                      {renderPackIcon(pack.iconName)}
                   </div>
                   {pack.popular && (
                    <span className="gold-gradient text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase tracking-widest shadow-lg">
                      Recomanat
                    </span>
                   )}
                 </div>

                 <h3 className="text-xl md:text-2xl font-black text-gray-900 uppercase tracking-tight leading-none">{pack.name}</h3>
                 <p className="text-gray-400 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-1 mb-4 md:mb-6">{pack.subtitle}</p>
                 
                 <div className="flex items-baseline gap-1 mb-1 md:mb-2">
                   <span className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter">{pack.realCostPerSession}€</span>
                   <span className="text-xs md:text-sm font-bold text-gray-400 uppercase">/ sessió</span>
                 </div>
                 
                 {pack.allowMonthly ? (
                   <div className="mb-6 mt-4 p-1 bg-gray-100 rounded-xl flex relative">
                     <button 
                       onClick={() => setBillingModes(prev => ({ ...prev, [pack.id]: 'single' }))}
                       className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all z-10 ${!isMonthly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                     >
                       Únic
                     </button>
                     <button 
                       onClick={() => setBillingModes(prev => ({ ...prev, [pack.id]: 'monthly' }))}
                       className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all z-10 ${isMonthly ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
                     >
                       Mensual
                     </button>
                   </div>
                 ) : (
                    <p className="text-xs font-medium text-gray-400 mb-8 mt-2">Pagament únic</p>
                 )}
              </div>

              <div className="bg-gray-50/50 p-8 border-t border-gray-100 space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-600 uppercase">Rebs</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-gray-900">{pack.totalPrems} <span className="text-[10px] text-gray-400">PREMS</span></span>
                    </div>
                 </div>

                 {pack.bonusPrems > 0 ? (
                   <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2">
                         <Gift size={16} className="text-green-600" />
                         <span className="text-xs font-black text-green-700 uppercase tracking-wide">Bonus Gratis</span>
                      </div>
                      <span className="text-lg font-black text-green-700">+{pack.bonusPrems}</span>
                   </div>
                 ) : (
                   <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl border border-gray-200 opacity-50">
                      <div className="flex items-center gap-2">
                         <Gift size={16} className="text-gray-500" />
                         <span className="text-xs font-black text-gray-500 uppercase tracking-wide">Sense Bonus</span>
                      </div>
                      <span className="text-lg font-black text-gray-500">-</span>
                   </div>
                 )}

                 <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Sessions</p>
                      <p className="text-xl font-black text-gray-900">{pack.sessionsCount}</p>
                    </div>
                    <div className={`p-3 rounded-xl border text-center ${pack.popular || pack.id === 3 ? 'bg-prem-gold/10 border-prem-gold/30' : 'bg-white border-gray-100'}`}>
                      <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${pack.popular || pack.id === 3 ? 'text-prem-gold-dark' : 'text-gray-400'}`}>Preu Total</p>
                      <div className="flex items-center justify-center gap-1">
                         <Tag size={14} className={pack.popular || pack.id === 3 ? 'text-prem-gold' : 'text-gray-400'} />
                         <p className={`text-xl font-black ${pack.popular || pack.id === 3 ? 'text-prem-gold' : 'text-gray-900'}`}>{pack.price}€</p>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <button 
                  onClick={() => handleOpenCheckout(pack)}
                  className={`w-full py-5 rounded-2xl font-black text-sm shadow-xl active:scale-95 transition-all flex flex-col items-center justify-center uppercase tracking-widest ${
                    pack.popular 
                      ? 'gold-gradient text-white shadow-prem-gold/20 hover:shadow-prem-gold/40' 
                      : pack.id === 3 
                        ? 'bg-gray-900 text-white shadow-gray-900/20 hover:bg-black'
                        : 'bg-white border-2 border-gray-100 text-gray-900 hover:border-prem-gold hover:text-gold-gradient'
                  }`}
                >
                  {isMonthly ? (
                     <>
                      <span>Subscriure's</span>
                      <span className="text-[10px] opacity-80 mt-1 normal-case">{monthlyPrice.toFixed(2)}€ / mes</span>
                     </>
                  ) : (
                     <span>Comprar Pack</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {isCheckoutOpen && selectedPack && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 relative">
            
            {paymentStatus === 'success' ? (
              <div className="p-12 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 gold-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-prem-gold/20">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter mb-4">¡Compra Completada!</h3>
                <p className="text-gray-400 font-medium mb-6">Has adquirit el <span className="text-gray-900 font-black">{selectedPack.name}</span> amb èxit.</p>
                
                <div className="bg-gray-50 rounded-3xl p-6 mb-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Saldo afegit</span>
                    <span className="text-xl font-black text-prem-gold">+{selectedPack.totalPrems} Prems</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Import pagat</span>
                    <span className="text-xl font-black text-gray-900">
                      {billingModes[selectedPack.id] === 'monthly' && selectedPack.months
                        ? `${(selectedPack.price / selectedPack.months).toFixed(2)}€`
                        : `${selectedPack.price.toFixed(2)}€`
                      }
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button 
                    onClick={() => {
                      if (lastTransaction) generateInvoicePDF(lastTransaction, billingData);
                    }}
                    className="w-full py-5 gold-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <Download size={18} />
                    Descarregar Factura (PDF)
                  </button>
                  <button 
                    onClick={() => {
                      if (onNavigate) onNavigate(ViewType.MIS_COMPRAS);
                      closeCheckout();
                    }}
                    className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-gray-900/10 hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    <ShoppingBag size={18} className="text-prem-gold" />
                    Veure el meu Historial
                  </button>
                  <button 
                    onClick={closeCheckout}
                    className="w-full py-4 text-gray-400 hover:text-gray-900 font-black text-xs uppercase tracking-widest transition-all"
                  >
                    Tancar
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-0">
                <div className="p-8 lg:p-10 border-b border-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-50 text-prem-gold rounded-2xl flex items-center justify-center border border-gray-100">
                      <Lock size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Pagament Segur</h3>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Encriptació SSL de 256 bits</p>
                    </div>
                  </div>
                  <button onClick={() => setIsCheckoutOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-8 lg:p-10">
                  <div className="bg-gray-900 text-white p-6 rounded-3xl mb-10 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <CreditCard size={120} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Pack Seleccionat</p>
                          <h4 className="text-2xl font-black tracking-tight">{selectedPack.name}</h4>
                          {billingModes[selectedPack.id] === 'monthly' && (
                            <span className="text-xs font-bold text-prem-gold uppercase tracking-wide">Subscripció Mensual</span>
                          )}
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-lg">
                           <span className="text-prem-gold font-black">{selectedPack.totalPrems} Prems</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-2">
                        <div className="flex items-center gap-2">
                          {billingModes[selectedPack.id] === 'monthly' ? (
                            <>
                              <Repeat size={16} className="text-prem-gold" />
                              <span className="text-xs font-bold text-white/60">Recurrent</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={16} className="text-prem-gold" />
                              <span className="text-xs font-bold text-white/60">Pagament Únic</span>
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">A Pagar Avui</p>
                          <p className="text-3xl font-black text-prem-gold leading-none">
                            {billingModes[selectedPack.id] === 'monthly' && selectedPack.months
                              ? `${(selectedPack.price / selectedPack.months).toFixed(2)}€`
                              : `${selectedPack.price.toFixed(2)}€`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleProcessPayment} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Titular de la Targeta</label>
                      <input type="text" placeholder="Nom complet..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all" required />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Número de Targeta</label>
                      <div className="relative">
                        <CreditCard className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Caducitat</label>
                        <input type="text" placeholder="MM/YY" className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">CVV</label>
                        <input type="password" placeholder="***" maxLength={3} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all" required />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={paymentStatus === 'processing'}
                      className="w-full py-5 gold-gradient text-white rounded-3xl font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-4"
                    >
                      {paymentStatus === 'processing' ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          Processant...
                        </>
                      ) : (
                        `Pagar ${billingModes[selectedPack.id] === 'monthly' && selectedPack.months ? (selectedPack.price / selectedPack.months).toFixed(2) : selectedPack.price.toFixed(2)}€ ara`
                      )}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprarPrems;
