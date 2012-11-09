// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

function loadInitialPosts(jsonData)
{
    window.Posts.reset(jsonData.posts);
}

$(function(){
    
    var Post = Backbone.Model.extend({
        
        defaults: function() {
            return {
                'tags': [],
                'title': '',
                'author': {
                    'username': '',
                    'title': '',
                    'is_moderator': false,
                    'is_admin': false,
                    'joined': new Date()
                },
                'body': '',
                'id': '',
                'create_date': new Date(),
                'update_date': new Date(),
                'num_comments': 0
            };
        },
        
        initialize: function() { },
        
    });
    
    var PostList = Backbone.Collection.extend({
        
        model: Post,
        
    });
    
    window.Posts = new PostList();
    
    var PostView = Backbone.View.extend({
        
        tagName: 'li',
        
        className: 'post',
        
        template: _.template($('#postTemplate').html()),
    
        initialize: function() {
          this.model.bind('change', this.render, this);
          this.model.bind('destroy', this.remove, this);
        },
        
        clear: function() {
          this.model.clear();
        },
        
        render: function() {
          this.$el.html(this.template(this.model.toJSON()));
          return this;
        }
        
    });
    
    var PostListView = Backbone.View.extend({
        
        el: $("#app"),
        
        initialize: function() {
    
          window.Posts.bind('add', this.addOne, this);
          window.Posts.bind('reset', this.addAll, this);
          window.Posts.bind('all', this.render, this);
    
        },
    
        render: function() { },
        
        addOne: function(item) {
          var view = new PostView({model: item});
          this.$("#postList").append(view.render().el);
        },
        
        addAll: function() {
          window.Posts.each(this.addOne);
        },
        
        clearCompleted: function() {
          _.each(window.Posts.done(), function(post){ post.clear(); });
          return false;
        },
    
    });

    var app = new PostListView;

});