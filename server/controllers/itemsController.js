const { pool } = require('../config')
const itemsController = {};


itemsController.getItems = (req, res, next) => {
  const { user } = req.body;

  pool.query('SELECT * FROM items WHERE "user" = $1', [user], (err, results) => {
    if (err) {
      return next({
        log: `itemsController.getItems: ERROR: ${err}`,
        message: { err: 'itemsController.getItems: ERROR: Check server logs for details'}
      });
    }

    res.locals.items = results.rows;
    return next();
  })
}

// sends back an items object stored on res.locals that has shoes, tops and bottoms properties
// all shoes are selected, and tops and bottoms that haven't been worn in the last 7 days are selected
itemsController.availableItems = (req, res, next) => {
  const { user } = req.body;

  pool.query(`SELECT * FROM items WHERE type='shoes' AND "user" = $1`, [user])
    .then(results => {
      res.locals.items = {};
      res.locals.items.shoes = results.rows;
      return pool.query(`SELECT * FROM items WHERE type = 'top' AND date < NOW() - INTERVAL '7 days' AND "user" = $1`, [user]);
    })
    .then(results => {
      res.locals.items.tops = results.rows;
      return pool.query(`SELECT * FROM items WHERE type = 'bottom' AND date < NOW() - INTERVAL '7 days' AND "user" = $1`, [user]);
    })
    .then(results => {
      res.locals.items.bottoms = results.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: `itemsController.availableItems: ERROR: ${err}`,
        message: { err: 'itemsController.availableItems: ERROR: Check server logs for details'}
      });
    })
}

itemsController.filterOutfits = (req, res, next) => {
  let filter = '';
  const { weather, user } = req.body;

  // when the whether option is selected, add the condition to the query
  if (weather) {
    filter = ` AND weather = '${weather.value}' `;
  }

  // create items object to store the filtered shoes, bottoms, and tops
  // and stores in res.locals then pass to the next midware
  pool.query(`SELECT * FROM items WHERE type='shoes'${filter} AND "user" = $1`, [user])
    .then(results => {
      // results contains all the shoes that has same whether value with passed one
      res.locals.items = {};
      res.locals.items.shoes = results.rows;
      return pool.query(`SELECT * FROM items WHERE type = 'top'${filter}AND date < NOW() - INTERVAL '7 days' AND "user" = $1`, [user])
    })
    .then(results => {
      // results contains all the tops that has same whether value with passed one
      res.locals.items.tops = results.rows;
      return pool.query(`SELECT * FROM items WHERE type = 'bottom'${filter}AND date < NOW() - INTERVAL '7 days' AND "user" = $1`, [user])
    })
    .then(results => {
      // results contains all the bottoms that has same whether value with passed one
      res.locals.items.bottoms = results.rows;
      return next();
    })
    .catch((err) => {
      return next({
        log: `itemsController.filterOutfits: ERROR: ${err}`,
        message: { err: 'itemsController.filterOutfits: ERROR: Check server logs for details'}
      });
    })
}

// changes date of items that were selected
itemsController.updateItemsDate = (req, res, next) => {

  const { top, bottom, shoes } = req.body;

    pool.query(`UPDATE items SET date = NOW() WHERE id IN ($1, $2, $3)`, [top, bottom, shoes])
    .then(results => {
      return next();
    })
    .catch((err) => {
      return next({
        log: `itemsController.updateItemsDate: ERROR: ${err}`,
        message: { err: 'itemsController.updateItemsDate: ERROR: Check server logs for details'}
      });
    })
}

// updates dates of items for deleted outfit in history
itemsController.updateItemDates  = (req, res, next) => {

  const { topId, bottomId, shoesId } = req.body;

  // TODO: Change date to 8 days ago, dynamically
  pool.query(`UPDATE items SET date='2019-09-05' WHERE id IN ($1, $2, $3)`, [topId, bottomId, shoesId], (err, results) => {
    if (err) {
      return next({
        log: `itemsController.updateItemDates: ERROR: ${err}`,
        message: { err: 'itemsController.updateItemDates: ERROR: Check server logs for details'}
      });
    }
    
    return next();
  })
}

// properties sent from the client in req.body are inserted into database
itemsController.addItem = (req, res, next) => {

  const {color, type, weather, isFormal, user} = req.body;

  pool.query(`INSERT INTO items (file, type, weather, formal, color, "user") VALUES ($1, $2, $3, $4, $5, $6)`, [req.file.filename, type, weather, isFormal, color, user])
    .then(res =>{
      return next();
    })
    .catch((err) => {
      return next({
        log: `itemsController.addItem: ERROR: ${err}`,
        message: { err: 'itemsController.addItem: ERROR: Check server logs for details'}
      });
    });
}

// itemsController.getUploads = (req, res, next) => {

//   pool.query(`SELECT image FROM items`, (err, results) => {
//     if (err) return next({log: 'Error getting images from DB', message: 'Error in getUploads'});
//     console.log('results is', results)
//     res.locals.uploads = results.rows[2].imgfile_name;
//     next();
//   })
// }


module.exports = itemsController;
