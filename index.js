import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


const width = 900,
  height = 500,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 30,
  marginLeft = 40;


let numBars = 50;
let speed = 100; 

// Create control bar
const controlBar = d3.select("body").append("div").attr("class", "control-bar");


controlBar.append("label").text("Speed: ");
const speedSelect = controlBar.append("select").on("change", function () {
  speed = +this.value;
});

speedSelect
  .selectAll("option")
  .data([
    { text: "Fast (10ms)", value: 10 },
    { text: "Medium (100ms)", value: 100 },
    { text: "Slow (500ms)", value: 500 },
  ])
  .enter()
  .append("option")
  .text((d) => d.text)
  .attr("value", (d) => d.value);


  
controlBar.append("label").text("Number of Bars: ");
const barInput = controlBar
  .append("input")
  .attr("type", "number")
  .attr("min", "10")
  .attr("max", "100")
  .attr("value", numBars)
  .on("change", function () {
    numBars = +this.value;
    generateData();
  });

  
let data;
function generateData() {
  data = Array.from(
    { length: numBars },
    () => Math.floor(Math.random() * 100) + 1
  );
  renderBars();
}



const x = d3
  .scaleBand()
  .range([marginLeft, width - marginRight])
  .padding(0.1);
const y = d3.scaleLinear().range([height - marginBottom, marginTop]);


const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);


const xAxis = svg
  .append("g")
  .attr("transform", `translate(0,${height - marginBottom})`);

// Append yaxis
const yAxis = svg.append("g").attr("transform", `translate(${marginLeft},0)`);


const barsGroup = svg.append("g");

function renderBars() {
  x.domain(d3.range(data.length));
  y.domain([0, d3.max(data)]);

  xAxis.call(
    d3
      .axisBottom(x)
      .tickFormat(() => "")
      .tickSizeOuter(0)
  );
  yAxis.call(d3.axisLeft(y));

  const bars = barsGroup.selectAll("rect").data(data);

  bars
    .enter()
    .append("rect")
    .merge(bars)
    .attr("x", (_, i) => x(i))
    .attr("y", (d) => y(d))
    .attr("width", x.bandwidth())
    .attr("height", (d) => height - marginBottom - y(d))
    .attr("fill", "rgba(255, 99, 132, 0.8)");

  bars.exit().remove();
}


function updateGraph(activeIndex, minIndex) {
  barsGroup
    .selectAll("rect")
    .data(data)
    .attr("y", (d) => y(d))
    .attr("height", (d) => height - marginBottom - y(d))
    .attr("fill", (_, i) =>
      i === activeIndex || i === minIndex
        ? "#ffc107"
        : "rgba(255, 99, 132, 0.8)"
    );
}

// Selection Sort
async function selectionSort() {
  let n = data.length;
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < n; j++) {
      if (data[j] < data[minIndex]) {
        minIndex = j;
      }
    }

    if (minIndex !== i) {
      [data[i], data[minIndex]] = [data[minIndex], data[i]];
      updateGraph(i, minIndex);
      await new Promise((resolve) => setTimeout(resolve, speed));
    }
  }
}

// Bubble Sort
async function bubbleSort() {
  let n = data.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (data[j] > data[j + 1]) {
        [data[j], data[j + 1]] = [data[j + 1], data[j]];
        updateGraph(j, j + 1);
        await new Promise((resolve) => setTimeout(resolve, speed));
      }
    }
  }
}

// Buttons for Sorting
const btnContainer = d3
  .select("body")
  .append("div")
  .attr("class", "button-container");
btnContainer.append("button").text("Generate Data").on("click", generateData);
btnContainer.append("button").text("Selection Sort").on("click", selectionSort);
btnContainer.append("button").text("Bubble Sort").on("click", bubbleSort);

// Generate initial dataset
generateData();
