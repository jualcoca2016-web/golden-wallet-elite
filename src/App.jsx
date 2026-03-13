import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Phone, UserPlus, ShieldCheck } from 'lucide-react';
import { LocalVaultService } from './services/LocalVaultService';
import { SOUL_PHRASES } from './constants';

// i18n
import { LanguageProvider } from './contexts/LanguageContext';

// Componentes
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import CategoryGrid from './components/CategoryGrid';
import ActionButtons from './components/ActionButtons';
import HumorDashboard from './components/HumorDashboard';
import BottomNav from './components/BottomNav';
import RegistrationForm from './components/RegistrationForm';
import InputModal from './components/InputModal';
import SummarySidebar from './components/SummarySidebar';
import ExpenseTable from './components/ExpenseTable';
import BalanceModal from './components/BalanceModal';
import CalculatorModal from './components/CalculatorModal';
import HistoryView from './components/HistoryView';
import ProfileView from './components/ProfileView';
import OnboardingModal from './components/OnboardingModal';
import HelpModal from './components/HelpModal';
import SecurityBanner from './components/SecurityBanner';
import { AdminService } from './services/AdminService';
import { HelpCircle } from 'lucide-react';

function App() {
  // 1. TODOS LOS HOOKS AL PRINCIPIO (ESTRICTO)
  const [authStatus, setAuthStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginError, setLoginError] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [dateTime, setDateTime] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [currentView, setCurrentView] = useState('inicio');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allExpenses, setAllExpenses] = useState([]);
  const [balance] = useState(2500);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(null); // null=verificando, true, false
  const [authMessage, setAuthMessage] = useState('');
  const [soulPhrase, setSoulPhrase] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [monthlyTotals, setMonthlyTotals] = useState({});
  const [budget, setBudget] = useState(0);


  // 2. DIAGNÓSTICO INICIAL
  useEffect(() => {
    console.log("💎 GOLDEN WALLET: App Montada");
    // Elegir frase del alma aleatoria al montar
    const randomIdx = Math.floor(Math.random() * SOUL_PHRASES.length);
    setSoulPhrase(SOUL_PHRASES[randomIdx]);
  }, []);

  // 3. LÓGICA DE RELOJ
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        const dateStr = now.toLocaleDateString('es-ES', options);
        const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
        const formatted = `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} | ${timeStr}`;
        setDateTime(formatted);
      } catch (e) {
        console.error("Error en reloj:", e);
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // 4. PERSISTENCIA Y CARGA INICIAL (LOCAL-FIRST)
  useEffect(() => {
    // Verificar si ya vio el onboarding
    const onboardingSeen = localStorage.getItem('gw_onboarding_accepted');
    if (!onboardingSeen) {
      setShowOnboarding(true);
    }

    const savedUser = LocalVaultService.getUser();
    console.log("🔐 PERSISTENCIA: Buscando usuario...", savedUser ? "Encontrado" : "No hay");

    if (savedUser) {
      setUser(savedUser);
      setAuthStatus('authenticated');
      // VALIDACIÓN CENTRALIZADA (Puerta de Enlace por Móvil)
      verifyCentralAccess(savedUser.telefono);
      fetchData(year);
      fetchBudget(year);
    } else {
      setAuthStatus('welcome');
      setIsAuthorized(true); // Permitir ver pantalla de registro
    }
  }, [year]);

  const verifyCentralAccess = async (telefono) => {
    try {
      const resp = await AdminService.verifyAccess(telefono);

      // Solo bloqueamos si GAS devuelve authorized === false de forma EXPLÍCITA.
      // Errores de red, CORS, timeout → acceso local permitido (no bloqueante).
      if (resp.authorized === false) {
        console.warn("⛔ ACCESO EXPLÍCITAMENTE DENEGADO POR GAS.");
        setIsAuthorized(false);
        setAuthMessage(resp.message || "Acceso restringido. Contacta con el administrador.");
      } else {
        setIsAuthorized(true);
      }
    } catch (e) {
      console.error("Fallo de validación central (modo local activo):", e);
      setIsAuthorized(true); // Si GAS falla, operamos en modo local-first
    }
  };

  const handleAcceptOnboarding = () => {
    localStorage.setItem('gw_onboarding_accepted', 'true');
    setShowOnboarding(false);
  };

  // 4b. Backup reminder eliminado del startup para no bloquear el hilo principal en móvil

  // 5. FUNCIONES DE DATOS Y LÓGICA (DEFINICIONES ANTES DEL RENDER)

  const fetchData = (selectedYear) => {
    const result = LocalVaultService.getData();
    if (result && result.expenses) {
      // Filtramos por año localmente
      const filtered = result.expenses.filter(e => e.año === selectedYear || new Date(e.fecha).getFullYear() === selectedYear);
      setAllExpenses(filtered);
      calculateMonthlyTotals(result.expenses);
    }
  };

  const fetchBudget = (selectedYear) => {
    const currentMonthNum = new Date().getMonth() + 1;
    const result = LocalVaultService.getData();
    if (result && result.budgets) {
      const b = result.budgets.find(b => b.mes === currentMonthNum && b.año === selectedYear);
      setBudget(b ? b.presupuesto : 0);
    }
  };

  const calculateMonthlyTotals = (expenses) => {
    if (!Array.isArray(expenses)) return;
    const totals = {};
    expenses.forEach(e => {
      if (e && e.mes) {
        if (!totals[e.mes]) totals[e.mes] = { spending: 0, savings: 0 };
        // Sumamos Monto (Gasto) y Ahorro (Bóveda) desde sus columnas físicas
        totals[e.mes].spending += Number(e.monto || 0);
        totals[e.mes].savings += Number(e.ahorro || 0);
      }
    });
    setMonthlyTotals(totals);
  };

  // 6. CÁLCULOS DERIVADOS (CON GUARDAS)
  const currentMonth = new Date().getMonth() + 1;
  const currentMonthData = monthlyTotals?.[currentMonth] || { spending: 0, savings: 0 };
  const currentMonthSpending = currentMonthData.spending;
  const safeBudget = Number(budget || 0);

  // AISLAMIENTO ELITE: El presupuesto disponible solo se reduce por el consumo real (spending)
  const availableBudget = safeBudget - currentMonthSpending;

  const expenditures = {
    vivienda: (allExpenses || []).filter(e => e?.categoria === 'Vivienda').reduce((acc, e) => acc + Number(e?.monto || 0), 0),
    suministros: (allExpenses || []).filter(e => e?.categoria === 'Suministros').reduce((acc, e) => acc + Number(e?.monto || 0), 0),
    comida: (allExpenses || []).filter(e => e?.categoria === 'Comida').reduce((acc, e) => acc + Number(e?.monto || 0), 0),
    transporte: (allExpenses || []).filter(e => e?.categoria === 'Transporte').reduce((acc, e) => acc + Number(e?.monto || 0), 0),
    salud: (allExpenses || []).filter(e => e?.categoria === 'Salud').reduce((acc, e) => acc + Number(e?.monto || 0), 0),
    entretenimiento: (allExpenses || []).filter(e => e?.categoria === 'Entretenimiento').reduce((acc, e) => acc + Number(e?.monto || 0), 0),
    otros: (allExpenses || []).filter(e => e?.categoria === 'Otros').reduce((acc, e) => acc + Number(e?.monto || 0), 0),
    // El ahorro se lee directamente de su columna dedicada (acumulado histórico)
    ahorro: (allExpenses || []).reduce((acc, e) => acc + Number(e?.ahorro || 0), 0)
  };

  const totalAnnualExpenses = Object.values(monthlyTotals).reduce((acc, data) => acc + (data.spending || 0), 0);

  // 7. MANEJADORES DE EVENTOS Y ACCIONES


  const handleLogin = async () => {
    if (!loginPhone) return;
    setAuthStatus('loading');
    setLoginError('');

    console.log("🔐 LOGIN: Verificando móvil en base central...", loginPhone);

    try {
      const resp = await AdminService.loginUser(loginPhone);

      // VALIDACIÓN ROBUSTA (V3): Aceptamos 'authorized' O 'active' como llave maestra
      if ((resp.success || resp.status === 'success') && (resp.authorized || resp.active)) {
        // ÉXITO: Restauramos sesión local con datos del servidor
        LocalVaultService.saveUser(resp.user);

        // 1. FORZAMOS BANDERA DE SESIÓN (SOLICITUD CRÍTICA)
        localStorage.setItem('user_logged', 'true');

        setUser(resp.user);
        setAuthStatus('authenticated');
        setIsAuthorized(true);
        fetchData(year);
        fetchBudget(year);
        console.log("✅ LOGIN EXITOSO: Bienvenido de nuevo", resp.user.nombre);
      } else {
        setLoginError(resp.message || "Tu móvil no está autorizado o no existe.");
        setAuthStatus('login');
      }
    } catch (e) {
      console.error("Fallo de conexión en login:", e);
      setLoginError("Error de conexión con el servidor central.");
      setAuthStatus('login');
    }
  };

  const handleRegister = async (formData) => {
    setAuthStatus('loading');
    console.log("📝 REGISTRO: Enviando a Master Sheet...", formData);
    try {
      const resp = await AdminService.registerUser(formData);

      console.log("🔍 APP DEBUG - RESPUESTA REGISTRO:", JSON.stringify(resp));

      // VALIDACIÓN ESTRICTA DE ÉXITO (COMO SOLICITÓ EL USUARIO)
      if (resp.success || resp.status === 'success') {
        console.log("✅ REGISTRO CONFIRMADO: Acceso Concedido.");

        // 1. FORZAMOS SESIÓN PERSISTENTE
        localStorage.setItem('user_logged', 'true'); // Señal de bandera para futuros arranques

        // En este flujo híbrido, el registro es una solicitud.
        // Guardamos localmente para identificar al usuario, pero quedamos pendientes de autorización.
        const newUser = {
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          dbId: '',
          folderId: ''
        };
        LocalVaultService.saveUser(newUser);
        setUser(newUser);
        setAuthStatus('success');
        setIsAuthorized(true); // Puerta abierta para lanzamiento inicial
      } else {
        alert(resp.message || "Error al registrar en la base central.");
        // LIMPIEZA DE SEGURIDAD:
        LocalVaultService.logout();
        setUser(null);
        setAuthStatus('register');
      }
    } catch (e) {
      alert("Error de conexión con el servidor central.");
      LocalVaultService.logout();
      setUser(null);
      setAuthStatus('register');
    }
  };

  const handleLogout = () => {
    LocalVaultService.logout();
    setUser(null);
    setAuthStatus('welcome');
  };

  const handleInputSubmit = async (input) => {
    // CORRECCIÓN LOCAL-FIRST: No requerimos dbId para operar en local
    if (!user || !input) return;

    // Acepta tanto string (texto/voz) como objeto {text, descripcion?, amount?, ticketUrl} (cámara/galería)
    const text = typeof input === 'object' ? input.text : input;
    const ticketUrl = typeof input === 'object' ? (input.ticketUrl || '') : '';
    const presetAmount = typeof input === 'object' && input.amount != null ? input.amount : null;
    const isFromTicket = typeof input === 'object' && input.amount != null; // viene del OCR de cámara/galería
    // descripcion: texto limpio para mostrar al usuario; en tickets evita guardar el OCR crudo
    const descripcionFinal = typeof input === 'object' && input.descripcion ? input.descripcion : text;

    console.log(`🦅 INPUT-ENGINE: Procesando texto: "${text}"`);

    // 1. Motor de Conversión: Palabras a Números (Español - Cerebro Aritmético Expandido)
    const wordNumbers = {
      'cero': 0, 'un': 1, 'uno': 1, 'una': 1, 'dos': 2, 'tres': 3, 'cuatro': 4, 'cinco': 5, 'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9, 'diez': 10,
      'once': 11, 'doce': 12, 'trece': 13, 'catorce': 14, 'quince': 15, 'diez y seis': 16, 'dieciséis': 16, 'diecisiete': 17, 'dieciocho': 18, 'diecinueve': 19,
      'veinte': 20, 'veintiuno': 21, 'veintidós': 22, 'veintitrés': 23, 'veinticuatro': 24, 'veinticinco': 25, 'treinta': 30, 'cuarenta': 40, 'cincuenta': 50,
      'sesenta': 60, 'setenta': 70, 'ochenta': 80, 'noventa': 90, 'cien': 100, 'ciento': 100,
      'doscientos': 200, 'trescientos': 300, 'cuatrocientos': 400, 'quinientos': 500, 'seiscientos': 600, 'setecientos': 700, 'ochocientos': 800, 'novecientos': 900, 'mil': 1000,
      'con': 0 // Se ignora 'con' en la suma para permitir 'doscientos con cincuenta'
    };

    let processedText = text.toLowerCase().replace(/[.,]/g, ' '); // Limpieza para facilitar el split

    // Si viene monto pre-extraído del OCR (más preciso que buscar el primer dígito), usarlo directamente
    let amount = 0;
    if (presetAmount !== null) {
      amount = presetAmount;
    } else {
      // Búsqueda de dígitos primero
      const digitMatch = text.replace(',', '.').match(/(\d+(\.\d+)?)/);
      if (digitMatch) {
        amount = parseFloat(digitMatch[0]);
      } else {
        // Búsqueda ARITMÉTICA por frase completa
        const words = processedText.split(/\s+/);
        words.forEach(word => {
          if (wordNumbers[word] !== undefined) {
            amount += wordNumbers[word];
          }
        });
      }
    }

    console.log(`🦅 ADMIN-SERVICE: Monto detectado: ${amount}`);

    // 2. Mapeo de Intenciones y CONTROL DE CALIDAD ELITE (Anti-Clutter)
    let matchedCategories = [];
    const lowerText = processedText;

    const intentMap = {
      'Ahorro': [
        'ahorro', 'ahorrar', 'guardar', 'apartar', 'separar', 'reserva', 'hucha', 'bote', 'futuro', 'inversión', 'invertir', 'bolsa', 'crypto', 'bitcoin', 'ethereum', 'depósito', 'plazo', 'fondo', 'plan', 'pensiones', 'colchón'
      ],
      'Comida': [
        'comida', 'comer', 'almuerzo', 'almorzar', 'cena', 'cenar', 'desayuno', 'desayunar', 'merienda', 'merendar', 'restaurante', 'restaurant', 'bar', 'café', 'cafe', 'tapa', 'tapas', 'caña', 'cañas', 'copa', 'copas', 'super', 'supermercado', 'mercadona', 'carrefour', 'lidl', 'dia', 'aldi', 'consum', 'eroski', 'alcampo', 'hipercor', 'corte inglés', 'glovo', 'uber eats', 'just eat', 'delivery', 'chino', 'sushi', 'pizza', 'burger', 'mcdonalds', 'kfc', 'vips', 'fosters', 'ginos', 'telepizza', 'dominos', 'starbucks', 'pan', 'fruta', 'verdura', 'carne', 'pescado', 'compra', 'hamburguesa'
      ],
      'Transporte': [
        'transporte', 'coche', 'moto', 'gasolina', 'diesel', 'gasoil', 'combustible', 'llenar', 'tanque', 'repsol', 'cepsa', 'bp', 'galp', 'shell', 'parking', 'aparcamiento', 'zona azul', 'zona verde', 'peaje', 'autopista', 'taller', 'revisión', 'itv', 'aceite', 'ruedas', 'neumáticos', 'lavado', 'taxi', 'uber', 'cabify', 'bolt', 'freenow', 'bus', 'autobús', 'metro', 'tren', 'cercanías', 'ave', 'renfe', 'avión', 'vuelo', 'billete', 'viaje', 'abono', 'gasolinera', 'gasofa'
      ],
      'Suministros': [
        'suministros', 'luz', 'electricidad', 'recibo', 'factura', 'iberdrola', 'endesa', 'naturgy', 'holaluz', 'agua', 'canal', 'emasesa', 'gas', 'butano', 'internet', 'fibra', 'wifi', 'móvil', 'movil', 'teléfono', 'telefono', 'saldo', 'recarga', 'movistar', 'vodafone', 'orange', 'yoigo', 'jazztel', 'digi', 'simyo', 'pepephone', 'banco', 'comisión', 'intereses', 'seguro', 'netflix', 'hbo', 'disney', 'prime', 'spotify', 'youtube', 'icloud', 'drive', 'suscripción', 'amazon'
      ],
      'Vivienda': [
        'vivienda', 'alquiler', 'renta', 'hipoteca', 'casa', 'piso', 'hogar', 'comunidad', 'ibi', 'basura', 'seguro hogar', 'alarma', 'securitas', 'prosegur', 'limpieza', 'empleada', 'chacha', 'mueble', 'muebles', 'ikea', 'leroy', 'conforama', 'decoración', 'plantas', 'jardín', 'piscina', 'obra', 'reforma', 'pintura', 'fontanero', 'electricista', 'cerrajero', 'reparación', 'bricolaje'
      ],
      'Entretenimiento': [
        'entretenimiento', 'cine', 'película', 'entrada', 'teatro', 'concierto', 'festival', 'museo', 'exposición', 'libro', 'revista', 'cómic', 'manga', 'kindle', 'audible', 'juego', 'videojuego', 'steam', 'playstation', 'xbox', 'nintendo', 'switch', 'ps5', 'ps4', 'fifa', 'fortnite', 'riot', 'twitch', 'patreon', 'onlyfans', 'hobby', 'gimnasio', 'gym', 'crossfit', 'yoga', 'pilates', 'clases', 'curso', 'taller', 'fiesta', 'salir', 'disco', 'discoteca', 'entrada', 'ocio', 'deporte', 'evento', 'baile'
      ],
      'Salud': [
        'salud', 'médico', 'medico', 'doctor', 'cita', 'consulta', 'hospital', 'urgencias', 'privado', 'sanitas', 'adeslas', 'asisa', 'mapfre', 'farmacia', 'botica', 'medicamento', 'pastillas', 'jarabe', 'crema', 'vendas', 'tiritas', 'dentista', 'dientes', 'empaste', 'limpieza bucal', 'ortodoncia', 'fisioterapeuta', 'fisio', 'masaje', 'psicólogo', 'terapia', 'óptica', 'optica', 'gafas', 'lentillas', 'auditivo', 'veterinario', 'perro', 'gato', 'mascota', 'pienso', 'remedio', 'tratamiento'
      ]
    };

    // 1. PRIORIDAD ABSOLUTA: Verificar Nombres de Categoría Maestras
    // Si el usuario dice "Gasto en Suministros", DEBE ir a Suministros.
    const masterCategories = Object.keys(intentMap);
    let priorityMatch = null;

    for (const catName of masterCategories) {
      if (lowerText.includes(catName.toLowerCase())) {
        priorityMatch = catName;
        break;
      }
    }

    if (priorityMatch) {
      matchedCategories.push(priorityMatch);
    } else {
      // 2. Si no hay match directo, procedemos con Auditoría de Intenciones (Sinónimos)
      for (const [category, keywords] of Object.entries(intentMap)) {
        if (keywords.some(kw => {
          // Buscamos palabra completa para evitar falsos positivos parciales
          const regex = new RegExp('\\b' + kw + '\\b', 'i');
          return regex.test(lowerText);
        })) {
          matchedCategories.push(category);
        }
      }
    }

    // 🛡️ REGLAS DE DISCIPLINA ELITE: Bloqueo de Multitarea
    // Los tickets OCR omiten esta validación: un ticket puede contener múltiples
    // palabras de distintas categorías (pan, agua, jabón...) y es un único gasto válido.
    const hasMultipleIntents = matchedCategories.length > 1;
    const hasConjunctionY = /\by\b/.test(lowerText) && (amount > 0);

    if (!isFromTicket && (hasMultipleIntents || hasConjunctionY)) {
      alert(
        "¡Epa, frena los caballos, inversionista! 🦅🛑\n\n" +
        "Tu Bóveda es de alta precisión y no le gusta el desorden. Para mantener tu patrimonio impecable y evitar errores de contabilidad, registra cada gasto por separado.\n\n" +
        "Un mensaje para la comida, otro para los suministros. ¡Tu disciplina es lo que te hace grande! 🚀💰"
      );
      return false;
    }

    const cat = matchedCategories.length > 0 ? matchedCategories[0] : 'Otros';

    // LÓGICA DE AHORRO VS GASTO
    const isSaving = cat === 'Ahorro';

    // GUARDADO LOCAL SOBERANO
    const currentData = LocalVaultService.getData();
    const newExpense = {
      fecha: new Date().toISOString(),
      monto: isSaving ? 0 : amount,      // Si es ahorro, no es gasto
      ahorro: isSaving ? amount : 0,     // Si es ahorro, va a su columna
      categoria: cat,
      descripcion: descripcionFinal,
      ticketUrl: ticketUrl,
      mes: new Date().getMonth() + 1,
      año: year
    };

    currentData.expenses.push(newExpense);
    LocalVaultService.saveData(currentData);

    console.log(`✅ REGISTRO SOBERANO: ${amount}€ asignado a ${cat}`);
    fetchData(year);
    return true;
  };

  const handleCalculatorRegister = (data) => {
    const currentData = LocalVaultService.getData();
    const newExpense = {
      ...data,
      fecha: new Date().toISOString(),
      mes: new Date().getMonth() + 1,
      año: year
    };
    currentData.expenses.push(newExpense);
    LocalVaultService.saveData(currentData);
    fetchData(year);
    setIsCalculatorOpen(false);
  };

  const handleSetBudget = (amount) => {
    const currentMonthNum = new Date().getMonth() + 1;
    const currentData = LocalVaultService.getData();

    // Actualizamos o añadimos presupuesto
    const bIndex = currentData.budgets.findIndex(b => b.mes === currentMonthNum && b.año === year);
    if (bIndex > -1) {
      currentData.budgets[bIndex].presupuesto = amount;
    } else {
      currentData.budgets.push({ mes: currentMonthNum, año: year, presupuesto: amount });
    }

    LocalVaultService.saveData(currentData);
    setBudget(amount);
    setShowBalanceModal(false);
  };

  const handleDeleteExpense = (expenseData) => {
    const currentData = LocalVaultService.getData();
    const updatedExpenses = currentData.expenses.filter(e => {
      const eDate = new Date(e.fecha).toISOString();
      const targetDate = new Date(expenseData.fecha).toISOString();
      return !(eDate === targetDate && e.categoria === expenseData.categoria && Number(e.monto) === Number(expenseData.monto));
    });

    currentData.expenses = updatedExpenses;
    LocalVaultService.saveData(currentData);

    setAllExpenses(updatedExpenses.filter(e => e.año === year));
    calculateMonthlyTotals(updatedExpenses);
    console.log("🗑️ BÓVEDA: Gasto eliminado físicamente de tu dispositivo.");
  };

  const handleResetCache = () => {
    if (window.confirm("¿Seguro que quieres limpiar los datos locales? Se borrará el usuario registrado, pero tus datos de gastos seguirán en la Bóveda Local.")) {
      LocalVaultService.logout();
      window.location.reload();
    }
  };

  // 8. RENDERIZADO CONDICIONAL (VISTAS DE ACCESO)

  if (authStatus === 'loading') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full mb-6" />
        <p className="text-gold font-bold uppercase tracking-widest text-xs animate-pulse text-white/80">Cargando Bóveda...</p>
      </div>
    );
  }

  if (authStatus === 'welcome') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-12 bg-gradient-to-b from-black via-gold/5 to-black">
        <div className="space-y-6">
          <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src="/Aguila.jfif" className="w-32 h-32 mx-auto rounded-full border-2 border-gold/30 shadow-2xl object-cover" />
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic">Golden Wallet</h1>
            <p className="text-gold-light text-[9px] font-bold uppercase tracking-[0.3em] opacity-80">Elite Heritage Management</p>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Botón Ayuda en Welcome */}
            <button
              onClick={() => setShowHelp(true)}
              className="absolute top-8 right-8 text-white/20 hover:text-gold transition-colors"
            >
              <HelpCircle size={24} />
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setAuthStatus('login')}
              className="w-full bg-gold text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-gold/10 uppercase tracking-widest text-xs"
            >
              <Phone size={18} />
              <span>¿Ya eres miembro? Entrar con mi móvil</span>
            </motion.button>

            <button
              onClick={() => setAuthStatus('register')}
              className="w-full bg-matte-black border border-white/10 text-white p-5 rounded-2xl flex items-center justify-center gap-3 hover:border-gold/30 transition-all uppercase tracking-widest text-[10px] font-black"
            >
              <UserPlus size={18} className="text-gold" />
              <span>Nuevo Registro Elite (0€)</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === 'login') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-full max-w-xs space-y-8">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Credenciales</h2>
          <div className="space-y-4">
            <input type="tel" placeholder="Tu Teléfono" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} className="w-full bg-white/5 border border-white/10 text-white p-5 rounded-2xl outline-none focus:border-gold/50 text-center text-xl font-bold tracking-widest" />
            {loginError && <p className="text-red-500 text-[10px] font-bold uppercase">{loginError}</p>}
            <button onClick={handleLogin} className="w-full bg-gold text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs">Entrar</button>
            <button onClick={() => setAuthStatus('welcome')} className="text-white/30 text-[10px] uppercase font-black tracking-widest">Volver</button>
          </div>
        </div>
      </div>
    );
  }

  if (authStatus === 'register') {
    return (
      <div className="min-h-screen bg-black py-10 flex flex-col items-center">
        <RegistrationForm onRegister={handleRegister} />
        <button onClick={() => setAuthStatus('welcome')} className="mt-8 text-white/30 text-[10px] uppercase font-black tracking-widest">Cancelar</button>
      </div>
    );
  }

  if (authStatus === 'success') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-matte-black border border-gold/50 p-10 rounded-[40px] shadow-2xl shadow-gold/10 max-w-xs transition-all">
          <Zap size={40} className="text-gold mx-auto mb-6" />
          <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tighter italic">¡Bienvenido al Club de la Soberanía! 🦅</h2>
          <p className="text-white/60 text-sm leading-relaxed mb-10">Tus datos viven aquí, en tu dispositivo (Soberanía Local). Nadie más tiene acceso a tu tesoro.</p>
          <button onClick={() => setAuthStatus('authenticated')} className="w-full bg-gold text-black font-black py-5 rounded-2xl uppercase tracking-widest text-xs">¡Vamos a por ese tesoro! 💰</button>
        </motion.div>
      </div>
    );
  }

  // 9. RENDER DASHBOARD (AUTENTICADO)
  return (
    <div className="min-h-screen bg-black text-white pb-24 font-sans italic">
      <div className="max-w-md mx-auto relative">
        <AnimatePresence>
          {isAuthorized === false && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8 text-center"
            >
              <div className="space-y-6 max-w-xs">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                  <ShieldCheck className="text-red-500" size={40} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Acceso Restringido</h2>
                  <p className="text-white/60 text-xs leading-relaxed">
                    {authMessage || "Tu cuenta no está autorizada para acceder a la Bóveda Elite."}
                  </p>
                </div>
                <button
                  onClick={() => {
                    LocalVaultService.logout(); // Limpieza nuclear
                    localStorage.clear(); // Limpieza absoluta por si acaso
                    window.location.reload();
                  }}
                  className="w-full bg-white/5 border border-white/10 text-white font-bold py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-gold/10 hover:text-gold transition-colors"
                >
                  Volver / Cambiar Cuenta (Rescate)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Header dateTime={dateTime} />
        {currentView === 'inicio' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="px-6 mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tighter italic truncate max-w-[200px]">{user?.nombre || "Usuario"}</h3>
                <p className="text-[10px] text-white/40 font-medium italic select-none mt-1 leading-tight max-w-[220px]">{soulPhrase}</p>
              </div>
              <button onClick={() => setIsSidebarOpen(true)} className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-gold hover:bg-gold/10">
                <Zap size={20} />
              </button>
            </div>


            {/* STATUS BAR DE BÓVEDA LOCAL */}
            <div className="px-6 mb-6">
              <div className="bg-gold/5 border border-gold/20 p-3 rounded-2xl flex items-center justify-center gap-2">
                <ShieldCheck size={14} className="text-gold" />
                <span className="text-[9px] text-gold font-black uppercase tracking-[0.1em]">🛡️ Bóveda Local Activa | Privacidad Nivel Militar</span>
              </div>
            </div>

            {/* ── TOTAL DE GASTOS ── */}
            <div className="px-6 mb-6">
              <div className="bg-black/40 border border-gold/20 rounded-2xl p-4 flex justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Gastos del mes</span>
                  <span className="text-xl font-black text-white">{currentMonthSpending.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                </div>
                <div className="w-px h-10 bg-gold/20" />
                <div className="flex flex-col gap-1 text-right">
                  <span className="text-[9px] text-white/40 uppercase tracking-widest font-bold">Total anual</span>
                  <span className="text-xl font-black text-gold">{totalAnnualExpenses.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</span>
                </div>
              </div>
            </div>

            <BalanceCard balance={balance} budget={safeBudget} availableBalance={availableBudget} onSetBalance={() => setShowBalanceModal(true)} />
            <CategoryGrid expenditures={expenditures} onCategoryClick={setSelectedCategory} />
            <AnimatePresence>{selectedCategory && <ExpenseTable category={selectedCategory} expenses={allExpenses} onClose={() => setSelectedCategory(null)} onDelete={handleDeleteExpense} />}</AnimatePresence>
            <HumorDashboard categoryExpenditures={expenditures} />
            <ActionButtons onAction={setActiveModal} />
          </motion.div>
        )}
        {currentView === 'historico' && <HistoryView expenses={allExpenses || []} onDelete={handleDeleteExpense} />}
        {currentView === 'config' && <ProfileView user={user} onLogout={handleLogout} onResetCache={handleResetCache} />}
        <BottomNav activeView={currentView} onViewChange={(v) => v === 'calculadora' ? setIsCalculatorOpen(true) : setCurrentView(v)} />
      </div>

      <SummarySidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} year={year} setYear={setYear} monthlyData={monthlyTotals} />

      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Botón Flotante de Ayuda */}
      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-24 right-6 z-50 w-12 h-12 bg-gold/10 backdrop-blur-md border border-gold/20 rounded-full flex items-center justify-center text-gold shadow-lg shadow-gold/10 hover:bg-gold/20 transition-all"
      >
        <HelpCircle size={24} />
      </button>

      <AnimatePresence>{activeModal && <InputModal type={activeModal} onClose={() => setActiveModal(null)} onSubmit={handleInputSubmit} />}</AnimatePresence>
      <BalanceModal isOpen={showBalanceModal} onClose={() => setShowBalanceModal(false)} onConfirm={handleSetBudget} currentBudget={budget} />
      <CalculatorModal isOpen={isCalculatorOpen} onClose={() => setIsCalculatorOpen(false)} onRegister={handleCalculatorRegister} />
      <AnimatePresence>{showOnboarding && <OnboardingModal onAccept={handleAcceptOnboarding} />}</AnimatePresence>
    </div>
  );
}

// Envolver con LanguageProvider
function AppWithProviders() {
  return (
    <LanguageProvider>
      <SecurityBanner />
      <App />
    </LanguageProvider>
  );
}

export default AppWithProviders;
