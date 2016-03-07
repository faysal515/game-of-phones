Template.viewScores.helpers({
    scores: function(){
      return Leaderboard.find();
    },
    reactiveSettings: function () {
        return {
            rowsPerPage: 20,
            showFilter: true,
            showNavigation: 'always',
            class: "table table-striped table-hover",
            id: 'reactive-table-leaderboard',
            fields: [
                {
                    key: 'user.profile.name',
                    label: 'Name'
                },
                {
                    key: 'score',
                    label:  'Score'
                }


            ]
        };
    }
});