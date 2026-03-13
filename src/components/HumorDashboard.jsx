import { HUMOR_PHRASES } from '../constants';
import { useState, useEffect } from 'react';

const HumorDashboard = ({ categoryExpenditures = {} }) => {
    const [phrase, setPhrase] = useState("");

    useEffect(() => {
        // Basic logic to pick a phrase category
        const pickPhrase = () => {
            if (categoryExpenditures.entretenimiento > 500) {
                return HUMOR_PHRASES.high_spending[Math.floor(Math.random() * HUMOR_PHRASES.high_spending.length)];
            } else if (categoryExpenditures.ahorro > 200) {
                return HUMOR_PHRASES.good_saving[Math.floor(Math.random() * HUMOR_PHRASES.good_saving.length)];
            } else {
                return HUMOR_PHRASES.motivation[Math.floor(Math.random() * HUMOR_PHRASES.motivation.length)];
            }
        };
        setPhrase(pickPhrase());
    }, [categoryExpenditures]);

    return (
        <div className="px-4 py-6">
            <h3 className="text-gold font-bold uppercase tracking-wider text-sm mb-3 px-1">Dashboard con Humor</h3>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-matte-black to-black border-l-4 border-gold italic text-white/90 shadow-inner">
                <p className="text-base leading-relaxed">
                    "{phrase}"
                </p>
            </div>
        </div>
    );
};

export default HumorDashboard;
