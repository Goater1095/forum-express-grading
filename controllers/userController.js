const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;
const fs = require('fs');
const { getRestaurant } = require('./restController');
const Restaurant = db.Restaurant;
const Comment = db.Comment;
const Favorite = db.Favorite;

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup');
  },

  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', '兩次密碼輸入不同！');
      return res.redirect('/signup');
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then((user) => {
        if (user) {
          req.flash('error_messages', '信箱重複！');
          return res.redirect('/signup');
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(
              req.body.password,
              bcrypt.genSaltSync(10),
              null
            ),
          }).then((user) => {
            req.flash('success_messages', '成功註冊帳號！');
            return res.redirect('/signin');
          });
        }
      });
    }
  },
  signInPage: (req, res) => {
    return res.render('signin');
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！');
    res.redirect('/restaurants');
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！');
    req.logout();
    res.redirect('/signin');
  },
  getUser: (req, res) => {
    //  res.render('userProfile');  只要render 從locals取來的使用者資訊即可

    //A19作業需求 需要傳user出去才會過測試
    return User.findByPk(req.params.id, {
      include: [{ model: Comment, include: [Restaurant] }],
    }).then((user) => {
      // console.log(user.toJSON());
      console.log(user.toJSON().Comments);
      // console.log(user.comment[0].restaurant);
      res.render('userProfile', { user: user.toJSON() });
    });
  },
  editUser: (req, res) => {
    res.render('editUserProfile');
  },
  putUser: (req, res) => {
    const { file } = req;
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error:', err);
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return User.findByPk(req.params.id).then((user) => {
            user
              .update({
                name: req.body.name,
                image: file ? `/upload/${file.originalname}` : user.image,
              })
              .then((user) => {
                req.flash(
                  'success_messages',
                  'User Profile was successfully to update'
                );
                res.redirect('userProfile');
              });
          });
        });
      });
    } else {
      return User.findByPk(req.params.id).then((user) => {
        user
          .update({
            name: req.body.name,
            image: user.image,
          })
          .then((user) => {
            req.flash(
              'success_messages',
              'User Profile was successfully to update'
            );
            res.redirect('userProfile');
          });
      });
    }
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then((restaurant) => {
      return res.redirect('back');
    });
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    }).then((favorite) => {
      favorite.destroy().then((restaurant) => {
        return res.redirect('back');
      });
    });
  },
};

module.exports = userController;
