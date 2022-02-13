const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const bannerRoutes = require('./routes/banner');
const chatRoutes = require('./routes/chat');
const coinsRoutes = require('./routes/coins');
const fansRoutes = require('./routes/fans');
const liveStreamRoutes = require('./routes/live_stream');
const postRoutes = require('./routes/post');
const rcoinsRoutes = require('./routes/rcoins');
const stickersRoutes = require('./routes/stickers');
const userRoutes = require('./routes/user');
const videosRoutes = require('./routes/videos');
const vipRoutes = require('./routes/vip');

dotenv.config();
require('./utilities.js')(io);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/banners', bannerRoutes);
app.use('/chat', chatRoutes);
app.use('/coin', coinsRoutes);
app.use('/fans', fansRoutes);
app.use('/live', liveStreamRoutes);
app.use('/post', postRoutes);
app.use('/rcoin', rcoinsRoutes);
app.use('/stickers', stickersRoutes);
app.use('/user', userRoutes);
app.use('/videos', videosRoutes);
app.use('/vip', vipRoutes);

app.use('/', (req, res) => {
    res.send('Welcome to Vuexy API');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => server.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((error) => console.log(error.message));