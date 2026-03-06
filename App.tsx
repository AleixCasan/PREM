import React, { useState, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import CoachPanel from './components/CoachPanel';
import CoordinationPanel from './components/CoordinationPanel';
import ReservationFlow from './components/ReservationFlow';
import ComprarPrems from './components/views/ComprarTecnis';
import MisReservas from './components/views/MisReservas';
import MisHijos from './components/views/MisHijos';
import MiPerfil from './components/views/MiPerfil';
import MisCompras from './components/views/MisCompras';
import Historial from './components/views/Historial';
import MapaSeus from './components/views/MapaSeus';
import Buzon from './components/views/Buzon';
import Login from './components/Login';
import CoachOnboarding from './components/CoachOnboarding';
import { ViewType, User, Language, Transaction, Sede, UserRole, Player, Pack, Notification, UserAccountStatus, CoachProfile } from './types';
import { Mail } from 'lucide-react';
import { translations } from './translations';

import { authService } from './services/authService';

// Helper to set up initial dynamic dates
const now = new Date();
const currentMonth = now.getMonth();
const currentYear = now.getFullYear();

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(!!authService.getCurrentSession());
  const [currentView, setCurrentView] = useState<ViewType>(ViewType.DASHBOARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [selectedSedeForBooking, setSelectedSedeForBooking] = useState<Sede | undefined>(undefined);
  const [selectedSessionForBooking, setSelectedSessionForBooking] = useState<any | undefined>(undefined);
  
  // Lista de usuarios registrados (Simulando base de datos)
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(authService.getUsers());

  // Llista global de Jugadors (Atletes) vinculats a Tutors
  const [players, setPlayers] = useState<Player[]>([
    { 
      id: 'p1', guardianId: 'u1', firstName: 'Marc', lastName: 'Tarrenchs', birthDate: '2012-05-15', gender: 'Masculí', dni: '12345678X', photo: null, club: 'Girona FC', category: 'Aleví A', mainPosition: 'Davanter', secondaryPosition: 'Migcampista', strongFoot: 'Dreta', height: '155', weight: '45', yearsPlaying: '5', isCompeting: true, status: 'Actiu', registrationDate: '2024-01-10', internalNotes: 'Jugador amb molta progressió.', totalSessions: 24, lastBookingDate: '2024-05-12', assignedSedeId: '1', medicalInfo: { allergies: 'Cap', currentInjuries: 'Cap', pastInjuries: 'Cap', medicalAuth: true, imageAuth: true }
    },
    { 
      id: 'p2', guardianId: 'u1', firstName: 'Èric', lastName: 'Tarrenchs', birthDate: '2015-08-20', gender: 'Masculí', dni: '87654321Z', photo: null, club: 'UE Banyoles', category: 'Benjamí B', mainPosition: 'Porter', secondaryPosition: 'Defensa', strongFoot: 'Esquerra', height: '140', weight: '35', yearsPlaying: '2', isCompeting: true, status: 'Actiu', registrationDate: '2024-02-15', internalNotes: '', totalSessions: 12, lastBookingDate: '2024-05-10', assignedSedeId: '1', medicalInfo: { allergies: 'Pol·len', currentInjuries: 'Cap', pastInjuries: 'Cap', medicalAuth: true, imageAuth: true }
    },
    { 
      id: 'p3', guardianId: 'u3', firstName: 'Nil', lastName: 'Coord', birthDate: '2013-11-02', gender: 'Masculí', dni: '99887766K', photo: null, club: 'FC Barcelona', category: 'Infantil B', mainPosition: 'Migcampista', secondaryPosition: 'Extrem', strongFoot: 'Dreta', height: '162', weight: '52', yearsPlaying: '7', isCompeting: true, status: 'Actiu', registrationDate: '2023-09-01', internalNotes: 'Molt bon sentit tàctic.', totalSessions: 45, lastBookingDate: '2024-05-14', assignedSedeId: '2', medicalInfo: { allergies: 'Cap', currentInjuries: 'Sobrecarrega bessó', pastInjuries: 'Esquinç turmell', medicalAuth: true, imageAuth: true }
    },
    { 
      id: 'p4', guardianId: 'admin-1', firstName: 'Leo', lastName: 'Admin', birthDate: '2014-03-10', gender: 'Masculí', dni: '11223344L', photo: null, club: 'Prem Academy', category: 'Aleví B', mainPosition: 'Davanter', secondaryPosition: 'Extrem', strongFoot: 'Dreta', height: '150', weight: '40', yearsPlaying: '4', isCompeting: true, status: 'Actiu', registrationDate: '2024-03-01', internalNotes: 'Jugador de prova per a l\'administrador.', totalSessions: 5, lastBookingDate: '2024-05-15', assignedSedeId: '1', medicalInfo: { allergies: 'Cap', currentInjuries: 'Cap', pastInjuries: 'Cap', medicalAuth: true, imageAuth: true }
    },
    { 
      id: 'p5', guardianId: 'admin-1', firstName: 'Biel', lastName: 'Prova', birthDate: '2016-06-22', gender: 'Masculí', dni: '55667788M', photo: null, club: 'Prem Academy', category: 'Pre-Benjamí A', mainPosition: 'Migcampista', secondaryPosition: 'Defensa', strongFoot: 'Dreta', height: '135', weight: '30', yearsPlaying: '2', isCompeting: true, status: 'Actiu', registrationDate: '2024-04-10', internalNotes: 'Segon jugador de prova.', totalSessions: 2, lastBookingDate: '2024-05-10', assignedSedeId: '1', medicalInfo: { allergies: 'Cap', currentInjuries: 'Cap', pastInjuries: 'Cap', medicalAuth: true, imageAuth: true }
    }
  ]);

  const [user, setUser] = useState<User>(authService.getCurrentSession() || registeredUsers[0]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'n1',
      userId: 'u1',
      title: 'Benvingut a Prem Academy',
      message: 'Ja pots començar a reservar les teves sessions de tecnificació.',
      type: 'success',
      timestamp: new Date().toISOString(),
      isRead: false
    },
    {
      id: 'n2',
      userId: 'u1',
      title: 'Recordatori de Pagament',
      message: 'Tens un pagament pendent per al Pack Pro.',
      type: 'payment',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      isRead: false
    }
  ]);

  const handleMarkNotificationAsRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  }, []);

  const handleAddNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `n-${Date.now()}`,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  React.useEffect(() => {
    const session = authService.getCurrentSession();
    if (session) {
      setUser(session);
      setIsAuthenticated(true);
    }
  }, []);

  const [billingData, setBillingData] = useState({
    isCompany: false,
    companyName: '',
    companyTaxId: '',
    name: 'Pol Tarrenchs',
    taxId: '47231XXX-P',
    address: "Carrer de l'Esport, 123",
    postalCode: '17820',
    city: 'Banyoles',
    country: 'Espanya',
    email: 'pol.tarrenchs@prem.cat',
    phone: '+34 600 000 000'
  });

  const [seus, setSeus] = useState<Sede[]>([
    {
      id: '1',
      name: 'Banyoles',
      location: 'Estadi Municipal de Banyoles',
      description: 'Nuestra sede central de alto rendimiento. Instalaciones de nivel olímpico con césped híbrido y sala técnica de última generación para análisis biomecánico detallado.',
      lat: 42.1167,
      lng: 2.7667,
      image: 'Banyoles.jpg',
      phone: '+34 972 57 00 00',
      schedule: 'Lun - Sáb: 09:00 - 21:00',
      activeServiceIds: ['1', '2', '3'],
      resources: [
        { id: 'r1', name: 'Camp Principal', type: 'campo' },
        { id: 'r2', name: 'Sala Tecni', type: 'sala' }
      ]
    },
    {
      id: '2',
      name: 'Calonge',
      location: 'Camp de Futbol de Calonge',
      description: 'Entorno privilegiado entre el mar y la montaña. Centro especializado en tecnificaciones intensivas y desarrollo de habilidades creativas.',
      lat: 41.8614,
      lng: 3.0747,
      image: 'Calonge.jpg',
      phone: '+34 972 66 11 22',
      schedule: 'Mar - Vie: 16:30 - 20:30',
      activeServiceIds: ['1'],
      resources: [
        { id: 'r3', name: 'Camp A', type: 'campo' }
      ]
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 'TX-1002', date: '12 May 2024', pack: 'Pack Elite (Temporada)', amount: 700, prems: 1225, status: 'Completado' },
    { id: 'TX-1001', date: '05 May 2024', pack: 'Pack Starter (Mensual)', amount: 120, prems: 140, status: 'Completado' }
  ]);

  const [packs, setPacks] = useState<Pack[]>([
    { 
      id: '0', 
      name: 'Sesión Única', 
      subtitle: 'Puntual',
      price: 35, 
      totalPrems: 35, 
      bonusPrems: 0, 
      sessionsCount: 1, 
      realCostPerSession: 35, 
      popular: false, 
      color: 'bg-gray-400',
      iconName: 'ticket',
      allowMonthly: false
    },
    { 
      id: '1', 
      name: 'Pack Starter', 
      subtitle: 'Mensual',
      price: 120, 
      totalPrems: 140, 
      bonusPrems: 20, 
      sessionsCount: 4, 
      realCostPerSession: 30, 
      popular: false, 
      color: 'bg-blue-500',
      iconName: 'zap',
      allowMonthly: false
    },
    { 
      id: '2', 
      name: 'Pack Pro', 
      subtitle: 'Trimestral',
      price: 330, 
      totalPrems: 420, 
      bonusPrems: 90, 
      sessionsCount: 12, 
      realCostPerSession: 27.5, 
      popular: false, 
      color: 'gold-gradient',
      iconName: 'star',
      allowMonthly: true,
      months: 3
    },
    { 
      id: '3', 
      name: 'Pack Elite', 
      subtitle: 'Temporada',
      price: 700, 
      totalPrems: 1225, 
      bonusPrems: 525, 
      sessionsCount: 35, 
      realCostPerSession: 20, 
      popular: true, 
      color: 'bg-gray-900',
      iconName: 'trophy',
      allowMonthly: true,
      months: 10
    },
  ]);

  const [tasks, setTasks] = useState<any[]>([
    { id: '1', title: 'Rutina d\'estiraments diaris', status: 'Activa', date: 'Fa 2 dies', type: 'Físic', sessionIds: ['sess-1'] },
    { id: '2', title: 'Anàlisi de partit: Girona FC', status: 'Pendent', date: 'Fa 3 dies', type: 'Tàctic', sessionIds: ['sess-2'] },
    { id: '3', title: 'Test de coneixements regles', status: 'Acabada', date: 'Fa 1 setmana', type: 'Teoria', sessionIds: ['sess-3'] },
  ]);

  const [sessions, setSessions] = useState<any[]>([
    { 
      id: 'sess-1', 
      name: 'Elite Performance', 
      serviceId: '3', 
      sedeId: '1', 
      coachId: 'coach-1',
      startTime: new Date(currentYear, currentMonth, now.getDate(), 17, 30).toISOString(),
      duration: 90,
      category: 'Prem Pro',
      price: 35,
      location: 'Banyoles',
      planning: '1. Escalfament articular (10 min)\n2. Circuit de coordinació amb pilota (15 min)\n3. Finalitzacions 1vs1 contra porter (25 min)\n4. Partit reduït: transicions ràpides (30 min)\n5. Tornada a la calma i feedback (10 min)'
    },
    { 
      id: 'sess-2', 
      name: 'Development Group', 
      serviceId: '1', 
      sedeId: '1', 
      coachId: 'coach-1',
      startTime: new Date(currentYear, currentMonth, now.getDate(), 19, 0).toISOString(),
      duration: 70,
      category: 'Prem Academy',
      price: 35,
      location: 'Banyoles',
      planning: 'Focalitzat en el control orientat. Exercicis de recepció amb cama no dominant.'
    },
    { 
      id: 'sess-3', 
      name: 'Tecnificació Individual', 
      serviceId: '2', 
      sedeId: '1', 
      coachId: 'coach-1',
      startTime: new Date(currentYear, currentMonth, now.getDate() - 1, 10, 0).toISOString(),
      duration: 60,
      category: 'Prem Pro',
      price: 50,
      location: 'Banyoles',
      status: 'completed',
      attendance: { 'Joan Vila': 'present', 'Marc Soler': 'present' }
    },
    { 
      id: 'sess-4', 
      name: 'Grup Avançat', 
      serviceId: '1', 
      sedeId: '2', 
      coachId: 'coach-1',
      startTime: new Date(currentYear, currentMonth, now.getDate() + 1, 16, 0).toISOString(),
      duration: 90,
      category: 'Prem Academy',
      price: 35,
      location: 'Calonge'
    }
  ]);

  const [bookings, setBookings] = useState<any[]>([
    { 
      id: 'res-1', 
      sessionId: 'sess-1',
      userId: '1',
      userName: 'Pol Tarrenchs',
      date: new Date(currentYear, currentMonth, now.getDate()).toISOString(), 
      time: '17:30', 
      name: 'Elite Performance', 
      location: 'Banyoles', 
      category: 'Prem Pro', 
      cost: 35 
    }
  ]);

  const handleLanguageChange = (lang: 'es' | 'ca' | 'en') => {
    setUser(prev => ({ ...prev, language: lang }));
  };

  const t = useCallback((key: keyof typeof translations['es']) => {
    return translations[user.language][key] || translations['es'][key] || key;
  }, [user.language]);

  const handleLogin = useCallback((username: string, password?: string) => {
    const foundUser = authService.login(username, password);

    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      setCurrentView(ViewType.DASHBOARD);
      setIsSidebarOpen(true);
      return true;
    }

    return false;
  }, []);

  const handleRegister = useCallback((userData: any) => {
    const newUser = authService.register(userData);
    setRegisteredUsers(authService.getUsers());
    return newUser;
  }, []);

  const handleAddUser = useCallback((userData: any) => {
    const newUser: User = {
      id: `u-${Date.now()}`,
      username: userData.email,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      initials: userData.initials,
      accountStatus: userData.accountStatus,
      status: userData.status || 'Actiu',
      premsBalance: 0,
      language: 'ca',
      level: 1,
      xp: 0,
      skills: { tecnica: 0, fisico: 0, tactica: 0, mentalidad: 0 },
      password: '123' // Default password for newly created users
    };
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    authService.saveUsers(updatedUsers);
  }, [registeredUsers]);

  const handleUpdateUserRole = useCallback((userId: string, newRole: UserRole) => {
    const updatedUsers = registeredUsers.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setRegisteredUsers(updatedUsers);
    authService.saveUsers(updatedUsers);
    
    if (user.id === userId) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      authService.updateUser(updatedUser);
    }
  }, [registeredUsers, user]);

  const handleUpdateUser = useCallback((updatedUser: User) => {
    const updatedUsers = registeredUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    setRegisteredUsers(updatedUsers);
    authService.saveUsers(updatedUsers);
    if (user.id === updatedUser.id) {
      setUser(updatedUser);
      authService.updateUser(updatedUser);
    }
  }, [registeredUsers, user]);

  const handleDeleteUser = useCallback((userId: string) => {
    const updatedUsers = registeredUsers.filter(u => u.id !== userId);
    setRegisteredUsers(updatedUsers);
    authService.saveUsers(updatedUsers);
  }, [registeredUsers]);

  const handleAddPlayer = useCallback((newPlayer: Player) => {
    setPlayers(prev => [...prev, newPlayer]);
  }, []);

  const handleUpdatePlayer = useCallback((updatedPlayer: Player) => {
    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
  }, []);

  const handleDeletePlayer = useCallback((playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    setIsAuthenticated(false);
  }, []);

  const handleNavigate = useCallback((view: ViewType, sede?: Sede, session?: any) => {
    setCurrentView(view);
    setSelectedSedeForBooking(sede);
    setSelectedSessionForBooking(session);
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  const handlePurchase = useCallback((prems: number, amount: number, packName: string) => {
    const newId = `TX-${Math.floor(Math.random() * 9000) + 1000}`;
    const newTx: Transaction = {
      id: newId,
      date: new Date().toLocaleDateString('ca-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      pack: packName,
      amount: amount,
      prems: prems,
      status: 'Completado'
    };
    const updatedUser = { ...user, premsBalance: user.premsBalance + prems };
    setUser(updatedUser);
    authService.updateUser(updatedUser);
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  }, []);

  const handleAddSession = useCallback((newSession: any) => {
    setSessions(prev => [...prev, newSession]);
  }, []);

  const handleDeleteSession = useCallback((id: string) => {
    const sessionToDelete = sessions.find(s => s.id === id);
    if (!sessionToDelete) return;

    // Notify users who had bookings for this session
    const affectedBookings = bookings.filter(b => b.sessionId === id);
    
    affectedBookings.forEach(booking => {
      handleAddNotification({
        title: 'Sessió Cancel·lada',
        message: `La sessió "${sessionToDelete.name || 'Tecnificació'}" ha estat cancel·lada. S'han retornat els prems al teu compte.`,
        type: 'session',
        userId: booking.userId
      });
      
      // Refund logic if it's the current user
      if (booking.userId === user.id) {
        setUser(prev => ({ ...prev, premsBalance: prev.premsBalance + (sessionToDelete.price || 35) }));
      }
    });

    setSessions(prev => prev.filter(s => s.id !== id));
    setBookings(prev => prev.filter(b => b.sessionId !== id));
  }, [sessions, bookings, handleAddNotification, user.id]);

  const handleAddBooking = useCallback((newBooking: any) => {
    setBookings(prev => [...prev, newBooking]);
    const updatedUser = { ...user, premsBalance: user.premsBalance - newBooking.cost };
    setUser(updatedUser);
    authService.updateUser(updatedUser);
  }, [user]);

  const handleCancelBooking = useCallback((id: string) => {
    setBookings(prev => {
      const bookingToCancel = prev.find(b => b.id === id);
      if (bookingToCancel) {
        const updatedUser = { ...user, premsBalance: user.premsBalance + bookingToCancel.cost };
        setUser(updatedUser);
        authService.updateUser(updatedUser);
      }
      return prev.filter(b => b.id !== id);
    });
  }, [user]);

  const handleUpdateSession = useCallback((updatedSession: any) => {
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
  }, []);

  const handleUpdatePacks = useCallback((updatedPacks: Pack[]) => {
    setPacks(updatedPacks);
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} onRegister={handleRegister} t={t} />;
  }

  // --- ONBOARDING FLOW ---
  if (user.accountStatus === UserAccountStatus.CREATED_BY_ADMIN) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-inter">
        <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Mail size={40} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-4">Verifica el teu Email</h2>
          <p className="text-gray-500 font-medium mb-8">Hem enviat un enllaç de verificació a <span className="text-gray-900 font-bold">{user.email}</span>. Si us plau, verifica el teu correu per continuar.</p>
          <div className="space-y-4">
            <button 
              onClick={() => {
                const updatedUser = { ...user, accountStatus: UserAccountStatus.EMAIL_VERIFIED };
                setUser(updatedUser);
                authService.updateUser(updatedUser);
              }}
              className="w-full py-4 gold-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
            >
              Simular Verificació (Demo)
            </button>
            <button 
              onClick={handleLogout}
              className="w-full py-4 bg-gray-50 text-gray-400 hover:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
            >
              Tancar Sessió
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (user.accountStatus === UserAccountStatus.EMAIL_VERIFIED) {
    return (
      <CoachOnboarding 
        user={user} 
        onComplete={(profile: CoachProfile) => {
          const updatedUser = { 
            ...user, 
            profile, 
            accountStatus: UserAccountStatus.PROFILE_COMPLETE,
            status: 'Actiu' as const
          };
          setUser(updatedUser);
          authService.updateUser(updatedUser);
        }} 
      />
    );
  }

  // --- RENDERING STRATEGY ---
  
  if (currentView === ViewType.ADMIN_PANEL) {
    return (
      <AdminPanel 
        sessions={sessions} 
        tasks={tasks}
        onUpdateTasks={setTasks}
        onAddSession={handleAddSession} 
        onDeleteSession={handleDeleteSession} 
        onAddUser={handleAddUser}
        seus={seus} 
        onUpdateSeus={setSeus}
        registeredUsers={registeredUsers}
        onUpdateUserRole={handleUpdateUserRole}
        onUpdateUser={handleUpdateUser}
        onDeleteUser={handleDeleteUser}
        players={players}
        onAddPlayer={handleAddPlayer}
        onUpdatePlayer={handleUpdatePlayer}
        onDeletePlayer={handleDeletePlayer}
        transactions={transactions}
        bookings={bookings}
        packs={packs}
        onUpdatePacks={handleUpdatePacks}
        onAddNotification={handleAddNotification}
        onBackToDashboard={() => setCurrentView(ViewType.DASHBOARD)}
      />
    );
  }

  // Standard User/Staff Layout
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <Sidebar 
        currentView={currentView} 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        t={t}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        user={user}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300`}>
        <Header 
          user={user} 
          t={t} 
          onToggleSidebar={toggleSidebar} 
          onNavigate={handleNavigate}
          notifications={notifications}
          onMarkAsRead={handleMarkNotificationAsRead}
        />
        
        <main className="flex-1 overflow-y-auto p-3 md:p-10">
          <div className="max-w-7xl mx-auto">
            {currentView === ViewType.DASHBOARD && (
              <Dashboard 
                user={user} 
                bookings={bookings} 
                sessions={sessions}
                onNavigate={handleNavigate} 
                t={t} 
              />
            )}
            {currentView === ViewType.MAPA_SEUS && <MapaSeus t={t} onNavigate={handleNavigate} initialSedes={seus} />}
            {currentView === ViewType.COACH_PANEL && <CoachPanel sessions={sessions} tasks={tasks} onUpdateSession={handleUpdateSession} />}
            {currentView === ViewType.COORDINATION_PANEL && (
              <CoordinationPanel 
                user={user}
                seus={seus} 
                sessions={sessions} 
                onAddSession={handleAddSession} 
                onNavigate={handleNavigate}
                onAddNotification={handleAddNotification}
                registeredUsers={registeredUsers}
              />
            )}
            {currentView === ViewType.NUEVA_RESERVA && (
              <ReservationFlow 
                user={user} 
                sessions={sessions} 
                seus={seus} 
                players={players}
                onAddBooking={handleAddBooking} 
                onComplete={() => { 
                  setCurrentView(ViewType.MIS_RESERVAS); 
                  setSelectedSedeForBooking(undefined);
                  setSelectedSessionForBooking(undefined);
                }} 
                onNavigate={handleNavigate}
                initialSede={selectedSedeForBooking}
                initialSession={selectedSessionForBooking}
              />
            )}
            {currentView === ViewType.COMPRAR_PREMS && <ComprarPrems onPurchase={handlePurchase} onNavigate={handleNavigate} billingData={billingData} packs={packs} />}
            {currentView === ViewType.MIS_RESERVAS && <MisReservas bookings={bookings} onCancel={handleCancelBooking} onNew={() => setCurrentView(ViewType.NUEVA_RESERVA)} />}
            {currentView === ViewType.MIS_HIJOS && <MisHijos />}
            {currentView === ViewType.BUZON && <Buzon user={user} />}
            {currentView === ViewType.MI_PERFIL && <MiPerfil user={user} onLanguageChange={handleLanguageChange} t={t} />}
            {currentView === ViewType.MIS_COMPRAS && <MisCompras transactions={transactions} billingData={billingData} onUpdateBilling={setBillingData} />}
            {currentView === ViewType.HISTORIAL && <Historial />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;