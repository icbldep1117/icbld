function UpgradeService() {
}

//1. Change this by +1
UpgradeService.CURRENT_VERSION = 1;

UpgradeService.VERSION_LOCAL_STORAGE_KEY = "version local storage key";

UpgradeService.runUpgradeCodeIfNeeded = function() {
    var oldVersion = UpgradeService._getOldVersion();

    if (UpgradeService.CURRENT_VERSION === oldVersion) {
        return;
    }

    if (oldVersion < 1) {
        UpgradeService.run_1_0_upgrade();
    }

    //2. Add another oldVersion < x

    UpgradeService._setCurrentVersion();
};

UpgradeService.run_1_0_upgrade = function() {
    localStorage.setItem(UserService.SERVER_LOGIN_LOCAL_STORAGE_NAME, null);
    localStorage.setItem(UserService.EDIT_PROFILE_LOCAL_STORAGE_NAME, null);

};

UpgradeService._setCurrentVersion = function() {
    localStorage.setItem(UpgradeService.VERSION_LOCAL_STORAGE_KEY, UpgradeService.CURRENT_VERSION.toString());
};

UpgradeService._getOldVersion = function() {
    var version = localStorage.getItem(UpgradeService.VERSION_LOCAL_STORAGE_KEY);
    if (!version) {
        return 0;
    } else {
        return parseFloat(version);
    }
};