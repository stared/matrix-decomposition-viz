// let's run it!

// const M = [
//   [1, 2, -1],
//   [2, 4, -2],
//   [3, 6, -3],
//   [5, 10, -5]
// ];
// const dim = 1;
//

// const M = [
//   [NaN, 2, -1],
//   [2, 4, NaN],
//   [3, NaN, -3],
//   [5, 10, -5]
// ];
// const dim = 1;

// const M = [
//   [5, 4, 5, 2, 1, 1],
//   [4, 5, 5, 1, 1, 2],
//   [2, 2, 1, 4, 5, 5],
//   [1, 1, 1, 5, 4, 4],
//   [1, 2, 2, 2, 1, 1]
// ];
// const dim = 2;
// // dim 1 -> 0.278 RMSE, 2 -> 0.074 RMSE


// const M = [
//   [5, NaN, 5, 2, 1, 1],
//   [4, 5, 5, 1, NaN, 2],
//   [2, 2, NaN, 4, 5, 5],
//   [NaN, 1, 1, 5, 4, NaN],
//   [1, NaN, 2, 2, 1, 1]
// ];
// const dim = 2;
// // dim 1 -> 0.291, 2 -> <0.085 RMSE
//
// const triplets = matrixToTriples(M);
// const U = createRandomMatrix(M.length, dim);
// const V = createRandomMatrix(M[0].length, dim);
//
//
// for (let step = 0; step < 100; step++) {
//   // warning: it is super-easy to overshot learning rate
//   gradDescStep(triplets, U, V, 0.005);
//   if (step % 10 === 0) {
//     console.log(`loss (${step}): ${costRMSE(triplets, U, V)}`);
//   }
// }
//
// matPrint(U, "U");
// matPrint(V, "V");
// matPrint(reconstructMatrix(U, V), "M reconstructed");
// matPrint(M, "M ground truth");

// logistic example

const M = [
  [1.0, 0.5, 0.5, 0.0],
  [1.0, 0.9, 0.8, 0.4],
  [0.5, 0.2, 0.2, 0.0],
  [0.8, 1.0, 0.5, 0.1]
];
const dim = 2;
// log loss: dim=1 0.522, dim=2 0.407, dim=3 0.381 (ideal fit)

const triplets = matrixToTriples(M);
const U = createRandomMatrix(M.length, dim);
const V = createRandomMatrix(M[0].length, dim);


for (let step = 0; step < 100; step++) {
  // warning: it is super-easy to overshot learning rate
  gradDescStep(triplets, U, V, 0.05, logistic=true);
  if (step % 10 === 0) {
    console.log(`loss (${step}): ${costLogLoss(triplets, U, V)}`);
  }
}

matPrint(U, "U");
matPrint(V, "V");
matPrint(reconstructMatrix(U, V, sigmoid), "M reconstructed");
matPrint(M, "M ground truth");
