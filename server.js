require('dotenv').config();

const app = require('./app');
const { connectDB } = require('./utils/database');

const PORT = process.env.PORT || 5000;

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Listening on: ${PORT}`));
    })
    .catch(err => {
        console.error('Failed to connect to DB', err);
        process.exit(1);
    });