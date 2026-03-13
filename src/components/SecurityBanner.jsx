import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const SecurityBanner = () => {
    const { t } = useLanguage();
    const [show, setShow] = useState(false);

    useEffect(() => {
        const isHTTP = window.location.protocol === 'http:';
        const isIPAccess = /^\d+\.\d+\.\d+\.\d+/.test(window.location.hostname);
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

        if (isHTTP && isIPAccess && !isLocalhost) {
            setShow(true);
            // Auto-cerrar a los 6 segundos para no bloquear permisos móvil
            const timer = setTimeout(() => setShow(false), 6000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!show) return null;

    // Sin backdrop-blur, sin fixed, sin z-index alto: aviso pasivo en flujo normal
    return (
        <div className="w-full bg-orange-500/80 border-b border-orange-400/40 px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
                <AlertTriangle className="text-white shrink-0" size={16} />
                <span className="text-white text-[10px] font-bold uppercase leading-tight truncate">
                    {t('securityWarning')}: {t('httpWarning')}
                </span>
            </div>
            <button
                onClick={() => setShow(false)}
                className="text-white/80 hover:text-white shrink-0 p-1"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default SecurityBanner;
