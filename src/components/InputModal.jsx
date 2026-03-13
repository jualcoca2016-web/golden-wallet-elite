import { useState, useRef, useEffect } from 'react';
import { RefreshCw, Send } from 'lucide-react';
import { AdminService } from '../services/AdminService';

/**
 * InputModal v6 — Mobile-First
 * Tipos: camera, gallery, text
 */
const InputModal = ({ type, onClose, onSubmit }) => {
    const [inputValue, setInputValue]     = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const textRef        = useRef(null);
    const cameraInputRef = useRef(null);

    // Focus automático en modo texto (setTimeout(0) = espera al siguiente frame del browser)
    useEffect(() => {
        if (type === 'text') {
            setTimeout(() => textRef.current?.focus(), 0);
        }
    }, [type]);

    // ─── IMAGEN (cámara + galería) ───────────────────────────────────────────

    const extractAmount = (text) => {
        const m = text.match(/total[^\d]*(\d{1,6}[.,]\d{2})/i);
        return m ? m[1].replace(',', '.') : '';
    };

    const handleImageFile = async (event) => {
        const file = event.target.files?.[0];
        if (!file) return;
        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result;
            try {
                // Subida a Drive y OCR en paralelo; si la subida falla no bloquea el registro
                const [uploadResult, ocrResult] = await Promise.all([
                    AdminService.uploadTicket(base64).catch(() => null),
                    (async () => {
                        const { createWorker } = await import('tesseract.js');
                        const worker = await createWorker('spa');
                        const { data } = await worker.recognize(base64);
                        const amount = extractAmount(data.text);
                        const rawText = data.text.replace(/\s+/g, ' ').trim();
                        await worker.terminate();
                        return { amount, rawText };
                    })()
                ]);
                const ticketUrl = uploadResult?.url || '';
                const { amount: ocrAmount, rawText } = ocrResult;
                // 'text' = texto OCR completo → usado internamente para detectar categoría
                // (contiene el nombre de la tienda: mercadona, carrefour, farmacia…)
                // 'descripcion' = texto limpio que se muestra al usuario
                const text = rawText || (ocrAmount ? `Gasto de ${ocrAmount}` : 'Nuevo Ticket');
                const descripcion = ocrAmount ? `Ticket ${ocrAmount}€` : 'Ticket (sin importe)';
                onSubmit({ text, descripcion, amount: ocrAmount ? parseFloat(ocrAmount) : null, ticketUrl });
                onClose();
            } catch (err) {
                alert('Error procesando imagen: ' + err.message);
            } finally {
                setIsProcessing(false);
            }
        };
        reader.readAsDataURL(file);
    };

    // ─── RENDER ──────────────────────────────────────────────────────────────
    // Fondo sin backdrop-blur: evita que iOS/Chrome mobile bloquee diálogos de permisos.
    // El modal sube desde abajo (sin motion en el wrapper para no crear nuevas capas).

    return (
        <div
            className="fixed inset-0 bg-black/85 flex items-end justify-center"
            style={{ zIndex: 999 }}
            onClick={onClose}
        >
            <div
                className="bg-[#1A1A1A] w-full max-w-sm rounded-t-3xl border-t border-gold/20 overflow-hidden relative"
                onClick={e => e.stopPropagation()}
            >
                {/* Overlay de procesamiento */}
                {isProcessing && (
                    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center" style={{ zIndex: 10 }}>
                        <RefreshCw className="text-gold animate-spin mb-4" size={40} />
                        <span className="text-gold font-bold animate-pulse text-xs uppercase tracking-widest">Analizando Ticket...</span>
                    </div>
                )}

                <div className="p-6 pb-10">

                    {/* ── CÁMARA ── */}
                    {type === 'camera' && (
                        <div className="flex flex-col items-center py-8 gap-6 text-center">
                            {/* Input nativo HTML5: abre la cámara del SO sin permisos JS */}
                            <input
                                ref={cameraInputRef}
                                id="cameraInput"
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={handleImageFile}
                                style={{ display: 'none' }}
                            />
                            <div className="text-6xl">📷</div>
                            <p className="text-white/50 text-xs">Pulsa el botón para abrir la cámara de tu dispositivo.</p>
                            <button
                                onClick={() => cameraInputRef.current?.click()}
                                className="w-full py-5 bg-gold rounded-2xl text-black font-black text-sm uppercase tracking-widest shadow-xl"
                            >
                                📷 TOMAR FOTO
                            </button>
                        </div>
                    )}

                    {/* ── GALERÍA ── */}
                    {type === 'gallery' && (
                        <div className="flex flex-col items-center py-8 gap-6 text-center">
                            <div className="text-6xl">🖼️</div>
                            <p className="text-white/50 text-xs">Selecciona un ticket desde tu galería de fotos.</p>
                            <label className="cursor-pointer w-full py-5 bg-gold/20 border border-gold/50 rounded-2xl text-gold font-black text-sm uppercase tracking-widest text-center block">
                                ELEGIR DE GALERÍA
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageFile}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}

                    {/* ── TEXTO ── */}
                    {type === 'text' && (
                        <div className="space-y-4">
                            <p className="text-gold/60 text-[10px] uppercase tracking-widest font-bold text-center">Describe tu gasto</p>
                            <textarea
                                ref={textRef}
                                autoFocus
                                placeholder="Ej: Comida en restaurante 25€"
                                className="w-full h-28 bg-black/40 border border-gold/20 rounded-2xl p-4 text-white placeholder:text-white/20 focus:border-gold outline-none resize-none text-sm"
                                style={{ zIndex: 999, position: 'relative', touchAction: 'auto' }}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onFocus={() => { /* foco ya gestionado */ }}
                            />
                            <button
                                onClick={() => {
                                    if (inputValue.trim()) { onSubmit(inputValue); onClose(); }
                                }}
                                disabled={!inputValue.trim()}
                                className="w-full bg-gold text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-40 text-sm uppercase tracking-widest"
                            >
                                REGISTRAR GASTO <Send size={16} />
                            </button>
                        </div>
                    )}

                    <button
                        onClick={onClose}
                        className="mt-5 w-full text-white/20 text-[10px] uppercase tracking-widest hover:text-white/40 transition-colors"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputModal;
