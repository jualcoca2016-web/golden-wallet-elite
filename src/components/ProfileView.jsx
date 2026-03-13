import { User, Mail, Phone, LogOut, ShieldCheck, Database, Trash2, Download, FileText, Archive, FileJson, Info } from 'lucide-react';
import { LocalVaultService } from '../services/LocalVaultService';
import { motion } from 'framer-motion';

const ProfileView = ({ user, onLogout, onResetCache }) => {

    const handleConfirmLogout = () => {
        if (window.confirm("¿Seguro que quieres cerrar tu Bóveda? Deberás ingresar tu móvil nuevamente para entrar.")) {
            onLogout();
        }
    };

    const handleFullBackup = async () => {
        try {
            await LocalVaultService.createFullBackup();
        } catch (e) {
            alert("Error al crear backup: " + e.message);
        }
    };

    const handleExcelExport = () => {
        const data = LocalVaultService.getData();
        LocalVaultService.exportToExcel(data.expenses);
    };

    const handleTicketsExport = async () => {
        try {
            await LocalVaultService.exportTicketsZip();
        } catch (e) {
            alert("Error al exportar tickets: " + e.message);
        }
    };

    return (
        <div className="px-6 py-6 space-y-8 pb-32">
            <header className="text-center">
                <div className="w-24 h-24 bg-gold/10 rounded-full border-2 border-gold flex items-center justify-center mx-auto mb-4 overflow-hidden relative group">
                    <User className="text-gold w-12 h-12" />
                    <div className="absolute inset-0 bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ShieldCheck className="text-gold" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">{user?.nombre || 'Miembro Elite'}</h2>
                <p className="text-gold-light text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">Status: Soberanía Local</p>
            </header>

            <div className="space-y-6">
                {/* INFORMACIÓN DE CUENTA */}
                <div className="bg-matte-black border border-gold/10 p-5 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-white/40">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Email Privado</p>
                            <p className="text-white font-medium">{user?.email || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-white/40">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Teléfono de Contacto</p>
                            <p className="text-white font-medium">{user?.telefono || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl text-white/40">
                            <Database size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Bóveda de Patrimonio</p>
                            <p className="text-gold font-black text-xs">LOCAL-FIRST SOVEREIGN</p>
                        </div>
                    </div>
                </div>

                {/* COPIA DE SEGURIDAD Y EXPORTACIÓN */}
                <div className="space-y-4">
                    <h3 className="text-gold-light text-[10px] font-black uppercase tracking-[0.3em] px-2 opacity-80">Seguridad y Exportación</h3>

                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleFullBackup}
                        className="w-full p-6 bg-gold text-black rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-between shadow-xl shadow-gold/10"
                    >
                        <div className="flex items-center gap-3">
                            <Archive size={20} />
                            <span>Generar Backup Consolidado (ZIP)</span>
                        </div>
                        <Download size={18} />
                    </motion.button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleExcelExport}
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
                        >
                            <FileText className="text-gold" size={20} />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Golden Sheet</span>
                        </button>
                        <button
                            onClick={handleTicketsExport}
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
                        >
                            <FileJson className="text-gold" size={20} />
                            <span className="text-[8px] font-black uppercase tracking-widest text-white/60">Bóveda Tickets</span>
                        </button>
                    </div>
                </div>

                {/* SESIÓN */}
                <div className="space-y-3 pt-2">
                    <button
                        onClick={onResetCache}
                        className="w-full p-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-bold uppercase tracking-widest text-[9px] flex items-center justify-center gap-3 hover:text-white transition-all uppercase"
                    >
                        <Trash2 size={14} /> Reiniciar Identidad Local
                    </button>
                </div>

                {/* PRIVACIDAD Y SOBERANÍA (LEGAL) */}
                <div className="pt-8 space-y-4">
                    <div className="flex items-center gap-2 px-2">
                        <Info size={14} className="text-gold/50" />
                        <h3 className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">Privacidad y Soberanía Golden Wallet Elite</h3>
                    </div>

                    <div className="bg-white/5 border border-white/5 p-6 rounded-[2rem] space-y-4 text-[9px] leading-relaxed text-white/50 font-medium uppercase tracking-tighter">
                        <section className="space-y-1">
                            <p className="text-gold/80 font-black">Almacenamiento Local:</p>
                            <p>Los datos de gastos, presupuestos y archivos multimedia se alojan bajo el protocolo Local-First (localStorage e IndexedDB) en el cliente.</p>
                        </section>

                        <section className="space-y-1">
                            <p className="text-gold/80 font-black">Cero Recolección:</p>
                            <p>La aplicación no transmite, vende ni analiza tu información financiera. Tus datos nunca abandonan este dispositivo.</p>
                        </section>

                        <section className="space-y-1">
                            <p className="text-gold/80 font-black">Protocolo de Respaldo:</p>
                            <p>Al no existir una base de datos centralizada (para garantizar tu privacidad), la responsabilidad de la custodia de los datos recae en el usuario. Se recomienda el uso semanal de la herramienta 'Backup Consolidado'.</p>
                        </section>

                        <section className="space-y-1">
                            <p className="text-gold/80 font-black">Seguridad Física:</p>
                            <p>La seguridad de tu Bóveda depende de la seguridad de tu terminal. Recomendamos mantener el sistema operativo actualizado y el acceso al dispositivo protegido.</p>
                        </section>

                        <section className="space-y-1">
                            <p className="text-red-500/80 font-black">Pérdida de Datos:</p>
                            <p>El borrado manual de la caché del navegador o la restauración de fábrica del dispositivo eliminará los datos locales si no existe una copia de seguridad previa.</p>
                        </section>
                    </div>
                </div>

                {/* BOTÓN CIERRE DE SESIÓN AL FINAL */}
                <div className="pt-4">
                    <button
                        onClick={handleConfirmLogout}
                        className="w-full p-5 bg-white/5 border border-white/5 text-white/20 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-red-500/5 hover:text-red-500/50 transition-all"
                    >
                        <LogOut size={16} /> Cerrar Sesión Privada
                    </button>
                </div>
            </div>

            <div className="text-center opacity-20">
                <p className="text-[10px] font-bold uppercase tracking-widest">Golden Wallet Elite v3.0</p>
                <p className="text-[8px] uppercase tracking-tighter mt-1">Soberanía Total y Absoluta</p>
            </div>
        </div>
    );
};

export default ProfileView;
