import { Coins, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

const BalanceCard = ({ balance = 0, budget = 0, availableBalance = 0, onSetBalance }) => {
    const isOverspent = availableBalance < 0;

    return (
        <div className="mx-4 space-y-4">
            <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={onSetBalance}
                className="p-6 rounded-2xl border-2 border-gold bg-matte-black shadow-lg shadow-gold/20 cursor-pointer group"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-semibold text-gold uppercase tracking-widest mb-1 opacity-80">Saldo Real / Presupuesto</p>
                        <h2 className="text-3xl font-bold text-white group-hover:text-gold transition-colors">
                            € {budget.toLocaleString('de-DE')}
                        </h2>
                    </div>
                    <div className="bg-gold/10 p-3 rounded-full border border-gold/30 group-hover:bg-gold transition-all group-hover:text-black">
                        <Wallet className="w-6 h-6 text-gold group-hover:text-black" />
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-6 rounded-2xl border-2 shadow-lg transition-colors ${isOverspent
                        ? 'border-red-600 bg-red-900/10 shadow-red-600/20'
                        : 'border-emerald-600 bg-emerald-900/10 shadow-emerald-600/20'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className={`text-[10px] font-semibold uppercase tracking-widest mb-1 ${isOverspent ? 'text-red-400' : 'text-emerald-400'
                            }`}>Presupuesto Disponible</p>
                        <h2 className="text-4xl font-bold text-white">
                            € {availableBalance.toLocaleString('de-DE')}
                        </h2>
                    </div>
                    <div className={`p-3 rounded-full border ${isOverspent
                            ? 'bg-red-500/10 border-red-500/30 text-red-500'
                            : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                        }`}>
                        <Coins className="w-8 h-8 animate-pulse" />
                    </div>
                </div>
                {isOverspent && (
                    <p className="text-[10px] text-red-400 mt-3 font-bold uppercase tracking-tighter">
                        ⚠️ Has superado tu límite mensual
                    </p>
                )}
            </motion.div>
        </div>
    );
};

export default BalanceCard;
