import React, { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, 
  Info, 
  ArrowRight, 
  Star, 
  Navigation, 
  Phone, 
  Calendar, 
  Search, 
  Zap, 
  Globe, 
  Clock,
  ChevronRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Target,
  Image as ImageIcon
} from 'lucide-react';
import { ViewType, Sede, Service } from '../../types';

interface MapaSeusProps {
  t: (key: any) => string;
  onNavigate: (view: ViewType, sede?: Sede) => void;
  initialSedes: Sede[];
}

const MapaSeus: React.FC<MapaSeusProps> = ({ t, onNavigate, initialSedes }) => {
  const [selectedSedeId, setSelectedSedeId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  // Usamos las sedes que vienen por props para reflejar los cambios globales
  const sedes = initialSedes;

  // Define services locally for the map view display
  const serviceDefinitions: Record<string, Partial<Service>> = {
    '1': { name: 'Development Group', category: 'Prem Academy', description: 'Técnica base y coordinación.' },
    '2': { name: 'Performance Group', category: 'Prem Pro', description: 'Alta intensidad y táctica.' },
    '3': { name: 'Elite Pro', category: 'Prem Pro', description: 'Individualizado de élite.' },
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
  };

  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userCoords);
          setIsLocating(false);

          let closestId = sedes[0]?.id;
          let minDistance = Infinity;
          sedes.forEach(s => {
            if (s.lat && s.lng) {
              const dist = calculateDistance(userCoords.lat, userCoords.lng, s.lat, s.lng);
              if (dist < minDistance) {
                minDistance = dist;
                closestId = s.id;
              }
            }
          });
          if (closestId) setSelectedSedeId(closestId);
        },
        () => {
          setIsLocating(false);
          if (sedes.length > 0) setSelectedSedeId(sedes[0].id);
        }
      );
    } else {
      if (sedes.length > 0) setSelectedSedeId(sedes[0].id);
    }
  }, [sedes]);

  const filteredSedes = sedes.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedSede = useMemo(() => 
    sedes.find(s => s.id === selectedSedeId) || sedes[0], 
  [selectedSedeId, sedes]);

  // Reset expanded state when changing sede
  useEffect(() => {
    setIsExpanded(false);
  }, [selectedSedeId]);

  const handleOpenInMaps = () => {
    if (!selectedSede) return;
    if (selectedSede.googleMapsUrl) {
      window.open(selectedSede.googleMapsUrl, '_blank');
      return;
    }
    const url = selectedSede.lat && selectedSede.lng 
      ? `https://www.google.com/maps/search/?api=1&query=${selectedSede.lat},${selectedSede.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedSede.location)}`;
    window.open(url, '_blank');
  };

  if (!selectedSede) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      <section className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase">{t('map_explore')}</h1>
          <p className="text-gray-400 mt-1 italic font-medium">{t('map_desc')}</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por sede o municipio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 shadow-sm transition-all"
            />
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-auto lg:h-[calc(100vh-280px)] min-h-[600px]">
        
        {/* Listado de Sedes Lateral */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto no-scrollbar pr-2 pb-6 lg:pb-0">
          {filteredSedes.map(s => {
            const distance = userLocation && s.lat && s.lng ? calculateDistance(userLocation.lat, userLocation.lng, s.lat, s.lng) : null;
            const isSelected = selectedSedeId === s.id;
            const isLoaded = loadedImages[`list-${s.id}`];
            
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSedeId(s.id)}
                className={`text-left p-5 rounded-[28px] border-2 transition-all duration-500 group relative overflow-hidden flex items-center gap-5 ${
                  isSelected 
                    ? 'bg-white border-prem-gold shadow-2xl shadow-prem-gold/10 ring-1 ring-prem-gold/20' 
                    : 'bg-white border-transparent hover:border-gray-100 shadow-sm'
                }`}
              >
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-md bg-gray-100 relative">
                  {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <Zap size={20} className="text-prem-gold/20 animate-pulse" />
                    </div>
                  )}
                  <img 
                    src={s.image} 
                    alt={s.name} 
                    loading="lazy"
                    decoding="async"
                    onLoad={() => handleImageLoad(`list-${s.id}`)}
                    sizes="(max-width: 1024px) 80px, 80px"
                    className={`w-full h-full object-cover group-hover:scale-110 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`font-black text-lg uppercase tracking-tighter truncate ${isSelected ? 'text-prem-gold' : 'text-gray-900'}`}>{s.name}</h3>
                  <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight truncate flex items-center gap-1.5 mb-2">
                    <MapPin size={10} className="text-prem-gold" /> {s.location}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {distance !== null && (
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${distance < 15 ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                        {distance} km {distance < 15 ? 'Cerca' : ''}
                      </span>
                    )}
                    <span className="text-[8px] font-black text-prem-gold uppercase tracking-widest flex items-center gap-1">
                      <Zap size={8} /> {s.activeServiceIds?.length || 0} PRO
                    </span>
                  </div>
                </div>
                
                <div className={`transition-all duration-500 ${isSelected ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
                  <ChevronRight size={20} className="text-prem-gold" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Mapa y Tarjeta Detallada */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 bg-white rounded-[40px] border border-gray-100 shadow-xl card-shadow overflow-hidden relative min-h-[400px]">
            {/* Branded Map Simulator */}
            <div className="absolute inset-0 bg-[#f8f8f8] flex items-center justify-center">
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#D4AF37 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
              
              {/* Markers Dinámicos stlyized */}
              {filteredSedes.map(s => {
                if (!s.lat || !s.lng) return null;
                const x = ((s.lng - 2.5) / (3.3 - 2.5)) * 100;
                const y = 100 - (((s.lat - 41.7) / (42.4 - 41.7)) * 100);
                const isSelected = selectedSedeId === s.id;

                return (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSedeId(s.id)}
                    className="absolute transition-all duration-700 hover:z-30 group/marker"
                    style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -100%)' }}
                  >
                    <div className="flex flex-col items-center">
                      <div className={`mb-2 px-3 py-1.5 rounded-xl border-2 shadow-2xl transition-all duration-500 flex items-center gap-2 whitespace-nowrap ${
                        isSelected ? 'bg-black border-prem-gold text-white translate-y-[-10px] scale-110' : 'bg-white border-gray-100 text-gray-400 opacity-60'
                      }`}>
                        <span className="text-[10px] font-black uppercase tracking-widest">{s.name}</span>
                      </div>
                      <div className={`relative w-10 h-10 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 ${
                        isSelected ? 'gold-gradient scale-110' : 'bg-gray-400'
                      }`}>
                        <MapPin size={16} className="text-white" />
                        {isSelected && <div className="absolute inset-0 rounded-full gold-gradient animate-ping opacity-20 -z-10"></div>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Tarjeta de Detalle Premium Flotante */}
            <div className={`absolute bottom-6 inset-x-6 transition-all duration-500 z-40 ${isExpanded ? 'top-6' : 'top-auto'}`}>
               <div className={`bg-white/95 backdrop-blur-2xl rounded-[36px] shadow-2xl border border-white flex flex-col card-shadow group/card relative overflow-hidden transition-all duration-500 ${isExpanded ? 'h-full' : 'h-auto p-6 lg:p-10'}`}>
                  
                  {/* Contenido Principal */}
                  <div className={`flex flex-col lg:flex-row items-start gap-8 ${isExpanded ? 'p-6 lg:p-10 overflow-y-auto no-scrollbar' : ''}`}>
                    
                    {/* Foto Protagonista con Optimización Receptiva */}
                    <div className={`rounded-[28px] overflow-hidden shadow-2xl shrink-0 relative transition-all duration-500 bg-gray-100 ${isExpanded ? 'w-full lg:w-80 h-48 lg:h-80' : 'w-full lg:w-72 h-48 lg:h-64'}`}>
                       {!loadedImages[`detail-${selectedSede.id}`] && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                          <ImageIcon size={40} className="text-prem-gold/10 mb-2" />
                          <div className="w-1/2 h-1 bg-prem-gold/5 rounded-full overflow-hidden">
                            <div className="h-full bg-prem-gold/20 animate-loading-bar"></div>
                          </div>
                        </div>
                       )}
                       <img 
                         src={selectedSede.image} 
                         alt={selectedSede.name} 
                         loading="eager"
                         decoding="async"
                         onLoad={() => handleImageLoad(`detail-${selectedSede.id}`)}
                         sizes="(max-width: 768px) 100vw, (max-width: 1024px) 320px, 400px"
                         className={`w-full h-full object-cover transition-all duration-1000 group-hover/card:scale-110 ${loadedImages[`detail-${selectedSede.id}`] ? 'opacity-100' : 'opacity-0'}`}
                       />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                       <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                          <span className="text-white text-[9px] font-black uppercase tracking-widest">Premium Facility</span>
                       </div>
                       <div className="absolute bottom-6 left-6 flex flex-col">
                          <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-2">{selectedSede.name}</h2>
                          <div className="flex items-center gap-2 text-white/70">
                             <MapPin size={14} className="text-prem-gold" />
                             <span className="text-xs font-bold truncate max-w-[180px]">{selectedSede.location}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between gap-6 w-full">
                       <div className="space-y-4">
                          <div className="flex items-center justify-between">
                             <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-prem-gold fill-prem-gold" />)}
                             </div>
                             <button 
                               onClick={handleOpenInMaps}
                               className="text-[10px] font-black text-gray-300 hover:text-prem-gold uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                             >
                               <ExternalLink size={14} /> Abrir en Maps
                             </button>
                          </div>
                          
                          <div className="relative">
                            <p className={`text-gray-500 text-sm leading-relaxed font-medium transition-all duration-300 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                               {selectedSede.description || 'Instalaciones Premium de alto rendimiento.'}
                            </p>
                            <button 
                              onClick={() => setIsExpanded(!isExpanded)}
                              className="text-prem-gold font-black text-[10px] uppercase tracking-widest mt-2 flex items-center gap-1 hover:gap-2 transition-all"
                            >
                              {isExpanded ? (
                                <><ChevronUp size={14} /> Ver menos</>
                              ) : (
                                <><ChevronDown size={14} /> Ver más detalles</>
                              )}
                            </button>
                          </div>

                          {/* Sección Expandida: Servicios */}
                          {isExpanded && selectedSede.activeServiceIds && (
                            <div className="pt-6 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
                               <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                                 <Target size={14} className="text-prem-gold" /> Servicios en esta Sede
                               </h3>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 {selectedSede.activeServiceIds.map(id => {
                                   const service = serviceDefinitions[id];
                                   if (!service) return null;
                                   return (
                                     <div key={id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-4 hover:border-prem-gold/20 transition-all group/service">
                                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm transition-transform group-hover/service:scale-110 ${service.category === 'Prem Pro' ? 'bg-black' : 'gold-gradient'}`}>
                                         <Zap size={16} />
                                       </div>
                                       <div>
                                         <p className="text-[9px] font-black text-prem-gold uppercase tracking-tight mb-0.5">{service.category}</p>
                                         <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter">{service.name}</h4>
                                         <p className="text-[10px] font-medium text-gray-400 mt-1 line-clamp-1">{service.description}</p>
                                       </div>
                                     </div>
                                   );
                                 })}
                               </div>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4 pt-2">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-prem-gold">
                                   <Clock size={16} />
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[8px] font-black text-gray-300 uppercase">Horario</span>
                                   <span className="text-[10px] font-bold text-gray-700">{selectedSede.schedule || 'Consultar'}</span>
                                </div>
                             </div>
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-prem-gold">
                                   <Phone size={16} />
                                </div>
                                <div className="flex flex-col">
                                   <span className="text-[8px] font-black text-gray-300 uppercase">Contacto</span>
                                   <span className="text-[10px] font-bold text-gray-700">{selectedSede.phone || 'N/D'}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* Footer de Acciones */}
                  <div className={`flex items-center gap-4 pt-4 border-t border-gray-100 mt-auto ${isExpanded ? 'p-6 lg:p-10 bg-white sticky bottom-0' : ''}`}>
                    <button 
                      onClick={() => onNavigate(ViewType.MIS_RESERVAS)}
                      className="flex-1 py-4 bg-white border border-gray-100 text-gray-400 hover:text-prem-gold hover:border-prem-gold rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      {t('map_btn_schedule')}
                    </button>
                    <button 
                      onClick={() => onNavigate(ViewType.NUEVA_RESERVA, selectedSede)}
                      className="flex-[2] py-4 gold-gradient text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-prem-gold/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      {t('map_btn_select')}
                      <ArrowRight size={16} />
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default MapaSeus;