// postShuffle -- web forum software for node.js
// Copyright (c) 2012 Mooneer Salem

function loadInitialPosts(jsonData)
{
    window.Posts.reset(jsonData.posts);
}

// Set up AJAX spinner.
$.ajaxSetup({
    beforeSend:function(){
        // show gif here, eg:
        $("#spinner").show();
    },
    complete:function(){
        // hide gif here, eg:
        $("#spinner").hide();
    }
});

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
        
        parse: function(resp, xhr) {
            return resp.result || resp;
        },
        
        initialize: function() { },
        
    });
    
    var PostList = Backbone.Collection.extend({
        
        model: Post,
        
        url: '/post',
        
        parse: function(resp, xhr) {
            return resp.result.posts;
        },
        
        comparator: function(obj, obj2) {
            var d1 = new Date(obj.get('create_date')).valueOf();
            var d2 = new Date(obj2.get('create_date')).valueOf();
            if (d1 == d2) return 0;
            else if (d1 < d2) return 1;
            else return -1;
        }
    });
    
    window.Posts = new PostList();
    
    var PostView = Backbone.View.extend({
        
        tagName: 'li',
        
        className: 'post',
        
        events: {
            'click .postTitle': 'expandBody'
        },
        
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
        },
        
        expandBody: function() {
            this.$('.postBody').css('display', 'block');
            this.events['click .postTitle'] = 'hideBody';
            this.delegateEvents();
        },
        
        hideBody: function() {
            this.$('.postBody').css('display', 'none');
            this.events['click .postTitle'] = 'expandBody';
            this.delegateEvents();
        }
    });
    
    var PostListView = Backbone.View.extend({
        
        el: $("#app"),
        
        initialize: function() {
    
          window.Posts.bind('add', this.addOne, this);
          window.Posts.bind('reset', this.addAll, this);
          window.Posts.bind('all', this.render, this);
    
        },
    
        events: {
            'click .addPostButton': 'submitNewPost',
            'click .moreLink': 'loadMore',
        },
        
        render: function() {
        },
        
        loadMore: function() {
            window.Posts.fetch({
                data: {offset: window.Posts.length},
                add: true});
        },
        
        submitNewPost: function() {
            var tag_list_html = $("#newPostForm .postTags li");
            var tags = [];
            for (var i in tag_list_html)
            {
                tags.push(tag_list_html[i].innerText);
            }
            console.log(tag_list_html);
            
            window.Posts.create({
                title: $('#newPostForm #title').val(),
                body: $('#newPostForm #body').val(),
                create_date: new Date(), // needed to ensure correct ordering
                tags: tags
            }, {wait: true});
        },
        
        addOne: function(item) {
          var view = new PostView({model: item});
          this.$("#postList").append(view.render().el);
        },
        
        addAll: function() {
            if (window.Posts.length > 0)
            {
                window.Posts.each(this.addOne);
            }
            else
            {
                this.$("#postList").append(_.template($('#noPostTemplate').html()));
            }
        },
        
        clearCompleted: function() {
          _.each(window.Posts.done(), function(post){ post.clear(); });
          return false;
        },
    
    });

    var app = new PostListView;

});