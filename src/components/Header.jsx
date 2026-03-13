import { motion } from 'framer-motion';

const Header = ({ dateTime }) => {
    return (
        <header className="flex flex-col items-center justify-center pt-8 pb-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="w-40 h-40 relative flex items-center justify-center"
            >
                <img src="/Aguila.jfif" alt="Aguila Elite Logo" className="w-full h-full object-contain mb-2" />
            </motion.div>
            <div className="mt-2 text-center px-4">
                <h1 className="text-xl font-bold tracking-tight text-white uppercase">Golden Wallet Elite</h1>
                <p className="text-[10px] text-gold-light mt-1 opacity-60 uppercase tracking-[0.3em]">Híbrido de Élite Privado</p>
                {dateTime && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[10px] text-white/40 mt-4 font-medium"
                    >
                        {dateTime}
                    </motion.p>
                )}
            </div>
        </header>
    );
};

export default Header;
