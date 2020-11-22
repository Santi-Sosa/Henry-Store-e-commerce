const { Router } = require('express');
// import all routers;
const productRouter = require('./product.js');
const categoriesRouter = require('./categories.js');
const usersRouter = require('./users.js');
const ordersRouter = require('./orders.js');
const reviewsRouter = require('./reviews.js');
const authRouter = require('./auth.js');
const checkoutsRouter = require('./checkouts.js');
const imgRouter = require('./images.js');

const router = Router();

// load each router on a route
// i.e: router.use('/auth', authRouter);
// router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use('/categories', categoriesRouter);
router.use('/users', usersRouter);
router.use('/orders', ordersRouter);
router.use('/reviews', reviewsRouter);
router.use('/auth', authRouter);
router.use('/checkouts', checkoutsRouter);
router.use('/images', imgRouter);

module.exports = router;