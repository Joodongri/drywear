const { pool } = require('../config')
const historyController = {};

historyController.getHistory = (req, res, next) => {
  const { user } = req.body;
  pool.query(`SELECT t1.id, t1.date, t1.top_id, t2.image as top_image, t1.bottom_id, t3.image as bottom_image, t1.shoes_id, t4.image as shoes_image
  FROM outfits as t1
  INNER JOIN items as t2
     ON t2.id = t1.top_id
  INNER JOIN items as t3
     ON t3.id = t1.bottom_id
  INNER JOIN items as t4
    ON t4.id = t1.shoes_id
  WHERE t1."user" = $1`, [user], (err, results) => {
    if (err) {
      return next({
        log: `historyController.getHistory: ERROR: ${err}`,
        message: { err: `historyController.getHistory: ${err}`}
      });
    }
    
    res.locals.history = results.rows.sort((a, b) => b.date - a.date);
    return next();
  })
}


module.exports = historyController;
