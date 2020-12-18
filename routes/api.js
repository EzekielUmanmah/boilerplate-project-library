/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const mongoose = require('mongoose');
const bookSchema = require('../schema');

module.exports = function (app) {

  app.route('/api/books')
    .get((req, res, next) => {

      bookSchema.find()
        .select('-__v')
        .exec()
        .then(result => {
          res.status(200).json(result);
        })
        .catch(next);

    })
    
    .post((req, res, next) => {
      
      const {title} = req.body;

      const book = new bookSchema({
        title
      });

      const response = {
        _id: book._id,
        title: title
      };

      title ? 
      book.save( (err, result) => {
        if(err) return next(err);
        else{
          res.status(201).json(response);
        }
      }) : 
      res.status(404).send('missing required field title');

    })
    
    .delete(function(req, res, next){
      //if successful response will be 'complete delete successful'

      bookSchema.deleteMany({}, (err, result) => {
        if(err) return next(err);
        res.send('complete delete successful');
      });

    });



  app.route('/api/books/:id')
    .get((req, res, next) => {
      let bookid = req.params.id;
      
      bookSchema.findById(bookid, (err, result) => {
        if(err) return next(err);
        if(!result) return res.status(404).send('no book exists');
        else{
          res.status(200).json(result)
        }
      });

    })
    
    .post((req, res, next) => {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if(!comment) return res.status(404).send('missing required field comment');
      //since any request to this route requires the comment field and there will be no comment deletion functionality, simply incrementing commentcount (via $inc) is fine.
      let updateComment = {
        $push : {comments: comment},
        $inc : {commentcount: 1}
      };

      bookSchema.findByIdAndUpdate(bookid, updateComment, {new: true},
      (err, result) => {
        if(err) return next(err);
        if(!result) return res.status(404).send('no book exists');
        else {res.json(result);}
      });

    })
    
    .delete((req, res, next) => {
      let bookid = req.params.id;

      bookSchema.findByIdAndDelete(bookid, (err, result) => {
        if(err) return next(err);
        else if(!result) return res.status(404).send('no book exists');else{
        res.status(200).send('delete successful');}
      });

    });
  
};
