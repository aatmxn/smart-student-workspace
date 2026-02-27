const flashcardData = [
    { subject: "Physics", concept: "Kinetic Energy", formula: "K.E. = ½mv²" },
    { subject: "Physics", concept: "Newton's Second Law", formula: "F = ma" },
    { subject: "Mathematics", concept: "Quadratic Formula", formula: "x = [-b ± √(b² - 4ac)] / 2a" },
    { subject: "Mathematics", concept: "Area of a Circle", formula: "A = πr²" },
    { subject: "Chemistry", concept: "Ideal Gas Law", formula: "PV = nRT" },
    { subject: "Chemistry", concept: "pH Formula", formula: "pH = -log[H⁺]" },
    { subject: "Physics", concept: "Ohm's Law", formula: "V = IR" },
    { subject: "Mathematics", concept: "Pythagorean Theorem", formula: "a² + b² = c²" },
    { subject: "Physics", concept: "Work Done", formula: "W = Fd cos(θ)" },
    { subject: "Chemistry", concept: "Molarity", formula: "M = moles of solute / liters of solution" }
];

document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("formulaGrid");

    flashcardData.forEach(item => {
        const card = document.createElement("div");
        card.className = "formula-card";

        card.innerHTML = `
      <span class="formula-subject">${item.subject}</span>
      <div class="formula-concept">${item.concept}</div>
      <div class="formula-math">${item.formula}</div>
    `;

        grid.appendChild(card);
    });
});
