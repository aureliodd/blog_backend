'use strict';


var mongoose = require('mongoose'),
  Post = mongoose.model('Posts');


exports.list_all_posts = function(req, res) {

  var query = req.query;

  Post.find(query,function(err, post) {
    
    if (err)
      res.send(err);

    res.json(post);
    
  });
}



exports.create_a_post = function(req, res) {
    
    if(req.body.creator == null || req.body.creator == "")
        req.body.creator = undefined;

    var new_post = new Post(req.body);

  new_post.save(function(err, post) {
    if (err) res.send(err);
    res.json(post);
  });
};


exports.delete_a_post = function(req, res) {
  Post.remove({
    _id: req.params.postId},
    function(err, post) {
    if (err)
      res.send(err);
    res.json({ message: 'Post successfully deleted' });
  });
};

exports.patch_a_post = function(req, res) { 

  Post.findOneAndUpdate({_id : req.params.postId}, 
    {$set: req.body}, 
    function(err,post){
      if (err)
        res.send(err);
      res.json({ message: 'Post successfully modified' });
    }
  ); 

}