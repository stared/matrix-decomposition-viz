
// (v * u - y)**2
// dv = 2 * (v * u - y) * u
// du = 2 * (v * u - y) * v

const M = [
  [1, 2, -1],
  [2, 4, -2],
  [3, 6. -3]
];

// M[i, j] = U[i] * V[j]

const dim = 1;
const lr = 0.1;
const steps = 100;

function createMatrix(n, m) {
  const M = [];
  for(let i = 0; i < n; i++) {
    M[i] = [];
    for(let j = 0; j < m; j++) {
      M[i][j] = 0;
    }
  }
  return M;
}

console.log("createMatrix(4,2)", createMatrix(4,2));

function dot(u, v) {
  let res = 0;
  if (u.length !== v.length) throw "different vector lengths";
  for(let i = 0; i < u.length; i++) {
    res += u[i] * v[i];
  }
  return res;
}

function matrixToTriples(M) {
  console.log("zzz");
  const triples = [];
  M.forEach((row, i) => row.forEach((value, j) => triples.push([i, j, value])));
  return triples;
}

console.log("matrixToTriples(M)", matrixToTriples(M));

const U = createMatrix(3, dim);
const V = createMatrix(3, dim);

const dU = createMatrix(3, dim);
const dV = createMatrix(3, dim);

console.log("dot([1, 3], [-2, 5]", dot([1, 3], [-2, 5]));
