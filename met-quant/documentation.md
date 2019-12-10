# Culture Timeline Documentation

## 1. Ideation 
This project began with the belief that vast size of the Metropolitan Museum of Art's collection presented the opportunity to understand the interaction of civilizations over time. I was inspired by timelines including this Google Research Music Timeline. 
<br/>
![Music Timeline](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/musictimelineoverview.png)
<br/>
In the Met collection database, the culture column offered the most obvious proxy for human civilizations. I envisioned a stacked area chart as the best candidate for visualizing cultures over time in a cognitively simple graphic. 
<br/>
![Sketch](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/MET_CULTURES_v3.png)


## 2. Prepare CSV Table 
Due to the large size of the collection CSV, I reduced the table to the few columns required for the visualization.
[Table](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/metobjects-sorted.csv) 

## 3. Process Culture Strings 
Normalized culture strings e.g. "Japan" and "Japanese."
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/sketch4.js)

## 4. Draw Bar Chart 
Loop through and count culture column with JavaScript p5.js, count cultures and draw quantitative bar chart representing objects for top ten cultures. 
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/sketch4.js) 

## 5. Get Dates and Timeframe for Each Culture 
Got min and max year for each culture, transformed years to centuries for century array.
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/sketch4.js)

## 6. Draw Stacked Bar Chart  
Created object that contains century and cultureCounts fields 
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/sketch4.js)

## 7. Create Tooltip 
Used Jquery to create and populate tooltips with century and object counts.
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/sketch4.js) 

## Style and Create Axes
Styled with CSS and coded X and Y axes, labels and ticks with JavaScript.
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-quant/sketch4.js) 


