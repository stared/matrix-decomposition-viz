const a = 60;

const svg = d3.select("body").append("svg")
  .attr("width", 800)
  .attr("height", 800);

const gMatrix = svg.append("g")
  .attr("transform", "translate(150, 150)");

function draw_matrix(g, triplets) {

  const color = d3.scaleLinear()
    .domain([0.5, 5.5])
    .range(["blue", "red"]);

  const cell = g.selectAll('.cell').data(triplets)

  const cellEnter = cell.enter().append('g')
    .attr("class", "cell")
    .attr("transform", (d) => `translate(${a * d[0]}, ${a * d[1]})`);

  cellEnter.append("rect")
    .attr("width", a)
    .attr("height", a)
    .attr("fill", (d) => color(d[2]));

  cellEnter.append("text")
    .attr("x", 0.8 * a)
    .attr("y", 0.6 * a)
    .attr("font-family", "Verdana")
    .attr("font-size", 22)
    .style("text-anchor", "end")
    .style("fill", "#fff")
    .text((d) => d[2].toFixed(1));

}


const M = [
  [5, NaN, 5, 2, 1, 1],
  [4, 5, 5, 1, NaN, 2],
  [2, 2, NaN, 4, 5, 5],
  [NaN, 1, 1, 5, 4, NaN],
  [1, NaN, 2, 2, 1, 1]
];
const dim = 2;


const triplets = matrixToTriples(M);
const U = createRandomMatrix(M.length, dim);
const V = createRandomMatrix(M[0].length, dim);

draw_matrix(gMatrix, triplets);

for (let step = 0; step < 100; step++) {
  // warning: it is super-easy to overshot learning rate
  gradDescStep(triplets, U, V, 0.005);
  if (step % 10 === 0) {
    console.log(`loss (${step}): ${costRMSE(triplets, U, V)}`);
  }
}

const triplets2 = matrixToTriples(reconstructMatrix(U, V));
