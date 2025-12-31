import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Clock, 
  Dog, 
  User, 
  MapPin, 
  Star, 
  ShieldCheck, 
  CheckCircle, 
  Menu, 
  ChevronRight, 
  Search,
  Calendar,
  Sparkles,
  ArrowLeft,
  Map as MapIcon,
  List as ListIcon,
  Navigation,
  Briefcase,
  Users,
  Check,
  Crown,
  X,
  Send,
  Mic,
  Camera,
  Image as ImageIcon,
  AlertTriangle,
  Play,
  MessageSquare,
  Trophy,
  Zap,
  Award,
  TrendingUp,
  RefreshCw,
  Download,
  Video,
  BarChart2,
  Activity,
  Smile,
  Heart,
  ExternalLink,
  ChevronDown,
  Info,
  Copy,
  QrCode,
  CreditCard,
  Wallet,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, PieChart, Pie } from 'recharts';
import { PROVIDERS, SERVICES, CENTER_LOCATION, OPEN_TASKS } from './constants';
import { ServiceCategory, ServiceType, Provider, ServicePackage, Coordinate, OpenTask, Message, Badge as BadgeType } from './types';
import { generateServiceReport, getAIAssistantAdvice } from './services/geminiService';
import { paymentService } from './services/paymentService';
import L from 'leaflet';

// --- Mock Data for Detailed Report ---
const MOCK_BEHAVIOR_DATA = [
  { day: 'Seg', activity: 85, mood: 90, interaction: 70 },
  { day: 'Ter', activity: 60, mood: 85, interaction: 95 },
  { day: 'Qua', activity: 95, mood: 70, interaction: 80 },
  { day: 'Qui', activity: 70, mood: 95, interaction: 60 },
  { day: 'Sex', activity: 90, mood: 80, interaction: 85 },
  { day: 'Sab', activity: 40, mood: 95, interaction: 95 },
  { day: 'Dom', activity: 50, mood: 90, interaction: 90 },
];

const MOCK_MOOD_DISTRIBUTION = [
  { name: 'Feliz', value: 70, color: '#10b981' },
  { name: 'Brincalhão', value: 20, color: '#3b82f6' },
  { name: 'Calmo', value: 10, color: '#f59e0b' },
];

// --- Components ---

const Badge = ({ children, color = 'blue' }: { children?: React.ReactNode, color?: 'blue' | 'green' | 'purple' | 'red' }) => {
  const colors = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    red: 'bg-red-100 text-red-800'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colors[color as keyof typeof colors]}`}>
      {children}
    </span>
  );
};

const Button = ({ onClick, children, variant = 'primary', className = '', disabled = false, loading = false }: any) => {
  const variants = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800',
    secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
    pet: 'bg-emerald-600 text-white hover:bg-emerald-700',
    queue: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border-2 border-slate-200 text-slate-600',
    landing: 'bg-slate-900 text-white w-full py-4 rounded-xl font-bold text-lg hover:bg-slate-800 shadow-xl shadow-slate-200/50',
    pix: 'bg-[#00FFA3] text-slate-900 hover:bg-[#00E592] shadow-lg shadow-[#00FFA3]/20'
  };
  return (
    <button 
      onClick={onClick} 
      disabled={disabled || loading}
      className={`px-4 py-3 rounded-xl font-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {loading && <Loader2 size={18} className="animate-spin" />}
      <span>{children}</span>
    </button>
  );
};

const BehaviorChartModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[1000] bg-slate-900/90 backdrop-blur-md flex flex-col animate-in fade-in slide-in-from-bottom-10">
      <header className="p-6 flex items-center justify-between text-white border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-400 p-2 rounded-xl text-slate-900">
            <BarChart2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Relatório de Bem-estar AI</h2>
            <p className="text-xs text-slate-400">Análise Premium de Comportamento</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-10">
        <section className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <div className="flex items-center space-x-2 mb-6">
            <Smile className="text-emerald-400" size={20} />
            <h3 className="font-bold text-white">Distribuição de Humor</h3>
          </div>
          <div className="h-48 w-full flex items-center justify-center">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_MOOD_DISTRIBUTION}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {MOCK_MOOD_DISTRIBUTION.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                  />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-col space-y-2 ml-4">
                {MOCK_MOOD_DISTRIBUTION.map(m => (
                  <div key={m.name} className="flex items-center text-xs text-slate-300">
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: m.color }}></div>
                    {m.name}: {m.value}%
                  </div>
                ))}
             </div>
          </div>
        </section>

        <section className="bg-white/5 rounded-3xl p-6 border border-white/10">
          <div className="flex items-center space-x-2 mb-6">
            <Activity className="text-amber-400" size={20} />
            <h3 className="font-bold text-white">Níveis de Atividade e Interação</h3>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_BEHAVIOR_DATA}>
                <defs>
                  <linearGradient id="colorAct" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10}} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="activity" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorAct)" name="Atividade" />
                <Area type="monotone" dataKey="interaction" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorInt)" name="Interação" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <button 
          onClick={onClose}
          className="w-full py-4 bg-amber-400 text-slate-900 rounded-2xl font-black shadow-xl shadow-amber-400/20"
        >
          FECHAR RELATÓRIO
        </button>
      </div>
    </div>
  );
};

const LeafletMap = ({ 
  items, 
  userLocation, 
  onSelect, 
  type = 'provider' 
}: { 
  items: (Provider | OpenTask)[], 
  userLocation: Coordinate, 
  onSelect: (item: any) => void,
  type?: 'provider' | 'task'
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false 
      }).setView([userLocation.lat, userLocation.lng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
      mapInstanceRef.current = map;
    }
    setTimeout(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    }, 100);
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Circle) map.removeLayer(layer);
    });
    
    L.circle([userLocation.lat, userLocation.lng], {
      color: type === 'provider' ? '#3b82f6' : '#10b981',
      fillColor: type === 'provider' ? '#3b82f6' : '#10b981',
      fillOpacity: 0.1,
      radius: 2000
    }).addTo(map);

    items.forEach(item => {
      const color = type === 'provider' ? '#2563eb' : '#f59e0b';
      const markerHtml = `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"></div>`;
      const icon = L.divIcon({ className: 'custom-marker', html: markerHtml, iconSize: [24, 24] });
      L.marker([item.location.lat, item.location.lng], { icon }).addTo(map).on('click', () => onSelect(item));
    });
  }, [items, userLocation, type]);

  return <div ref={mapContainerRef} className="w-full h-full relative" />;
};

const LandingPage = ({ onLogin }: { onLogin: () => void }) => {
  return (
    <div className="flex flex-col h-full bg-[#F3F5F9]">
      <nav className="flex items-center justify-between px-6 py-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Help-Me</h1>
        <button onClick={onLogin} className="bg-white text-slate-900 px-5 py-2 rounded-xl text-sm font-bold shadow-sm">Entrar</button>
      </nav>
      <div className="flex-1 overflow-y-auto px-6 pt-10">
        <h2 className="text-5xl font-extrabold text-slate-900 leading-tight mb-6">Seu tempo é valioso.</h2>
        <p className="text-slate-500 text-xl font-medium mb-12">Não perca mais tempo em filas. Deixe o trabalho pesado conosco.</p>
        
        <div className="space-y-4 mb-10">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-2xl text-blue-600"><Clock size={28} /></div>
            <div><h3 className="font-bold text-slate-900">Economize Tempo</h3><p className="text-xs text-slate-500">Recupere horas do seu dia.</p></div>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4">
            <div className="bg-emerald-100 p-3 rounded-2xl text-emerald-600"><Dog size={28} /></div>
            <div><h3 className="font-bold text-slate-900">Cuidado Especial</h3><p className="text-xs text-slate-500">Seu pet em boas mãos.</p></div>
          </div>
        </div>
        
        <Button variant="landing" onClick={onLogin}>Começar Agora</Button>
      </div>
    </div>
  );
};

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'queue' | 'pet' | 'details' | 'booking' | 'success' | 'abacatepay' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<ServicePackage | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showBehaviorModal, setShowBehaviorModal] = useState(false);
  
  // AbacatePay States
  const [pixData, setPixData] = useState<{ qrCode: string, copyPaste: string, transactionId: string } | null>(null);
  const [isGeneratingPix, setIsGeneratingPix] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);

  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchRadius, setSearchRadius] = useState<number>(5);
  const [userLocation, setUserLocation] = useState<Coordinate>(CENTER_LOCATION);
  const [appMode, setAppMode] = useState<'client' | 'executor'>('client');

  // Fix: Added missing handleServiceSelect function to handle service selection and navigation
  const handleServiceSelect = (s: ServicePackage) => {
    setSelectedService(s);
    setCurrentView('details');
  };

  const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
    const R = 6371; 
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) * Math.sin(dLng/2) * Math.sin(dLng/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  const startCheckout = async () => {
    if (!selectedService) return;
    setIsGeneratingPix(true);
    setCurrentView('abacatepay');
    try {
      const data = await paymentService.createPixCharge(selectedService.price, selectedService.name);
      setPixData(data);
    } catch (err) {
      alert("Erro ao gerar PIX. Tente novamente.");
      setCurrentView('booking');
    } finally {
      setIsGeneratingPix(false);
    }
  };

  const verifyPayment = async () => {
    if (!pixData) return;
    setIsVerifyingPayment(true);
    try {
      const status = await paymentService.checkPaymentStatus(pixData.transactionId);
      if (status === 'PAID') {
        setPaymentConfirmed(true);
        setTimeout(() => {
          setCurrentView('success');
          setPaymentConfirmed(false);
          setPixData(null);
        }, 2000);
      }
    } catch (err) {
      alert("Erro ao verificar pagamento.");
    } finally {
      setIsVerifyingPayment(false);
    }
  };

  const renderHome = () => {
    const myStats = PROVIDERS[0];
    const progressPercent = (myStats.xp / myStats.xpToNextLevel) * 100;
    return (
      <div className="flex flex-col h-full bg-slate-50">
        <header className="px-6 pt-12 pb-6 bg-white shadow-sm rounded-b-3xl z-10">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {appMode === 'client' ? 'Olá, Cliente 👋' : 'Olá, Executor 💼'}
              </h1>
              <p className="text-slate-500 text-sm">O que faremos hoje?</p>
            </div>
            <button 
              onClick={() => setAppMode(prev => prev === 'client' ? 'executor' : 'client')}
              className="text-xs font-bold px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-slate-600"
            >
              Mudar para {appMode === 'client' ? 'Executor' : 'Cliente'}
            </button>
          </div>
          {appMode === 'client' ? (
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg">Tempo Economizado</p>
                  <h2 className="text-3xl font-bold mt-1">12h 30m</h2>
                  <p className="text-blue-100 text-xs mt-1">Neste mês</p>
                </div>
                <Clock className="bg-white/20 p-2 rounded-lg h-10 w-10" />
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-4 text-white shadow-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Trophy size={16} className="text-yellow-300" />
                    <span className="font-bold text-lg">Nível {myStats.level}</span>
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2 mb-1 min-w-[120px]">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                  <p className="text-[10px] text-emerald-100">{myStats.xp} / {myStats.xpToNextLevel} XP</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-xs opacity-90">Ganhos Hoje</p>
                  <h2 className="text-2xl font-bold">R$ 125</h2>
                </div>
              </div>
            </div>
          )}
        </header>
        
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          <h3 className="font-bold text-slate-800 text-lg">Categorias</h3>
          <div onClick={() => { setSelectedCategory(ServiceCategory.QUEUE); setCurrentView('queue'); }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Clock size={32} /></div>
              <div>
                <h4 className="font-bold text-xl text-slate-900">Fila & Espera</h4>
                <p className="text-sm text-slate-500">Recupere seu tempo em filas.</p>
              </div>
            </div>
          </div>
          <div onClick={() => { setSelectedCategory(ServiceCategory.PET); setCurrentView('pet'); }} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 cursor-pointer active:scale-95 transition-transform">
            <div className="flex items-center space-x-4">
              <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-600"><Dog size={32} /></div>
              <div>
                <h4 className="font-bold text-xl text-slate-900">Help-Me Pet</h4>
                <p className="text-sm text-slate-500">Passeios e cuidados animais.</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center space-x-3" onClick={() => setShowBehaviorModal(true)}>
             <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><BarChart2 size={20}/></div>
             <div className="flex-1"><p className="text-xs font-bold text-amber-800">NOVIDADE: Relatório de Humor AI</p><p className="text-[10px] text-amber-700">Veja o bem-estar do seu pet em tempo real.</p></div>
             <ChevronRight size={16} className="text-amber-400" />
          </div>
        </div>
      </div>
    );
  };

  const renderAbacatePay = () => {
    if (!selectedService) return null;
    return (
      <div className="flex flex-col h-full bg-[#0B0F19] text-white">
        <header className="px-6 pt-12 pb-6 border-b border-white/10 flex items-center justify-between">
           <button onClick={() => setCurrentView('booking')} className="p-2 bg-white/5 rounded-full"><ArrowLeft size={20} /></button>
           <div className="flex items-center space-x-2">
              <Wallet className="text-[#00FFA3]" size={20} />
              <span className="font-black text-sm tracking-tighter uppercase">AbacatePay Checkout</span>
           </div>
           <div className="w-10"></div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
           <div className="text-center space-y-2">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total a pagar</p>
              <h2 className="text-5xl font-black text-[#00FFA3]">R$ {selectedService.price.toFixed(2)}</h2>
           </div>

           <div className="bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col items-center space-y-6 relative min-h-[300px] justify-center">
              {isGeneratingPix ? (
                <div className="flex flex-col items-center space-y-4">
                   <Loader2 size={48} className="text-[#00FFA3] animate-spin" />
                   <p className="text-sm text-slate-400 font-bold animate-pulse">GERANDO QR CODE SEGURO...</p>
                </div>
              ) : !paymentConfirmed ? (
                <>
                  <div className="bg-white p-4 rounded-2xl shadow-[0_0_40px_rgba(0,255,163,0.2)]">
                     {pixData ? <img src={pixData.qrCode} alt="QR Code PIX" className="w-48 h-48" /> : <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-lg" />}
                  </div>
                  <div className="text-center">
                     <p className="text-sm font-bold text-slate-200">Escaneie o QR Code acima</p>
                     <p className="text-[10px] text-slate-500 mt-1 uppercase">Processado via Infraestrutura Segura</p>
                  </div>
                </>
              ) : (
                <div className="py-10 flex flex-col items-center space-y-4 animate-in zoom-in">
                   <div className="w-20 h-20 bg-[#00FFA3] rounded-full flex items-center justify-center text-slate-900 shadow-[0_0_30px_rgba(0,255,163,0.4)]">
                      <Check size={40} strokeWidth={4} />
                   </div>
                   <h3 className="text-xl font-black text-white">PAGAMENTO RECEBIDO!</h3>
                   <p className="text-sm text-slate-400">Finalizando seu agendamento...</p>
                </div>
              )}
           </div>

           {!paymentConfirmed && !isGeneratingPix && (
             <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
                   <div className="flex-1 truncate mr-4">
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Copia e Cola</p>
                      <p className="text-xs font-mono text-slate-300 truncate">{pixData?.copyPaste || 'Gerando código...'}</p>
                   </div>
                   <button 
                    onClick={() => { if(pixData) { navigator.clipboard.writeText(pixData.copyPaste); alert("Código copiado!"); } }}
                    className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                   >
                      <Copy size={20} className="text-[#00FFA3]" />
                   </button>
                </div>
                
                <Button variant="pix" className="w-full py-4" onClick={verifyPayment} loading={isVerifyingPayment}>
                   VERIFICAR PAGAMENTO
                </Button>
             </div>
           )}
        </div>
        
        <div className="p-6 text-center border-t border-white/5">
           <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Pagamento Seguro via AbacatePay</p>
        </div>
      </div>
    );
  };

  const renderDetails = () => {
    if (!selectedService) return null;
    const isPet = selectedService.category === ServiceCategory.PET;
    const themeColor = isPet ? 'bg-emerald-600' : 'bg-blue-600';
    return (
      <div className="flex flex-col h-full bg-white relative overflow-hidden">
        <header className={`px-6 pt-12 pb-6 ${themeColor} text-white shadow-md rounded-b-[40px] relative z-10`}>
           <button onClick={() => setCurrentView(isPet ? 'pet' : 'queue')} className="p-2 bg-white/20 rounded-full mb-6"><ArrowLeft size={20} /></button>
           <h1 className="text-3xl font-black mb-2 leading-tight">{selectedService.name}</h1>
           <p className="text-white/80 font-medium mb-4">{selectedService.description}</p>
           <div className="flex items-center space-x-4">
              <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md flex items-center font-bold">
                 <Clock size={16} className="mr-2" /> {selectedService.durationMinutes} min
              </div>
              <div className="bg-white px-4 py-2 rounded-2xl shadow-lg flex items-center text-slate-900 font-black">
                 R$ {selectedService.price.toFixed(2)}
              </div>
           </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
           <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center"><Sparkles className="mr-2 text-amber-400" size={20} /> O que está incluso</h3>
           <div className="space-y-3">
              {selectedService.features.map((f, i) => (
                <div key={i} className="flex items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className={`p-1 rounded-full ${isPet ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'} mr-3`}><Check size={14}/></div>
                  <span className="text-sm font-medium text-slate-700">{f}</span>
                </div>
              ))}
           </div>
        </div>
        <div className="p-6 bg-white border-t">
           <Button onClick={() => { 
             const best = PROVIDERS.filter(p => p.categories.includes(selectedService.category)).sort((a,b) => b.rating - a.rating)[0];
             setSelectedProvider(best);
             setCurrentView('booking');
           }} className="w-full py-5" variant={isPet ? 'pet' : 'queue'}>AGENDAR AGORA</Button>
        </div>
      </div>
    );
  };

  const renderListOrMap = () => {
    const isClient = appMode === 'client';
    const isPet = selectedCategory === ServiceCategory.PET;
    const themeColor = isPet ? 'text-emerald-600' : 'text-blue-600';
    const bgColor = isPet ? 'bg-emerald-600' : 'bg-blue-600';
    let displayItems = isClient ? PROVIDERS.filter(p => p.categories.includes(selectedCategory!) && calculateDistance(userLocation, p.location) <= searchRadius) : OPEN_TASKS.filter(t => calculateDistance(userLocation, t.location) <= searchRadius);
    
    return (
      <div className="flex flex-col h-full bg-slate-50 relative">
        <header className={`px-6 pt-12 pb-6 ${bgColor} text-white shadow-md rounded-b-3xl sticky top-0 z-20`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3"><button onClick={() => setCurrentView('home')} className="p-2 bg-white/20 rounded-full"><ArrowLeft size={20} /></button><h1 className="text-xl font-bold">{isClient ? (isPet ? 'Pet Care' : 'Fila & Espera') : 'Tarefas'}</h1></div>
            <div className="flex bg-black/20 p-1 rounded-xl"><button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white text-slate-900' : 'text-white/70'}`}><ListIcon size={18} /></button><button onClick={() => setViewMode('map')} className={`p-2 rounded-lg ${viewMode === 'map' ? 'bg-white text-slate-900' : 'text-white/70'}`}><MapIcon size={18} /></button></div>
          </div>
          <div className="flex items-center space-x-2"><Navigation size={14} /><span>{searchRadius} km</span><input type="range" min="1" max="20" value={searchRadius} onChange={e => setSearchRadius(Number(e.target.value))} className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"/></div>
        </header>
        <div className="flex-1 overflow-hidden relative">
          {viewMode === 'map' ? (
            <LeafletMap items={displayItems} userLocation={userLocation} type={isClient ? 'provider' : 'task'} onSelect={i => {
               if(isClient) { setSelectedService(SERVICES.find(s=>s.category===selectedCategory)!); setSelectedProvider(i as Provider); setCurrentView('booking'); }
            }} />
          ) : (
            <div className="overflow-y-auto h-full px-6 py-6 space-y-6">
              <section><h3 className="font-bold text-slate-800 mb-4">Serviços</h3><div className="space-y-3">{SERVICES.filter(s=>s.category===selectedCategory).map(s => (<div key={s.id} onClick={()=>handleServiceSelect(s)} className="bg-white p-4 rounded-2xl border border-slate-100 cursor-pointer shadow-sm active:scale-95 transition-transform flex justify-between items-center"><h4 className="font-bold text-slate-900">{s.name}</h4><span className={`font-bold ${themeColor}`}>R$ {s.price.toFixed(2)}</span></div>))}</div></section>
              <section><h3 className="font-bold text-slate-800 mb-4">Profissionais</h3><div className="space-y-4">{displayItems.map(p => (<div key={p.id} onClick={() => { setSelectedProvider(p as Provider); setCurrentView('booking'); }} className="bg-white p-4 rounded-2xl shadow-sm flex items-center space-x-4 border border-slate-100 cursor-pointer"><img src={(p as Provider).avatar} className="w-12 h-12 rounded-full object-cover" /><div className="flex-1"><div className="flex justify-between items-center"><h4 className="font-bold text-slate-900">{(p as Provider).name}</h4><div className="flex items-center text-amber-400 text-xs font-bold"><Star size={12} className="fill-current mr-1"/>{(p as Provider).rating}</div></div><div className="text-xs text-slate-500 mt-1 flex items-center"><MapPin size={10} className="mr-1"/>{calculateDistance(userLocation, (p as Provider).location).toFixed(1)} km</div></div></div>))}</div></section>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white shadow-2xl overflow-hidden flex flex-col relative">
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-0">
        {!isAuthenticated ? <LandingPage onLogin={() => setIsAuthenticated(true)} /> : (
          <><main className="flex-1 overflow-hidden relative">
            {currentView === 'home' && renderHome()}
            {(currentView === 'queue' || currentView === 'pet') && renderListOrMap()}
            {currentView === 'details' && renderDetails()}
            {currentView === 'booking' && (
              <div className="p-6 flex flex-col h-full">
                <header className="mb-8"><button onClick={() => setCurrentView('details')}><ArrowLeft/></button><h2 className="text-2xl font-black mt-4">Resumo do Pedido</h2></header>
                <div className="flex-1 space-y-4">
                  <div className="p-5 bg-slate-50 rounded-3xl"><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Serviço</p><h4 className="text-lg font-bold">{selectedService?.name}</h4></div>
                  <div className="p-5 bg-slate-50 rounded-3xl flex items-center space-x-3"><img src={selectedProvider?.avatar} className="w-12 h-12 rounded-full" /><div><p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prestador</p><h4 className="font-bold">{selectedProvider?.name}</h4></div></div>
                  <div className="p-5 bg-blue-50 rounded-3xl border border-blue-100"><p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Total</p><h4 className="text-3xl font-black text-blue-600">R$ {selectedService?.price.toFixed(2)}</h4></div>
                </div>
                <Button variant="pix" onClick={startCheckout} className="w-full py-5 mt-4"><CreditCard className="mr-2"/> PAGAR COM PIX (AbacatePay)</Button>
              </div>
            )}
            {currentView === 'abacatepay' && renderAbacatePay()}
            {currentView === 'success' && (
              <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white">
                 <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce"><CheckCircle size={64} /></div>
                 <h2 className="text-3xl font-black">Confirmado!</h2>
                 <p className="text-slate-500 mt-2">Pagamento recebido e agendamento concluído.</p>
                 <Button onClick={() => setCurrentView('home')} className="mt-10 px-10">VOLTAR AO INÍCIO</Button>
              </div>
            )}
            {currentView === 'profile' && (
               <div className="p-6 flex flex-col h-full bg-slate-50">
                  <h2 className="text-2xl font-black mb-8">Meu Perfil</h2>
                  <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center space-y-4">
                     <img src="https://picsum.photos/200" className="w-24 h-24 rounded-full mx-auto border-4 border-white shadow-lg" />
                     <div><h3 className="text-xl font-bold">Usuário Demonstração</h3><p className="text-slate-500 text-sm">premium@helpme.com</p></div>
                     <Badge color="blue">CLIENTE PREMIUM</Badge>
                  </div>
                  <div className="mt-8 space-y-3">
                     <div className="bg-white p-4 rounded-2xl flex items-center justify-between"><div className="flex items-center space-x-3 text-slate-700"><Wallet size={20}/><span className="font-bold">Métodos de Pagamento</span></div><ChevronRight size={18} className="text-slate-300"/></div>
                     <div className="bg-white p-4 rounded-2xl flex items-center justify-between"><div className="flex items-center space-x-3 text-slate-700"><Clock size={20}/><span className="font-bold">Histórico</span></div><ChevronRight size={18} className="text-slate-300"/></div>
                  </div>
                  <Button variant="secondary" className="mt-auto" onClick={() => setIsAuthenticated(false)}>Sair</Button>
               </div>
            )}
          </main>
          {!['booking', 'details', 'abacatepay', 'success'].includes(currentView) && (
            <nav className="h-20 bg-white border-t flex items-center justify-around px-2 z-[400]">
              <button onClick={() => setCurrentView('home')} className={`flex flex-col items-center p-2 rounded-xl ${currentView === 'home' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}><Home size={22} /><span className="text-[10px] mt-1 font-bold">Início</span></button>
              <button onClick={() => { setSelectedCategory(ServiceCategory.QUEUE); setCurrentView('queue'); }} className={`flex flex-col items-center p-2 rounded-xl ${currentView === 'queue' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}><Clock size={22} /><span className="text-[10px] mt-1 font-bold">Fila</span></button>
              <button onClick={() => { setSelectedCategory(ServiceCategory.PET); setCurrentView('pet'); }} className={`flex flex-col items-center p-2 rounded-xl ${currentView === 'pet' ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'}`}><Dog size={22} /><span className="text-[10px] mt-1 font-bold">Pet</span></button>
              <button onClick={() => setCurrentView('profile')} className={`flex flex-col items-center p-2 rounded-xl ${currentView === 'profile' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}><User size={22} /><span className="text-[10px] mt-1 font-bold">Perfil</span></button>
            </nav>
          )}</>
        )}
      </div>

      <BehaviorChartModal isOpen={showBehaviorModal} onClose={() => setShowBehaviorModal(false)} />
    </div>
  );
}