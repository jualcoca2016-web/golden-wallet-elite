import { motion } from 'framer-motion';
import { ShoppingBag, Truck, Home, Zap, Heart, Coffee, PiggyBank, X, Trash2, ExternalLink } from 'lucide-react';

const categoryIcons = {
    vivienda: <Home size={16} />,
    suministros: <Zap size={16} />,
    hogar: <Zap size={16} />, // Fallback icon
    oficina: <Zap size={16} />,
    transporte: <Truck size={16} />,
    entretenimiento: <Zap size={16} />,
    ahorro: <PiggyBank size={16} />,
    comida: <ShoppingBag size={16} />
};

const ExpenseTable = ({ category, expenses, onClose, onDelete }) => {
    const filteredExpenses = (expenses || []).filter(e =>
        e && e.categoria && e.categoria.trim().toLowerCase() === category.trim().toLowerCase()
    );

    const handleDelete = (exp) => {
        if (window.confirm('¿Deseas eliminar este registro de la Élite?')) {
            onDelete(exp);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-6 p-6 bg-matte-black border border-gold/20 rounded-3xl"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <span className="p-2 bg-gold/10 text-gold rounded-lg">
                        {categoryIcons[category.toLowerCase()] || <Zap size={16} />}
                    </span>
                    Listado: {category}
                </h3>
                <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-[10px] text-gold/40 uppercase tracking-[0.2em] font-bold border-b border-gold/10">
                        <tr>
                            <th className="pb-3 pr-4">Fecha</th>
                            <th className="pb-3 pr-4">Descripción</th>
                            <th className="pb-3 text-right">Monto</th>
                            <th className="pb-3 text-right w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {filteredExpenses.length > 0 ? (
                            filteredExpenses.map((expense, idx) => (
                                <tr key={idx} className="border-b border-gold/5 group">
                                    <td className="py-4 pr-4 text-white/40">
                                        {new Date(expense.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                                    </td>
                                    <td className="py-4 pr-4 text-white font-medium group-hover:text-gold transition-colors">
                                        {expense.descripcion || "Sin descripción"}
                                        {expense.ticketUrl && (
                                            <a
                                                href={expense.ticketUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="flex items-center gap-1 text-gold/60 text-[9px] uppercase font-black tracking-widest hover:text-gold transition-colors mt-1"
                                            >
                                                <ExternalLink size={8} />
                                                Ver ticket
                                            </a>
                                        )}
                                    </td>
                                    <td className="py-4 text-right font-bold text-white">
                                        {Number(expense.monto || 0) > 0 ? expense.monto : expense.ahorro} €
                                    </td>
                                    <td className="py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(expense)}
                                            className="p-2 text-white/10 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-8 text-center text-white/20 italic">
                                    No hay gastos registrados en esta categoría
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default ExpenseTable;
