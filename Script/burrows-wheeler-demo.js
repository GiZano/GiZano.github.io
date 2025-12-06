/**
 * Burrows-Wheeler Transform Demo
 * 
 * This script implements the Burrows-Wheeler Transform (BWT) algorithm,
 * which is used in data compression to make similar characters appear
 * consecutively, improving compression ratios.
 */

/**
 * Calculate all rotations of a string for BWT
 * @param {string} str - Input string
 * @returns {string[]} Array of all rotations
 */
function calculateRotations(str) {
    const rotations = [];
    let rotated = str;
    
    // Add all rotations to the array
    for (let i = 0; i < str.length; i++) {
        rotations.push(rotated);
        rotated = rotated.slice(1) + rotated[0];
    }
    
    return rotations;
}

/**
 * Encode a string using Burrows-Wheeler Transform
 * @param {string} input - The string to encode
 * @returns {string} The BWT-encoded string
 */
function bwtEncode(input) {
    // 1. Add terminator character if not present
    const terminator = '$';
    let str = input;
    if (!str.endsWith(terminator)) {
        str += terminator;
    }

    // 2. Calculate all rotations
    const rotations = calculateRotations(str);
    
    // 3. Sort rotations lexicographically
    const sortedRotations = [...rotations].sort();
    
    // 4. Extract the last character of each rotation to form BWT
    let bwt = '';
    for (const rotation of sortedRotations) {
        bwt += rotation.slice(-1);
    }
    
    return {
        encoded: bwt,
        rotations: rotations,
        sortedRotations: sortedRotations,
        input: input
    };
}

/**
 * Decode a BWT-encoded string
 * @param {string} bwt - The BWT-encoded string
 * @returns {string} The original string (without the terminator)
 */
function bwtDecode(bwt) {
    if (!bwt.includes('$')) {
        throw new Error('Invalid BWT string: missing terminator character ($)');
    }
    
    let table = Array(bwt.length).fill('');
    
    // Reconstruct the original string by repeatedly inserting the BWT string
    // at the beginning of each string in the table and sorting
    for (let i = 0; i < bwt.length; i++) {
        for (let j = 0; j < bwt.length; j++) {
            table[j] = bwt[j] + table[j];
        }
        table.sort();
    }
    
    // Find the string that ends with the terminator
    const result = table.find(s => s.endsWith('$'));
    return result ? result.slice(0, -1) : ''; // Remove the terminator
}

/**
 * Format a string for display in HTML (preserve spaces and newlines)
 * @param {string} str - The string to format
 * @returns {string} HTML-formatted string
 */
function formatForDisplay(str) {
    return str.replace(/ /g, '&nbsp;').replace(/\n/g, '<br>');
}

/**
 * Update the UI with the BWT encoding results
 * @param {string} input - The original input string
 * @param {Object} result - The BWT encoding result
 */
function updateUI(input, result) {
    // Display the encoded result
    document.getElementById('bwt-output').textContent = result.encoded;
    
    // Display the original input
    document.getElementById('original-input').textContent = input;
    
    // Display the rotations (for educational purposes)
    const rotationsList = document.getElementById('rotations-list');
    rotationsList.innerHTML = '';
    
    result.rotations.forEach((rotation, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `Rotation ${index + 1}: <code>${formatForDisplay(rotation)}</code>`;
        rotationsList.appendChild(li);
    });
    
    // Display sorted rotations
    const sortedList = document.getElementById('sorted-rotations');
    sortedList.innerHTML = '';
    
    result.sortedRotations.forEach((rotation, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.innerHTML = `Sorted ${index + 1}: <code>${formatForDisplay(rotation)}</code>`;
        sortedList.appendChild(li);
    });
    
    // Show the results section
    document.getElementById('results').classList.remove('d-none');
}

// Initialize the demo when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('bwt-form');
    const input = document.getElementById('bwt-input');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const inputStr = input.value.trim();
        if (!inputStr) {
            alert('Please enter a string to encode');
            return;
        }
        
        try {
            const result = bwtEncode(inputStr);
            updateUI(inputStr, result);
        } catch (error) {
            console.error('Error encoding string:', error);
            alert('An error occurred while encoding the string: ' + error.message);
        }
    });
    
    // Add example button functionality
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            input.value = this.dataset.example;
            form.dispatchEvent(new Event('submit'));
        });
    });
});