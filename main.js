//Gapminder project js file

//Selecting body svg
var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

//Define margins
var margin = { top: 10, right: 10, bottom: 50, left: 60 }
var margin2 = { top: 10, right: 10, bottom: 50, left: 60 }
var margin3 = { top: 10, right: 10, bottom: 90., left: 140 }

//Width and height for Gapminder World
var outer_width = 1000;
var outer_height = 550;
var svg_width = outer_width - margin.left - margin.right;
var svg_height = outer_height - margin.top - margin.bottom;

//Width and height for barchart
var outer_width2 = 600;
var outer_height2 = 300;
var svg_width2 = outer_width2 - margin2.left - margin2.right;
var svg_height2 = outer_height2 - margin2.top - margin2.bottom;

//Width and height for barchart
var outer_width3 = 600;
var outer_height3 = 350;
var svg_width3 = outer_width3 - margin3.left - margin3.right;
var svg_height3 = outer_height3 - margin3.top - margin3.bottom;

// Global variablies
var display_year_bar;
var pillar_value;
var selectedCountryBar = '';
var selectedPillar = '';
var dataset, display_year, min_year, max_year;
var continentSelect = '';
var time;
var index = 0;
var countries_perRegion = {};
var countries_perGovernment = {};
var selectedCountry = '';
var circle;
var countryVal = '';
var countryList = ["Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "#00355aland", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Moldova", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Namibia", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "Norway", "Oman", "Pakistan", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Puerto Rico", "Qatar", "Romania", "Russia", "Rwanda", "Samoa", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
var pillarsList = ["Institutions", "Infrastructure", "Macroeconomic_environment", "Health_and_primary_education", "Higher_education_and_training", "Goods_market_efficiency", "Labor_market_efficiency", "Financial_market_development", "Technological_readiness", "Market_size", "Business_sophistication_", "Innovation"];
var yearList = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];

//Create SVG elements
var svg = d3.select("#scatter")
    .append("svg")
    // .style("background", "#aliceFF4040")
    .attr("width", outer_width)
    .attr("height", outer_height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//Regions list
    regions = {
    "Advanced economies": "#FF4040",
    "Middle East, North Africa, and Pakistan": "#FFEB3B",
    "Sub-Saharan Africa": "#f48942",
    "Latin America and the Caribbean": "#2176ff",
    "Commonwealth of Independent States": "#9c1df7",
    "Emerging and Developing Europe": "#837996",
    "Emerging and Developing Asia": "#2ECC71",
};

//Fill data in first country dropdown
select = document.getElementById('countryDrop');
for (country in countryList) {
    select.add(new Option(countryList[country]));
}
//Fill data in year dropdown
yearSelect = document.getElementById('yearDrop');
for (year in yearList) {
    yearSelect.add(new Option(yearList[year]));
}
//Fill data in second country dropdown
countrySelect = document.getElementById('countryDrop2');
for (country in countryList) {
    countrySelect.add(new Option(countryList[country]));
}
//Fill data in Select pillars dropdown
pillarsSelect = document.getElementById('pillarDrop');
for (pillars in pillarsList) {
    pillarsSelect.add(new Option(pillarsList[pillars]));
}

//Import data
d3.csv("GCI_CompleteData4.csv", function (error, data) {
    // handle any data loading errors
    if (error) {
        console.log("Something went wrong");
        console.log(error);
    } else {

        // Assign  the data object loaded to the global dataset variable
        dataset = data;
        year_list = d3.map(dataset, function (d) { return +d.Year; }).keys();
        min_year = d3.min(dataset.map(function (d) { return +d.Year; }));
        display_year = min_year;
        // Generate the visualisation
        generateAxes();
        generateAxesBar();
        generateAxesBar2();
    }
});


// Function to filter year
function yearFilter(value) {
    return (value.Year == display_year);
}

function yearFilterBar(value) {
    return (value.Year == display_year_bar);
}

// Functions to filter selected region and display
function continentFilter(value) {
    if (continentSelect == '')
        return value;
    else
        s = value.Region;
    return (s.includes(continentSelect));
}

function continent(value) {
    continentSelect = value;
    generateVis();
}

// Functions to filter selected Country
function countryFilter(value) {
    return (value.Country == selectedCountry);
}

function countryFilterBar(value) {
    return (value.Country == selectedCountryBar);
}

//Function to filter selected pillar
function selectedPillarBar(pillar_dataset) {
    if (selected_pillar == "Institutions") {
        pillar_value = pillar_dataset.Institutions;
        return (pillar_dataset.Institutions);
    }
    else if (selected_pillar == "Infrastructure") {
        pillar_value = pillar_dataset.Infrastructure;
        return (pillar_dataset.Infrastructure);
    }
    else if (selected_pillar == "Macroeconomic_environment") {
        pillar_value = pillar_dataset.Macroeconomic_environment;
        return (pillar_dataset.Macroeconomic_environment);
    }
    else if (selected_pillar == "Health_and_primary_education") {
        pillar_value = pillar_dataset.Health_and_primary_education;
        return (pillar_dataset.Health_and_primary_education);
    }
    else if (selected_pillar == "Higher_education_and_training") {
        pillar_value = pillar_dataset.Higher_education_and_training;
        return (pillar_dataset.Higher_education_and_training);
    }
    else if (selected_pillar == "Goods_market_efficiency") {
        pillar_value = pillar_dataset.Goods_market_efficiency;
        return (pillar_dataset.Goods_market_efficiency);
    }
    else if (selected_pillar == "Labor_market_efficiency") {
        pillar_value = pillar_dataset.Labor_market_efficiency;
        return (pillar_dataset.Labor_market_efficiency);
    }
    else if (selected_pillar == "Financial_market_development") {
        pillar_value = pillar_dataset.Financial_market_development;
        return (pillar_dataset.Financial_market_development);
    }
    else if (selected_pillar == "Technological_readiness") {
        pillar_value = pillar_dataset.Technological_readiness;
        return (pillar_dataset.Technological_readiness);
    }
    else if (selected_pillar == "Market_size") {
        pillar_value = pillar_dataset.Market_size;
        return (pillar_dataset.Market_size);
    }
    else if (selected_pillar == "Business_sophistication_") {
        pillar_value = pillar_dataset.Business_sophistication_;
        return (pillar_dataset.Business_sophistication_);
    }
    else if (selected_pillar == "Innovation") {
        pillar_value = pillar_dataset.Innovation;
        return (pillar_dataset);
    }
}


// Event controller corresponding to start button
function start() {
    time = setInterval(function () {
        index = index + 1;

        if (index >= year_list.length) {
            index = 0;
        }
        display_year = year_list[index];
        document.getElementById("sliderBarYear").value = display_year;
        generateVis();
        // generateBar1();
        // generateBar2();
    }, 600);
}

// Event controller corresponding to stop button
function stop() {
    document.getElementById("sliderBarYear").value = display_year;
    clearInterval(time);
}

// Funtion related to the year textbox
function sliderWorks(year) {
    display_year = year;
    generateVis();
    clearInterval(time);
}
// Function related to draw the journey of a selected country
function drawJourney() {
    var journey = svg;
    var filtered_dataset = dataset.filter(function (d) {
        if (selectedCountry != null) {
            return display_year >= +d.Year && d.Country == selectedCountry;
        } else {
            return false;
        }
    })
    for (var i = 0; i < filtered_dataset.length; i++) {
        journey.append("circle")
            .attr("id", "journey")
            .attr("cx", xScale(+filtered_dataset[i].GDP))
            .attr("cy", yScale(+filtered_dataset[i].Global_Competitiveness_Index))
            .attr("r", rScale(+filtered_dataset[i].Population))
            .style("stroke", "black")
            .style("stroke-width", 1)
            .style("opacity", 1)
            .attr("fill", regions[filtered_dataset[i].Region]);
    }
}

// Function related to generate x and y axis and corresponding text
function generateAxes() {
    // Instead of a fixed domain we could calculate this from the dataset
    xScale = d3.scaleLog()
        .domain(d3.extent(dataset, function (d) { return +d.GDP }))
        // .domain([d3.min(data, function(d) { return +d.GDP }), d3.max(data, function(d) { return +d.GDP })])
        .range([0, svg_width]);

    // Create a scale object to nicely take care of positioning circles along the horizontal axis
    yScale = d3.scaleLinear()
        .domain(d3.extent(dataset, function (d) { return +d.Global_Competitiveness_Index }))
        // .domain([d3.min(data, function(d) { return +d.LifeExp }), d3.max(data, function(d) { return +d.LifeExp })])
        .range([svg_height, 0]);

    rScale = d3.scaleSqrt()
        .domain(d3.extent(dataset, function (d) { return +d.Population }))
        // .domain([d3.min(data, function(d) { return +d.Population }), d3.max(data, function(d) { return +d.Population })])
        .range([2, 45]);

    var xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(13, d3.format(",d"));

    var yAxis = d3.axisLeft()
        .scale(yScale);

    // Append x axis
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + svg_height + ")")
        .call(xAxis);

    // Append y axis
    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    // Text label for the x axis
    svg.append("text")
        .attr("x", 300)
        .attr("y", svg_height + margin.bottom - 10)
        .attr("font-family", "helvetica")
        .style("font-size", "20px")
        .text("Gross Domestic Product");

    //Text label for y-axis
    svg.append("text")
        .attr("x", 0 - (svg_height / 2))
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .style("font-family", "helvetica")
        .style("font-size", "20px")
        .style("text-anchor", "middle")
        .text("Global Competitiveness Index");


    //Initialization of display_year text floating in the graph
    svg.append("text")
        .attr("x", svg_width / 2)
        .attr("y", svg_height / 1.5)
        .style("text-anchor", "middle")
        .attr("id", "year")
        .attr("class", "year")
        .attr("opacity", 0.5)
        .text(display_year);
}

//Generate scatter plot for Gapminder visualisation
function generateVis() {
    // Filter data by year
    var filtered_dataset = dataset.filter(yearFilter);
    // Filter data by continent
    var filtered_dataset = filtered_dataset.filter(continentFilter);
    // Realted to drawJourney() function
    d3.selectAll("#journey").remove();

    // perform data join
    var circles = svg.selectAll('circle')
        .data(filtered_dataset, function key(d) {
            return d.Country;
        });

    circles.transition()
        .duration(600)
        .ease(d3.easeLinear)
        .attr("cx", function (d) {
            return xScale(+d.GDP);
        })
        .attr("cy", function (d) {
            return yScale(+d.Global_Competitiveness_Index);
        })
        .attr("r", function (d) {
            return rScale(+d.Population);
        })
        .style("stroke", "black")
        .style("stroke-width", 1)
        // To handle clicked country can have distinguish opacity with others
        .style("opacity", function (d) {
            if (d.Country == selectedCountry || selectedCountry == '') {
                return 1;
            } else {
                return 0.2;
            }
        })
        .attr("fill", function (d) {
            return regions[d.Region];
        });

    //handle enter selection 
    circles.enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", function (d) {
            return xScale(+d.GDP);
        })
        .attr("cy", function (d) {
            return yScale(+d.Global_Competitiveness_Index);
        })
        .attr("r", function (d) {
            return rScale(+d.Population);
        })
        .style("stroke", "black")
        .style("stroke-width", 1)
        .style("opacity", 1)
        .attr("fill", function (d) {
            return regions[d.Region];
        })
        // Design mouse event to pop up countries' name
        .on("mouseover", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.8);
            tooltip.html(d.Country + "<br/>" + display_year)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px");

        })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        })
        .on("click", function (d) {
            selectedCountry = d.Country;
            selectedCountryBar = d.Country;
            display_year_bar = d.Year;
            document.getElementById("countryDrop").value = d.Country;
            document.getElementById("yearDrop").value = d.Year;
            generateBar1();
            d3.selectAll('.circle')
                .filter(function (d) { return selectedCountry != d.Country; })
                .transition()
                .style("opacity", 0.2);
        })
    //Text label for Year in background
    svg.select("#year")
        .attr("x", svg_width / 2)
        .attr("y", svg_height / 1.5)
        .style("text-anchor", "middle")
        .attr("class", "year")
        .text(display_year);

    //handle exit selection
    circles.exit()
        .remove();
    // Perform drawing selected counrty's journey
    drawJourney();
}

// Bargraph 1
var svg2;
var xScale2;
var yScale2;
var xAxis2;
var yAxis2;

function generateAxesBar() {
    svg2 = d3.select("#bar1")
        .append("svg")
        // .style("background", "#aliceFF4040")
        .attr("width", outer_width2)
        .attr("height", outer_height2)
        .append("g")
        .attr("transform", "translate(" + 200 + "," + margin2.top + ")");
    // here used the fixed domain
    xScale2 = d3.scaleLinear()
        .domain([0, 10])
        .range([0, 300]);
    // Create a scale object to nicely take care of positioning bars along the horizontal axis
    yScale2 = d3.scaleBand()
        .range([0, 300])
        .paddingInner(0.2)
        .paddingOuter(0.5);

    xAxis2 = d3.axisBottom()
        .ticks(10)
        .scale(xScale2);

    yAxis2 = d3.axisLeft()
        .scale(yScale2);
    // Append x axis for this bar chart
    svg2.append("g")
        .attr("class", "axis2")
        .attr("id", "x-axis2")
        .attr("transform", "translate(0," + (180 + 65) + ")")
        .call(xAxis2);
    // Append y axis for this bar chart
    svg2.append("g")
        .attr("class", "axis2")
        .attr("id", "y-axis2")
        .attr("transform", "translate(0," + (-55) + ")")
        .call(yAxis2);

    // Append title for this bar chart
    svg2.append("text")
        .attr("x", 10)
        .attr("y", 280)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Global Competitiveness Index for Individual Countries");

}


// Define a fucntion to draw the first bar chart
function generateBar1() {
    // Filter data by year
    svg2.selectAll("*").remove();
    svg2.append("g")
        .attr("class", "axis2")
        .attr("id", "x-axis2")
        .attr("transform", "translate(0," + (180 + 65) + ")")
        .call(xAxis2);
    // Append y axis for this bar chart
    svg2.append("g")
        .attr("class", "axis2")
        .attr("id", "y-axis2")
        .attr("transform", "translate(0," + (-55) + ")")
        .call(yAxis2);

    // Append title for this bar chart

    var filtered_dataset_bar1 = dataset.filter(yearFilterBar);

    filtered_dataset_bar1 = filtered_dataset_bar1.filter(countryFilterBar);

    // Update the domain of the y s1cale
    //yScale2.domain(filtered_dataset_bar1.map(function (d) { return d.filtered_dataset_bar1; }));
    // Call the y-axis2
    svg2.select("#y-axis2").call(yAxis2);

    // perform data join 
    var bars = svg2.selectAll('rect')
        .data(filtered_dataset_bar1, function key(d) {
            return d.filtered_dataset_bar1;
        });

    //handle enter selection
    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 0)
        .attr("height", 20)
        .attr("width", function (d) {
            console.log(d.Institutions);
            return xScale2(d.Institutions);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 20)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Infrastructure);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 40)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Macroeconomic_environment);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 60)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Health_and_primary_education);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 80)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Higher_education_and_training);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 100)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Goods_market_efficiency);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 120)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Labor_market_efficiency);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 140)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Financial_market_development);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 160)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Technological_readiness);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 180)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Market_size);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 200)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Business_sophistication_);
        })
        .attr("fill", "#00355a");

    bars.enter()
        .append("rect")
        .attr("x", 5)
        .attr("y", 220)
        .attr("height", 20)
        .attr("width", function (d) {
            return xScale2(d.Innovation);
        })
        .attr("fill", "#00355a")

    svg2.append("text")
        .attr("x", 10)
        .attr("y", 280)
        .style("font-size", "13px")
        .style("font-family", "Helveltica")
        .text("Global Competitiveness Index for Individual Countries");


    svg2.append("text")
        .attr("x", -70)
        .attr("y", 15)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Instituitions");
    svg2.append("text")
        .attr("x", -80)
        .attr("y", 35)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Infrastructure");
    svg2.append("text")
        .attr("x", -160)
        .attr("y", 55)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Macroeconomic_environment");
    svg2.append("text")
        .attr("x", -169)
        .attr("y", 75)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Health_and_primary_education");
    svg2.append("text")
        .attr("x", -169)
        .attr("y", 95)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Higher_education_and_training");
    svg2.append("text")
        .attr("x", -140)
        .attr("y", 115)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Goods_market_efficiency");
    svg2.append("text")
        .attr("x", -135)
        .attr("y", 135)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Labor_market_efficiency");
    svg2.append("text")
        .attr("x", -170)
        .attr("y", 155)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Financial_market_development");
    svg2.append("text")
        .attr("x", -132)
        .attr("y", 175)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Technological_readiness");
    svg2.append("text")
        .attr("x", -70)
        .attr("y", 195)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Market_size");
    svg2.append("text")
        .attr("x", -140)
        .attr("y", 215)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Business_sophistication_");
    svg2.append("text")
        .attr("x", -60)
        .attr("y", 235)
        .style("font-size", "13px")
        .style("font-family", "helveltica")
        .text("Innovation");

    // handle exit selection 
    bars.exit()
        .remove();
}

// Bargraph 2
var svg3;
var xScale3;
var yScale3;
var xAxis3;
var yAxis3;

function generateAxesBar2() {
    svg3 = d3.select("#bar2")
        .append("svg")
        .attr("width", outer_width3)
        .attr("height", outer_height3 + 8)
        .append("g")
        .attr("transform", "translate(" + margin3.left + "," + 100 + ")");
    // here used the fixed domain
    xScale3 = d3.scaleLinear()
        .domain([0, 8])
        .range([0, 300]);
    // Create a scale object to take care of positioning bars along the horizontal axis
    yScale3 = d3.scaleBand()
        .range([60, 300])
        .paddingInner(0.2)
        .paddingOuter(0.5);

    xAxis3 = d3.axisBottom()
        .ticks(10)
        .scale(xScale3);

    yAxis3 = d3.axisLeft()
        .scale(yScale3);
    // Append x axis for this bar chart
    svg3.append("g")
        .attr("class", "axis3")
        .attr("id", "x-axis3")
        .attr("transform", "translate(0," + (100) + ")")
        // Append y axis for this bar chart
        .call(xAxis3);
    svg3.append("g")
        .attr("class", "axis3")
        .attr("id", "y-axis3")
        .attr("transform", "translate(0," + (-200) + ")")
        .call(yAxis3);
    // Append title for this bar chart

    svg3.append("text")
        .attr("x", -10)
        .attr("y", 140)
        .style("font-size", "13px")
        .style("font-family", "helvetica")
        .text("Comparison between First Country and Second Country for GCI");
}
// Define a fucntion to draw the second bar chart
function generateBar2(country1, country2) {
    svg3.selectAll("*").remove();
    svg3.append("g")
        .attr("class", "axis3")
        .attr("id", "x-axis3")
        .attr("transform", "translate(0," + (100) + ")")
        // Append y axis for this bar chart
        .call(xAxis3);
    svg3.append("g")
        .attr("class", "axis3")
        .attr("id", "y-axis3")
        .attr("transform", "translate(0," + (-200) + ")")
        .call(yAxis3);

    // Filter data by year
    var filtered_dataset_bar = dataset.filter(yearFilterBar);
    selectedCountryBar = country1;
    var filtered_datasetx = filtered_dataset_bar.filter(countryFilterBar);
    filtered_datasetx = filtered_datasetx.filter(selectedPillarBar);
    filtered_dataset1 = pillar_value;
    selectedCountryBar = country2;
    var filtered_datasety = filtered_dataset_bar.filter(countryFilterBar);
    filtered_datasety = filtered_datasety.filter(selectedPillarBar);
    filtered_dataset2 = pillar_value;
    var filtered_final_dataset = [];
    filtered_final_dataset.push(filtered_dataset1, filtered_dataset2);

    // Call the y-axis3
    svg3.select("#y-axis3").call(yAxis3);

    //perform data join 
    var bars = svg3.selectAll('rect')
        .data(filtered_final_dataset,
            function key(d) {
                return d.filtered_final_dataset;
            }
        );

    //handle enter selection
    if (selected_pillar == "Institutions") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                console.log("graph: ", d[0]);
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Infrastructure") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                console.log("d1", filtered_final_dataset[1]);
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Macroeconomic_environment") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Health_and_primary_education") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Higher_education_and_training") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Goods_market_efficiency") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Labor_market_efficiency") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Financial_market_development") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Technological_readiness") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Market_size") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Business_sophistication_") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 40)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }
    else if (selected_pillar == "Innovation") {
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[0]);
            })
            .attr("fill", "#00355a");
        bars.enter()
            .append("rect")
            .attr("x", 5)
            .attr("y", 0)
            .attr("height", 40)
            .attr("width", function (d) {
                return xScale3(filtered_final_dataset[1]);
            })
            .attr("fill", "#FF4040");
    }

    svg3.append("text")
        .attr("x", -10)
        .attr("y", 140)
        .style("font-size", "13px")
        .style("font-family", "helvetica")
        .text("Comparison between First Country and Second Country for GCI");

    svg3.append("text")
        .attr("x", -60)
        .attr("y", 25)
        .style("font-size", "13px")
        .style("font-family", "helvetica")
        .text("Country 1");


    svg3.append("text")
        .attr("x", -60)
        .attr("y", 65)
        .style("font-size", "13px")
        .style("font-family", "helvetica")
        .text("Country 2");
    //handle exit selection 
    bars.exit()
        .remove();
}

// Country Drop Down
$("#countryDrop").change(function () {
    countryVal = $("#countryDrop").val();
});

// Clear Button Function
$("#clearButton").click(function () {
    $("#countryDrop option[value='All']").prop('selected', true);
});

//Select Button click
function countryyearSelected() {
    selectedCountryBar = document.getElementById("countryDrop").value;
    display_year_bar = document.getElementById("yearDrop").value;
    generateBar1();
}

//Compare Button click
function compareCountries() {
    var selectedCountry1 = document.getElementById("countryDrop").value;
    var selectedCountry2 = document.getElementById("countryDrop2").value;
    display_year_bar = document.getElementById("yearDrop").value;
    selected_pillar = document.getElementById("pillarDrop").value;

    if (selectedCountry1 == selectedCountry2) {
        window.alert('Both the countries selected are same. Please select a different country to compare');
        return;
    }
    generateBar2(selectedCountry1, selectedCountry2);
}