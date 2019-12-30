let gameContainerDiv = document.getElementById('game-container')
let money = 20.0

let cupsAmt = 0
let cupsP
let cupsQ

let lemonsAmt = 0
let lemonsP
let lemonsQ

let sugarAmt = 0
let sugarP
let sugarQ

let iceAmt = 0
let iceP
let iceQ

let dayChoice = 0
let counter = 0
let weather
let weatherType

let weatherTypeArray = ["Sunny", "Partly Cloudy", "Rainy"]

let baseArray = [...Array(100).keys()]
let weatherArray = baseArray.slice(50)


function getPricesAndQuantities() {
    fetch (`http://localhost:3000/api/v1/items`)
    .then (function (resp) {
        return resp.json();
    }).then (function (items) {
        cupsP = items[0].price
        cupsQ = items[0].quantity
        lemonsP = items[1].price
        lemonsQ = items[1].quantity
        iceP = items[2].price
        iceQ = items[2].quantity
        sugarP = items[3].price
        sugarQ = items[3].quantity
        refreshBuyScreen();
})
}

getPricesAndQuantities();

let constantsContainer = document.getElementById('constants-container')

constantsContainer.style.display = 'none';

constantsContainer.innerHTML = `
<h5>Money: <span id='money-span'></span></h5>
<h5>Weather: <span id='weather-span'></span></h5>
`

let displayMoney = document.getElementById('money-span')
displayMoney.innerText = `${money}`

let displayWeather = document.getElementById('weather-span')
displayWeather.innerText = `${weather} degrees and ${weatherType}`


let startScreen = document.getElementById('start-screen')
let startButton = document.getElementById('start-button')

startButton.addEventListener("click", function () {
    gameContainerDiv.replaceChild(dayChoiceScreen, startScreen)
})

let dayChoiceScreen = document.createElement('div')
dayChoiceScreen.id = 'day-choice-screen'
dayChoiceScreen.innerHTML = `
    <h1>Choose the amount of days</h1>
    <button id='three-days'>3 Days</button><br>
    <button id='seven-days'>7 Days</button><br>
    <button id='fourteen-days'>14 Days</button><br>
`

dayChoiceScreen.addEventListener("click", function (e) {
    if (e.target.id === 'three-days') {
        runGame();
        constantsContainer.style.display = 'block'
        dayChoice = 3
    } else if (e.target.id === 'seven-days') {
        runGame();
        constantsContainer.style.display = 'block'
        dayChoice = 7
    } else if (e.target.id === 'fourteen-days') {
        runGame();
        constantsContainer.style.display = 'block'
        dayChoice = 14
    }
})

function runGame () {
    //replace current screen with buy screen
    chooseWeather()
    gameContainerDiv.innerHTML = ``
    gameContainerDiv.appendChild(buyScreen)
}


function chooseWeather() {
    weather = weatherArray[Math.floor(Math.random() * weatherArray.length)]
    weatherType = weatherTypeArray[Math.floor(Math.random() * weatherTypeArray.length)]
    updateMoney()
}


let buyScreen = document.createElement('div')
buyScreen.id = 'buy-screen'
function refreshBuyScreen () { 
    buyScreen.innerHTML = `
        <h1>Purchase Ingredients</h1>
        <h5>You have <span id='cup-total'>${cupsAmt}</span> cups<button id='buy-cups'>Buy ${cupsQ} Cups for $${cupsP}</button></h5><br>
        <h5>You have <span id='lemon-total'>${lemonsAmt}</span> lemons<button id='buy-lemons'>Buy ${lemonsQ} Lemons for $${lemonsP}</button></h5><br>
        <h5>You have <span id='sugar-total'>${sugarAmt}</span> sugar<button id='buy-sugar'>Buy ${sugarQ} Units of Sugar for $${sugarP}</button></h5><br>
        <h5>You have <span id='ice-total'>${iceAmt}</span> ice<button id='buy-ice'>Buy ${iceQ} Cubes of Ice for $${iceP}</button></h5><br>
        <button id='go-to-recipe'>Go to recipe</button>
    `
}

buyScreen.addEventListener("click", function(e) {
    if (e.target.id === 'go-to-recipe') {
        gameContainerDiv.replaceChild(recipeScreen, buyScreen)
    } else if (e.target.id === 'buy-ice') {
        if (money >= iceP) {
            iceAmt += iceQ
            money -= iceP
            updateMoney();
            displayIceTotal = document.getElementById('ice-total')
            displayIceTotal.innerText = `${iceAmt}`
        }
        else {
            alert('Not enough money!')
        }
    } else if (e.target.id === 'buy-lemons') {
        if (money >= lemonsP) {
            lemonsAmt += lemonsQ
            money -= lemonsP
            updateMoney();
            displayLemonsTotal = document.getElementById('lemon-total')
            displayLemonsTotal.innerText = `${lemonsAmt}`
        }
        else {
            alert('Not enough money!')
        }
    } else if (e.target.id === 'buy-sugar') {
        if (money >= sugarP) {
            sugarAmt += sugarQ
            money -= sugarP
            updateMoney();
            displaySugarTotal = document.getElementById('sugar-total')
            displaySugarTotal.innerText = `${sugarAmt}`
        }
        else {
            alert('Not enough money!')
        }
    } else if (e.target.id === 'buy-cups') {
        if (money >= cupsP) {
            cupsAmt += cupsQ
            money -= cupsP
            updateMoney();
            displayCupTotal = document.getElementById('cup-total')
            displayCupTotal.innerText = `${cupsAmt}`
        }
        else {
            alert('Not enough money!')
        }
    }
})

function updateMoney () {
    constantsContainer.innerHTML = `
    <h5>Money: <span id='money-span'>${parseFloat(money.toFixed(2))}</span></h5>
    <h5>Weather: <span id='weather-span'>${weather} degrees and ${weatherType}</span></h5>
    `
}

fetch (`http://localhost:3000/api/v1/recipes`)
    .then (function (resp) {
        return resp.json();
    })
    .then (function (defaultValues) {
        createRecipe(defaultValues[0])
})


let recipeScreen = document.createElement('div')

function createRecipe(recipe){
    recipeScreen.id = 'recipe-screen'
    recipeScreen.innerHTML = `
    <h1>Set your price and your recipe</h1>
    <h5>(1 pitcher = 10 cups)</h5>
    <form>
    Price per cup:<br>
    <input type="float" name="price" value="${recipe.price}">
    <br>
    Lemons per pitcher:<br>
    <input type="integer" name="lemons" value="${recipe.lemons}"><br>
    Sugar per pitcher:<br>
    <input type="integer" name="sugar" value="${recipe.sugar}"><br>
    Ice per pitcher:<br>
    <input type="integer" name="ice" value="${recipe.ice}">
    <br><br>
    <input type="submit" value="Submit and start day">
    <br>
    <button id='back-to-store'>Go back to store</button>
    </form> 
    `
}

recipeScreen.addEventListener("click", function (e) {
    if (e.target.id === 'back-to-store') {
        gameContainerDiv.replaceChild(buyScreen, recipeScreen)
    } 
})

recipeScreen.addEventListener("submit", function (e) {
    e.preventDefault();
    let setPrice = parseFloat(e.target[0].value)
    let setLemons = parseInt(e.target[1].value)
    let setSugar = parseInt(e.target[2].value)
    let setIce = parseInt(e.target[3].value)

    gameContainerDiv.replaceChild(resultScreen, recipeScreen)
    
    runSimulation(setPrice, setLemons, setSugar, setIce);

})

let revenue 

function calculateIce(setIce) {
    let idealIce = (weather/2) - 24
    let x = Math.abs(((setIce - idealIce)/idealIce)*.25)
    return (33.33 * (1-x))
}

function calculatePricing(setPrice) {
    let idealPrice
    if (weather < 65) {
        idealPrice = 0.75
    } else if ((weather >= 65) && (weather <= 80)) {
        idealPrice = 1.10
    } else if (weather > 80) {
        idealPrice = 1.50
    }
    let x = Math.abs((setPrice - idealPrice)/idealPrice)
    return (33.33 * (1-x))
}

function calculateRatio(setLemons, setSugar) {
    let idealRatio = 2
    let setRatio = (setLemons/setSugar)
    let x = Math.abs(((setRatio - idealRatio)/idealRatio)*.25)
    return (33.33 * (1-x))
}

function calculatePeople() {
    let array 
    let finalArray 
    if (weatherType === "Sunny") {
        array = [...Array(200).keys()]
        finalArray = array.slice(125)
        return (finalArray[Math.floor(Math.random() * finalArray.length)])
    } else if (weatherType === "Partly Cloudy") {
        array = [...Array(150).keys()]
        finalArray = array.slice(100)
        return (finalArray[Math.floor(Math.random() * finalArray.length)])
    } else {
        array = [...Array(100).keys()]
        finalArray = array.slice(50)
        return (finalArray[Math.floor(Math.random() * finalArray.length)])
    }
}

function runSimulation (setPrice, setLemons, setSugar, setIce) {

    let successRate = calculateIce(setIce) + calculatePricing(setPrice) + calculateRatio(setLemons, setSugar)
    let people = calculatePeople()

    let traffic = Math.floor(((successRate/100) * people))
    // console.log("traffic", traffic)
    // console.log("calc people", people)
    // console.log("success rate", successRate)
    
    let pitchers = Math.ceil(traffic / 10)

    if ( ((pitchers * setLemons) <= lemonsAmt) && ((pitchers * setSugar) <= sugarAmt) && ((pitchers * setIce) <= iceAmt)) {
        if (cupsAmt >= traffic) {
            revenue = setPrice * traffic
            lemonsAmt -= (pitchers * setLemons)
            sugarAmt -= (pitchers * setSugar)
            iceAmt -= (pitchers * setIce)
            cupsAmt -= traffic
            money += revenue
            refreshBuyScreen()
            updateMoney()
        } else {
            revenue = setPrice * cupsAmt
            let numOfPitchers = Math.ceil(cupsAmt / 10)
            lemonsAmt -= (numOfPitchers * setLemons)
            sugarAmt -= (numOfPitchers * setSugar)
            iceAmt -= (numOfPitchers * setIce)
            cupsAmt = 0
            money += revenue
            refreshBuyScreen()
            updateMoney()
        }
    } else {
       let minLemon = lemonsAmt / setLemons
       let minSugar = sugarAmt / setSugar
       let minIce = iceAmt / setIce
       let maxPitchers = Math.min(minLemon, minIce, minSugar)
       if (cupsAmt >= (maxPitchers*10)) {
           revenue = setPrice * (maxPitchers * 10)
           lemonsAmt -= (maxPitchers * setLemons)
           sugarAmt -= (maxPitchers * setSugar)
           iceAmt -= (maxPitchers * setIce)
           cupsAmt -= (maxPitchers * 10)
           money += revenue
           refreshBuyScreen()
           updateMoney()
       } else {
           revenue = cupsAmt * setPrice
           let minPitchers = Math.ceil(cupsAmt/10)
           lemonsAmt -= (minPitchers * setLemons)
           sugarAmt -= (minPitchers * setSugar)
           iceAmt -= (minPitchers * setIce)
           cupsAmt = 0
           money += revenue
           refreshBuyScreen()
           updateMoney()
           
       }

    }

    counter += 1

    resultScreen.innerHTML = `
    <h1>Results for Day ${counter}</h1>
    <h5>Total earnings today: ${parseFloat(revenue.toFixed(2))}</h5>
    `

    let nextDayButton = document.createElement('button')
    nextDayButton.innerText = 'Back to store to prepare for next day'
    resultScreen.appendChild(nextDayButton)
    nextDayButton.addEventListener("click", function () {
        chooseWeather()
        gameContainerDiv.replaceChild(buyScreen, resultScreen)
    })

    if (counter >= dayChoice) {
        let finalResultsButton = document.createElement('button')
        finalResultsButton.innerText = 'See final results'
        resultScreen.replaceChild(finalResultsButton, nextDayButton)
        finalResultsButton.addEventListener("click", function() {
            endGame();
        })
    } 
}

function endGame () {
    constantsContainer.style.display = 'none'
    gameContainerDiv.replaceChild(endScreen, resultScreen)
    endScreen.innerHTML = `
    <h1>Final Profit/Loss</h1>
    <h5>Money Money money: ${money}</h5>
    <button id='play-again'>Play again</button>
    `

    let playAgainButton = document.getElementById('play-again')
    playAgainButton.addEventListener("click", function() {
        money = 20.0
        cupsAmt = 0
        lemonsAmt = 0
        sugarAmt = 0
        iceAmt = 0
        counter = 0
        updateMoney();
        gameContainerDiv.replaceChild(dayChoiceScreen, endScreen)
    })
}

let resultScreen = document.createElement('div')
resultScreen.id = 'result-screen'

let endScreen = document.createElement('div')
endScreen.id = 'end-screen'