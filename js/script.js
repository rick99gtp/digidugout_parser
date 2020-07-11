let btnFile = document.querySelector('input[type="file"]');
let btnGetValues = document.querySelector('#btngetvalues');

btnGetValues.addEventListener('click',() => {
    console.log(games[0].gameID);
    console.log(games[1].gameID);
});

let fileSelected = '';

let myObj = {};

let xmlhttp = new XMLHttpRequest();

let endOfGame = false;

let games = [];
let newData;
let visLineup = []; // stores objects with playerID and pos
let homeLineup = []; // stores objects with playerID and pos
let visEvents = []; // stores objects with category, inning, teamAtBat, playerID,count, pitches, result, battingOrderPos, positionToBePlayed, description
let homeEvents = []; // stores objects with category, inning, teamAtBat, playerID,count, pitches, result, battingOrderPos, positionToBePlayed, description

setMyObj(); // used for EVENT LOGS

function setMyObj() {

    xmlhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status == 200) {
            myObj = JSON.parse(this.responseText);

            // start parsing information
            parseFile();
            }
    };

}

class Event {
    constructor() {
        this.category = '';
        this.inning = ''[1];
        this.teamAtBat = ''[2];
        this.playerID = ''[3];
        this.count = '';
        this.pitches = '';
        this.result = '';
    }
}

class GameLineup {
    playerID = [];
    pos = [];
}

class GameData {
    constructor() {
        this.gameID = '';
        this.visTeam = '';
        this.homeTeam = '';
        this.ballpark = '';
        this.date = '';
        this.gameNum = '';
        this.startTime = '';
        this.dayNight = '';
        this.useDH = false;
        this.umpHome = '';
        this.umpFirst = '';
        this.umpSecond = '';
        this.umpThird = '';
        this.temp = 0;
        this.windDir = '';
        this.windSpeed = 0;
        this.fieldCondition = '';
        this.precip = '';
        this.sky = '';
        this.timeOfGame = '';
        this.attendance = '';
        this.winningPitcher = '';
        this.losingPitcher = '';
        this.savePitcher = '';
        this.startingVisLineup = new GameLineup();
        this.startingHomeLineup = new GameLineup();
        this.visEvents = [];
        this.homeEvents = [];
    }
}

function parseFile() {

    let endOfFile = myObj.length;
    let fields = [];

    for(let i = 0, max = endOfFile; i < max; i++) {
        // if(endOfGame) {
        //     i = max;
        //     break;
        // }
        
        for(let j = 0; j < 7; j++) {
            fields[j] = myObj[i]['FIELD' + (j+1)];
        }

        handleLineItem(fields);
        
    }
    
    logGameData();
}

function logGameData() {
    console.log(games);
}

function handleLineItem(fields) {

    switch(fields[0]) {
        case 'id': {
            endOfGame = false;

            newData = new GameData();
            newData.gameID = fields[1];
            break;
        }
        case 'info': {
            if(fields[1] === 'visteam') {
                newData.visTeam = fields[2];
                break;
            }
            else if(fields[1] === 'hometeam') {
                newData.homeTeam = fields[2];
                break;
            }
            else if(fields[1] === 'site') {
                newData.ballpark = fields[2];
                break;
            }
            else if(fields[1] === 'date') {
                newData.date = fields[2];
                break;
            }
            else if(fields[1] === 'number') {
                newData.gameNum = fields[2];
                break;
            }
            else if(fields[1] === 'starttime') {
                newData.startTime = fields[2];
                break;
            }
            else if(fields[1] === 'daynight') {
                newData.dayNight = fields[2];
                break;
            }
            else if(fields[1] === 'usedh') {
                newData.useDH = fields[2];
                break;
            }
            else if(fields[1] === 'umphome') {
                newData.umpHome = fields[2];
                break;
            }
            else if(fields[1] === 'ump1b') {
                newData.umpFirst = fields[2];
                break;
            }
            else if(fields[1] === 'ump2b') {
                newData.umpSecond = fields[2];
                break;
            }
            else if(fields[1] === 'ump3b') {
                newData.umpThird = fields[2];
                break;
            }
            else if(fields[1] === 'temp') {
                newData.temp = fields[2];
                break;
            }
            else if(fields[1] === 'winddir') {
                newData.windDir = fields[2];
                break;
            }
            else if(fields[1] === 'windspeed') {
                newData.windSpeed = fields[2];
                break;
            }
            else if(fields[1] === 'fieldcond') {
                newData.fieldCondition = fields[2];
                break;
            }
            else if(fields[1] === 'precip') {
                newData.precip = fields[2];
                break;
            }
            else if(fields[1] === 'sky') {
                newData.sky = fields[2];
                break;
            }
            else if(fields[1] === 'timeofgame') {
                newData.timeOfGame = calculateTimeOfGame(fields[2]);
                break;
            }
            else if(fields[1] === 'attendance') {
                newData.attendance = fields[2];
                break;
            }
            else if(fields[1] === 'wp') {
                newData.winningPitcher = fields[2];
                break;
            }
            else if(fields[1] === 'lp') {
                newData.losingPitcher = fields[2];
                break;
            }
            else if(fields[1] === 'save') {
                newData.savePitcher = fields[2];
            }
            break;
        }
        case 'start': {
            // 1 = playerID
            // 2 = player name - NOT USED
            // 3 = 0 is home team, 1 is vis team
            // 4 = position in lineup
            // 5 = fielding position, 10=DH
            fields[3] === '0' ? newData.startingVisLineup.playerID.push(fields[1]) : newData.startingHomeLineup.playerID.push(fields[1]);
            fields[3] === '0' ? newData.startingVisLineup.pos.push(getPosition(fields[5])) : newData.startingHomeLineup.pos.push(getPosition(fields[5]));
            break;
        }
        case 'play': {
            // 1 = inning
            // 2 = teamAtBat 0=vis, 1=home
            // 3 = playerID
            // 4 = count
            // 5 = pitches
            // 6 = result

            if(fields[6] !== 'NP') {
                thisEvent = new Event();

                thisEvent.category = 'play';
                thisEvent.inning = fields[1];
                thisEvent.teamAtBat = fields[2];
                thisEvent.playerID = fields[3];
                thisEvent.count = fields[4];
                thisEvent.pitches = fields[5];
                thisEvent.result = fields[6];
    
                fields[2] === '0' ? newData.visEvents.push(thisEvent) : newData.homeEvents.push(thisEvent);
            }

            break;
        }
        case 'data': {
            // end of the game
            if(!endOfGame) {
                endOfGame = true;
                games.push(newData);
                // newData.clearAll();
            }

            break;
        }
        case 'sub': {
            thisEvent = new Event();

            thisEvent.category = 'sub';
            thisEvent.playerID = fields[1];
            thisEvent.teamAtBat = fields[3];
            thisEvent.battingOrderPos = fields[4];
            thisEvent.positionToBePlayed = fields[5]; // 11 = pinch hitter, 12 = pinch runner

            fields[3] === '0' ? newData.visEvents.push(thisEvent) : newData.homeEvents.push(thisEvent);
            break;
        }
        case 'com': {
            thisEvent = new Event();
            this.Event.category = 'com';
            this.description = fields[1];
        }
    }
}

function getPosition(pos) {
    let positionsAvailable = ["N/A","P","C","1B","2B","3B","SS","LF","CF","RF","DH"];
    
    return positionsAvailable[pos];
}

function calculateTimeOfGame(time) {
    let hours = Math.floor(time/60);
    let minutes = Math.floor(((time/60) - hours) * 60);

    return hours + ":" + minutes;
}

btnFile.addEventListener('change', () => {
    fileSelected = btnFile.value;
    fileSelected = fileSelected.replace(/.*[\/\\]/, '');

    let gamefile = "../files to parse/" + fileSelected;

    xmlhttp.open("GET", gamefile, true);
    xmlhttp.send();
});
