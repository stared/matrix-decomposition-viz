const examples = [
  {
    name: "Weather",
    cols: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ],
    rows: [
      "Toronto",
      "Warsaw",
      "Boston",
      "London",
      "San Francisco",
      "Jerusalem",
      "Mexico",
      "Cape Town",
      "Sydney"
    ],
    M: [
      [-5.8, -3.1, 4.5, 6.7, 14.3, 18.2, 20.1, 20.6, 15.9, 11.2, 3.6, -7.2],
      [-2.9, 3.6, 4.2, 9.7, 16.1, 19.5, 20.0, 18.8, 16.4, 7.6, 3.2, 1.3],
      [0.3, 1.5, 5.9, 8.4, 14.8, 20.2, 24.5, 24.7, 19.7, 13.0, 7.9, 1.9],
      [2.3, 6.5, 8.7, 9.2, 12.3, 15.4, 17.3, 20.0, 14.8, 10.8, 8.7, 6.4],
      [11.5, 13.9, 14.3, 15.7, 16.3, 17.4, 17.2, 17.7, 18.2, 17.4, 14.6, 10.4],
      [9.7, 10.3, 12.7, 15.5, 21.2, 22.1, 24.1, 25.3, 23.5, 20.1, 15.7, 11.8],
      [14.0, 15.6, 17.5, 20.3, 20.6, 18.1, 17.6, 18.2, 17.8, 16.8, 14.9, 16.0],
      [23.1, 23.3, 21.4, 19.0, 17.1, 15.5, 15.4, 15.6, 15.4, 18.6, 20.9, 21.3],
      [23.8, 24.6, 23.4, 20.8, 18.1, 15.1, 14.4, 14.5, 17.3, 19.0, 21.8, 24.3]
    ]
  },
  {
    name: "Movies",
    cols: [
      "Matrix",
      "Matrix: Reloaded",
      "Inception",
      "Twilight",
      "Hunger Games",
      "50 Shades of Grey"
    ],
    rows: ["Gosia", "Damian", "Dorota", "Marta", "Paweł"],
    M: [
      [5, NaN, 5, 2, 1, 1],
      [4, 3, 5, 1, NaN, 2],
      [3, 2, NaN, 4, 5, 5],
      [NaN, 1, 1, 5, 4, NaN],
      [1, NaN, 2, 2, 1, 1]
    ]
  },
  {
    name: "Exam",
    // logistic: true,  // something for default options
    cols: ["Q1", "Q2", "Q3", "Q4", "Q5", "Q6"],
    rows: ["Sophie", "Mark", "Adrian", "Jason", "Leah"],
    M: [
      [1, 0, 1, 0, 0, 0],
      [1, 1, 0, 1, 0, 0],
      [1, 1, 1, 1, 0, 0],
      [1, 1, 1, 0, 1, 0],
      [1, 1, 1, 1, 1, 1]
    ]
  },
  {
    name: "Restaurants",
    cols: ["Starbucks", "Costa", "Pizza Hut", "McDonalds", "Pizza Italiana", "Bobby Burger"],
    rows: ["Wiola", "Andrzej", "Kamil", "Asia", "Staszek", "Maria", "Ola", "Janek"],
    M: [
       [ 3.,  3.,  3.,  2.,  2.,  2.],
       [ 3.,  3.,  3.,  2.,  3.,  1.],
       [ 4.,  3.,  4.,  4.,  1.,  1.],
       [ 3.,  3.,  4.,  1.,  3.,  0.],
       [ 4.,  3.,  5.,  3.,  2.,  1.],
       [ 4.,  4.,  3.,  3.,  2.,  2.],
       [ 3.,  3.,  5.,  3.,  1.,  1.],
       [ 4.,  3.,  5.,  1.,  3.,  0.]
    ]
  },
  {
    name: "Restaurants Pred",
    cols: ["Starbucks", "Costa", "Pizza Hut", "McDonalds", "Pizza Italiana", "Bobby Burger"],
    rows: ["Wiola", "Andrzej", "Kamil", "Asia", "Staszek", "Maria", "Ola", "Janek"],
    M: [
       [ 3.,  NaN,  3.,  NaN,  2.,  2.],
       [ 3.,  3.,  NaN,  2.,  NaN,  1.],
       [ NaN,  3.,  4.,  4.,  1.,  1.],
       [ NaN,  3.,  4.,  NaN,  3.,  0.],
       [ 4.,  3.,  5.,  3.,  2.,  NaN],
       [ 4.,  NaN,  3.,  NaN,  2.,  2.],
       [ 3.,  3.,  5.,  3.,  NaN,  1.],
       [ 4.,  3.,  NaN,  1.,  NaN,  0.]
    ]
  },
  {
    name: "Likes",
    cols: ["StarCraft 2", "Half-Life", "Bioshock", "Witcher 3", "Dear Esther", "Life is Strange", "Minecraft"],
    rows: ["frog111", "stared", "mark92", "xxxrogue", "aaandy", "h4llf1ire"],
    M: [
      [NaN,   1,   1, NaN,   1, NaN, NaN],
      [  1,   1, NaN,   1, NaN, NaN, NaN],
      [NaN, NaN, NaN, NaN,   1,   1,   1],
      [  1, NaN,   1,   1, NaN, NaN, NaN],
      [NaN, NaN, NaN, NaN,   1, NaN,   1],
      [NaN,   1,   1, NaN,   1, NaN, NaN]
    ]
  },
  {
    name: "Logistic Test",
    cols: [],
    rows: [],
    M: [
      [1.0, 0.5, 0.5, 0.0],
      [1.0, 0.9, 0.8, 0.4],
      [0.5, 0.2, 0.2, 0.0],
      [0.8, 1.0, 0.5, 0.1]
    ]
  }
];

const body = d3.select('body');

const select = body.append('select').on('change', onSelection);
const div = body.append('div');

select.selectAll('option').data(examples)
  .enter()
  .append('option')
    .text((d) => d.name);

function onSelection() {
  const selected = select.property('value');
  const example = examples.filter((d) => d.name === selected)[0];
  div.selectAll("*").remove();
  new Widget(div, example.M, rowLabels=example.rows, colLabels=example.cols);
}

onSelection();
