class Widget {
  constructor(div, matrix, rowLabels=[], colLabels=[], a=25, params={}) {
    this.div = div;

    this.M = matrix;
    this.triplets = matrixToTriples(this.M);
    this.rowLabels = rowLabels;
    this.colLabels = colLabels;

    this.min = d3.min(this.triplets, (d) => d[2]);
    this.max = d3.max(this.triplets, (d) => d[2]);
    if (this.min === this.max && this.max === 1) {
      this.min = 0;
    }
    this.vectorScale = Math.sqrt(this.max - this.min);
    this.precision = Math.max(0, 1 - Math.floor(Math.log10(this.max)));

    this.controls = new Controls(div);
    this.controls.addRange("dim", "dimension", 0, 5, 1, 2);
    this.controls.addCheckbox("biasesRow", "row biases");
    this.controls.addCheckbox("biasesCol", "column biases");
    this.controls.addRange("steps", "steps", 0, 3000, 50, 2000);
    this.controls.addRange("lr", "learning rate", 0.01, 1, 0.01, 0.5);
    this.controls.addRange("l1", "l1 regularization", 0.00, 1, 0.01, 0.0);
    this.controls.addRange("l2", "l2 regularization", 0.00, 1, 0.01, 0.0);
    this.controls.addRange("l2DimStep", "l2 dim step", 0.00, 0.1, 0.001, 0.0);
    this.controls.addCheckbox("logistic", "logistic");
    this.controls.onUpdate = (params) => this.update(params);


    this.svg = div.append("svg")
      .attr("width", 1600)
      .attr("height", 1200);

    this.height = a * d3.max(this.triplets, (d) => d[0] + 1);
    this.width = a * d3.max(this.triplets, (d) => d[1] + 1);
    this.topMargin = 70;
    this.leftMargin = 370;
    const height = this.height;
    const width = this.width;
    const topMargin = this.topMargin;
    const leftMargin = this.leftMargin;

    this.originalMatrix = new MatrixTiles(this.svg, a);
    this.originalMatrix.g.attr("transform", `translate(${leftMargin},${topMargin})`);
    this.originalMatrix.setLabel("original data");

    this.reconstructedMatrix = new MatrixTiles(this.svg, a);
    this.reconstructedMatrix.g.attr("transform", `translate(${leftMargin + width + a},${topMargin})`);
    this.reconstructedMatrix.setLabel("A \u00D7 B + c");

    this.rowVectors = new MatrixTiles(this.svg, a);
    this.rowVectors.g.attr("transform", `translate(${leftMargin + 2 * width + 2 * a}, ${topMargin})`);
    this.rowVectors.setLabel("Factor A");

    this.colVectors = new MatrixTiles(this.svg, a);
    this.colVectors.g.attr("transform", `translate(${leftMargin + width + a},${topMargin + height + a})`);
    this.colVectors.setLabel("Factor B");

    this.originalMatrix.drawTiles(this.triplets, this.precision, this.min, this.max);
    this.originalMatrix.drawRowLabels(this.rowLabels);
    this.originalMatrix.drawColLabels(this.colLabels);

    this.differenceMatrix = new MatrixTiles(this.svg, a);
    this.differenceMatrix.g.attr("transform", `translate(${leftMargin + 2 * width + 3 * a},${topMargin})`);
    this.differenceMatrix.setLabel("Difference");

    this.update(this.controls.params);
  }

  update(params) {
    console.log(params);

    const {dim, biasesRow, biasesCol, steps, lr, l1, l2, logistic, l2DimStep} = params;

    const M = this.M;
    const triplets = this.triplets;
    const totalDim = dim + biasesRow + biasesCol;
    const U = createRandomMatrix(M.length, totalDim);
    const V = createRandomMatrix(M[0].length, totalDim);
    const mu = logistic ? 0 : meanT(triplets);
    const costFunction = logistic ? costLogLoss : costRMSE;

    console.log(totalDim)

    for (let step = 0; step < steps; step++) {
      // warning: it is super-easy to overshot learning rate
      gradDescStep(triplets, U, V, lr, logistic, l1, l2, biasesRow, biasesCol, mu, l2DimStep);
      if (step % Math.floor(steps/10) === 0) {
        console.log(`loss (${step}): ${costFunction(triplets, U, V, mu)}`);
      }
    }

    matPrint(covariance(U), "rows covariance");
    matPrint(covariance(V), "columns covariance");

    const reconstructedM = reconstructMatrix(U, V, logistic && sigmoid, mu);
    const reconstructedTriplets = matrixToTriples(reconstructedM);
    this.reconstructedMatrix.drawTiles(reconstructedTriplets, this.precision, this.min, this.max);

    this.rowVectors.drawTiles(matrixToTriples(U), 1, -this.vectorScale, this.vectorScale);

    this.colVectors.drawTiles(matrixToTriples(V).map((d) => [d[1], d[0], d[2]]), 1, -this.vectorScale, this.vectorScale);
    this.colVectors.drawColLabels(this.colLabels);
    this.reconstructedMatrix.setLabel(`A x B + c;     loss = ${costFunction(triplets, U, V, mu).toFixed(3)}`);

    const diffM = matSubtract(reconstructedM, M);
    this.differenceMatrix.drawTiles(matrixToTriples(diffM), this.precision, (this.min - this.max) / 2, (this.max - this.min) / 2);
    const height = this.height;
    const width = this.width;
    const topMargin = this.topMargin;
    const leftMargin = this.leftMargin;
    const a = this.differenceMatrix.a;
    this.differenceMatrix.g.attr("transform", `translate(${leftMargin + 2 * width + (3 + totalDim) * a},${topMargin})`);
  }

}


class Controls {
  constructor(rootDiv) {
    this.div = rootDiv.append("div")
      .style("position", "fixed");
    this.params = {};
    this.onUpdate = function(params) { console.log(params); };
  };

  addCheckbox(name, desc) {
    const that = this;
    this.div.append("p").append("label")
      .style("display", "inline-block")
      .style("width", "240px")
      .style("text-align", "right")
      .text(`${desc} = `)
      .append("input")
        .attr("type", "checkbox")
        .attr("class", name)
        .on("input", function() {
          that.params[name] = this.checked;
          that.onUpdate(that.params);
        });

    this.params[name] = false;
  }

  addRange(name, desc, min=0, max=1, step=1, value=1) {
    const that = this;
    this.div.append("p").append("label")
      .style("display", "inline-block")
      .style("width", "240px")
      .style("text-align", "right")
      .text(`${desc} = `)
      .append("input")
        .attr("type", "number")
        .attr("min", min)
        .attr("max", max)
        .attr("step", step)
        .attr("value", value)
        .attr("class", name)
        .style("width", "4em")
        .on("input", function() {
          that.params[name] = +this.value;
          that.onUpdate(that.params);
        });

    this.params[name] = value;
  }


}


class MatrixTiles {
  constructor(rootG, a=50) {
    this.g = rootG.append("g");
    this.a = a;
    this.label = this.g.append("text")
      .attr("class", "label")
      .attr("x", a/4)
      .attr("y", -a/4)
      .attr("font-family", "Verdana")
      .attr("font-size", 0.36 * a)
      .style("text-anchor", "begin")
      .style("fill", "#000");

    this.gCell = this.g.append('g');
    this.gRowLabels = this.g.append('g');
    this.gColLabels = this.g.append('g');
  }

  drawTiles(triplets, precision=1, scaleMin=0, scaleMax=1) {
    const a = this.a;
    const height = a * d3.max(triplets, (d) => d[0] + 1);
    this.gColLabels.attr('transform', `translate(0,${height})`);

    const color = d3.scaleLinear()
      .domain([scaleMin, scaleMax])
      .range(["blue", "red"]);

    const cell = this.gCell
      .selectAll('.cell').data(triplets, (d) => `${d[0]} ${d[1]}`);

    // enter

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
      .attr("font-size", 0.36 * a)
      .style("text-anchor", "end")
      .style("fill", "#fff")
      .text((d) => d[2].toFixed(precision));

    // update

    cell.select('rect')
      .attr("fill", (d) => color(d[2]));

    cell.select('text')
      .text((d) => d[2].toFixed(precision));

    // exit

    cell.exit().remove();
  }

  drawRowLabels(rowLabels) {
    const a = this.a;
    const label = this.gRowLabels
      .selectAll('.label-row').data(rowLabels);

    label.enter().append("text")
      .attr("class", "label-row")
      .attr("x", -a/4)
      .attr("y", (d, i) => (i + 0.7) * a)
      .attr("font-family", "Verdana")
      .attr("font-size", 0.36 * a)
      .style("text-anchor", "end")
      .style("fill", "#000")
      .text((d) => d);

    label.exit().remove();
  }

  drawColLabels(colLabels) {
    const a = this.a;
    const label = this.gColLabels
      .selectAll('.label-column').data(colLabels);

    label.enter().append("text")
      .attr("class", "label-column")
      .attr("transform", (d, i) => `translate(${(i + 0.5) * a}, ${a/4}) rotate(90)`)
      .attr("font-family", "Verdana")
      .attr("font-size", 0.36 * a)
      .style("text-anchor", "start")
      .style("fill", "#000")
      .text((d) => d);

    label.exit().remove();
  }

  setLabel(text) {
    this.label.text(text);
  }

}
