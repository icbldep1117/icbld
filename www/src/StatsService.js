function StatsService() {
}

StatsService.LAST_FETCH_TIME = "last fetch time";
StatsService.LAST_PUSH_TIME = "last push time";

StatsService.getLastFetchTime = function() {
    var lastFetchString = localStorage.getItem(StatsService.LAST_FETCH_TIME);
    var lastFetchTime = Number.parseInt(lastFetchString ? lastFetchString : "0");
    return lastFetchTime;
};

StatsService.getLastPushTime = function() {
    var lastPushString = localStorage.getItem(StatsService.LAST_PUSH_TIME);
    var lastPushTime = Number.parseInt(lastPushString ? lastPushString : "0");
    return lastPushTime;
};

StatsService.hasFetchedWithinLastHour = function() {
    var now = (new Date()).getTime();

    var lastFetchTime = StatsService.getLastFetchTime();

    var oneHourInMillies = 60 * 60 * 1000;
    if ((lastFetchTime + oneHourInMillies) > now) {
        return true;
    }
    return false;
};

StatsService.hasPushedWithinLastHour = function() {
    var now = (new Date()).getTime();

    var lastPushTime = StatsService.getLastPushTime()

    var oneHourInMillies = 60 * 60 * 1000;
    if ((lastPushTime + oneHourInMillies) > now) {
        return true;
    }
    return false;
};

StatsService.clearAllNonTempStatsData = function() {
    var games = GamesService.getGames();
    for (var i = 0; i < games.length; i++) {
        var game = games[i];
        StatsService._resetGameStatsByGameType(game.getType(), false);
    }
    localStorage.setItem(StatsService.LAST_FETCH_TIME, "0");
};

StatsService.fetchLatestGameStatsAsync = function() {
    if (!server_user_is_online()) {
        return Promise.reject();
    }

    var categoryPromises = [];

    var lastFetchTime = localStorage.getItem(StatsService.LAST_FETCH_TIME);
    var now = new Date();

    //TODO later we might deal with other game category ids, for now just these two.
    var categoryIds = [1, 2];
    for (var i = 0; i < categoryIds.length; i++) {
        var categoryId = categoryIds[i];
        var params = {
            category_id: categoryId,
            dateFrom: lastFetchTime ? StatsService._getServerDateString(new Date(parseInt(lastFetchTime))) : StatsService._getServerDateString(new Date(0)),
            dateTo: StatsService._getServerDateString(now)
        };

        //fetch all data between (lastFetchTime and NOW)
        var promise = NetworkService.doAuthHttpCallAsync("POST", "session/list", params).then(function(response) {
            StatsService._storeFetchedCategoryResponse(response);
        });
        categoryPromises.push(promise);
    }


    return Promise.all(categoryPromises).then(function() {
        //store NOW as last fetch time
        //TODO is is possible that many succeeded and only a few failed. Should we keep track of which ones failed?
        localStorage.setItem(StatsService.LAST_FETCH_TIME, now.getTime().toString());
    });
};

StatsService.pushLatestGameStatsAsync = function() {

    if (server_user_is_online()) {
        var promisesForGames = [];

        var now = new Date();

        var games = GamesService.getGames();

        for (var i = 0; i < games.length; i++) {
            var promisesForGame = [];

            var game = games[i];
            var tempGameStats = StatsService._getGameStatsByGameType(game.getType(), true);
            for (var j = 0; j < tempGameStats.length; j++) {
                var tempGameStat = tempGameStats[j];
                var promise = StatsService._pushSingleGameStatToServerAsync(tempGameStat, game.getType(), game.getSessionId())
                    .then(function(response) {
                        //TODO Put the game in permanent storage?
                        //Maybe once we get all the stats back. Right now we just get the ID back and a little bit of other data.

                        //Example of response.session
                        // created_at:"2018-05-02 01:40:52"
                        // device_serial_number:null
                        // end_time:"2018-05-01 19:35:13"
                        // id:638
                        // ip_address:"76.27.84.189"
                        // recorded_data:null
                        // recorded_data_version:null
                        // routine_id:"1"
                        // start_time:"2018-05-01 19:35:13"
                        // updated_at:"2018-05-02 01:40:52"
                        // user_id:68

                        return GamesService.getGameTypeByRoutineId(response.session.routine_id);
                    });
                promisesForGame.push(promise);
            }
            var promisesForGamePromise = Promise.all(promisesForGame)
                .then(function(values) {
                    if (values && Array.isArray(values) && values.length > 0) {
                        var gameType = values[0];
                        StatsService._resetGameStatsByGameType(gameType, true);
                    }
                })
                .catch(function() {
                    //TODO do error handling? If not we should remove this catch.
                    return Promise.reject();
                });
            promisesForGames.push(promisesForGamePromise);
        }

        return Promise.all(promisesForGames)
            .then(function() {
                localStorage.setItem(StatsService.LAST_PUSH_TIME, now.getTime().toString());
            });
    } else {
        //Reject because we are not online.
        return Promise.reject();
    }
};

StatsService.getNumberOfTempStatsSessions = function() {
    var count = 0;

    var games = GamesService.getGames();

    for (var i = 0; i < games.length; i++) {
        var game = games[i];
        var tempGameStats = StatsService._getGameStatsByGameType(game.getType(), true);
        count += tempGameStats.length;
    }
    return count;
};

StatsService.getDisplayItemStatsOnDaysByType = function(gameType) {
    var realStats = StatsService._getGameStatsByGameType(gameType, false);
    var tempStats = StatsService._getGameStatsByGameType(gameType, true);
    var stats = realStats.concat(tempStats);

    stats.sort(function(a, b) {
        return a.getEpoch()-b.getEpoch();
    });

    var statsByDay = [];

    if (stats.length > 0) {
        var currentDate = null;
        var currentGameItem = {};

        for (var i = 0; i < stats.length; i++) {
            var gameStat = stats[i];
            var gameDate = new Date(gameStat.getEpoch());
            if (!currentDate || currentDate.getFullYear() !== gameDate.getFullYear() || currentDate.getMonth() !== gameDate.getMonth() || currentDate.getDate() !== gameDate.getDate()) {
                if (currentDate) {
                    var nextGameStat = StatsService._createDisplayStat(currentGameItem, currentDate, gameType);
                    statsByDay.push(nextGameStat);
                }
                currentDate = gameDate;

                currentGameItem = {};
            }

            currentGameItem = StatsService._incrementCurrentGameItem(currentGameItem, gameStat, gameType);
        }

        var nextGameStat = StatsService._createDisplayStat(currentGameItem, currentDate, gameType);
        statsByDay.push(nextGameStat);
    }

    var displayItem = {};
    displayItem.stats = statsByDay;
    displayItem.names = StatsService._createDisplayNames(gameType);

    return displayItem;
};

StatsService._pushSingleGameStatToServerAsync = function(tempGameStat, gameType, routineId) {

    var metrics = {};

    if (StatsService._isGameTypeFundamental(gameType)) {
        //Fundamentals
        metrics.kicks = tempGameStat.getKicks();
        metrics.duration = tempGameStat.getDuration();

    } else if (gameType === GameTypes.GAME_TYPE_WALL_KICKS) {
        //wall kicks
        metrics.kicks = tempGameStat.getKicks();
        metrics.duration = tempGameStat.getDuration();

    } else if (gameType === GameTypes.GAME_TYPE_PENALTY_KCIKS) {
        //penalty kicks
        metrics.distance = tempGameStat.getDistance();
        metrics.height = tempGameStat.getHeight();
        metrics.speed = tempGameStat.getSpeed();
        metrics.spin = tempGameStat.getSpin();

    } else if (gameType === GameTypes.GAME_TYPE_2_PERSON_PASSES) {
        // 2 person passes
        metrics.passes = tempGameStat.getPasses();
        metrics.duration = tempGameStat.getDuration();

    } else if (gameType === GameTypes.GAME_TYPE_PASSKICK) {
        //passkick
        metrics.distance = tempGameStat.getDistance();

    } else if (gameType === GameTypes.GAME_TYPE_TOPSPIN) {
        //topspin
        metrics.topspin = tempGameStat.getTopspin();
        metrics.rightspin = tempGameStat.getRightspin();

    } else if (gameType === GameTypes.GAME_TYPE_FORCE_KICK) {
        //force kick
        metrics.force = tempGameStat.getForce();

    } else {
        //BAD, should never get here
    }

    var params = {
        routine_id: routineId,
        metric: JSON.stringify(metrics),
        start_time: StatsService._getServerDateString(new Date(tempGameStat.getEpoch())),
        end_time: StatsService._getServerDateString(new Date(tempGameStat.getEpoch()))
    };

    return NetworkService.doAuthHttpCallAsync("POST", "session/create", params);
};

StatsService._storeFetchedCategoryResponse = function(response) {
    //TODO find a better way to do this, not based on a message, but maybe send down an empty array
    if (!Array.isArray(response)) {
        //There is nothing in the DB for us.
        //TODO what should we do?
        console.log("we don't have data");
    } else {

        if (!Array.isArray(response) || response.length < 1) {
            return;
        }

        for (var i = 0; i < response.length; i++) {
            var responseItem = response[i];
            var routineId = responseItem.routine_id;

            var gameType = GamesService.getGameTypeByRoutineId(routineId);
            var gameStats = StatsService._getGameStatsByGameType(gameType, false);
            //TODO creating a map each time seems like a horrible idea. It might be better to find out which ones need to be saved off against a singole map that has all ids, THEN save them off, not create a new map for each item.
            var mapOfGameStatsIds = {};
            for (var j = 0; j < gameStats.length; j++) {
                var gameStat = gameStats[j];
                mapOfGameStatsIds[gameStat.getId()] = gameStat.getId();
            }

            if (!mapOfGameStatsIds[responseItem.id]) {
                StatsService._saveGameStatFromResponseItem(responseItem, routineId, gameType);
            }
        }
    }
};

//TODO make this function smaller
StatsService._saveGameStatFromResponseItem = function(responseItem, routineId, gameType) {
    var metricsObj = {};

    var metrics = responseItem.metrics;
    for (var k = 0; k < metrics.length; k++) {
        var singleMetric = metrics[k];
        metricsObj[singleMetric.metric] = singleMetric.value;
    }

    var startDateFromPayload = responseItem.start_time;
    var millis = StatsService._getDateFromServerDateString(startDateFromPayload);
    var date = new Date(millis);

    if (StatsService._isGameTypeFundamental(gameType)) {
        //Fundamentals
        StatsService.saveFundamentalStats(metricsObj.kicks, metricsObj.duration, gameType, date, false, responseItem.id);
    } else if (gameType === GameTypes.GAME_TYPE_WALL_KICKS) {
        //wall kicks
        StatsService.saveWallKicksStats(metricsObj.kicks, metricsObj.duration, date, false, responseItem.id);
    } else if (gameType === GameTypes.GAME_TYPE_PENALTY_KCIKS) {
        //penalty kicks
        StatsService.savePenaltyKicksStats(metricsObj.distance, metricsObj.height, metricsObj.speed, metricsObj.spin, date, false, responseItem.id);
    } else if (gameType === GameTypes.GAME_TYPE_2_PERSON_PASSES) {
        // 2 person passes
        StatsService.save2PersonPassesStats(metricsObj.passes, metricsObj.duration, date, false, responseItem.id);
    } else if (gameType === GameTypes.GAME_TYPE_PASSKICK) {
        //passkick
        StatsService.savePasskickStats(metricsObj.distance, date, false, responseItem.id);
    } else if (gameType === GameTypes.GAME_TYPE_TOPSPIN) {
        //topspin
        StatsService.saveTopSpinStats(metricsObj.topspin, metricsObj.rightspin, date, false, responseItem.id);
    } else if (gameType === GameTypes.GAME_TYPE_FORCE_KICK) {
        //force kick
        StatsService.saveForceKickStats(metricsObj.force, date, false, responseItem.id);
    } else {
        //BAD, should never get here
    }
};

StatsService._getDateFromServerDateString = function(string) {
    return moment(string).valueOf();
};

StatsService._getServerDateString = function(date) {
    //TODO use moment.js here instead of rolling it my self.
    var str = "";
    str = (date.getFullYear()) + "-" +
        (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1)) + "-" +
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " " +
        (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":" +
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ":" +
        (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds());
    return str;
};

StatsService._createDisplayNames = function(gameType) {

    var names = [];

    //Fundamentals are broken out here because they display different things.
    if (gameType === GameTypes.GAME_TYPE_TOE_TAPS) {
        //Fundamentals
        names.push("Taps");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_BALL_TAPS_CLOCK) {
        //Fundamentals
        names.push("Taps");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_BRAZILIAN_SOLE_FLICKS) {
        //Fundamentals
        names.push("Flicks");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_FORWARD_BACKWARD_ROLLS) {
        //Fundamentals
        names.push("Touches");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_LEFT_RIGHT_FRONT_ROLLS) {
        //Fundamentals
        names.push("Touches");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_PULL_BACK_TAPS_ROLLS) {
        //Fundamentals
        names.push("Taps");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_IRISH_JIG) {
        //Fundamentals
        names.push("Taps");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_SINGLE_LEG_V_TAPS) {
        //Fundamentals
        names.push("Vs");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_WALL_KICKS) {
        //wall kicks
        names.push("Kicks");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_PENALTY_KCIKS) {
        //penalty kicks
        names.push("Distance");
        names.push("Height");
        names.push("Speed");
        names.push("Spin");
    } else if (gameType === GameTypes.GAME_TYPE_2_PERSON_PASSES) {
        // 2 person passes
        names.push("Passes");
        names.push("Duration");
    } else if (gameType === GameTypes.GAME_TYPE_PASSKICK) {
        //passkick
        names.push("Distance");
    } else if (gameType === GameTypes.GAME_TYPE_TOPSPIN) {
        //topspin
        names.push("Topspin");
        names.push("Rightspin");
    } else if (gameType === GameTypes.GAME_TYPE_FORCE_KICK) {
        //force kick
        names.push("Force");
    } else {
        //BAD, should never get here
    }

    return names;
};

StatsService.convertDurationToDisplayFormat = function(duration) {
    var hours = Math.floor(duration / (60 * 24));
    var remainingSeconds = duration % (60 * 24);
    var minutes = Math.floor(remainingSeconds / 60);
    var seconds = Math.floor(remainingSeconds % 60);

    var str = "";
    if (hours > 0) {
        str += hours + "h ";
    }
    str += minutes + "m ";
    str += seconds + "s";
    return str;
};

StatsService._createDisplayStat = function(currentGameItem, currentDate, gameType) {

    var arrayOfValues = [];

    if (StatsService._isGameTypeFundamental(gameType)) {
        //Fundamentals
        arrayOfValues.push(currentGameItem.kicks);
        arrayOfValues.push(currentGameItem.duration);
    } else if (gameType === GameTypes.GAME_TYPE_WALL_KICKS) {
        //wall kicks
        arrayOfValues.push(currentGameItem.kicks);
        arrayOfValues.push(currentGameItem.duration);
    } else if (gameType === GameTypes.GAME_TYPE_PENALTY_KCIKS) {
        //penalty kicks
        arrayOfValues.push(currentGameItem.distance);
        arrayOfValues.push(currentGameItem.height);
        arrayOfValues.push(currentGameItem.speed);
        arrayOfValues.push(currentGameItem.spin);
    } else if (gameType === GameTypes.GAME_TYPE_2_PERSON_PASSES) {
        // 2 person passes
        arrayOfValues.push(currentGameItem.passes);
        arrayOfValues.push(currentGameItem.duration);
    } else if (gameType === GameTypes.GAME_TYPE_PASSKICK) {
        //passkick
        arrayOfValues.push(currentGameItem.distance);
    } else if (gameType === GameTypes.GAME_TYPE_TOPSPIN) {
        //topspin
        arrayOfValues.push(currentGameItem.topspin);
        arrayOfValues.push(currentGameItem.rightspin);
    } else if (gameType === GameTypes.GAME_TYPE_FORCE_KICK) {
        //force kick
        arrayOfValues.push(currentGameItem.force);
    } else {
        //BAD, should never get here
    }

    return new DisplayGameStat(arrayOfValues, currentDate.getTime());
};

StatsService._incrementCurrentGameItem = function(currentGameItem, gameStat, gameType) {

    if (StatsService._isGameTypeFundamental(gameType)) {
        //Fundamentals
        if (!currentGameItem.kicks) {
            currentGameItem.kicks = gameStat.getKicks();
        } else {
            currentGameItem.kicks += gameStat.getKicks();
        }
        if (!currentGameItem.duration) {
            currentGameItem.duration = gameStat.getDuration();
        } else {
            currentGameItem.duration += gameStat.getDuration();
        }
    } else if (gameType === GameTypes.GAME_TYPE_WALL_KICKS) {
        //wall kicks
        if (!currentGameItem.kicks) {
            currentGameItem.kicks = gameStat.getKicks();
        } else {
            currentGameItem.kicks += gameStat.getKicks();
        }
        if (!currentGameItem.duration) {
            currentGameItem.duration = gameStat.getDuration();
        } else {
            currentGameItem.duration += gameStat.getDuration();
        }
    } else if (gameType === GameTypes.GAME_TYPE_PENALTY_KCIKS) {
        //penalty kicks
        if (!currentGameItem.distance) {
            currentGameItem.distance = gameStat.getDistance();
        } else {
            currentGameItem.distance += gameStat.getDistance();
        }
        if (!currentGameItem.height) {
            currentGameItem.height = gameStat.getHeight();
        } else {
            currentGameItem.height += gameStat.getHeight();
        }
        if (!currentGameItem.speed) {
            currentGameItem.speed = gameStat.getSpeed();
        } else {
            currentGameItem.speed += gameStat.getSpeed();
        }
        if (!currentGameItem.spin) {
            currentGameItem.spin = gameStat.getSpin();
        } else {
            currentGameItem.spin += gameStat.getSpin();
        }
    } else if (gameType === GameTypes.GAME_TYPE_2_PERSON_PASSES) {
        // 2 person passes
        if (!currentGameItem.passes) {
            currentGameItem.passes = gameStat.getPasses();
        } else {
            currentGameItem.passes += gameStat.getPasses();
        }
        if (!currentGameItem.duration) {
            currentGameItem.duration = gameStat.getDuration();
        } else {
            currentGameItem.duration += gameStat.getDuration();
        }
    } else if (gameType === GameTypes.GAME_TYPE_PASSKICK) {
        //passkick
        if (!currentGameItem.distance) {
            currentGameItem.distance = gameStat.getDistance();
        } else {
            currentGameItem.distance += gameStat.getDistance();
        }
    } else if (gameType === GameTypes.GAME_TYPE_TOPSPIN) {
        //topspin
        if (!currentGameItem.topspin) {
            currentGameItem.topspin = gameStat.getTopspin();
        } else {
            currentGameItem.topspin += gameStat.getTopspin();
        }
        if (!currentGameItem.rightspin) {
            currentGameItem.rightspin = gameStat.getRightspin();
        } else {
            currentGameItem.rightspin += gameStat.getRightspin();
        }
    } else if (gameType === GameTypes.GAME_TYPE_FORCE_KICK) {
        //force kick
        if (!currentGameItem.force) {
            currentGameItem.force = gameStat.getForce();
        } else {
            currentGameItem.force += gameStat.getForce();
        }
    } else {
        //BAD, should never get here
    }

    return currentGameItem;
};

/***************
 * SAVE STATS
 ***************/
//ID is optional
StatsService.saveFundamentalStatsByGameName = function(kicks, duration, gameName, date, isTemp, id) {
    var gameType = GamesService.getGameTypeFromGameName(gameName);
    StatsService.saveFundamentalStats(kicks, duration, gameType, date, isTemp, id);

};

StatsService.saveFundamentalStats = function(kicks, duration, gameType, date, isTemp, id) {
    if (gameType === GameTypes.GAME_TYPE_2_PERSON_PASSES) {
        StatsService.save2PersonPassesStats(kicks, duration, date, isTemp, id);
    } else if (gameType === GameTypes.GAME_TYPE_WALL_KICKS) {
        StatsService.saveWallKicksStats(kicks, duration, date, isTemp, id);
    } else {
        var gameStatsArray = StatsService._getGameStatsByGameType(gameType, isTemp);

        var fundamentalsGameStat =  new FundamentalsGameStat(kicks, duration, date.getTime(), id);

        gameStatsArray.push(fundamentalsGameStat);
        StatsService._setGameStatsByGameType(gameStatsArray, gameType, isTemp);
    }
};

//ID is optional
StatsService.saveWallKicksStats = function(kicks, duration, date, isTemp, id) {
    var gameType = GameTypes.GAME_TYPE_WALL_KICKS;
    var gameStatsArray = StatsService._getGameStatsByGameType(gameType, isTemp);

    var wallKicksGameStat = new WallKicksGameStat(kicks, duration, date.getTime(), id);

    gameStatsArray.push(wallKicksGameStat);
    StatsService._setGameStatsByGameType(gameStatsArray, gameType, isTemp);
};

//ID is optional
StatsService.savePenaltyKicksStats = function(distance, height, speed, spin, date, isTemp, id) {
    var gameType = GameTypes.GAME_TYPE_PENALTY_KCIKS;
    var gameStatsArray = StatsService._getGameStatsByGameType(gameType, isTemp);

    var penaltyKicksGameStat = new PenaltyKicksGameStat(distance, height, speed, spin, date.getTime(), id);

    gameStatsArray.push(penaltyKicksGameStat);
    StatsService._setGameStatsByGameType(gameStatsArray, gameType, isTemp);
};

//ID is optional
StatsService.save2PersonPassesStats = function(passes, duration, date, isTemp, id) {
    var gameType = GameTypes.GAME_TYPE_2_PERSON_PASSES;
    var gameStatsArray = StatsService._getGameStatsByGameType(gameType, isTemp);

    var gameStat = new TwoPersonPassesGameStat(passes, duration, date.getTime(), id);

    gameStatsArray.push(gameStat);
    StatsService._setGameStatsByGameType(gameStatsArray, gameType, isTemp);
};

//ID is optional
StatsService.savePasskickStats = function(distance, date, isTemp, id) {
    var gameType = GameTypes.GAME_TYPE_PASSKICK;
    var gameStatsArray = StatsService._getGameStatsByGameType(gameType, isTemp);

    var gameStat = new PassKickGameStat(distance, date.getTime(), id);

    gameStatsArray.push(gameStat);
    StatsService._setGameStatsByGameType(gameStatsArray, gameType, isTemp);
};

//ID is optional
StatsService.saveForceKickStats = function(force, date, isTemp, id) {
    var gameType = GameTypes.GAME_TYPE_FORCE_KICK;
    var gameStatsArray = StatsService._getGameStatsByGameType(gameType, isTemp);

    var gameStat = new ForceKickGameStat(force, date.getTime(), id);

    gameStatsArray.push(gameStat);
    StatsService._setGameStatsByGameType(gameStatsArray, gameType, isTemp);
};

//ID is optional
StatsService.saveTopSpinStats = function(topspin, rightspin, date, isTemp, id) {
    var gameType = GameTypes.GAME_TYPE_TOPSPIN;
    var gameStatsArray = StatsService._getGameStatsByGameType(gameType, isTemp);

    var gameStat = new TopspinGameStat(topspin, rightspin, date.getTime(), id);

    gameStatsArray.push(gameStat);
    StatsService._setGameStatsByGameType(gameStatsArray, gameType, isTemp);
};

StatsService._getGameStatsByGameType = function(gameType, isTemp) {
    var localStorageString = gameType.toString() + (isTemp ? "_TEMP" : "");
    var statsObj = JSON.parse(localStorage.getItem(localStorageString));

    //If it's temp we save the array in an object with the ID as the key
    if (isTemp && statsObj) {
        statsObj = statsObj[UserService.getUserId()];
    }

    var gameStats = statsObj ? statsObj : [];
    var gameStatsAsGameStats = [];
    if (StatsService._isGameTypeFundamental(gameType)) {
        //Fundamentals
        gameStatsAsGameStats = gameStats.map(item => {return (new FundamentalsGameStat(parseFloat(item.kicks), parseFloat(item.duration), parseFloat(item.epoch), item.id))});
    } else if (gameType === GameTypes.GAME_TYPE_WALL_KICKS) {
        //wall kicks
        gameStatsAsGameStats = gameStats.map(item => {return (new WallKicksGameStat(parseFloat(item.kicks), parseFloat(item.duration), parseFloat(item.epoch), item.id))});
    } else if (gameType === GameTypes.GAME_TYPE_PENALTY_KCIKS) {
        //penalty kicks
        gameStatsAsGameStats = gameStats.map(item => {return (new PenaltyKicksGameStat(parseFloat(item.distance), parseFloat(item.height), parseFloat(item.speed), parseFloat(item.spin), parseFloat(item.epoch), item.id))});
    } else if (gameType === GameTypes.GAME_TYPE_2_PERSON_PASSES) {
        // 2 person passes
        gameStatsAsGameStats = gameStats.map(item => {return (new TwoPersonPassesGameStat(parseFloat(item.passes), parseFloat(item.duration), parseFloat(item.epoch), item.id))});
    } else if (gameType === GameTypes.GAME_TYPE_PASSKICK) {
        //passkick
        gameStatsAsGameStats = gameStats.map(item => {return (new PassKickGameStat(parseFloat(item.distance), parseFloat(item.epoch), item.id))});
    } else if (gameType === GameTypes.GAME_TYPE_TOPSPIN) {
        //topspin
        gameStatsAsGameStats = gameStats.map(item => {return (new TopspinGameStat(parseFloat(item.topspin), parseFloat(item.rightspin), parseFloat(item.epoch), item.id))});
    } else if (gameType === GameTypes.GAME_TYPE_FORCE_KICK) {
        //force kick
        gameStatsAsGameStats = gameStats.map(item => {return (new ForceKickGameStat(parseFloat(item.force), parseFloat(item.epoch), item.id))});
    } else {
        //BAD
        return [];
    }

    return gameStatsAsGameStats;
};

StatsService._setGameStatsByGameType = function(gameStats, gameType, isTemp) {
    var localStorageString = gameType.toString() + (isTemp ? "_TEMP" : "");

    var saveData = null;
    //If it's temp we save the array in an object with the ID as the key
    if (isTemp) {
        var tempSaveData = localStorage.getItem(localStorageString);

        var tempStatsObj = tempSaveData ? JSON.parse(tempSaveData) : {};
        tempStatsObj[UserService.getUserId()] = gameStats;
        saveData = tempStatsObj;
    } else {
        saveData = gameStats;
    }
    localStorage.setItem(localStorageString, JSON.stringify(saveData));
};

StatsService._resetGameStatsByGameType = function(gameType, isTemp) {
    StatsService._setGameStatsByGameType([], gameType, isTemp);
};

StatsService._isGameTypeFundamental = function(gameType) {
    return gameType === GameTypes.GAME_TYPE_TOE_TAPS || gameType === GameTypes.GAME_TYPE_BALL_TAPS_CLOCK ||
        gameType === GameTypes.GAME_TYPE_BRAZILIAN_SOLE_FLICKS || gameType === GameTypes.GAME_TYPE_FORWARD_BACKWARD_ROLLS ||
        gameType === GameTypes.GAME_TYPE_LEFT_RIGHT_FRONT_ROLLS || gameType === GameTypes.GAME_TYPE_PULL_BACK_TAPS_ROLLS ||
        gameType === GameTypes.GAME_TYPE_IRISH_JIG || gameType === GameTypes.GAME_TYPE_SINGLE_LEG_V_TAPS;
};

