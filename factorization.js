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

function matRegularizeInPlace(V, l1lr, l2lr, leaveColumns=0) {
  V.forEach((row, i) => row.forEach((value, j) => {
    if (j >= leaveColumns) {
      V[i][j] -= l2lr * value + l1lr * Math.sign(value);
    }
  }));
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

function reconstructMatrix(U, V, transform=false, mean=0) {
  const M = [];
  for (let i = 0; i < U.length; i++) {
    const row = [];
    for (let j = 0; j < V.length; j++) {
      if (transform) {
        row.push(transform(dot(U[i], V[j]) + mean));
      } else {
        row.push(dot(U[i], V[j]) + mean);
      }
    }
    M.push(row);
  }
  return M;
}

function covariance(U) {
  const M = [];
  const dim = U[0].length;
  const n = U.length;
  for (let i = 0; i < dim; i++) {
    const row = [];
    for (let j = 0; j < dim; j++) {
      let res = 0;
      for (let k = 0; k < n; k++) {
        res += U[k][i] * U[k][j];
      }
      row.push(res);
    }
    M.push(row);
  }
  return M;
}

function sigmoid(z) {
  return 1 / (1 + Math.exp(-z));
}

function gradDescStep(triplets, U, V, lr, logistic=false, l1=0, l2=0,
                      biasesRow=false, biasesCol=false, mean=0) {

  const dU = createZeroMatrix(U.length, U[0].length);
  const dV = createZeroMatrix(V.length, V[0].length);
  const n = triplets.length;

  triplets.forEach((triplet) => {
    const [i, j, value] = triplet;
    const a = logistic ?
      - lr * (sigmoid(dot(U[i], V[j])) + mean - value) / n :
      - lr * 2 * (dot(U[i], V[j]) + mean - value) / n;
    vecAddInPlace(dU[i], vecMul(V[j], a));
    vecAddInPlace(dV[j], vecMul(U[i], a));
  });

  // regularization
  // (here biases without regularization)
  matRegularizeInPlace(U, lr * l1, lr * l2, biasesRow + biasesCol);
  matRegularizeInPlace(V, lr * l1, lr * l2, biasesRow + biasesCol);

  // applying gradient
  matAddInPlace(U, dU);
  matAddInPlace(V, dV);

  // biases
  if (biasesCol) {
    U.forEach((row) => row[0] = 1);
  }
  if (biasesRow) {
    const ind = biasesCol | 0;
    V.forEach((row) => row[ind] = 1);
  }

}

function costRMSE(triplets, U, V) {
  let res = 0;
  triplets.forEach((triplet) => {
    const [i, j, value] = triplet;
    res += Math.pow(dot(U[i], V[j]) - value, 2);
  });
  return Math.sqrt(res) / triplets.length;
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

function meanT(triplets) {
  let res = 0;
  triplets.forEach((triplet) => {
    const [i, j, value] = triplet;
    res += value;
  });
  return res / triplets.length;
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
