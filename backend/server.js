const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');

dotenv.config();
const authRoutes = require('./src/routes/auth');

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('Instagram OAuth Backend Running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
