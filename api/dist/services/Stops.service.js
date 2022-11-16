"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const getDelays = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const rawResponse = yield fetch(process.env.GET_DELAYS_URL + `?stopId=${id}`);
    const delaysResponse = yield rawResponse.json();
    console.log(process.env.GET_DELAYS_URL + `?stopId=${id}`);
    if (!delaysResponse) {
        throw new Error('No delays found for stop');
    }
    return [
        {
            delayInSeconds: -10,
            estimatedTime: '10:00',
            theoreticalTime: '10:10',
            headsign: 'Jelitkowo',
            routeId: 1,
        },
        {
            delayInSeconds: 10,
            estimatedTime: '10:00',
            theoreticalTime: '09:50',
            headsign: 'Wrzeszcz',
            routeId: 2,
        },
        {
            delayInSeconds: 0,
            estimatedTime: '10:00',
            theoreticalTime: '10:00',
            headsign: 'Opera Bałtycka',
            routeId: 3,
        },
    ];
    return delaysResponse.delays;
});
const getStops = (date) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedDate = date || new Date();
    const dateKey = requestedDate.toISOString().slice(0, 10);
    const rawResponse = yield fetch(process.env.GET_STOPS_URL);
    const stopsResponse = yield rawResponse.json();
    const datesStops = stopsResponse[dateKey];
    if (!datesStops) {
        throw new Error('No stops found for date');
    }
    return stopsResponse[dateKey].stops.filter((stop) => stop.stopName);
});
exports.default = {
    getStops,
    getDelays,
};
