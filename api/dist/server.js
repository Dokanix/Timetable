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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const Time_utils_1 = __importDefault(require("./utils/Time.utils"));
const Stops_service_1 = __importDefault(require("./services/Stops.service"));
const mongoose_1 = __importDefault(require("mongoose"));
const UserModel_1 = __importDefault(require("./models/UserModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
const port = process.env.PORT;
let todaysStops = [];
mongoose_1.default
    .connect(process.env.MONGO_URL)
    .then(() => console.log('DB Connected'))
    .catch(() => console.error('Failed to connect'));
app.get('/stops/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log('GET /stops/:id', id);
    try {
        const delays = yield Stops_service_1.default.getDelays(Number(id));
        res.json(delays);
    }
    catch (error) {
        res.status(500).json({ error: `Could not fetch delays for id: ${id}` });
    }
}));
app.get('/stops', (req, res) => {
    console.log('GET /stops');
    if (!todaysStops || todaysStops.length === 0) {
        return res.status(500).json({ message: 'No stops found for date' });
    }
    return res.json(todaysStops);
});
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST /login');
    const userData = {
        username: req.body.username,
        password: req.body.password,
    };
    const comparedUser = yield UserModel_1.default.findOne({
        username: userData.username,
    }).select('+password');
    if (!comparedUser)
        return res.status(401).json({ message: 'User not found' });
    const passwordMatch = yield bcrypt_1.default.compare(userData.password, comparedUser.password);
    if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid password' });
    }
    const token = jsonwebtoken_1.default.sign({
        id: comparedUser._id,
        username: comparedUser.username,
    }, process.env.TOKEN_SECRET);
    res
        .cookie('jwt', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
        httpOnly: true,
        secure: req.secure,
    })
        .status(200)
        .json(comparedUser);
}));
app.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }).status(200).end();
});
app.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST /register');
    const userData = {
        username: req.body.username,
        password: req.body.password,
    };
    userData.password = yield bcrypt_1.default.hash(userData.password, 10);
    console.log(userData.password);
    try {
        const newUser = yield UserModel_1.default.create(userData);
        return res.status(201).json(newUser);
    }
    catch (error) {
        return res.status(500).json({ message: 'User already exists' });
    }
}));
app.get('/selection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('GET /selection');
    const cookie = req.cookies.jwt;
    const decodedToken = jsonwebtoken_1.default.verify(cookie, process.env.TOKEN_SECRET);
    const user = yield UserModel_1.default.findById(decodedToken.id);
    if (!user)
        return res.status(401).json({ message: 'User not found' });
    return res.json(user.selectedStops);
}));
app.post('/selection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('POST /selection');
    const cookie = req.cookies.jwt;
    const decodedToken = jsonwebtoken_1.default.verify(cookie, process.env.TOKEN_SECRET);
    const user = yield UserModel_1.default.findById(decodedToken.id);
    if (!user)
        return res.status(401).json({ message: 'User not found' });
    user.selectedStops.push(req.body.selectId);
    user.save();
    return res.json(user.selectedStops);
}));
app.delete('/selection', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('DELETE /selection');
    const cookie = req.cookies.jwt;
    const decodedToken = jsonwebtoken_1.default.verify(cookie, process.env.TOKEN_SECRET);
    const user = yield UserModel_1.default.findById(decodedToken.id);
    if (!user)
        return res.status(401).json({ message: 'User not found' });
    user.selectedStops = user.selectedStops.filter((id) => id !== req.body.selectId);
    user.save();
    return res.json(user.selectedStops);
}));
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    const todaysDate = new Date();
    console.log(`Server is running on port ${port}`);
    console.log("Fetching today's stops");
    try {
        todaysStops = yield Stops_service_1.default.getStops(todaysDate);
    }
    catch (err) {
        console.error(err);
    }
    const timeToMidnight = Time_utils_1.default.getTimeToMidnight(todaysDate);
    console.log(`Setting up midnight refresh in ${Time_utils_1.default.msToTime(timeToMidnight)}`);
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Refreshing stops');
        todaysStops = yield Stops_service_1.default.getStops(todaysDate);
        console.log('Setting up daily refresh');
        setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
            console.log('Refreshing stops');
            todaysStops = yield Stops_service_1.default.getStops(todaysDate);
        }), 1000 * 60 * 60 * 24);
    }), timeToMidnight);
}));
