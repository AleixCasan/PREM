import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Settings, 
  MapPin, 
  Users, 
  Package, 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Check, 
  CalendarDays, 
  Filter, 
  ArrowUpDown, 
  Camera, 
  Sparkles, 
  Loader2, 
  Upload, 
  Shield, 
  UserCog, 
  Mail, 
  ShieldAlert, 
  UserPlus, 
  SlidersHorizontal, 
  ShieldCheck,
  Info,
  ChevronRight,
  MessageSquare, 
  Lock,
  ArrowLeft,
  LayoutDashboard,
  Ticket,
  CreditCard,
  Megaphone,
  Target,
  BarChart3,
  Menu,
  TrendingUp,
  ArrowUpRight,
  Globe,
  Bell,
  CheckCircle2,
  Percent,
  Zap,
  Clock,
  Activity,
  ArrowDownRight,
  Download,
  Dumbbell,
  Briefcase,
  Award,
  FileText,
  Phone,
  Power,
  Eye,
  Star,
  User as UserIcon,
  Stethoscope,
  Image as ImageIcon,
  MoreVertical,
  Key,
  History as HistoryIcon,
  FileSpreadsheet,
  ArrowDownLeft,
  Receipt,
  Layers,
  ArrowRight,
  UserCircle,
  AlertCircle,
  Video,
  FileUp,
  ChevronDown,
  Play
} from 'lucide-react';
import { Sede, Service, Resource, UserRole, User, Transaction, Player, Pack, Notification, NotificationType, UserAccountStatus } from '../types';
import CalendarAgenda from './admin/CalendarAgenda';
import Buzon from './views/Buzon';
import { generateInvoicePDF } from '../services/invoiceService';

interface AdminPanelProps {
  sessions: any[];
  onAddSession: (session: any) => void;
  onAddUser?: (userData: any) => void;
  onUpdateUser?: (user: User) => void;
  onDeleteUser?: (userId: string) => void;
  onBackToDashboard: () => void;
  onDeleteSession: (id: string) => void;
  onUpdateSeus: React.Dispatch<React.SetStateAction<Sede[]>>;
  onUpdateUserRole?: (userId: string, newRole: UserRole) => void;
  registeredUsers?: User[];
  transactions?: Transaction[];
  bookings?: any[];
  seus: Sede[];
  players?: Player[];
  onAddPlayer?: (player: Player) => void;
  onUpdatePlayer?: (player: Player) => void;
  onDeletePlayer?: (playerId: string) => void;
  packs?: Pack[];
  onUpdatePacks?: (packs: Pack[]) => void;
  onAddNotification?: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  tasks?: Task[];
  onUpdateTasks?: (tasks: Task[]) => void;
}

type AdminTab = 'dashboard' | 'agenda' | 'reservas' | 'usuaris' | 'serveis' | 'buzon' | 'seus' | 'facturacio' | 'staff' | 'stats' | 'ajustes' | 'comunicacions' | 'pro' | 'assistencia';
type UserSubTab = 'families' | 'jugadors';

interface Task {
  id: string;
  title: string;
  sessionIds: string[];
  objective?: string;
  description?: string;
  date: string;
  fileName?: string;
  status: 'Activa' | 'Pendent' | 'Acabada';
  type: string;
  pdfUrl?: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ 
  sessions, 
  onAddSession, 
  onDeleteSession, 
  seus, 
  onUpdateSeus,
  registeredUsers = [],
  transactions = [],
  bookings = [],
  onUpdateUserRole,
  onAddUser,
  onUpdateUser,
  onDeleteUser,
  onBackToDashboard,
  players = [],
  onAddPlayer,
  onUpdatePlayer,
  onDeletePlayer,
  packs = [],
  onUpdatePacks,
  onAddNotification,
  tasks = [],
  onUpdateTasks
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [dashboardTimeRange, setDashboardTimeRange] = useState<'setmana' | 'mes' | 'trimestre' | 'temporada'>('mes');
  const [isTimeRangeDropdownOpen, setIsTimeRangeDropdownOpen] = useState(false);
  const [assistenciaView, setAssistenciaView] = useState<'sessions' | 'jugadors'>('sessions');
  const [assistenciaSearch, setAssistenciaSearch] = useState('');
  const [activeTool, setActiveTool] = useState<'videos' | 'tasks' | 'session' | null>(null);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<{name: string, type: 'video' | 'task' | 'session', date: string}[]>([]);
  
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTaskData, setNewTaskData] = useState<Partial<Task>>({
    title: '',
    sessionIds: [],
    objective: '',
    description: '',
    type: 'General'
  });
  const [userSubTab, setUserSubTab] = useState<UserSubTab>('jugadors');
  const [serveisSubTab, setServeisSubTab] = useState<'serveis' | 'packs'>('serveis');
  const [billingSubTab, setBillingSubTab] = useState<'transaccions' | 'jugadors'>('jugadors');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [localServeis, setLocalServeis] = useState<Service[]>([
    { id: '1', name: 'Development Group', description: 'Iniciació i millora técnica bàsica.', duration: 70, capacity: 6, price: 35, category: 'Prem Academy' },
    { id: '2', name: 'Performance Group', description: 'Entrenament d’alta intensitat.', duration: 70, capacity: 4, price: 35, category: 'Prem Pro' },
    { id: '3', name: 'Elite Pro', description: 'Preparació professional individualitzada.', duration: 90, capacity: 1, price: 35, category: 'Prem Pro' },
  ]);

  const [localSessions, setLocalSessions] = useState(sessions);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Service>>({
    name: '', description: '', duration: 70, capacity: 4, price: 35, category: 'Prem Pro'
  });

  const [isPackModalOpen, setIsPackModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingPackId, setEditingPackId] = useState<string | null>(null);
  const [packForm, setPackForm] = useState<Partial<Pack>>({
    name: '', subtitle: '', price: 0, totalPrems: 0, bonusPrems: 0, sessionsCount: 0, realCostPerSession: 0, popular: false, color: 'prem-gold', iconName: 'Zap', allowMonthly: false, months: 1
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Si us plau, selecciona un fitxer PDF.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setNewTaskData(prev => ({ ...prev, pdfUrl: event.target?.result as string, fileName: file.name }));
      };
      reader.readAsDataURL(file);
    }
  };

  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const [playerForm, setPlayerForm] = useState<Partial<Player>>({
    firstName: '', lastName: '', dni: '', category: '', club: '', status: 'Actiu', assignedSedeId: seus[0]?.id || ''
  });

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [userForm, setUserForm] = useState<Partial<User>>({
    name: '', email: '', phone: '', role: 'Famil', premsBalance: 0
  });

  const [isSedeModalOpen, setIsSedeModalOpen] = useState(false);
  const [editingSedeId, setEditingSedeId] = useState<string | null>(null);
  const [sedeForm, setSedeForm] = useState<Partial<Sede>>({
    name: '', location: '', description: '', image: '', phone: '', schedule: '', email: '', googleMapsUrl: '', resources: [], activeServiceIds: []
  });

  // Session Edit States
  const [isSessionEditModalOpen, setIsSessionEditModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<any | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const askConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmModal({ isOpen: true, title, message, onConfirm });
  };
  const [sessionEditForm, setSessionEditForm] = useState({
    date: '',
    time: '',
    sedeId: '',
    coachId: ''
  });

  // CRM States
  const [notifForm, setNotifForm] = useState({
    title: '',
    message: '',
    type: 'info' as NotificationType,
    target: 'all'
  });

  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddNotification) {
      onAddNotification({
        title: notifForm.title,
        message: notifForm.message,
        type: notifForm.type,
        userId: notifForm.target
      });
      setNotifForm({ title: '', message: '', type: 'info', target: 'all' });
      alert('Notificació enviada correctament!');
    }
  };

  const [playerSearch, setPlayerSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [staffSearch, setStaffSearch] = useState('');
  const [txSearch, setTxSearch] = useState('');
  const [filterPlayerSede, setFilterPlayerSede] = useState('all');
  const [filterPlayerStatus, setFilterPlayerStatus] = useState('all');
  const [filterStaffRole, setFilterStaffRole] = useState('all');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  
  const [staffForm, setStaffForm] = useState<{firstName: string; lastName: string; email: string; role: UserRole; assignedSedes: string[];}>({
    firstName: '', lastName: '', email: '', role: 'Coach', assignedSedes: []
  });

  useEffect(() => {
    setLocalSessions(sessions);
  }, [sessions]);

  useEffect(() => {
    if (editingTask) {
      setNewTaskData(editingTask);
    }
  }, [editingTask]);

  const staffMembers = useMemo(() => {
    return registeredUsers.filter(u => u.role !== 'Famil');
  }, [registeredUsers]);

  const getTutorInfo = (guardianId: string) => registeredUsers.find(u => u.id === guardianId);
  const getKidsForTutor = (tutorId: string) => players.filter(p => p.guardianId === tutorId);

  // Billing Metrics
  const billingMetrics = useMemo(() => {
    const total = transactions.reduce((acc, tx) => acc + tx.amount, 0);
    const totalPrems = transactions.reduce((acc, tx) => acc + tx.prems, 0);
    const avgTicket = transactions.length > 0 ? total / transactions.length : 0;
    return { total, totalPrems, avgTicket, count: transactions.length };
  }, [transactions]);

  // Staff Metrics
  const staffMetrics = useMemo(() => {
    const total = staffMembers.length;
    const coaches = staffMembers.filter(s => s.role === 'Coach').length;
    const coordinators = staffMembers.filter(s => s.role === 'Coordinador').length;
    return { total, coaches, coordinators };
  }, [staffMembers]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => 
      tx.id.toLowerCase().includes(txSearch.toLowerCase()) || 
      tx.pack.toLowerCase().includes(txSearch.toLowerCase())
    );
  }, [transactions, txSearch]);

  const filteredPlayers = useMemo(() => {
    const searchTerms = playerSearch.toLowerCase().trim().split(/\s+/);
    return players.filter(p => {
      const firstName = p.firstName.toLowerCase();
      const lastName = p.lastName.toLowerCase();
      const dni = p.dni.toLowerCase();
      
      const matchesSearch = searchTerms.every(term => 
        firstName.includes(term) || 
        lastName.includes(term) || 
        dni.includes(term)
      );

      const matchesSede = filterPlayerSede === 'all' || p.assignedSedeId === filterPlayerSede;
      const matchesStatus = filterPlayerStatus === 'all' || p.status === filterPlayerStatus;
      return matchesSearch && matchesSede && matchesStatus;
    });
  }, [players, playerSearch, filterPlayerSede, filterPlayerStatus]);

  const filteredFamilies = useMemo(() => {
    return registeredUsers.filter(u => 
      u.role === 'Famil' && 
      (u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
       u.email?.toLowerCase().includes(userSearch.toLowerCase()))
    );
  }, [registeredUsers, userSearch]);

  const filteredStaff = useMemo(() => {
    return staffMembers.filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(staffSearch.toLowerCase()) || 
                           (u.email || '').toLowerCase().includes(staffSearch.toLowerCase());
      const matchesRole = filterStaffRole === 'all' || u.role === filterStaffRole;
      return matchesSearch && matchesRole;
    });
  }, [staffMembers, staffSearch, filterStaffRole]);

  // Product Logic
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProductId) {
      setLocalServeis(prev => prev.map(s => s.id === editingProductId ? { ...s, ...productForm } as Service : s));
    } else {
      const newProduct: Service = {
        ...productForm,
        id: `prod-${Date.now()}`
      } as Service;
      setLocalServeis(prev => [...prev, newProduct]);
    }
    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  const handleOpenProductModal = (product?: Service) => {
    if (product) {
      setEditingProductId(product.id);
      setProductForm(product);
    } else {
      setEditingProductId(null);
      setProductForm({ name: '', description: '', duration: 70, capacity: 4, price: 35, category: 'Prem Pro' });
    }
    setIsProductModalOpen(true);
  };

  const handleToggleProduct = (id: string) => {
    askConfirmation(
      'Eliminar Producte',
      'Segur que vols eliminar aquest producte? Aquesta acció no es pot desfer.',
      () => setLocalServeis(prev => prev.filter(s => s.id !== id))
    );
  };

  // Pack Logic
  const handleSavePack = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPackId) {
      onUpdatePacks?.(packs.map(p => p.id === editingPackId ? { ...p, ...packForm } as Pack : p));
    } else {
      const newPack: Pack = {
        ...packForm,
        id: `pack-${Date.now()}`
      } as Pack;
      onUpdatePacks?.([...packs, newPack]);
    }
    setIsPackModalOpen(false);
    setEditingPackId(null);
  };

  const handleOpenPackModal = (pack?: Pack) => {
    if (pack) {
      setEditingPackId(pack.id);
      setPackForm(pack);
    } else {
      setEditingPackId(null);
      setPackForm({ 
        name: '', subtitle: '', price: 0, totalPrems: 0, bonusPrems: 0, 
        sessionsCount: 0, realCostPerSession: 0, popular: false, 
        color: 'prem-gold', iconName: 'Zap', allowMonthly: false, months: 1 
      });
    }
    setIsPackModalOpen(true);
  };

  const handleTogglePack = (id: string) => {
    askConfirmation(
      'Eliminar Pack',
      'Segur que vols eliminar aquest pack? Aquesta acció no es pot desfer.',
      () => onUpdatePacks?.(packs.filter(p => p.id !== id))
    );
  };

  // Session Edit Logic
  const handleOpenSessionEdit = (session: any) => {
    setEditingSession(session);
    const date = new Date(session.startTime);
    setSessionEditForm({
      date: date.toISOString().split('T')[0],
      time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
      sedeId: session.sedeId || '',
      coachId: session.coachId || ''
    });
    setIsSessionEditModalOpen(true);
  };

  const handleSaveSessionEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;

    const [hours, minutes] = sessionEditForm.time.split(':').map(Number);
    const newStartTime = new Date(sessionEditForm.date);
    newStartTime.setHours(hours, minutes);

    const selectedSede = seus.find(s => s.id === sessionEditForm.sedeId);

    setLocalSessions(prev => prev.map(s => 
      s.id === editingSession.id 
        ? { 
            ...s, 
            startTime: newStartTime.toISOString(),
            sedeId: sessionEditForm.sedeId,
            location: selectedSede?.name || s.location,
            coachId: sessionEditForm.coachId
          } 
        : s
    ));

    setIsSessionEditModalOpen(false);
    setEditingSession(null);
  };

  // Billing Logic
  const handleExportBilling = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Data,Pack,Import,Prems,Estat\n" + 
      filteredTransactions.map(tx => `${tx.id},${tx.date},${tx.pack},${tx.amount},${tx.prems},${tx.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export_facturacio_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${staffForm.firstName} ${staffForm.lastName}`.trim();
    if (editingStaffId && onUpdateUserRole) {
      onUpdateUserRole(editingStaffId, staffForm.role);
    } else if (onAddUser) {
      onAddUser({ 
        name: fullName, 
        email: staffForm.email, 
        role: staffForm.role,
        initials: `${staffForm.firstName[0] || ''}${staffForm.lastName[0] || ''}`.toUpperCase(),
        accountStatus: UserAccountStatus.CREATED_BY_ADMIN,
        status: 'Inactiu'
      });
    }
    setIsStaffModalOpen(false);
    setEditingStaffId(null);
  };

  const handleOpenPlayerModal = (player?: Player) => {
    if (player) {
      setEditingPlayerId(player.id);
      setPlayerForm(player);
    } else {
      setEditingPlayerId(null);
      setPlayerForm({
        firstName: '', lastName: '', dni: '', category: '', club: '', status: 'Actiu', assignedSedeId: seus[0]?.id || '',
        guardianId: '', birthDate: '', gender: 'Masculí', photo: null, mainPosition: '', secondaryPosition: '', strongFoot: 'Dreta',
        height: '', weight: '', yearsPlaying: '', isCompeting: false, registrationDate: new Date().toISOString().split('T')[0],
        internalNotes: '', totalSessions: 0, medicalInfo: { allergies: 'Cap', currentInjuries: 'Cap', pastInjuries: 'Cap', medicalAuth: true, imageAuth: true }
      });
    }
    setIsPlayerModalOpen(true);
  };

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlayerId && onUpdatePlayer) {
      onUpdatePlayer(playerForm as Player);
    } else if (onAddPlayer) {
      onAddPlayer({
        ...playerForm,
        id: 'p' + Math.random().toString(36).substr(2, 9),
      } as Player);
    }
    setIsPlayerModalOpen(false);
  };

  const handleTogglePlayerStatus = (player: Player) => {
    if (onUpdatePlayer) {
      onUpdatePlayer({
        ...player,
        status: player.status === 'Actiu' ? 'Inactiu' : 'Actiu'
      });
    }
  };

  const handleToggleStaffStatus = (staff: User) => {
    if (onUpdateUser) {
      onUpdateUser({
        ...staff,
        status: staff.status === 'Inactiu' ? 'Actiu' : 'Inactiu'
      });
    }
  };

  const getPositionIcon = (position: string) => {
    const pos = position.toLowerCase();
    if (pos.includes('porter') || pos.includes('goalkeeper')) return <Shield size={12} className="text-white" />;
    if (pos.includes('defensa') || pos.includes('defender') || pos.includes('lateral')) return <ShieldCheck size={12} className="text-white" />;
    if (pos.includes('mig') || pos.includes('medio') || pos.includes('midfielder') || pos.includes('pivote')) return <Zap size={12} className="text-white" />;
    if (pos.includes('davanter') || pos.includes('delantero') || pos.includes('forward') || pos.includes('extrem')) return <Target size={12} className="text-white" />;
    return <Activity size={12} className="text-white" />;
  };

  const handleOpenUserModal = (user?: User) => {
    if (user) {
      setEditingUserId(user.id);
      setUserForm(user);
    } else {
      setEditingUserId(null);
      setUserForm({
        name: '', email: '', phone: '', role: 'Famil', premsBalance: 0,
        initials: '', language: 'ca', level: 1, xp: 0, skills: { tecnica: 0, fisico: 0, tactica: 0, mentalidad: 0 }
      });
    }
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId && onUpdateUser) {
      onUpdateUser({ ...userForm, id: editingUserId } as User);
    } else if (onAddUser) {
      onAddUser({ 
        ...userForm, 
        id: `user-${Date.now()}`,
        initials: userForm.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U',
        accountStatus: UserAccountStatus.CREATED_BY_ADMIN,
        status: 'Actiu'
      });
    }
    setIsUserModalOpen(false);
    setEditingUserId(null);
  };

  const handleSaveTask = () => {
    if (!newTaskData.title || !newTaskData.sessionIds || newTaskData.sessionIds.length === 0) {
      alert('El títol i almenys una sessió són obligatoris.');
      return;
    }

    if (editingTask && onUpdateTasks) {
      onUpdateTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...newTaskData } as Task : t));
    } else if (onUpdateTasks) {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        title: newTaskData.title!,
        sessionIds: newTaskData.sessionIds!,
        objective: newTaskData.objective,
        description: newTaskData.description,
        date: 'Ara mateix',
        status: 'Activa',
        type: newTaskData.type || 'General',
        pdfUrl: newTaskData.pdfUrl,
        fileName: newTaskData.fileName
      };
      onUpdateTasks([...tasks, newTask]);
    }
    
    setIsCreatingTask(false);
    setEditingTask(null);
    setNewTaskData({
      title: '',
      sessionIds: [],
      objective: '',
      description: '',
      type: 'General',
      pdfUrl: undefined,
      fileName: undefined
    });
  };

  const handleFileUpload = (type: 'video' | 'task' | 'session', name: string) => {
    setUploadingFile(true);
    setTimeout(() => {
      setUploadedFiles(prev => [{ name, type, date: new Date().toLocaleDateString() }, ...prev]);
      setUploadingFile(false);
    }, 1500);
  };

  const handleExportPlayers = () => {
    const csvContent = "data:text/csv;charset=utf-8,ID,Nom,Cognoms,DNI,Categoria,Estat\n" + 
      filteredPlayers.map(p => `${p.id},${p.firstName},${p.lastName},${p.dni},${p.category},${p.status}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `export_jugadors_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenSedeModal = (sede?: Sede) => {
    if (sede) {
      setEditingSedeId(sede.id);
      setSedeForm(sede);
    } else {
      setEditingSedeId(null);
      setSedeForm({
        name: '', location: '', description: '', image: '', phone: '', schedule: '', email: '', googleMapsUrl: '', resources: [], activeServiceIds: []
      });
    }
    setIsSedeModalOpen(true);
  };

  const handleSaveSede = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSedeId) {
      onUpdateSeus(prev => prev.map(s => s.id === editingSedeId ? { ...s, ...sedeForm } as Sede : s));
    } else {
      const newSede: Sede = {
        ...sedeForm,
        id: 'sede-' + Math.random().toString(36).substr(2, 9),
        resources: sedeForm.resources || [],
        activeServiceIds: sedeForm.activeServiceIds || []
      } as Sede;
      onUpdateSeus(prev => [...prev, newSede]);
    }
    setIsSedeModalOpen(false);
  };

  const handleDeleteSede = (id: string) => {
    askConfirmation(
      'Eliminar Seu',
      'Segur que vols eliminar aquesta seu? Aquesta acció no es pot desfer.',
      () => onUpdateSeus(prev => prev.filter(s => s.id !== id))
    );
  };

  const handleOpenStaffModal = (staff?: User) => {
    if (staff) {
      const names = staff.name.split(' ');
      setEditingStaffId(staff.id);
      setStaffForm({
        firstName: names[0] || '',
        lastName: names.slice(1).join(' ') || '',
        email: staff.email || '',
        role: staff.role,
        assignedSedes: []
      });
    } else {
      setEditingStaffId(null);
      setStaffForm({ firstName: '', lastName: '', email: '', role: 'Coach', assignedSedes: [] });
    }
    setIsStaffModalOpen(true);
  };

  const [isPremsModalOpen, setIsPremsModalOpen] = useState(false);
  const [premsAmount, setPremsAmount] = useState(0);
  const [premsTargetUser, setPremsTargetUser] = useState<User | null>(null);

  const handleAddPremsManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (premsTargetUser && onUpdateUser) {
      onUpdateUser({
        ...premsTargetUser,
        premsBalance: (premsTargetUser.premsBalance || 0) + premsAmount
      });
      alert(`S'han afegit ${premsAmount} Prems a ${premsTargetUser.name}.`);
      setIsPremsModalOpen(false);
      setPremsAmount(0);
      setPremsTargetUser(null);
    }
  };

  const navItems = [
    { section: 'Gestió', items: [
      { id: 'dashboard', label: 'Dashboard Admin', icon: <LayoutDashboard size={20} /> },
      { id: 'agenda', label: 'Agenda', icon: <CalendarDays size={20} /> },
      { id: 'pro', label: 'Eina Esportiva', icon: <Sparkles size={20} /> },
      { id: 'usuaris', label: 'Usuaris / Atletes', icon: <Users size={20} /> },
      { id: 'assistencia', label: 'Assistència', icon: <CheckCircle2 size={20} /> },
      { id: 'staff', label: 'Equip Staff', icon: <Shield size={20} /> },
    ]},
    { section: 'Operacions', items: [
      { id: 'serveis', label: 'Servicios / Packs', icon: <Package size={20} /> },
      { id: 'buzon', label: 'Bústia', icon: <MessageSquare size={20} /> },
      { id: 'comunicacions', label: 'Comunicacions', icon: <Megaphone size={20} /> },
      { id: 'seus', label: 'Sedes / Recursos', icon: <MapPin size={20} /> },
      { id: 'facturacio', label: 'Facturació', icon: <CreditCard size={20} /> },
    ]},
  ];

  const upcomingSessions = useMemo(() => {
    return [...localSessions]
      .filter(s => new Date(s.startTime) > new Date())
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
      .slice(0, 5);
  }, [localSessions]);

  const newUsers = useMemo(() => {
    return [...registeredUsers].reverse().slice(0, 5);
  }, [registeredUsers]);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-inter text-gray-900">
      
      {/* SIDEBAR ADMIN RESPONSIVA */}
      <aside className={`fixed lg:relative inset-y-0 left-0 z-[60] w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0 shadow-2xl lg:shadow-none' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <button onClick={() => { setIsSidebarOpen(false); onBackToDashboard(); }} className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-prem-gold bg-gray-50 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest mb-8 border border-transparent">
            <ArrowLeft size={16} /> Tornar a l'App
          </button>
          <div className="flex items-center gap-4 px-2 mb-10">
             <div className="w-10 h-10 gold-gradient rounded-xl flex items-center justify-center text-white shadow-lg"><ShieldCheck size={22} /></div>
             <div><h1 className="font-black text-lg uppercase leading-none">Menú Admin</h1><p className="text-[9px] font-black text-prem-gold uppercase mt-1">Control Center</p></div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 pb-8 no-scrollbar">
          {navItems.map((section, sidx) => (
            <div key={sidx} className="mb-8">
              <p className="px-4 text-[9px] font-black text-gray-300 uppercase tracking-widest mb-4">{section.section}</p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <button 
                    key={item.id} 
                    onClick={() => { setActiveTab(item.id as AdminTab); setIsSidebarOpen(false); }} 
                    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold transition-all duration-300 ${activeTab === item.id ? 'bg-black text-prem-gold shadow-xl shadow-black/10' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    <span className={activeTab === item.id ? 'text-prem-gold' : 'text-gray-300'}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* OVERLAY SIDEBAR MÒBIL */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <div className={`flex-1 flex flex-col min-w-0 h-full overflow-hidden`}>
        <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-10 shrink-0 z-40">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)} 
                className="p-2 bg-gray-50 text-gray-400 hover:text-prem-gold rounded-xl lg:hidden active:scale-95 transition-all"
              >
                <Menu size={20} />
              </button>
              <h2 className="font-black text-sm lg:text-xl tracking-tighter uppercase text-gray-900 truncate">
                {activeTab === 'dashboard' ? "Dashboard Admin" : activeTab === 'usuaris' ? "Gestió d'Usuaris" : activeTab === 'facturacio' ? "Facturació i Pagaments" : activeTab === 'serveis' ? "Gestió de Packs i Serveis" : activeTab === 'buzon' ? "Bústia de Missatgeria" : activeTab === 'staff' ? "Gestió del Staff" : activeTab === 'comunicacions' ? "Comunicacions i Avisos" : activeTab === 'pro' ? "Eina Esportiva" : activeTab === 'assistencia' ? "Control d'Assistència" : activeTab.toUpperCase()}
              </h2>
           </div>

           <div className="flex items-center gap-4">
              {activeTab === 'dashboard' && (
                <div className="relative">
                  <button 
                    onClick={() => setIsTimeRangeDropdownOpen(!isTimeRangeDropdownOpen)}
                    className="flex items-center gap-3 px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl font-black text-[10px] uppercase tracking-widest text-gray-600 hover:bg-white hover:border-prem-gold/30 hover:text-prem-gold transition-all"
                  >
                    <Calendar size={14} />
                    {dashboardTimeRange}
                    <ChevronDown size={14} className={`transition-transform duration-300 ${isTimeRangeDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isTimeRangeDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl border border-gray-100 shadow-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
                      {(['setmana', 'mes', 'trimestre', 'temporada'] as const).map((range) => (
                        <button 
                          key={range}
                          onClick={() => {
                            setDashboardTimeRange(range);
                            setIsTimeRangeDropdownOpen(false);
                          }}
                          className={`w-full px-6 py-4 text-left font-black text-[10px] uppercase tracking-widest transition-all border-b border-gray-50 last:border-0 ${dashboardTimeRange === range ? 'bg-prem-gold/5 text-prem-gold' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-900'}`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                 <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sistema Online</span>
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 no-scrollbar bg-prem-bg">
           <div className="max-w-[1600px] mx-auto h-full">
              
               {activeTab === 'pro' && (
                 <div className="space-y-8 animate-in fade-in duration-700">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                       {[
                         { id: 'videos', title: 'Vídeos Tàctics', desc: 'Anàlisi i correccions', icon: <Video className="text-blue-500" />, color: 'blue' },
                         { id: 'tasks', title: 'SESSIONS', desc: 'TREBALL SETMANAL', icon: <Target className="text-prem-gold" />, color: 'gold' }
                       ].map((tool) => (
                         <button 
                           key={tool.id}
                           onClick={() => setActiveTool(tool.id as any)}
                           className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left group"
                         >
                            <div className="flex items-center justify-between mb-6">
                               <div className={`p-4 bg-${tool.color === 'gold' ? 'prem-gold' : tool.color}-50 rounded-2xl group-hover:rotate-12 transition-transform`}>
                                  {tool.icon}
                               </div>
                               <ChevronRight className="text-gray-200 group-hover:text-prem-gold transition-colors" />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">{tool.title}</h3>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tool.desc}</p>
                         </button>
                       ))}
                    </div>

                    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                       <div className="p-8 lg:p-10 border-b border-gray-50 flex items-center justify-between">
                          <div>
                             <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Historial d'Activitat Pro</h3>
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Últims fitxers i tasques gestionades</p>
                          </div>
                       </div>
                       <div className="divide-y divide-gray-50">
                          {uploadedFiles.length === 0 && tasks.length === 0 ? (
                            <div className="p-20 text-center">
                               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Sparkles size={32} className="text-gray-200" />
                               </div>
                               <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Encara no hi ha activitat registrada</p>
                            </div>
                          ) : (
                            <>
                              {tasks.map(task => (
                                <div key={task.id} className="p-6 lg:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                                   <div className="flex items-center gap-6">
                                      <div className="p-3 bg-prem-gold/10 text-prem-gold rounded-xl">
                                         <Target size={20} />
                                      </div>
                                      <div>
                                         <h4 className="font-black text-gray-900 uppercase tracking-tight">{task.title}</h4>
                                         <div className="flex items-center gap-3 mt-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{task.date}</span>
                                            <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                                            <span className="text-[10px] font-black text-prem-gold uppercase tracking-widest">{task.type}</span>
                                         </div>
                                      </div>
                                   </div>
                                   <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${task.status === 'Activa' ? 'bg-green-50 text-green-600' : task.status === 'Acabada' ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-500'}`}>
                                      {task.status}
                                   </span>
                                </div>
                              ))}
                              {uploadedFiles.map((file, i) => (
                                <div key={i} className="p-6 lg:p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all">
                                   <div className="flex items-center gap-6">
                                      <div className={`p-3 rounded-xl ${file.type === 'video' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                         {file.type === 'video' ? <Video size={20} /> : <FileText size={20} />}
                                      </div>
                                      <div>
                                         <h4 className="font-black text-gray-900 uppercase tracking-tight">{file.name}</h4>
                                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{file.date} · {file.type === 'video' ? 'Vídeo Tàctic' : 'Document de Planificació'}</p>
                                      </div>
                                   </div>
                                   <button className="p-2 text-gray-400 hover:text-prem-gold transition-colors">
                                      <Download size={20} />
                                   </button>
                                </div>
                              ))}
                            </>
                          )}
                       </div>
                    </div>
                 </div>
               )}
               {activeTab === 'dashboard' && (
                 <div className="space-y-4 lg:space-y-8 animate-in fade-in duration-700">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                    {[
                      { label: 'Facturació', value: `${billingMetrics.total.toLocaleString()}€`, trend: '+12%', icon: <CreditCard size={16} className="text-green-500 lg:size-5" /> },
                      { label: 'Atletes', value: players.length, trend: '+5', icon: <Users size={16} className="text-blue-500 lg:size-5" /> },
                      { label: 'Sessions', value: '4', trend: 'Full', icon: <Calendar size={16} className="text-prem-gold lg:size-5" /> },
                      { label: 'Ocupació', value: '84%', trend: '-2%', icon: <Target size={16} className="text-orange-500 lg:size-5" /> },
                    ].map((kpi, i) => (
                      <div key={i} className="bg-white p-3 lg:p-8 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all">
                        <div className="flex justify-between items-start mb-2 lg:mb-4">
                           <div className="p-2 lg:p-3 bg-gray-50 rounded-xl lg:rounded-2xl group-hover:scale-110 transition-transform">{kpi.icon}</div>
                           <span className={`text-[8px] lg:text-[10px] font-black px-1.5 py-0.5 rounded-lg ${kpi.trend.includes('+') ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-400'}`}>{kpi.trend}</span>
                        </div>
                        <div>
                          <p className="text-[8px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">{kpi.label}</p>
                          <h3 className="text-sm lg:text-3xl font-black text-gray-900">{kpi.value}</h3>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                    <div className="lg:col-span-8 space-y-6 lg:space-y-8">
                      <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 lg:p-10 border-b border-gray-50 flex items-center justify-between">
                          <h3 className="text-base lg:text-xl font-black uppercase tracking-tighter flex items-center gap-2 lg:gap-3">
                            <Clock size={18} className="text-prem-gold" /> Pròximes Sessions
                          </h3>
                        </div>
                        <div className="divide-y divide-gray-50">
                          {upcomingSessions.map((session) => (
                            <div key={session.id} className="p-4 lg:p-8 flex items-center justify-between hover:bg-gray-50/80 transition-all group">
                              <div className="flex items-center gap-3 lg:gap-6">
                                <div className="text-center min-w-[40px] lg:min-w-[60px]">
                                   <p className="text-[7px] lg:text-[10px] font-black text-gray-300 uppercase leading-none mb-1">{new Date(session.startTime).toLocaleString('ca-ES', { month: 'short' })}</p>
                                   <p className="text-base lg:text-2xl font-black text-gray-900 leading-none">{new Date(session.startTime).getDate()}</p>
                                </div>
                                <div className="h-6 lg:h-10 w-px bg-gray-100"></div>
                                <div className="min-w-0">
                                   <h4 className="font-black text-gray-900 uppercase tracking-tight text-[11px] lg:sm truncate">{session.name}</h4>
                                   <div className="flex items-center gap-2 lg:gap-3 mt-0.5 lg:mt-1">
                                      <span className="text-[8px] lg:text-[10px] font-bold text-gray-400 flex items-center gap-1"><MapPin size={8} /> {session.location}</span>
                                      <span className="text-[8px] lg:text-[10px] font-bold text-prem-gold flex items-center gap-1"><Clock size={8} /> {new Date(session.startTime).getHours()}:00h</span>
                                      <span className="text-[8px] lg:text-[10px] font-bold text-gray-900 flex items-center gap-1 border-l border-gray-100 pl-2 ml-1">
                                         <Shield size={8} className="text-prem-gold" /> 
                                         {staffMembers.find(s => s.id === session.coachId)?.name.split(' ')[0] || 'Sense assignar'}
                                      </span>
                                   </div>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleOpenSessionEdit(session)}
                                className="p-2 lg:p-3 bg-gray-50 text-gray-400 hover:text-prem-gold hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100"
                              >
                                <Edit2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-4 space-y-6 lg:space-y-8">
                       <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                          <div className="p-6 lg:p-8 border-b border-gray-50">
                             <h3 className="text-base lg:text-xl font-black uppercase tracking-tighter flex items-center gap-2 lg:gap-3">
                                <UserPlus size={18} className="text-prem-gold" /> Nous Usuaris
                             </h3>
                          </div>
                          <div className="p-2">
                             {newUsers.map((u, i) => (
                               <div key={i} className="flex items-center gap-3 lg:gap-4 p-2 lg:p-4 hover:bg-gray-50 rounded-2xl lg:rounded-3xl transition-all group">
                                  <div className={`w-8 h-8 lg:w-12 lg:h-12 rounded-lg lg:rounded-2xl flex items-center justify-center text-white font-black text-[9px] lg:text-xs shadow-md ${u.role === 'Admin' ? 'bg-black' : 'gold-gradient'}`}>
                                    {u.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                     <p className="text-[11px] lg:text-sm font-black text-gray-900 uppercase tracking-tight truncate">{u.name}</p>
                                     <p className="text-[7px] lg:text-[9px] font-bold text-gray-400 uppercase tracking-widest truncate">{u.role}</p>
                                  </div>
                                  <ChevronRight size={12} className="text-gray-200" />
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'assistencia' && (
                <div className="space-y-8 animate-in fade-in duration-700">
                   <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                      <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
                         {[
                           { id: 'sessions', label: 'Per Sessió', icon: <Calendar size={14} /> },
                           { id: 'jugadors', label: 'Per Jugador', icon: <Users size={14} /> }
                         ].map(v => (
                           <button 
                             key={v.id}
                             onClick={() => setAssistenciaView(v.id as any)}
                             className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${assistenciaView === v.id ? 'gold-gradient text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                           >
                             {v.icon} {v.label}
                           </button>
                         ))}
                      </div>
                      
                      <div className="relative w-full lg:w-80">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                         <input 
                           type="text" 
                           placeholder={assistenciaView === 'sessions' ? "Cerca sessió..." : "Cerca jugador..."}
                           value={assistenciaSearch}
                           onChange={(e) => setAssistenciaSearch(e.target.value)}
                           className="w-full bg-white border border-gray-100 rounded-2xl pl-10 pr-4 py-3 text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 shadow-sm"
                         />
                      </div>
                   </div>

                   {assistenciaView === 'sessions' ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {localSessions
                          .filter(s => s.name.toLowerCase().includes(assistenciaSearch.toLowerCase()))
                          .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                          .map(session => {
                            const attendanceCount = session.attendance ? Object.values(session.attendance).filter(v => v === 'present').length : 0;
                            const totalCount = session.attendance ? Object.keys(session.attendance).length : 0;
                            const percentage = totalCount > 0 ? Math.round((attendanceCount / totalCount) * 100) : 0;
                            
                            return (
                              <div key={session.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group">
                                 <div className="p-6 border-b border-gray-50 flex justify-between items-start">
                                    <div>
                                       <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded bg-gray-100 text-gray-500 mb-2 inline-block">{session.category}</span>
                                       <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter leading-none">{session.name}</h4>
                                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">{new Date(session.startTime).toLocaleDateString('ca-ES', { day: '2-digit', month: 'long' })}</p>
                                    </div>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm ${percentage >= 80 ? 'bg-green-50 text-green-600' : percentage >= 50 ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500'}`}>
                                       {percentage}%
                                    </div>
                                 </div>
                                 <div className="p-6 bg-gray-50/50">
                                    <div className="flex justify-between items-center mb-4">
                                       <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Assistència</span>
                                       <span className="text-xs font-black text-gray-900">{attendanceCount} / {totalCount} Jugadors</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                       <div className={`h-full transition-all duration-1000 ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }}></div>
                                    </div>
                                 </div>
                                 <button className="w-full py-4 bg-white text-[10px] font-black uppercase tracking-widest text-prem-gold hover:bg-prem-gold hover:text-white transition-all border-t border-gray-50">
                                    Veure Detalls
                                 </button>
                              </div>
                            );
                          })}
                     </div>
                   ) : (
                     <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                           <thead className="bg-gray-50/50 border-b border-gray-100">
                              <tr>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Jugador</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Categoria</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Sessions</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Assistència</th>
                                 <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Accions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-50">
                              {players
                                .filter(p => `${p.firstName} ${p.lastName}`.toLowerCase().includes(assistenciaSearch.toLowerCase()))
                                .map(player => {
                                  const playerSessions = localSessions.filter(s => s.status === 'completed' && s.attendance && s.attendance[`${player.firstName} ${player.lastName}`]);
                                  const attendanceCount = playerSessions.filter(s => s.attendance![`${player.firstName} ${player.lastName}`] === 'present').length;
                                  const totalCount = playerSessions.length;
                                  const percentage = totalCount > 0 ? Math.round((attendanceCount / totalCount) * 100) : 0;

                                  return (
                                    <tr key={player.id} className="hover:bg-gray-50/50 transition-all group">
                                       <td className="px-8 py-5">
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-black text-xs shadow-sm">
                                                {player.firstName[0]}{player.lastName[0]}
                                             </div>
                                             <p className="font-black text-gray-900 uppercase tracking-tight">{player.firstName} {player.lastName}</p>
                                          </div>
                                       </td>
                                       <td className="px-8 py-5">
                                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{player.category}</span>
                                       </td>
                                       <td className="px-8 py-5 text-center">
                                          <span className="text-sm font-black text-gray-900">{totalCount}</span>
                                       </td>
                                       <td className="px-8 py-5">
                                          <div className="flex items-center justify-center gap-4">
                                             <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${percentage}%` }}></div>
                                             </div>
                                             <span className={`text-[10px] font-black ${percentage >= 80 ? 'text-green-600' : percentage >= 50 ? 'text-orange-500' : 'text-red-500'}`}>{percentage}%</span>
                                          </div>
                                       </td>
                                       <td className="px-8 py-5 text-right">
                                          <button className="p-2 text-gray-300 hover:text-prem-gold transition-colors">
                                             <Eye size={18} />
                                          </button>
                                       </td>
                                    </tr>
                                  );
                                })}
                           </tbody>
                        </table>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'usuaris' && (
                <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500">
                   <div className="flex items-center gap-1.5 lg:gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-fit">
                      {[
                        { id: 'families', label: 'Famílies', icon: <UserIcon size={14} /> },
                        { id: 'jugadors', label: 'Jugadors', icon: <Target size={14} /> }
                      ].map(sub => (
                        <button 
                          key={sub.id} 
                          onClick={() => { setUserSubTab(sub.id as UserSubTab); setUserSearch(''); }} 
                          className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 lg:px-8 py-3 rounded-xl text-[10px] lg:text-[12px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${userSubTab === sub.id ? 'gold-gradient text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                        >
                          {sub.icon} <span className="inline">{sub.label}</span>
                        </button>
                      ))}
                   </div>

                   {userSubTab === 'jugadors' ? (
                     <div className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-3 lg:p-4 rounded-2xl border border-gray-100 shadow-sm">
                           <div className="relative w-full lg:w-80">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                              <input 
                                type="text" 
                                placeholder="Cerca per nom o cognom..." 
                                value={playerSearch} 
                                onChange={(e) => setPlayerSearch(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 transition-all" 
                              />
                           </div>
                               <div className="flex flex-col sm:flex-row items-center gap-2 lg:gap-3 w-full lg:w-auto">
                                  <div className="flex gap-2 w-full">
                                    <div className="flex-1 flex items-center gap-2 bg-gray-50 px-2 py-2 rounded-xl border border-gray-100">
                                       <MapPin size={12} className="text-prem-gold shrink-0" />
                                       <select value={filterPlayerSede} onChange={(e) => setFilterPlayerSede(e.target.value)} className="bg-transparent text-[9px] font-black uppercase text-gray-600 focus:outline-none w-full">
                                          <option value="all">Totes</option>
                                          {seus.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                       </select>
                                    </div>
                                    <div className="flex-1 flex items-center gap-2 bg-gray-50 px-2 py-2 rounded-xl border border-gray-100">
                                       <Activity size={12} className="text-prem-gold shrink-0" />
                                       <select value={filterPlayerStatus} onChange={(e) => setFilterPlayerStatus(e.target.value)} className="bg-transparent text-[9px] font-black uppercase text-gray-600 focus:outline-none w-full">
                                          <option value="all">Estat</option>
                                          <option value="Actiu">Actius</option>
                                          <option value="Inactiu">Inactius</option>
                                       </select>
                                    </div>
                                  </div>
                                  <div className="flex gap-2 w-full lg:w-auto">
                                    <button onClick={handleExportPlayers} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-xl font-black text-[8px] uppercase tracking-widest active:scale-95 transition-all">
                                       <Download size={12} /> EXPORTAR
                                    </button>
                                    <button onClick={() => handleOpenPlayerModal()} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                                       <Plus size={12} /> ALTA JUGADOR
                                    </button>
                                  </div>
                               </div>
                        </div>

                         <div className="grid grid-cols-1 gap-3 lg:hidden">
                           {filteredPlayers.map(p => (
                             <div key={p.id} className="bg-white p-3 rounded-3xl border border-gray-100 shadow-sm space-y-3" onClick={() => setSelectedPlayer(p)}>
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                      <div className="relative">
                                         <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-black text-[10px] shadow-md">
                                            {p.firstName[0]}{p.lastName[0]}
                                         </div>
                                         <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-lg flex items-center justify-center border-2 border-white shadow-sm">
                                            {getPositionIcon(p.mainPosition)}
                                         </div>
                                      </div>
                                      <div>
                                         <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{p.firstName} {p.lastName}</p>
                                         <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{p.dni} · {p.category}</p>
                                      </div>
                                   </div>
                                   <span className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest ${p.status === 'Actiu' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{p.status}</span>
                                </div>
                                <div className="grid grid-cols-3 gap-2 py-2 border-y border-gray-50">
                                   <div className="text-center">
                                      <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Sessions</p>
                                      <p className="text-xs font-black text-gray-900">{p.totalSessions}</p>
                                   </div>
                                   <div className="text-center">
                                      <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Tutor</p>
                                      <p className="text-[9px] font-bold text-gray-600 uppercase truncate">{getTutorInfo(p.guardianId)?.name.split(' ')[0] || '-'}</p>
                                   </div>
                                   <div className="text-center">
                                      <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Seu</p>
                                      <p className="text-[9px] font-bold text-gray-600 uppercase truncate">{seus.find(s => s.id === p.assignedSedeId)?.name || '-'}</p>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setSelectedPlayer(p); }}
                                     className="flex-1 py-2 bg-gray-50 text-gray-400 font-black text-[8px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 active:bg-gray-100"
                                   >
                                     <Eye size={12}/> Fitxa
                                   </button>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleOpenPlayerModal(p); }}
                                     className="flex-1 py-2 bg-gray-50 text-gray-400 font-black text-[8px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 active:bg-gray-100"
                                   >
                                     <Edit2 size={12}/> Editar
                                   </button>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleTogglePlayerStatus(p); }}
                                     className="p-2 bg-gray-50 text-gray-300 rounded-xl active:bg-red-50 active:text-red-500"
                                   >
                                     <Power size={12}/>
                                   </button>
                                </div>
                             </div>
                           ))}
                        </div>

                        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                           <table className="w-full text-left">
                              <thead className="bg-gray-50/50 border-b border-gray-100">
                                 <tr>
                                    <th className="px-4 py-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Atleta</th>
                                    <th className="px-4 py-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Tutor / Contacte</th>
                                    <th className="px-4 py-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Seu / Grup</th>
                                    <th className="px-4 py-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Sessions</th>
                                    <th className="px-4 py-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Estat</th>
                                    <th className="px-4 py-2 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Accions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                 {filteredPlayers.map((p) => (
                                   <tr key={p.id} className="hover:bg-gray-50/30 transition-all group">
                                      <td className="px-4 py-2">
                                         <div className="flex items-center gap-4">
                                            <div className="relative">
                                               <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-110 transition-transform">
                                                  {p.firstName[0]}{p.lastName[0]}
                                               </div>
                                               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-black rounded-lg flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                                  {getPositionIcon(p.mainPosition)}
                                               </div>
                                            </div>
                                            <div><p className="text-xs font-black text-gray-900 uppercase tracking-tight">{p.firstName} {p.lastName}</p><p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{p.dni} · {p.category}</p></div>
                                         </div>
                                      </td>
                                      <td className="px-4 py-2"><p className="text-[11px] font-bold text-gray-600 uppercase">{getTutorInfo(p.guardianId)?.name || 'N/A'}</p><p className="text-[8px] font-medium text-gray-400">{getTutorInfo(p.guardianId)?.phone || '-'}</p></td>
                                      <td className="px-4 py-2"><div className="flex items-center gap-1.5 mb-0.5"><MapPin size={9} className="text-prem-gold" /><span className="text-[11px] font-black text-gray-700 uppercase tracking-tighter">{seus.find(s => s.id === p.assignedSedeId)?.name || '-'}</span></div><span className="text-[8px] font-black text-prem-gold uppercase tracking-widest">Grup Pro A</span></td>
                                      <td className="px-4 py-2 text-center"><p className="text-base font-black text-gray-900">{p.totalSessions}</p><p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Sessions totals</p></td>
                                      <td className="px-4 py-2 text-center"><span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${p.status === 'Actiu' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>{p.status}</span></td>
                                      <td className="px-4 py-2">
                                         <div className="flex items-center justify-center gap-1.5">
                                            <button onClick={() => setSelectedPlayer(p)} className="p-2 bg-gray-50 text-gray-400 hover:text-prem-gold hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100" title="Fitxa Completa">
                                               <Eye size={16} />
                                            </button>
                                            <button onClick={() => handleOpenPlayerModal(p)} className="p-2 bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100" title="Editar Jugador">
                                               <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleTogglePlayerStatus(p)} className="p-2 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100" title="Activar/Desactivar">
                                               <Power size={16} />
                                            </button>
                                         </div>
                                      </td>
                                   </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white p-3 lg:p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
                           <div className="relative w-full lg:w-80">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={14} />
                              <input type="text" placeholder="Cerca tutor o email..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-gray-900 focus:outline-none" />
                           </div>
                           <button onClick={() => handleOpenUserModal()} className="flex items-center justify-center gap-2 w-full lg:w-auto px-4 py-2 bg-gray-900 text-white rounded-xl font-black text-[8px] uppercase tracking-widest shadow-lg hover:bg-black transition-all active:scale-95">
                              <UserPlus size={14} /> Alta Tutor
                           </button>
                        </div>

                         <div className="grid grid-cols-1 gap-3 lg:hidden">
                           {filteredFamilies.map(u => (
                             <div key={u.id} className="bg-white p-3 rounded-3xl border border-gray-100 shadow-sm space-y-3" onClick={() => setSelectedUserDetail(u)}>
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-black text-[10px] shadow-md">{u.initials}</div>
                                      <div>
                                         <p className="text-xs font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{u.name}</p>
                                         <div className="flex items-center gap-2">
                                           <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest truncate max-w-[100px]">{u.email}</p>
                                           <select 
                                             value={u.role} 
                                             onChange={(e) => { e.stopPropagation(); onUpdateUserRole?.(u.id, e.target.value as UserRole); }}
                                             className="bg-gray-50 border border-gray-100 rounded-md px-1 py-0.5 text-[7px] font-black uppercase text-gray-600 focus:outline-none"
                                           >
                                             <option value="Athlete">Jugador</option>
                                             <option value="Famil">Familia</option>
                                             <option value="Coach">Entrenador</option>
                                             <option value="Coordinador">Coordinador</option>
                                             <option value="Admin">Administrador</option>
                                           </select>
                                         </div>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-xs font-black text-prem-gold">{u.premsBalance} <span className="text-[7px] uppercase">Prems</span></p>
                                   </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 py-2 border-y border-gray-50">
                                   <div className="text-center">
                                      <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Fills Inscrits</p>
                                      <p className="text-xs font-black text-gray-900">{getKidsForTutor(u.id).length}</p>
                                   </div>
                                   <div className="text-center">
                                      <p className="text-[7px] font-black text-gray-300 uppercase tracking-widest mb-0.5">Telèfon</p>
                                      <p className="text-[9px] font-bold text-gray-600 truncate">{u.phone || '-'}</p>
                                   </div>
                                </div>
                                <div className="flex gap-2">
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); setActiveTab('buzon'); setSelectedUserDetail(null); }}
                                     className="flex-1 py-2 bg-gray-50 text-gray-400 font-black text-[8px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 active:bg-gray-100"
                                   >
                                     <Mail size={12}/> Missatge
                                   </button>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleOpenUserModal(u); }}
                                     className="flex-1 py-2 bg-gray-50 text-gray-400 font-black text-[8px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 active:bg-gray-100"
                                   >
                                     <Edit2 size={12}/> Editar
                                   </button>
                                   <button 
                                     onClick={(e) => { e.stopPropagation(); handleOpenUserModal(u); }}
                                     className="p-2 bg-gray-50 text-gray-300 rounded-xl active:bg-gray-100"
                                   >
                                     <MoreVertical size={12}/>
                                   </button>
                                </div>
                             </div>
                           ))}
                        </div>

                        <div className="hidden lg:block bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                           <table className="w-full text-left">
                              <thead className="bg-gray-50/50 border-b border-gray-100">
                                 <tr>
                                    <th className="px-3 py-1.5 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Tutor / Contacte</th>
                                    <th className="px-3 py-1.5 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Atletes vinculats</th>
                                    <th className="px-3 py-1.5 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Rol</th>
                                    <th className="px-3 py-1.5 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-right">Saldo Prems</th>
                                    <th className="px-3 py-1.5 text-[9px] font-black text-gray-300 uppercase tracking-[0.2em] text-center">Accions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                 {filteredFamilies.map((u) => (
                                   <tr key={u.id} className="hover:bg-gray-50/30 transition-all group">
                                      <td className="px-3 py-1.5">
                                         <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center text-white font-black text-xs shadow-md group-hover:scale-110 transition-transform">{u.initials}</div>
                                            <div><p className="text-xs font-black text-gray-900 uppercase tracking-tight">{u.name}</p><p className="text-[8px] font-medium text-gray-400 uppercase tracking-widest">{u.email} · {u.phone}</p></div>
                                         </div>
                                      </td>
                                      <td className="px-3 py-1.5">
                                         <div className="flex flex-wrap gap-1.5">
                                            {getKidsForTutor(u.id).map(kid => (
                                               <span key={kid.id} className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md text-[8px] font-black uppercase">{kid.firstName}</span>
                                            ))}
                                            {getKidsForTutor(u.id).length === 0 && <span className="text-gray-300 italic text-[10px]">Cap vinculat</span>}
                                         </div>
                                      </td>
                                      <td className="px-3 py-1.5">
                                         <select 
                                           value={u.role} 
                                           onChange={(e) => onUpdateUserRole?.(u.id, e.target.value as UserRole)}
                                           className="bg-gray-50 border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-black uppercase text-gray-700 focus:outline-none focus:ring-2 focus:ring-prem-gold/20"
                                         >
                                           <option value="Athlete">Jugador</option>
                                           <option value="Famil">Familia</option>
                                           <option value="Coach">Entrenador</option>
                                           <option value="Coordinador">Coordinador</option>
                                           <option value="Admin">Administrador</option>
                                         </select>
                                      </td>
                                      <td className="px-3 py-1.5 text-right">
                                         <p className="text-base font-black text-prem-gold">{u.premsBalance}</p>
                                         <p className="text-[7px] font-bold text-gray-300 uppercase tracking-widest">Saldo actiu</p>
                                      </td>
                                      <td className="px-3 py-1.5"><div className="flex items-center justify-center gap-1.5"><button onClick={() => setSelectedUserDetail(u)} className="p-2 bg-gray-50 text-gray-400 hover:text-prem-gold hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100" title="Veure Detall">
                                                <Eye size={16} />
                                             </button>
                                             <button onClick={() => { setActiveTab('buzon'); setSelectedUserDetail(null); }} className="p-2 bg-gray-50 text-gray-400 hover:text-blue-500 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100" title="Enviar Missatge">
                                                <Mail size={16} />
                                             </button>
                                             <button onClick={() => handleOpenUserModal(u)} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-white rounded-lg transition-all shadow-sm border border-transparent hover:border-gray-100" title="Ajustes">
                                                <Settings size={16} />
                                             </button></div></td>
                                   </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                   )}
                </div>
              )}

              {activeTab === 'staff' && (
                <div className="space-y-4 lg:space-y-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                    <div className="bg-white p-3 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div className="p-2 lg:p-3 bg-blue-50 text-blue-600 rounded-xl lg:rounded-2xl w-fit mb-2 lg:mb-4"><Users size={16} className="lg:size-5" /></div>
                       <div>
                          <p className="text-[8px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Personal</p>
                          <h3 className="text-base lg:text-2xl font-black text-gray-900">{staffMetrics.total}</h3>
                       </div>
                    </div>
                    <div className="bg-white p-3 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div className="p-2 lg:p-3 bg-prem-gold/10 text-prem-gold rounded-xl lg:rounded-2xl w-fit mb-2 lg:mb-4"><Dumbbell size={16} className="lg:size-5" /></div>
                       <div>
                          <p className="text-[8px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Coaches</p>
                          <h3 className="text-base lg:text-2xl font-black text-gray-900">{staffMetrics.coaches}</h3>
                       </div>
                    </div>
                    <div className="bg-white p-3 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between hidden sm:flex">
                       <div className="p-2 lg:p-3 bg-black text-white rounded-xl lg:rounded-2xl w-fit mb-2 lg:mb-4"><Shield size={16} className="lg:size-5" /></div>
                       <div>
                          <p className="text-[8px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Admins / Coords</p>
                          <h3 className="text-base lg:text-2xl font-black text-gray-900">{staffMetrics.coordinators}</h3>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 lg:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
                     <div className="relative w-full lg:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                        <input 
                          type="text" 
                          placeholder="Cerca per nom..." 
                          value={staffSearch} 
                          onChange={(e) => setStaffSearch(e.target.value)} 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-gray-900 focus:outline-none" 
                        />
                     </div>
                     <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                        <div className="flex items-center gap-2 bg-gray-50 px-4 py-3.5 rounded-xl border border-gray-100 w-full sm:w-auto">
                           <UserCog size={14} className="text-prem-gold" />
                           <select 
                             value={filterStaffRole} 
                             onChange={(e) => setFilterStaffRole(e.target.value)}
                             className="bg-transparent text-[9px] font-black uppercase text-gray-600 focus:outline-none w-full"
                           >
                              <option value="all">Tots Rols</option>
                              <option value="Coach">Coach</option>
                              <option value="Coordinador">Coordinador</option>
                              <option value="Admin">Admin</option>
                              <option value="Athlete">Athlete</option>
                              <option value="Famil">Famil</option>
                           </select>
                        </div>
                        <button onClick={() => handleOpenStaffModal()} className="flex items-center justify-center gap-2 w-full lg:w-auto px-6 py-4 gold-gradient text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all whitespace-nowrap">
                           <Plus size={16} /> Alta Professional
                        </button>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredStaff.map(s => (
                      <div key={s.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl transition-all group">
                         <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                               <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center text-white font-black text-xl shadow-lg transition-transform group-hover:scale-110 ${
                                 s.role === 'Admin' ? 'bg-black' : s.role === 'Coordinador' ? 'bg-blue-600' : 'gold-gradient'
                               }`}>
                                  {s.initials}
                               </div>
                               <div className="flex gap-2">
                                  <button onClick={() => handleOpenStaffModal(s)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-prem-gold rounded-xl transition-all"><Edit2 size={16} /></button>
                                  <button onClick={() => handleToggleStaffStatus(s)} className="p-2.5 bg-gray-50 text-gray-400 hover:text-red-500 rounded-xl transition-all"><Power size={16} /></button>
                               </div>
                            </div>
                            
                            <div className="mb-6">
                               <h3 className="text-xl font-black text-gray-900 tracking-tight uppercase">{s.name}</h3>
                               <div className="mt-2 flex flex-wrap gap-2">
                                 <select 
                                   value={s.role} 
                                   onChange={(e) => onUpdateUserRole?.(s.id, e.target.value as UserRole)}
                                   className={`text-[10px] font-black uppercase tracking-widest bg-transparent border-b border-gray-100 focus:outline-none focus:border-prem-gold transition-colors ${
                                     s.role === 'Admin' ? 'text-gray-400' : s.role === 'Coordinador' ? 'text-blue-500' : 'text-prem-gold'
                                   }`}
                                 >
                                   <option value="Athlete">Jugador</option>
                                   <option value="Famil">Familia</option>
                                   <option value="Coach">Entrenador</option>
                                   <option value="Coordinador">Coordinador</option>
                                   <option value="Admin">Administrador</option>
                                 </select>
                                 
                                 {s.accountStatus && (
                                   <span className={`text-[8px] font-black uppercase px-2 py-1 rounded-lg ${
                                     s.accountStatus === UserAccountStatus.PROFILE_COMPLETE ? 'bg-green-50 text-green-600' :
                                     s.accountStatus === UserAccountStatus.EMAIL_VERIFIED ? 'bg-blue-50 text-blue-600' :
                                     'bg-orange-50 text-orange-600'
                                   }`}>
                                     {s.accountStatus === UserAccountStatus.PROFILE_COMPLETE ? 'Actiu' :
                                      s.accountStatus === UserAccountStatus.EMAIL_VERIFIED ? 'Pendent Perfil' :
                                      'Pendent Email'}
                                   </span>
                                 )}
                               </div>
                               <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                                 s.role === 'Admin' ? 'text-gray-400' : s.role === 'Coordinador' ? 'text-blue-500' : 'text-prem-gold'
                               }`}>{s.role}</p>
                            </div>

                            <div className="space-y-3 pt-6 border-t border-gray-50">
                               <div className="flex items-center gap-3 text-gray-500">
                                  <Mail size={14} className="text-gray-300" />
                                  <span className="text-xs font-medium truncate">{s.email}</span>
                               </div>
                               <div className="flex items-center gap-3 text-gray-500">
                                  <MapPin size={14} className="text-prem-gold" />
                                  <span className="text-xs font-bold text-gray-700 uppercase">Totes les seus</span>
                               </div>
                            </div>
                         </div>
                         <button 
                           onClick={() => { setActiveTab('buzon'); setSelectedUserDetail(null); }}
                           className="w-full py-4 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                         >
                            <MessageSquare size={14} /> Enviar Missatge Directe
                         </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'facturacio' && (
                <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-6">
                    <div className="bg-white p-3 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div className="p-2 lg:p-3 bg-green-50 text-green-600 rounded-xl lg:rounded-2xl w-fit mb-2 lg:mb-4"><TrendingUp size={16} className="lg:size-5" /></div>
                       <div>
                          <p className="text-[7px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Total</p>
                          <h3 className="text-sm lg:text-2xl font-black text-gray-900">{billingMetrics.total.toLocaleString()}€</h3>
                       </div>
                    </div>
                    <div className="bg-white p-3 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div className="p-2 lg:p-3 bg-blue-50 text-blue-600 rounded-xl lg:rounded-2xl w-fit mb-2 lg:mb-4"><Zap size={16} className="lg:size-5" /></div>
                       <div>
                          <p className="text-[7px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Prems</p>
                          <h3 className="text-sm lg:text-2xl font-black text-gray-900">{billingMetrics.totalPrems.toLocaleString()}</h3>
                       </div>
                    </div>
                    <div className="bg-white p-3 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div className="p-2 lg:p-3 bg-purple-50 text-purple-600 rounded-xl lg:rounded-2xl w-fit mb-2 lg:mb-4"><Receipt size={16} className="lg:size-5" /></div>
                       <div>
                          <p className="text-[7px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Trans.</p>
                          <h3 className="text-sm lg:text-2xl font-black text-gray-900">{billingMetrics.count}</h3>
                       </div>
                    </div>
                    <div className="bg-white p-3 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div className="p-2 lg:p-3 bg-orange-50 text-orange-600 rounded-xl lg:rounded-2xl w-fit mb-2 lg:mb-4"><ArrowUpRight size={16} className="lg:size-5" /></div>
                       <div>
                          <p className="text-[7px] lg:text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Ticket</p>
                          <h3 className="text-sm lg:text-2xl font-black text-gray-900">{billingMetrics.avgTicket.toFixed(0)}€</h3>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 lg:gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-fit">
                    {[
                      { id: 'jugadors', label: 'Estat de Pagaments', icon: <Users size={14} /> },
                      { id: 'transaccions', label: 'Historial Transaccions', icon: <HistoryIcon size={14} /> }
                    ].map(sub => (
                      <button 
                        key={sub.id} 
                        onClick={() => setBillingSubTab(sub.id as any)} 
                        className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 lg:px-8 py-3 rounded-xl text-[10px] lg:text-[12px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${billingSubTab === sub.id ? 'gold-gradient text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                      >
                        {sub.icon} <span className="inline">{sub.label}</span>
                      </button>
                    ))}
                  </div>

                  {billingSubTab === 'transaccions' ? (
                    <div className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white p-4 lg:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input 
                              type="text" 
                              placeholder="Cerca per ref..." 
                              value={txSearch} 
                              onChange={(e) => setTxSearch(e.target.value)} 
                              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-gray-900 focus:outline-none" 
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-50 text-gray-400 rounded-xl font-black text-[9px] uppercase tracking-widest border border-gray-100 active:bg-white transition-all">
                              <Filter size={14} /> Filtres
                            </button>
                            <button onClick={handleExportBilling} className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                              <FileSpreadsheet size={14} /> Exportar
                            </button>
                        </div>
                      </div>

                      <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="lg:hidden divide-y divide-gray-100">
                            {filteredTransactions.map(tx => (
                              <div key={tx.id} className="p-5 space-y-4">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1 min-w-0">
                                      <h4 className="font-black text-gray-900 uppercase text-xs truncate">Joan Vila</h4>
                                      <p className="text-[10px] font-bold text-prem-gold uppercase tracking-tight truncate">{tx.pack}</p>
                                    </div>
                                    <div className="text-right shrink-0">
                                      <span className="text-sm font-black text-gray-900">{tx.amount.toFixed(2)}€</span>
                                      <div className="text-[7px] font-black text-green-600 uppercase mt-1">PAGAT</div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center bg-gray-50 p-2.5 rounded-xl">
                                    <span className="text-[8px] font-bold text-gray-500 uppercase">{tx.id} · {tx.date}</span>
                                    <button onClick={() => generateInvoicePDF(tx, { name: "Joan Vila", taxId: "---", address: "---", city: "---", email: "---", postalCode: "---" })} className="p-2 bg-white text-prem-gold rounded-lg shadow-sm border border-prem-gold/10">
                                      <Download size={14} />
                                    </button>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="hidden lg:block overflow-x-auto">
                            <table className="w-full text-left">
                              <thead className="bg-gray-50/50">
                                  <tr>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Referència</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Data</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Client</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest">Producte</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest text-right">Import</th>
                                    <th className="px-10 py-6 text-[10px] font-black text-gray-300 uppercase tracking-widest text-center">Accions</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-50">
                                  {filteredTransactions.map(tx => (
                                    <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                                      <td className="px-10 py-6 font-black text-gray-900 tracking-tight text-xs">{tx.id}</td>
                                      <td className="px-10 py-6 text-gray-400 font-bold uppercase text-[10px]">{tx.date}</td>
                                      <td className="px-10 py-6 font-bold text-gray-700 text-xs">Joan Vila</td>
                                      <td className="px-10 py-6 font-black text-gray-900 uppercase text-xs">{tx.pack}</td>
                                      <td className="px-10 py-6 text-right font-black text-gray-900 text-sm">{tx.amount.toFixed(2)}€</td>
                                      <td className="px-10 py-6 text-center">
                                          <button onClick={() => generateInvoicePDF(tx, { name: "Joan Vila", taxId: "---", address: "---", city: "---", email: "---", postalCode: "---" })} className="p-2.5 text-gray-400 hover:text-prem-gold bg-gray-50 rounded-xl transition-all">
                                            <Download size={18} />
                                          </button>
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6 lg:space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                      <div className="bg-white p-4 lg:p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4">
                        <div className="relative w-full lg:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                            <input 
                              type="text" 
                              placeholder="Cerca jugador per nom..." 
                              value={playerSearch} 
                              onChange={(e) => setPlayerSearch(e.target.value)} 
                              className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-11 pr-4 py-3.5 text-sm font-bold text-gray-900 focus:outline-none" 
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full lg:w-auto">
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-50 text-gray-400 rounded-xl font-black text-[9px] uppercase tracking-widest border border-gray-100 active:bg-white transition-all">
                              <Filter size={14} /> Filtres
                            </button>
                            <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-gray-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                              <Download size={14} /> Exportar CRM
                            </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                        {filteredPlayers.map(p => {
                          const tutor = getTutorInfo(p.guardianId);
                          // Mocking some billing data for the CRM view as it's not in the base Player type
                          const paymentStatus = Math.random() > 0.7 ? 'Retard' : Math.random() > 0.4 ? 'Pagat' : 'Pendent';
                          const pack = p.category === 'Prem Pro' ? 'Pack Pro Elite' : 'Pack Academy';
                          const nextPayment = '05/03/2024';
                          
                          return (
                            <div 
                              key={p.id} 
                              onClick={() => setSelectedPlayer(p)}
                              className="bg-white p-5 lg:p-6 rounded-[28px] lg:rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:border-prem-gold/20 transition-all group cursor-pointer relative overflow-hidden"
                            >
                               <div className="flex justify-between items-start mb-4">
                                  <div className="flex items-center gap-3">
                                     <div className="relative">
                                        <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl lg:rounded-2xl gold-gradient flex items-center justify-center text-white font-black text-xs lg:text-sm shadow-md group-hover:scale-110 transition-transform">
                                           {p.firstName[0]}{p.lastName[0]}
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 lg:w-6 lg:h-6 bg-black rounded-lg flex items-center justify-center border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                                           {getPositionIcon(p.mainPosition)}
                                        </div>
                                     </div>
                                     <div>
                                        <h4 className="text-xs lg:text-sm font-black text-gray-900 uppercase tracking-tight leading-none mb-1">{p.firstName} {p.lastName}</h4>
                                        <p className="text-[8px] lg:text-[9px] font-bold text-gray-400 uppercase tracking-widest">{p.category}</p>
                                     </div>
                                  </div>
                                  <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${
                                    paymentStatus === 'Pagat' ? 'bg-green-50 text-green-600' : 
                                    paymentStatus === 'Pendent' ? 'bg-yellow-50 text-yellow-600' : 
                                    'bg-red-50 text-red-500'
                                  }`}>
                                    {paymentStatus}
                                  </span>
                               </div>

                               <div className="space-y-3 py-4 border-y border-gray-50">
                                  <div className="flex justify-between items-center">
                                     <span className="text-[8px] lg:text-[9px] font-black text-gray-300 uppercase tracking-widest">Pack Contractat</span>
                                     <span className="text-[10px] lg:text-xs font-bold text-gray-700 uppercase">{pack}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                     <span className="text-[8px] lg:text-[9px] font-black text-gray-300 uppercase tracking-widest">Proper Cobrament</span>
                                     <span className="text-[10px] lg:text-xs font-bold text-gray-900">{nextPayment}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                     <span className="text-[8px] lg:text-[9px] font-black text-gray-300 uppercase tracking-widest">Saldo Prems</span>
                                     <span className="text-[10px] lg:text-xs font-black text-prem-gold">{tutor?.premsBalance || 0} P</span>
                                  </div>
                               </div>

                               <div className="mt-4 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                     <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-400">
                                        {tutor?.initials || '??'}
                                     </div>
                                     <span className="text-[9px] font-bold text-gray-400 uppercase truncate max-w-[100px]">{tutor?.name || 'Sense Tutor'}</span>
                                  </div>
                                  <button className="p-2 bg-gray-50 text-gray-300 group-hover:text-prem-gold group-hover:bg-white rounded-lg border border-transparent group-hover:border-gray-100 transition-all">
                                     <ChevronRight size={14} />
                                  </button>
                               </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'serveis' && (
                <div className="space-y-4 lg:space-y-12 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                    <div className="bg-black text-white p-4 lg:p-8 rounded-[24px] lg:rounded-[40px] shadow-xl relative overflow-hidden group col-span-2 lg:col-span-1">
                       <div className="absolute top-0 right-0 p-2 lg:p-4 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                          <Package size={80} className="text-prem-gold lg:size-[140px]" />
                       </div>
                       <div className="relative z-10">
                          <p className="text-[7px] lg:text-[10px] font-black text-prem-gold uppercase tracking-widest mb-1 lg:mb-2">Actius</p>
                          <h3 className="text-xl lg:text-3xl font-black tracking-tighter uppercase mb-2 lg:mb-6">Serveis i Packs</h3>
                          <div className="flex items-end gap-2">
                             <span className="text-2xl lg:text-5xl font-black leading-none">{localServeis.length + packs.length}</span>
                             <span className="text-[8px] lg:text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Items Totals</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-white p-4 lg:p-8 rounded-[24px] lg:rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div>
                          <p className="text-[7px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Top Vendes</p>
                          <h3 className="text-xs lg:text-2xl font-black text-gray-900 uppercase">Pro Elite</h3>
                       </div>
                       <div className="flex items-center gap-1 mt-2 text-green-500 font-black text-[8px] lg:text-xs">
                          <TrendingUp size={10} className="lg:size-4" /> +24%
                       </div>
                    </div>
                    <div className="bg-white p-4 lg:p-8 rounded-[24px] lg:rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div>
                          <p className="text-[7px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Packs Actius</p>
                          <h3 className="text-xs lg:text-2xl font-black text-gray-900 uppercase">{packs.length} Packs</h3>
                       </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 lg:gap-2 bg-white p-1 rounded-2xl border border-gray-100 shadow-sm w-full lg:w-fit">
                    {[
                      { id: 'serveis', label: 'Configuració de Serveis', icon: <Dumbbell size={14} /> },
                      { id: 'packs', label: 'Configuració de Packs', icon: <Package size={14} /> }
                    ].map(sub => (
                      <button 
                        key={sub.id} 
                        onClick={() => setServeisSubTab(sub.id as any)} 
                        className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 lg:px-8 py-3 rounded-xl text-[10px] lg:text-[12px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${serveisSubTab === sub.id ? 'gold-gradient text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                      >
                        {sub.icon} <span className="inline">{sub.label}</span>
                      </button>
                    ))}
                  </div>

                  {serveisSubTab === 'serveis' ? (
                    <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-5 lg:p-12 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gray-50/20">
                         <div className="flex items-center gap-4 lg:gap-5">
                            <div className="p-2 lg:p-4 bg-white rounded-xl lg:rounded-3xl text-prem-gold shadow-sm border border-gray-100">
                               <Layers size={18} className="lg:size-7" />
                            </div>
                            <div>
                               <h2 className="text-base lg:text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1 lg:mb-2">Serveis Individuals</h2>
                               <p className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Configura els tipus de sessió</p>
                            </div>
                         </div>
                         <button onClick={() => handleOpenProductModal()} className="w-full sm:w-auto px-6 py-4 lg:px-10 lg:py-5 gold-gradient text-white rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                           <Plus size={16} /> Nou Servei
                         </button>
                      </div>

                      <div className="p-4 lg:p-10">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            {localServeis.map(servei => (
                              <div key={servei.id} className="p-5 lg:p-8 bg-gray-50/50 rounded-[28px] lg:rounded-[32px] border border-gray-100 hover:bg-white hover:border-prem-gold/20 transition-all group flex flex-col sm:flex-row items-center gap-5 lg:gap-8">
                                 <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform ${servei.category === 'Prem Pro' ? 'bg-black' : 'gold-gradient'}`}>
                                    <Dumbbell size={20} className="lg:size-8" />
                                 </div>
                                 <div className="flex-1 text-center sm:text-left min-w-0">
                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-1 lg:mb-2">
                                       <span className={`text-[7px] lg:text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none ${servei.category === 'Prem Pro' ? 'bg-prem-gold text-black' : 'bg-gray-900 text-white'}`}>{servei.category}</span>
                                       <h4 className="text-sm lg:text-xl font-black text-gray-900 uppercase tracking-tight truncate">{servei.name}</h4>
                                    </div>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 lg:gap-4 mt-3">
                                       <div className="bg-white px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                                          <Clock size={10} className="text-prem-gold" />
                                          <span className="text-[8px] lg:text-[10px] font-black text-gray-600">{servei.duration}M</span>
                                       </div>
                                       <div className="bg-white px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                                          <Users size={10} className="text-prem-gold" />
                                          <span className="text-[8px] lg:text-[10px] font-black text-gray-600">CAP {servei.capacity}</span>
                                       </div>
                                       <div className="bg-white px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                                          <CreditCard size={10} className="text-prem-gold" />
                                          <span className="text-[8px] lg:text-[10px] font-black text-gray-900">{servei.price}P</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex sm:flex-col gap-2 shrink-0">
                                    <button onClick={() => handleOpenProductModal(servei)} className="p-3 bg-white text-gray-400 hover:text-prem-gold rounded-xl border border-gray-100 transition-all shadow-sm"><Edit2 size={14} /></button>
                                    <button onClick={() => handleToggleProduct(servei.id)} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 transition-all shadow-sm"><Power size={14} /></button>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                      <div className="p-5 lg:p-12 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gray-50/20">
                         <div className="flex items-center gap-4 lg:gap-5">
                            <div className="p-2 lg:p-4 bg-white rounded-xl lg:rounded-3xl text-prem-gold shadow-sm border border-gray-100">
                               <Package size={18} className="lg:size-7" />
                            </div>
                            <div>
                               <h2 className="text-base lg:text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1 lg:mb-2">Packs de Prems</h2>
                               <p className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gestiona els packs de la botiga</p>
                            </div>
                         </div>
                         <button onClick={() => handleOpenPackModal()} className="w-full sm:w-auto px-6 py-4 lg:px-10 lg:py-5 gold-gradient text-white rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                           <Plus size={16} /> Nou Pack
                         </button>
                      </div>

                      <div className="p-4 lg:p-10">
                         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            {packs.map(pack => (
                              <div key={pack.id} className="p-5 lg:p-8 bg-gray-50/50 rounded-[28px] lg:rounded-[32px] border border-gray-100 hover:bg-white hover:border-prem-gold/20 transition-all group flex flex-col sm:flex-row items-center gap-5 lg:gap-8">
                                 <div className={`w-14 h-14 lg:w-20 lg:h-20 rounded-2xl lg:rounded-3xl flex items-center justify-center text-white shadow-lg shrink-0 group-hover:scale-105 transition-transform ${pack.popular ? 'bg-black' : 'gold-gradient'}`}>
                                    <Zap size={20} className="lg:size-8" />
                                 </div>
                                 <div className="flex-1 text-center sm:text-left min-w-0">
                                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mb-1 lg:mb-2">
                                       {pack.popular && <span className="text-[7px] lg:text-[8px] font-black uppercase px-1.5 py-0.5 rounded leading-none bg-prem-gold text-black">Popular</span>}
                                       <h4 className="text-sm lg:text-xl font-black text-gray-900 uppercase tracking-tight truncate">{pack.name}</h4>
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mb-3">{pack.subtitle}</p>
                                    <div className="flex flex-wrap justify-center sm:justify-start gap-2 lg:gap-4">
                                       <div className="bg-white px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                                          <Zap size={10} className="text-prem-gold" />
                                          <span className="text-[8px] lg:text-[10px] font-black text-gray-900">{pack.totalPrems}P</span>
                                       </div>
                                       <div className="bg-white px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                                          <CreditCard size={10} className="text-prem-gold" />
                                          <span className="text-[8px] lg:text-[10px] font-black text-gray-900">{pack.price}€</span>
                                       </div>
                                       <div className="bg-white px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                                          <Calendar size={10} className="text-prem-gold" />
                                          <span className="text-[8px] lg:text-[10px] font-black text-gray-600">{pack.sessionsCount} SESS.</span>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="flex sm:flex-col gap-2 shrink-0">
                                    <button onClick={() => handleOpenPackModal(pack)} className="p-3 bg-white text-gray-400 hover:text-prem-gold rounded-xl border border-gray-100 transition-all shadow-sm"><Edit2 size={14} /></button>
                                    <button onClick={() => handleTogglePack(pack.id)} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 transition-all shadow-sm"><Trash2 size={14} /></button>
                                 </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'seus' && (
                <div className="space-y-4 lg:space-y-12 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-6">
                    <div className="bg-black text-white p-4 lg:p-8 rounded-[24px] lg:rounded-[40px] shadow-xl relative overflow-hidden group col-span-2 lg:col-span-1">
                       <div className="absolute top-0 right-0 p-2 lg:p-4 opacity-10 rotate-12 group-hover:scale-125 transition-transform duration-700 pointer-events-none">
                          <MapPin size={80} className="text-prem-gold lg:size-[140px]" />
                       </div>
                       <div className="relative z-10">
                          <p className="text-[7px] lg:text-[10px] font-black text-prem-gold uppercase tracking-widest mb-1 lg:mb-2">Actives</p>
                          <h3 className="text-xl lg:text-3xl font-black tracking-tighter uppercase mb-2 lg:mb-6">Seus</h3>
                          <div className="flex items-end gap-2">
                             <span className="text-2xl lg:text-5xl font-black leading-none">{seus.length}</span>
                             <span className="text-[8px] lg:text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">Centres</span>
                          </div>
                       </div>
                    </div>
                    <div className="bg-white p-4 lg:p-8 rounded-[24px] lg:rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div>
                          <p className="text-[7px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Recursos Totals</p>
                          <h3 className="text-xs lg:text-2xl font-black text-gray-900 uppercase">
                            {seus.reduce((acc, s) => acc + (s.resources?.length || 0), 0)} Camps/Sales
                          </h3>
                       </div>
                    </div>
                    <div className="bg-white p-4 lg:p-8 rounded-[24px] lg:rounded-[40px] border border-gray-100 shadow-sm flex flex-col justify-between">
                       <div>
                          <p className="text-[7px] lg:text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5 lg:mb-1">Cobertura</p>
                          <h3 className="text-xs lg:text-2xl font-black text-gray-900">Catalunya</h3>
                       </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[32px] lg:rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-5 lg:p-12 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-gray-50/20">
                       <div className="flex items-center gap-4 lg:gap-5">
                          <div className="p-2 lg:p-4 bg-white rounded-xl lg:rounded-3xl text-prem-gold shadow-sm border border-gray-100">
                             <MapPin size={18} className="lg:size-7" />
                          </div>
                          <div>
                             <h2 className="text-base lg:text-2xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-1 lg:mb-2">Configuració de Seus</h2>
                             <p className="text-[8px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gestiona els centres d'entrenament</p>
                          </div>
                       </div>
                       <button onClick={() => handleOpenSedeModal()} className="w-full sm:w-auto px-6 py-4 lg:px-10 lg:py-5 gold-gradient text-white rounded-xl lg:rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center justify-center gap-2">
                         <Plus size={16} /> Nova Seu
                       </button>
                    </div>

                    <div className="p-4 lg:p-10">
                       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                          {seus.map(sede => (
                            <div key={sede.id} className="p-5 lg:p-8 bg-gray-50/50 rounded-[28px] lg:rounded-[32px] border border-gray-100 hover:bg-white hover:border-prem-gold/20 transition-all group flex flex-col sm:flex-row items-center gap-5 lg:gap-8">
                               <div className="w-14 h-14 lg:w-24 lg:h-24 rounded-2xl lg:rounded-3xl overflow-hidden shadow-lg shrink-0 group-hover:scale-105 transition-transform">
                                  <img 
                                    src={sede.image || "https://picsum.photos/seed/stadium/400/400"} 
                                    alt={sede.name} 
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                               </div>
                               <div className="flex-1 text-center sm:text-left min-w-0">
                                  <h4 className="text-sm lg:text-xl font-black text-gray-900 uppercase tracking-tight truncate mb-1">{sede.name}</h4>
                                  <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-3">
                                     <MapPin size={12} className="text-prem-gold" />
                                     <span className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase truncate">{sede.location}</span>
                                  </div>
                                  <div className="flex flex-wrap justify-center sm:justify-start gap-2 lg:gap-3">
                                     <div className="bg-white px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                                        <Layers size={10} className="text-prem-gold" />
                                        <span className="text-[8px] lg:text-[10px] font-black text-gray-600">{sede.resources?.length || 0} Recursos</span>
                                     </div>
                                     <div className="bg-white px-2 py-1 rounded-lg border border-gray-100 flex items-center gap-1">
                                        <Package size={10} className="text-prem-gold" />
                                        <span className="text-[8px] lg:text-[10px] font-black text-gray-600">{sede.activeServiceIds?.length || 0} Serveis</span>
                                     </div>
                                  </div>
                               </div>
                               <div className="flex sm:flex-col gap-2 shrink-0">
                                  <button onClick={() => handleOpenSedeModal(sede)} className="p-3 bg-white text-gray-400 hover:text-prem-gold rounded-xl border border-gray-100 transition-all shadow-sm"><Edit2 size={14} /></button>
                                  <button onClick={() => handleDeleteSede(sede.id)} className="p-3 bg-white text-gray-400 hover:text-red-500 rounded-xl border border-gray-100 transition-all shadow-sm"><Trash2 size={14} /></button>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'agenda' && (
                <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 animate-in fade-in duration-500 min-h-fit">
                  <CalendarAgenda serveis={localServeis} seus={seus} sessions={localSessions} onAddSession={onAddSession} onDeleteSession={onDeleteSession} onUpdateSession={(s) => setLocalSessions(prev => prev.map(old => old.id === s.id ? s : old))} staffMembers={staffMembers} bookings={bookings} />
                </div>
              )}

              {activeTab === 'buzon' && (
                <div className="h-full bg-white rounded-[40px] border border-gray-100 overflow-hidden shadow-sm animate-in fade-in duration-500">
                  <Buzon user={{
                    id: 'admin-main',
                    name: 'Administrador Prem',
                    initials: 'AP',
                    role: 'Admin',
                    premsBalance: 0,
                    language: 'ca',
                    level: 99,
                    xp: 0,
                    skills: { tecnica: 100, fisico: 100, tactica: 100, mentalidad: 100 }
                  }} />
                </div>
              )}

              {activeTab === 'comunicacions' && (
                <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                      <div className="bg-white p-8 lg:p-12 rounded-[40px] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-5 mb-10">
                          <div className="p-4 bg-prem-gold/10 text-prem-gold rounded-3xl">
                            <Megaphone size={32} />
                          </div>
                          <div>
                            <h2 className="text-2xl lg:text-3xl font-black text-gray-900 uppercase tracking-tighter leading-none mb-2">Enviar Notificació Push</h2>
                            <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest">Avisos importants per a tota l'acadèmia o usuaris específics</p>
                          </div>
                        </div>

                        <form onSubmit={handleSendNotification} className="space-y-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Destinatari</label>
                              <select 
                                value={notifForm.target}
                                onChange={e => setNotifForm({...notifForm, target: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                              >
                                <option value="all">Tots els Usuaris</option>
                                <option value="u1">Pol Tarrenchs (Tutor)</option>
                                <option value="u3">Nil Coord (Tutor)</option>
                                <option value="coaches">Tots els Coaches</option>
                              </select>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Tipus d'Avís</label>
                              <div className="flex flex-wrap gap-2">
                                {[
                                  { id: 'info', label: 'General', icon: <Info size={12} />, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                                  { id: 'warning', label: 'Alerta', icon: <AlertCircle size={12} />, color: 'bg-orange-50 text-orange-600 border-orange-100' },
                                  { id: 'payment', label: 'Pagament', icon: <CreditCard size={12} />, color: 'bg-amber-50 text-amber-600 border-amber-100' },
                                  { id: 'session', label: 'Sessió', icon: <Calendar size={12} />, color: 'bg-purple-50 text-purple-600 border-purple-100' },
                                  { id: 'success', label: 'Èxit', icon: <CheckCircle2 size={12} />, color: 'bg-green-50 text-green-600 border-green-100' }
                                ].map(type => (
                                  <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setNotifForm({...notifForm, type: type.id as any})}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                      notifForm.type === type.id ? 'ring-2 ring-prem-gold ring-offset-2 ' + type.color : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50'
                                    }`}
                                  >
                                    {type.icon} {type.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Títol de la Notificació</label>
                            <input 
                              type="text" 
                              required
                              placeholder="Ex: Sessió cancel·lada per pluja"
                              value={notifForm.title}
                              onChange={e => setNotifForm({...notifForm, title: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                            />
                          </div>

                          <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Missatge</label>
                            <textarea 
                              required
                              rows={4}
                              placeholder="Escriu el contingut de la notificació..."
                              value={notifForm.message}
                              onChange={e => setNotifForm({...notifForm, message: e.target.value})}
                              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-6 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 no-scrollbar"
                            />
                          </div>

                          <div className="pt-4">
                            <button type="submit" className="w-full py-6 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-2xl shadow-prem-gold/30 active:scale-95 transition-all flex items-center justify-center gap-3">
                              <Megaphone size={20} /> Enviar Notificació Ara
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-black text-white p-8 rounded-[40px] shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                          <Bell size={120} className="text-prem-gold" />
                        </div>
                        <div className="relative z-10">
                          <h3 className="text-xl font-black uppercase tracking-tighter mb-4">Consells d'ús</h3>
                          <ul className="space-y-4">
                            {[
                              "Utilitza títols curts i directes.",
                              "Sigues clar amb el motiu de l'avís.",
                              "Evita enviar massa notificacions generals.",
                              "Les notificacions de pagament són automàtiques però pots reforçar-les aquí."
                            ].map((tip, i) => (
                              <li key={i} className="flex gap-3 text-[10px] font-bold text-white/70 leading-relaxed">
                                <div className="w-1.5 h-1.5 bg-prem-gold rounded-full mt-1 shrink-0" />
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Historial d'enviaments</h3>
                        <div className="space-y-4">
                          {[
                            { t: 'Sessió cancel·lada', d: 'Fa 2 hores', target: 'Tots' },
                            { t: 'Nou Pack Elite', d: 'Ahir', target: 'Tots' },
                            { t: 'Recordatori quota', d: 'Fa 3 dies', target: 'u1' }
                          ].map((h, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                              <div>
                                <p className="text-[10px] font-black text-gray-900 uppercase tracking-tight">{h.t}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase">{h.d} · {h.target}</p>
                              </div>
                              <button className="p-2 text-gray-300 hover:text-prem-gold transition-colors">
                                <Eye size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

           </div>
        </main>
      </div>

      {/* SEDE MODAL */}
      {isSedeModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                       <MapPin size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{editingSedeId ? 'Editar Seu' : 'Nova Seu'}</h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuració de centre d'entrenament.</p>
                    </div>
                 </div>
                 <button onClick={() => setIsSedeModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveSede} className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nom de la Seu</label>
                       <input 
                         type="text" 
                         required 
                         value={sedeForm.name}
                         onChange={e => setSedeForm({...sedeForm, name: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Ubicació (Ciutat/Zona)</label>
                       <input 
                         type="text" 
                         required 
                         value={sedeForm.location}
                         onChange={e => setSedeForm({...sedeForm, location: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Descripció</label>
                    <textarea 
                      value={sedeForm.description}
                      onChange={e => setSedeForm({...sedeForm, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 min-h-[80px]" 
                      placeholder="Breu descripció de la seu..."
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Direcció Google Maps</label>
                    <input 
                      type="text" 
                      value={sedeForm.googleMapsUrl}
                      onChange={e => setSedeForm({...sedeForm, googleMapsUrl: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                      placeholder="https://www.google.com/maps/..."
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Imatge de la Seu (PNG, JPG)</label>
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={sedeForm.image}
                        onChange={e => setSedeForm({...sedeForm, image: e.target.value})}
                        className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                        placeholder="URL de la imatge o puja un fitxer..."
                      />
                      <label className="cursor-pointer bg-prem-gold text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors flex items-center justify-center">
                        Pujar
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".png,.jpg,.jpeg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setSedeForm({...sedeForm, image: reader.result as string});
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Telèfon</label>
                       <input 
                         type="tel" 
                         value={sedeForm.phone}
                         onChange={e => setSedeForm({...sedeForm, phone: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Horari</label>
                       <input 
                         type="text" 
                         value={sedeForm.schedule}
                         onChange={e => setSedeForm({...sedeForm, schedule: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                         placeholder="Dilluns a Divendres 17h-21h"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Correu Electrònic</label>
                    <input 
                      type="email" 
                      value={sedeForm.email}
                      onChange={e => setSedeForm({...sedeForm, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                      placeholder="seu@prem.com"
                    />
                 </div>

                 <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Recursos (Camps / Sales)</label>
                       <button 
                         type="button"
                         onClick={() => {
                           const newResource: Resource = {
                             id: 'res-' + Math.random().toString(36).substr(2, 9),
                             name: 'Nou Recurs',
                             type: 'campo'
                           };
                           setSedeForm({...sedeForm, resources: [...(sedeForm.resources || []), newResource]});
                         }}
                         className="text-[10px] font-black text-prem-gold uppercase tracking-widest flex items-center gap-1 hover:underline"
                       >
                          <Plus size={12} /> Afegir Recurs
                       </button>
                    </div>
                    <div className="space-y-2">
                       {(sedeForm.resources || []).map((res, idx) => (
                         <div key={res.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <select 
                              value={res.type}
                              onChange={e => {
                                const newResources = [...(sedeForm.resources || [])];
                                newResources[idx] = { ...res, type: e.target.value as any };
                                setSedeForm({...sedeForm, resources: newResources});
                              }}
                              className="bg-white border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-bold uppercase"
                            >
                               <option value="campo">Camp</option>
                               <option value="sala">Sala</option>
                               <option value="otro">Altre</option>
                            </select>
                            <input 
                              type="text"
                              value={res.name}
                              onChange={e => {
                                const newResources = [...(sedeForm.resources || [])];
                                newResources[idx] = { ...res, name: e.target.value };
                                setSedeForm({...sedeForm, resources: newResources});
                              }}
                              className="flex-1 bg-white border border-gray-100 rounded-lg px-3 py-1 text-xs font-bold"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                const newResources = (sedeForm.resources || []).filter(r => r.id !== res.id);
                                setSedeForm({...sedeForm, resources: newResources});
                              }}
                              className="text-gray-300 hover:text-red-500 transition-colors"
                            >
                               <Trash2 size={14} />
                            </button>
                         </div>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Serveis Actius</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                       {localServeis.map(s => (
                         <button
                           key={s.id}
                           type="button"
                           onClick={() => {
                             const current = sedeForm.activeServiceIds || [];
                             if (current.includes(s.id)) {
                               setSedeForm({...sedeForm, activeServiceIds: current.filter(id => id !== s.id)});
                             } else {
                               setSedeForm({...sedeForm, activeServiceIds: [...current, s.id]});
                             }
                           }}
                           className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                             sedeForm.activeServiceIds?.includes(s.id)
                               ? 'border-prem-gold bg-prem-gold/5 text-prem-gold'
                               : 'border-gray-100 bg-gray-50 text-gray-400'
                           }`}
                         >
                            <div className={`w-2 h-2 rounded-full ${sedeForm.activeServiceIds?.includes(s.id) ? 'bg-prem-gold' : 'bg-gray-300'}`} />
                            <span className="text-[10px] font-black uppercase">{s.name}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 <button type="submit" className="w-full py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all mt-4">
                    {editingSedeId ? 'Actualitzar Seu' : 'Crear Seu Ara'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* STAFF MODAL */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                       <Shield size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{editingStaffId ? 'Configuració de Rol' : 'Alta Professional'}</h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gestió de permisos i personal.</p>
                    </div>
                 </div>
                 <button onClick={() => setIsStaffModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveStaff} className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nom</label>
                       <input 
                         type="text" 
                         required 
                         value={staffForm.firstName}
                         onChange={e => setStaffForm({...staffForm, firstName: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Cognom</label>
                       <input 
                         type="text" 
                         required 
                         value={staffForm.lastName}
                         onChange={e => setStaffForm({...staffForm, lastName: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                       />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Correu Electrònic</label>
                    <input 
                      type="email" 
                      required 
                      value={staffForm.email}
                      onChange={e => setStaffForm({...staffForm, email: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                    />
                 </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Rol Operatiu</label>
                    <div className="relative">
                      <select 
                        value={staffForm.role}
                        onChange={e => setStaffForm({...staffForm, role: e.target.value as UserRole})}
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 appearance-none cursor-pointer"
                      >
                        {['Admin', 'Coach', 'Athlete', 'Famil', 'Coordinador'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <ChevronDown size={18} />
                      </div>
                    </div>
                  </div>
                 <button type="submit" className="w-full py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all mt-4">
                    {editingStaffId ? 'Actualitzar Permisos' : 'Registrar Professional Ara'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* SESSION EDIT MODAL */}
      {isSessionEditModalOpen && editingSession && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                       <Calendar size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Editar Sessió</h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Ajusta els detalls de la sessió.</p>
                    </div>
                 </div>
                 <button onClick={() => setIsSessionEditModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveSessionEdit} className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Dia</label>
                       <input 
                         type="date" 
                         required 
                         value={sessionEditForm.date}
                         onChange={e => setSessionEditForm({...sessionEditForm, date: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Hora</label>
                       <input 
                         type="time" 
                         required 
                         value={sessionEditForm.time}
                         onChange={e => setSessionEditForm({...sessionEditForm, time: e.target.value})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Seu / Lloc</label>
                    <select 
                      required
                      value={sessionEditForm.sedeId}
                      onChange={e => setSessionEditForm({...sessionEditForm, sedeId: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 appearance-none"
                    >
                       <option value="">Selecciona una seu</option>
                       {seus.map(s => (
                         <option key={s.id} value={s.id}>{s.name}</option>
                       ))}
                    </select>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Coach Assignat</label>
                    <select 
                      value={sessionEditForm.coachId}
                      onChange={e => setSessionEditForm({...sessionEditForm, coachId: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 appearance-none"
                    >
                       <option value="">Sense entrenador</option>
                       {staffMembers.filter(s => s.role === 'Coach' || s.role === 'Coordinador').map(s => (
                         <option key={s.id} value={s.id}>{s.name}</option>
                       ))}
                    </select>
                 </div>

                 <button type="submit" className="w-full py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all mt-4">
                    Guardar Canvis
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                       <Package size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{editingProductId ? 'Editar Producte' : 'Nou Producte'}</h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuració de servei de tecnificació.</p>
                    </div>
                 </div>
                 <button onClick={() => setIsProductModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nom del Producte</label>
                    <input 
                      type="text" 
                      required 
                      value={productForm.name}
                      onChange={e => setProductForm({...productForm, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Descripció</label>
                    <textarea 
                      required 
                      value={productForm.description}
                      onChange={e => setProductForm({...productForm, description: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 min-h-[80px]" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Durada (min)</label>
                       <input 
                         type="number" 
                         required 
                         value={productForm.duration}
                         onChange={e => setProductForm({...productForm, duration: parseInt(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Capacitat</label>
                       <input 
                         type="number" 
                         required 
                         value={productForm.capacity}
                         onChange={e => setProductForm({...productForm, capacity: parseInt(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Preu (Prems)</label>
                       <input 
                         type="number" 
                         required 
                         value={productForm.price}
                         onChange={e => setProductForm({...productForm, price: parseInt(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Categoria</label>
                       <select 
                         value={productForm.category}
                         onChange={e => setProductForm({...productForm, category: e.target.value as any})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold"
                       >
                          <option value="Prem Academy">Prem Academy</option>
                          <option value="Prem Pro">Prem Pro</option>
                       </select>
                    </div>
                 </div>
                 <button type="submit" className="w-full py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all mt-4">
                    {editingProductId ? 'Actualitzar Producte' : 'Crear Producte Ara'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {isPackModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-lg rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                       <Package size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">{editingPackId ? 'Editar Pack' : 'Nou Pack'}</h3>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Configuració de pack de prems.</p>
                    </div>
                 </div>
                 <button onClick={() => setIsPackModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
              </div>

              <form onSubmit={handleSavePack} className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Nom del Pack</label>
                    <input 
                      type="text" 
                      required 
                      value={packForm.name}
                      onChange={e => setPackForm({...packForm, name: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Subtítol / Descripció curta</label>
                    <input 
                      type="text" 
                      required 
                      value={packForm.subtitle}
                      onChange={e => setPackForm({...packForm, subtitle: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Preu (€)</label>
                       <input 
                         type="number" 
                         required 
                         value={packForm.price}
                         onChange={e => setPackForm({...packForm, price: parseFloat(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Total Prems</label>
                       <input 
                         type="number" 
                         required 
                         value={packForm.totalPrems}
                         onChange={e => setPackForm({...packForm, totalPrems: parseInt(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                       />
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Sessions Incloses</label>
                       <input 
                         type="number" 
                         required 
                         value={packForm.sessionsCount}
                         onChange={e => setPackForm({...packForm, sessionsCount: parseInt(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Cost Real / Sessió (€)</label>
                       <input 
                         type="number" 
                         step="0.01"
                         required 
                         value={packForm.realCostPerSession}
                         onChange={e => setPackForm({...packForm, realCostPerSession: parseFloat(e.target.value)})}
                         className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold" 
                       />
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <input 
                      type="checkbox" 
                      id="popular"
                      checked={packForm.popular}
                      onChange={e => setPackForm({...packForm, popular: e.target.checked})}
                      className="w-5 h-5 accent-prem-gold"
                    />
                    <label htmlFor="popular" className="text-xs font-black uppercase text-gray-700 cursor-pointer">Marcar com a Popular</label>
                 </div>
                 <button type="submit" className="w-full py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all mt-4">
                    {editingPackId ? 'Actualitzar Pack' : 'Crear Pack Ara'}
                 </button>
              </form>
           </div>
        </div>
      )}

      {/* PLAYER DETAIL MODAL */}
      {selectedPlayer && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[96vh]">
              <div className="p-6 lg:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4 lg:gap-6">
                    <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-[24px] lg:rounded-[28px] gold-gradient text-white shadow-xl flex items-center justify-center font-black text-xl lg:text-3xl border-4 border-white shrink-0">
                       {selectedPlayer.firstName[0]}{selectedPlayer.lastName[0]}
                    </div>
                    <div className="min-w-0">
                       <h3 className="text-lg lg:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-1 truncate">{selectedPlayer.firstName} {selectedPlayer.lastName}</h3>
                       <div className="flex items-center gap-2 lg:gap-3">
                          <span className={`px-2 py-0.5 rounded-lg text-[7px] lg:text-[8px] font-black uppercase tracking-widest ${selectedPlayer.status === 'Actiu' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{selectedPlayer.status}</span>
                          <span className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-tight">Alta: {selectedPlayer.registrationDate}</span>
                       </div>
                    </div>
                 </div>
                 <button onClick={() => setSelectedPlayer(null)} className="p-2 lg:p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all active:rotate-90"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-12 space-y-10 lg:space-y-12">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                    <div className="space-y-8 lg:space-y-10">
                       <div>
                          <h4 className="text-[10px] font-black text-prem-gold uppercase tracking-[0.25em] mb-6 flex items-center gap-2 border-b border-gray-100 pb-2"><Activity size={16} /> Fitxa Esportiva</h4>
                          <div className="grid grid-cols-2 gap-y-6 lg:gap-y-8 gap-x-4 lg:gap-x-6">
                             {[
                               {l: 'Club Actual', v: selectedPlayer.club},
                               {l: 'Categoria', v: selectedPlayer.category},
                               {l: 'Posició', v: selectedPlayer.mainPosition},
                               {l: 'Cama Hàbil', v: selectedPlayer.strongFoot},
                               {l: 'Alçada / Pes', v: `${selectedPlayer.height}cm / ${selectedPlayer.weight}kg`},
                               {l: 'Anys jugant', v: `${selectedPlayer.yearsPlaying} ANYS`}
                             ].map((item, i) => (
                               <div key={i} className="space-y-1">
                                  <p className="text-[8px] lg:text-[9px] font-black text-gray-300 uppercase tracking-widest">{item.l}</p>
                                  <p className="text-xs lg:text-sm font-black text-gray-900 uppercase truncate">{item.v}</p>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                    <div className="space-y-8 lg:space-y-10">
                       <div>
                          <h4 className="text-[10px] font-black text-red-500 uppercase tracking-[0.25em] mb-6 flex items-center gap-2 border-b border-gray-100 pb-2"><Stethoscope size={16} /> Salut</h4>
                          <div className="space-y-3 lg:space-y-4">
                             <div className={`p-4 lg:p-5 rounded-2xl border ${selectedPlayer.medicalInfo.allergies === 'Cap' ? 'bg-gray-50 border-gray-100' : 'bg-red-50 border-red-100'}`}>
                                <p className="text-[8px] font-black text-gray-400 uppercase mb-1 tracking-widest">Al·lèrgies</p>
                                <p className={`text-[11px] lg:text-xs font-black uppercase ${selectedPlayer.medicalInfo.allergies === 'Cap' ? 'text-gray-900' : 'text-red-600'}`}>{selectedPlayer.medicalInfo.allergies}</p>
                             </div>
                             <div className="flex gap-2 lg:gap-3">
                                <div className={`flex-1 p-3 lg:p-4 rounded-xl border flex items-center gap-2 lg:gap-3 ${selectedPlayer.medicalInfo.medicalAuth ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                   <ShieldCheck size={14} /><span className="text-[8px] lg:text-[9px] font-black uppercase">Auth. Mèdica</span>
                                </div>
                                <div className={`flex-1 p-3 lg:p-4 rounded-xl border flex items-center gap-2 lg:gap-3 ${selectedPlayer.medicalInfo.imageAuth ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'}`}>
                                   <ImageIcon size={14} /><span className="text-[8px] lg:text-[9px] font-black uppercase">Imatge</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 lg:p-8 border-t border-gray-50 bg-gray-50/20 flex flex-col sm:flex-row gap-3 lg:gap-6 shrink-0">
                 <button onClick={() => setSelectedPlayer(null)} className="order-2 sm:order-1 flex-1 py-4 lg:py-5 bg-white border border-gray-100 text-gray-400 font-black text-[10px] lg:text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all">Tancar</button>
                 <button onClick={() => handleOpenPlayerModal(selectedPlayer)} className="order-1 sm:order-2 flex-[2] py-4 lg:py-5 gold-gradient text-white rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                   <Edit2 size={16} /> Editar Jugador
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* DETALL TUTOR/FAMILIA MODAL */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-4xl rounded-[32px] lg:rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[96vh]">
              <div className="p-6 lg:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
                 <div className="flex items-center gap-4 lg:gap-6">
                    <div className="w-14 h-14 lg:w-20 lg:h-20 rounded-[24px] lg:rounded-[28px] gold-gradient text-white shadow-xl flex items-center justify-center font-black text-xl lg:text-3xl border-4 border-white shrink-0">
                       {selectedUserDetail.initials}
                    </div>
                    <div className="min-w-0">
                       <h3 className="text-lg lg:text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none mb-1 truncate">{selectedUserDetail.name}</h3>
                       <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest">{selectedUserDetail.role}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedUserDetail(null)} className="p-2 lg:p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all active:rotate-90"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-12 space-y-10 lg:space-y-12">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                    <div className="space-y-8">
                       <div>
                          <h4 className="text-[10px] font-black text-prem-gold uppercase tracking-[0.25em] mb-6 flex items-center gap-2 border-b border-gray-100 pb-2"><Users size={16} /> Atletes Vinculats</h4>
                          <div className="space-y-3">
                             {getKidsForTutor(selectedUserDetail.id).map(kid => (
                               <div key={kid.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between group hover:border-prem-gold/30 transition-all">
                                  <div className="flex items-center gap-4">
                                     <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-prem-gold font-black text-[10px]">{kid.firstName[0]}{kid.lastName[0]}</div>
                                     <div>
                                        <p className="text-sm font-black text-gray-900 uppercase">{kid.firstName} {kid.lastName}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{kid.category}</p>
                                     </div>
                                  </div>
                                  <button onClick={() => { setSelectedUserDetail(null); setSelectedPlayer(kid); }} className="text-gray-300 hover:text-prem-gold"><Eye size={18} /></button>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="bg-black text-white p-6 rounded-[32px] relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12 transition-transform group-hover:scale-110"><CreditCard size={80} className="text-prem-gold" /></div>
                          <div className="relative z-10">
                             <p className="text-[9px] font-black text-prem-gold uppercase tracking-[0.2em] mb-1">Balanç Econòmic</p>
                             <h4 className="text-4xl font-black text-white leading-none mb-4">{selectedUserDetail.premsBalance} <span className="text-base text-prem-gold uppercase">Prems</span></h4>
                             <button 
                               onClick={() => {
                                 setPremsTargetUser(selectedUserDetail);
                                 setIsPremsModalOpen(true);
                               }} 
                               className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/20 transition-all"
                             >
                               Abonar Prems Manualment
                             </button>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div>
                          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2 border-b border-gray-100 pb-2"><Mail size={16} /> Contacte i Notificacions</h4>
                          <div className="space-y-4">
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-300"><Mail size={18} /></div>
                                <div className="min-w-0 flex-1">
                                   <p className="text-[8px] font-black text-gray-300 uppercase">Correu Electrònic</p>
                                   <p className="text-sm font-bold text-gray-900 truncate">{selectedUserDetail.email || 'Sense email'}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-300"><Phone size={18} /></div>
                                <div className="min-w-0 flex-1">
                                   <p className="text-[8px] font-black text-gray-300 uppercase">Telèfon de Contacte</p>
                                   <p className="text-sm font-bold text-gray-900 truncate">{selectedUserDetail.phone || 'Sense telèfon'}</p>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-6 lg:p-8 border-t border-gray-50 bg-gray-50/20 flex flex-col sm:flex-row gap-3 lg:gap-6 shrink-0">
                 <button onClick={() => setSelectedUserDetail(null)} className="order-2 sm:order-1 flex-1 py-4 lg:py-5 bg-white border border-gray-100 text-gray-400 font-black text-[10px] lg:text-xs uppercase tracking-widest rounded-2xl active:scale-95 transition-all">Tancar Detall</button>
                 <button onClick={() => { setActiveTab('buzon'); setSelectedUserDetail(null); }} className="order-1 sm:order-2 flex-[2] py-4 lg:py-5 gold-gradient text-white rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                   <Mail size={16} /> Contactar via Bústia
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Modal Alta/Edició Jugador */}
      {isPlayerModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPlayerModalOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 lg:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div>
                <h3 className="text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tighter">
                  {editingPlayerId ? 'Editar Jugador' : 'Alta Nou Jugador'}
                </h3>
                <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest">Gestió d'atleta i dades esportives</p>
              </div>
              <button onClick={() => setIsPlayerModalOpen(false)} className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all"><X size={24} /></button>
            </div>

            <form onSubmit={handleSavePlayer} className="flex-1 overflow-y-auto no-scrollbar p-6 lg:p-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-prem-gold uppercase tracking-widest border-b border-gray-100 pb-2">Dades Personals</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nom</label>
                      <input required type="text" value={playerForm.firstName} onChange={e => setPlayerForm({...playerForm, firstName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Cognoms</label>
                      <input required type="text" value={playerForm.lastName} onChange={e => setPlayerForm({...playerForm, lastName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">DNI / NIE</label>
                      <input type="text" value={playerForm.dni} onChange={e => setPlayerForm({...playerForm, dni: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Data Naixement</label>
                      <input type="date" value={playerForm.birthDate} onChange={e => setPlayerForm({...playerForm, birthDate: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Tutor (ID)</label>
                    <select value={playerForm.guardianId} onChange={e => setPlayerForm({...playerForm, guardianId: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20">
                      <option value="">Selecciona un tutor</option>
                      {registeredUsers.filter(u => u.role === 'Famil').map(u => (
                        <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-prem-gold uppercase tracking-widest border-b border-gray-100 pb-2">Dades Esportives</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Categoria</label>
                      <input type="text" value={playerForm.category} onChange={e => setPlayerForm({...playerForm, category: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" placeholder="Ex: Infantil A" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Club Actual</label>
                      <input type="text" value={playerForm.club} onChange={e => setPlayerForm({...playerForm, club: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Posició Principal</label>
                      <input type="text" value={playerForm.mainPosition} onChange={e => setPlayerForm({...playerForm, mainPosition: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Cama Hàbil</label>
                      <select value={playerForm.strongFoot} onChange={e => setPlayerForm({...playerForm, strongFoot: e.target.value as any})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20">
                        <option value="Dreta">Dreta</option>
                        <option value="Esquerra">Esquerra</option>
                        <option value="Ambdues">Ambdues</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Seu Assignada</label>
                    <select value={playerForm.assignedSedeId} onChange={e => setPlayerForm({...playerForm, assignedSedeId: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20">
                      {seus.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-prem-gold uppercase tracking-widest border-b border-gray-100 pb-2">Informació Mèdica</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Al·lèrgies</label>
                    <input type="text" value={playerForm.medicalInfo?.allergies} onChange={e => setPlayerForm({...playerForm, medicalInfo: {...playerForm.medicalInfo!, allergies: e.target.value}})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Lesions Actuals</label>
                    <input type="text" value={playerForm.medicalInfo?.currentInjuries} onChange={e => setPlayerForm({...playerForm, medicalInfo: {...playerForm.medicalInfo!, currentInjuries: e.target.value}})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Lesions Passades</label>
                    <input type="text" value={playerForm.medicalInfo?.pastInjuries} onChange={e => setPlayerForm({...playerForm, medicalInfo: {...playerForm.medicalInfo!, pastInjuries: e.target.value}})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                  </div>
                </div>
              </div>
            </form>

            <div className="p-6 lg:p-8 border-t border-gray-50 bg-gray-50/30 flex justify-between gap-4">
              {editingPlayerId && (
                <button 
                  type="button"
                  onClick={() => { 
                    askConfirmation(
                      'Eliminar Jugador', 
                      'Segur que vols eliminar aquest jugador? Aquesta acció no es pot desfer.', 
                      () => { onDeletePlayer?.(editingPlayerId); setIsPlayerModalOpen(false); }
                    );
                  }}
                  className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              )}
              <div className="flex gap-4 ml-auto">
                <button type="button" onClick={() => setIsPlayerModalOpen(false)} className="px-6 py-4 bg-white border border-gray-100 text-gray-400 font-black text-[10px] lg:text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all">Cancel·lar</button>
                <button onClick={handleSavePlayer} className="px-10 py-4 gold-gradient text-white rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center gap-2">
                  <Check size={16} /> {editingPlayerId ? 'Guardar Canvis' : 'Crear Jugador'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Alta/Edició Tutor */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsUserModalOpen(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
            <div className="p-6 lg:p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
              <div>
                <h3 className="text-xl lg:text-2xl font-black text-gray-900 uppercase tracking-tighter">
                  {editingUserId ? 'Editar Tutor' : 'Alta Nou Tutor'}
                </h3>
                <p className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest">Gestió de compte de família</p>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="p-2 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-all"><X size={24} /></button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 lg:p-10 space-y-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Nom Complet</label>
                <input required type="text" value={userForm.name} onChange={e => setUserForm({...userForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Correu Electrònic</label>
                  <input required type="email" value={userForm.email} onChange={e => setUserForm({...userForm, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Telèfon</label>
                  <input type="tel" value={userForm.phone} onChange={e => setUserForm({...userForm, phone: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Rol</label>
                  <select value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as UserRole})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20">
                    <option value="Athlete">Jugador</option>
                    <option value="Famil">Familia</option>
                    <option value="Coach">Entrenador</option>
                    <option value="Coordinador">Coordinador</option>
                    <option value="Admin">Administrador</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Saldo Prems</label>
                  <input type="number" value={userForm.premsBalance} onChange={e => setUserForm({...userForm, premsBalance: parseInt(e.target.value) || 0})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-prem-gold/20" />
                </div>
              </div>
            </form>

            <div className="p-6 lg:p-8 border-t border-gray-50 bg-gray-50/30 flex justify-between gap-4">
              {editingUserId && (
                <button 
                  type="button"
                  onClick={() => { 
                    askConfirmation(
                      'Eliminar Usuari', 
                      'Segur que vols eliminar aquest usuari? Aquesta acció no es pot desfer.', 
                      () => { onDeleteUser?.(editingUserId); setIsUserModalOpen(false); }
                    );
                  }}
                  className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest hover:bg-red-100 transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} /> Eliminar
                </button>
              )}
              <div className="flex gap-4 ml-auto">
                <button type="button" onClick={() => setIsUserModalOpen(false)} className="px-6 py-4 bg-white border border-gray-100 text-gray-400 font-black text-[10px] lg:text-xs uppercase tracking-widest rounded-2xl hover:bg-gray-50 transition-all">Cancel·lar</button>
                <button onClick={handleSaveUser} className="px-10 py-4 gold-gradient text-white rounded-2xl font-black text-[10px] lg:text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all flex items-center gap-2">
                  <Check size={16} /> {editingUserId ? 'Guardar Canvis' : 'Crear Usuari'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PREMS MODAL */}
      {isPremsModalOpen && premsTargetUser && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white text-prem-gold rounded-2xl shadow-sm border border-gray-100">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Abonar Prems</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{premsTargetUser.name}</p>
                </div>
              </div>
              <button onClick={() => setIsPremsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleAddPremsManual} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Quantitat de Prems</label>
                <input 
                  type="number" 
                  required 
                  min="1"
                  value={premsAmount}
                  onChange={e => setPremsAmount(parseInt(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 text-2xl font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 text-center" 
                />
              </div>
              <button type="submit" className="w-full py-5 gold-gradient text-white rounded-[24px] font-black text-sm uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all">
                Confirmar Abonament
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODALS EINA ESPORTIVA */}
      {activeTool === 'videos' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                  <Video size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Vídeos Tàctics</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gestió de material audiovisual</p>
                </div>
              </div>
              <button onClick={() => setActiveTool(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
               <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-12 text-center hover:border-blue-200 transition-all group cursor-pointer">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <Upload size={32} />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Puja un nou vídeo</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Arrossega o clica per seleccionar</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="video/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('video', file.name);
                    }}
                  />
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Vídeos Recents</h4>
                  <div className="grid grid-cols-1 gap-3">
                     {uploadedFiles.filter(f => f.type === 'video').map((v, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                                <Play size={16} />
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{v.name}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{v.date}</p>
                             </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'session' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Planificació de Sessió</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Documents i PDFs de treball</p>
                </div>
              </div>
              <button onClick={() => setActiveTool(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
               <div className="border-2 border-dashed border-gray-100 rounded-[32px] p-12 text-center hover:border-emerald-200 transition-all group cursor-pointer">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                     <FileUp size={32} />
                  </div>
                  <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-2">Puja document PDF</h4>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Planificació, exercicis o teoria</p>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('session', file.name);
                    }}
                  />
               </div>

               <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Documents Pujats</h4>
                  <div className="grid grid-cols-1 gap-3">
                     {uploadedFiles.filter(f => f.type === 'session').map((doc, i) => (
                       <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-500 shadow-sm border border-gray-100">
                                <FileText size={20} />
                             </div>
                             <div>
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tight">{doc.name}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{doc.date}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2">
                             <button className="p-2 text-gray-400 hover:text-prem-gold transition-colors"><Download size={16} /></button>
                             <button className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTool === 'tasks' && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-4xl rounded-[40px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/40 shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-prem-gold/10 text-prem-gold rounded-2xl">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">SESSIONS</h3>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Treball setmanal</p>
                </div>
              </div>
              <button onClick={() => setActiveTool(null)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
               {isCreatingTask || editingTask ? (
                 <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Títol de la Sessió</label>
                             <input 
                               type="text" 
                               value={newTaskData.title}
                               onChange={e => setNewTaskData({...newTaskData, title: e.target.value})}
                               placeholder="Ex: Rutina de mobilitat"
                               className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10" 
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Tipus de Sessió</label>
                             <select 
                               value={newTaskData.type}
                               onChange={e => setNewTaskData({...newTaskData, type: e.target.value})}
                               className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10"
                             >
                                <option value="General">General</option>
                                 <option value="Tècnic">Tècnic</option>
                                <option value="Físic">Físic</option>
                                <option value="Tàctic">Tàctic</option>
                                <option value="Teoria">Teoria</option>
                                <option value="Psicologia">Psicologia</option>
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Objectiu Principal</label>
                             <textarea 
                               value={newTaskData.objective}
                               onChange={e => setNewTaskData({...newTaskData, objective: e.target.value})}
                               placeholder="Què volem aconseguir?"
                               className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-4 focus:ring-prem-gold/10 h-32 resize-none" 
                             />
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Assignar a Sessions de l'Agenda</label>
                             <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 space-y-2 max-h-[300px] overflow-y-auto no-scrollbar">
                                {localSessions.map(s => (
                                  <label key={s.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-50 cursor-pointer hover:border-prem-gold/30 transition-all">
                                     <input 
                                       type="checkbox" 
                                       checked={newTaskData.sessionIds?.includes(s.id)}
                                       onChange={(e) => {
                                         const ids = newTaskData.sessionIds || [];
                                         setNewTaskData({
                                           ...newTaskData,
                                           sessionIds: e.target.checked ? [...ids, s.id] : ids.filter(id => id !== s.id)
                                         });
                                       }}
                                       className="w-4 h-4 rounded border-gray-300 text-prem-gold focus:ring-prem-gold" 
                                     />
                                     <div className="min-w-0">
                                        <p className="text-[10px] font-black text-gray-900 uppercase truncate">{s.name}</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase">{new Date(s.startTime).toLocaleDateString()}</p>
                                     </div>
                                  </label>
                                ))}
                             </div>
                          </div>
                          <div className="p-6 bg-prem-gold/5 rounded-[32px] border border-prem-gold/10">
                             <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-white rounded-xl text-prem-gold shadow-sm">
                                   <FileUp size={16} />
                                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="application/pdf" className="hidden" />
                                </div>
                                <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Planificació (PDF)</h4>
                             </div>
                             <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-3 bg-white border border-prem-gold/20 text-prem-gold rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-prem-gold hover:text-white transition-all">
                                {newTaskData.fileName || 'Seleccionar PDF'}
                             </button>
                             {newTaskData.pdfUrl && (
                               <p className="mt-2 text-[8px] font-bold text-green-600 uppercase text-center">Fitxer adjuntat correctament</p>
                             )}
                          </div>
                       </div>
                    </div>
                    <div className="flex gap-4 pt-4 border-t border-gray-50">
                       <button 
                         onClick={() => { setIsCreatingTask(false); setEditingTask(null); }}
                         className="flex-1 py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all"
                       >
                          Cancel·lar
                       </button>
                       <button 
                         onClick={handleSaveTask}
                         className="flex-1 py-4 gold-gradient text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-prem-gold/20 active:scale-95 transition-all"
                       >
                          {editingTask ? 'Guardar Canvis' : 'Crear i Assignar Sessió'}
                       </button>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-8 animate-in fade-in duration-500">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                       <div className="relative w-full md:w-96">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                          <input type="text" placeholder="Cerca sessions..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-gray-900 focus:outline-none" />
                       </div>
                       <button 
                         onClick={() => setIsCreatingTask(true)}
                         className="w-full md:w-auto px-8 py-4 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                       >
                          <Plus size={18} /> NOVA SESSIÓ
                       </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                       {tasks.map(task => (
                         <div key={task.id} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                            <div className="flex items-center gap-6">
                               <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xs ${task.status === 'Activa' ? 'bg-green-50 text-green-600' : task.status === 'Acabada' ? 'bg-gray-50 text-gray-400' : 'bg-orange-50 text-orange-500'}`}>
                                  {task.type[0]}
                               </div>
                               <div>
                                  <h4 className="text-base font-black text-gray-900 uppercase tracking-tight mb-1">{task.title}</h4>
                                  <div className="flex items-center gap-4">
                                     <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                        <Calendar size={12} /> {task.date}
                                     </span>
                                     <span className="text-[10px] font-bold text-prem-gold uppercase tracking-widest flex items-center gap-1.5">
                                        <Users size={12} /> {task.sessionIds.length} Sessions Vinculades
                                     </span>
                                  </div>
                               </div>
                            </div>
                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={() => setEditingTask(task)}
                                 className="p-3 bg-gray-50 text-gray-400 hover:text-prem-gold hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100"
                               >
                                  <Edit2 size={18} />
                               </button>
                               <button className="p-3 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-100">
                                  <Trash2 size={18} />
                               </button>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmació */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConfirmModal({...confirmModal, isOpen: false})} />
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">{confirmModal.title}</h3>
              <p className="text-sm font-bold text-gray-400 leading-relaxed">
                {confirmModal.message}
              </p>
            </div>
            <div className="p-6 bg-gray-50 flex gap-3">
              <button 
                onClick={() => setConfirmModal({...confirmModal, isOpen: false})}
                className="flex-1 py-4 bg-white border border-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gray-100 transition-all"
              >
                Cancel·lar
              </button>
              <button 
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal({...confirmModal, isOpen: false});
                }}
                className="flex-1 py-4 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;