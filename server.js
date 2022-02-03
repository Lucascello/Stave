const express = require("express");

const app = express();

const res = require("express/lib/response");

const { engine } = require("express-handlebars");

const db = require("./db");

const cookieSession = require("cookie-session");

let sessionSecret = process.env.COOKIE_SECRET;

if (!sessionSecret) {
    sessionSecret = require("./secrets").COOKIE_SECRET;
}

const req = require("express/lib/request");

const { hash, compare } = require("./bc");
const { redirect } = require("express/lib/response");

////////////////prevent clickjacking/////////////////////////////
app.use((req, res, next) => {
    res.setHeader("x-frame-options", "deny");
    next();
});
//////////////////////////////////////////////////////////////////

app.engine("handlebars", engine());

app.set("view engine", "handlebars");

app.use(
    cookieSession({
        secret: sessionSecret,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(express.static("./public"));

if (process.env.NODE_ENV == "production") {
    app.use((req, res, next) => {
        if (req.headers["x-forwarded-proto"].startsWith("https")) {
            return next();
        }
        res.redirect(`https://${req.hostname}${req.url}`);
    });
}

//app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
    console.log("I have an userId for scores :", req.session.userId);
    if (req.session.userId) {
        return res.render("home", { layout: "main" });
    } else {
        return res.redirect("/register");
    }
});

app.get("/score", (req, res) => {
    console.log("do I have an userId on / :", req.session.userId);
    if (req.session.userId) {
        return res.render("score", { layout: "main" });
    } else {
        return res.redirect("/register");
    }
});

app.post("/home", (req, res) => {
    const name = req.body.shift();
    const score = JSON.stringify(req.body);
    console.log("The name of the piece:", name);
    console.log("the score for the db:", score);
    console.log("Whos the user", req.session.userId);

    db.addScore(req.session.userId, name, score)
        .then(({ rows }) => {
            console.log("rows in home", rows);
            res.json({ success: true });
        })
        .catch((err) => {
            res.render("home", { saveScoreError: true });
        });
});

app.get("/register", (req, res) => {
    if (req.session.userId) {
        res.redirect("/home");
    }
    res.render("register");
});

app.post("/register", (req, res) => {
    const { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPw) => {
            console.log("hashedPWd :", hashedPw);
            db.addUsersInfo(first, last, email, hashedPw)
                .then(({ rows }) => {
                    req.session.userId = rows[0].id;
                    res.redirect("/home");
                })
                .catch((err) => {
                    console.log("1st err in hash: ", err);
                    return res.render("register", { addUsersInfoError: true });
                });
        })
        .catch((err) => {
            // console.log("2nd err in hash", err);
            return res.render("register", { addUsersInfoError: true });
        });
});

app.get("/login", (req, res) => {
    if (req.session.userId) {
        res.redirect("/home");
    }
    res.render("login");
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.getPasswords(email)
        .then(({ rows }) => {
            // console.log(rows);
            compare(password, rows[0].password)
                .then((match) => {
                    if (match) {
                        // console.log("Whats the request", req.session);
                        req.session.userId = rows[0].id;
                        res.redirect("/home");
                    } else {
                        // console.log("password incorrect");
                        res.render("login", { getPasswordsError: true });
                    }
                })
                .catch((err) => {
                    console.log("err in compare:", err);
                    res.render("login", { getPasswordsError: true });
                });
        })
        .catch((err) => {
            console.log("err on  getting email:", err);
            res.render("login", { getPasswordsError: true });
        });
});

app.get("/logout", (req, res) => {
    console.log(req.session);
    req.session = null;
    res.redirect("/");
});

app.get("*", (req, res) => {
    res.redirect("/");
});

app.listen(process.env.PORT || 8080, () =>
    console.log("staves server listening")
);

// app.listen(8080, () => console.log("petition-project server listening"));
