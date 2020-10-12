'use strict';
module.exports = function(app) {
  var posts = require('../controllers/blogController');

  // Routes
  app.route('/posts')
    .get(posts.list_all_posts)
    .post(posts.create_a_post);


  app.route('/posts/:postId') 
    .delete(posts.delete_a_post)
    .patch(posts.patch_a_post);
};