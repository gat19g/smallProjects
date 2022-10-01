/////////////////////////////////
// GLOBAL VARIABLES
/////////////////////////////////

//CONST VARs
const STR_BLANK = ''
const STR_ADD = 'add'
const STR_SUB = 'subtract'
const STR_MULTIPLY = 'multiply'
const STR_DIVIDE = 'divide'
const STR_EQUAL = 'equal'
const STR_PERCENT = 'percent'
const STR_PLUSMINUS = 'plusminus'
const STR_ALLCLEAR = 'allclear'
const STR_DOT = 'dot'
const STR_STRING = 'string'
const STR_NUMBER = 'number'
const STR_AC = 'ac' //For clear button state of all clear
const STR_C = 'c' //For clear button state of clear
const STR_Error = 'Error'
const STR_OperatorAdd = ' +'
const STR_OperatorSub = ' -'
const STR_OperatorMulti = ' X'
const STR_OperatorDiv = ' /'
const INT_REMOVE_SPEED = 250

//STRING VARs
let strMainDisplay = STR_BLANK
let strSecondDisplay = STR_BLANK
let strCurrentKey = null
let strLastKey = null
let strLastOperationKey = null
let strPreviousOperationKey = null
let strClearBtnState = STR_AC

//INTEGER VARs
let intCurrentNum = 0
let intSecondNum = null

//BOOLEAN VARs
let bDotOn = false

//ARRAY VARs
let arrClickHistory = []

/////////////////////////////////
// GLOBAL FUNCTIONS
/////////////////////////////////

///// CLICK FUNCTIONS /////

function runAddDigit(intNumber){
    //If the last key was equals, then reset the current number variable
    if(strCurrentKey === STR_EQUAL){
        runClear()
    }
    //Check if the last key was zero to set up variables for accurate decimal calculation
    let intCountOfLastZeros = 0
    if(checkIfLastKeyIsZero() === true){
        intCountOfLastZeros = countLastConsecutiveZeros()
    }
    recordNewClick(`${STR_NUMBER} ${intNumber}`)
    changeACtoC()
    //Adds number to the current number variable
    // Assign decimal length factor
    let intInitialDecLength = 0
        //If the decimal length is not greater than zero, assign the count of last zeros. Otherwise, assign the number of last zeros plus the decimal length
        if(typeof(checkNumLengthDecDigits(intCurrentNum)) != STR_NUMBER){
            intInitialDecLength = intCountOfLastZeros
        }else{
            intInitialDecLength = checkNumLengthDecDigits(intCurrentNum) + intCountOfLastZeros
        }
        checkNumLengthDecDigits(intCurrentNum) + intCountOfLastZeros
    const intDecLengthFactor = Math.pow(10, (intInitialDecLength + 1))
    //If the current number is too long, abort function.
    if(checkNumTooLongForDisplay(intCurrentNum) === true){
        console.log('Error: Cannot add digit. Display full. Aborting function...')
        return undefined
    }
    //If the dot has been clicked, do the following:
    if(bDotOn === true && intNumber !== 0){
        addDigitToDecimal(intNumber, intDecLengthFactor, intCountOfLastZeros)
    }else if(bDotOn === true && intNumber === 0){
            //Format Display Variable
            strMainDisplay = strMainDisplay + '0'
            strMainDisplay = formatDisplayVar(strMainDisplay)
            updateMainDisplay()
            return true
    }
    else //If the dot has not been clicked, do the following:
    {
        intCurrentNum = (intCurrentNum * 10) + intNumber
    }
    //Format Display Variable
    strMainDisplay = intCurrentNum
    strMainDisplay = formatDisplayVar(strMainDisplay)
    updateMainDisplay()
    return true
}

function runDot(){
    recordNewClick(STR_DOT)
    bDotOn = true
    if(checkIfContainsDot(strMainDisplay) == true){
        return
    }else{
        strMainDisplay = strMainDisplay + '.'
        updateMainDisplay()
        return
    }
}

////////////////////////////////
////// Clear Key Functions /////

function runClearKey(){
    recordNewClick(STR_ALLCLEAR)
    if(strClearBtnState === STR_AC){
        runClearAll()
    }else if(strClearBtnState === STR_C && intSecondNum === null){
        runClearAll()
    }else if(strClearBtnState === STR_C && intSecondNum !== null){
        runClear()
    }else{
        console.log('Error: Clear key not assigned. Aborting function...')
        return
    }
}

function runClearAll(){
    changeCtoAC()
    resetActiveButtons()
    resetGlobalVariables()
    console.clear()
    clearMainDisplay()
    clearSecondDisplay()
}


function runClear(){ //UPDATE FUNCTION IN FUTURE
    //Clear boolean vars
    bDotOn = false
    //Reset active buttons
    resetActiveButtons()
    changeCtoAC()
    //Update display
    intCurrentNum = 0
    clearMainDisplay()
}

function changeACtoC(){
    strClearBtnState = STR_C
    document.querySelector('#ac').innerText = 'C'
}

function changeCtoAC(){
    strClearBtnState = STR_AC
    document.querySelector('#ac').innerText = 'AC'
}
///// END CLEAR KEY FUNCTIONS /////
///////////////////////////////////

function runPlusMinus(){
    recordNewClick(STR_PLUSMINUS)
    intCurrentNum = toggleNegative(intCurrentNum)
    strMainDisplay = intCurrentNum
    strMainDisplay = formatDisplayVar(strMainDisplay)
    updateMainDisplay()
}

function runPercent(){
    recordNewClick(STR_PERCENT)
    intCurrentNum = convertFromPercent(intCurrentNum)
    strMainDisplay = intCurrentNum
    strMainDisplay = formatDisplayVar(strMainDisplay)
    updateMainDisplay()
}

////////////////////////////////
////// Operation Functions /////

function runOperation(strSelector){
    //Record click
    recordNewClick(strSelector)
    changeACtoC()
    //If divide, multiply, add, or subtract clicked, perform that operation
    if(strSelector === STR_ADD){
        recordOperationKeyClick(STR_ADD)
        resetActiveButtons()
        setButtonAsActive('#plus')
        runOperationAdd()
    }else if(strSelector === STR_SUB){
        recordOperationKeyClick(STR_SUB)
        resetActiveButtons()
        setButtonAsActive('#minus')
        runOperationSub()
    }else if(strSelector === STR_MULTIPLY){
        recordOperationKeyClick(STR_MULTIPLY)
        resetActiveButtons()
        setButtonAsActive('#multiply')
        runOperationMultiply()
    }else if(strSelector === STR_DIVIDE){
        recordOperationKeyClick(STR_DIVIDE)
        resetActiveButtons()
        setButtonAsActive('#divide')
        runOperationDivide()
    }
    //If equal sign clicked, run the equal operation
    else if(strSelector === STR_EQUAL){
        runOperationEqual()
    }else{ //Otherwise, record an error.
        console.log(`Error: Cannot execute operation function with '${strSelector}' as input. Aborting function...`)
        return false
    }
}

// Add Operation Function
function runOperationAdd(){
    let answer
    // If a second number exists
    if(intSecondNum !== null){
        //If the current number equals 0, abort.
        if(intCurrentNum === 0 && strLastKey !== 0){
            strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorAdd)
            updateSecondDisplay()
            return false
        }
        if(strCurrentKey === STR_EQUAL || (strLastOperationKey === STR_ADD && strLastKey !== STR_EQUAL)){
            //Add current number and second number
            answer = intCurrentNum + intSecondNum
            //Send answer to the second number variable
            intSecondNum = answer
            //Clear the dotOn variable
            bDotOn = false
            //Update the second display
            strSecondDisplay = formatDisplayVar(intSecondNum)
            updateSecondDisplay()
            changeCtoAC()
            clearMainDisplay()
            //If the last key was a number, reset the active button
            if(strCurrentKey === STR_EQUAL && strLastKey.includes('number') ){
                resetActiveButtons()
            }
        }
        if(strCurrentKey === STR_ADD || strLastOperationKey !== STR_ADD){
            resetForOperation()
            strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorAdd)
            updateSecondDisplay()
        }
    }
    else //Otherwise, a second number does not exist
    {
        if(checkIfNumberClicked()){sendCurrNumToSecondNum()}
        resetForOperation()
        strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorAdd)
        if( (intSecondNum === null) || (intSecondNum === 0 && !checkIfNumberClicked(0))){strSecondDisplay = STR_OperatorAdd}
        updateSecondDisplay()
    }
}

function runOperationSub(){
    let answer
    // If a second number exists
    if(intSecondNum !== null){
        //If the current number equals 0, abort.
        if(intCurrentNum === 0 && strLastKey !== 0){
            strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorSub)
            updateSecondDisplay()
            return false
        }
        if(strCurrentKey === STR_EQUAL || (strLastOperationKey === STR_SUB && strLastKey !== STR_EQUAL)){
            //Add current number and second number
            answer = intSecondNum - intCurrentNum
            //Send answer to the second number variable
            intSecondNum = answer
            //Clear the dotOn variable
            bDotOn = false
            //Update the second display
            strSecondDisplay = formatDisplayVar(intSecondNum)
            updateSecondDisplay()
            changeCtoAC()
            clearMainDisplay()
            //If the last key was a number, reset the active button
            if(strCurrentKey === STR_EQUAL && strLastKey.includes('number') ){
                resetActiveButtons()
            }
        }
        if(strCurrentKey === STR_SUB || strLastOperationKey !== STR_SUB){
            resetForOperation()
            strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorSub)
            updateSecondDisplay()
        }
    }
    else //Otherwise, a second number does not exist
    {
        if(checkIfNumberClicked()){sendCurrNumToSecondNum()}
        resetForOperation()
        strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorSub)
        if( (intSecondNum === null) || (intSecondNum === 0 && !checkIfNumberClicked(0))){strSecondDisplay = STR_OperatorSub}
        updateSecondDisplay()
    }
}

function runOperationMultiply(){
    let answer
    // If a second number exists
    if(intSecondNum !== null){
        //If the current number equals 0, abort.
        if(intCurrentNum === 0 && strLastKey !== 0){
            strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorMulti)
            updateSecondDisplay()
            return false
        }
        if(strCurrentKey === STR_EQUAL || (strLastOperationKey === STR_MULTIPLY && strLastKey !== STR_EQUAL)){
            //Add current number and second number
            answer = intSecondNum * intCurrentNum
            //Send answer to the second number variable
            intSecondNum = answer
            //Clear the dotOn variable
            bDotOn = false
            //Update the second display
            strSecondDisplay = formatDisplayVar(intSecondNum)
            updateSecondDisplay()
            changeCtoAC()
            clearMainDisplay()
            //If the last key was a number, reset the active button
            if(strCurrentKey === STR_EQUAL && strLastKey.includes('number') ){
                resetActiveButtons()
            }
        }
        if(strCurrentKey === STR_MULTIPLY || strLastOperationKey !== STR_MULTIPLY){
            resetForOperation()
            strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorMulti)
            updateSecondDisplay()
        }
    }
    else //Otherwise, a second number does not exist
    {
        if(checkIfNumberClicked()){sendCurrNumToSecondNum()}
        resetForOperation()
        strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorMulti)
        if( (intSecondNum === null) || (intSecondNum === 0 && !checkIfNumberClicked(0))){strSecondDisplay = STR_OperatorMulti}
        updateSecondDisplay()
    }
}

function runOperationDivide(){
    let answer
    // If a second number exists
    if(intSecondNum !== null){
        //If the current number equals 0, abort.
        if(intCurrentNum === 0 && strLastKey !== 0){
            strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorDiv)
            updateSecondDisplay()
            return false
        }
        if(strCurrentKey === STR_EQUAL || (strLastOperationKey === STR_DIVIDE && strLastKey !== STR_EQUAL)){
            //Add current number and second number
            answer = intSecondNum / intCurrentNum
            //Send answer to the second number variable
            intSecondNum = answer
            //Clear the dotOn variable
            bDotOn = false
            //Update the second display
            strSecondDisplay = formatDisplayVar(intSecondNum)
            updateSecondDisplay()
            changeCtoAC()
            clearMainDisplay()
            //If the last key was a number, reset the active button
            if(strCurrentKey === STR_EQUAL && strLastKey.includes('number') ){
                resetActiveButtons()
            }
        }
        if(strCurrentKey === STR_DIVIDE || strLastOperationKey !== STR_DIVIDE){
            resetForOperation()
            strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorDiv)
            updateSecondDisplay()
        }
    }
    else //Otherwise, a second number does not exist
    {
        if(checkIfNumberClicked()){sendCurrNumToSecondNum()}
        resetForOperation()
        strSecondDisplay = addOperatorToString(strSecondDisplay, STR_OperatorMulti)
        if( (intSecondNum === null) || (intSecondNum === 0 && !checkIfNumberClicked(0))){strSecondDisplay = STR_OperatorMulti}
        updateSecondDisplay()
    }
}

function runOperationEqual(){
    //If the last operation key clicked was add
    if(strLastOperationKey === STR_ADD){
        runOperationAdd()
    }
    if(strLastOperationKey === STR_SUB){
        runOperationSub()
    }
    if(strLastOperationKey === STR_MULTIPLY){
        runOperationMultiply()
    }
    if(strLastOperationKey === STR_DIVIDE){
        runOperationDivide()
    }
}

function sendCurrNumToSecondNum(){
    //Send the current number to the second number variable
    intSecondNum = intCurrentNum
}

function resetForOperation(){
    //Clear the current number
    intCurrentNum = 0
    //Clear the dotOn variable
    bDotOn = false
    //Update the display
    strSecondDisplay = intSecondNum
    strSecondDisplay = formatDisplayVar(intSecondNum)
    updateSecondDisplay()
    clearMainDisplay()
}
///// END OPERATION FUNCTIONS /////
///////////////////////////////////

function runErrorCheck(intNumber){
    if(checkForCalcError(intNumber) === true){
        sendErrorMessageToMainDisplay()
        return true
    }else{
        return false
    }
}

// DISPLAY Functions //
function updateMainDisplay(){
    document.querySelector('#answerSpot').innerText = strMainDisplay
}

function updateSecondDisplay(){
    document.querySelector('#calcSpot').innerText = strSecondDisplay
}

function formatDisplayVar(input){
    //Takes in a numeric answer, converts to string, adds commas and/or scientific notation
    let strNum = String(input)
    let bNumHasDec = false
    let bNumNeg = false
    let bNumTooBig = false
    let intNumWhole = null
    let intNumDec = null
    //If number is negative, convert to absolute and record the original number is negative
    if(checkIfNumNegative(input)){
        strNum = toggleNegative(strNum)
        bNumNeg = true
    }
    //If number has a decimal, record true
    if(checkNumLengthDecDigits(input) > 0){
        bNumHasDec = true
    }
    //If number has decimals, split the number, else put number into number whole
    if(bNumHasDec === true){
        let intSplitNum = splitNumStrAtDec(strNum)
        intNumWhole = intSplitNum[0]
        intNumDec = intSplitNum[1]
    }else{
        intNumWhole = strNum
    }

    //Add commas to whole number
    intNumWhole = addCommas(intNumWhole)

    //Decide if number needs to be reduced
    // if(intNumWhole.length + intNumDec.length > 9){

    // }
    //If number needs to be reduced:
        //If number is less than zero, convert to decimal scientific notation ex: 4.5e-5

        //If number is greater than zero, but has more decimal places than whole numbers, round the decimal
        //Ex: 45.3453453445 becomes 45.345345

        //If number is greater than zero, but has a quantity of whole nubmer integers greater than or equal to decimal places:
            //If the number of whole number integers is greater than 9, convert to whole number scientific notation

            //If the whole number integers is 9 or less, round the decimal places up.



    //Join number together
    //Add negative back, if needed
    if(bNumNeg === true){
        intNumWhole = toggleNegative(intNumWhole)
    }
    if(bNumHasDec === true){
        return `${intNumWhole}.${intNumDec}`
    }else{
        return intNumWhole
    }
}

function sendErrorMessageToMainDisplay(){
    clearMainDisplay()
    clearSecondDisplay()
    strMainDisplay = STR_Error
    updateMainDisplay()
}

function clearMainDisplay(){
    strMainDisplay = STR_BLANK
    updateMainDisplay()
}

function clearSecondDisplay(){
    strSecondDisplay = STR_BLANK
    updateSecondDisplay()
}

function addOperatorToString(strInput, strOperator){
    let bHasOperator = false
    let strString = strInput
    if(checkIfStringHasOperator(strString)){bHasOperator = true}
    if(bHasOperator === true){strString = removeFromEndOfString(strString, 2)}
    strString = addToEndOfString(strString, strOperator)
    return strString
}

function checkIfStringHasOperator(strInput){
    if(strInput.includes(STR_OperatorAdd) || strInput.includes(STR_OperatorSub) || strInput.includes(STR_OperatorMulti) || strInput.includes(STR_OperatorDiv)){
        return true
    }else{
        return false
    }
}

function addToEndOfString(strInput, strAdd){
    return strInput + strAdd
}

function removeFromEndOfString(strInput, intNumOfChar){
    return strInput.slice(0 , (strInput.length - intNumOfChar))
}

///// HELPER FUNCTIONS /////

// Click Helper Functions //
function recordNewClick(input){
    // Record the last key stroke and add to the array history
    strLastKey = strCurrentKey
    strCurrentKey = input
    arrClickHistory.push(strCurrentKey)
    return arrClickHistory
}

function checkIfLastKeyIsOperationKey(input){
    if(input === STR_ADD || input === STR_SUB || input === STR_MULTIPLY || input === STR_DIVIDE){
        return true
    }else{
        return false
    }
}

function recordOperationKeyClick(input){
    strPreviousOperationKey = strLastOperationKey
    strLastOperationKey = input
}

function addDigitToDecimal(intDigit, intDecimalPlace, intNumberOfZeros){
    let intDecLengthAfter = checkNumLengthDecDigits(intCurrentNum) + 1 + intNumberOfZeros
    intCurrentNum = intCurrentNum + (intDigit / intDecimalPlace)
    intCurrentNum = roundDecimal(intCurrentNum, intDecLengthAfter)
}

function convertFromPercent(intNumber){
    let answer
    let intDecLengthAfter = checkNumLengthDecDigits(intNumber) + 2
    answer = intNumber / 100
    answer = roundDecimal(answer, intDecLengthAfter)
    return answer
}

function setButtonAsActive(strSelector){
    document.querySelector(strSelector).classList.add('active')
}

function resetActiveButtons(){
    if(document.querySelector('h1.btn.active') === null){
        return false
    }
    while(document.querySelector('h1.btn.active') !== null){
    document.querySelector('h1.btn.active').classList.remove('active')
    }
    return true
}

// Number Beautification and Stylizing //
function addCommas(strWholeDigitNumber){
    //If variable is not a string, abort function.
    if(typeof(strWholeDigitNumber) != STR_STRING){
        console.log('Error: addCommas function can only operate on strings. Aborting function...')
        return strWholeDigitNumber
    }
    //If commas present, abort function.
    if(strWholeDigitNumber.includes(',')){
        console.log('Error: addCommas function cannot add commas when they are already present. Aborting function...')
        return strWholeDigitNumber
    }
    //If decimal point present, abort function.
    if(strWholeDigitNumber.includes('.')){
        console.log('Error: addCommas function cannot add commas to decimal number. Aborting function...')
        return strWholeDigitNumber
    }
    //If number is negative, abort function.
    if(checkIfNumNegative(strWholeDigitNumber)){
        console.log('Error: addCommas function cannot add commas to negative number. Aborting function...')
        return strWholeDigitNumber
    }
    //If number is 0, abort function.
    if(strWholeDigitNumber == 0){
        //console.log('Error: addCommas function cannot add commas to 0. Aborting function...')
        return strWholeDigitNumber
    }
    let intNumLength = strWholeDigitNumber.length
    let arrNum = Array.from(strWholeDigitNumber)
    for(let i = intNumLength - 3; i > 0; i=i-3){
        arrNum.splice(i, 0, ',')
    }
    return arrNum.join('')
}

function checkIfContainsDot(strInput){
    if(strInput.includes('.')){
        return true
    }else{
        return false
    }
}

// Number Length Check Functions //
function checkNumTooLongForDisplay(intNumber){
    if (checkNumLengthFull(intNumber) > 9){
        return true
    }else{
        return false
    }
}

function checkNumLengthFull(intNumber){
    let strNumber = String(intNumber)
    if (strNumber.includes('.')){
        return (strNumber.length - 1)
    }else{
    return strNumber.length
    }
}

function checkNumLengthWholeDigits(intNumber){
    let strNumber = String(Math.abs(intNumber))
    if (strNumber.includes('.')){
    strNumber = splitNumStrAtDec(strNumber)
    return strNumber[0].length
    }else{
        return strNumber.length
    }
}

function checkNumLengthDecDigits(intNumber){
    let strNumber = String(Math.abs(intNumber))
    if (strNumber.includes('.')){
    strNumber = splitNumStrAtDec(strNumber)
    return strNumber[1].length
    }else{
        return 0
    }
}

// Number Calculation Functions

function toggleNegative(number){
    //Works for string or integer
    //If integer or string number is negative, it will make it positive, and vice versa
    let strVarType = typeof(number)
    let answer = null
    const numLength = checkNumLengthFull(number)
    if(strVarType === STR_NUMBER){
        answer = number * -1
        return answer
    }else if(strVarType === STR_STRING){
        if(checkIfNumNegative(number)){
            answer = number.slice(1,numLength + 1)
            return answer
        }else{
            answer = '-' + number
            return answer
        }
    }else{
        console.log('Error: Variable type not supported for toggleNegative() function. Aborting function...')
        return undefined
    }
}

function roundDecimal(intNumber, intDecimalPlaces){
    let intFactor = Math.pow(10, intDecimalPlaces)
    let answer = Math.round(intNumber * intFactor) / intFactor
    return answer
}

//Zeros clicked functions
function checkIfLastKeyIsZero(){
    let intNumOfClicks = arrClickHistory.length
    if(arrClickHistory[intNumOfClicks - 1] === STR_NUMBER + ' 0'){
        return true
    }else
    {
        return false
    }
}

function checkIfNumberClicked(intInput){
    let strCheckNum
    let intCountOfNum = 0
    if(typeof(intInput) === STR_NUMBER)
    {strCheckNum = 'number ' + String(intInput)}
    else
    {strCheckNum = 'number'}
    let intNumOfClicks = arrClickHistory.length -1
    if (arrClickHistory.length === 0){return false} 
    for(let i = intNumOfClicks; i >= 0; i--){
        if(arrClickHistory[i].includes(strCheckNum)){
            intCountOfNum++
        }
    }
    if(intCountOfNum > 0){
        return true
    }else{
        return false
    }
}

function checkLastKey(intInput){
    return (arrClickHistory[intInput - 1])
}

function countLastConsecutiveZeros(){
    //If the last key clicked is not zero, end function
    if(checkIfLastKeyIsZero() === false){
        console.log(`Error: Last key clicked is '${strLastKey}'. The function countLastConsecutiveZeros() cannot work if last key is not zero. Aborting function`)
        return false
    }
    //Create a loop that counts the number of 0s clicked in a row
    let intNumOfClicks = arrClickHistory.length
    let intAnswer = 0
    const strZero = STR_NUMBER + ' 0'
    while(arrClickHistory[intNumOfClicks - 1] === strZero){
        intAnswer++
        intNumOfClicks--
    }
    return intAnswer

}

// Misc. Functions
function splitNumStrAtDec(strNumber){
    let arrNum = strNumber.split('.')
    return arrNum
}

function checkIfSecondNumExists(){
    if(intSecondNum !== null){
        return true
    }else{
        return false
    }
}

function checkIfNumNegative(number){
    //Works for string or integer
    let strVarType = typeof(number)
    if(strVarType === STR_NUMBER){
        if(number < 0){
            return true //Return true that the number is less than 0
        }else{
            return false //Return false, number is positive
        }
    }else if(strVarType === STR_STRING){
        if(number.includes('-')){
            return true //Return true that the number string has a negative sign
        }else{
            return false //Return false, no negative sign found
        }
    }else{
        console.log('Error: Variable type not supported for checkIfNumNegative() function. Aborting function...')
        return undefined
    }
}

function checkIfInteger(intNumber){
    if(intNumber === null || intNumber === undefined){
        return false
    }else if (typeof(intNumber) !== STR_NUMBER){
        return false
    }else{
        return true
    }
}

function checkForCalcError(intNumber){
    if(checkIfInteger(intNumber) === false){
        console.log(`Error: number '${intNumber}' is not an integer.`)
        return true
    }else{
        return false
    }
}

function resetGlobalVariables(){
strMainDisplay = STR_BLANK
strSecondDisplay = STR_BLANK
strCurrentKey = null
strLastKey = null
strLastOperationKey = null
strPreviousOperationKey = null
strClearBtnState = STR_AC
intCurrentNum = 0
intSecondNum = null
bDotOn = false
arrClickHistory = []
}

function runSelectKeyEventAction(inputKey , inputCode){
    console.log(inputKey)
    console.log(inputCode)
    //If keystroke is a number, run the add digit function
    if(inputKey == 0){
        document.querySelector('#zero').classList.add('keyOn')
        runAddDigit(0)
        setTimeout(function(){document.querySelector('#zero').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 1){
        document.querySelector('#one').classList.add('keyOn')
        runAddDigit(1)
        setTimeout(function(){document.querySelector('#one').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 2){
        document.querySelector('#two').classList.add('keyOn')
        runAddDigit(2)
        setTimeout(function(){document.querySelector('#two').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 3){
        document.querySelector('#three').classList.add('keyOn')
        runAddDigit(3)
        setTimeout(function(){document.querySelector('#three').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 4){
        document.querySelector('#four').classList.add('keyOn')
        runAddDigit(4)
        setTimeout(function(){document.querySelector('#four').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 5){
        document.querySelector('#five').classList.add('keyOn')
        runAddDigit(5)
        setTimeout(function(){document.querySelector('#five').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 6){
        document.querySelector('#six').classList.add('keyOn')
        runAddDigit(6)
        setTimeout(function(){document.querySelector('#six').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 7){
        document.querySelector('#seven').classList.add('keyOn')
        runAddDigit(7)
        setTimeout(function(){document.querySelector('#seven').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 8){
        document.querySelector('#eight').classList.add('keyOn')
        runAddDigit(8)
        setTimeout(function(){document.querySelector('#eight').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey == 9){
        document.querySelector('#nine').classList.add('keyOn')
        runAddDigit(9)
        setTimeout(function(){document.querySelector('#nine').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    //Other keystrokes
    if(inputKey === '.'){
        document.querySelector('#dot').classList.add('keyOn')
        runDot()
        setTimeout(function(){document.querySelector('#dot').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey === 'c'){
        document.querySelector('#ac').classList.add('keyOn')
        runClearKey()
        setTimeout(function(){document.querySelector('#ac').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }
    if(inputKey === '_'){
        document.querySelector('#plusMinus').classList.add('keyOn')
        runPlusMinus()
        setTimeout(function(){document.querySelector('#plusMinus').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }
    if(inputKey === '%'){
        document.querySelector('#percent').classList.add('keyOn')
        runPercent()
        setTimeout(function(){document.querySelector('#percent').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    if(inputKey === '+' || inputKey === 'p' || inputKey === 'P'){
        document.querySelector('#plus').classList.add('keyOn')
        runOperation(STR_ADD)
        setTimeout(function(){document.querySelector('#plus').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }
    if(inputKey === '-'){
        document.querySelector('#minus').classList.add('keyOn')
        runOperation(STR_SUB)
        setTimeout(function(){document.querySelector('#minus').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }
    if(inputKey === 'x' || inputKey === 'X' || inputKey === `\u002A`){
        document.querySelector('#multiply').classList.add('keyOn')
        runOperation(STR_MULTIPLY)
        setTimeout(function(){document.querySelector('#multiply').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }
    if(inputKey === '/' || inputKey === 'd' || inputKey === 'D'){
        document.querySelector('#divide').classList.add('keyOn')
        runOperation(STR_DIVIDE)
        setTimeout(function(){document.querySelector('#divide').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }


    if(inputKey === 'Enter'){
        document.querySelector('#equal').classList.add('keyOn')
        runOperation(STR_EQUAL)
        setTimeout(function(){document.querySelector('#equal').classList.remove('keyOn')}, INT_REMOVE_SPEED)
    }

    return
}

/////////////////////////////////
// GLOBAL EVENT LISTENERS
/////////////////////////////////

// Mouse click listeners
document.querySelector('#zero').addEventListener('click',function(){runAddDigit(0)})
document.querySelector('#one').addEventListener('click',function(){runAddDigit(1)})
document.querySelector('#two').addEventListener('click',function(){runAddDigit(2)})
document.querySelector('#three').addEventListener('click',function(){runAddDigit(3)})
document.querySelector('#four').addEventListener('click',function(){runAddDigit(4)})
document.querySelector('#five').addEventListener('click',function(){runAddDigit(5)})
document.querySelector('#six').addEventListener('click',function(){runAddDigit(6)})
document.querySelector('#seven').addEventListener('click',function(){runAddDigit(7)})
document.querySelector('#eight').addEventListener('click',function(){runAddDigit(8)})
document.querySelector('#nine').addEventListener('click',function(){runAddDigit(9)})

document.querySelector('#dot').addEventListener('click',runDot)

document.querySelector('#ac').addEventListener('click',runClearKey)
document.querySelector('#plusMinus').addEventListener('click',runPlusMinus)
document.querySelector('#percent').addEventListener('click',runPercent)

document.querySelector('#plus').addEventListener('click',function(){runOperation(STR_ADD)})
document.querySelector('#minus').addEventListener('click',function(){runOperation(STR_SUB)})
document.querySelector('#multiply').addEventListener('click',function(){runOperation(STR_MULTIPLY)})
document.querySelector('#divide').addEventListener('click',function(){runOperation(STR_DIVIDE)})

document.querySelector('#equal').addEventListener('click',function(){runOperation(STR_EQUAL)})

// Keyboard listeners
document.addEventListener('keydown', (KeyboardEvent) => runSelectKeyEventAction(KeyboardEvent.key, KeyboardEvent.code))

/*  ///// PSEUDO CODE /////
/////Variables Needed

//CONST VARs
const STR_BLANK = ''
const STR_ADD = 'add'
const STR_SUB = 'subtract'
const STR_MULTIPLY = 'multiply'
const STR_DIVIDE = 'divide'
const STR_EQUAL = 'equals'
const STR_PERCENT = 'percent'
const STR_PLUSMINUS = 'plusminus'
const STR_ALLCLEAR = 'allclear'

//STRING VARs
let strMainDisplay = STR_BLANK
let strSecondDisplay = STR_BLANK
let strCurrentKey = null
let strLastKey = null

//INTEGER VARS
let intCurrentNum = 0
let intSecondNum = null


/////WHEN USER CLICKS A DIGIT:
If the intCurrentNum is too long, abort function.

If the dot has been clicked:
    Use function to add digit to the end of the decimal value of the intCurrentNum variable
If the dot has not been clicked:
    Use function to add digit to the end of the integer value of the intCurrentNum variable

Update the strMainDisplay variable with the intCurrentNum variable
Add commas to the integers (but not decimals) of the strMainDisplay
Update the display area with the strMainDisplay variable
end function

/////WHEN USER CLICKS AN OPERATION:
    Make strCurrentOpperator euqal to the opperation just clicked
    If intCurrentNum equals 0, then abort function, else, keep going

If a intSecondNum is not stored (equals null):
    move the intCurrentNum into the intSecondNum variable
    clear the intCurrentNum variable (make equal to 0)
    
    //update main display
    update the strMainDisplay variable with the STR_BLANK variable
    update the main display

    //update second display
    update the strSecondDisplay variable with the intSecondNum variable
    Add commas to the integers (but not decimals) of the strSecondDisplay
    Add the current opperator variable to the strSecondDisplay variable
    update the second display
    end function

If a second number is stored (does not equal null):
    perform selected operation with intSecondNum variable and intCurrentNum variable (except division)
        If strCurrentOpperator = divide, the special divide function
            - find out how many decimals are in each number
            - assign intFirstNumDecPlaces and intSecondNumDecPlaces
            - multiply first number by 10^intFirstNumDecPlaces and second number likewise
            - divide the whole integer numbers
            - convert back to decimal
            - return result

    store the answer to the intSecondNum variable
    make intCurrentNum variable = 0

    //update main display
    make strMainDisplay variable = the STR_BLANK variable
    update the main display

    //update second display
    save the intSecondNum to the strSecondDisplay variable
    If display variable is too long, convert to scientific notation
    Otherwise, add commas to the whole integers only
    update the second display

    
/////WHEN USER CLICKS EQUALS
    If intSecondNum = null, abort function

    Otherwise,
    perform selected operation with intSecondNum variable and intCurrentNum variable (except division)
        If strCurrentOpperator = divide, the special divide function
            - find out how many decimals are in each number
            - assign intFirstNumDecPlaces and intSecondNumDecPlaces
            - multiply first number by 10^intFirstNumDecPlaces and second number likewise
            - divide the whole integer numbers
            - convert back to decimal
            - return result

    store the answer to the intSecondNum variable
    make intCurrentNum variable = 0

    //update main display
    make strMainDisplay variable = the STR_BLANK variable
    update the main display

    //update second display
    save the intSecondNum to the strSecondDisplay variable
    If display variable is too long, convert to scientific notation
    Otherwise, add commas to the whole integers only
    update the second display

/////WHEN USER CLICKS +/- variable
    if the current number is not 0, 
    convert the current number to whole number by multiplying by 10^number of decimal places
    multiply the current number by -1
    divide by 10^ of decimal places





*/
