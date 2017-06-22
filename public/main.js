var SpacebookApp = function () {

  var posts = [];

  var $posts = $(".posts");

  function getApiData() {
    url = '/api';
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: url,
      success: function (data) {
        posts = data || [];
        _renderPosts();
      }
    });
  }
  getApiData();

  function _renderPosts() {
    $posts.empty();
    var source = $('#post-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts.length; i++) {
      var newHTML = template(posts[i]);
      // console.log(newHTML);
      $posts.append(newHTML);
      _renderComments(i)
    }
  }

  function addPost(newPost) {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: '/api/addPost',
      data: {
        text: newPost,
        comments: []
      },
      success: function (data) {
        posts.push(data);
        _renderPosts();
      }
    });
  }

  function _renderComments(postIndex) {
    var post = $(".post")[postIndex];
    $commentsList = $(post).find('.comments-list')
    $commentsList.empty();
    var source = $('#comment-template').html();
    var template = Handlebars.compile(source);
    for (var i = 0; i < posts[postIndex].comments.length; i++) {
      var newHTML = template(posts[postIndex].comments[i]);
      $commentsList.append(newHTML);
    }
  }

  var removePost = function (index) {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: '/api/removePost',
      data: {
        _id: posts[index]['_id']
      },
      success: function (data) {
        posts.splice(index, 1);
        _renderPosts();
      },
      error: function (jqXHR, exception) {
        console.log(jqXHR, exception);
      }
    });

  };

  var addComment = function (newComment, postIndex) {
    $.ajax({
      type: 'POST',
      dataType: 'json',
      url: '/api/addComment',
      data: {
        data: newComment,
        _id: posts[postIndex]['_id']
      },
      success: function (data) {
        posts[postIndex]
          .comments
          .push(newComment);
        _renderComments(postIndex);
      }
    });

  };

  var deleteComment = function (postIndex, commentIndex) {
    $.ajax({
      type: 'DELETE',
      dataType: 'json',
      url: '/api/deleteComment',
      data: {
        _id: posts[postIndex]['_id'],
        comment_id: posts[postIndex]['comments'][postIndex]['_id']
      },
      success: function (data) {
        posts[postIndex]
          .comments
          .splice(commentIndex, 1);
        _renderComments(postIndex);
      }
    });

  };

  return {addPost: addPost, removePost: removePost, addComment: addComment, deleteComment: deleteComment};
};

var app = SpacebookApp();

$('.post-form').on('click', function () {
  var $input = $("#postText");
  if ($input.val() === "") {
    alert("Please enter text!");
  } else {
    app.addPost($input.val());
    $input.val("");
  }
});

var $posts = $(".posts");

$posts.on('click', '.remove-post', function () {
  var index = $(this)
    .closest('.post')
    .index();;
  app.removePost(index);
});

$posts.on('click', '.toggle-comments', function () {
  var $clickedPost = $(this).closest('.post');
  $clickedPost
    .find('.comments-container')
    .toggleClass('show');
});

$posts.on('click', '.add-comment', function () {

  var $comment = $(this).siblings('.comment');
  var $user = $(this).siblings('.name');

  if ($comment.val() === "" || $user.val() === "") {
    alert("Please enter your name and a comment!");
    return;
  }

  var postIndex = $(this)
    .closest('.post')
    .index();
  var newComment = {
    text: $comment.val(),
    user: $user.val()
  };

  app.addComment(newComment, postIndex);

  $comment.val("");
  $user.val("");

});

$posts.on('click', '.remove-comment', function () {
  var $commentsList = $(this)
    .closest('.post')
    .find('.comments-list');
  var postIndex = $(this)
    .closest('.post')
    .index();
  var commentIndex = $(this)
    .closest('.comment')
    .index();

  app.deleteComment(postIndex, commentIndex);
});
