import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import TimeUtils from './utils/Time.utils';
import StopsService from './services/Stops.service';
import mongoose from 'mongoose';
import Stop from './models/Stop';
import Delay from './models/Delay';
import User from './models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const port = process.env.PORT;

let todaysStops: Stop[] = [];

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => console.log('DB Connected'))
  .catch(() => console.error('Failed to connect'));

app.get('/stops/:id', async (req, res) => {
  const { id } = req.params;

  console.log('GET /stops/:id', id);

  try {
    const delays: Delay[] = await StopsService.getDelays(Number(id));

    res.json(delays);
  } catch (error) {
    res.status(500).json({ error: `Could not fetch delays for id: ${id}` });
  }
});

app.get('/stops', (req, res) => {
  console.log('GET /stops');

  if (!todaysStops || todaysStops.length === 0) {
    return res.status(500).json({ message: 'No stops found for date' });
  }

  return res.json(todaysStops);
});

app.post('/login', async (req, res) => {
  console.log('POST /login');

  const userData = {
    username: req.body.username,
    password: req.body.password,
  };

  const comparedUser = await User.findOne({
    username: userData.username,
  }).select('+password');

  if (!comparedUser) return res.status(401).json({ message: 'User not found' });

  const passwordMatch = await bcrypt.compare(
    userData.password,
    comparedUser.password
  );

  if (!passwordMatch) {
    return res.status(401).json({ message: 'Invalid password' });
  }

  const token = jwt.sign(
    {
      id: comparedUser._id,
      username: comparedUser.username,
    },
    process.env.TOKEN_SECRET!
  );

  res
    .cookie('jwt', token, {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 3),
      httpOnly: true,
      secure: req.secure,
    })
    .status(200)
    .json(comparedUser);
});

app.post('/logout', (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 }).status(200).end();
});

app.post('/register', async (req, res) => {
  console.log('POST /register');

  const userData = {
    username: req.body.username,
    password: req.body.password,
  };

  userData.password = await bcrypt.hash(userData.password, 10);

  console.log(userData.password);

  try {
    const newUser = await User.create(userData);
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ message: 'User already exists' });
  }
});

app.get('/selection', async (req, res) => {
  console.log('GET /selection');

  const cookie = req.cookies.jwt;
  const decodedToken = jwt.verify(cookie, process.env.TOKEN_SECRET!);

  const user = await User.findById((<any>decodedToken).id);
  if (!user) return res.status(401).json({ message: 'User not found' });

  return res.json(user.selectedStops);
});

app.post('/selection', async (req, res) => {
  console.log('POST /selection');

  const cookie = req.cookies.jwt;
  const decodedToken = jwt.verify(cookie, process.env.TOKEN_SECRET!);

  const user = await User.findById((<any>decodedToken).id);

  if (!user) return res.status(401).json({ message: 'User not found' });

  user.selectedStops.push(req.body.selectId);
  user.save();

  return res.json(user.selectedStops);
});

app.delete('/selection', async (req, res) => {
  console.log('DELETE /selection');

  const cookie = req.cookies.jwt;
  const decodedToken = jwt.verify(cookie, process.env.TOKEN_SECRET!);

  const user = await User.findById((<any>decodedToken).id);

  if (!user) return res.status(401).json({ message: 'User not found' });

  user.selectedStops = user.selectedStops.filter(
    (id) => id !== req.body.selectId
  );
  user.save();

  return res.json(user.selectedStops);
});

app.listen(port, async () => {
  const todaysDate = new Date();

  console.log(`Server is running on port ${port}`);

  console.log("Fetching today's stops");
  try {
    todaysStops = await StopsService.getStops(todaysDate);
  } catch (err) {
    console.error(err);
  }

  const timeToMidnight = TimeUtils.getTimeToMidnight(todaysDate);

  console.log(
    `Setting up midnight refresh in ${TimeUtils.msToTime(timeToMidnight)}`
  );
  setTimeout(async () => {
    console.log('Refreshing stops');
    todaysStops = await StopsService.getStops(todaysDate);

    console.log('Setting up daily refresh');
    setInterval(async () => {
      console.log('Refreshing stops');
      todaysStops = await StopsService.getStops(todaysDate);
    }, 1000 * 60 * 60 * 24);
  }, timeToMidnight);
});
