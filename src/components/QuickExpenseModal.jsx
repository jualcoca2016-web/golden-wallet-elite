import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, Home, Zap, ShoppingBag, Truck, Activity, PartyPopper, MoreHorizontal, PiggyBank } from 'lucide-react';

const CATEGORY_ICONS = {
    'Vivienda': <Home size={20} />,
    'Suministros': <Zap size={20} />,
    'Comida': <ShoppingBag size={20} />,
    'Transporte': <Truck size={20} />,
    'Salud': <Activity size={20} />,
    'Entretenimiento': <PartyPopper size={20} />,
    'Otros': <MoreHorizontal size={20} />,
    'Ahorro': <PiggyBank size={20} />,
};

const QuickExpenseModal = ({ isOpen, onClose, category, onRegister }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setAmount('');
            setDescription('');
            // Auto-focus tras la animación de entrada
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 320);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const numericAmount = parseFloat(amount.replace(',', '.'));
    const isValid = !isNaN(numericAmount) && numericAmount > 0;

    const handleRegister = () => {
        if (!isValid) return;
        onRegister({
            monto: numericAmount,
            categoria: category,
            descripcion: description.trim() || category,
        });
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && isValid) handleRegister();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[70] flex items-end justify-center">
                    {/* Fondo */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="relative w-full max-w-md bg-matte-black border-t border-gold/30 rounded-t-[2rem] shadow-2xl flex flex-col"
                    >
                        {/* ── CABECERA ── */}
                        <div className="px-5 pt-5 pb-4 border-b border-gold/10 flex justify-between items-center bg-gold/5 rounded-t-[2rem] shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-gold text-black shadow-lg shadow-gold/20">
                                    {CATEGORY_ICONS[category] || <MoreHorizontal size={20} />}
                                </div>
                                <div>
                                    <p className="text-[9px] text-gold/60 uppercase tracking-[0.2em] font-bold">Registrar Gasto</p>
                                    <p className="text-white font-black uppercase tracking-wider text-sm">{category}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-white/40 hover:text-white transition-colors"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* ── CAMPO MONTO ── */}
                        <div className="px-5 pt-6 pb-3 shrink-0">
                            <p className="text-[9px] text-gold/50 uppercase tracking-[0.2em] font-bold mb-3 pl-1">
                                Introduce el monto
                            </p>
                            <div className="flex items-center bg-black/50 border border-gold/20 rounded-2xl px-5 focus-within:border-gold/60 transition-all gap-2">
                                <span className="text-gold font-black text-2xl select-none">€</span>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    inputMode="decimal"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value.replace(/[^0-9.,]/g, ''))}
                                    onKeyDown={handleKeyDown}
                                    placeholder="0.00"
                                    className="flex-1 bg-transparent text-white text-4xl font-black py-5 outline-none placeholder:text-white/15 tracking-tight"
                                />
                            </div>
                        </div>

                        {/* ── CAMPO DESCRIPCIÓN (OPCIONAL) ── */}
                        <div className="px-5 pb-6 shrink-0">
                            <input
                                type="text"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Descripción (opcional)"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/70 text-sm outline-none focus:border-gold/30 transition-all placeholder:text-white/20"
                            />
                        </div>

                        {/* ── BOTÓN REGISTRAR ── */}
                        <div className="px-5 pb-5 shrink-0">
                            <motion.button
                                whileTap={{ scale: 0.97 }}
                                onClick={handleRegister}
                                disabled={!isValid}
                                className="w-full bg-gold text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 uppercase tracking-widest text-sm shadow-lg shadow-gold/20 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                            >
                                <CheckCircle2 size={18} />
                                Registrar Gasto
                            </motion.button>
                        </div>

                        {/* Espacio home indicator iOS */}
                        <div className="shrink-0" style={{ height: 'env(safe-area-inset-bottom, 8px)' }} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickExpenseModal;
