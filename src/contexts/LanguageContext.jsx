import { createContext, useContext, useState, useEffect } from 'react';
import { translations, supportedLanguages } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState(() => {
        // Cargar idioma guardado o detectar del navegador
        const saved = localStorage.getItem('goldenWallet_language');
        if (saved && translations[saved]) return saved;

        // Detectar idioma del navegador
        const browserLang = navigator.language.split('-')[0];
        return translations[browserLang] ? browserLang : 'es';
    });

    useEffect(() => {
        // Guardar idioma en localStorage
        localStorage.setItem('goldenWallet_language', language);
    }, [language]);

    const t = (key) => {
        return translations[language]?.[key] || key;
    };

    const changeLanguage = (newLang) => {
        if (translations[newLang]) {
            setLanguage(newLang);
        }
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage, t, supportedLanguages }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
