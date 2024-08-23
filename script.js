class TableRow {
    constructor(rowNum, enabled, textValue, dropdownValue, toggleValue) {
        this.rowNum = rowNum;
        this.enabled = enabled;
        this.textValue = textValue || '';
        this.dropdownValue = dropdownValue || 'dropdownItem1';
        this.toggleValue = toggleValue || 'Auto';
        this.rowElement = this.createRowElement();
    }

    createRowElement() {
        const row = document.createElement('tr');
        if (!this.enabled) row.classList.add('disabled');

        // SI # column
        const siCell = document.createElement('td');
        siCell.textContent = this.rowNum + 1;
        row.appendChild(siCell);

        // Toggle button column
        const toggleCell = document.createElement('td');
        const toggleButton = document.createElement('button');
        toggleButton.className = 'toggle-button';
        toggleButton.textContent = this.toggleValue;
        toggleButton.onclick = () => {
            const newValue = toggleButton.textContent === 'Auto' ? 'Manual' : 'Auto';
            toggleButton.textContent = newValue;
            this.saveState();
        };
        toggleCell.appendChild(toggleButton);
        row.appendChild(toggleCell);

        // Dropdown column
        const dropdownCell = document.createElement('td');
        const dropdown = document.createElement('select');
        dropdown.className = 'dropdown';
        for (let i = 1; i <= 10; i++) {
            const option = document.createElement('option');
            option.text = `dropdownItem${i}`;
            option.value = `dropdownItem${i}`;
            if (option.value === this.dropdownValue) {
                option.selected = true;
            }
            dropdown.add(option);
        }
        dropdown.onchange = (e) => {
            this.dropdownValue = e.target.value;
            this.saveState();
        };
        dropdownCell.appendChild(dropdown);
        row.appendChild(dropdownCell);

        // Text field column
        const textFieldCell = document.createElement('td');
        const textField = document.createElement('input');
        textField.type = 'text';
        textField.value = this.textValue;
        textField.oninput = (e) => {
            this.textValue = e.target.value;
            this.saveState();
        };
        textFieldCell.appendChild(textField);
        row.appendChild(textFieldCell);

        // Disable elements if the row is disabled
        if (!this.enabled) {
            toggleButton.disabled = true;
            dropdown.disabled = true;
            textField.disabled = true;
        }

        return row;
    }

    saveState() {
        const savedState = JSON.parse(sessionStorage.getItem('siTableState')) || {};
        savedState[this.rowNum] = {
            enabled: this.enabled,
            textValue: this.textValue,
            dropdownValue: this.dropdownValue,
            toggleValue: this.toggleValue
        };
        sessionStorage.setItem('siTableState', JSON.stringify(savedState));
    }
}

class SITable {
    constructor(totalRows, initialSIs) {
        this.totalRows = totalRows;
        this.totalSIs = initialSIs;
        this.textValues = {}; // Object to store text field values
        this.tableBody = document.getElementById('siTable').getElementsByTagName('tbody')[0];
        this.loadState();
        this.updateSICountDisplay();
        this.renderTable();
    }

    loadState() {
        const savedState = JSON.parse(sessionStorage.getItem('siTableState')) || {};
        for (let i = 0; i < this.totalRows; i++) {
            if (savedState[i]) {
                this.textValues[i] = savedState[i].textValue || '';
            }
        }
    }

    updateSICountDisplay() {
        document.getElementById('totalSIs').textContent = this.totalSIs;
        document.getElementById('numEnabled').value = this.totalSIs;
    }

    renderTable() {
        this.clearTable();
        for (let i = 0; i < this.totalRows; i++) {
            const textValue = this.textValues[i] || ''; // Get stored text value
            const savedState = JSON.parse(sessionStorage.getItem('siTableState')) || {};
            const state = savedState[i] || {};
            const row = new TableRow(
                i,
                i < this.totalSIs,
                state.textValue,
                state.dropdownValue,
                state.toggleValue
            );
            this.tableBody.appendChild(row.rowElement);
        }
    }

    clearTable() {
        while (this.tableBody.rows.length > 0) {
            this.tableBody.deleteRow(0);
        }
    }

    incrementSIs() {
        if (this.totalSIs < this.totalRows) {
            this.totalSIs++;
            this.updateSICountDisplay();
            this.renderTable();
        }
    }

    decrementSIs() {
        if (this.totalSIs > 0) {
            this.totalSIs--;
            this.updateSICountDisplay();
            this.renderTable();
        }
    }

    updateSIsFromInput() {
        const input = document.getElementById('numEnabled');
        const newValue = parseInt(input.value, 10);

        if (newValue >= 0 && newValue <= this.totalRows) {
            this.totalSIs = newValue;
            this.updateSICountDisplay();
            this.renderTable();
        } else {
            alert('Value must be between 0 and ' + this.totalRows);
        }
    }
}

// Initialize the table with 112 rows and 20 enabled rows
const siTable = new SITable(112, 20);
