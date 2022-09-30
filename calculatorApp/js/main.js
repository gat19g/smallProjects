//////////////////////////////
// DECLAR VARIABLES
/////////////////////////////
let display = ' '
let display2 = ' '
let modifierClicked = false
let answer = 0
let total = 0
let inputWhole = 0
let inputWholeComma = ' '
let inputDec = 0
let firstNum = 0
let secondNum = 0
let opperator = 'none'
let dotOn = false
let equalClicked = false

//////////////////////////////
// ADD EVENT LISTENERS
/////////////////////////////

document.querySelector('#zero').addEventListener('click',function(){addNumToInput(0)})
document.querySelector('#one').addEventListener('click',function(){addNumToInput(1)})
document.querySelector('#two').addEventListener('click',function(){addNumToInput(2)})
document.querySelector('#three').addEventListener('click',function(){addNumToInput(3)})
document.querySelector('#four').addEventListener('click',function(){addNumToInput(4)})
document.querySelector('#five').addEventListener('click',function(){addNumToInput(5)})
document.querySelector('#six').addEventListener('click',function(){addNumToInput(6)})
document.querySelector('#seven').addEventListener('click',function(){addNumToInput(7)})
document.querySelector('#eight').addEventListener('click',function(){addNumToInput(8)})
document.querySelector('#nine').addEventListener('click',function(){addNumToInput(9)})
document.querySelector('#ac').addEventListener('click',runAC)
document.querySelector('#plusMinus').addEventListener('click',runPlusMinus)
document.querySelector('#percent').addEventListener('click',runPercent)
document.querySelector('#divide').addEventListener('click',runDivide)
document.querySelector('#multiply').addEventListener('click',runMultiply)
document.querySelector('#minus').addEventListener('click',runMinus)
document.querySelector('#plus').addEventListener('click',runPlus)
document.querySelector('#equal').addEventListener('click',runEquals)
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
    document.querySelector('#calcSpot').innerText = display2
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
    if(checkNumLength(display) ===true){
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
        display = addCommas(firstNum)
        updateDisplay()
    }else{
        if (dotOn == false) {
            secondNum = inputWhole
        }else{
            secondNum = inputWhole + (inputDec  / tensPlaces(inputDec))
        }
        display = addCommas(secondNum)
        updateDisplay()
    }
}else{
    return false
}
}

function checkNumLength(number){
    if (number.toString().length > 12) {
        console.log('Error: Too many digits. Aborting operation...')
        return false
    }else{
        return true
    }
}

function round(number, places){
    if (number % 1 == 0){return}
    const factor = Math.pow(10, places)
    const answer = (Math.round(number * factor) / factor)
    return answer
}

function addCommas(number){
    let negativeNum = false
    if(number < 0){
        negativeNum = true
    }
    let num = Math.abs(number)
    let wholeNum = Math.trunc(num)
    let numLength = String(wholeNum).length
    let numArray = Array.from(String(wholeNum))
    for(let i = numLength - 3; i > 0; i=i-3){
        numArray.splice(i, 0, ',')
    }
    let numWithCommas = numArray.join('')
    let answer 
    const fullNumLength = String(num).length - 1
    const factor = fullNumLength - numLength
    const decimal = round((num - Math.trunc(num)), factor)
    if (String(num) - String(Math.trunc(num)) != 0){
        if(negativeNum != true){
        answer = numWithCommas + String(decimal).substring(1)
        return answer
        }else{
        answer = '-'+ numWithCommas + String(decimal).substring(1)
        return answer
        }
    }else{
        if(negativeNum != true){
            answer = numWithCommas
            return answer
            }else{
            answer = '-'+ numWithCommas
            return answer
            }
    }
}

function runHalfReset(){
    let saveTotal = total
    runAC()
    firstNum = saveTotal
    equalClicked = false
}

function findDecimalPlaces(number){
    if(number % 1 === 0){return false}
    const wholeNum = Math.trunc(number)
    const wholeNumLength = String(wholeNum).length
    const fullNumLength = String(number).length - 1
    const factor = fullNumLength - wholeNumLength
    return factor
}

function convertToScientificNotation(number){
    let stringNum = String(number)
    let firstDigit
    let lastTwoDigits
    if (stringNum.slice(0,1) != '-'){
        firstDigit = stringNum.slice(0, 1) 
        if (stringNum.slice(1,2) == '.'){
        lastTwoDigits = stringNum.slice(2, 3)
        }else{
            lastTwoDigits = stringNum.slice(1, 3)
        }
    }else{
        firstDigit = stringNum.slice(1, 2)
        if (stringNum.slice(1,2) == '.'){
        lastTwoDigits = stringNum.slice(3, 4)
        }else{
            lastTwoDigits = stringNum.slice(2, 4)
        }
        firstDigit = '-'+firstDigit
    }
    let wholeNum = Math.trunc(number)
    let wholeNumLength = String(wholeNum).length
    let exponent = wholeNumLength - 3
    let finalAnswer = `${firstDigit}.${lastTwoDigits} x 10^${exponent}`
    return finalAnswer
}

function checkAnswer(number){
    if(checkNumLength(number) === false){
        if(findDecimalPlaces(number) != false){
        console.log('Error: Number is too large. Rounding to max digits...')
        let factor = findDecimalPlaces(number)
        let newNum = round(number, factor)
        if(checkNumLength(newNum === false)){
            let newNewNum = convertToScientificNotation(newNum)
            return newNewNum
        }else{
        return newNum
        }
    }else{   
        let finalAnswer = convertToScientificNotation(number)
        return finalAnswer
    }
}
    return number
}

//////////////////////////////
// FUNCTIONS RUNNING ON CLICK
//////////////////////////////

// OTHER

function runAC() {
    firstNum = 0
    secondNum = 0
    inputWhole = 0
    inputDec = 0
    dotOn = false
    modifierClicked = false
    equalClicked = false
    total = 0
    answer = 0
    display = ''
    display2 = ''
    updateDisplay()
}

function runPlusMinus(){
    if (total == 0 && answer == 0) {
        if (secondNum == 0) {
            firstNum = firstNum * -1
            display = addCommas(firstNum)
            updateDisplay()
        }else{
            secondNum = secondNum * -1
            display = addCommas(secondNum)
            updateDisplay()
        }
    }else{
        answer = answer * -1
        total = answer
        display = addCommas(answer)
        updateDisplay()
    }
}

function runPercent(){
    if (total == 0 && answer == 0) {
        if (secondNum == 0) {
            firstNum = firstNum / 100
            display = addCommas(firstNum)
            updateDisplay()
        }else{
            secondNum = secondNum / 100
            display = addCommas(secondNum)
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
    if(equalClicked === false){
    if (modifierClicked == false) {
        modifierClicked = true
        opperator = 'divide'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        dotOn = false
        display2 = `${addCommas(firstNum)} ÷`
        display = ''
        updateDisplay()
    }else{
        opperator = 'divide'
        display2 = `${addCommas(firstNum)} ÷`
        runEqual()
        display2 = display
        display = ''
        updateDisplay()
        return
    }
}else{
        runHalfReset()
        runDivide()
    }
}

function runMultiply(){
    if(equalClicked === false){
    if (modifierClicked == false) {
        modifierClicked = true
        opperator = 'multiply'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        dotOn = false
        display2 = `${addCommas(firstNum)} X`
        display = ''
        updateDisplay()
    }else{
        opperator = 'multiply'
        display2 = `${addCommas(firstNum)} X`
        runEqual()
        display2 = display
        display = ''
        updateDisplay()
        return
    }
}else{
    runHalfReset()
    runMultiply()
}
}

function runMinus(){
    if(equalClicked === false){
    if (modifierClicked == false) {
        modifierClicked = true
        opperator = 'minus'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        dotOn = false
        display2 = `${addCommas(firstNum)} -`
        display = ''
        updateDisplay()
    }else{
        opperator = 'minus'
        display2 = `${addCommas(firstNum)} -`
        runEqual()
        display2 = display
        display = ''
        updateDisplay()
        return
    }
}else{
    runHalfReset()
    runMinus()
}
}

function runPlus(){
    if(equalClicked === false){
    if (modifierClicked == false) {
        modifierClicked = true
        opperator = 'plus'
        secondNum = 0
        inputWhole = 0
        inputDec = 0
        dotOn = false
        display2 = `${addCommas(firstNum)} +`
        display = ''
        updateDisplay()
    }else{
        opperator = 'plus'
        display2 = `${addCommas(firstNum)} +`
        runEqual()
        display2 = display
        display = ''
        updateDisplay()
        return
    }
}else{
    runHalfReset()
    runPlus()
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
    let newAnswer
    if (modifierClicked == false) {
        return
    }else if(opperator == 'plus') {
        if(total != 0){
        total = total + secondNum
        answer = total
        }else{
            total = firstNum + secondNum
            answer = total
        }
        newAnswer = checkAnswer(answer)
        display = addCommas(newAnswer)
        updateDisplay()
    }else if(opperator == 'minus') {
        if(total != 0){
            total = total - secondNum
            answer = total
            }else{
                total = firstNum - secondNum
                answer = total
            }
            newAnswer = checkAnswer(answer)
            ddisplay = addCommas(newAnswer)
            updateDisplay()
    }else if(opperator == 'multiply') {
        if(total != 0){
            total = total * secondNum
            answer = total
            }else{
                total = firstNum * secondNum
                answer = total
            }
            newAnswer = checkAnswer(answer)
            display = addCommas(newAnswer)
            updateDisplay()
    }else if(opperator == 'divide') {
        if(total != 0){
            total = total / secondNum
            answer = total
            }else{
                total = firstNum / secondNum
                answer = total
            }
            newAnswer = checkAnswer(answer)
            display = addCommas(newAnswer)
            updateDisplay()
    }else{
        return null
    }
    display2 = ''
    updateDisplay()
    inputWhole = 0
    inputDec = 0
}

function runEquals(){
    equalClicked = true
    runEqual()
    return
}



