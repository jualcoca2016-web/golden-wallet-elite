import { Camera, Keyboard, Image } from 'lucide-react';
import { motion } from 'framer-motion';

const ActionButtons = ({ onAction }) => {
    const buttons = [
        { id: 'camera',  icon: Camera,   label: 'Cámara',  color: 'blue' },
        { id: 'text',    icon: Keyboard, label: 'Texto',   color: 'blue' },
        { id: 'gallery', icon: Image,    label: 'Galería', color: 'gold' },
    ];

    return (
        <div className="flex justify-center items-center gap-8 py-6">
            {buttons.map((btn) => (
                <motion.button
                    key={btn.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onAction?.(btn.id)}
                    className="flex flex-col items-center gap-2 group"
                >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white/20 transition-colors ${btn.color === 'gold'
                            ? 'bg-gold/20 shadow-gold/40 group-hover:bg-gold/30'
                            : 'bg-blue-600 shadow-blue-500/40 group-hover:bg-blue-500'
                        }`}>
                        <btn.icon className={`w-8 h-8 ${btn.color === 'gold' ? 'text-gold' : 'text-white'}`} />
                    </div>
                    <span className="text-xs font-semibold text-white/70 group-hover:text-gold transition-colors uppercase tracking-widest">
                        {btn.label}
                    </span>
                </motion.button>
            ))}
        </div>
    );
};

export default ActionButtons;
