let btnFile = document.querySelector('.myfile');

let fileSelected = '';

let myObj = {};
let newData;
let xmlhttp = new XMLHttpRequest();

setMyObj(); // used for EVENT LOGS

function setMyObj() {

    xmlhttp.onreadystatechange = function() {
    
        if (this.readyState == 4 && this.status == 200) {
            myObj = JSON.parse(this.responseText);

            // start parsing information
            // create a new gameData object
            newData = new gameData();
            parseFile();
            }
    };

}

function getGameFile() {
    return "../files to parse/2019_event_logs.txt";
}

class gameLineup {
    playerID = [];
    pos = [];
}

class gameData {
    gameID = '';
    visTeam = '';
    homeTeam = '';
    ballpark = '';
    date = '';
    gameNum = '';
    startTime = '';
    dayNight = '';
    useDH = false;
    umpHome = '';
    umpFirst = '';
    umpSecond = '';
    umpThird = '';
    temp = 0;
    windDir = '';
    windSpeed = 0;
    fieldCondition = '';
    precip = '';
    sky = '';
    timeOfGame = '';
    attendance = '';
    winningPitcher = '';
    losingPitcher = '';
    savePitcher = '';
    startingVisLineup = new gameLineup();
    startingHomeLineup = new gameLineup();
}

function parseFile() {
    let endOfFile = myObj.length;
    let games = [];
    let fields = [];

    for(let i = 0, max = 100; i < max; i++) {
        
        for(let j = 0; j < 7; j++) {
            fields[j] = myObj[i]['FIELD' + (j+1)];
        }

        handleLineItem(fields);
        
    }

    logGameData();
}

function logGameData() {
    console.log(newData);
}

function handleLineItem(fields) {
    switch(fields[0]) {
        case 'id': {
            newData.gameID = fields[1];
            break;
        }
        case 'info': {
            if(fields[1] === 'visteam') {
                newData.visTeam = fields[2];
            }
            else if(fields[1] === 'hometeam') {
                newData.homeTeam = fields[2];
            }
            else if(fields[1] === 'site') {
                newData.ballpark = fields[2];
            }
            else if(fields[1] === 'date') {
                newData.date = fields[2];
            }
            else if(fields[1] === 'number') {
                newData.gameNum = fields[2];
            }
            else if(fields[1] === 'starttime') {
                newData.startTime = fields[2];
            }
            else if(fields[1] === 'daynight') {
                newData.dayNight = fields[2];
            }
            else if(fields[1] === 'usedh') {
                newData.useDH = fields[2];
            }
            else if(fields[1] === 'umphome') {
                newData.umpHome = fields[2];
            }
            else if(fields[1] === 'ump1b') {
                newData.umpFirst = fields[2];
            }
            else if(fields[1] === 'ump2b') {
                newData.umpSecond = fields[2];
            }
            else if(fields[1] === 'ump3b') {
                newData.umpThird = fields[2];
            }
            else if(fields[1] === 'temp') {
                newData.temp = fields[2];
            }
            else if(fields[1] === 'winddir') {
                newData.windDir = fields[2];
            }
            else if(fields[1] === 'windspeed') {
                newData.windSpeed = fields[2];
            }
            else if(fields[1] === 'fieldcond') {
                newData.fieldCondition = fields[2];
            }
            else if(fields[1] === 'precip') {
                newData.precip = fields[2];
            }
            else if(fields[1] === 'sky') {
                newData.sky = fields[2];
            }
            else if(fields[1] === 'timeofgame') {
                newData.timeOfGame = calculateTimeOfGame(fields[2]);
            }
            else if(fields[1] === 'attendance') {
                newData.attendance = fields[2];
            }
            else if(fields[1] === 'wp') {
                newData.winningPitcher = fields[2];
            }
            else if(fields[1] === 'lp') {
                newData.losingPitcher = fields[2];
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
