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
    self.gameOver = new ReactiveVar(false);

    Session.set('joshuaFaultyList', [29,1,14,23,25,21,30]);
    Session.set('brandonFaultyList', [2,11,4,5,28,21,7]);


   // for joshua
    if(self.counter.get() == 1) {
        //var faultyJ = isFaulty();
        //console.log(faulty, '<<< joshua');
        if( _.contains(Session.get('joshuaFaultyList'), self.counter.get() ) ) {
            //self.jCounter.set(self.jCounter.get() + 1);
            self.jCurrent.set(62000);
            self.jUtility.set(42000);
        } else {
            self.jCurrent.set(62000);
            self.jUtility.set(62000);
        }
    }

    // for brandon
    if(self.counter.get() == 1) {
        //var faultyB = isFaulty();
        //console.log(faulty, '<<< brandon');
        if( _.contains(Session.get('brandonFaultyList'), self.counter.get() )) {
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
    gameOver: function() {
      return (Template.instance().gameOver.get());
    },
    brandon: function() {
        return Template.instance().bCurrent.get();
    },

    joshua: function() {
        return Template.instance().jCurrent.get();
    },
    average: function() {
        var scores = Leaderboard.find({}, { fields: { score:1 } }).map(function(data){ return data.score; } );

        var avg = _.reduce(scores, function(memo, num) {
                return memo + num;
            }, 0) / (scores.length === 0 ? 1 : scores.length);

        //console.log('...', avg);

        return parseInt(avg);
    },

    highest: function() {
        var scores = Leaderboard.find({},{ fields:{ score:1 } }).map(function(data){ return data.score; });

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
            if (template.jUtility.get() === 52000) {
                sAlert.success('Congrats! You have bought a brand new iPhone at Tk. 62,000. Your net utility is Tk. 62,000');
            } else {
                sAlert.error('Oops! You have bought a refurbished iPhone at Tk. 62,000. Your net utility is Tk. 42,000');
            }
            template.counter.set(template.counter.get() + 1);
        }
        else {
            template.score.set(template.score.get() + template.bUtility.get());
            if( template.bUtility.get() == 52000) {
                sAlert.info('Great! You have bought a refurbished iPhone at Tk. 52,000. Your net utility is Tk. 52,000');
            } else {
                sAlert.success('Congrats! You have bought a brand new iPhone at Tk. 62,000. Your net utility is Tk. 62,000');
            }
            template.counter.set(template.counter.get() + 1);
        }

        //clearing all radio selection
        $('#r1').prop('checked', false);
        $('#r2').prop('checked', false);



        if(template.counter.get() < 30) {
            if( _.contains(Session.get('joshuaFaultyList'), template.counter.get() ) ) {
                template.jCounter.set(template.jCounter.get() + 1);
                template.jCurrent.set(62000);
                template.jUtility.set(42000);
            } else {
                template.jCurrent.set(62000);
                template.jUtility.set(62000);
            }

            if( _.contains(Session.get('brandonFaultyList'), template.counter.get() ) ) {
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
                    template.gameOver.set(true);
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
    return Math.random()< 0.5;
}
