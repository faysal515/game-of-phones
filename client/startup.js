Meteor.startup(function () {
    sAlert.config({
        effect: 'jelly',
        position: 'bottom-right',
        timeout: 2000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0 // in px - will be added to first alert (bottom or top - depends of the position in config)

    });
});