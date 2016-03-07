if(Meteor.isClient) {
    Meteor.startup(function(){
        Meteor.subscribe('userDetails');
        Meteor.subscribe('scores');
    });
}

Router.configure({
    layoutTemplate: 'masterLayout',
    loadingTemplate: 'loading',
    notFoundTemplate: 'pageNotFound',
    yieldTemplates: {
        nav: {to: 'nav'},
        footer: {to: 'footer'}
    }
});

Router.route('/game',{
   name: 'game',
    template: 'game'
});

Router.route('/profile', {
    name: 'view.profile',
    //waitOn: function () {
    //    return Meteor.subscribe('users.self');
    //},
    template: 'profileForm'
});

Router.route('/leaderboard', {
    name: 'view.scores'
    //waitOn: function () {
    //    return Meteor.subscribe('scores');
    //},

});

Router.route('/',{
    name: 'home',
    template: 'home'
});

Router.plugin('ensureSignedIn', {
  only: []
});

//Routes
AccountsTemplates.configureRoute('changePwd');
AccountsTemplates.configureRoute('enrollAccount');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('verifyEmail');
