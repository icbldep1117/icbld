/**
 * We will want to move a lot of the logic that is in Audio_File_PLayer into this file.
 **/

function SoundService() {
}

SoundService.SOUND_ENABLED_LOCAL_STORAGE_NAME = "SERVER_LOGIN_INFO";

//Duplicated from server_user_is_logged_in
SoundService.enableSound = function(enabled) {
    localStorage.setItem(SoundService.SOUND_ENABLED_LOCAL_STORAGE_NAME, enabled);
};

SoundService.isSoundEnabled = function() {
    var enabled = localStorage.getItem(SoundService.SOUND_ENABLED_LOCAL_STORAGE_NAME);
    //Enabled by default
    if (enabled === null || enabled === "true") {
        return true;
    } else {
        return false;
    }
};
