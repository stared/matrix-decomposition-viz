
// (v * u - y)**2
// dv = 2 * (v * u - y) * u
// du = 2 * (v * u - y) * v

const M = [
  [1, 2, -1],
  [2, 4, -2],
  [3, 6, -3],
  [5, 10, -5]
];

// M[i, j] = U[i] * V[j]

function createZeroMatrix(n, m) {
  const M = [];
  for(let i = 0; i < n; i++) {
    M[i] = [];
    for(let j = 0; j < m; j++) {
      M[i][j] = 0;
    }
  }
  return M;
}

function createRandomMatrix(n, m) {
  const M = [];
  for(let i = 0; i < n; i++) {
    M[i] = [];
    for(let j = 0; j < m; j++) {
      M[i][j] = Math.random() - 0.5;
    }
  }
  return M;
}

// console.log("createZeroMatrix(4,2)", createZeroMatrix(4,2));

function dot(u, v) {
  let res = 0;
  if (u.length !== v.length) throw "different vector lengths";
  for(let i = 0; i < u.length; i++) {
    res += u[i] * v[i];
  }
  return res;
}

function vecMul(v, a) {
  return v.map((value) => a * value);
}

function vecAddInPlace(v, u) {
  u.forEach((value, i) => v[i] += value);
}

function matAddInPlace(V, U) {
  U.forEach((row, i) => row.forEach((value, j) => V[i][j] += value));
}

function matrixToTriples(M) {
  const triples = [];
  M.forEach((row, i) => row.forEach((value, j) => triples.push([i, j, value])));
  return triples;
}

const triplets = matrixToTriples(M);
// console.log("matrixToTriples(M)", matrixToTriples(M));

function reconstructMatrix(U, V) {
  const M = [];
  for (let i = 0; i < U.length; i++) {
    const row = [];
    for (let j = 0; j < V.length; j++) {
      row.push(dot(U[i], V[j]));
    }
    M.push(row);
  }
  return M;
}

const dim = 1;
const U = createRandomMatrix(M.length, dim);
const V = createRandomMatrix(M[0].length, dim);

// console.log("dot([1, 3], [-2, 5]", dot([1, 3], [-2, 5]));


function gradDescStep(triplets, U, V, lr) {

  const dU = createZeroMatrix(U.length, U[0].length);
  const dV = createZeroMatrix(V.length, V[0].length);

  triplets.forEach((triplet) => {
    const [i, j, value] = triplet;
    const a = - lr * 2 * (dot(U[i], V[j]) - value);
    vecAddInPlace(dU[i], vecMul(V[j], a));
    vecAddInPlace(dV[j], vecMul(U[i], a));
  });

  matAddInPlace(U, dU);
  matAddInPlace(V, dV);
}


function cost(triplets, U, V) {
  let res = 0;
  triplets.forEach((triplet) => {
    const [i, j, value] = triplet;
    res += Math.pow(dot(U[i], V[j]) - value, 2);
  });
  return res;
}


for (let step = 0; step < 100; step++) {
  // warning: it is super-easy to overshot learnin rate
  gradDescStep(triplets, U, V, 0.005);
  if (step % 10 === 0) {
    console.log(`loss (${step}): ${cost(triplets, U, V)}`);
  }
}

function matPrint(M, name="") {
  if(name) {
    console.log(name);
  }
  console.log(M.map((row) =>  row.map((value) => value.toFixed(2)).join("  ")).join("\n"));
}

matPrint(U, "U");
matPrint(V, "V");
matPrint(reconstructMatrix(U, V), "M reconstructed");
matPrint(M, "M ground truth");
