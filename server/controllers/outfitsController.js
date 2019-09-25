const { pool } = require('../config')
const outfitsController = {};

// receives all available items in res.locals.items
// randomly generates 5 combinations (not necessarily different)
// stores these combinations as objects in an outfits array
outfitsController.setOutfits = (req, res, next) => {

    res.locals.outfits = [];

    const { tops, bottoms, shoes } = res.locals.items;

    for (let i = 0; i < 5; i++) {
      const outfit = {};

      let topIndex = Math.floor(Math.random() * tops.length);
      let bottomIndex = Math.floor(Math.random() * bottoms.length);
      let shoesIndex = Math.floor(Math.random() * shoes.length);

      outfit['top'] = tops[topIndex];
      outfit['bottom'] = bottoms[bottomIndex];
      outfit['shoes'] = shoes[shoesIndex];

      res.locals.outfits.push(outfit);
    }

    return next();
}


outfitsController.saveOutfit = (req, res, next) => {
  // console.log(req.body);
  const { top, bottom, shoes, user } = req.body;

  pool.query(`INSERT INTO outfits(top_id, bottom_id, shoes_id, "user") VALUES ($1, $2, $3, $4)`, [top, bottom, shoes, user], (err, results) => {
    if (err) {
      return next({
        log: `outfitsController.saveOutfit: ERROR: ${err}`,
        message: { err: 'outfitsController.saveOutfit: ERROR: Check server logs for details'}
      });
    }

    return next();
  })
}

// reads from the outfits and items tables to find today's outfit (if there is one)
outfitsController.findTodaysOutfit = (req, res, next) => {

  const today = new Date().toISOString().slice(0,10);
  const { user } = req.body;

  pool.query(`SELECT t1.id, t1.date, t1.top_id, t2.image as top_image, t1.bottom_id, t3.image as bottom_image, t1.shoes_id, t4.image as shoes_image
      FROM outfits as t1
      INNER JOIN items as t2
         ON t2.id = t1.top_id
      INNER JOIN items as t3
         ON t3.id = t1.bottom_id
      INNER JOIN items as t4
      ON t4.id = t1.shoes_id
      WHERE t1.date = '${today}' AND t1."user" = $1`, [user], (err, results) => {
    if (err) {
      return next({
        log: `outfitsController.saveOutfit: ERROR: ${err}`,
        message: { err: 'outfitsController.saveOutfit: ERROR: Check server logs for details'}
      });
    }

    // console.log(results.rows)
    if (results.rows === undefined) res.locals.today = false;
    else if (results.rows.length >= 1) {
      res.locals.today = true;
      res.locals.outfit = results.rows;
    }
    else res.locals.today = false;

    return next();
  })
}

outfitsController.removeOutfit  = (req, res, next) => {

  const { id } = req.body;

  pool.query(`DELETE FROM outfits WHERE outfits.id=${id}`, (err, results) => {
    if (err) {
      return next({
        log: `outfitsController.saveOutfit: ERROR: ${err}`,
        message: { err: `outfitsController.saveOutfit: ERROR: ${err}`}
      });
    }
    
    return next();
  })
}

module.exports = outfitsController;
