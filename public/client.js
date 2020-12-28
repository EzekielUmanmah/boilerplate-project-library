$( document ).ready(function() {
  let  items = [];
  let  itemsRaw = [];
  
  //this script runs every time index.html loads/reloads or if a new book is created via #sampleui
  $.getJSON('/api/books', function(data) { 
    //let  items = [];
    itemsRaw = data;
    $.each(data, function(i, val) {
      items.push('<li class="bookItem" id="' + i + '">' + val.title + ' - ' + val.commentcount + ' comments</li>');
      return ( i !== 14 );
    });
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    $('<ul/>', {
      'class': 'listWrapper',
      html: items.join('')
      }).appendTo('#display');
  });
  
  let  comments = [];
  //enable individual book selection
  $('#display').on('click','li.bookItem',function() { 
    //render the selected book title and id
    $("#detailTitle").html('<b>'+itemsRaw[this.id].title+'</b> (id: '+itemsRaw[this.id]._id+')'); 
    //send a GET request to '/api/books/:id' returning all info for the selected book
    $.getJSON('/api/books/'+itemsRaw[this.id]._id, function(data) {
      //using closure, redefine comments so that it only holds the comments for the selected book; otherwise everything pushed to comments will be 'remembered', concating everything pushed to comments as the user changes book selection
      comments = []; 
      //iterate through the comments field of the selected book and make it a list item and push into comments
      $.each(data.comments, function(i, val) {
        comments.push('<li>' +val+ '</li>');
      });
      //since the newBook submission button and deleteBook button are both outside the form element, they will not reload the page by default
      //push a form element to add additional comments
      comments.push('<br><form id="newCommentForm"><input style="width:300px" type="text" class="form-control" id="commentToAdd" name="comment" placeholder="New Comment"></form>');
      //the buttons to addComment and deleteBook receive the bookid used in their handlers to send a request to '/api/books/:id'
      comments.push('<br><button class="btn btn-info addComment" id="'+ data._id+'">Add Comment</button>');
      comments.push('<button class="btn btn-danger deleteBook" id="'+ data._id+'">Delete Book</button>');
      $('#detailComments').html(comments.join(''));
    });
  });
  
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        //update list
        $('#detailComments').html('<p style="color: red;">'+data+'<p><p>Refresh the page</p>');
      }
    });
  });  
  
  $('#bookDetail').on('click','button.addComment',function(e) {
    let  newComment = $('#commentToAdd').val();
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) { 
        //adds new comment to top of list'<li>' +newComment+ '</li>'; added the <li> tag so newComment renders as a proper list item
        comments.unshift('<li>' +newComment+ '</li>');
        $('#detailComments').html(comments.join(''));
      }
    });
  });
  
  $('#newBook').click(function() { 
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) { //alert(JSON.stringify(data))
        //update list
        //for a better user experience, not reloading the page but adding the newly created book to the list; currently the new book does not have a commentcount field and cannot click on the new book from the list
        //items.push('<li class="bookItem">' + data.title + ' - ' + data.commentcount + ' comments</li>')
        //itemsRaw.unshift(data)
        //$('#display').html('<ul>'+items.join('')+'</ul>');
        //$('.listWrapper').html(items.join(''))
        //there is no need to define the success function because the page reloads and resends the first script
      }
    });
  });
  
  $('#deleteAllBooks').click(function() {
    //in order to serve the correct response 'complete delete successful', dataType must be commented out if the msg is not json (res.send(errMessg)). Then the display element #detailComments must have its html set to data which will contain the response message for successful complete delete.
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      //data: $('#newBookForm').serialize(),
      success: function(data) { 
        //render the success message on successful delete
        $('#display').html(data);
      }
    });
  }); 
  
});