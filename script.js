//sidebar appear in certain area
var sidebar = document.querySelector('.article-sidebar')
var banner = document.querySelector('.content-nav')
var bannerTop = banner.offsetTop+500
document.addEventListener('scroll', function(){
// console.log(window.pageYOffset);
if (window.pageYOffset >= bannerTop){
    sidebar.style.display = 'block';
}else{
    sidebar.style.display = 'none';
}
})

// make a plot

myDiv = document.getElementById('myDiv');
function make_plot(csv_data){
    //Filter our csv data for a particular country
    //Try logging country_data to the console to see what's in it
    let country_data = csv_data.filter(d => d.country == "China");

    //Add our main data trace
    let data = [{
        x: country_data.map(d => d.year),
        y: country_data.map(d => d.mortality),
        mode: 'lines'
    }]

    //Draw the plot at our div
    Plotly.newPlot(myDiv, data);
}

//Load the csv data and when loaded: run the make_plot function with that data
Plotly.d3.csv("mortality.csv", make_plot);



