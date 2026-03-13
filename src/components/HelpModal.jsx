import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown, HelpCircle } from 'lucide-react';

const FAQ_ITEMS = [
    {
        q: "¿Acceso Restringido?",
        a: "Esto ocurre si tu suscripción no está marcada como 'ACTIVO' en el sistema central. Contacta con el administrador para verificar tu estado."
    },
    {
        q: "¿Móvil no reconocido?",
        a: "Asegúrate de introducir el número exacto (incluyendo prefijo si fue registrado así) con el que creaste tu cuenta original."
    },
    {
        q: "¿Otro dispositivo?",
        a: "La Golden Wallet es Local-First. Tus datos viven en este dispositivo. Para verlos en otro, debes exportar e importar un Backup Consolidado."
    },
    {
        q: "¿Debo loguearme siempre?",
        a: "No. La sesión en la App es permanente. Solo se te pedirá el móvil si cierras sesión manualmente desde el menú de Configuración."
    },
    {
        q: "¿Dónde están mis fotos/gastos?",
        a: "Exclusivamente en la memoria local cifrada de tu navegador. Ni nosotros ni Google tenemos acceso a tus datos financieros."
    },
    {
        q: "¿Qué pasa si borro la caché?",
        a: "Borrar los datos del sitio eliminará tu Bóveda. Es imperativo generar backups con frecuencia para evitar pérdida de información."
    },
    {
        q: "¿Cómo hago backup?",
        a: "Ve a Perfil > Configuración y pulsa 'Generar Backup Consolidado (ZIP)'. Guárdalo en un lugar seguro fuera de este dispositivo."
    },
    {
        q: "¿Es seguro?",
        a: "Utilizamos estándares de Privacidad Local-First. Tus datos nunca viajan por internet, salvo para la validación inicial de tu identidad."
    },
    {
        q: "¿Funciona sin internet?",
        a: "Sí. Puedes registrar gastos y ver tu historial offline. Solo necesitas conexión para el login inicial o para gestionar backups externos."
    },
    {
        q: "¿Reporte para contable?",
        a: "Usa la opción 'Descargar Golden Sheet (.xlsx)' en tu perfil para obtener un Excel profesional listo para enviar a tu gestoría."
    }
];

export default function HelpModal({ isOpen, onClose }) {
    const [activeIndex, setActiveIndex] = useState(null);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    className="w-full max-w-lg bg-matte-black border border-gold/20 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gold/5 flex flex-col max-h-[85vh]"
                >
                    {/* Header */}
                    <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gold/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                                <HelpCircle size={22} />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter">Centro de Ayuda</h3>
                                <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Protocolo de Soporte Elite</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Content (Accordion) */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {FAQ_ITEMS.map((item, idx) => (
                            <div
                                key={idx}
                                className={`border rounded-2xl transition-all duration-300 ${activeIndex === idx ? 'border-gold/30 bg-gold/5' : 'border-white/5 bg-white/5 hover:border-white/10'}`}
                            >
                                <button
                                    onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                    className="w-full p-5 flex items-center justify-between text-left"
                                >
                                    <span className="text-xs font-black text-white uppercase tracking-tight">{item.q}</span>
                                    <motion.div
                                        animate={{ rotate: activeIndex === idx ? 180 : 0 }}
                                        className="text-gold"
                                    >
                                        <ChevronDown size={18} />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {activeIndex === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-5 pb-5 text-[11px] text-white/50 leading-relaxed font-medium">
                                                {item.a}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>

                    {/* Footer */}
                    <div className="p-6 text-center border-t border-white/5 bg-black/40">
                        <p className="text-[10px] text-white/20 uppercase font-black tracking-widest">
                            Golden Wallet Elite V1 • Sistema de Soberanía Financiera
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
