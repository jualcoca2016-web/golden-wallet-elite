import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Database, Zap, ArrowRight, Lock } from 'lucide-react';

const OnboardingModal = ({ onAccept }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black backdrop-blur-xl"
        >
            <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                className="bg-matte-black w-full max-w-sm rounded-[3rem] border border-gold/30 p-8 shadow-2xl relative overflow-hidden"
            >
                {/* Fondo Decorativo */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />

                <div className="text-center relative z-10 space-y-8">
                    <div className="space-y-4">
                        <div className="w-20 h-20 bg-gold/10 rounded-3xl flex items-center justify-center mx-auto border border-gold/20 shadow-xl shadow-gold/5">
                            <ShieldCheck className="text-gold" size={40} />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">
                                ¡Bienvenido a tu<br />Bóveda Soberana! <span className="not-italic">🦅</span>
                            </h2>
                            <p className="text-gold/60 text-[9px] uppercase font-bold tracking-[0.3em]">Golden Wallet Elite</p>
                        </div>
                    </div>

                    <p className="text-white/60 text-xs leading-relaxed font-medium">
                        Has entrado en el estándar Elite de privacidad financiera. Tu Golden Wallet ha evolucionado para darte el **control físico total** de tu patrimonio.
                    </p>

                    <div className="space-y-4 text-left">
                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-white/5 rounded-xl text-gold shrink-0">
                                <Database size={18} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Tu dispositivo es tu banco</h4>
                                <p className="text-[10px] text-white/40 leading-tight mt-1">Toda tu contabilidad y tickets se guardan exclusivamente en la memoria segura de este navegador.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-white/5 rounded-xl text-gold shrink-0">
                                <Lock size={18} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Privacidad Blindada</h4>
                                <p className="text-[10px] text-white/40 leading-tight mt-1">Nadie, ni siquiera nosotros, puede ver tus números. No hay nubes intermediarias.</p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start">
                            <div className="p-2 bg-white/5 rounded-xl text-gold shrink-0">
                                <Zap size={18} />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Soberanía Total</h4>
                                <p className="text-[10px] text-white/40 leading-tight mt-1">Eres el único dueño. Recuerda realizar copias de seguridad en 'Configuración' para proteger tu patrimonio.</p>
                            </div>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onAccept}
                        className="w-full bg-gold text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-gold/10 uppercase tracking-widest text-xs mt-4"
                    >
                        <span>Activar mi Bóveda Local</span>
                        <ArrowRight size={18} />
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default OnboardingModal;
