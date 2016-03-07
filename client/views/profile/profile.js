Template.profileForm.helpers({
    isFormShow: function() {
        return (!Session.get('userId'));
    }
});


Template.profileForm.events({
    'submit #submitProfile': function(event,template){
        event.preventDefault();
        var userProfile = {
            name: $('#name').val(),
            id: $('#id').val(),
            age: parseInt($('#age').val()),
            gender: $('#gender input:radio:checked').val(),
            major: $('#major').val()

        };

        var questions = {
            believe: parseInt($('#believe input:radio:checked').val()),
            honest: parseInt($('#honest input:radio:checked').val()),
            prefer: parseInt($('#prefer input:radio:checked').val()),
            mostHonest: parseInt($('#mostHonest input:radio:checked').val())
        };
        console.log(userProfile, questions);

        Meteor.call('updateProfile',userProfile,questions,function(err, result){
            if(!err) {
                sAlert.success('Profile information Updated Successfully');
                Session.set('userId', result);
            }

        });
    }
});