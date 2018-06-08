const discord = require('discord.js')
const commando = require('discord.js-commando')
const https = require('https')
const auth = require('./auth.json')
const express = require('express')
const app = express()
const path = require('path')

var port = process.env.PORT || 5000
app.listen(port)

var bot = new commando.Client()
let url = ''
let body = ''

bot.registry
    .registerDefaultTypes()
    .registerGroups([
        ['sorting', 'Sorting commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

bot.on('ready', () => {
  console.log('I am ready!')
})

bot.on('message', async message => {
  if (message.content.startsWith('!maketeams')) {
    let summonerArray = []
    let summonerIds = []
    let summonerStats = []
    // let completedRequests = 0
    let summonerScores = []
    let team1 = []
    let team2 = []

    console.log('message content before replace:', message.content)
    let shortenedString = message.content.substring(10)
    console.log('message content after replace:', shortenedString)
    summonerArray = shortenedString.split(' #')
    summonerArray.splice(0, 1)
    console.log('summonerArray:', summonerArray)
    // let totalPlayers = summonerArray.length
        // summonerArray.forEach(name => {
        //     name = name.substring(0, name.length - 1)
        // })
        // console.log('summonerArray after removing spaces:', summonerArray);
    summonerIds = await getSummonerIds(summonerArray)
    console.log(`Stored summoner ids: ${summonerIds}`)
    summonerStats = await getAllSummonerStats(summonerIds)
    console.log(`Stored summoner stats: ${summonerStats}`)
    summonerScores = getScores(summonerStats)
    console.log(`Summoner scores saved as: ${summonerScores}`)
    summonerScores = sortPlayers(summonerScores)
    console.log(`Players re-sorted to: ${summonerScores}`)
    divideTeams(summonerScores, team1, team2)
    message.reply('Here are your teams: ')
    message.reply(`Team 1: ${beautify(team1)}`)
    message.reply(`Team 2: ${beautify(team2)}`)
  }
    // summonerIds = await getSummonerId(summonerArray[0]);
})

bot.login(`${auth.token}`)

async function getSummonerIds (nameArray) {
    // Fetching summoner ID's for each summoner name
    // nameArray.forEach(summonerName => {
    //     getSummonerId(summonerName);
    // })

  let tempArray = []
  for (let name of nameArray) {
    await tempArray.push(await getSummonerId(name))
  }
  return tempArray
}

async function getAllSummonerStats (idArray) {
    // idArray.forEach(summonerId => {
    //     console.log(`Getting summoner stat from: ${summonerId}`);
    //     getSummonerStats(summonerId);
    // })

  let tempArray = []
  for (let id of idArray) {
    await tempArray.push(await getSummonerStats(id))
  }
  return tempArray
}

function getSummonerId (summonerName) {
  url = `https://na1.api.riotgames.com/lol/summoner/v3/summoners/by-name/${summonerName}?api_key=${auth.apiKey}`
  return new Promise(resolve => {
    https.get(url, res => {
      res.setEncoding('utf8')
      res.on('data', data => {
        body = data
      })
      res.on('end', () => {
        body = JSON.parse(body)
        console.log(`Storing ${body.name}'s ID!`)
        resolve([summonerName, body.id])
                // completedRequests++;
                // if (completedRequests === summonerArray.length) {
                //     completedRequests = 0;
                //     console.log(`Passing in summonerIds array:`, summonerIds);
                //     getAllSummonerStats(summonerIds);
                // }
      })
    })
  })
}

function getSummonerStats (summonerId) {
  url = `https://na1.api.riotgames.com/lol/league/v3/positions/by-summoner/${summonerId[1]}?api_key=${auth.apiKey}`
  return new Promise(resolve => {
    https.get(url, res => {
      res.setEncoding('utf8')
      res.on('data', data => {
        body = data
      })
      res.on('end', () => {
        body = JSON.parse(body)
              // console.log('raw league data: ', body);
        resolve([summonerId[0], body])
              // completedRequests++;
              // if (completedRequests === summonerArray.length) {
              //     completedRequests = 0;
              //     console.log(summonerStats);
              //     getScores(summonerStats);
              // }
      })
    })
  })
}

function getScores (statsArray) {
  let tempArray = []
  statsArray.forEach(summonerData => {
    let highestScore = 0
    let currentScore = 0
    if (summonerData[1].length > 0) {
      summonerData[1].forEach(league => {
        if (league.tier === 'BRONZE') {
          if (league.rank === 'V') currentScore = 1
          if (league.rank === 'IV') currentScore = 1.2
          if (league.rank === 'III') currentScore = 1.4
          if (league.rank === 'II') currentScore = 1.6
          if (league.rank === 'I') currentScore = 1.8
        }
        if (league.tier === 'SILVER') {
          if (league.rank === 'V') currentScore = 2
          if (league.rank === 'IV') currentScore = 2.2
          if (league.rank === 'III') currentScore = 2.4
          if (league.rank === 'II') currentScore = 2.6
          if (league.rank === 'I') currentScore = 2.8
        }
        if (league.tier === 'GOLD') {
          if (league.rank === 'V') currentScore = 3
          if (league.rank === 'IV') currentScore = 3.2
          if (league.rank === 'III') currentScore = 3.4
          if (league.rank === 'II') currentScore = 3.6
          if (league.rank === 'I') currentScore = 3.8
        }
        if (league.tier === 'PLATINUM') {
          if (league.rank === 'V') currentScore = 4
          if (league.rank === 'IV') currentScore = 4.2
          if (league.rank === 'III') currentScore = 4.4
          if (league.rank === 'II') currentScore = 4.6
          if (league.rank === 'I') currentScore = 4.8
        }
        if (league.tier === 'DIAMOND') {
          if (league.rank === 'V') currentScore = 5
          if (league.rank === 'IV') currentScore = 5.2
          if (league.rank === 'III') currentScore = 5.4
          if (league.rank === 'II') currentScore = 5.6
          if (league.rank === 'I') currentScore = 5.8
        }
        if (currentScore > highestScore) highestScore = currentScore
      })
    }
    console.log(`${summonerData[0]}'s score: ${highestScore}`)
    tempArray.push([summonerData[0], highestScore])
  })
  return tempArray
    // sortPlayers(summonerScores);
}

// var sortPlayers = function(scoresArray) {
//     let foundChange = true;
//     while (foundChange) {
//         for(var i = 0; i < scoresArray.length; i++) {
//             if (scoresArray[i[1]] > scoresArray[i-1])
//         }
//     }
// }

function sortPlayers (scoresArray) {
  let tempArray = scoresArray
  for (var i = 0; i < tempArray.length; i++) {
        // console.log(`First element: ${tempArray[i]}`);
    for (var j = i + 1; j < tempArray.length; j++) {
            // console.log(`Second element: ${tempArray[j]}`);
            // console.log(`Checking ${tempArray[i][1]} against ${tempArray[j][1]}`);
      if (tempArray[i][1] < tempArray[j][1]) {
        var swap = tempArray[i]
        tempArray[i] = tempArray[j]
        tempArray[j] = swap
      }
    }
  }
  return tempArray
    // console.log(scoresArray);
    // divideTeams(scoresArray);
}

function divideTeams (finalArray, team1, team2) {
  let theStraggler
  if (finalArray.length % 2 !== 0) {
    let index = finalArray.length - 1
    theStraggler = finalArray[index]
        // console.log(`The straggler is ${theStraggler}!`);
    finalArray.splice(index, 1)
        // console.log(`Removed from array:`, finalArray);
  }
  for (var i = 0; i < finalArray.length; i++) {
    if (i % 2 === 0) {
      team1.push(finalArray[i][0])
    } else {
      team2.push(finalArray[i][0])
    }
  }
  if (theStraggler) team2.push(theStraggler[0])
  console.log(`Team 1:`, team1)
  console.log(`Team 2:`, team2)
}

function beautify (array) {
  let tempArray = array
  for (var i = 0; i < tempArray.length; i++) {
    let tempElement = tempArray[i].split(' ')
    console.log(`Temp element: ${tempElement}`)
    for (var ii = 0; ii < tempElement.length; ii++) {
      console.log(tempElement[ii])
      tempElement[ii] = tempElement[ii][0].toUpperCase() + tempElement[ii].substr(1)
      console.log(tempElement[ii])
    };
    tempArray[i] = tempElement.join(' ')
  }
  let message = tempArray.join(', ')
  return message
}
