const display = document.querySelector(".display-value");
const keypad = document.querySelector(".keypad");

let expression = "0";
let justCalculated = false;

function updateDisplay() {
	display.textContent = expression;
    }

function enterDigit(digit) {
	if (justCalculated) {
		expression = "0";
		justCalculated = false;
	}

	if (expression === "0") {
		expression = digit;
	} else {
		expression += digit;
	}

	updateDisplay();
    }

function clearCalculator() {
	expression = "0";
	justCalculated = false;
	updateDisplay();
    }

function add(first, second) {
	return first + second;
    }

function subtract(first, second) {
	return first - second;
    }

function multiply(first, second) {
	return first * second;
    }

function divide(first, second) {
	return first / second;
    }

function applyOperator(first, operator, second) {
	switch (operator) {
		case "+":
			return add(first, second);
		case "-":
			return subtract(first, second);
		case "x":
			return multiply(first, second);
		case "/":
			return divide(first, second);
		default:
			return NaN;
	}
}

function showError() {
	expression = "Error";
	justCalculated = true;
	updateDisplay();
}

function calculate() {
    const tokens = expression.split(/([+\-x\/])/);

const invalid =
    tokens.length % 2 === 0 ||
    tokens.some((token, index) =>
        index % 2 === 0 &&
        (token === "" || !Number.isFinite(Number(token)))
    );

if (invalid) {
    showError();
    return;
}

    const numbers = [Number(tokens[0])];
    const operators = [];

    //pass 1 multiplication and division
    for (let i = 1; i < tokens.length; i += 2) {
        const operator = tokens[i];
        const nextNumber = Number(tokens[i + 1]);

        if (operator === "x" || operator === "/") {
            const previousNumber = numbers.pop();
            const result = applyOperator(previousNumber, operator, nextNumber);

            if (!Number.isFinite(result)) {
                showError();
                return;
            }

            numbers.push(result);
        } else {
            operators.push(operator);
            numbers.push(nextNumber);
        }
    }

    //pass 2 addition and subtraction
    let result = numbers[0];

    for (let i = 0; i < operators.length; i++) {
        result = applyOperator(result, operators[i], numbers[i + 1]);
    }

    if (!Number.isFinite(result)) {
        showError();
        return;
    }

    expression = String(result);
    justCalculated = true;
    updateDisplay();
}

keypad.addEventListener("click", (event) => {
	const button = event.target.closest("button");

	if (!button) {
		return;
	}

	const value = button.textContent.trim();

	if (button.classList.contains("key-function")) {
		clearCalculator();
	} else if (button.classList.contains("key-operator")) {
		if (expression === "Error") {
			return;
		}

		if (!justCalculated && /[+\-x/]$/.test(expression)) {
			expression = expression.slice(0, -1) + value;
		} else {
			expression += value;
		}
		justCalculated = false;
		updateDisplay();
	} else if (button.classList.contains("key-equals")) {
		calculate();
	} else {
		enterDigit(value);
	}
});
