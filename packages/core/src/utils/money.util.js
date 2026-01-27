"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatMoney = formatMoney;
exports.calculateDiscount = calculateDiscount;
exports.applyDiscount = applyDiscount;
exports.calculateRentalTotal = calculateRentalTotal;
function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}
function calculateDiscount(amount, discountPercentage) {
    return amount * (discountPercentage / 100);
}
function applyDiscount(amount, discountPercentage) {
    const discount = calculateDiscount(amount, discountPercentage);
    return amount - discount;
}
function calculateRentalTotal(dailyRate, days, discountPercentage = 0) {
    const subtotal = dailyRate * days;
    const discount = calculateDiscount(subtotal, discountPercentage);
    const total = subtotal - discount;
    return { subtotal, discount, total };
}
//# sourceMappingURL=money.util.js.map