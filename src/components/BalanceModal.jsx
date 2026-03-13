import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target } from 'lucide-react';

const BalanceModal = ({ isOpen, onClose, onConfirm, currentBudget }) => {
    const [budget, setBudget] = useState(currentBudget || '');

    const handleConfirm = () => {
        if (budget !== '') {
            onConfirm(Number(budget));
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ scale: 0.9, y: 20, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.9, y: 20, opacity: 0 }}
                        className="relative w-full max-w-sm bg-matte-black border border-gold/30 rounded-3xl p-8 shadow-2xl overflow-hidden"
                    >
                        {/* Background glow Decor */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-gold font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                <Target size={16} /> Saldo Real / Presupuesto
                            </h3>
                            <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center">
                                <input
                                    type="number"
                                    inputMode="decimal"
                                    autoFocus
                                    placeholder="0.00"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    className="w-full bg-transparent text-5xl font-bold text-white text-center border-b-2 border-gold/30 focus:border-gold outline-none pb-4 transition-all placeholder:text-white/10"
                                />
                                <p className="text-[11px] text-white/40 mt-4 italic">
                                    "Define tu límite mensual para un control total."
                                </p>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(212, 175, 55, 0.4)" }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleConfirm}
                                className="w-full py-4 bg-gold text-black font-bold rounded-2xl shadow-lg shadow-gold/20 uppercase tracking-widest text-xs transition-all"
                            >
                                Establecer Presupuesto
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default BalanceModal;
