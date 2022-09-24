//////////////////////////////
// DECLAR VARIABLES
/////////////////////////////
let display = ' '
let modifierClicked = false
let answer = 0
let total = 0
let inputWhole = 0
let inputDec = 0
let firstNum = 0
let secondNum = 0
let opperator = 'none'
let dotOn = false

//////////////////////////////
// ADD EVENT LISTENERS
/////////////////////////////

document.querySelector('#zero').addEventListener('click',runZero)
document.querySelector('#one').addEventListener('click',runOne)
document.querySelector('#two').addEventListener('click',runTwo)
document.querySelector('#three').addEventListener('click',runThree)
document.querySelector('#four').addEventListener('click',runFour)
document.querySelector('#five').addEventListener('click',runFive)
document.querySelector('#six').addEventListener('click',runSix)
document.querySelector('#seven').addEventListener('click',runSeven)
document.querySelector('#eight').addEventListener('click',runEight)
document.querySelector('#nine').addEventListener('click',runNine)
document.querySelector('#ac').addEventListener('click',runAC)
document.querySelector('#plusMinus').addEventListener('click',runPlusMinus)
document.querySelector('#percent').addEventListener('click',runPercent)
document.querySelector('#divide').addEventListener('click',runDivide)
document.querySelector('#multiply').addEventListener('click',runMultiply)
document.querySelector('#minus').addEventListener('click',runMinus)
document.querySelector('#plus').addEventListener('click',runPlus)
document.querySelector('#equal').addEventListener('click',runEqual)
document.querySelector('#dot').addEventListener('click',runDot)

//////////////////////////////
//////////////////////////////
//////////////////////////////
// FUNCTIONS
//////////////////////////////
//////////////////////////////
//////////////////////////////

function updateDisplay() {
    document.querySelector('#answerSpot').innerText = display
}

function getNumLength(number) {
    return number.toString().length
}

function tensPlaces(number) {
    return Math.pow(10,getNumLength(number))
}

function addToInput(addNumber, baseNumber) {
    return addNumber + (baseNumber * 10)
}

function addNumToInput(number) {
    // ADD NUMBER TO INPUT VARIABLES
    // Check to see if dot was clicked
    if (dotOn == false) {
        //Add to whole number input
        if (inputWhole == 0) {
            inputWhole = number
        }else{
        inputWhole = addToInput(number, inputWhole)
        }
    }else{
        //Add to decimal input
        if (inputDec == 0) {
            inputDec = number
        }else{
        inputDec = addToInput(number, inputDec)
        }
    }
    // UPDATE DISPLAY
    if (modifierClicked == false) {
        if (dotOn == false) {
            firstNum = inputWhole
        }else{
            firstNum = inputWhole + (inputDec  / tensPlaces(inputDec))
        }
        console.log('First Number = ' + firstNum)
        display = firstNum
        updateDisplay()
    }else{
        if (dotOn == false) {
            secondNum = inputWhole
        }else{
            secondNum = inputWhole + (inputDec  / tensPlaces(inputDec))
        }
        console.log('Second Number = ' + secondNum)
        display = secondNum
        updateDisplay()
    }
}

//////////////////////////////
// FUNCTIONS RUNNING ON CLICK
//////////////////////////////

// NUMBERS

function runZero() {
    addNumToInput(0)
}

function runOne() {
    addNumToInput(1)
}

function runTwo() {
    addNumToInput(2)
}

function runThree() {
    addNumToInput(3)
}

function runFour() {
    addNumToInput(4)
}

function runFive() {
    addNumToInput(5)
}

function runSix() {
    addNumToInput(6)
}

function runSeven() {
    addNumToInput(7)
}

function runEight() {
    addNumToInput(8)
}

function runNine() {
    addNumToInput(9)
}

// OTHER

function runAC() {
    firstNum = 0
    secondNum = 0
    inputWhole = 0
    inputDec = 0
    dotOn = false
    modifierClicked = false
    total = 0
    answer = 0
    display = ' '
    updateDisplay()
}

function runPlusMinus(){
    if (total == 0 && answer == 0) {
        if (secondNum == 0) {
            firstNum = firstNum * -1
            display = firstNum
            updateDisplay()
        }else{
            secondNum = secondNum * -1
            display = secondNum
            updateDisplay()
        }
    }else{
        answer = answer * -1
        total = answer
        display = answer
        updateDisplay()
    }
}

function runPercent(){
    if (total == 0 && answer == 0) {
        if (secondNum == 0) {
            firstNum = firstNum / 100
            display = firstNum
            updateDisplay()
        }else{
            secondNum = secondNum / 100
            display = secondNum
            updateDisplay()
        }
    }else{
        answer = answer / 100
        total = answer
        display = answer
        updateDisplay()
    }
}

function runDivide(){
    if (modifierClicked == false) {
        modifierClicked = true
        opperator = 'divide'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        display = ''
        updateDisplay()
    }else{
        opperator = 'divide'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        return null
    }
}

function runMultiply(){
    if (modifierClicked == false) {
        modifierClicked = true
        opperator = 'multiply'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        display = ''
        updateDisplay()
    }else{
        opperator = 'multiply'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        return null
    }
}

function runMinus(){
    if (modifierClicked == false) {
        modifierClicked = true
        opperator = 'minus'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        display = ''
        updateDisplay()
    }else{
        opperator = 'minus'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        return null
    }
}

function runPlus(){
    if (modifierClicked == false) {
        modifierClicked = true
        opperator = 'plus'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        display = ''
        updateDisplay()
    }else{
        opperator = 'plus'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        return null
    }
}

function runDot() {
    if (dotOn == false) {
        dotOn = true
        display = inputWhole + '.'
        updateDisplay()
    }else{
        return null
    }
}

function runEqual() {
    if (modifierClicked == false) {
        answer = firstNum
        display = answer
        updateDisplay()
    }else if(opperator == 'plus') {
        if(total != 0){
        total = total + secondNum
        answer = total
        }else{
            total = firstNum + secondNum
            answer = total
        }
        display = answer
        updateDisplay()
    }else if(opperator == 'minus') {
        if(total != 0){
            total = total - secondNum
            answer = total
            }else{
                total = firstNum - secondNum
                answer = total
            }
            display = answer
            updateDisplay()
    }else if(opperator == 'multiply') {
        if(total != 0){
            total = total * secondNum
            answer = total
            }else{
                total = firstNum * secondNum
                answer = total
            }
            display = answer
            updateDisplay()
    }else if(opperator == 'divide') {
        if(total != 0){
            total = total / secondNum
            answer = total
            }else{
                total = firstNum / secondNum
                answer = total
            }
            display = answer
            updateDisplay()
    }else{
        return null
    }
    inputWhole = 0
    inputDec = 0
}


