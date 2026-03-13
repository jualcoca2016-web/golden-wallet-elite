import * as XLSX from 'xlsx';
import JSZip from 'jszip';

const DB_NAME = 'GoldenWallet_Elite_Vault';
const STORE_NAME = 'tickets';
const LOCAL_DATA_KEY = 'gw_local_data';
const LOCAL_USER_KEY = 'gw_user';
const BACKUP_METADATA_KEY = 'gw_last_backup';

/**
 * Servicio Local First - Soberanía Total 🦅🛡️
 */
export const LocalVaultService = {
    // --- INDEXED DB (Manejo de Imágenes/Tickets) ---
    initDB: () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    saveTicket: async (blob) => {
        const db = await LocalVaultService.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readwrite');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.add({
                image: blob,
                timestamp: new Date().toISOString()
            });
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    getAllTickets: async () => {
        const db = await LocalVaultService.initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction([STORE_NAME], 'readonly');
            const store = transaction.objectStore(STORE_NAME);
            const request = store.getAll();
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    // --- LOCAL STORAGE (Datos Transaccionales) ---
    getData: () => {
        const data = localStorage.getItem(LOCAL_DATA_KEY);
        return data ? JSON.parse(data) : { expenses: [], budgets: [] };
    },

    saveData: (data) => {
        localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(data));
        // Crear punto de restauración automático
        localStorage.setItem(LOCAL_DATA_KEY + '_autosave', JSON.stringify(data));
    },

    getUser: () => {
        const user = localStorage.getItem(LOCAL_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    saveUser: (user) => {
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
    },

    logout: () => {
        localStorage.removeItem(LOCAL_USER_KEY);
        // No borramos los datos por seguridad soberana, solo cerramos sesión
    },

    // --- EXPORTACIÓN ELITE 📊 ---
    exportToExcel: (expenses) => {
        const worksheet = XLSX.utils.json_to_sheet(expenses.map(e => {
            const dateObj = new Date(e.fecha);
            const rawDesc = e.descripcion || '';

            // Migración retroactiva: si ticketUrl está vacío pero la descripción
            // contiene el formato viejo "(Ticket: URL)", extrae la URL y limpia la desc.
            let ticketUrl = e.ticketUrl || '';
            let cleanDesc = rawDesc;
            if (!ticketUrl) {
                const m = rawDesc.match(/\(Ticket:\s*(https?:\/\/[^)]+)\)/);
                if (m) {
                    ticketUrl = m[1];
                    cleanDesc = rawDesc.replace(/\s*\(Ticket:\s*https?:\/\/[^)]+\)/, '').trim();
                }
            }

            return {
                Fecha: dateObj.toLocaleDateString(),
                Hora: dateObj.toLocaleTimeString(),
                Categoría: e.categoria,
                Monto: e.monto || 0,
                Ahorro: e.ahorro || 0,
                Descripción: cleanDesc,
                'Ticket URL': ticketUrl,
                Mes: e.mes,
                Año: e.año
            };
        }));
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Gastos Elite");
        XLSX.writeFile(workbook, `GoldenWallet_Gastos_${new Date().toISOString().split('T')[0]}.xlsx`);
        localStorage.setItem(BACKUP_METADATA_KEY, new Date().toISOString());
    },

    exportTicketsZip: async () => {
        const tickets = await LocalVaultService.getAllTickets();
        const zip = new JSZip();

        tickets.forEach((t, index) => {
            // Asumimos que t.image es un Blob
            zip.file(`ticket_${index + 1}_${t.timestamp.replace(/[:.]/g, '-')}.png`, t.image);
        });

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = `GoldenWallet_BovedaTickets_${new Date().toISOString().split('T')[0]}.zip`;
        link.click();
        localStorage.setItem(BACKUP_METADATA_KEY, new Date().toISOString());
    },

    createFullBackup: async () => {
        const data = LocalVaultService.getData();
        const tickets = await LocalVaultService.getAllTickets();
        const zip = new JSZip();

        // 1. Añadir Excel de Datos
        const worksheet = XLSX.utils.json_to_sheet(data.expenses);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        zip.file('GoldenWallet_Datos.xlsx', excelBuffer);

        // 2. Añadir Carpeta de Tickets
        const ticketsFolder = zip.folder('Tickets_Originales');
        tickets.forEach((t, index) => {
            ticketsFolder.file(`ticket_${index + 1}.png`, t.image);
        });

        // 3. Añadir Metadata JSON
        zip.file('backup_metadata.json', JSON.stringify({
            export_date: new Date().toISOString(),
            app: 'Golden Wallet Elite',
            version: 'Local-First Sovereign'
        }));

        const content = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        const dateStr = new Date().toISOString().split('T')[0];
        link.download = `GoldenWallet_Patrimonio_${dateStr}.zip`;
        link.click();

        localStorage.setItem(BACKUP_METADATA_KEY, new Date().toISOString());
    },

    getDaysSinceLastBackup: () => {
        const last = localStorage.getItem(BACKUP_METADATA_KEY);
        if (!last) return 999;
        const diff = Date.now() - new Date(last).getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }
};
