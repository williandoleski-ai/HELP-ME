
export enum ServiceCategory {
  QUEUE = 'QUEUE',
  PET = 'PET'
}

export enum ServiceType {
  // Queue Services
  BANK_LINE = 'Fila de Banco',
  TICKET_LINE = 'Compra de Ingressos',
  GOV_BUREAUCRACY = 'Repartição Pública',
  SPOT_HOLDER = 'Segurar Lugar',
  
  // Pet Services
  WALK_30 = 'Passeio 30min',
  WALK_60 = 'Passeio 60min',
  WALK_PREMIUM = 'Passeio Premium Monitorado',
  PET_VISIT = 'Visita Rápida (Xixi/Comida)'
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'trophy' | 'clock' | 'dog' | 'zap' | 'star';
  color: string; // Tailwind color class logic e.g. 'text-yellow-500'
}

export interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  verified: boolean;
  categories: ServiceCategory[];
  hourlyRate?: number; // Base rate for custom time
  specialties: string[];
  bio: string;
  location: Coordinate; // New: Geo Location
  status: 'available' | 'busy' | 'offline';
  // Gamification
  level: number;
  xp: number;
  xpToNextLevel: number;
  completedTasks: number;
  badges: Badge[];
}

export interface ServicePackage {
  id: string;
  type: ServiceType;
  category: ServiceCategory;
  name: string;
  durationMinutes: number;
  price: number;
  description: string;
  features: string[];
}

export interface Booking {
  id: string;
  providerId: string;
  serviceId: string;
  date: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  totalPrice: number;
  notes?: string;
  report?: string; // AI Generated report
}

export interface UserStats {
  hoursSaved: number;
  moneySpent: number;
  tasksCompleted: number;
}

// New: Task available for providers to pick up
export interface OpenTask {
  id: string;
  userId: string;
  serviceType: ServiceType;
  category: ServiceCategory;
  description: string;
  location: Coordinate;
  price: number;
  distanceKm?: number; // Calculated at runtime
}

// New: Chat Message Interface
export interface Message {
  id: string;
  senderId: 'user' | 'provider' | 'system';
  text?: string;
  image?: string; // base64 or url
  audio?: boolean; // simple flag for demo
  timestamp: Date;
  isSystemWarning?: boolean;
}