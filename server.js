const express = require('express');
const path = require('path');
const Datastore = require('@seald-io/nedb'); 

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const db = new Datastore({ filename: 'users.db', autoload: true });

app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.send("<h2>Fill all the fields!</h2>");
    }

    db.findOne({ email: email }, (err, userExists) => {
        if (userExists) {
            return res.send("<h2>This email is already registered!</h2>");
        }

        const newUser = { username, email, password };
        db.insert(newUser, (err, doc) => {
            if (err) {
                console.log("Error saving to file:", err);
                return res.send("<h2>Error saving file!</h2>");
            }
            console.log("Customer Details Saved into users.db file! 🥳", doc);
            res.send(`
                <script>
                    alert('Registration Successful & Details Saved! 🎉');
                    window.location.href = '/signin.html';
                </script>
            `);
        });
    });
});

// Sign In POST Route 
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.send("<h2>Please enter your email and password!</h2>");
    }

    db.findOne({ email: email }, (err, user) => {
        if (err) {
            return res.send("<h2>Error at server!</h2>");
        }

        if (!user || user.password !== password) {
            return res.send(`
                <script>
                    alert('Invalid Email or Password! ❌');
                    window.location.href = '/signin.html';
                </script>
            `);
        }

        console.log(`User ${user.username} logged in successfully! 🔓`);
        res.send(`
            <script>
                localStorage.setItem('username', '${user.username}');
                localStorage.setItem('email', '${user.email}');
                alert('Welcome back, ${user.username}! 🎉');
                window.location.href = '/index.html';
            </script>
        `);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running beautifully at http://localhost:${PORT}`);
});