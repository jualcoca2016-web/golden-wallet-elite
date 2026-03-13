/**
 * formatPhone - SANITIZACIÓN UNIVERSAL DE NÚMEROS DE TELÉFONO
 * Elimina símbolos pero mantiene longitud original (7, 9, 11+ dígitos)
 * Comparación exitosa si los dígitos limpios coinciden
 * 
 * @param {string|number} phone - Número de teléfono en cualquier formato
 * @returns {string} - Número normalizado (solo dígitos)
 * 
 * @example
 * formatPhone('+34 600 00 00 00') // '34600000000' (11 dígitos)
 * formatPhone('600-000-000')      // '600000000' (9 dígitos)
 * formatPhone('1234567')          // '1234567' (7 dígitos)
 */
export const formatPhone = (phone) => {
    // Elimina todo lo que no sea dígito (espacios, guiones, puntos, +, paréntesis, etc.)
    return String(phone).replace(/\D/g, '');
};

/**
 * comparePhones - COMPARACIÓN FLEXIBLE DE NÚMEROS
 * Compara dos números ignorando símbolos y prefijos opcionales
 * 
 * @param {string|number} phone1 - Primer número
 * @param {string|number} phone2 - Segundo número
 * @returns {boolean} - true si coinciden (exacto o sufijo)
 */
export const comparePhones = (phone1, phone2) => {
    const p1 = formatPhone(phone1);
    const p2 = formatPhone(phone2);

    if (!p1 || !p2) return false;

    // Comparación exacta
    if (p1 === p2) return true;

    // Comparación por sufijo (para manejar prefijos internacionales)
    // Ej: 34600000000 vs 600000000
    if (p1.length > p2.length && p1.endsWith(p2)) return true;
    if (p2.length > p1.length && p2.endsWith(p1)) return true;

    return false;
};

/**
 * validatePhone - VALIDACIÓN BÁSICA DE NÚMERO
 * Verifica que tenga al menos 7 dígitos
 */
export const validatePhone = (phone) => {
    const formatted = formatPhone(phone);
    return formatted.length >= 7;
};
