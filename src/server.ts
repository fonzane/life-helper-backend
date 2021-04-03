import mongoose from 'mongoose';
import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';

// App configurations
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
import './config/auth-config';

// MongoDB Connection setup
const mongoDB = 'mongodb://localhost/life-helper';
mongoose.connect(mongoDB, {useNewUrlParser: true, useFindAndModify: false, useUnifiedTopology: true, useCreateIndex: true}).then(() => {
    console.log('Connection established to MongoDB');
}).catch((error: any) => {
    console.log(error);
});

// Routes import
import authRoute from './routes/auth';
import categoryRoute from './routes/category';
import tasksRoute from './routes/task';
import shoutboxRoute from './routes/shoutbox';
import questionnaireRoute from './routes/questionnaire';

// Routes
app.use('/api', authRoute);
app.use('/api', categoryRoute);
app.use('/api', tasksRoute);
app.use('/api', shoutboxRoute);
app.use('/api', questionnaireRoute);

// Listen
const port: number = 2000;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
})