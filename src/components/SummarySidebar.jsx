import { ChevronRight, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SummarySidebar = ({ isOpen, onClose, year, setYear, monthlyData }) => {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-72 bg-matte-black border-l border-gold/20 z-50 p-6 flex flex-col"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-white uppercase tracking-tighter">Gasto Total Mes</h2>
                            <button onClick={onClose} className="p-2 text-gold hover:bg-gold/10 rounded-full transition-colors">
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        <div className="mb-8">
                            <label className="text-[10px] text-gold uppercase tracking-[0.2em] font-bold mb-3 block opacity-60">
                                Seleccionar Año
                            </label>
                            <div className="relative">
                                <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gold/50" />
                                <select
                                    value={year}
                                    onChange={(e) => setYear(Number(e.target.value))}
                                    className="w-full bg-black/40 border border-gold/20 rounded-xl py-3 pl-10 pr-4 text-white appearance-none focus:border-gold transition-all outline-none"
                                >
                                    <option value={2024}>2024</option>
                                    <option value={2025}>2025</option>
                                    <option value={2026}>2026</option>
                                    <option value={2027}>2027</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gold/20">
                            {months.map((month, idx) => {
                                const data = monthlyData[idx + 1] || { spending: 0, savings: 0 };
                                const amount = typeof data === 'object' ? data.spending : data;
                                return (
                                    <motion.div
                                        key={month}
                                        whileHover={{ x: 4 }}
                                        className="flex items-center justify-between p-4 bg-gold/5 border border-gold/5 rounded-2xl hover:bg-gold/10 transition-colors cursor-default"
                                    >
                                        <span className="text-white/60 font-medium">{month}</span>
                                        <span className="text-gold font-bold">{amount.toLocaleString()} €</span>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gold/10">
                            <p className="text-[10px] text-white/30 uppercase text-center tracking-widest">
                                Golden Wallet Elite &copy; 2026
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default SummarySidebar;
