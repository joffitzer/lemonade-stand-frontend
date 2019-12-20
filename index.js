let gameContainerDiv = document.getElementById('game-container')
let money = 20.0
let cupsAmt = 0
let lemonsAmt = 0
let sugarAmt = 0
let iceAmt = 0
let dayChoice = 0
let counter = 0

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
        dayChoice = 3
    } else if (e.target.id === 'seven-days') {
        runGame();
        dayChoice = 7
    } else if (e.target.id === 'fourteen-days') {
        runGame();
        dayChoice = 14
    }
})

function runGame () {
    money = 20.0
    cupsAmt = 0
    lemonsAmt = 0
    sugarAmt = 0
    iceAmt = 0
    counter = 0
    //replace current screen with buy screen
    gameContainerDiv.innerHTML = ``
    gameContainerDiv.appendChild(buyScreen)
}

let buyScreen = document.createElement('div')
buyScreen.id = 'buy-screen'
buyScreen.innerHTML = `
<h1>Purchase Ingredients</h1>
<h5>You have <span id='cup-total'>${cupsAmt}</span> cups<button id='buy-cups'>Buy Cups</button></h5><br>
<h5>You have <span id='lemon-total'>${lemonsAmt}</span> lemons<button id='buy-lemons'>Buy Lemons</button></h5><br>
<h5>You have <span id='sugar-total'>${sugarAmt}</span> sugar<button id='buy-sugar'>Buy Sugar</button></h5><br>
<h5>You have <span id='ice-total'>${iceAmt}</span> ice<button id='buy-ice'>Buy Ice</button></h5><br>
<button id='go-to-recipe'>Go to recipe</button>
`

buyScreen.addEventListener("click", function(e) {
    if (e.target.id === 'go-to-recipe') {
        gameContainerDiv.replaceChild(recipeScreen, buyScreen)
    } else if (e.target.id === 'buy-ice') {
        console.log('clicking buy ice')
    } else if (e.target.id === 'buy-lemons') {
        console.log('clicking buy lemons')
    } else if (e.target.id === 'buy-sugar') {
        console.log('clicking buy sugar')
    } else if (e.target.id === 'buy-cups') {
        console.log('clicking buy cups')
    }
})



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
    let setPrice = parseInt(e.target[0].value)
    let setLemons = parseInt(e.target[1].value)
    let setSugar = parseInt(e.target[2].value)
    let setIce = parseInt(e.target[3].value)

    gameContainerDiv.replaceChild(resultScreen, recipeScreen)
    
    runSimulation(setPrice, setLemons, setSugar, setIce);

})

function runSimulation (setPrice, setLemons, setSugar, setIce) {
    let sampleMath = setPrice + setLemons + setSugar + setIce

    counter += 1

    resultScreen.innerHTML = `
    <h1>Results for Day ${counter}</h1>
    <h5>results of simulation go here: ${sampleMath}</h5>
    `

    let nextDayButton = document.createElement('button')
    nextDayButton.innerText = 'Back to store to prepare for next day'
    resultScreen.appendChild(nextDayButton)
    nextDayButton.addEventListener("click", function () {
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
    gameContainerDiv.replaceChild(endScreen, resultScreen)
    endScreen.innerHTML = `
    <h1>Final Profit/Loss</h1>
    <h5>Money Money money: ${money}</h5>
    <button id='play-again'>Play again</button>
    `

    let playAgainButton = document.getElementById('play-again')
    playAgainButton.addEventListener("click", function() {
        gameContainerDiv.replaceChild(dayChoiceScreen, endScreen)
    })
}

let resultScreen = document.createElement('div')
resultScreen.id = 'result-screen'

let endScreen = document.createElement('div')
endScreen.id = 'end-screen'

