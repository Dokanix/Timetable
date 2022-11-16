"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getTimeToMidnight = (date) => {
    const midnight = new Date(date);
    midnight.setHours(24, 0, 0, 0);
    return midnight.getTime() - date.getTime();
};
const msToTime = (duration) => {
    let seconds = Math.floor(duration / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    seconds %= 60;
    minutes %= 60;
    return `${hours}h ${minutes}m ${seconds}s`;
};
exports.default = {
    getTimeToMidnight,
    msToTime,
};
