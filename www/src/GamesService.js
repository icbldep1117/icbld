function GamesService() {
}

GamesService.getGameByType = function(type) {
    return GamesService.getGames().reduce((acc, cur) => cur.getType() === type ? cur : acc, null);
};

GamesService.getGameTypeByRoutineId = function(routineId) {
    var listOfGames = GamesService.getGames();

    var gameType = 0;

    for (var j = 0; j < listOfGames.length; j++) {
        var game = listOfGames[j];
        if (routineId.toString() === game.getSessionId().toString()) {
            gameType = game.getType();
            break;
        }
    }

    return gameType;
};

GamesService.getGames = function() {
    var games = [];

    games.push((new Game("Toe Taps", GameTypes.GAME_TYPE_TOE_TAPS, 1)));
    games.push((new Game("Ball Taps Clock", GameTypes.GAME_TYPE_BALL_TAPS_CLOCK, 2)));
    games.push((new Game("Brazilian Sole Flicks", GameTypes.GAME_TYPE_BRAZILIAN_SOLE_FLICKS, 3)));
    games.push((new Game("Forward Backward Rolls", GameTypes.GAME_TYPE_FORWARD_BACKWARD_ROLLS, 4)));
    games.push((new Game("Left Right Front Rolls", GameTypes.GAME_TYPE_LEFT_RIGHT_FRONT_ROLLS, 5)));
    games.push((new Game("Pull Back Taps Rolls", GameTypes.GAME_TYPE_PULL_BACK_TAPS_ROLLS, 7)));
    games.push((new Game("Irish Jig", GameTypes.GAME_TYPE_IRISH_JIG, 15)));
    games.push((new Game("Single Leg V Taps", GameTypes.GAME_TYPE_SINGLE_LEG_V_TAPS, 6)));

    games.push((new Game("Wall Kicks", GameTypes.GAME_TYPE_WALL_KICKS, 8)));
    games.push((new Game("Penalty Kicks", GameTypes.GAME_TYPE_PENALTY_KCIKS, 9)));
    games.push((new Game("2-Person Passes", GameTypes.GAME_TYPE_2_PERSON_PASSES, 12)));
    games.push((new Game("Passkick", GameTypes.GAME_TYPE_PASSKICK, 16)));
    games.push((new Game("Topspin", GameTypes.GAME_TYPE_TOPSPIN, 17)));
    games.push((new Game("Force Kick", GameTypes.GAME_TYPE_FORCE_KICK, 18)));

    //TODO volley kick 10
    //TODO drop kick 11
    //TODO in out dribbling 13
    //TODO virtual coach 14

    return games;
};


GamesService.getGameTypeFromGameName = function(gameName) {
    if (gameName === "Toe Taps") {
        return GameTypes.GAME_TYPE_TOE_TAPS;
    } else if (gameName === "Ball Taps Clock") {
        return GameTypes.GAME_TYPE_BALL_TAPS_CLOCK;
    } else if (gameName === "Brazilian Sole Flicks") {
        return GameTypes.GAME_TYPE_BRAZILIAN_SOLE_FLICKS;
    } else if (gameName === "Forward Backward Rolls") {
        return GameTypes.GAME_TYPE_FORWARD_BACKWARD_ROLLS;
    } else if (gameName === "Left Right Front Rolls") {
        return GameTypes.GAME_TYPE_LEFT_RIGHT_FRONT_ROLLS;
    } else if (gameName === "Pull Back Taps") {
        return GameTypes.GAME_TYPE_PULL_BACK_TAPS_ROLLS;
    } else if (gameName === "Irish Jig") {
        return GameTypes.GAME_TYPE_IRISH_JIG;
    } else if (gameName === "Single Leg V Taps") {
        return GameTypes.GAME_TYPE_SINGLE_LEG_V_TAPS;
    } else if (gameName === "Wall Kicks") {
        return GameTypes.GAME_TYPE_WALL_KICKS;
    } else if (gameName === "Penalty Kicks") {
        return GameTypes.GAME_TYPE_PENALTY_KCIKS;
    } else if (gameName === "2-Person Passes") {
        return GameTypes.GAME_TYPE_2_PERSON_PASSES;
    } else if (gameName === "Passkick") {
        return GameTypes.GAME_TYPE_PASSKICK;
    } else if (gameName === "Topspin") {
        return GameTypes.GAME_TYPE_TOPSPIN;
    } else if (gameName === "Force Kick") {
        return GameTypes.GAME_TYPE_FORCE_KICK;
    } else {
        throw "Error- Not a valid game name";
    }
};