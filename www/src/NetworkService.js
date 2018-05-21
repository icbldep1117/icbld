/**
 * For now the purpose of this service is to do all the background service/network work. In the future we will want to
 * move all of the network connection stuff to this service.
 **/

function NetworkService() {
}

NetworkService.SERVER_URL = "http://server.insidecoach.net/api/";
NetworkService.SERVER_LOGIN_LOCAL_STORAGE_NAME = "SERVER_LOGIN_INFO";

//Duplicated from server_user_is_logged_in
NetworkService.isUserLoggedIn = function() {
    var login = JSON.parse(localStorage.getItem(NetworkService.SERVER_LOGIN_LOCAL_STORAGE_NAME));
    if (login === null) {
        return false;
    }
    return true;
};

/**
 *
 * @returns {string} - the token
 * @private
 */
//Duplicated from server_get_login_token
NetworkService._getUserToken = function() {
    //TODO thing about how we store the username and password/token
    var login = JSON.parse(localStorage.getItem(NetworkService.SERVER_LOGIN_LOCAL_STORAGE_NAME));
    if (login === null) {
        return "";
    }
    return login.token;
};

/**
 * This method is called to do the basic action of calling an endpoint.
 * The token is placed in the params automatically.
 *
 * @param type - "GET", "POST", "PUT", "DELETE", etc.
 * @param endpoint - the endpoint example: "api/ping"
 * @param params - the params to be sent to the server
 * @returns {promise}
 * @public
 */
NetworkService.doAuthHttpCallAsync = function(type, endpoint, params) {
    if (params) {
        params.token = NetworkService._getUserToken();
    } else {
        params = {
            token: NetworkService._getUserToken()
        }
    }
    return NetworkService.doHttpCallAsync(type, NetworkService.SERVER_URL + endpoint, params);
};

/**
 * This method is called to do the basic action of calling an endpoint. It will return a promise.
 *
 * @param type - "GET", "POST", "PUT", "DELETE", etc.
 * @param url - the path where we are calling: example - "http://server.insidecoach.net/api/ping"
 * @param params - the params to be sent to the server
 * @returns {promise}
 * @public
 */
NetworkService.doHttpCallAsync = function(type, url, params) {
    return new Promise(function(resolve, reject) {
        $.ajax({
            type: type,
            headers: {Accept: "application/json"},
            url: url,
            data: params,
            success: function(msg) {
                console.log("SUCCESS!!!");
                resolve(msg);
            },
            error: function(msg, ajax_options, thrown_error) {
                //TODO think about if the token is expired. Maybe log the user out?
                console.log("ERROR!!");
                reject(msg);
            }
        });
    });
};