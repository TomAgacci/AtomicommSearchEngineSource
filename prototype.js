// ---------------------------------------------------------
// ATOMICOMM ZERO CIRCLE QUANTITATIVE ENGINE (JS PROTOTYPE)
// ---------------------------------------------------------

// Zero Circle inversion rule: f(x) = -y
function zeroCircleTransform(x, y) {
    return -y;
}

// HSN Quantitative Normalization
function hsnNormalize(value) {
    // High‑Sensitivity Normalization
    return value / (1 + Math.abs(value));
}

// Atomicomm scoring kernel
function atomicommKernel(queryVec, docVec) {
    let score = 0;

    for (let i = 0; i < queryVec.length; i++) {
        const x = queryVec[i];
        const y = docVec[i] || 0;

        // Zero Circle inversion
        const inverted = zeroCircleTransform(x, y);

        // Derivative-like delta
        const delta = inverted - y;

        // HSN normalization
        const normalized = hsnNormalize(delta);

        score += normalized;
    }

    return score;
}

// Simple crawler-like iterative refinement
function atomicommSearch(queryVec, documents, iterations = 4) {
    let scores = documents.map(() => 0);

    for (let step = 0; step < iterations; step++) {
        scores = documents.map(docVec => atomicommKernel(queryVec, docVec));
    }

    return scores;
}

// ---------------------------------------------------------
// Example Usage
// ---------------------------------------------------------

const query = [0.8, 0.2, -0.4];

const docs = [
    [0.7, 0.1, -0.5],
    [-0.2, 0.9, 0.3],
    [0.1, -0.4, 0.8]
];

const results = atomicommSearch(query, docs);

console.log("Atomicomm Scores:", results);
