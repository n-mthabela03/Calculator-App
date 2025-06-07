// Selecting the display element
let display = document.getElementById('display');

// Calculator state variables
let currentInput = '0';
let operator = null;
let waitingForNewNumber = false;
let previousInput = null;

// Update display content
function updateDisplay() {
    let displayValue = currentInput;

    // Format number for readability
    if (!isNaN(displayValue) && displayValue !== '') {
        let num = parseFloat(displayValue);

        if (Math.abs(num) >= 1e9 || (Math.abs(num) < 1e-6 && num !== 0)) {
            displayValue = num.toExponential(6);
        } else if (displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toPrecision(8);
        } else if (displayValue.includes('.') && displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toFixed(8).replace(/\.?0+$/, '');
        }
    }

    display.textContent = displayValue;
}

// Handle number button click
function inputNumber(num) {
    if (waitingForNewNumber) {
        currentInput = num;
        waitingForNewNumber = false;
    } else {
        currentInput = currentInput === '0' ? num : currentInput + num;
    }
    updateDisplay();
}

// Handle decimal input
function inputDecimal() {
    if (waitingForNewNumber) {
        currentInput = '0.';
        waitingForNewNumber = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    updateDisplay();
}

// Handle operator input
function inputOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const result = performCalculation();
        if (result === null) return;

        currentInput = String(result);
        previousInput = result;
        updateDisplay();
    }

    waitingForNewNumber = true;
    operator = nextOperator;
}

// Perform calculation based on current operator
function performCalculation() {
    const prev = previousInput;
    const current = parseFloat(currentInput);

    if (operator === null || isNaN(prev) || isNaN(current)) {
        return null;
    }

    let result;
    switch (operator) {
        case '+': result = prev + current; break;
        case '-': result = prev - current; break;
        case '*': result = prev * current; break;
        case '/':
            if (current === 0) {
                alert('Cannot divide by zero!');
                return null;
            }
            result = prev / current;
            break;
        default: return null;
    }

    return result;
}

// Final calculation when '=' is pressed
function calculate() {
    const result = performCalculation();
    if (result !== null) {
        currentInput = String(result);
        previousInput = null;
        operator = null;
        waitingForNewNumber = true;
        updateDisplay();
    }
}

// Clear all calculator state
function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForNewNumber = false;
    updateDisplay();
}

// Clear current input only
function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

// Delete last character of input
function deleteLast() {
    currentInput = currentInput.length > 1 ? currentInput.slice(0, -1) : '0';
    updateDisplay();
}

// Keyboard input support
document.addEventListener('keydown', function (event) {
    const key = event.key;

    if (!isNaN(key)) {
        inputNumber(key);
    } else if (key === '.') {
        inputDecimal();
    } else if (['+', '-', '*', '/'].includes(key)) {
        inputOperator(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Delete') {
        clearEntry();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    }
});

// Initialize on page load
updateDisplay();
