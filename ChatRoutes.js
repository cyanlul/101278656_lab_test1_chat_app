const express = require('express');
const userModel = require('./User');
const app = express();
const http = require('http').createServer(app)
const cors = require('cors')

const io = require('socket.io')(http)

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors())

app.get("/login", async (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

app.post("/login/username/:username", async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    const user = await userModel.findOne({ username: username, password: password })

    try {
        if (user.length != 0) {
            res.cookie('username', user.username)
            res.redirect("/chatroom")
        } else {
            res.send(JSON.stringify({ status: false, message: "No user found" }))
        }
    } catch (err) {
        res.status(500).send(err);
    }
})

app.get("/logout", async (req, res) => {
    res.clearCookie('username')
    res.sendFile(__dirname + '/login.html')
})

app.get(["/", "/register"], async (req, res) => {
    res.sendFile(__dirname + '/register.html')
})

app.post("/register", async (req, res) => {
    const user = new userModel(req.body)

    try {
        await user.save((err) => {
            if (err) {
                res.send(err)
            } else {
                res.send(user);
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
    res.sendFile(__dirname + "/login.html")
})

app.get("/chatroom", async (req, res) => {
    res.sendFile(__dirname + '/chatroom.html')
})

//Create User Manually
/*app.post('/register', async (req, res) => {
    console.log(req.body)
    const user = new userModel(req.body)

    try {
        await user.save((err) => {
            if (err) {
                res.send(err)
            } else {
                res.send(user);
            }
        });
    } catch (err) {
        res.status(500).send(err);
    }
})*/

//Validate User Manually
/*app.get('/login/username/:username', async (req, res) => {
    const username = req.params.username

    const users = await userModel.findOne().byUserName(username)

    try {
        if (users.length != 0) {
            res.send(users);
        } else {
            res.send(JSON.stringify({ status: false, message: "No data found" }))
        }
    } catch (err) {
        res.status(500).send(err);
    }
})*/

module.exports = app
