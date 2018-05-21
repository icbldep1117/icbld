function UserService() {
}

UserService.SERVER_LOGIN_LOCAL_STORAGE_NAME = "SERVER_LOGIN_INFO";
UserService.EDIT_PROFILE_LOCAL_STORAGE_NAME = "GLOBAL_EDIT_PROFILE_INFO";

UserService.doLoginAsync = function(email, password) {
    var params =
        {
            email: email,
            password: password
        };

    return NetworkService.doHttpCallAsync("POST", NetworkService.SERVER_URL + "auth/login", params)
        .then(function(response) {
            if (response && response.hasOwnProperty("success") && response.success) {
                UserService._saveLoginData(response.token, response.nickname, response.username, response.profile_image);
            } else {
                return Promise.reject(response);
            }
        })
        .then(function() {
            return UserService.fetchAndSaveUserDetailsAsync();
        });

};

UserService.fetchAndSaveUserDetailsAsync = function() {
    return UserService.fetchUserDetailsAsync().then(function(response) {
        var userDetails = response["User Details"];
        UserService._saveUserDetailsData(userDetails);
        return userDetails;
    });
};

UserService.fetchUserDetailsAsync = function() {
    return NetworkService.doAuthHttpCallAsync("POST", "auth/user-details");
};

UserService.getUserId = function() {
    var userDetails = JSON.parse(localStorage.getItem(UserService.EDIT_PROFILE_LOCAL_STORAGE_NAME));
    return userDetails ? userDetails.id : null;
};

UserService._saveUserDetailsData = function(userDetails) {
    localStorage.setItem(UserService.EDIT_PROFILE_LOCAL_STORAGE_NAME, JSON.stringify(userDetails));
};

UserService._saveLoginData = function(token, nickname, full_name, profile_image) {
    localStorage.setItem(UserService.SERVER_LOGIN_LOCAL_STORAGE_NAME, JSON.stringify({token:token, nickname:nickname, full_name:full_name, profile_image:profile_image}));
};

