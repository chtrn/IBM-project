        let display = document.getElementById('display');
        let historyList = document.getElementById('history-list');
        let currentInput = '0';
        let operator = '';
        let previousInput = '';
        let shouldResetDisplay = false;
        let history = [];

        function updateDisplay() {
            display.textContent = currentInput;
        }

        function appendToDisplay(value) {
            if (shouldResetDisplay) {
                currentInput = '0';
                shouldResetDisplay = false;
            }

            if (currentInput === '0' && value !== '.') {
                currentInput = value;
            } else {
                currentInput += value;
            }
            
            updateDisplay();
        }

        function clearDisplay() {
            currentInput = '0';
            operator = '';
            previousInput = '';
            shouldResetDisplay = false;
            updateDisplay();
        }

        function deleteLast() {
            if (currentInput.length > 1) {
                currentInput = currentInput.slice(0, -1);
            } else {
                currentInput = '0';
            }
            updateDisplay();
        }

        function calculate() {
            try {
                let expression = currentInput.replace(/×/g, '*');
                let result = eval(expression);
                
                if (isNaN(result) || !isFinite(result)) {
                    throw new Error('Invalid calculation');
                }

                addToHistory(currentInput + ' = ' + result);
                
                if (result % 1 === 0) {
                    currentInput = result.toString();
                } else {
                    currentInput = result.toFixed(8).replace(/\.?0+$/, '');
                }
                
                shouldResetDisplay = true;
                updateDisplay();
                
            } catch (error) {
                currentInput = 'Error';
                shouldResetDisplay = true;
                updateDisplay();
                
                setTimeout(() => {
                    clearDisplay();
                }, 2000);
            }
        }

        function addToHistory(calculation) {
            history.unshift(calculation);
            
            if (history.length > 10) {
                history.pop();
            }
            
            updateHistoryDisplay();
        }

        function updateHistoryDisplay() {
            historyList.innerHTML = '';
            
            if (history.length === 0) {
                historyList.innerHTML = '<div class="history-item">Belum ada perhitungan</div>';
                return;
            }
            
            history.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.textContent = item;
                historyList.appendChild(historyItem);
            });
        }

        document.addEventListener('keydown', function(event) {
            const key = event.key;
            
            if (key >= '0' && key <= '9') {
                appendToDisplay(key);
            } else if (key === '.') {
                appendToDisplay('.');
            } else if (key === '+' || key === '-') {
                appendToDisplay(key);
            } else if (key === '*') {
                appendToDisplay('*');
            } else if (key === '/') {
                event.preventDefault();
                appendToDisplay('/');
            } else if (key === 'Enter' || key === '=') {
                event.preventDefault();
                calculate();
            } else if (key === 'Escape' || key === 'c' || key === 'C') {
                clearDisplay();
            } else if (key === 'Backspace') {
                deleteLast();
            }
        });

        updateHistoryDisplay();
        
        window.addEventListener('load', function() {
            document.querySelector('.calculator').style.opacity = '0';
            document.querySelector('.calculator').style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                document.querySelector('.calculator').style.transition = 'all 0.5s ease';
                document.querySelector('.calculator').style.opacity = '1';
                document.querySelector('.calculator').style.transform = 'scale(1)';
            }, 100);
        });