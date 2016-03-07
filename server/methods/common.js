/**
 * Created by Faysal on 2/21/2016.
 */

Meteor.methods({
    'updateProfile' : function(userProfile,questions) {

        try{
            check(userProfile,Schemas.UserProfile);
            check(questions,Schemas.Questionnaires);

            var user = UserInformation.insert({
                profile: userProfile,
                questionnaires:questions
            });

            return user;

        } catch(e) {
            throw new Meteor.Error(403, e);
        }
    },
    sendScore: function(score,userId) {
        try{
            check(score,Number);
            check(userId,String);
            console.log('adfadf');
            console.log(userId);
            var user = UserInformation.findOne({_id: userId});
            Leaderboard.insert({
               user: user,
               score: score
            });


        }catch(e) {
            throw new Meteor.Error(403, 'Unable to send score into leader Board: '+e);
        }
    }
});