import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Download, 
  CheckCircle2, 
  History, 
  FileText, 
  Building2, 
  User as UserIcon, 
  MapPin, 
  X, 
  ShieldCheck, 
  Mail, 
  Phone,
  Briefcase,
  ChevronRight,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar
} from 'lucide-react';
import { Transaction } from '../../types';
import { generateInvoicePDF } from '../../services/invoiceService';

interface MisComprasProps {
  transactions: Transaction[];
  billingData: any;
  onUpdateBilling: (data: any) => void;
}

const MisCompras: React.FC<MisComprasProps> = ({ transactions, billingData, onUpdateBilling }) => {
  const [isBillingModalOpen, setIsBillingModalOpen] = useState(false);
  const [localBilling, setLocalBilling] = useState(billingData);

  const handleSaveBilling = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBilling(localBilling);
    setIsBillingModalOpen(false);
  };

  const historial = [
    { id: 1, type: 'consumo', label: 'Sesión Elite Performance', date: 'Avui, 10:30', amount: -15, sede: 'Banyoles' },
    { id: 2, type: 'recarga', label: 'Recarga Pack Premium', date: '12 Mai, 14:20', amount: 50, sede: '-' },
    { id: 3, type: 'consumo', label: 'Sesión Development U12', date: '10 Mai, 18:00', amount: -5, sede: 'Calonge' },
    { id: 4, type: 'consumo', label: 'Sesión Performance Pro', date: '08 Mai, 17:30', amount: -8, sede: 'Banyoles' },
  ];

  return (
    <div className="space-y-8 lg:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl lg:text-4xl font-black text-gray-900 tracking-tighter uppercase">Les meves Compres</h1>
          <p className="text-gray-400 mt-1 italic font-medium text-sm lg:text-base">Historial detallat de totes les teves adquisicions de Prems i facturació.</p>
        </div>
        <button 
          onClick={() => {
            setLocalBilling(billingData);
            setIsBillingModalOpen(true);
          }}
          className="w-full lg:w-auto bg-white border-2 border-prem-gold/20 text-prem-gold hover:bg-prem-gold hover:text-white px-6 lg:px-8 py-3.5 lg:py-4 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-prem-gold/5 active:scale-95 transition-all"
        >
          <Building2 size={18} /> Dades de Facturació
        </button>
      </section>

      <div className="bg-white p-6 lg:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 card-shadow">
        <div className="flex items-center gap-4 lg:gap-6 w-full md:w-auto">
          <div className="w-14 h-14 lg:w-16 lg:h-16 gold-gradient rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
            {billingData.isCompany ? <Briefcase className="w-6 h-6 lg:w-7 lg:h-7" /> : <UserIcon className="w-6 h-6 lg:w-7 lg:h-7" />}
          </div>
          <div className="min-w-0">
            <p className="text-[8px] lg:text-[10px] font-black text-prem-gold uppercase tracking-widest mb-0.5">Perfil de Facturació Actiu</p>
            <h3 className="text-lg lg:text-xl font-black text-gray-900 uppercase tracking-tighter truncate">
              {billingData.isCompany ? billingData.companyName : billingData.name}
            </h3>
            <p className="text-gray-400 text-[10px] lg:text-xs font-bold uppercase tracking-tight truncate">
              {billingData.isCompany ? billingData.companyTaxId : billingData.taxId} · {billingData.city}
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-3 border-l border-gray-50 pl-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Factures</span>
            <span className="text-2xl font-black text-gray-900">{transactions.length}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden card-shadow">
        <div className="p-6 lg:p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
          <div className="flex items-center gap-4">
            <div className="p-2 lg:p-3 bg-white rounded-xl lg:rounded-2xl text-prem-gold shadow-sm border border-gray-50">
              <ShoppingBag className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <h2 className="text-lg lg:text-2xl font-black tracking-tighter uppercase text-gray-900">Registre de Transaccions</h2>
          </div>
          <span className="bg-white px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg lg:rounded-xl text-[8px] lg:text-[10px] font-black text-gray-400 border border-gray-100 shadow-sm uppercase tracking-widest">{transactions.length} operacions</span>
        </div>

        <div className="block lg:hidden divide-y divide-gray-50">
          {transactions.length > 0 ? transactions.map(compra => (
            <div key={compra.id} className="p-6 space-y-4 hover:bg-gray-50/30 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">{compra.date} · {compra.id}</p>
                  <h4 className="font-black text-gray-900 uppercase tracking-tight text-sm leading-tight">{compra.pack}</h4>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-prem-gold leading-none">+{compra.prems}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Prems</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div className="flex flex-col">
                  <span className="text-base font-black text-gray-900 tracking-tighter">{compra.amount.toFixed(2)}€</span>
                  <span className="flex items-center gap-1.5 text-green-600 font-black text-[8px] uppercase tracking-widest mt-0.5">
                    <CheckCircle2 size={10} /> {compra.status}
                  </span>
                </div>
                <button 
                  onClick={() => generateInvoicePDF(compra, billingData)}
                  className="flex items-center gap-2 px-5 py-3 gold-gradient text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-prem-gold/20 active:scale-95"
                >
                  <Download size={14} /> Factura
                </button>
              </div>
            </div>
          )) : (
            <div className="p-16 text-center">
              <History size={48} className="mx-auto text-gray-100 mb-4" />
              <p className="text-gray-400 font-black uppercase tracking-widest text-[10px]">Cap transacció</p>
            </div>
          )}
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 border-b border-gray-50">
              <tr>
                <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Referència</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Data</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Producte</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest text-right">Prems</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest text-right">Import</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Estat</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">Factura (PDF)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {transactions.map(compra => (
                <tr key={compra.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-8 font-black text-gray-900 tracking-tight">{compra.id}</td>
                  <td className="px-10 py-8 text-gray-400 font-bold uppercase text-[10px]">{compra.date}</td>
                  <td className="px-10 py-8">
                    <div className="font-black text-gray-900 uppercase tracking-tight text-sm">{compra.pack}</div>
                  </td>
                  <td className="px-10 py-8 text-right font-black text-prem-gold text-lg">
                    +{compra.prems}
                  </td>
                  <td className="px-10 py-8 text-right font-black text-gray-900 tracking-tighter text-lg">{compra.amount.toFixed(2)}€</td>
                  <td className="px-10 py-8">
                    <span className="flex items-center gap-2 text-green-600 font-black text-[10px] uppercase tracking-widest">
                      <CheckCircle2 size={14} /> {compra.status}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-center">
                    <button 
                      onClick={() => generateInvoicePDF(compra, billingData)}
                      className="p-4 text-gray-300 hover:text-prem-gold bg-gray-50 rounded-2xl transition-all shadow-sm border border-transparent hover:border-prem-gold/20 active:scale-90 group-hover:bg-white"
                      title="Descarregar Factura PDF"
                    >
                      <Download size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden card-shadow">
        <div className="p-6 lg:p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
          <div className="flex items-center gap-4">
            <div className="p-2 lg:p-3 bg-white rounded-xl lg:rounded-2xl text-prem-gold shadow-sm border border-gray-50">
              <History className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <h2 className="text-lg lg:text-2xl font-black tracking-tighter uppercase text-gray-900">Historial d'Activitat</h2>
          </div>
          <button className="flex items-center gap-2 text-[8px] lg:text-[10px] font-black text-gray-400 hover:text-prem-gold uppercase tracking-widest transition-colors">
            <Calendar size={14} /> Filtrar Moviments
          </button>
        </div>

        <div className="divide-y divide-gray-50">
          {historial.map(item => (
            <div key={item.id} className="p-6 lg:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-4 lg:gap-6">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl flex items-center justify-center ${item.type === 'recarga' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {item.type === 'recarga' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h3 className="text-sm lg:text-lg font-black text-gray-900 leading-tight uppercase tracking-tight">{item.label}</h3>
                  <div className="flex items-center gap-2 lg:gap-3 mt-1">
                    <span className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.date}</span>
                    <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                    <span className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{item.sede}</span>
                  </div>
                </div>
              </div>

              <div className={`text-lg lg:text-2xl font-black ${item.type === 'recarga' ? 'text-green-600' : 'text-gray-900'}`}>
                {item.amount > 0 ? `+${item.amount}` : item.amount} 
                <span className="text-[8px] lg:text-[10px] uppercase font-bold text-gray-300 ml-1.5 lg:ml-2">Prems</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isBillingModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 lg:p-6 bg-black/50 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="p-8 lg:p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tighter uppercase">Dades de Facturació</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configura el teu perfil legal.</p>
                </div>
              </div>
              <button onClick={() => setIsBillingModalOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveBilling} className="p-8 lg:p-10 overflow-y-auto no-scrollbar space-y-6 lg:space-y-8">
              <div className="flex items-center justify-between p-5 lg:p-6 bg-gray-50 rounded-3xl border border-gray-100">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 lg:w-12 h-12 bg-white rounded-xl flex items-center justify-center text-prem-gold shadow-sm">
                      <Briefcase size={20} />
                   </div>
                   <div>
                      <p className="text-xs lg:text-sm font-black text-gray-900 uppercase tracking-tight">Factura a nom d'empresa</p>
                      <p className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-tight">Activa per NIF i Raó Social.</p>
                   </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={localBilling.isCompany} 
                    onChange={(e) => setLocalBilling({...localBilling, isCompany: e.target.checked})}
                    className="sr-only peer" 
                  />
                  <div className="w-12 h-7 lg:w-14 lg:h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 lg:after:h-6 after:w-5 lg:after:w-6 after:transition-all peer-checked:bg-prem-gold"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
                {localBilling.isCompany && (
                  <>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[9px] lg:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Raó Social</label>
                      <input 
                        type="text" 
                        required 
                        value={localBilling.companyName} 
                        onChange={e => setLocalBilling({...localBilling, companyName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 lg:px-6 py-3.5 lg:py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                        placeholder="Nom de l'empresa..."
                      />
                    </div>
                    <div className="space-y-2 md:col-span-1">
                      <label className="text-[9px] lg:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">NIF</label>
                      <input 
                        type="text" 
                        required 
                        value={localBilling.companyTaxId} 
                        onChange={e => setLocalBilling({...localBilling, companyTaxId: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 lg:px-6 py-3.5 lg:py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                        placeholder="J00000000"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nom i Cognoms</label>
                  <input 
                    type="text" 
                    required 
                    value={localBilling.name} 
                    onChange={e => setLocalBilling({...localBilling, name: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 lg:px-6 py-3.5 lg:py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">DNI / NIE</label>
                  <input 
                    type="text" 
                    required 
                    value={localBilling.taxId} 
                    onChange={e => setLocalBilling({...localBilling, taxId: e.target.value})}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 lg:px-6 py-3.5 lg:py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Adreça Fiscal</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="text" 
                      required 
                      value={localBilling.address} 
                      onChange={e => setLocalBilling({...localBilling, address: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 lg:py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Email de Facturació</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="email" 
                      required 
                      value={localBilling.email} 
                      onChange={e => setLocalBilling({...localBilling, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 lg:py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] lg:text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Telèfon</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                    <input 
                      type="tel" 
                      value={localBilling.phone} 
                      onChange={e => setLocalBilling({...localBilling, phone: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-6 py-3.5 lg:py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 lg:p-6 bg-prem-gold/5 rounded-[24px] lg:rounded-[32px] border border-prem-gold/10 flex items-center gap-4">
                 <ShieldCheck size={24} className="text-prem-gold shrink-0" />
                 <p className="text-[8px] lg:text-[10px] font-bold text-gray-500 uppercase leading-relaxed tracking-tight">
                    Totes les transaccions són processades mitjançant xifrat SSL. Les dades seran tractades segons la LOPD.
                 </p>
              </div>

              <button 
                type="submit" 
                className="w-full py-5 lg:py-6 gold-gradient text-white rounded-[20px] lg:rounded-[24px] font-black text-[11px] lg:text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
              >
                Desar Configuració
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisCompras;