"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCPF = validateCPF;
exports.validateCNPJ = validateCNPJ;
exports.formatCPF = formatCPF;
exports.formatCNPJ = formatCNPJ;
exports.cleanDocument = cleanDocument;
exports.validatePlate = validatePlate;
exports.formatPlate = formatPlate;
const constants_1 = require("../constants");
function validateCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    if (!constants_1.DOCUMENT_PATTERNS.CPF.test(cleaned))
        return false;
    if (/^(\d)\1{10}$/.test(cleaned))
        return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cleaned.charAt(i)) * (10 - i);
    }
    let digit = 11 - (sum % 11);
    if (digit >= 10)
        digit = 0;
    if (digit !== parseInt(cleaned.charAt(9)))
        return false;
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cleaned.charAt(i)) * (11 - i);
    }
    digit = 11 - (sum % 11);
    if (digit >= 10)
        digit = 0;
    if (digit !== parseInt(cleaned.charAt(10)))
        return false;
    return true;
}
function validateCNPJ(cnpj) {
    const cleaned = cnpj.replace(/\D/g, '');
    if (!constants_1.DOCUMENT_PATTERNS.CNPJ.test(cleaned))
        return false;
    if (/^(\d)\1{13}$/.test(cleaned))
        return false;
    let size = cleaned.length - 2;
    let numbers = cleaned.substring(0, size);
    const digits = cleaned.substring(size);
    let sum = 0;
    let pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2)
            pos = 9;
    }
    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(0)))
        return false;
    size = size + 1;
    numbers = cleaned.substring(0, size);
    sum = 0;
    pos = size - 7;
    for (let i = size; i >= 1; i--) {
        sum += parseInt(numbers.charAt(size - i)) * pos--;
        if (pos < 2)
            pos = 9;
    }
    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== parseInt(digits.charAt(1)))
        return false;
    return true;
}
function formatCPF(cpf) {
    const cleaned = cpf.replace(/\D/g, '');
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '..-');
}
function formatCNPJ(cnpj) {
    const cleaned = cnpj.replace(/\D/g, '');
    return cleaned.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '../-');
}
function cleanDocument(document) {
    return document.replace(/\D/g, '');
}
function validatePlate(plate) {
    const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
    return constants_1.DOCUMENT_PATTERNS.PLATE.test(cleaned);
}
function formatPlate(plate) {
    const cleaned = plate.replace(/[^A-Z0-9]/g, '').toUpperCase();
    return cleaned.replace(/([A-Z]{3})(\d[A-Z0-9]\d{2})/, '-');
}
//# sourceMappingURL=document.util.js.map