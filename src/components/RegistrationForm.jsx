import { useState } from 'react';
import { User, Mail, Phone, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * formatPhone - SANITIZACIÓN TOTAL DE NÚMEROS DE TELÉFONO
 * Elimina todo lo que no sea dígito y normaliza a 9 dígitos españoles
 * @param {string|number} phone - Número de teléfono en cualquier formato
 * @returns {string} - Número normalizado de 9 dígitos
 */
const formatPhone = (phone) => {
    // Elimina todo lo que no sea dígito (espacios, guiones, puntos, +, etc.)
    let p = String(phone).replace(/\D/g, '');

    // Si empieza por 34 (España) y tiene más de 9 dígitos, eliminar el prefijo
    if (p.startsWith('34') && p.length > 9) {
        p = p.substring(2);
    }

    // Retornar solo los primeros 9 dígitos (por si hay basura al final)
    return p.substring(0, 9);
};

const RegistrationForm = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        isVaultUser: true // Por defecto activada la Bóveda Privada
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);

        // SANITIZAR TELÉFONO ANTES DE ENVIAR
        const sanitizedData = {
            ...formData,
            telefono: formatPhone(formData.telefono)
        };

        // Llamada directa sin await para mantener la cadena de confianza del navegador
        onRegister(sanitizedData);
        // El estado se limpiará al desmontarse o tras el éxito
    };

    // MANEJADOR DE CAMBIO DE TELÉFONO CON VALIDACIÓN
    const handlePhoneChange = (e) => {
        const input = e.target.value;
        // Permitir solo números y limitar a 11 caracteres (para +34XXXXXXXXX)
        const filtered = input.replace(/\D/g, '').substring(0, 11);
        setFormData({ ...formData, telefono: filtered });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm mx-auto p-6"
        >
            <div className="bg-matte-black/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gold/20">
                        <User className="text-gold" size={32} />
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Registro Elite</h2>
                    <p className="text-gold/60 text-[10px] uppercase font-bold tracking-widest mt-2">Crea tu acceso a la Bóveda</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-white/40 tracking-widest ml-1">Nombre Completo</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                                <User size={18} />
                            </span>
                            <input
                                required
                                type="text"
                                placeholder="Ej: Juan Coca"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-gold/50 focus:bg-gold/5 transition-all"
                                value={formData.nombre}
                                onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-white/40 tracking-widest ml-1">Correo (Opcional)</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                                <Mail size={18} />
                            </span>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-gold/50 focus:bg-gold/5 transition-all"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black text-white/40 tracking-widest ml-1">Teléfono Móvil</label>
                        <div className="relative group">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors">
                                <Phone size={18} />
                            </span>
                            <input
                                required
                                type="tel"
                                inputMode="numeric"
                                placeholder="Ej: 600000000"
                                maxLength="11"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-gold/50 focus:bg-gold/5 transition-all"
                                value={formData.telefono}
                                onChange={handlePhoneChange}
                            />
                            {formData.telefono && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gold/60 font-mono">
                                    {formData.telefono.length}/11
                                </span>
                            )}
                        </div>
                        <p className="text-[9px] text-white/40 ml-1">
                            Solo números. Máximo 11 dígitos (ej: 34600000000)
                        </p>
                    </div>

                    <div
                        className="flex items-start gap-3 bg-gold/5 p-4 rounded-2xl border border-gold/10 mt-6 group hover:border-gold/30 transition-all cursor-pointer"
                        onClick={() => setFormData({ ...formData, isVaultUser: !formData.isVaultUser })}
                    >
                        <div className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.isVaultUser ? 'bg-gold border-gold' : 'border-white/20'}`}>
                            {formData.isVaultUser && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-white uppercase tracking-tight">Activar Bóveda Soberana</p>
                            <p className="text-[9px] text-white/40 leading-tight mt-1">
                                Acepto que la App cree y gestione mis datos exclusivamente en el almacenamiento local cifrado de este dispositivo.
                            </p>
                        </div>
                    </div>

                    {/* 🛡️ BLOQUE DE SEGURIDAD ELITE */}
                    <div className="mt-8 p-5 bg-black/40 border border-gold/20 rounded-2xl space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gold/10 rounded-lg">
                                <span className="text-lg">🛡️</span>
                            </div>
                            <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Bóveda 100% Local</h4>
                        </div>

                        <p className="text-[9px] text-white/50 leading-relaxed font-bold uppercase tracking-tight">
                            Tus datos financieros <span className="text-gold">NUNCA</span> abandonan este dispositivo. No hay servidores externos ni nubes de terceros.
                        </p>

                        <div className="grid grid-cols-1 gap-2 border-t border-white/5 pt-3">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gold rounded-full" />
                                <p className="text-[8px] text-white/70 uppercase font-bold tracking-widest">Soberanía: <span className="text-white">Los datos son físicamente tuyos.</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gold rounded-full" />
                                <p className="text-[8px] text-white/70 uppercase font-bold tracking-widest">Privacidad: <span className="text-white">Nadie externo puede ver tus gastos ni tus fotos.</span></p>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-gold rounded-full" />
                                <p className="text-[8px] text-white/70 uppercase font-bold tracking-widest">Seguridad: <span className="text-white">Eres el único custodio de tu información.</span></p>
                            </div>
                        </div>

                        <p className="text-[8px] text-gold/60 leading-tight italic mt-2">
                            Acuérdate de usar el botón de 'Backup' en tu perfil para asegurar tu patrimonio si cambias de dispositivo.
                        </p>
                    </div>

                    <motion.button
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        type="submit"
                        disabled={isLoading}
                        className={`w-full font-black py-5 rounded-2xl shadow-xl mt-6 flex items-center justify-center gap-3 transition-all ${isLoading ? 'bg-gold/20 text-white/20 cursor-not-allowed' : 'bg-gold text-black shadow-gold/10'}`}
                    >
                        {isLoading ? (
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                        ) : (
                            <>
                                <span className="uppercase tracking-widest text-xs">Registrar Acceso Elite</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </motion.button>
                </form>

                <p className="text-center text-[10px] text-white/40 uppercase tracking-[0.2em] mt-8 font-black">
                    Golden Wallet Elite • Privacy Secured
                </p>
            </div>
        </motion.div>
    );
};

export default RegistrationForm;
