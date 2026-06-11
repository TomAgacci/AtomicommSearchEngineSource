// =========================================================
// ATOMICOMM ZERO CIRCLE QUANTITATIVE ENGINE (FINAL RENDITION)
// Core concepts:
//   - Zero Circle rule:        f(x) = -y
//   - HSN normalization:       high-sensitivity stability
//   - Quantitative kernel:     certainty scoring field
//   - Crawler loop:            iterative refinement
// =========================================================

// -----------------------------
// Vector utilities
// -----------------------------
function dot(a, b) {
    let s = 0;
    const n = Math.min(a.length, b.length);
    for (let i = 0; i < n; i++) s += a[i] * b[i];
    return s;
}

function normalizeVec(v) {
    const mag = Math.sqrt(dot(v, v)) || 1;
    return v.map(x => x / mag);
}

// -----------------------------
// Zero Circle + HSN layer
// -----------------------------

// Zero Circle inversion rule: f(x) = -y
function zeroCircleTransform(x, y) {
    return -y;
}

// High-Sensitivity Normalization (HSN)
function hsnNormalize(value) {
    return value / (1 + Math.abs(value));
}

// -----------------------------
// Atomicomm kernel
// -----------------------------
/**
 * atomicommKernel
 * Quantitative certainty score between query and document.
 *
 * @param {number[]} queryVec - normalized query vector
 * @param {number[]} docVec   - normalized document vector
 * @returns {number} score    - Atomicomm certainty score
 */
function atomicommKernel(queryVec, docVec) {
    let score = 0;
    const n = Math.min(queryVec.length, docVec.length);

    for (let i = 0; i < n; i++) {
        const x = queryVec[i];
        const y = docVec[i];

        // Zero Circle inversion field
        const inverted = zeroCircleTransform(x, y);

        // Local delta (derivative-like change)
        const delta = inverted - y;

        // HSN stabilization
        const normalized = hsnNormalize(delta);

        score += normalized;
    }

    return score;
}

// -----------------------------
// Atomicomm search engine core
// -----------------------------
/**
 * atomicommSearch
 * Runs a small crawler-like refinement loop over documents.
 *
 * @param {number[]} queryVec        - raw query vector
 * @param {number[][]} documents     - array of raw document vectors
 * @param {number} iterations        - refinement passes
 * @returns {{scores:number[], order:number[]}} result
 */
function atomicommSearch(queryVec, documents, iterations = 4) {
    const q = normalizeVec(queryVec);
    const docs = documents.map(normalizeVec);

    let scores = docs.map(() => 0);

    for (let step = 0; step < iterations; step++) {
        scores = docs.map(docVec => atomicommKernel(q, docVec));
    }

    // Rank documents by score (descending)
    const order = scores
        .map((s, i) => ({ s, i }))
        .sort((a, b) => b.s - a.s)
        .map(o => o.i);

    return { scores, order };
}

// -----------------------------
// Example usage
// -----------------------------
const query = [0.8, 0.2, -0.4];

const docs = [
    [0.7, 0.1, -0.5],  // doc 0
    [-0.2, 0.9, 0.3],  // doc 1
    [0.1, -0.4, 0.8]   // doc 2
];

const result = atomicommSearch(query, docs, 5);

console.log("Atomicomm Scores:", result.scores);
console.log("Ranked Order (best → worst):", result.order);
