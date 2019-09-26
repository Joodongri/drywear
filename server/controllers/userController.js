const { pool } = require('../config');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const userController = {};

userController.verifyUser = (req, res, next) => {
    const username = req.body.username; 

    pool.query('SELECT * FROM "user" WHERE username = $1', [username], (err, result) => {
        if (err || !result) {
            // res.redirect('/login');
            return next({
                log: `userController.verifyUser: ERROR: ${err}`,
                message: { err: 'userController.createUser: ERROR: Check server logs for details' }
            });
        }
        
        bcrypt.compare(req.body.password, result.rows[0].password, (err, isMatch) => {
            if (err || !isMatch) {
                // res.redirect('/login');
                return next({
                    log: `userController.verifyUser: ERROR: ${err}`,
                    message: { err: 'userController.verifyUser: ERROR: Check server logs for details' }
                }); 
            }
    
            if (isMatch) {
                res.locals.sessionId = result.rows[0]._id;
                // res.redirect('/');
                return next();
            }
        });
    });
}

userController.createUser = (req, res, next) => {
    const password = req.body.password;

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next({
            log: `userController.createUser: ERROR: ${err}`,
            message: { err: 'userController.createUser: ERROR: Check server logs for details'}
        });

        bcrypt.hash(password, salt, function(err, bcryptPassword) {
            if(err) return next({
                log: `userController.createUser: ERROR: ${err}`,
                message: { err: 'userController.createUser: ERROR: Check server logs for details'}
            });

            const queryArr = [req.body.username, bcryptPassword];
            pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', queryArr)
                .then((result) => {
                    return next();
                })
                .catch((err) => next({
                    log: `userController.createUser: ERROR: ${err}`,
                    message: { err: 'userController.createUser: ERROR: Check server logs for details'}
                }))
        })
    })

}

userController.startSession = (req, res, next) => {
    const today = new Date();
    console.log('today is', today);
    pool.query(`INSERT INTO "sessions" ("cookie_id", "created_at") VALUES ($1, $2)`, [res.locals.sessionId, today], (err, result) => {
        if (err) {
            return next({
                log: `userController.startSession: ERROR: ${err}`,
                message: { err: 'userController.startSession: ERROR: Check server logs for details' }
            });
        }
        console.log('startSession controller');
        return next();
    });
}

userController.setSSIDCookie = (req, res, next) => {
    console.log(`Redirect to home page - cookieId is ${res.locals.sessionId}`);
    res.cookie('ssid', res.locals.sessionId, {httpOnly: true});
    return next();
}

userController.isLoggedIn = (req, res, next) => {
    pool.query('SELECT * FROM "sessions" WHERE "cookie_id" = $1', [req.cookies.ssid], (err, result) => {
        if (err) {
            return next({
                log: `userController.isLoggedIn: ERROR: ${err}`,
                message: { err: 'userController.isLoggedIn: ERROR: Check server logs for details' }
            });
        }
        return next();
    });
}

module.exports = userController;