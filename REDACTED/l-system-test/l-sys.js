546// Your WebGL initialization code here

// Define L-system rules and initial axiom
const rules = {
    'F': 'FF+[+F-F-F]-[-F+F+F]'
};
let axiom = 'F';

// Generate L-system string
function generateLSystemString(iterations) {
    for (let i = 0; i < iterations; i++) {
        axiom = axiom.replace(/./g, (symbol) => rules[symbol] || symbol);
    }
    return axiom;
}

// Interpret L-system string and draw
function interpretLSystem(lSystemString) {
    // Your interpretation and drawing code here
}

// Set up WebGL rendering context and call L-system functions
window.onload = function () {
    // Your WebGL setup code here

    const iterations = 2; // Adjust as needed
    const lSystemString = generateLSystemString(iterations);
    interpretLSystem(lSystemString);

    console.log(lSystemString);
    alert(lSystemString);
};
