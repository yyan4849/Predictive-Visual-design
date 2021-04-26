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

// basic plot

myDiv = document.getElementById('myDiv');
function make_plot(csv_data){
    //Filter our csv data for a particular country
    //Try logging country_data to the console to see what's in it
    let china_data = csv_data.filter(d => d.country == "China");
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
    Plotly.newPlot(myDiv, data, layout, {responsive: true});
}

//Load the csv data and when loaded: run the make_plot function with that data
Plotly.d3.csv("mortality.csv", make_plot);

//regression plot
function make_newplot(csv_data){
    let country_data = csv_data.filter(d => d.country == "France");

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
    let regression_result = regression.polynomial(regression_data, {order: 3});

    //Now we have a trained predictor, lets actually use it!
    let extension_x = [];
    let extension_y = [];
    for(let year = 2017; year < 2030; year++){
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
        title: 'France Regression'
    }

    Plotly.newPlot('regression', data, layout, {responsive: true});
}


Plotly.d3.csv("mortality.csv", make_newplot);

// This stretch function is actually just the map function from p5.js
function stretch(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
};




