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

let audBackground = document.createElement("audio")
audBackground.src = "audio/Jazz.mp3"
audBackground.type = "audio/mpeg"
audBackground.loop = true;

function playBackground() {
    audBackground.play()
}




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
displayMoney.innerText = `$${money}`

let displayWeather = document.getElementById('weather-span')
displayWeather.innerText = `${weather} degrees and ${weatherType}`


let startScreen = document.getElementById('start-screen')
let startButton = document.getElementById('start-button')
let leadersButton = document.getElementById('show-leaders')

startButton.addEventListener("click", function () {
    playBackground()
    gameContainerDiv.replaceChild(dayChoiceScreen, startScreen)
})

leadersButton.addEventListener("click", function () {
    getLeaders();
    gameContainerDiv.replaceChild(leaderBoard, startScreen)
})

let leaderBoard = document.createElement('div')
leaderBoard.id = 'leaderboard'

function getLeaders() {
    fetch (`http://localhost:3000/api/v1/scores`)
    .then (function (resp) {
        return resp.json();
    }).then (function (scores) {

        let filteredScores3 = scores.filter(obj => obj.days === 3)

        let filteredScores7 = scores.filter(obj => obj.days === 7)

        let filteredScores14 = scores.filter(obj => obj.days === 14)

        let sortedScores3 = filteredScores3.sort((a, b) => (a.profit > b.profit) ? -1 : 1)

        let sortedScores7 = filteredScores7.sort((a, b) => (a.profit > b.profit) ? -1 : 1)

        let sortedScores14 = filteredScores14.sort((a, b) => (a.profit > b.profit) ? -1 : 1)

        leaderBoard.innerHTML = `
        <h1>Lemonade Tycoons</h1>
        <h3>Top Five All-time Profits (3 day game)</h3>
        <h5>1. Name: ${sortedScores3[0].name} <br> Profit: $${sortedScores3[0].profit}</h5>
        <h5>2. Name: ${sortedScores3[1].name} <br> Profit: $${sortedScores3[1].profit}</h5>
        <h5>3. Name: ${sortedScores3[2].name} <br> Profit: $${sortedScores3[2].profit}</h5>
        <h5>4. Name: ${sortedScores3[3].name} <br> Profit: $${sortedScores3[3].profit}</h5>
        <h5>5. Name: ${sortedScores3[4].name} <br> Profit: $${sortedScores3[4].profit}</h5>
        <hr>
        <h3>Top Five All-time Profits (7 day game)</h3>
        <h5>1. Name: ${sortedScores7[0].name} <br> Profit: $${sortedScores7[0].profit}</h5>
        <h5>2. Name: ${sortedScores7[1].name} <br> Profit: $${sortedScores7[1].profit}</h5>
        <h5>3. Name: ${sortedScores7[2].name} <br> Profit: $${sortedScores7[2].profit}</h5>
        <h5>4. Name: ${sortedScores7[3].name} <br> Profit: $${sortedScores7[3].profit}</h5>
        <h5>5. Name: ${sortedScores7[4].name} <br> Profit: $${sortedScores7[4].profit}</h5>
        <hr>
        <h3>Top Five All-time Profits (14 day game)</h3>
        <h5>1. Name: ${sortedScores14[0].name} <br> Profit: $${sortedScores14[0].profit}</h5>
        <h5>2. Name: ${sortedScores14[1].name} <br> Profit: $${sortedScores14[1].profit}</h5>
        <h5>3. Name: ${sortedScores14[2].name} <br> Profit: $${sortedScores14[2].profit}</h5>
        <h5>4. Name: ${sortedScores14[3].name} <br> Profit: $${sortedScores14[3].profit}</h5>
        <h5>5. Name: ${sortedScores14[4].name} <br> Profit: $${sortedScores14[4].profit}</h5>

        <button id='back'>Back to Start</button><br>
        `
        let backButton = document.getElementById('back');
        backButton.addEventListener('click', function() {
            gameContainerDiv.replaceChild(startScreen, leaderBoard)
        })
    })
}

let dayChoiceScreen = document.createElement('div')
dayChoiceScreen.id = 'day-choice-screen'
dayChoiceScreen.innerHTML = `
    <h1>How many days would you like to operate your stand?</h1>
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
        <h5>You have <span id='cup-total'>${Math.floor(cupsAmt)}</span> cups<button id='buy-cups'>Buy ${cupsQ} Cups for $${cupsP}</button></h5><br>
        <h5>You have <span id='lemon-total'>${Math.floor(lemonsAmt)}</span> lemons<button id='buy-lemons'>Buy ${lemonsQ} Lemons for $${lemonsP}</button></h5><br>
        <h5>You have <span id='sugar-total'>${parseFloat(sugarAmt.toFixed(2))}</span> cups of sugar<button id='buy-sugar'>Buy ${sugarQ} Cups of Sugar for $${sugarP}</button></h5><br>
        <h5>You have <span id='ice-total'>${Math.floor(iceAmt)}</span> ice cubes<button id='buy-ice'>Buy ${iceQ} ice cubes for $${iceP}</button></h5><br>
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
            refreshBuyScreen()
        }
        else {
            alert('Not enough money!')
        }
    } else if (e.target.id === 'buy-lemons') {
        if (money >= lemonsP) {
            lemonsAmt += lemonsQ
            money -= lemonsP
            updateMoney();
            refreshBuyScreen()
        }
        else {
            alert('Not enough money!')
        }
    } else if (e.target.id === 'buy-sugar') {
        if (money >= sugarP) {
            sugarAmt += sugarQ
            money -= sugarP
            updateMoney();
            refreshBuyScreen()
        }
        else {
            alert('Not enough money!')
        }
    } else if (e.target.id === 'buy-cups') {
        if (money >= cupsP) {
            cupsAmt += cupsQ
            money -= cupsP
            updateMoney();
            refreshBuyScreen()
        }
        else {
            alert('Not enough money!')
        }
    }
})

function updateMoney () {
    constantsContainer.innerHTML = `
    <h5>Money: <span id='money-span'>$${parseFloat(money.toFixed(2))}</span></h5>
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
    <h1>Set your price and recipe</h1>
    <h5>(1 pitcher = 10 cups)</h5>
    <form>
    Price per cup:<br>
    <input type="float" name="price" value="${recipe.price}">
    <br>
    Lemons per pitcher:<br>
    <input type="integer" name="lemons" value="${recipe.lemons}"><br>
    Cups of Sugar per pitcher:<br>
    <input type="integer" name="sugar" value="${recipe.sugar}"><br>
    Ice Cubes per pitcher:<br>
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

let animationScreen = document.createElement('div')

let aud = document.createElement("audio")
aud.src = "audio/DuckCut.mov"
aud.type = "audio/mpeg"
function playAudio() {
    aud.load()
    aud.play()
    audBackground.pause()
}

function pauseAudio() {
    audBackground.play()
    aud.pause()
}

let body = document.getElementsByTagName('body')[0]

let grandDiv = document.getElementById("grand-container")
grandDiv.style.backgroundImage = ""
grandDiv.style.backgroundRepeat = "no-repeat"
grandDiv.style.backgroundSize = "100% 100%"
grandDiv.style.height = "100%"

gameContainerDiv.style.margin = "auto"
gameContainerDiv.style.width = "50%"
// gameContainerDiv.style.marginTop = "150px"
gameContainerDiv.style.border = "7px solid black"
gameContainerDiv.style.padding = "10px"

constantsContainer.style.width = "50%"
constantsContainer.style.textAlign = "center"

const spongebob = "url(https://vignette.wikia.nocookie.net/spongebob/images/9/9c/Ink_Lemonade_049.png/revision/latest?cb=20180509205958)"

let characterHeight = 575

const cartman = "http://southparkstudios.mtvnimages.com/shared/characters/kids/eric-cartman.png"
let cartmanImage = document.createElement('img')
cartmanImage.src = cartman
cartmanImage.style = "width:250px;height:300px;"
cartmanImage.style.position = "fixed"
cartmanImage.style.top = `${characterHeight}px`

const kyle = "http://southparkstudios.mtvnimages.com/shared/characters/kids/kyle-broflovski.png"
let kyleImage = document.createElement('img')
kyleImage.src = kyle
kyleImage.style = "width:250px;height:300px;"
let kyleStart = 700
kyleImage.style.right = `${kyleStart}px`
kyleImage.style.position = "fixed"
kyleImage.style.top = `${characterHeight}px`

const kenny = "http://southparkstudios.mtvnimages.com/shared/characters/kids/kenny-mccormick.png"
let kennyImage = document.createElement('img')
kennyImage.src = kenny
let kennyStart = 2000
kennyImage.style.left = `${kennyStart}px`
kennyImage.style = "width:250px;height:300px;"
kennyImage.style.position = "fixed"
kennyImage.style.top = `${characterHeight}px`

const stan = "http://southparkstudios.mtvnimages.com/shared/characters/kids/stan-marsh.png"
let stanImage = document.createElement('img')
stanImage.src = stan
let stanStart = 1800
stanImage.style.left = `${stanStart}px`
stanImage.style = "width:250px;height:300px;"
stanImage.style.position = "fixed"
stanImage.style.top = `${characterHeight}px`

let cartmanCounter = 0
let kyleCounter = 0
let kennyCounter = 0
let stanCounter = 0

function moveCartman(kyleStart) {
    cartmanCounter += 5
    kyleCounter -= 6
    kennyCounter -= 8
    stanCounter -= 4.2
    stanImage.style.left = `${stanStart + stanCounter}px`
    kennyImage.style.left = `${kennyStart + kennyCounter}px`
    cartmanImage.style.left = `${cartmanCounter}px`
    kyleImage.style.right = `${kyleCounter + kyleStart}px`
}

recipeScreen.addEventListener("submit", function (e) {
    e.preventDefault();
    gameContainerDiv.style.display = "none"
    constantsContainer.style.display = "none"
    playAudio()

    grandDiv.style.backgroundImage = `${spongebob}`
    grandDiv.appendChild(cartmanImage)
    grandDiv.appendChild(kyleImage)
    grandDiv.appendChild(kennyImage)
    grandDiv.appendChild(stanImage)

    var interval = window.setInterval(moveCartman, 50, kyleStart)


    // let skipButton = document.createElement('button')
    // skipButton.innerText = 'Skip Animation'
    // grandDiv.appendChild(skipButton)

    // skipButton.addEventListener("click", function() {
    //     setTimeout(function() {
    //         gameContainerDiv.replaceChild(resultScreen, recipeScreen)
    //         grandDiv.style.backgroundImage = ""
    //         cartmanCounter = 0
    //         kyleCounter = 0
    //         kennyCounter = 0
    //         stanCounter = 0
    //         clearInterval(interval)
    //         pauseAudio()
    //         cartmanImage.remove();
    //         kyleImage.remove();
    //         kennyImage.remove()
    //         stanImage.remove()
    //         gameContainerDiv.style.display = "block"
    //         constantsContainer.style.display = "block"
    //         let setPrice = parseFloat(e.target[0].value)
    //         let setLemons = parseInt(e.target[1].value)
    //         let setSugar = parseInt(e.target[2].value)
    //         let setIce = parseInt(e.target[3].value)
    //         runSimulation(setPrice, setLemons, setSugar, setIce)
    //         skipButton.remove()
    //     }, 0);
    // })

    setTimeout(function() {
        gameContainerDiv.replaceChild(resultScreen, recipeScreen)
        grandDiv.style.backgroundImage = ""
        cartmanCounter = 0
        kyleCounter = 0
        kennyCounter = 0
        stanCounter = 0
        clearInterval(interval)
        pauseAudio()
        cartmanImage.remove();
        kyleImage.remove();
        kennyImage.remove()
        stanImage.remove()
        gameContainerDiv.style.display = "block"
        constantsContainer.style.display = "block"
        let setPrice = parseFloat(e.target[0].value)
        let setLemons = parseInt(e.target[1].value)
        let setSugar = parseInt(e.target[2].value)
        let setIce = parseInt(e.target[3].value)
        runSimulation(setPrice, setLemons, setSugar, setIce)
        // skipButton.remove()
    }, 23000);
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

    let iceRating = calculateIce(setIce);
    let priceRating = calculatePricing(setPrice);
    let ratioRating = calculateRatio(setLemons, setSugar);
    let successRate = iceRating + priceRating + ratioRating;

    let people = calculatePeople();

    let traffic

    if ((Math.floor(((successRate/100) * people))) > 0) {
        traffic = Math.floor(((successRate/100) * people));
    } else {
        traffic = 0
    }
    
    console.log("ice rating:", calculateIce(setIce))
    console.log("price rating:", calculatePricing(setPrice))
    console.log("ratio rating:", calculateRatio(setLemons, setSugar))
    console.log("total success rate", successRate)

    console.log("number of people who walk by", people)
    console.log("people who buy a cup", traffic)
    
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
    <h5>How close were you to setting the perfect price and recipe? ${parseFloat(successRate.toFixed(2))}%</h5>
    <h5>How many people walked by your stand? ${people}</h5>
    <h5>How many people wanted to buy a cup? ${traffic}</h5>
    <h5>How many cups of lemonade did you sell? ${revenue/setPrice}</h5>
    <h5>Total earnings today: $${parseFloat(revenue.toFixed(2))}</h5>
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

function postScore(playerName) {
    fetch (`http://localhost:3000/api/v1/scores`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json', 
                'Accept': 'application/json'
            },
            body: JSON.stringify ({
                name: `${playerName}`, 
                profit: `${money}`,
                days: `${counter}`
            })
        }).then(response => console.log(response))
}

function endGame () {
    constantsContainer.style.display = 'none'
    gameContainerDiv.replaceChild(endScreen, resultScreen)
    if (money > 20) {
        endScreen.innerHTML = `
            <h1>Results!</h1>
            <h5>Money in the bank: $${money}</h5><br>
            <h5 class="text-success">You made a profit of: $${money-20}</h5>
            <form id='save-name'>
            Add your name to save your score to the leaderboard:<br>
            <input type="text" name="firstname"><br>
            <input type="submit" value="Submit">
            </form>
            <button id='play-again'>Play again</button>
        `
        nameForm = document.getElementById('save-name')
        nameForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let playerName = (e.target[0].value)
            postScore(playerName);
            nameForm.remove();
        })
    } else {
        endScreen.innerHTML = `
            <h1>Profit/Loss</h1>
            <h5>Money in the bank: $${money}</h5><br>
            <h5 class="text-danger">You lost a total of: $${20-money}</h5>
            <form id='save-name'>
            Add your name to save your score to the leaderboard:<br>
            <input type="text" name="firstname"><br>
            <input type="submit" value="Submit">
            </form>
            <button id='play-again'>Play again</button>
        `
        nameForm = document.getElementById('save-name')
        nameForm.addEventListener("submit", function(e) {
            e.preventDefault();
            let playerName = e.target[0].value
            postScore(playerName);
            nameForm.remove()
        })
    } 

    let playAgainButton = document.getElementById('play-again')
    playAgainButton.addEventListener("click", function() {
        money = 20.0
        cupsAmt = 0
        lemonsAmt = 0
        sugarAmt = 0
        iceAmt = 0
        counter = 0
        refreshBuyScreen();
        updateMoney();
        gameContainerDiv.replaceChild(dayChoiceScreen, endScreen)
    })
}

let resultScreen = document.createElement('div')
resultScreen.id = 'result-screen'

let endScreen = document.createElement('div')
endScreen.id = 'end-screen'




// let backgroundDiv = document.createElement('div')
// backgroundDiv.innerHTML = `



// `

