const { pool } = require('../config');
const bcrypt = require('bcryptjs');
const SALT_WORK_FACTOR = 10;

const userController = {};

userController.verifyUser = (req, res, next) => {
    const username = req.body.username; 

    pool.query('SELECT * FROM "user" WHERE username = $1', [username], (err, result) => {
        if (err || !result) {
            return next({
                log: `userController.verifyUser: ERROR: ${err}`,
                message: { err: 'userController.verifyUser: ERROR: Check server logs for details'}
            });
        }
        
        bcrypt.compare(req.body.password, result.rows[0].password, (err, isMatch) => {
            if (err || !isMatch) {
                return next({
                    log: `userController.verifyUser: ERROR: ${err}`,
                    message: { err: 'userController.verifyUser: ERROR: Check server logs for details'}
                });
            }
    
            if (isMatch) {
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

module.exports = userController;