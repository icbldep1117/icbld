
GoogleAnalyticsService.CODE = "UA-113456233-1";

//Pages
GoogleAnalyticsService.PAGE_NAME_WIFI_CREDENTIALS = "Ball Wifi Credentials";
GoogleAnalyticsService.PAGE_NAME_CHANGE_PASSWORD = "Change Password";
GoogleAnalyticsService.PAGE_NAME_DIAGNOSTIC = "Diagnostic";
GoogleAnalyticsService.PAGE_NAME_EDIT_PROFILE = "Edit Profile";
GoogleAnalyticsService.PAGE_NAME_FORCEKICK_GAME = "Forcekick Game";
GoogleAnalyticsService.PAGE_NAME_FUNNY_SOUNDS_GAME = "Funny Sounds Game";
GoogleAnalyticsService.PAGE_NAME_GAMES = "Games";
GoogleAnalyticsService.PAGE_NAME_INTRO_CAROUSEL = "Intro Carousel";
GoogleAnalyticsService.PAGE_NAME_LOGIN = "Login";
GoogleAnalyticsService.PAGE_NAME_MY_STATS = "My Stats";
GoogleAnalyticsService.PAGE_NAME_SYNC_STATS = "Sync Stats";
GoogleAnalyticsService.PAGE_NAME_PASSKICK_GAME = "Passkick Game";
GoogleAnalyticsService.PAGE_NAME_PLAYLIST = "Playlist";
GoogleAnalyticsService.PAGE_NAME_RECOVER_BALL_PASSWORD = "Recover Ball Password";
GoogleAnalyticsService.PAGE_NAME_RESET_PASSWORD = "Reset Password";
GoogleAnalyticsService.PAGE_NAME_ROUTINE_TYPE_CONES = "Routine Type Cones";
GoogleAnalyticsService.PAGE_NAME_ROUTINE_TYPE_FLIGHTKICK = "Routine Type Flightkick";
GoogleAnalyticsService.PAGE_NAME_ROUTINE_TYPE_FREEPLAY = "Routine Type Freeplay";
GoogleAnalyticsService.PAGE_NAME_ROUTINE_TYPE_ROLLKICK = "Routine Type Rollkick";
GoogleAnalyticsService.PAGE_NAME_SIGN_UP = "Sign Up";
GoogleAnalyticsService.PAGE_NAME_TERMS_OF_SERVICE = "Terms of Service";
GoogleAnalyticsService.PAGE_NAME_TOPSPIN_GAME = "Topspin Game";

function GoogleAnalyticsService() {
}

GoogleAnalyticsService.prototype.init = function() {
    if (window && window.ga && window.ga.startTrackerWithId) {
        window.ga.startTrackerWithId(GoogleAnalyticsService.CODE, 30);
    }
};

GoogleAnalyticsService.prototype.pageLoaded = function(pageName) {
    if (window && window.ga && window.ga.trackView) {
        window.ga.trackView(pageName);
        console.log("Tracking on analytics: " + pageName);
    }
};