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
  M.forEach((row, i) =>
    row.forEach((value, j) => {
      if (isFinite(value)) triples.push([i, j, value]);
    })
  );
  return triples;
}

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

// linear

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


function costRMSE(triplets, U, V) {
  let res = 0;
  triplets.forEach((triplet) => {
    const [i, j, value] = triplet;
    res += Math.pow(dot(U[i], V[j]) - value, 2);
  });
  return Math.sqrt(res) / triplets.length;
}

// logistic

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function gradDescStepLogistic(triplets, U, V, lr) {

  const dU = createZeroMatrix(U.length, U[0].length);
  const dV = createZeroMatrix(V.length, V[0].length);

  triplets.forEach((triplet) => {
    const [i, j, value] = triplet;
    const a = - lr * (sigmoid(dot(U[i], V[j])) - value);
    vecAddInPlace(dU[i], vecMul(V[j], a));
    vecAddInPlace(dV[j], vecMul(U[i], a));
  });

  matAddInPlace(U, dU);
  matAddInPlace(V, dV);
}


function costLogLoss(triplets, U, V) {
  let res = 0;
  triplets.forEach((triplet) => {
    const [i, j, value] = triplet;
    const z = dot(U[i], V[j]);
    res += - value * z + Math.log(1 + Math.exp(z));
  });
  return res / triplets.length;
}

function reconstructMatrixLogistic(U, V) {
  const M = [];
  for (let i = 0; i < U.length; i++) {
    const row = [];
    for (let j = 0; j < V.length; j++) {
      row.push(sigmoid(dot(U[i], V[j])));
    }
    M.push(row);
  }
  return M;
}


function matPrint(M, name="", prec=2, len=7) {
  if(name) {
    console.log(name);
  }
  const text = M
    .map((row) => row
      .map((value) => (Array(len + 1).join(" ") + value.toFixed(prec)).slice(-len))
      .join(" ")
    )
    .join("\n");
  console.log(text);
}
