import { User, UserRole, Language } from '../types';

const USERS_KEY = 'prem_academy_users';
const SESSION_KEY = 'prem_academy_session';

const DEFAULT_USERS: User[] = [
  { 
    id: 'u1', 
    username: 'pol', 
    name: 'Pol Tarrenchs', 
    initials: 'PT', 
    role: 'Famil', 
    email: 'pol@prem.cat', 
    phone: '+34 600 111 222', 
    premsBalance: 488, 
    language: 'ca', 
    level: 14, 
    xp: 65, 
    skills: { tecnica: 88, fisico: 74, tactica: 82, mentalidad: 91 },
    password: '123'
  },
  { 
    id: 'u2', 
    username: 'coach1', 
    name: 'Marc Coach', 
    initials: 'MC', 
    role: 'Coach', 
    email: 'marc@prem.cat', 
    phone: '+34 600 222 333', 
    premsBalance: 0, 
    language: 'ca', 
    level: 50, 
    xp: 80, 
    skills: { tecnica: 95, fisico: 90, tactica: 92, mentalidad: 95 },
    password: '123'
  },
  { 
    id: 'u3', 
    username: 'coord1', 
    name: 'Sara Coord', 
    initials: 'SC', 
    role: 'Coordinador', 
    email: 'sara@prem.cat', 
    phone: '+34 600 333 444', 
    premsBalance: 0, 
    language: 'ca', 
    level: 60, 
    xp: 90, 
    skills: { tecnica: 80, fisico: 70, tactica: 98, mentalidad: 98 },
    password: '123'
  }
];

export const authService = {
  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_KEY);
    if (!stored) {
      localStorage.setItem(USERS_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return JSON.parse(stored);
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  login: (username: string, password?: string): User | null => {
    // Admin bypass for demo
    if (username.toUpperCase() === 'ADMIN' && password === 'ADMIN') {
      const admin: User = {
        id: 'admin-1',
        name: 'Administrador Prem',
        initials: 'AD',
        role: 'Admin',
        premsBalance: 0,
        language: 'ca',
        level: 99,
        xp: 100,
        skills: { tecnica: 100, fisico: 100, tactica: 100, mentalidad: 100 },
        username: 'admin',
        email: 'admin@prem.cat'
      };
      localStorage.setItem(SESSION_KEY, JSON.stringify(admin));
      return admin;
    }

    const users = authService.getUsers();
    const found = users.find(u => 
      (u.username?.toLowerCase() === username.toLowerCase() || u.email?.toLowerCase() === username.toLowerCase()) && 
      u.password === password
    );

    if (found) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(found));
      return found;
    }
    return null;
  },

  register: (userData: any): User => {
    const users = authService.getUsers();
    
    const newUser: User = { 
        id: Math.random().toString(36).substr(2, 9),
        username: userData.email, 
        name: userData.fullName, 
        email: userData.email,
        phone: userData.phone,
        initials: userData.fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        role: 'Famil',
        premsBalance: 0,
        language: 'ca',
        level: 1,
        xp: 0,
        skills: { tecnica: 0, fisico: 0, tactica: 0, mentalidad: 0 },
        password: userData.password
    };

    const updatedUsers = [...users, newUser];
    authService.saveUsers(updatedUsers);
    return newUser;
  },

  getCurrentSession: (): User | null => {
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  updateUser: (updatedUser: User) => {
    const users = authService.getUsers();
    const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u);
    authService.saveUsers(updatedUsers);
    
    // Also update session if it's the current user
    const session = authService.getCurrentSession();
    if (session && session.id === updatedUser.id) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    }
  }
};
