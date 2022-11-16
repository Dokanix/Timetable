"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getTimeToMidnight(date) {
    const midnight = new Date(date);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - date.getTime();
}
exports.default = getTimeToMidnight;
