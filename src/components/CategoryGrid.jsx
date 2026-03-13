import * as Icons from 'lucide-react';
import { Home, Zap, Truck, ShoppingBag, Eye, EyeOff, PiggyBank, PartyPopper, Crown } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const CategoryGrid = ({ expenditures = {}, onCategoryClick }) => {
    const [showHucha, setShowHucha] = useState(false);

    const categories = [
        { id: 'vivienda', name: 'Vivienda', icon: <Home size={20} />, amount: expenditures.vivienda || 0 },
        { id: 'suministros', name: 'Suministros', icon: <Zap size={20} />, amount: expenditures.suministros || 0 },
        { id: 'comida', name: 'Comida', icon: <ShoppingBag size={20} />, amount: expenditures.comida || 0 },
        { id: 'transporte', name: 'Transporte', icon: <Truck size={20} />, amount: expenditures.transporte || 0 },
        { id: 'salud', name: 'Salud', icon: <Icons.Activity size={20} />, amount: expenditures.salud || 0 },
        { id: 'entretenimiento', name: 'Entretenimiento', icon: <PartyPopper size={20} />, amount: expenditures.entretenimiento || 0 },
        { id: 'otros', name: 'Otros', icon: <Icons.MoreHorizontal size={20} />, amount: expenditures.otros || 0 }
    ];

    return (
        <div className="px-4 py-4 space-y-4">
            <h3 className="text-gold font-bold uppercase tracking-wider text-sm px-1 flex items-center gap-2">
                <Icons.LayoutGrid size={16} /> Categorías Maestras
            </h3>

            <div className="grid grid-cols-2 gap-3">
                {categories.map((cat) => (
                    <motion.div
                        key={cat.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onCategoryClick?.(cat.name)}
                        className="p-3 rounded-2xl bg-matte-black border border-gold/20 flex flex-col gap-2 group hover:border-gold/50 transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-2 opacity-5 text-gold group-hover:opacity-10 transition-opacity">
                            {cat.icon}
                        </div>
                        <div className="p-2 w-fit rounded-lg bg-gold/5 text-gold group-hover:bg-gold group-hover:text-black transition-all">
                            {cat.icon}
                        </div>
                        <div>
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{cat.name}</p>
                            <p className="text-lg font-black text-white group-hover:text-gold transition-colors italic tracking-tighter">€ {cat.amount.toFixed(2)}</p>
                        </div>
                    </motion.div>
                ))}

                {/* Hucha Oculta (Ahorro) */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCategoryClick?.('Ahorro')}
                    className="p-3 rounded-2xl bg-gold/10 border border-gold/40 flex flex-col gap-2 col-span-2 relative overflow-hidden group cursor-pointer"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-gold text-black shadow-lg shadow-gold/20">
                                <PiggyBank size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gold font-black uppercase tracking-widest">Bóveda de Ahorro (Elite)</p>
                                <p className="text-xl font-black text-white italic tracking-tighter">
                                    {showHucha ? `€ ${(expenditures.ahorro || 0).toFixed(2)}` : '••••••'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowHucha(!showHucha)}
                            className="p-3 rounded-xl bg-black/40 text-gold hover:bg-gold hover:text-black transition-all"
                        >
                            {showHucha ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default CategoryGrid;
