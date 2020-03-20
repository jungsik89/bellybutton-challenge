
//Metadata function to grab the data, drill down to metadata object.
//the key is the filter function
//
function buildMetaData(metaSample){
  d3.json('/data/samples.json').then(function (data){
  console.log(data);
  var metaData = data.metadata;
  console.log(metaData);
  var query = metaData.filter(selectObj => selectObj.id==metaSample)[0]
  console.log(query)
//drilled down data is then put into a forEach loop, grab the html element, and appened "p" element
// of the Object entries of both key and value which in this case is accessible since broken down.
//then variable display is given its text value of [key, value]
// note that this append function needs to be inside the loop
  metaData.forEach((metaObj) => {
    var selection = d3.select("#sample-metadata");
    var display = selection.append("p");
    selection.html("");
    Object.entries(metaObj).forEach(([key, value]) => {
    display.text([key,value]);
          });
      });  

  });
};

function buildCharts(sample) {
  d3.json('/data/samples.json').then(function (data){
    // console.log(data)
    //query sample.json data, filter the data by id and grab the first selection
    //drilled down samples -> id and its first selection then \n
    //drill down to sample values
    //drill down to otu_ids from variable results
    var samplesData = data.samples;
    var results=samplesData.filter(sampleObj => sampleObj.id==sample)[0]
    var sample_values=results.sample_values
    var otu_ids=results.otu_ids

    //build bubbly chart
    //slicing the first 10 results from the array
    //reverse the order
    //distinguish the color of the markers by otu ids, again same function
    //set the size by sample values
    var tracebubbly = {
      x: otu_ids.slice(0, 10).reverse(),
      y: sample_values.slice(0,10).reverse(),
      mode: 'markers',
      marker: {
        color: otu_ids.slice(0, 10).reverse(),
        opacity: [1, 0.8, 0.6, 0.4],
        size: sample_values.slice(0,10).reverse()
      }
    };
    
    //initialize data
    var databubbly = [tracebubbly];
    
    //initialize layout
    //added xaxis object
    var layoutbubbly = {
      title: 'Bellybutton Sample Bubble Plot',
      showlegend: false,
      height: 600,
      width: 1200,
      xaxis: {
        title: {
          text: 'OTU ID',
          font: {
            family: 'Courier New, monospace',
            size: 16,
            color: '#7f7f7f'
          }
        }
      }
    };
    
   
    //build horizontal bar chart
    //x and y value is again sliced and reversed
    //note that the orientation is horizontal bar graph
    var trace1 = {
      type: "bar",
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
      orientation: 'h'
      
    };
    //initialize data
    var data = [trace1];
    //set the layout of the bar chart
    //margin object included to resize according to div element.
    var layout = {
      title: "Top 10 Samples",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      }
    };
    //plot the results
    Plotly.newPlot("bar", data, layout);
    Plotly.newPlot('bubble', databubbly, layoutbubbly);

  });

};

//initialize webpage with default values so it is not blank.
//grab data and grab the first entry.
//use that as a argument in the functions 
//two functions is called below
//buildCharts() and buildMetaData()
function init(){

    d3.json('/data/samples.json').then(function (data){
      var first_entry=data.names[0]
      // console.log(first_entry)
      buildCharts(first_entry);
      buildMetaData(first_entry);
    });
  };
init();

// console.log(nameData);
