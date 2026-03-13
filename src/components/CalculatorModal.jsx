import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Equal, Eraser, CheckCircle2 } from 'lucide-react';

const CalculatorModal = ({ isOpen, onClose, onRegister }) => {
    const [display, setDisplay] = useState('0');
    const [items, setItems] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('Hogar');

    const categories = ['Hogar', 'Comida', 'Transporte', 'Vivienda', 'Suministros', 'Entretenimiento'];

    const handleNumber = (num) => {
        setDisplay(prev => prev === '0' ? String(num) : prev + num);
    };

    const handlePlus = () => {
        if (display !== '0') {
            setItems(prev => [...prev, Number(display)]);
            setDisplay('0');
        }
    };

    const handleReset = () => {
        setDisplay('0');
        setItems([]);
    };

    const total = items.reduce((acc, val) => acc + val, 0) + Number(display);
    const breakdown = [...items, Number(display)].filter(i => i > 0).join(' + ');

    const handleFinalRegister = () => {
        if (total > 0) {
            onRegister({
                monto: total,
                categoria: currentCategory,
                descripcion: `Calculadora: ${breakdown} = ${total}€`
            });
            onClose();
            handleReset();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[60] flex items-end justify-center">
                    {/* Fondo */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/90"
                    />

                    {/* Modal: sube desde abajo, sin scroll, todo visible */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="relative w-full max-w-md bg-matte-black border-t border-gold/30 rounded-t-[2rem] shadow-2xl flex flex-col"
                        style={{ maxHeight: '92dvh' }}
                    >
                        {/* ── CABECERA (fija) ── */}
                        <div className="px-5 pt-4 pb-3 border-b border-gold/10 flex justify-between items-center bg-gold/5 rounded-t-[2rem] shrink-0">
                            <h3 className="text-gold font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <Plus size={14} /> Calculadora Inteligente
                            </h3>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* ── CATEGORÍAS (fijas, SIEMPRE visibles, justo bajo el título) ── */}
                        <div className="px-4 pt-3 pb-3 border-b border-gold/10 shrink-0">
                            <p className="text-[9px] text-gold/50 uppercase tracking-[0.2em] font-bold mb-2 pl-1">Selecciona categoría</p>
                            {/* flex-wrap: si no caben en una fila, pasan a la siguiente */}
                            <div className="flex flex-wrap gap-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCurrentCategory(cat)}
                                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                                            currentCategory === cat
                                                ? 'bg-gold text-black shadow-lg shadow-gold/20'
                                                : 'bg-white/5 text-white/70 border border-white/10 active:bg-gold/20'
                                        }`}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* ── DISPLAY (fijo) ── */}
                        <div className="px-5 py-3 shrink-0">
                            <div className="bg-black/40 px-5 py-4 rounded-2xl border border-gold/10 text-right">
                                <div className="text-white/40 text-xs font-medium mb-1 overflow-x-auto whitespace-nowrap">
                                    {breakdown || '0'}
                                </div>
                                <div className="text-3xl font-bold text-gold">
                                    {display} €
                                </div>
                            </div>
                        </div>

                        {/* ── TECLADO (crece si hay espacio) ── */}
                        <div className="px-5 pb-3 flex-1 flex flex-col gap-3 min-h-0">
                            <div className="grid grid-cols-4 gap-2 flex-1">
                                {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map(num => (
                                    <motion.button
                                        key={num}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleNumber(num)}
                                        className={`rounded-xl bg-white/5 text-white text-lg font-bold hover:bg-white/10 transition-colors flex items-center justify-center ${num === 0 ? 'col-span-2' : ''}`}
                                        style={{ minHeight: '48px' }}
                                    >
                                        {num}
                                    </motion.button>
                                ))}
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleReset}
                                    className="rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                                    style={{ minHeight: '48px' }}
                                >
                                    <Eraser size={18} />
                                </motion.button>
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handlePlus}
                                    className="rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20"
                                    style={{ minHeight: '48px' }}
                                >
                                    <Plus size={22} />
                                </motion.button>
                            </div>

                            {/* ── TOTAL Y REGISTRAR (fijo al fondo) ── */}
                            <div className="p-3 bg-gold/10 rounded-2xl border border-gold/20 flex items-center justify-between shrink-0">
                                <div>
                                    <p className="text-[9px] text-gold uppercase tracking-widest font-bold opacity-60">Total</p>
                                    <p className="text-xl font-bold text-white">{total.toLocaleString()} €</p>
                                </div>
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleFinalRegister}
                                    disabled={total === 0}
                                    className="px-5 py-2.5 bg-gold text-black font-bold rounded-xl flex items-center gap-2 uppercase tracking-widest text-[10px] disabled:opacity-50"
                                >
                                    Registrar <CheckCircle2 size={14} />
                                </motion.button>
                            </div>
                        </div>

                        {/* Espacio para el home indicator en iPhone */}
                        <div className="h-safe-area-inset-bottom shrink-0" style={{ height: 'env(safe-area-inset-bottom, 8px)' }} />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CalculatorModal;
