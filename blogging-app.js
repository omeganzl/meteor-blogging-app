Posts = new Mongo.Collection('posts');

if (Meteor.isClient) {
	// This code only runs on the client
	Template.body.helpers({
		//Retrieve all the posts
		posts: function() {
			return Posts.find({}, {sort: {date: -1}});
		}
	});

	//Handle the post events
	Template.body.events({
		'submit .new-post': function (e) {

			e.preventDefault();

			var title = e.target.title.value;
			var body = e.target.body.value;

			var newPost = {
				title: title,
				body: body,
			}

			//Insert a task into the collection
			Meteor.call('addPost', newPost)

			//Clear Form
			e.target.title.value = '';
			e.target.body.value = '';
		}
	});

	Template.post.helpers({
		editing: function() {
			return Session.equals('editPostId', this._id);
		}
	});

	Template.post.events({
		'click .edit': function() {
			Session.set('editPostId', this._id);
		},
		'click .delete': function() {
			Meteor.call('deletePost', this._id);
		},
		'click .cancel': function() {
			Session.set('editPostId', null);
		},
		'submit .edit-post': function(e) {
			console.log('editing');
			e.preventDefault();

			var title = e.target.title.value;
			var body = e.target.body.value;

			var updatedPost = {
				title: title,
				body: body,
			}

			Meteor.call('editPost', updatedPost, this._id)

			e.target.editTitle.value = '';
			e.target.editBody.value = '';
			Session.set('editPostId', null);
		}
	});

	Accounts.ui.config({
		passwordSignupFields: 'USERNAME_ONLY'
	});
}

Meteor.methods({
	addPost: function(newPost) {
		Posts.insert({
			title: newPost.title,
			body: newPost.body,
			date: new Date(),
			owner: Meteor.userId(),
			username: Meteor.user().username
		});
	},
	editPost: function(updatedPost, postId) {
		var post = Posts.findOne(postId);
		if (post.username !== Meteor.user().username){
			alert('You do not have permission to edit that post');
			throw new Meteor.Error('not-authorized');
		}
		Posts.update(postID, {$set: updatedPost});
	},
	deletePost: function (postId) {
		var post = Posts.findOne(postId);
		if (post.username !== Meteor.user().username) {
			alert('You do not have permission to edit that post');
			throw new Meteor.Error('not-authorized');
		}
		Posts.remove(postId);
	},
});