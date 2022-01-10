const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const postRoutes = require('./routes/posts.js')
const categoryRoutes = require('./routes/categories.js')
const User = require('./models/User.js')
const Image = require('./models/image.js')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const bcrypt = require("bcrypt")
const OAuth2Client = require('google-auth-library');
const postApis = require('./routes/posts')
const categoryApis = require('./routes/categories')

dotenv.config()

const client = new OAuth2Client(process.env.CLIENT_ID)

const app = express()
// const allowedOrigins = ['https://tjhkg-forum-alpha.netlify.app', 'https://henrytam123.github.io', 'http://localhost:3000']
// const corsOptions = {
//     origin: function (origin, callback) {
//         if (allowedOrigins.indexOf(origin) !== -1) {
//             callback(null, true)
//         } else {
//             callback(new Error('Not allowed by CORS'))
//         }
//     },
//     credentials: true,
// }

app.use(express.json())
app.use(express.urlencoded({ limit: "30mb", extended: true }))
// app.options('*', cors(corsOptions))
// app.use(cors(corsOptions))
app.use(cookieParser())

app.use((req, res, next) => {
    const allowedOrigins = ['https://tjhkg-forum-alpha.netlify.app', 'https://henrytam123.github.io', 'http://localhost:3000']
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
});

app.get('/categories/', categoryApis.getAllCategories);
app.post('/categories/', categoryApis.createCategory);

app.get('/posts', postApis.getPosts);
app.post('/posts', postApis.postPost);
app.post('/posts/post', postApis.getSpecificPost);
app.post('/posts/comments', postApis.getAllComments);
app.post('/posts/response', postApis.postComment);
app.patch('/posts/like', postApis.likePost);
app.patch('/posts/dislike', postApis.dislikePost);

app.post("/uploadphoto", async (req, res) => {
    const selectedFile = req.body
    const newFile = new Image(selectedFile)
    try {
        newFile.save()
        res.status(201).json(newFile)
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
})

app.post('/register', async (req, res) => {
    const user = req.body
    const newUser = new User(user)
    const user2 = await User.findOne({ username: req.body.username })
    console.log(user)

    if (user2) {
        res.json({ success: 'false', message: 'This usernmae has been used ' })
    } else {

        const salt = await bcrypt.genSalt(10);

        newUser.password = await bcrypt.hash(user.password, salt)

        newUser.save()
            .then(data => {
                res.json({ success: 'true', message: "This username is available", ...data })
            })
            .catch(err => {
                res.json({ message: err })
            })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username: username })

    if (!!user) {
        const validPassword = await bcrypt.compare(password, user.password)

        if (validPassword) {
            res.status(200).send(user)
        } else {
            res.status(400).json({ message: "Invalid Password" })
        }

    } else {
        res.json({ message: "Invalid Username or Password" })
    }

})

app.post('/logout', (req, res) => {
    console.log('logout')
    res.json({ message: "logout" })
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, {
            _id: 0,
            icon: 1,
            username: 1,
            level: 1,
            joinedAt: 1
        })
        res.status(200).json(users)

    } catch (err) {
        res.status(404).json({ message: err.message })
    }
})

app.post("/api/v1/auth/google", async (req, res) => {
    try {
        const { token } = req.body

        const oAuthClient = new client.OAuth2()

        let ticket = {};

        let returnUser = {};

        await oAuthClient.verifyIdToken(
            token,
            process.env.CLIENT_ID,
            async (err, login) => {
                ticket = login._payload
                let existingUser = await User.findOne({ email: ticket.email })
                console.log(login)
                returnUser = existingUser;

                if (!existingUser) {
                    let newUser = new User({
                        username: ticket.name,
                        email: ticket.email,
                        icon: ticket.picture
                    });

                    await newUser.save();

                    returnUser = await User.findOne({ email: ticket.email })
                }
                res.status(201).send(returnUser)
            }
        );
    } catch (err) {
        res.send(err)
    }
})

const PORT = process.env.PORT || 5000

mongoose.connect(process.env.CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
    .catch((err) => console.log(err.message))

mongoose.set('useFindAndModify', false)

