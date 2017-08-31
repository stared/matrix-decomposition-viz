// object-oriented version



class Widget {
  constructor(div) {
    this.div = div;
    this.controls = new Controls(div);
    this.controls.addRange("dim", "dimension", 0, 5, 1, 2);
    this.controls.addCheckbox("rowBiases", "row biases");
    this.controls.addCheckbox("colBiases", "column biases");
    this.controls.addRange("steps", "steps", 0, 500, 50, 200);

    this.svg = div.append("svg")
      .attr("width", 1200)
      .attr("height", 1200);

    this.originalMatrix = new MatrixTiles(this.svg);
    this.originalMatrix.g.attr("transform", "translate(120, 170)");

    this.reconstructedMatrix = new MatrixTiles(this.svg);
    this.reconstructedMatrix.g.attr("transform", "translate(530, 170)");

    this.rowVectors = new MatrixTiles(this.svg);
    this.reconstructedMatrix.g.attr("transform", "translate(120, 550)");

    this.rowVectors = new MatrixTiles(this.svg);
    this.reconstructedMatrix.g.attr("transform", "translate(530, 550)");
  }

  update() {

  }

}


class Controls {
  constructor(div) {
    this.div = div;
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
        .on("input", function() {
          that.params[name] = +this.value;
          that.onUpdate(that.params);
        });

    this.params[name] = value;
  }


}


class Numerics {
  constructor(g) {
    this.g = g;
  }

}

class MatrixTiles {
  constructor(g) {
    this.g = g;
  }

  drawTiles() {
    const color = d3.scaleLinear()
      .domain([0.5, 5.5])
      .range(["blue", "red"]);

    const cell = this.g.append('g')
      .selectAll('.cell').data(triplets)

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
  }

  drawRowLabels(rowLabels) {
    this.g.append('g')
      .selectAll('.label-row').data(rowLabels)
      .enter().append("text")
      .attr("class", "label-row")
      .attr("x", -a/4)
      .attr("y", (d, i) => (i + 0.7) * a)
      .attr("font-family", "Verdana")
      .attr("font-size", 16)
      .style("text-anchor", "end")
      .style("fill", "#000")
      .text((d) => d);
  }

  drawColumnLabels(columnLabels) {
    this.g.append('g')
      .selectAll('.label-column').data(columnLabels)
      .enter().append("text")
      .attr("class", "label-column")
      .attr("transform", (d, i) => `translate(${(i + 0.7) * a}, ${-a/4}) rotate(-90)`)
      .attr("font-family", "Verdana")
      .attr("font-size", 16)
      .style("text-anchor", "start")
      .style("fill", "#000")
      .text((d) => d);
  }

}
