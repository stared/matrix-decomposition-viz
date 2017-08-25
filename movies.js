const a = 60;

const svg = d3.select("body").append("svg")
  .attr("width", 1200)
  .attr("height", 800);

const gMatrix = svg.append("g")
  .attr("transform", "translate(120, 170)");

const gApprox = svg.append("g")
  .attr("transform", "translate(530, 170)");

function draw_matrix(g, triplets, rowLabels=[], columnLabels=[]) {

  const color = d3.scaleLinear()
    .domain([0.5, 5.5])
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
    .attr("font-size", 22)
    .style("text-anchor", "end")
    .style("fill", "#fff")
    .text((d) => d[2].toFixed(1));

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

const people = ["Gosia", "Damian", "Dorota", "Marta", "Paweł"];
const movies = ["Matrix", "Matrix: Reloaded", "Inception",
                "Twilight", "Hunger Games", "50 Shades of Grey"];
const M = [
  [5, NaN, 5, 2, 1, 1],
  [4, 3, 5, 1, NaN, 2],
  [3, 2, NaN, 4, 5, 5],
  [NaN, 1, 1, 5, 4, NaN],
  [1, NaN, 2, 2, 1, 1]
];

const triplets = matrixToTriples(M);
draw_matrix(gMatrix, triplets, rowLabels=people, columnLabels=movies);

d3.select("#dimValue").on("input", update);
d3.select("#stepsValue").on("input", update);
d3.select("#lrValue").on("input", update);

function update() {
  const dim = +d3.select("#dimValue").property("value");
  const steps = +d3.select("#stepsValue").property("value");
  const lr = +d3.select("#lrValue").property("value");

  const U = createRandomMatrix(M.length, dim);
  const V = createRandomMatrix(M[0].length, dim);
  gApprox.selectAll("*").remove();
  for (let step = 0; step < steps; step++) {
    // warning: it is super-easy to overshot learning rate
    gradDescStep(triplets, U, V, lr);
    if (step % 10 === 0) {
      console.log(`loss (${step}): ${costRMSE(triplets, U, V)}`);
    }
  }
  const triplets2 = matrixToTriples(reconstructMatrix(U, V));
  draw_matrix(gApprox, triplets2, rowLabels=[], columnLabels=movies);
}
