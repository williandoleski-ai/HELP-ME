import { ServiceCategory, ServiceType, Provider, ServicePackage, OpenTask, Badge } from './types';

// Center Point: Av. Paulista, São Paulo
export const CENTER_LOCATION = { lat: -23.561684, lng: -46.655981 };

const BADGES: Record<string, Badge> = {
  QUEUE_NINJA: { id: 'b1', name: 'Ninja das Filas', description: '50+ horas em filas completadas', icon: 'clock', color: 'text-blue-500 bg-blue-100' },
  DOG_WHISPERER: { id: 'b2', name: 'Encantador de Cães', description: '50 avaliações 5 estrelas em Pets', icon: 'dog', color: 'text-emerald-500 bg-emerald-100' },
  FAST_RESPONSE: { id: 'b3', name: 'The Flash', description: 'Aceita tarefas em menos de 1 min', icon: 'zap', color: 'text-yellow-500 bg-yellow-100' },
  TOP_RATED: { id: 'b4', name: 'Super Estrela', description: 'Média 5.0 em 20 tarefas', icon: 'star', color: 'text-purple-500 bg-purple-100' },
  VETERAN: { id: 'b5', name: 'Lenda Urbana', description: 'Nível 5 alcançado', icon: 'trophy', color: 'text-orange-500 bg-orange-100' }
};

export const PROVIDERS: Provider[] = [
  {
    id: 'p1',
    name: 'Carlos Silva',
    avatar: 'https://picsum.photos/100/100?random=1',
    rating: 4.8,
    reviews: 124,
    verified: true,
    categories: [ServiceCategory.QUEUE],
    hourlyRate: 25,
    specialties: ['Bancos', 'Cartórios', 'Ingressos'],
    bio: 'Especialista em burocracia. Tenho paciência infinita para filas.',
    location: { lat: -23.564, lng: -46.652 }, // Near Paulista
    status: 'available',
    level: 3,
    xp: 2400,
    xpToNextLevel: 3000,
    completedTasks: 124,
    badges: [BADGES.QUEUE_NINJA, BADGES.FAST_RESPONSE]
  },
  {
    id: 'p2',
    name: 'Fernanda Lima',
    avatar: 'https://picsum.photos/100/100?random=2',
    rating: 4.9,
    reviews: 89,
    verified: true,
    categories: [ServiceCategory.PET],
    specialties: ['Cães Grandes', 'Adestramento Básico'],
    bio: 'Amante de animais e estudante de veterinária. Seu pet em boas mãos.',
    location: { lat: -23.558, lng: -46.660 }, // Consolação
    status: 'available',
    level: 2,
    xp: 1800,
    xpToNextLevel: 2000,
    completedTasks: 89,
    badges: [BADGES.DOG_WHISPERER]
  },
  {
    id: 'p3',
    name: 'Roberto Mendes',
    avatar: 'https://picsum.photos/100/100?random=3',
    rating: 4.7,
    reviews: 210,
    verified: true,
    categories: [ServiceCategory.QUEUE, ServiceCategory.PET],
    hourlyRate: 30,
    specialties: ['Filas Longas', 'Passeios Matinais'],
    bio: 'Versátil e pontual. Economizo seu tempo e cuido do seu melhor amigo.',
    location: { lat: -23.568, lng: -46.648 }, // Bela Vista
    status: 'busy',
    level: 5,
    xp: 8500,
    xpToNextLevel: 10000,
    completedTasks: 210,
    badges: [BADGES.VETERAN, BADGES.QUEUE_NINJA, BADGES.DOG_WHISPERER]
  },
  {
    id: 'p4',
    name: 'Julia Costa',
    avatar: 'https://picsum.photos/100/100?random=4',
    rating: 5.0,
    reviews: 45,
    verified: true,
    categories: [ServiceCategory.PET],
    specialties: ['Gatos', 'Filhotes', 'Cuidados Especiais'],
    bio: 'Certificada em primeiros socorros pet. Cuidado premium.',
    location: { lat: -23.560, lng: -46.658 }, // Jardins
    status: 'available',
    level: 2,
    xp: 1200,
    xpToNextLevel: 2000,
    completedTasks: 45,
    badges: [BADGES.TOP_RATED]
  }
];

export const SERVICES: ServicePackage[] = [
  // Queue Services
  {
    id: 's1',
    category: ServiceCategory.QUEUE,
    type: ServiceType.BANK_LINE,
    name: 'Espera em Banco',
    durationMinutes: 60,
    price: 35.00,
    description: 'Aguardamos na fila do banco para você.',
    features: ['Monitoramento em tempo real', 'Aviso 15min antes']
  },
  {
    id: 's2',
    category: ServiceCategory.QUEUE,
    type: ServiceType.SPOT_HOLDER,
    name: 'Segurar Lugar (Shows/Eventos)',
    durationMinutes: 120,
    price: 80.00,
    description: 'Garanta o melhor lugar chegando "cedo" sem sair de casa.',
    features: ['Fotos de comprovação', 'Permanência garantida']
  },
  
  // Pet Services
  {
    id: 's3',
    category: ServiceCategory.PET,
    type: ServiceType.WALK_30,
    name: 'Passeio Express (30min)',
    durationMinutes: 30,
    price: 35.00,
    description: 'Ideal para gastar energia rápida e necessidades.',
    features: ['Mapa do percurso', 'Foto ao final', 'Hidratação']
  },
  {
    id: 's4',
    category: ServiceCategory.PET,
    type: ServiceType.WALK_60,
    name: 'Passeio Completo (60min)',
    durationMinutes: 60,
    price: 55.00,
    description: 'Exercício completo para saúde do seu pet.',
    features: ['Relatório de humor', 'Vídeo curto', 'Hidratação reforçada']
  },
  {
    id: 's5',
    category: ServiceCategory.PET,
    type: ServiceType.WALK_PREMIUM,
    name: 'Passeio Premium Monitorado',
    durationMinutes: 90,
    price: 79.00,
    description: 'O máximo de cuidado e atenção exclusiva.',
    features: ['Monitoramento GPS ao vivo', 'Seguro veterinário', 'Kit higiene premium']
  }
];

export const OPEN_TASKS: OpenTask[] = [
  {
    id: 't1',
    userId: 'u1',
    serviceType: ServiceType.BANK_LINE,
    category: ServiceCategory.QUEUE,
    description: 'Fila Caixa Econômica - Saque FGTS',
    location: { lat: -23.562, lng: -46.654 },
    price: 45.00
  },
  {
    id: 't2',
    userId: 'u2',
    serviceType: ServiceType.WALK_60,
    category: ServiceCategory.PET,
    description: 'Passeio com Labrador - Parque Trianon',
    location: { lat: -23.563, lng: -46.657 },
    price: 55.00
  },
  {
    id: 't3',
    userId: 'u3',
    serviceType: ServiceType.GOV_BUREAUCRACY,
    category: ServiceCategory.QUEUE,
    description: 'Aguardar senha no Poupatempo',
    location: { lat: -23.555, lng: -46.662 },
    price: 60.00
  }
];