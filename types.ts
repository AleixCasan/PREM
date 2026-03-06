import React from 'react';

export enum ViewType {
  DASHBOARD = 'DASHBOARD',
  MAPA_SEUS = 'MAPA_SEUS',
  COMPRAR_PREMS = 'COMPRAR_PREMS',
  MIS_RESERVAS = 'MIS_RESERVAS',
  NUEVA_RESERVA = 'NUEVA_RESERVA',
  MIS_HIJOS = 'MIS_HIJOS',
  MI_PERFIL = 'MI_PERFIL',
  MIS_COMPRAS = 'MIS_COMPRAS',
  HISTORIAL = 'HISTORIAL',
  ADMIN_PANEL = 'ADMIN_PANEL',
  COACH_PANEL = 'COACH_PANEL',
  COORDINATION_PANEL = 'COORDINATION_PANEL',
  BUZON = 'BUZON'
}

export type Language = 'es' | 'ca' | 'en';

export interface UserSkills {
  tecnica: number;
  fisico: number;
  tactica: number;
  mentalidad: number;
}

export type UserRole = 'Admin' | 'Coach' | 'Athlete' | 'Famil' | 'Coordinador';

export enum UserAccountStatus {
  CREATED_BY_ADMIN = 'CREATED_BY_ADMIN',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  PROFILE_COMPLETE = 'PROFILE_COMPLETE'
}

export interface LanguageSkill {
  language: string;
  level: 'Bàsic' | 'Mitjà' | 'Alt';
}

export interface CoachProfile {
  firstName: string;
  lastName: string;
  idType: 'DNI' | 'NIE' | 'Passaport';
  idNumber: string;
  gender: 'Masculí' | 'Femení' | 'No vull especificar';
  birthDate: string;
  email: string;
  phone1: string;
  phone2?: string;
  country: string;
  city: string;
  postalCode: string;
  instagram?: string;
  hasDrivingLicense: boolean;
  howDidYouKnowUs: string;
  documents: {
    curriculum: string | null;
    healthCard: string | null;
    idScan: string | null;
  };
  socialSecurityNumber?: string;
  academicStudies: string[];
  ropecDate?: string;
  sportsTitles: string[];
  languages: LanguageSkill[];
}

export interface User {
  id: string;
  name: string;
  initials: string;
  role: UserRole;
  premsBalance: number;
  language: Language;
  level: number;
  xp: number;
  skills: UserSkills;
  email?: string;
  username?: string;
  phone?: string;
  password?: string;
  status?: 'Actiu' | 'Inactiu';
  accountStatus?: UserAccountStatus;
  profile?: CoachProfile;
}

export interface Player {
  id: string;
  guardianId: string; // Relació amb l'ID del Tutor (User)
  firstName: string;
  lastName: string;
  birthDate: string;
  gender: string;
  dni: string;
  photo: string | null;
  club: string;
  category: string;
  mainPosition: string;
  secondaryPosition: string;
  strongFoot: string;
  height: string;
  weight: string;
  yearsPlaying: string;
  isCompeting: boolean;
  status: 'Actiu' | 'Inactiu';
  registrationDate: string;
  internalNotes: string;
  totalSessions: number;
  lastBookingDate?: string;
  assignedSedeId: string;
  currentGroupId?: string;
  medicalInfo: {
    allergies: string;
    currentInjuries: string;
    pastInjuries: string;
    medicalAuth: boolean;
    imageAuth: boolean;
  };
}

export interface Resource {
  id: string;
  name: string;
  type: 'campo' | 'sala' | 'otro';
}

export interface Sede {
  id: string;
  name: string;
  location: string;
  resources: Resource[];
  activeServiceIds: string[];
  lat?: number;
  lng?: number;
  googleMapsUrl?: string;
  description?: string;
  image?: string;
  phone?: string;
  schedule?: string;
  email?: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number;
  capacity: number;
  price: number;
  category: 'Prem Academy' | 'Prem Pro';
}

export interface Session {
  id: string;
  serviceId: string;
  sedeId: string;
  coachId: string;
  startTime: string;
  endTime: string;
  currentAttendees: number;
}

export interface Booking {
  id: string;
  sessionId: string;
  userId: string;
  status: 'confirmed' | 'attended' | 'cancelled';
  date: string;
}

export interface Transaction {
  id: string;
  date: string;
  pack: string;
  amount: number;
  prems: number;
  status: 'Completado' | 'Pendiente' | 'Fallido';
}

export interface Pack {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  totalPrems: number;
  bonusPrems: number;
  sessionsCount: number;
  realCostPerSession: number;
  popular: boolean;
  color: string;
  iconName: 'ticket' | 'zap' | 'star' | 'trophy';
  allowMonthly: boolean;
  months?: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  linkText: string;
  onLinkClick?: () => void;
  iconName?: 'zap' | 'trophy' | 'target' | 'brain';
}

export interface ActionCardProps {
  title: string;
  description: string;
  value?: string | number;
  subValue?: string;
  buttonText: string;
  onButtonClick: () => void;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success' | 'payment' | 'session';

export interface Notification {
  id: string;
  userId: string; // 'all' for general messages
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  link?: string; // Optional link to navigate to
}