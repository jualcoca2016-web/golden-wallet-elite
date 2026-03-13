import { Home, History, Settings, Calculator } from 'lucide-react';

const BottomNav = ({ activeView, onViewChange }) => {
    const navItems = [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'historico', label: 'Historial', icon: History },
        { id: 'calculadora', label: 'Cálculo', icon: Calculator },
        { id: 'config', label: 'Config', icon: Settings }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-md border-t border-gold/20 flex justify-around items-center px-4 pb-2 z-40">
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeView === item.id;

                return (
                    <button
                        key={item.id}
                        onClick={() => onViewChange(item.id)}
                        className={`flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-gold' : 'text-white/40 hover:text-gold/60'
                            }`}
                    >
                        <div className={`p-2 rounded-xl transition-all ${isActive ? 'bg-gold/10' : ''}`}>
                            <Icon size={isActive ? 24 : 20} className={isActive ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]' : ''} />
                        </div>
                        <span className={`text-[9px] uppercase font-bold tracking-widest ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                            {item.label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;
