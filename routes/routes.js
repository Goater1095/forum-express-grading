const restController = require('../controllers/restController.js');
const adminController = require('../controllers/adminController.js');
const userController = require('../controllers/userController.js');
const categoryController = require('../controllers/categoryController.js');
const commentController = require('../controllers/commentController.js');
const multer = require('multer');
const upload = multer({ dest: 'temp/' });
const helpers = require('../_helpers');
const { authenticate } = require('passport');

const express = require('express');
const router = express.Router();

const passport = require('../config/passport');

const authenticated = (req, res, next) => {
  // if(req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    return next();
  }
  res.redirect('/signin');
};

const authenticatedAdmin = (req, res, next) => {
  // if(req.isAuthenticated)
  if (helpers.ensureAuthenticated(req)) {
    if (helpers.getUser(req).isAdmin) {
      return next();
    }
    res.redirect('/');
  }
  res.redirect('/signin');
};

//如果使用者訪問首頁，就導向 /restaurants 的頁面
router.get('/', authenticated, (req, res) => res.redirect('/restaurants'));
//在 /restaurants 底下則交給 restController.getRestaurants 來處理
router.get('/restaurants', authenticated, restController.getRestaurants);
router.get('/restaurants/feeds', authenticated, restController.getFeeds);
router.get('/restaurants/:id', authenticated, restController.getRestaurant);
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard);
//comment
router.post('/comments', authenticated, commentController.postComment);
router.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment);
//favorite
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite);
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite);
//like
router.post('/like/:restaurantId', authenticated, userController.addLike);
router.delete('/like/:restaurantId', authenticated, userController.removeLike);

//User profile
router.get('/users/:id', authenticated, userController.getUser);
router.get('/users/:id/edit', authenticated, userController.editUser);
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser);

// 連到 /admin 頁面就轉到 /admin/restaurants
router.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'));
// 在 /admin/restaurants 底下則交給 adminController.getRestaurants 處理
router.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants);
router.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant);
router.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant);
router.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant);
router.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant);
router.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant);
router.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant);
router.get('/admin/users', authenticatedAdmin, adminController.getUsers);
router.put('/admin/users/:id/toggleAdmin', authenticatedAdmin, adminController.toggleAdmin);
//categoryController
router.get('/admin/categories', authenticatedAdmin, categoryController.getCategories);
router.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories);
router.post('/admin/categories', authenticatedAdmin, categoryController.postCategory);
router.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory);
router.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory);

//userController
router.get('/signup', userController.signUpPage);
router.post('/signup', userController.signUp);
router.get('/signin', userController.signInPage);
router.post(
  '/signin',
  passport.authenticate('local', {
    failureRedirect: '/signin',
    failureFlash: true,
  }),
  userController.signIn
);
router.get('/logout', userController.logout);

module.exports = router;
