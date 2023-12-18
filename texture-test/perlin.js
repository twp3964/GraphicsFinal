// Perlin noise functions
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(t, a, b) {
    return a + t * (b - a);
}

function grad(hash, x, y) {
    const h = hash & 15;
    const grad = 1 + (h & 7); // Gradient value 1-8
    const hGrad = h & 7; // Gradient index 0-7
    const u = hGrad < 4 ? x : y; // Alternate the gradient directions
    return (h & 8 ? -grad : grad) * u; // Randomly invert half of the gradients
}

function perlinNoise(x, y) {
    // Determine grid cell coordinates
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    // Relative x, y coordinates within the cell
    x -= Math.floor(x);
    y -= Math.floor(y);

    // Compute fade curves for x and y
    const u = fade(x);
    const v = fade(y);

    // Hash coordinates of the 4 cube corners
    const a = (perlinPerm[X] + Y) & 255;
    const b = (perlinPerm[X + 1] + Y) & 255;
    const c = (perlinPerm[X] + Y + 1) & 255;
    const d = (perlinPerm[X + 1] + Y + 1) & 255;

    // And add blended results from 4 corners of the cube
    return lerp(v, lerp(u, grad(perlinPerm[a], x, y), grad(perlinPerm[b], x - 1, y)),
                      lerp(u, grad(perlinPerm[c], x, y - 1), grad(perlinPerm[d], x - 1, y - 1)));
}

// Permutation table
const perlinPerm = [...Array(512)].map((_, i) => i);
for (let i = perlinPerm.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [perlinPerm[i], perlinPerm[j]] = [perlinPerm[j], perlinPerm[i]];
}
perlinPerm.push(...perlinPerm);

// Example usage
const noiseValue = perlinNoise(0.5, 0.5);
console.log(noiseValue);
