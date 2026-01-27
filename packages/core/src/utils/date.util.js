"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRentalDays = calculateRentalDays;
exports.isValidRentalPeriod = isValidRentalPeriod;
exports.hasDateOverlap = hasDateOverlap;
exports.addDaysToDate = addDaysToDate;
exports.parseDate = parseDate;
const date_fns_1 = require("date-fns");
function calculateRentalDays(startDate, endDate) {
    return (0, date_fns_1.differenceInDays)(endDate, startDate) + 1;
}
function isValidRentalPeriod(startDate, endDate) {
    if (!(0, date_fns_1.isValid)(startDate) || !(0, date_fns_1.isValid)(endDate))
        return false;
    if (!(0, date_fns_1.isAfter)(endDate, startDate))
        return false;
    return true;
}
function hasDateOverlap(start1, end1, start2, end2) {
    return (0, date_fns_1.isBefore)(start1, end2) && (0, date_fns_1.isAfter)(end1, start2);
}
function addDaysToDate(date, days) {
    return (0, date_fns_1.addDays)(date, days);
}
function parseDate(dateString) {
    return (0, date_fns_1.parseISO)(dateString);
}
//# sourceMappingURL=date.util.js.map