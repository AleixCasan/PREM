import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  User, 
  MoreVertical, 
  Phone, 
  Video, 
  Info, 
  Paperclip, 
  Smile,
  ShieldCheck,
  Dumbbell,
  Users,
  Clock,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Mail,
  X,
  PhoneOff,
  Mic,
  MicOff,
  VideoOff,
  Maximize2,
  FileText,
  Image as ImageIcon,
  Paperclip as PaperclipIcon,
  Download,
  Filter,
  CheckCircle2,
  Star,
  Archive,
  Megaphone,
  Bell,
  Loader2
} from 'lucide-react';
import { User as UserType } from '../../types';

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMe: boolean;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

interface Chat {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  lastMessage: string;
  lastTime: string;
  unreadCount: number;
  online: boolean;
  messages: Message[];
  category?: 'individual' | 'group' | 'support';
  priority?: 'normal' | 'high';
}

interface BuzonProps {
  user: UserType;
  onSendBroadcast?: (data: { subject: string, message: string }) => void;
}

const Buzon: React.FC<BuzonProps> = ({ user, onSendBroadcast }) => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'individual' | 'group' | 'support'>('all');
  
  // Broadcast Modal State
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastData, setBroadcastData] = useState({ subject: '', message: '' });
  const [isSendingBroadcast, setIsSendingBroadcast] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const baseChats: Chat[] = [
      {
        id: 'c1',
        name: 'Coordinació Prem',
        role: 'Suport Tècnic',
        lastMessage: 'Hola, hem rebut correctament el pagament del pack.',
        lastTime: '10:30',
        unreadCount: 1,
        online: true,
        category: 'support',
        priority: 'high',
        messages: [
          { id: 'm1', senderId: 'coord', text: 'Hola, tens algun dubte amb els horaris de Banyoles?', timestamp: '09:15', isMe: false },
          { id: 'm2', senderId: 'user', text: 'Hola! Tot clar, moltes gràcies.', timestamp: '09:45', isMe: true },
          { id: 'm3', senderId: 'coord', text: 'Perfecte. Per cert, hem rebut correctament el pagament del pack.', timestamp: '10:30', isMe: false },
        ]
      },
      {
        id: 'c2',
        name: 'Marc Coach',
        role: 'Coach Personal',
        lastMessage: 'Ens veiem aquesta tarda al camp!',
        lastTime: 'Ahir',
        unreadCount: 0,
        online: false,
        category: 'individual',
        messages: [
          { id: 'm4', senderId: 'user', text: 'Marc, avui arribarem 5 minuts tard.', timestamp: '18:00', isMe: true },
          { id: 'm5', senderId: 'coach', text: 'Cap problema! Ens veiem aquesta tarda al camp!', timestamp: '18:05', isMe: false },
        ]
      }
    ];

    if (user.role === 'Coordinador' || user.role === 'Admin' || user.role === 'Coach') {
      baseChats.push(
        {
          id: 'g1',
          name: 'Grup U12 Banyoles',
          role: 'Grup d\'Entrenament',
          lastMessage: 'Recordeu portar la roba oficial demà.',
          lastTime: '08:45',
          unreadCount: 0,
          online: true,
          category: 'group',
          messages: [
            { id: 'gm1', senderId: 'coach', text: 'Hola equip! Recordeu portar la roba oficial demà.', timestamp: '08:45', isMe: user.role === 'Coach' },
          ]
        },
        {
          id: 'p1',
          name: 'Pol Tarrenchs (Pare)',
          role: 'Família',
          lastMessage: 'He pujat el certificat mèdic.',
          lastTime: 'Fa 2h',
          unreadCount: 2,
          online: true,
          category: 'individual',
          messages: []
        },
        {
          id: 'p2',
          name: 'Pau Comas',
          role: 'Atleta Elite',
          lastMessage: 'Demanava el PDF de la dieta.',
          lastTime: 'Dilluns',
          unreadCount: 0,
          online: false,
          category: 'individual',
          messages: []
        }
      );
    }
    setChats(baseChats);
  }, [user.role]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedChatId, chats]);

  const [activeCall, setActiveCall] = useState<{ type: 'voice' | 'video', status: 'ringing' | 'connected' } | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [callTimer, setCallTimer] = useState(0);

  const selectedChat = chats.find(c => c.id === selectedChatId);

  useEffect(() => {
    let interval: any;
    if (activeCall?.status === 'connected') {
      interval = setInterval(() => setCallTimer(prev => prev + 1), 1000);
    } else {
      setCallTimer(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredChats = chats.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         c.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !selectedChatId) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      senderId: user.id,
      text: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      type: 'text'
    };

    setChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: messageInput,
          lastTime: 'Ara'
        };
      }
      return chat;
    }));

    setMessageInput('');
  };

  const handleFileAttach = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !selectedChatId) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newMessage: Message = {
        id: `m-${Date.now()}`,
        senderId: user.id,
        text: type === 'image' ? 'Imatge enviada' : `Fitxer: ${file.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        type: type,
        fileUrl: event.target?.result as string,
        fileName: file.name
      };

      setChats(prev => prev.map(chat => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: type === 'image' ? '📸 Imatge' : `📁 ${file.name}`,
            lastTime: 'Ara'
          };
        }
        return chat;
      }));
    };

    if (type === 'image') reader.readAsDataURL(file);
    else reader.readAsDataURL(file);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastData.subject || !broadcastData.message) return;

    setIsSendingBroadcast(true);
    setTimeout(() => {
      if (onSendBroadcast) {
        onSendBroadcast(broadcastData);
      }
      setIsSendingBroadcast(false);
      setIsBroadcastModalOpen(false);
      setBroadcastData({ subject: '', message: '' });
    }, 1500);
  };

  const startCall = (type: 'voice' | 'video') => {
    setActiveCall({ type, status: 'ringing' });
    setTimeout(() => setActiveCall({ type, status: 'connected' }), 2000);
  };

  const isManagement = user.role === 'Admin' || user.role === 'Coordinador' || user.role === 'Coach';

  return (
    <div className="h-full flex flex-col lg:flex-row bg-white overflow-hidden relative">
      
      {/* SIDEBAR: CONVERSACIONES */}
      <div className={`lg:w-96 border-r border-gray-100 flex flex-col h-full bg-gray-50/20 ${selectedChatId && 'hidden lg:flex'}`}>
        <div className="p-8 border-b border-gray-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase flex items-center gap-3">
               <Sparkles className="text-prem-gold" size={24} /> Bústia
            </h2>
            {isManagement && (
              <button 
                onClick={() => setIsBroadcastModalOpen(true)}
                className="p-2 bg-gray-50 text-gray-400 hover:text-prem-gold rounded-xl border border-gray-100 transition-all shadow-sm active:scale-95"
                title="Comunicació General"
              >
                <Megaphone size={18} />
              </button>
            )}
          </div>
          
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
            <input 
              type="text" 
              placeholder="Cerca un xat..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
             {[
               { id: 'all', label: 'Tots' },
               { id: 'individual', label: 'Xats' },
               { id: 'group', label: 'Grups' },
               { id: 'support', label: 'Suport' }
             ].map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setActiveCategory(cat.id as any)}
                 className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
                   activeCategory === cat.id 
                    ? 'bg-gray-900 text-white shadow-lg' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                 }`}
               >
                 {cat.label}
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => { setSelectedChatId(chat.id); setShowInfo(false); }}
              className={`w-full p-5 rounded-[28px] flex items-center gap-4 transition-all group border-2 ${
                selectedChatId === chat.id 
                  ? 'bg-white border-prem-gold/30 shadow-xl' 
                  : 'bg-white/50 border-transparent hover:bg-white hover:shadow-md'
              }`}
            >
              <div className="relative">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-105 transition-transform ${
                  chat.category === 'support' ? 'bg-black' : chat.category === 'group' ? 'bg-blue-600' : 'gold-gradient'
                }`}>
                  {chat.category === 'group' ? <Users size={24} /> : chat.name.substring(0, 2).toUpperCase()}
                </div>
                {chat.online && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              
              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="font-black text-gray-900 text-sm truncate uppercase tracking-tight">{chat.name}</h4>
                  <span className="text-[10px] font-bold text-gray-300 whitespace-nowrap">{chat.lastTime}</span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                   <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none ${
                     chat.priority === 'high' ? 'bg-red-50 text-red-500' : 'bg-prem-gold/10 text-prem-gold'
                   }`}>{chat.role}</span>
                </div>
                <p className="text-xs text-gray-400 font-medium truncate italic leading-none">{chat.lastMessage}</p>
              </div>

              {chat.unreadCount > 0 && (
                <div className="w-5 h-5 gold-gradient text-white rounded-lg flex items-center justify-center text-[10px] font-black shadow-md shadow-prem-gold/20">
                  {chat.unreadCount}
                </div>
              )}
            </button>
          ))}
          
          {filteredChats.length === 0 && (
             <div className="py-20 text-center text-gray-300">
               <Mail size={40} className="mx-auto mb-4 opacity-20" />
               <p className="text-[10px] font-black uppercase tracking-widest">Cap xat trobat</p>
             </div>
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className={`flex-1 flex flex-col h-full bg-white relative ${!selectedChatId && 'hidden lg:flex'}`}>
        {selectedChat ? (
          <>
            {/* Header Chat */}
            <div className="p-6 lg:p-8 border-b border-gray-50 flex items-center justify-between shadow-sm relative z-10 bg-white">
              <div className="flex items-center gap-5">
                <button 
                  onClick={() => setSelectedChatId(null)}
                  className="lg:hidden p-2 text-gray-400 hover:text-gray-900"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl flex items-center justify-center text-white font-black text-sm lg:text-lg shadow-lg ${
                  selectedChat.category === 'support' ? 'bg-black' : selectedChat.category === 'group' ? 'bg-blue-600' : 'gold-gradient'
                }`}>
                  {selectedChat.category === 'group' ? <Users size={24} /> : selectedChat.name.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-black text-gray-900 text-lg lg:text-xl uppercase tracking-tighter leading-none mb-1">{selectedChat.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${selectedChat.online ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {selectedChat.online ? 'En línia ara' : 'Desconnectat'} · {selectedChat.role}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                 <button onClick={() => startCall('voice')} className="p-3 text-gray-300 hover:text-prem-gold hover:bg-gray-50 rounded-2xl transition-all"><Phone size={20} /></button>
                 <button onClick={() => startCall('video')} className="p-3 text-gray-300 hover:text-prem-gold hover:bg-gray-50 rounded-2xl transition-all"><Video size={20} /></button>
                 <button onClick={() => setShowInfo(!showInfo)} className={`p-3 transition-all rounded-2xl ${showInfo ? 'bg-prem-gold/10 text-prem-gold' : 'text-gray-300 hover:text-prem-gold hover:bg-gray-50'}`}><Info size={20} /></button>
              </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-gray-50/30 space-y-6">
                {selectedChat.messages.length > 0 ? selectedChat.messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                    <div className={`max-w-[80%] lg:max-w-[60%] space-y-1`}>
                        <div className={`p-5 lg:p-6 rounded-[32px] shadow-sm relative ${
                          msg.isMe 
                            ? 'gold-gradient text-white rounded-tr-md shadow-prem-gold/10' 
                            : 'bg-white border border-gray-100 text-gray-700 rounded-tl-md'
                        }`}>
                          {msg.type === 'image' ? (
                            <div className="space-y-2">
                               <img src={msg.fileUrl} alt="Adjunt" className="rounded-2xl w-full max-h-60 object-cover shadow-sm border-2 border-white/20" />
                               {msg.text && <p className="text-sm lg:text-base font-bold leading-relaxed">{msg.text}</p>}
                            </div>
                          ) : msg.type === 'file' ? (
                            <div className="flex items-center gap-4 bg-black/5 p-3 rounded-2xl">
                               <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-prem-gold shadow-sm"><FileText size={20} /></div>
                               <div className="flex-1 min-w-0">
                                  <p className="text-xs font-black truncate">{msg.fileName}</p>
                                  <p className="text-[9px] font-bold opacity-50 uppercase tracking-widest">Fitxer adjunt</p>
                               </div>
                               <button className="p-2 hover:bg-white rounded-lg transition-colors"><Download size={16} /></button>
                            </div>
                          ) : (
                            <p className="text-sm lg:text-base font-bold leading-relaxed">{msg.text}</p>
                          )}
                        </div>
                        <p className={`text-[9px] font-black uppercase tracking-widest ${msg.isMe ? 'text-right' : 'text-left'} text-gray-300`}>
                          {msg.timestamp} {msg.isMe && '· LLEGIT'}
                        </p>
                    </div>
                  </div>
                )) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-prem-gold shadow-sm border border-gray-100 mb-6">
                        <Mail size={32} className="opacity-20" />
                      </div>
                      <h4 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Inicia la conversa</h4>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Envia un missatge segur a {selectedChat.name}</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {showInfo && (
                <div className="w-80 border-l border-gray-100 bg-white flex flex-col animate-in slide-in-from-right-10 duration-500 hidden xl:flex">
                  <div className="p-8 flex flex-col items-center text-center border-b border-gray-50">
                    <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-white font-black text-3xl shadow-2xl mb-6 ${
                      selectedChat.category === 'support' ? 'bg-black' : selectedChat.category === 'group' ? 'bg-blue-600' : 'gold-gradient'
                    }`}>
                      {selectedChat.category === 'group' ? <Users size={32} /> : selectedChat.name.substring(0, 2).toUpperCase()}
                    </div>
                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-1">{selectedChat.name}</h3>
                    <p className="text-[10px] font-black text-prem-gold uppercase tracking-widest bg-prem-gold/10 px-3 py-1 rounded-full">{selectedChat.role}</p>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Mèdia i Fitxers</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-prem-gold/30 transition-all cursor-pointer group/item">
                          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-prem-gold shadow-sm group-hover/item:bg-prem-gold group-hover/item:text-white transition-all"><FileText size={18} /></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-gray-900 truncate uppercase">Rebut_Maig.pdf</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">2.4 MB · Fa 2 dies</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-4">Accions</h4>
                      <div className="space-y-2">
                        <button className="w-full text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors flex items-center gap-3">
                           <Star size={14} className="text-prem-gold" /> Destacar conversa
                        </button>
                        <button className="w-full text-left p-4 text-[10px] font-black uppercase tracking-widest text-gray-600 hover:bg-gray-50 rounded-2xl transition-colors flex items-center gap-3">
                           <Archive size={14} /> Arxivar xat
                        </button>
                        <button className="w-full text-left p-4 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-50 rounded-2xl transition-colors flex items-center gap-3">
                           <X size={14} /> Silenciar notificacions
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-6 lg:p-8 bg-white border-t border-gray-50 relative z-10 shadow-[0_-10px_25px_rgba(0,0,0,0.02)]">
               <form onSubmit={handleSendMessage} className="flex items-center gap-4">
                  <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => handleFileAttach(e, 'file')} />
                  <input type="file" accept="image/*" ref={imageInputRef} className="hidden" onChange={(e) => handleFileAttach(e, 'image')} />

                  <div className="flex items-center gap-2 text-gray-300">
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="p-3 hover:text-prem-gold hover:bg-gray-50 rounded-xl transition-all"
                      title="Adjuntar fitxer"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => imageInputRef.current?.click()}
                      className="p-3 hover:text-prem-gold hover:bg-gray-50 rounded-xl transition-all"
                      title="Adjuntar foto"
                    >
                      <ImageIcon size={20} />
                    </button>
                  </div>
                  <input 
                    type="text" 
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Escriu un missatge..." 
                    className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 focus:bg-white transition-all shadow-inner"
                  />
                  <button 
                    type="submit"
                    disabled={!messageInput.trim()}
                    className={`p-4 lg:px-8 gold-gradient text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${!messageInput.trim() ? 'opacity-30 grayscale cursor-not-allowed' : 'shadow-prem-gold/20 hover:scale-105'}`}
                  >
                    <span className="hidden lg:inline">Enviar</span>
                    <Send size={18} />
                  </button>
               </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50/10">
             <div className="w-32 h-32 gold-gradient rounded-[48px] flex items-center justify-center text-white shadow-2xl mb-10 relative animate-in zoom-in duration-700">
                <Mail size={60} />
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-900 rounded-full border-4 border-white flex items-center justify-center text-prem-gold shadow-xl">
                   <ShieldCheck size={24} />
                </div>
             </div>
             <h3 className="text-4xl font-black text-gray-900 uppercase tracking-tighter mb-4">Centre de Comunicació</h3>
             <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] max-w-sm mx-auto leading-relaxed mb-12 opacity-60">
               Gestiona totes les teves interaccions amb l'acadèmia des d'un entorn segur i professional.
             </p>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl">
                {[
                  { icon: <ShieldCheck />, label: 'Coordinació', sub: 'Gestió Acadèmica' },
                  { icon: <Dumbbell />, label: 'Coaches', sub: 'Feedback Tècnic' },
                  { icon: <Users />, label: 'Grups', sub: 'Comunicació d\'Equip' }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center hover:shadow-xl hover:border-prem-gold/20 transition-all group">
                     <div className="text-prem-gold mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
                     <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-900">{item.label}</h5>
                     <p className="text-[8px] font-bold text-gray-300 mt-1 uppercase tracking-tight">{item.sub}</p>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* MODAL COMUNICACIÓ GENERAL (BROADCAST) */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="p-8 lg:p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                    <Megaphone size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Comunicació Global</h3>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Envia un avís a totes les famílies.</p>
                  </div>
                </div>
                <button onClick={() => setIsBroadcastModalOpen(false)} className="p-2 text-gray-300 hover:text-gray-900 transition-colors">
                  <X size={24} />
                </button>
             </div>

             <form onSubmit={handleBroadcastSubmit} className="p-8 lg:p-10 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Assumpte de la notificació</label>
                   <input 
                      type="text" 
                      required 
                      value={broadcastData.subject}
                      onChange={(e) => setBroadcastData({...broadcastData, subject: e.target.value})}
                      placeholder="Ex: Anul·lació Entrenament Banyoles" 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                   />
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Missatge detallat</label>
                   <textarea 
                      required 
                      value={broadcastData.message}
                      onChange={(e) => setBroadcastData({...broadcastData, message: e.target.value})}
                      placeholder="Escriu aquí la comunicació..." 
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 min-h-[120px] resize-none"
                   />
                </div>

                <div className="p-5 bg-prem-gold/5 rounded-3xl border border-prem-gold/10 flex items-start gap-4">
                   <Bell size={20} className="text-prem-gold shrink-0 mt-1" />
                   <p className="text-[9px] font-bold text-gray-500 uppercase leading-relaxed">
                     Aquesta notificació s'enviarà via Email, SMS i App a tots els usuaris actius de l'acadèmia.
                   </p>
                </div>

                <button 
                  type="submit"
                  disabled={isSendingBroadcast}
                  className="w-full py-5 gold-gradient text-white rounded-3xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  {isSendingBroadcast ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Enviant notificacions...
                    </>
                  ) : (
                    <>
                      <Send size={18} /> Enviar Comunicat Ara
                    </>
                  )}
                </button>
             </form>
          </div>
        </div>
      )}

      {/* OVERLAY LLAMADA */}
      {activeCall && (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <div className="w-full h-full gold-gradient animate-pulse blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
            <div className={`w-32 h-32 lg:w-48 lg:h-48 rounded-[48px] flex items-center justify-center text-white font-black text-4xl lg:text-6xl shadow-[0_0_50px_rgba(212,175,55,0.3)] mb-10 border-4 border-white/20 relative group ${
              selectedChat?.category === 'support' ? 'bg-black' : selectedChat?.category === 'group' ? 'bg-blue-600' : 'gold-gradient'
            }`}>
              {selectedChat?.category === 'group' ? <Users size={48} /> : selectedChat?.name.substring(0, 2).toUpperCase()}
              {activeCall.type === 'video' && activeCall.status === 'connected' && (
                <div className="absolute inset-0 rounded-[44px] overflow-hidden bg-gray-900">
                  <div className="w-full h-full flex items-center justify-center text-white/10 italic text-sm font-black uppercase tracking-widest">Atleta Live</div>
                  <div className="absolute bottom-4 right-4 w-16 h-24 lg:w-24 lg:h-32 bg-black border-2 border-white/20 rounded-2xl shadow-2xl"></div>
                </div>
              )}
            </div>

            <h3 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter mb-4">{selectedChat?.name}</h3>
            <div className="flex flex-col items-center gap-2 mb-16">
              <span className="text-prem-gold font-black uppercase tracking-[0.2em] text-xs lg:text-sm animate-pulse">
                {activeCall.status === 'ringing' ? 'Trucant...' : activeCall.type === 'video' ? 'Vídeotrucada Pro' : 'Llamada de veu'}
              </span>
              {activeCall.status === 'connected' && (
                <span className="text-white/40 font-mono text-xl">{formatTime(callTimer)}</span>
              )}
            </div>

            <div className="flex items-center gap-6 lg:gap-10">
              <button className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 shadow-2xl">
                {activeCall.type === 'voice' ? <Mic size={28} /> : <VideoOff size={28} />}
              </button>
              <button onClick={() => setActiveCall(null)} className="w-20 h-20 lg:w-24 lg:h-24 bg-red-500 rounded-[40px] flex items-center justify-center text-white shadow-[0_20px_50px_rgba(239,68,68,0.3)] hover:bg-red-600 hover:rotate-12 transition-all active:scale-95 group">
                <PhoneOff size={32} className="group-hover:scale-110 transition-transform" />
              </button>
              <button className="w-16 h-16 lg:w-20 lg:h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-all active:scale-90 shadow-2xl">
                <Maximize2 size={28} />
              </button>
            </div>
          </div>
          
          <div className="absolute bottom-10 flex items-center gap-2 text-white/20 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} /> Connexió encriptada SSL/256 · Prem Academy
          </div>
        </div>
      )}
    </div>
  );
};

export default Buzon;