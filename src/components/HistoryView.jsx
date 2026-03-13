import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar, Trash2, Search,
    ChevronDown, X, TrendingDown, TrendingUp, Filter, ExternalLink
} from 'lucide-react';

const CATEGORY_ICONS = {
    Vivienda: '🏠',
    Suministros: '⚡',
    Comida: '🍽️',
    Transporte: '🚗',
    Salud: '❤️',
    Entretenimiento: '🎭',
    Otros: '📦',
    Ahorro: '💰',
};

const MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const ALL_CATEGORIES = ['Vivienda', 'Suministros', 'Comida', 'Transporte', 'Salud', 'Entretenimiento', 'Otros', 'Ahorro'];

const HistoryView = ({ expenses, onDelete }) => {
    const currentMonth = new Date().getMonth() + 1;
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [searchText, setSearchText] = useState('');
    const [showMonthPicker, setShowMonthPicker] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const filtered = useMemo(() => {
        return [...expenses]
            .filter(e => {
                const matchMonth = selectedMonth === 0 || e.mes === selectedMonth;
                const matchCat = selectedCategory === 'Todos' || e.categoria === selectedCategory;
                const matchSearch = !searchText || (e.descripcion || '').toLowerCase().includes(searchText.toLowerCase());
                return matchMonth && matchCat && matchSearch;
            })
            .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    }, [expenses, selectedMonth, selectedCategory, searchText]);

    const totals = useMemo(() => {
        return filtered.reduce(
            (acc, e) => {
                acc.gastos += Number(e.monto || 0);
                acc.ahorro += Number(e.ahorro || 0);
                return acc;
            },
            { gastos: 0, ahorro: 0 }
        );
    }, [filtered]);

    const handleDeleteConfirm = (exp) => {
        setConfirmDelete(exp);
    };

    const handleDeleteExecute = () => {
        if (confirmDelete && onDelete) {
            onDelete(confirmDelete);
        }
        setConfirmDelete(null);
    };

    return (
        <div className="px-6 py-4 space-y-5 pb-32">
            {/* CABECERA */}
            <header>
                <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Historial</h2>
                <p className="text-gold/60 text-xs font-bold uppercase tracking-widest mt-1">
                    {filtered.length} registro{filtered.length !== 1 ? 's' : ''}
                </p>
            </header>

            {/* RESUMEN RÁPIDO */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-red-500/5 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3">
                    <TrendingDown size={18} className="text-red-400 shrink-0" />
                    <div>
                        <p className="text-[9px] text-red-400/60 uppercase font-black tracking-widest">Gastado</p>
                        <p className="text-red-400 font-black text-base">€{totals.gastos.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
                    <TrendingUp size={18} className="text-emerald-400 shrink-0" />
                    <div>
                        <p className="text-[9px] text-emerald-400/60 uppercase font-black tracking-widest">Ahorrado</p>
                        <p className="text-emerald-400 font-black text-base">€{totals.ahorro.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                </div>
            </div>

            {/* FILTROS */}
            <div className="space-y-3">
                {/* Buscador */}
                <div className="relative">
                    <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        type="text"
                        placeholder="Buscar por descripción..."
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-10 py-3 rounded-2xl text-[11px] font-medium outline-none focus:border-gold/30 transition-all placeholder:text-white/20"
                    />
                    {searchText && (
                        <button onClick={() => setSearchText('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Selector de Mes */}
                <div className="relative">
                    <button
                        onClick={() => setShowMonthPicker(!showMonthPicker)}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-widest flex items-center justify-between hover:border-gold/30 transition-all"
                    >
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-gold" />
                            <span>{selectedMonth === 0 ? 'Todos los meses' : MONTHS[selectedMonth - 1]}</span>
                        </div>
                        <ChevronDown size={14} className={`text-white/30 transition-transform ${showMonthPicker ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {showMonthPicker && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                                className="absolute top-full mt-2 left-0 right-0 bg-[#111] border border-white/10 rounded-2xl z-20 overflow-hidden shadow-2xl"
                            >
                                <button
                                    onClick={() => { setSelectedMonth(0); setShowMonthPicker(false); }}
                                    className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest transition-colors ${selectedMonth === 0 ? 'text-gold bg-gold/10' : 'text-white/60 hover:bg-white/5'}`}
                                >
                                    Todos los meses
                                </button>
                                {MONTHS.map((m, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setSelectedMonth(i + 1); setShowMonthPicker(false); }}
                                        className={`w-full px-4 py-3 text-left text-[11px] font-bold uppercase tracking-widest transition-colors ${selectedMonth === i + 1 ? 'text-gold bg-gold/10' : 'text-white/60 hover:bg-white/5'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Filtro de Categoría (chips) */}
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory('Todos')}
                        className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === 'Todos' ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10 hover:border-gold/30'}`}
                    >
                        Todos
                    </button>
                    {ALL_CATEGORIES.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedCategory === cat ? 'bg-gold text-black border-gold' : 'bg-white/5 text-white/40 border-white/10 hover:border-gold/30'}`}
                        >
                            {CATEGORY_ICONS[cat]} {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* LISTA DE GASTOS */}
            <div className="space-y-3">
                {filtered.length === 0 ? (
                    <div className="text-center py-20 opacity-20">
                        <Filter size={32} className="mx-auto mb-3" />
                        <p className="text-sm font-bold uppercase tracking-widest">Sin registros</p>
                        <p className="text-[10px] mt-1">Prueba cambiando los filtros</p>
                    </div>
                ) : (
                    filtered.map((exp, idx) => {
                        const isSaving = exp.categoria === 'Ahorro' || Number(exp.ahorro || 0) > 0;
                        const amount = isSaving ? Number(exp.ahorro || 0) : Number(exp.monto || 0);
                        const dateObj = new Date(exp.fecha);
                        const dateStr = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                        const timeStr = dateObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                        return (
                            <motion.div
                                key={`${exp.fecha}-${idx}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: Math.min(idx * 0.04, 0.4) }}
                                className={`bg-matte-black border rounded-2xl p-4 flex items-center justify-between group transition-all ${isSaving ? 'border-emerald-500/20 hover:border-emerald-500/40' : 'border-gold/10 hover:border-gold/30'}`}
                            >
                                <div className="flex items-center gap-3 min-w-0">
                                    {/* Icono */}
                                    <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center text-base ${isSaving ? 'bg-emerald-500/10' : 'bg-gold/5'}`}>
                                        {CATEGORY_ICONS[exp.categoria] || '📦'}
                                    </div>

                                    {/* Info */}
                                    <div className="min-w-0">
                                        <p className="text-white font-bold text-sm leading-none mb-1 truncate">{exp.categoria}</p>
                                        {exp.descripcion && (
                                            <p className="text-white/40 text-[10px] italic leading-tight truncate max-w-[170px]">
                                                {exp.descripcion}
                                            </p>
                                        )}
                                        {exp.ticketUrl && (
                                            <a
                                                href={exp.ticketUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="inline-flex items-center gap-1 text-gold/60 text-[9px] uppercase font-black tracking-widest hover:text-gold transition-colors mt-0.5"
                                            >
                                                <ExternalLink size={8} />
                                                Ver ticket
                                            </a>
                                        )}
                                        <p className="text-white/20 text-[9px] uppercase font-bold tracking-tighter mt-1 flex items-center gap-1">
                                            <Calendar size={8} />
                                            {dateStr} · {timeStr}
                                        </p>
                                    </div>
                                </div>

                                {/* Monto + Eliminar */}
                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                    <div className="text-right">
                                        <p className={`font-black text-base leading-none ${isSaving ? 'text-emerald-400' : 'text-gold'}`}>
                                            {isSaving ? '+' : '-'}€{amount.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                        {isSaving && <p className="text-emerald-400/40 text-[8px] font-black uppercase tracking-widest mt-0.5">AHORRO</p>}
                                    </div>

                                    {onDelete && (
                                        <button
                                            onClick={() => handleDeleteConfirm(exp)}
                                            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/10 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* MODAL CONFIRMACIÓN BORRADO */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end justify-center p-6"
                        onClick={() => setConfirmDelete(null)}
                    >
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 60, opacity: 0 }}
                            className="bg-[#111] border border-red-500/20 rounded-3xl p-6 w-full max-w-sm space-y-4"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="text-center space-y-2">
                                <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
                                    <Trash2 size={20} className="text-red-500" />
                                </div>
                                <h3 className="text-white font-black uppercase tracking-tighter text-base">¿Eliminar este gasto?</h3>
                                <p className="text-white/40 text-[11px] leading-relaxed">
                                    Esta acción borrará permanentemente el registro de tu Bóveda Local.
                                </p>
                                {confirmDelete && (
                                    <div className="bg-white/5 rounded-xl p-3 text-left">
                                        <p className="text-gold font-bold text-sm">{CATEGORY_ICONS[confirmDelete.categoria]} {confirmDelete.categoria}</p>
                                        <p className="text-white/40 text-[10px] italic mt-0.5">{confirmDelete.descripcion}</p>
                                        <p className="text-white font-black mt-1">
                                            €{Number(confirmDelete.monto || confirmDelete.ahorro || 0).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="p-4 bg-white/5 border border-white/10 text-white/60 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleDeleteExecute}
                                    className="p-4 bg-red-500/90 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-all"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HistoryView;
