const spicedPg = require("spiced-pg");
const database = "stave";
const username = "postgres";
const password = "postgres";

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);
console.log(`[db] connecting to:${database}`);

module.exports.addUsersInfo = (firstName, lastName, email, password) => {
    const q = `INSERT INTO users (first, last, email, password)
                VALUES ($1, $2, $3, $4)
                RETURNING id`;
    const params = [firstName, lastName, email, password];
    return db.query(q, params);
};

module.exports.getFullNames = () => {
    const q = "SELECT first, last FROM users";
    return db.query(q);
};

module.exports.getAllUsers = () => {
    const q = "SELECT COUNT(*) FROM users";
    return db.query(q);
};

module.exports.getPasswords = (email) => {
    const q = "SELECT id, password FROM users WHERE email = $1";
    return db.query(q, [email]);
};

module.exports.updateUsersInfoSimple = (firstName, lastName, email, userId) => {
    const q = `UPDATE users SET first = $1, last = $2, email = $3  WHERE users.id = $4`;
    const params = [firstName, lastName, email, userId];
    return db.query(q, params);
};

module.exports.updatePassword = (password, email) => {
    const q = `UPDATE users SET password =$1, email=$2 WHERE users.id = $3`;
    const params = [password, email];
    return db.query(q, params);
};

module.exports.addScore = (user_id, name, score) => {
    const q = `INSERT INTO scores (user_id, name, score)
                VALUES ($1, $2, $3)
                RETURNING id`;
    const params = [user_id, name, score];
    return db.query(q, params);
};

module.exports.getScore = () => {
    const q = "SELECT COUNT(*) FROM scores";
    return db.query(q);
};
