Meteor.publish('userDetails', function () {
   return UserInformation.find({});
});

Meteor.publish('scores',function(){
    return Leaderboard.find({});
});