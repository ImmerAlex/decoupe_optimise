const inputBaseSize = document.getElementById('base-size');
const addSizeBtn = document.getElementById('add-size-btn');
const calcBtn = document.getElementById('calc-btn');
const deleteBtn = document.getElementById('delete-btn');
const container = document.getElementById('container');
const result = document.getElementById('result');


let baseSize = inputBaseSize.value;
let inputCount = 3;

const setBaseSize = (e) => {
    baseSize = e.target.value;
}

const handleAddSize = () => {
    inputCount++;
    const html = `
    <div class="container-input">
        <label for="size${inputCount}">Longueur</label>
        <input type="number" id="size${inputCount}" value="0" min="0">
        <p>x</p>
        <label for="mult${inputCount}">
            <input type="number" id="mult${inputCount}" value="1" min="1">
        </label>
    </div>
    `
    container.insertAdjacentHTML('beforeend', html);
}

const handleDeleteSize = () => {
    const containerInputs = container.querySelectorAll('.container-input');
    if (containerInputs.length > 0) {
        container.removeChild(containerInputs[containerInputs.length - 1]);
        inputCount--;
    }
}


const handleCalc = () => {
    const total = calc();

    let html = `
    <h1>Resultat</h1>
    <p id="totalBar">Nombre total: ${Object.keys(total).length}</p>
    ${Object.keys(total).map((key) => {
        return `
        <div>
            <h3>Barre ${key}</h3>
            <p>${total[key].join(' + ')}</p>
        </div>
        `
    }).join('')}
    `;
    result.insertAdjacentHTML('beforeend', html);
}


const getPiecesFromInputs = () => {
    const sizeInputs = container.querySelectorAll(`input[id^="size"]`);
    const multInputs = container.querySelectorAll(`input[id^="mult"]`);
    let pieces = [];

    for (let i = 0; i < sizeInputs.length; i++) {
        if (sizeInputs[i].value === '0') {
            continue;
        }
        const size = parseFloat(sizeInputs[i].value);
        const mult = parseInt(multInputs[i].value);
        for (let j = 0; j < mult; j++) {
            pieces.push(size);
        }
    }

    return pieces;
}


const breakOversizedParts = (pieces) => {
    let newPieces = [];

    pieces.forEach((piece) => {
        if (piece > baseSize) {
            let remainingSize = piece;

            // Add full rods for oversized parts
            while (remainingSize > baseSize) {
                newPieces.push(baseSize);
                remainingSize -= baseSize;
            }

            // Add the leftover piece smaller than the base rod
            if (remainingSize > 0) {
                newPieces.push(remainingSize);
            }
        } else {
            newPieces.push(piece);
        }
    });

    return newPieces;
}


const distributePiecesIntoRods = (pieces) => {
    let rods = {};
    let currentRod = 1;
    let remainingSpace = baseSize;

    rods[currentRod] = [];

    while (pieces.length > 0) {
        let foundFit = false;

        for (let i = 0; i < pieces.length; i++) {
            let piece = pieces[i];
            if (remainingSpace >= piece) {
                // Place the piece into the current rod
                rods[currentRod].push(piece);
                remainingSpace -= piece;
                pieces.splice(i, 1); // Remove the piece from the list
                foundFit = true;
                break; // Stop looking for another piece and restart
            }
        }

        // If no more pieces fit in the current rod, move to the next one
        if (!foundFit) {
            currentRod++;
            rods[currentRod] = [];
            remainingSpace = baseSize;
        }
    }

    return rods;
}


const calc = () => {

    if (baseSize === '0') {
        return;
    }

    let pieces = getPiecesFromInputs();

    if (pieces.length === 0) {
        return;
    }

    pieces = breakOversizedParts(pieces);
    return distributePiecesIntoRods(pieces);
}

inputBaseSize.addEventListener('input', setBaseSize);
addSizeBtn.addEventListener('click', handleAddSize);
deleteBtn.addEventListener('click', handleDeleteSize);
calcBtn.addEventListener('click', handleCalc);