// sidebar appear in certain area
var sidebar = document.querySelector('.article-sidebar')
var banner = document.querySelector('.content-nav')
var bannerTop = banner.offsetTop+500
document.addEventListener('scroll', function(){
// console.log(window.pageYOffset);
if (window.pageYOffset >= bannerTop){
    sidebar.style.display = 'block';
}else {
    sidebar.style.display = 'none';
}
})
// create var from html
var myDiv1 = document.getElementById('myDiv1');
var myDiv2 = document.getElementById('myDiv2');
var myDiv3 = document.getElementById('myDiv3');


//map
Plotly.d3.csv('/mortality.csv', function(err, rows){
      function unpack(rows, key) {
          return rows.map(function(row) { return row[key]; });
      }
    // console.log(unpack(rows, 'mortality'))
    // unpack data and load data into array
    var data = [{
        type: 'choropleth',
        locationmode: 'country names',
        locations: unpack(rows, 'country'),
        z: unpack(rows, 'mortality'),
        text: unpack(rows, 'country'),
    // color set
        colorscale: [
            [0,'rgb(5, 10, 172)'],[0.35,'rgb(40, 60, 190)'],
            [0.5,'rgb(70, 100, 245)'], [0.6,'rgb(90, 120, 245)'],
            [0.7,'rgb(106, 137, 247)'],[1,'rgb(220, 220, 220)']],
            autocolorscale: false,
            reversescale: true,
            marker: {
                line: {
                    color: 'rgb(180,180,180)',
                    width: 0.5
                }
            },
            tick0: 0,
            zmin: 0,
            dtick: 1000,
            colorbar: {
                autotic: false,
                tickprefix: '',
                title: 'Mortality <br> per 1000'
            }
    }];
    //layout set
    var layout = {
        title: 'Global child Mortality mean <br> from 1950 to 2017',
        geo:{
            showframe: false,
            showcoastlines: false,
            projection:{
                type: 'fill'
            }
        }
    };

    Plotly.newPlot("myDiv1", data, layout, {responsive: true});

});
//main cause line chart
// input the data
trace1 = {
    type: 'scatter',
    x: [1991,  2015],
    y: [2130000, 703917],
    mode: 'lines',
    name: 'Lower respiratory infection',
  };
  
  trace2 = {
    type: 'scatter',
    x: [1991,  2015],
    y: [1800000, 805700],
    mode: 'lines',
    name: 'Neonatal preterm birth complications',

  };

  trace3 = {
    type: 'scatter',
    x: [1991,  2015],
    y: [1390000, 498888],
    mode: 'lines',
    name: 'Diarrheal diseases',
  };

  trace4= {
    type: 'scatter',
    x: [1991,  2015],
    y:  [915323, 740424],
    mode: 'lines',
    name: 'Birth asphyxia and trauma',
  };
  trace5 = {
    type: 'scatter',
    x: [1991,  2015],
    y: [729199, 62588],
    mode: 'lines',
    name: 'Malaria',
  };
//set the layout
  var layout = {
    title: 'Top causes for child mortality',
    yaxis: {
        title: 'Child died from',
        showgrid: false,
        zeroline: false
      },
      xaxis: {
        title: 'Year',
        showline: false
      }
    }
  
  var data = [trace1, trace2, trace3, trace4, trace5 ];
  
  Plotly.newPlot('myDiv2', data, layout, {responsive: true} );





function make_plot(csv_data){
    //Filter our csv data for a particular country
    //Try logging country_data to the console to see what's in it
    let china_data = csv_data.filter(d => d.country == "India");
    let australia_data = csv_data.filter(d => d.country == "Australia");

    //Add our main data trace
    let trace1 = {
        x: china_data.map(d => d.year),
        y: china_data.map(d => d.mortality),
        mode: 'lines',
        name:'china',
    }

    let trace2 = {
        x: australia_data.map(d => d.year),
        y: australia_data.map(d => d.mortality),
        mode: 'lines',
        name:'Australia',
    }
    var layout = {
        title: 'China & Australia mortality'
    }
    var data = [trace1, trace2];
    //Draw the plot at our div
    Plotly.newPlot(myDiv3, data, layout, {responsive: true});
}

//Load the csv data and when loaded: run the make_plot function with that data
Plotly.d3.csv("mortality.csv", make_plot);



//regression plot from tutorial 8
function make_newplot(csv_data){
    let country_data = csv_data.filter(d => d.country == "Turkey");

    //To normalise our data, we need to know the minimum and maximum values
    //Math.min doesn't work with strings so we need to convert
    let mortality_data = country_data.map(d => Number(d.mortality))
    let min_mortality = Math.min(...mortality_data)
    let max_mortality = Math.max(...mortality_data)

    //This regression library needs values stored in arrays
    //We are using the strech function to normalise our data
    let regression_data = country_data.map(d => [stretch(d.year, 2000, 2017, 0, 1),
                                                 stretch(d.mortality, min_mortality, max_mortality, 0, 1)])

    //Here is where we train our regressor, experiment with the order value
    let regression_result = regression.polynomial(regression_data, {order: 2});

    //Now we have a trained predictor, lets actually use it!
    let extension_x = [];
    let extension_y = [];
    for(let year = 2017; year <= 2025; year++){
        //We've still got to work in the normalised scale
        let prediction = regression_result.predict(stretch(year, 2000, 2017, 0, 1))[1]

        extension_x.push(year);
        //Make sure to un-normalise for displaying on the plot
        extension_y.push(stretch(prediction, 0, 1, min_mortality, max_mortality));
    }

    let currentTrace = {
        x: country_data.map(d => d.year),
        y: country_data.map(d => d.mortality),
        mode: 'lines',
        name:"currentTrace"
    }
    //adding our extension as a second trace
    let predictTrace = {
        x: extension_x,
        y: extension_y,
        mode: 'lines',
        name:'predictTrace'
    }

    var data =[currentTrace, predictTrace];

    var layout = {
        title: 'Turkey Child Mortality Regression'
    }

    Plotly.newPlot('regression', data, layout, {responsive: true});
}


Plotly.d3.csv("mortality.csv", make_newplot);

// This stretch function is actually just the map function from p5.js
function stretch(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};




