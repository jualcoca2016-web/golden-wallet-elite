/**
 * TRANSLATIONS - Sistema i18n para Golden Wallet
 * Soporta: Español (ES), English (EN), Français (FR), Português (PT)
 */

export const translations = {
    es: {
        // Common
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        cancel: 'Cancelar',
        close: 'Cerrar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        confirm: 'Confirmar',

        // Auth
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        logout: 'Cerrar Sesión',
        phone: 'Teléfono',
        email: 'Correo Electrónico',
        name: 'Nombre',
        fullName: 'Nombre Completo',

        // Registration
        registerTitle: 'Registro Elite',
        registerSubtitle: 'Crea tu acceso a la Bóveda',
        phonePlaceholder: 'Ej: 600000000',
        emailPlaceholder: 'tu@email.com',
        namePlaceholder: 'Ej: Juan Coca',
        phoneLabel: 'Teléfono Móvil',
        emailLabel: 'Correo (Opcional)',
        nameLabel: 'Nombre Completo',
        vaultCheckbox: 'Activar Bóveda Soberana',
        vaultDescription: 'Acepto que la App cree y gestione mis datos exclusivamente en el almacenamiento local cifrado de este dispositivo.',
        registerButton: 'Crear Cuenta Elite',
        phoneHint: 'Solo números. Máximo 11 dígitos (ej: 34600000000)',

        // Login
        loginTitle: 'Acceso Privado',
        loginSubtitle: 'Ingresa tu teléfono',
        loginButton: 'Acceder a la Bóveda',
        registerLink: '¿Primera vez? Regístrate aquí',

        // Input Modal
        inputExpense: 'Entrada de Gasto',
        camera: 'Cámara',
        microphone: 'Micrófono',
        text: 'Texto',
        gallery: 'Galería',
        activateCamera: 'Activar Cámara',
        activateMicrophone: 'Activar Micrófono',
        cameraBlocked: 'Cámara Bloqueada',
        microphoneBlocked: 'Micrófono Bloqueado',
        requestingAccess: 'Solicitando Acceso al Sensor...',
        waitingBrowser: 'Esperando respuesta del navegador',
        acceptPermission: 'Acepta el permiso cuando aparezca el cuadro',
        clickToActivate: 'Haz clic en el botón para activar',
        browserWillAsk: 'Tu navegador pedirá permiso',
        requiredMobileSecurity: 'Requerido por seguridad en navegadores móviles',
        cameraNotResponding: 'Cámara No Responde',
        micNotResponding: 'Micrófono No Responde',
        notInitialized: 'no se ha iniciado después de esperar',
        mayBeBlocked: 'Puede que esté bloqueado en la configuración del navegador',
        openSettings: 'Abrir Configuración',
        retry: 'Reintentar',
        enableInPermissions: 'Habilita localhost en los permisos',
        cameraNotFound: 'No se detectó cámara',
        micNotFound: 'No se detectó micrófono',
        insecureContext: 'requiere HTTPS o localhost',
        recording: 'Grabando...',
        listening: 'Escuchando...',

        // Categories
        categories: 'Categorías',
        food: 'Comida',
        transport: 'Transporte',
        entertainment: 'Ocio',
        health: 'Salud',
        education: 'Educación',
        shopping: 'Compras',
        bills: 'Facturas',
        savings: 'Ahorro',
        other: 'Otros',

        // Dashboard
        dashboard: 'Panel',
        expenses: 'Gastos',
        budget: 'Presupuesto',
        summary: 'Resumen',
        profile: 'Perfil',
        settings: 'Configuración',
        month: 'Mes',
        year: 'Año',
        total: 'Total',
        remaining: 'Restante',

        // Errors
        unauthorized: 'Usuario no autorizado',
        notFound: 'No encontrado',
        networkError: 'Error de red',
        invalidPhone: 'Número de teléfono inválido',
        requiredField: 'Campo requerido',

        // Security Banner
        securityWarning: 'Aviso de Seguridad',
        httpWarning: 'Estás accediendo vía HTTP. Para usar Cámara/Micrófono, habilita los permisos en',
        chromeFlags: 'chrome://flags',

        // Language
        language: 'Idioma',
        spanish: 'Español',
        english: 'English',
        french: 'Français',
        portuguese: 'Português'
    },

    en: {
        // Common
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        close: 'Close',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        confirm: 'Confirm',

        // Auth
        login: 'Login',
        register: 'Sign Up',
        logout: 'Logout',
        phone: 'Phone',
        email: 'Email',
        name: 'Name',
        fullName: 'Full Name',

        // Registration
        registerTitle: 'Elite Registration',
        registerSubtitle: 'Create your Vault access',
        phonePlaceholder: 'e.g: 600000000',
        emailPlaceholder: 'your@email.com',
        namePlaceholder: 'e.g: John Doe',
        phoneLabel: 'Mobile Phone',
        emailLabel: 'Email (Optional)',
        nameLabel: 'Full Name',
        vaultCheckbox: 'Activate Sovereign Vault',
        vaultDescription: 'I agree that the App creates and manages my data exclusively in the encrypted local storage of this device.',
        registerButton: 'Create Elite Account',
        phoneHint: 'Numbers only. Max 11 digits (e.g: 34600000000)',

        // Login
        loginTitle: 'Private Access',
        loginSubtitle: 'Enter your phone',
        loginButton: 'Access Vault',
        registerLink: 'First time? Register here',

        // Input Modal
        inputExpense: 'Expense Entry',
        camera: 'Camera',
        microphone: 'Microphone',
        text: 'Text',
        gallery: 'Gallery',
        activateCamera: 'Activate Camera',
        activateMicrophone: 'Activate Microphone',
        cameraBlocked: 'Camera Blocked',
        microphoneBlocked: 'Microphone Blocked',
        requestingAccess: 'Requesting Sensor Access...',
        waitingBrowser: 'Waiting for browser response',
        acceptPermission: 'Accept permission when the dialog appears',
        clickToActivate: 'Click the button to activate',
        browserWillAsk: 'Your browser will ask for permission',
        requiredMobileSecurity: 'Required for mobile browser security',
        cameraNotResponding: 'Camera Not Responding',
        micNotResponding: 'Microphone Not Responding',
        notInitialized: 'has not started after waiting',
        mayBeBlocked: 'It may be blocked in browser settings',
        openSettings: 'Open Settings',
        retry: 'Retry',
        enableInPermissions: 'Enable localhost in permissions',
        cameraNotFound: 'No camera detected',
        micNotFound: 'No microphone detected',
        insecureContext: 'requires HTTPS or localhost',
        recording: 'Recording...',
        listening: 'Listening...',

        // Categories
        categories: 'Categories',
        food: 'Food',
        transport: 'Transport',
        entertainment: 'Entertainment',
        health: 'Health',
        education: 'Education',
        shopping: 'Shopping',
        bills: 'Bills',
        savings: 'Savings',
        other: 'Other',

        // Dashboard
        dashboard: 'Dashboard',
        expenses: 'Expenses',
        budget: 'Budget',
        summary: 'Summary',
        profile: 'Profile',
        settings: 'Settings',
        month: 'Month',
        year: 'Year',
        total: 'Total',
        remaining: 'Remaining',

        // Errors
        unauthorized: 'Unauthorized user',
        notFound: 'Not found',
        networkError: 'Network error',
        invalidPhone: 'Invalid phone number',
        requiredField: 'Required field',

        // Security Banner
        securityWarning: 'Security Warning',
        httpWarning: 'You are accessing via HTTP. To use Camera/Microphone, enable permissions in',
        chromeFlags: 'chrome://flags',

        // Language
        language: 'Language',
        spanish: 'Español',
        english: 'English',
        french: 'Français',
        portuguese: 'Português'
    },

    fr: {
        // Common
        loading: 'Chargement...',
        error: 'Erreur',
        success: 'Succès',
        cancel: 'Annuler',
        close: 'Fermer',
        save: 'Enregistrer',
        delete: 'Supprimer',
        edit: 'Modifier',
        confirm: 'Confirmer',

        // Auth
        login: 'Connexion',
        register: 'S\'inscrire',
        logout: 'Déconnexion',
        phone: 'Téléphone',
        email: 'Email',
        name: 'Nom',
        fullName: 'Nom Complet',

        // Registration
        registerTitle: 'Inscription Élite',
        registerSubtitle: 'Créez votre accès au Coffre',
        phonePlaceholder: 'ex: 600000000',
        emailPlaceholder: 'votre@email.com',
        namePlaceholder: 'ex: Jean Dupont',
        phoneLabel: 'Téléphone Mobile',
        emailLabel: 'Email (Optionnel)',
        nameLabel: 'Nom Complet',
        vaultCheckbox: 'Activer le Coffre Souverain',
        vaultDescription: 'J\'accepte que l\'application crée et gère mes données exclusivement dans le stockage local crypté de cet appareil.',
        registerButton: 'Créer un Compte Élite',
        phoneHint: 'Chiffres uniquement. Max 11 chiffres (ex: 34600000000)',

        // Login
        loginTitle: 'Accès Privé',
        loginSubtitle: 'Entrez votre téléphone',
        loginButton: 'Accéder au Coffre',
        registerLink: 'Première fois? Inscrivez-vous ici',

        // Input Modal
        inputExpense: 'Saisie de Dépense',
        camera: 'Caméra',
        microphone: 'Microphone',
        text: 'Texte',
        gallery: 'Galerie',
        activateCamera: 'Activer la Caméra',
        activateMicrophone: 'Activer le Microphone',
        cameraBlocked: 'Caméra Bloquée',
        microphoneBlocked: 'Microphone Bloqué',
        requestingAccess: 'Demande d\'Accès au Capteur...',
        waitingBrowser: 'En attente de la réponse du navigateur',
        acceptPermission: 'Acceptez l\'autorisation lorsque la boîte de dialogue apparaît',
        clickToActivate: 'Cliquez sur le bouton pour activer',
        browserWillAsk: 'Votre navigateur demandera l\'autorisation',
        requiredMobileSecurity: 'Requis pour la sécurité du navigateur mobile',
        cameraNotResponding: 'Caméra Ne Répond Pas',
        micNotResponding: 'Microphone Ne Répond Pas',
        notInitialized: 'n\'a pas démarré après l\'attente',
        mayBeBlocked: 'Il peut être bloqué dans les paramètres du navigateur',
        openSettings: 'Ouvrir les Paramètres',
        retry: 'Réessayer',
        enableInPermissions: 'Activer localhost dans les autorisations',
        cameraNotFound: 'Aucune caméra détectée',
        micNotFound: 'Aucun microphone détecté',
        insecureContext: 'nécessite HTTPS ou localhost',
        recording: 'Enregistrement...',
        listening: 'Écoute...',

        // Categories
        categories: 'Catégories',
        food: 'Nourriture',
        transport: 'Transport',
        entertainment: 'Loisirs',
        health: 'Santé',
        education: 'Éducation',
        shopping: 'Achats',
        bills: 'Factures',
        savings: 'Épargne',
        other: 'Autres',

        // Dashboard
        dashboard: 'Tableau de Bord',
        expenses: 'Dépenses',
        budget: 'Budget',
        summary: 'Résumé',
        profile: 'Profil',
        settings: 'Paramètres',
        month: 'Mois',
        year: 'Année',
        total: 'Total',
        remaining: 'Restant',

        // Errors
        unauthorized: 'Utilisateur non autorisé',
        notFound: 'Non trouvé',
        networkError: 'Erreur réseau',
        invalidPhone: 'Numéro de téléphone invalide',
        requiredField: 'Champ requis',

        // Security Banner
        securityWarning: 'Avertissement de Sécurité',
        httpWarning: 'Vous accédez via HTTP. Pour utiliser Caméra/Microphone, activez les autorisations dans',
        chromeFlags: 'chrome://flags',

        // Language
        language: 'Langue',
        spanish: 'Español',
        english: 'English',
        french: 'Français',
        portuguese: 'Português'
    },

    pt: {
        // Common
        loading: 'Carregando...',
        error: 'Erro',
        success: 'Sucesso',
        cancel: 'Cancelar',
        close: 'Fechar',
        save: 'Salvar',
        delete: 'Excluir',
        edit: 'Editar',
        confirm: 'Confirmar',

        // Auth
        login: 'Entrar',
        register: 'Registrar',
        logout: 'Sair',
        phone: 'Telefone',
        email: 'Email',
        name: 'Nome',
        fullName: 'Nome Completo',

        // Registration
        registerTitle: 'Registro Elite',
        registerSubtitle: 'Crie seu acesso ao Cofre',
        phonePlaceholder: 'ex: 600000000',
        emailPlaceholder: 'seu@email.com',
        namePlaceholder: 'ex: João Silva',
        phoneLabel: 'Telefone Celular',
        emailLabel: 'Email (Opcional)',
        nameLabel: 'Nome Completo',
        vaultCheckbox: 'Ativar Cofre Soberano',
        vaultDescription: 'Aceito que o App crie e gerencie meus dados exclusivamente no armazenamento local criptografado deste dispositivo.',
        registerButton: 'Criar Conta Elite',
        phoneHint: 'Apenas números. Máx 11 dígitos (ex: 34600000000)',

        // Login
        loginTitle: 'Acesso Privado',
        loginSubtitle: 'Digite seu telefone',
        loginButton: 'Acessar Cofre',
        registerLink: 'Primeira vez? Registre-se aqui',

        // Input Modal
        inputExpense: 'Entrada de Despesa',
        camera: 'Câmera',
        microphone: 'Microfone',
        text: 'Texto',
        gallery: 'Galeria',
        activateCamera: 'Ativar Câmera',
        activateMicrophone: 'Ativar Microfone',
        cameraBlocked: 'Câmera Bloqueada',
        microphoneBlocked: 'Microfone Bloqueado',
        requestingAccess: 'Solicitando Acesso ao Sensor...',
        waitingBrowser: 'Aguardando resposta do navegador',
        acceptPermission: 'Aceite a permissão quando a caixa aparecer',
        clickToActivate: 'Clique no botão para ativar',
        browserWillAsk: 'Seu navegador pedirá permissão',
        requiredMobileSecurity: 'Requerido para segurança do navegador móvel',
        cameraNotResponding: 'Câmera Não Responde',
        micNotResponding: 'Microfone Não Responde',
        notInitialized: 'não iniciou após esperar',
        mayBeBlocked: 'Pode estar bloqueado nas configurações do navegador',
        openSettings: 'Abrir Configurações',
        retry: 'Tentar Novamente',
        enableInPermissions: 'Habilite localhost nas permissões',
        cameraNotFound: 'Nenhuma câmera detectada',
        micNotFound: 'Nenhum microfone detectado',
        insecureContext: 'requer HTTPS ou localhost',
        recording: 'Gravando...',
        listening: 'Ouvindo...',

        // Categories
        categories: 'Categorias',
        food: 'Comida',
        transport: 'Transporte',
        entertainment: 'Lazer',
        health: 'Saúde',
        education: 'Educação',
        shopping: 'Compras',
        bills: 'Contas',
        savings: 'Poupança',
        other: 'Outros',

        // Dashboard
        dashboard: 'Painel',
        expenses: 'Despesas',
        budget: 'Orçamento',
        summary: 'Resumo',
        profile: 'Perfil',
        settings: 'Configurações',
        month: 'Mês',
        year: 'Ano',
        total: 'Total',
        remaining: 'Restante',

        // Errors
        unauthorized: 'Usuário não autorizado',
        notFound: 'Não encontrado',
        networkError: 'Erro de rede',
        invalidPhone: 'Número de telefone inválido',
        requiredField: 'Campo obrigatório',

        // Security Banner
        securityWarning: 'Aviso de Segurança',
        httpWarning: 'Você está acessando via HTTP. Para usar Câmera/Microfone, habilite as permissões em',
        chromeFlags: 'chrome://flags',

        // Language
        language: 'Idioma',
        spanish: 'Español',
        english: 'English',
        french: 'Français',
        portuguese: 'Português'
    }
};

export const supportedLanguages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' }
];
