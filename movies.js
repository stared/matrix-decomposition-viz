const a = 30;  // normally 60

const svg = d3.select("body").append("svg")
  .attr("width", 1200)
  .attr("height", 1200);

const gMatrix = svg.append("g")
  .attr("transform", "translate(120, 170)");

const gApprox = svg.append("g")
  .attr("transform", "translate(530, 170)");

const gUsers = svg.append("g")
  .attr("transform", "translate(120, 550)");

const gMovies = svg.append("g")
  .attr("transform", "translate(530, 550)");

function draw_matrix(g, triplets, rowLabels=[], columnLabels=[]) {

  const color = d3.scaleLinear()
    .domain([-8, 25])
    .range(["blue", "red"]);

  const cell = g.selectAll('.cell').data(triplets)

  const cellEnter = cell.enter().append('g')
    .attr("class", "cell")
    .attr("transform", (d) => `translate(${a * d[1]}, ${a * d[0]})`);

  cellEnter.append("rect")
    .attr("width", a)
    .attr("height", a)
    .attr("fill", (d) => color(d[2]));

  cellEnter.append("text")
    .attr("x", 0.8 * a)
    .attr("y", 0.6 * a)
    .attr("font-family", "Verdana")
    .attr("font-size", 11)  // normally 22
    .style("text-anchor", "end")
    .style("fill", "#fff")
    .text((d) => d[2].toFixed(0));  // normally 1

  g.selectAll('.label-row').data(rowLabels)
    .enter().append("text")
    .attr("class", "label-row")
    .attr("x", -a/4)
    .attr("y", (d, i) => (i + 0.7) * a)
    .attr("font-family", "Verdana")
    .attr("font-size", 16)
    .style("text-anchor", "end")
    .style("fill", "#000")
    .text((d) => d);

  g.selectAll('.label-column').data(columnLabels)
    .enter().append("text")
    .attr("class", "label-column")
    .attr("transform", (d, i) => `translate(${(i + 0.7) * a}, ${-a/4}) rotate(-90)`)
    .attr("font-family", "Verdana")
    .attr("font-size", 16)
    .style("text-anchor", "start")
    .style("fill", "#000")
    .text((d) => d);


}

// const users = ["Gosia", "Damian", "Dorota", "Marta", "Paweł"];
// const movies = ["Matrix", "Matrix: Reloaded", "Inception",
//                 "Twilight", "Hunger Games", "50 Shades of Grey"];
// const M = [
//   [5, NaN, 5, 2, 1, 1],
//   [4, 3, 5, 1, NaN, 2],
//   [3, 2, NaN, 4, 5, 5],
//   [NaN, 1, 1, 5, 4, NaN],
//   [1, NaN, 2, 2, 1, 1]
// ];

const movies = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
const users = ["san francisco","london","cape town","sydney","warsaw","jerusalem","mexico","toronto"];

const M = [
  [11.5,13.9,14.3,15.7,16.3,17.4,17.2,17.7,18.2,17.4,14.6,10.4],
  [2.3,6.5,8.7,9.2,12.3,15.4,17.3,20.0,14.8,10.8,8.7,6.4],
  [23.1,23.3,21.4,19.0,17.1,15.5,15.4,15.6,15.4,18.6,20.9,21.3],
  [23.8,24.6,23.4,20.8,18.1,15.1,14.4,14.5,17.3,19.0,21.8,24.3],
  [-2.9,3.6,4.2,9.7,16.1,19.5,20.0,18.8,16.4,7.6,3.2,1.3],
  [9.7,10.3,12.7,15.5,21.2,22.1,24.1,25.3,23.5,20.1,15.7,11.8],
  [14.0,15.6,17.5,20.3,20.6,18.1,17.6,18.2,17.8,16.8,14.9,16.0],
  [-5.8,-3.1,4.5,6.7,14.3,18.2,20.1,20.6,15.9,11.2,3.6,-7.2]
];

const triplets = matrixToTriples(M);
draw_matrix(gMatrix, triplets, rowLabels=users, columnLabels=movies);

d3.select("#dimValue").on("input", update);
d3.select("#biasesValue").on("input", update);
d3.select("#stepsValue").on("input", update);
d3.select("#lrValue").on("input", update);
d3.select("#l1Value").on("input", update);
d3.select("#l2Value").on("input", update);

function update() {
  const dim = +d3.select("#dimValue").property("value");
  const biases = d3.select("#biasesValue").property("checked");
  const steps = +d3.select("#stepsValue").property("value");
  const lr = +d3.select("#lrValue").property("value");
  const l1 = +d3.select("#l1Value").property("value");
  const l2 = +d3.select("#l2Value").property("value");

  const U = createRandomMatrix(M.length, dim + 2 * biases);
  const V = createRandomMatrix(M[0].length, dim + 2 * biases);
  gApprox.selectAll("*").remove();
  gUsers.selectAll("*").remove();
  gMovies.selectAll("*").remove();
  for (let step = 0; step < steps; step++) {
    // warning: it is super-easy to overshot learning rate
    gradDescStep(triplets, U, V, lr, logistic=false, l1, l2, biases);
    if (step % 10 === 0) {
      console.log(`loss (${step}): ${costRMSE(triplets, U, V)}`);
    }
  }
  const triplets2 = matrixToTriples(reconstructMatrix(U, V));
  draw_matrix(gApprox, triplets2, rowLabels=[], columnLabels=movies);
  draw_matrix(gUsers, matrixToTriples(U), rowLabels=users, columnLabels=[]);
  draw_matrix(gMovies, matrixToTriples(V), rowLabels=movies, columnLabels=[]);

  matPrint(covariance(U), "users covariance");
  matPrint(covariance(V), "movies covariance");
}
