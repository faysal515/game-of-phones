Template.game.onCreated(function(){
    var self = this;
    self.counter = new ReactiveVar(1);
    self.score = new ReactiveVar(0);
    self.bCounter = new ReactiveVar(0);
    self.jCounter = new ReactiveVar(0);
    self.bCurrent = new ReactiveVar(0);
    self.jCurrent = new ReactiveVar(0);
    self.bUtility = new ReactiveVar(0);
    self.jUtility = new ReactiveVar(0);

    Session.set('joshuaFaultyList', []);
    Session.set('brandonFaultyList', []);


   // for joshua
    if(self.counter.get() == 1) {
        var faultyJ = isFaulty();
        //console.log(faulty, '<<< joshua');
        if(faultyJ) {
            self.jCounter.set(self.jCounter.get() + 1);
            self.jCurrent.set(62000);
            self.jUtility.set(42000);
        } else {
            self.jCurrent.set(62000);
            self.jUtility.set(62000);
        }
    }

    // for brandon
    if(self.counter.get() == 1) {
        var faultyB = isFaulty();
        //console.log(faulty, '<<< brandon');
        if(faultyB) {
            self.bCounter.set(self.bCounter.get() + 1);
            self.bCurrent.set(52000);
            self.bUtility.set(52000);
        } else {
            self.bCurrent.set(62000);
            self.bUtility.set(62000);
        }
    }


});

Template.game.helpers({
    counter: function(){
        return Template.instance().counter.get();
    },
    ss: function(){
        return [Template.instance().bCounter.get(), Template.instance().jCounter.get()];
    },
    score: function () {
      return Template.instance().score.get();
    },

    gameOn: function() {
       return (Template.instance().counter.get() < 30 && Session.get('userId'));
    },
    brandon: function() {
        return Template.instance().bCurrent.get();
    },

    joshua: function() {
        return Template.instance().jCurrent.get();
    },
    average: function() {
        var scores = Leaderboard.find({},{fields:{score:1}}).map(function(data){return data.score});

        var avg = _.reduce(scores, function(memo, num) {
                return memo + num;
            }, 0) / (scores.length === 0 ? 1 : scores.length);

        //console.log('...', avg);

        return parseInt(avg);
    },

    highest: function() {
        var scores = Leaderboard.find({},{fields:{score:1}}).map(function(data){return data.score});

        var max  = _.max(scores, function(score){ return score; });

        //console.log(max);

        return max;
    },
    jList: function() {
        return Session.get('joshuaFaultyList');
    },
    bList: function() {
        return Session.get('brandonFaultyList');
    }

});

Template.game.events({
    'submit #gameForm': function(event, template) {
        event.preventDefault();
        var selected = $('#gameForm input:radio:checked').val(), faultyJ, faultyB;

        //console.log(template.jUtility.get());
        if(_.isUndefined(selected)) {
            sAlert.error('please select One option');
            return;
        }
        else if(selected === 'joshua') {
            template.score.set(template.score.get() + template.jUtility.get());
            var text = (template.jUtility.get() >52000) ? 'Congrats! ' : '';
            sAlert.info(text+' your net utility  is '+ template.jUtility.get() + 'BDT');
            template.counter.set(template.counter.get() + 1);
        }
        else {
            template.score.set(template.score.get() + template.bUtility.get());
            sAlert.info('your net utility  is '+ template.bUtility.get() + 'BDT');
            template.counter.set(template.counter.get() + 1);
        }

        //clearing all radio selection
        $('#r1').prop('checked', false);
        $('#r2').prop('checked', false);

        faultyJ = isFaulty();
        faultyB = isFaulty();

        //console.log(faultyJ, faultyB, template.jCounter.get(),template.bCounter.get());

        if(template.counter.get() < 30) {
            if(faultyJ && template.jCounter.get() < 7) {
                var obj =  Session.get('joshuaFaultyList');
                obj.push(template.counter.get());
                Session.set('joshuaFaultyList', obj);
                template.jCounter.set(template.jCounter.get() + 1);
                template.jCurrent.set(62000);
                template.jUtility.set(42000);
            } else {
                template.jCurrent.set(62000);
                template.jUtility.set(62000);
            }

            if(faultyB && template.bCounter.get() < 7) {
                var obj =  Session.get('brandonFaultyList');
                obj.push(template.counter.get());

                Session.set('brandonFaultyList',obj);
                template.bCounter.set(template.bCounter.get() + 1);
                template.bCurrent.set(52000);
                template.bUtility.set(52000);
            } else {
                template.bCurrent.set(62000);
                template.bUtility.set(62000);
            }
        } else {
            //console.log(Session.get('userId'));
            Meteor.call('sendScore',template.score.get(),Session.get('userId'),function(err){
                if(!err) {
                    sAlert.success('your score has been updated to the Leaderboard!');
                }
                else {
                    sAlert.error('Something is wrong!');
                    console.log('errr', err);
                }

            });
        }


    }
});

function isFaulty() {
    return Math.random()<.5;
}