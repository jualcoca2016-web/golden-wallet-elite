import { useLanguage } from '../contexts/LanguageContext';
import { motion } from 'framer-motion';

const LanguageSelector = () => {
    const { language, changeLanguage, supportedLanguages } = useLanguage();

    return (
        <div className="flex items-center gap-2">
            {supportedLanguages.map((lang) => (
                <motion.button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                        w-10 h-10 rounded-xl flex items-center justify-center text-2xl
                        transition-all duration-200
                        ${language === lang.code
                            ? 'bg-gold/20 border-2 border-gold shadow-lg shadow-gold/30'
                            : 'bg-white/5 border border-white/10 hover:border-gold/50'
                        }
                    `}
                    title={lang.name}
                >
                    {lang.flag}
                </motion.button>
            ))}
        </div>
    );
};

export default LanguageSelector;
