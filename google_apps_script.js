/**
 * CÓDIGO PARA GOOGLE APPS SCRIPT (GAS) - VERSIÓN v4.1
 * Desplegar como Aplicación Web con acceso para "Cualquiera".
 * EJECUTAR COMO: "Usuario que accede a la aplicación web".
 *
 * Cambios v4.1:
 * - Columna TicketURL añadida en hoja Gastos (columna 8).
 * - handleAddExpense almacena ticketUrl y auto-repara la cabecera si falta.
 * - handleGetData devuelve ticketUrl.
 * - createUserDatabase crea la hoja con la cabecera completa.
 */

const MASTER_SHEET_ID = '1g5pqoYmGsjv1UwBvc9xJeTwVLrYgc4zceLeStgQ3Neo';

// --- ÚNICA función que convierte a respuesta HTTP ---
function renderResponse(obj) {
    return ContentService.createTextOutput(JSON.stringify(obj))
        .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
    return renderResponse({
        success: true,
        message: "GAS Golden Wallet v4.1 activo",
        status: "READY",
        timestamp: new Date().toISOString()
    });
}

function doPost(e) {
    var result;
    try {
        if (!e || !e.postData || !e.postData.contents) {
            result = { success: false, message: "No post data received" };
        } else {
            var data = JSON.parse(e.postData.contents);
            var action = String(data.action || '').trim().toLowerCase();
            console.log("GAS REQUEST: " + action);

            if (action === 'register' || action === 'register_user') result = handleRegister(data);
            else if (action === 'login' || action === 'login_user') result = handleLogin(data);
            else if (action === 'check_access') result = handleCheckAccess(data);
            else if (action === 'add_expense') result = handleAddExpense(data);
            else if (action === 'get_data') result = handleGetData(data);
            else if (action === 'set_budget') result = handleSetBudget(data);
            else if (action === 'get_budget') result = handleGetBudget(data);
            else if (action === 'delete_expense') result = handleDeleteExpense(data);
            else if (action === 'auto_check') result = handleAutoCheck(data);
            else if (action === 'upload_ticket') result = handleUploadTicket(data);
            else result = { success: false, message: 'Acción "' + action + '" no válida.' };
        }
    } catch (err) {
        result = { success: false, message: 'Error Crítico en GAS: ' + err.message };
    }
    return renderResponse(result);
}

// --- HELPERS ---

function comparePhones(phone1, phone2) {
    var clean = function (p) {
        var s = String(p || '').replace(/\D/g, '');
        if (s.indexOf('34') === 0 && s.length > 9) s = s.substring(2);
        return s.substring(0, 9);
    };
    var c1 = clean(phone1);
    var c2 = clean(phone2);
    return c1 === c2 && c1.length > 0;
}

function formatPhone(phone) {
    var p = String(phone || '').replace(/\D/g, '');
    if (p.indexOf('34') === 0 && p.length > 9) p = p.substring(2);
    return p.substring(0, 9);
}

// --- HANDLERS (devuelven objetos planos, NO llaman a renderResponse) ---

function handleRegister(data) {
    try {
        var ss = SpreadsheetApp.openById(MASTER_SHEET_ID);
        var sheet = ss.getSheetByName('Usuarios');

        if (!sheet) {
            sheet = ss.insertSheet('Usuarios');
            sheet.appendRow(['Nombre', 'Email', 'Teléfono', 'Estado', 'Fecha']);
            sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#f3f3f3');
        }

        var rows = sheet.getDataRange().getValues();
        var email = String(data.email || '').trim().toLowerCase();
        var telefono = formatPhone(String(data.telefono || '').trim());

        for (var i = 1; i < rows.length; i++) {
            if (String(rows[i][1]).trim().toLowerCase() === email && email !== '') {
                return { success: false, message: "Este email ya está registrado." };
            }
        }

        sheet.appendRow([
            data.nombre,
            email,
            "'" + telefono,
            "ACTIVO",
            new Date()
        ]);

        return {
            status: "success",
            success: true,
            active: true,
            authorized: true,
            user: { nombre: data.nombre, email: email, telefono: telefono },
            message: "Usuario registrado y activo."
        };
    } catch (err) {
        return { success: false, message: "Error en Registro: " + err.message };
    }
}

function handleCheckAccess(data) {
    try {
        var ss = SpreadsheetApp.openById(MASTER_SHEET_ID);
        var sheet = ss.getSheetByName('Usuarios');
        if (!sheet) return { success: false, message: "Hoja Usuarios no encontrada." };

        var rows = sheet.getDataRange().getValues();
        var telefonoInput = String(data.telefono || '').trim();

        // Columnas: [0]Nombre [1]Email [2]Teléfono [3]Estado [4]Fecha
        for (var i = 1; i < rows.length; i++) {
            var sheetPhone = String(rows[i][2]).replace(/'/g, '').trim();

            if (comparePhones(telefonoInput, sheetPhone)) {
                var estado = String(rows[i][3]).trim().toUpperCase();

                if (estado === 'ACTIVO' || estado === 'APROBADO' || estado === 'LUZ VERDE') {
                    return {
                        status: "success",
                        success: true,
                        active: true,
                        authorized: true,
                        user: {
                            nombre: rows[i][0],
                            email: rows[i][1],
                            telefono: formatPhone(sheetPhone)
                        }
                    };
                } else {
                    return {
                        success: false,
                        authorized: false,
                        message: "Acceso restringido. Estado: " + estado
                    };
                }
            }
        }

        return { success: false, authorized: false, message: "Móvil no encontrado. Regístrate primero." };

    } catch (err) {
        return { success: false, message: "Error de validación: " + err.message };
    }
}

function handleLogin(data) {
    return handleCheckAccess(data);
}

function handleAddExpense(data) {
    try {
        var id = data.dbId || MASTER_SHEET_ID;
        var ss = SpreadsheetApp.openById(id);
        var sheet = ss.getSheetByName('Gastos');
        var date = new Date();

        // AUTO-REPARACIÓN DE ESTRUCTURA: asegurar columnas Ahorro y TicketURL
        var lastCol = sheet.getLastColumn();
        var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];

        if (headers.indexOf('Ahorro') === -1) {
            console.log("GAS: Insertando columna 'Ahorro' en posición 4...");
            sheet.insertColumnBefore(4);
            sheet.getRange(1, 4).setValue('Ahorro');
            // Recargar headers tras inserción
            headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
        }

        if (headers.indexOf('TicketURL') === -1) {
            console.log("GAS: Añadiendo columna 'TicketURL' al final...");
            var newCol = sheet.getLastColumn() + 1;
            sheet.getRange(1, newCol).setValue('TicketURL');
        }

        var monto = data.categoria === 'Ahorro' ? 0 : (data.monto || 0);
        var ahorro = data.categoria === 'Ahorro' ? (data.monto || 0) : 0;
        var ticketUrl = data.ticketUrl || '';

        // Columnas: Fecha | Categoria | Monto | Ahorro | Descripcion | Mes | Año | TicketURL
        sheet.appendRow([
            date,
            data.categoria,
            monto,
            ahorro,
            data.descripcion,
            date.getMonth() + 1,
            date.getFullYear(),
            ticketUrl
        ]);

        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

function handleGetData(data) {
    try {
        var id = data.dbId || MASTER_SHEET_ID;
        var ss = SpreadsheetApp.openById(id);
        var sheet = ss.getSheetByName('Gastos');
        if (!sheet) return { success: true, expenses: [] };

        var rows = sheet.getDataRange().getValues();
        var expenses = [];

        // Columnas: [0]Fecha [1]Categoria [2]Monto [3]Ahorro [4]Descripcion [5]Mes [6]Año [7]TicketURL
        for (var i = 1; i < rows.length; i++) {
            if (rows[i][6] == data.year) {
                expenses.push({
                    fecha: rows[i][0],
                    categoria: rows[i][1],
                    monto: rows[i][2],
                    ahorro: rows[i][3],
                    descripcion: rows[i][4],
                    mes: rows[i][5],
                    año: rows[i][6],
                    ticketUrl: rows[i][7] || ''
                });
            }
        }
        return { success: true, expenses: expenses };
    } catch (err) {
        return { success: false, message: err.message, expenses: [] };
    }
}

function handleSetBudget(data) {
    try {
        var id = data.dbId || MASTER_SHEET_ID;
        var ss = SpreadsheetApp.openById(id);
        var sheet = ss.getSheetByName('Presupuestos');
        if (!sheet) {
            sheet = ss.insertSheet('Presupuestos');
            sheet.appendRow(['Mes', 'Año', 'Presupuesto']);
        }

        var rows = sheet.getDataRange().getValues();
        var found = false;
        for (var i = 1; i < rows.length; i++) {
            if (rows[i][0] == data.mes && rows[i][1] == data.año) {
                sheet.getRange(i + 1, 3).setValue(data.presupuesto);
                found = true;
                break;
            }
        }
        if (!found) sheet.appendRow([data.mes, data.año, data.presupuesto]);
        return { success: true };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

function handleGetBudget(data) {
    try {
        var id = data.dbId || MASTER_SHEET_ID;
        var ss = SpreadsheetApp.openById(id);
        var sheet = ss.getSheetByName('Presupuestos');
        if (!sheet) return { success: true, presupuesto: 0 };

        var rows = sheet.getDataRange().getValues();
        for (var i = 1; i < rows.length; i++) {
            if (rows[i][0] == data.mes && rows[i][1] == data.año) {
                return { success: true, presupuesto: rows[i][2] };
            }
        }
        return { success: true, presupuesto: 0 };
    } catch (err) {
        return { success: false, presupuesto: 0, message: err.message };
    }
}

function handleDeleteExpense(data) {
    try {
        var id = data.dbId || MASTER_SHEET_ID;
        var ss;
        try {
            ss = SpreadsheetApp.openById(id);
        } catch (e) {
            return { success: true, message: "Vault not found, but entry cleared in UI", ghost: true };
        }

        var sheet = ss.getSheetByName('Gastos');
        if (!sheet) return { success: true, message: "Hoja Gastos no encontrada, asumiendo borrado" };

        var rows = sheet.getDataRange().getValues();
        var deleted = false;

        for (var i = rows.length - 1; i >= 1; i--) {
            var rowDate = new Date(rows[i][0]).toISOString();
            var targetDate = new Date(data.fecha).toISOString();
            if (rowDate === targetDate &&
                rows[i][1] === data.categoria &&
                Number(rows[i][2] || 0) === Number(data.monto || 0) &&
                Number(rows[i][3] || 0) === Number(data.ahorro || 0)) {
                sheet.deleteRow(i + 1);
                deleted = true;
                break;
            }
        }
        return { success: true, message: deleted ? "Eliminado" : "No encontrado en tabla" };
    } catch (err) {
        return { success: true, message: "Error ignorado para limpieza de UI: " + err.message };
    }
}

function handleAutoCheck(data) {
    try {
        var files = DriveApp.getFilesByName('GoldenWallet_DB_' + (data.email || 'User'));
        var dbFile = null;

        if (!files.hasNext()) {
            var allFiles = DriveApp.searchFiles('title contains "GoldenWallet_DB_"');
            if (allFiles.hasNext()) dbFile = allFiles.next();
        } else {
            dbFile = files.next();
        }

        if (dbFile) {
            var dbId = dbFile.getId();
            var ssMaster = SpreadsheetApp.openById(MASTER_SHEET_ID);
            var sheet = ssMaster.getSheetByName('Usuarios');
            var rows = sheet.getDataRange().getValues();

            for (var i = 1; i < rows.length; i++) {
                if (rows[i][4] === dbId) {
                    return {
                        success: true,
                        exists: true,
                        user: {
                            nombre: rows[i][1],
                            telefono: rows[i][2],
                            email: rows[i][3],
                            dbId: rows[i][4],
                            folderId: rows[i][5]
                        }
                    };
                }
            }
            return { success: true, exists: true, dbId: dbId, message: "Bóveda encontrada en Drive, procediendo a vinculación." };
        }

        return { success: true, exists: false };
    } catch (err) {
        return { success: false, message: err.message };
    }
}

/**
 * createUserDatabase - Crea la hoja de datos personal del usuario en Drive
 */
function createUserDatabase(userEmail) {
    var folderName = 'GoldenWallet_Recibos_' + (userEmail || 'User');
    var fileName = 'GoldenWallet_DB_' + (userEmail || 'User');

    var folder = DriveApp.createFolder(folderName);
    var ss = SpreadsheetApp.create(fileName);
    var file = DriveApp.getFileById(ss.getId());
    file.moveTo(folder);

    var sheetGastos = ss.getActiveSheet();
    sheetGastos.setName('Gastos');
    // Cabecera completa incluyendo TicketURL
    sheetGastos.appendRow(['Fecha', 'Categoria', 'Monto', 'Ahorro', 'Descripcion', 'Mes', 'Año', 'TicketURL']);

    var sheetPres = ss.insertSheet('Presupuestos');
    sheetPres.appendRow(['Mes', 'Año', 'Presupuesto']);

    return {
        dbId: ss.getId(),
        folderId: folder.getId()
    };
}

function handleUploadTicket(data) {
    try {
        var base64Data = data.image;
        var filename = data.filename || 'ticket_' + new Date().getTime() + '.jpg';
        var folderName = "Boveda Tickets Golden Wallet";

        var folders = DriveApp.getFoldersByName(folderName);
        var folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(folderName);

        var decoded = Utilities.base64Decode(base64Data);
        var blob = Utilities.newBlob(decoded, "image/jpeg", filename);
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

        return {
            success: true,
            status: 'success',
            url: file.getUrl(),
            id: file.getId()
        };
    } catch (e) {
        return { success: false, message: "Error subiendo ticket: " + e.message };
    }
}
