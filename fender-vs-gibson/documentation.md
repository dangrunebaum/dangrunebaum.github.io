# Fender vs Gibson Documentation
## 1. Ideation 
This project began with two goals: to determine which brand was more popular over time, and which was played by which rock star.\
![Sketch](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-qual/FENDER_VS_GIBSON_SKETCH.jpg)

## 2. Build CSV table from "Play It Loud" website.
Included guitar exhibition data, URLs and songIDs etc. for popup media. 
[Table](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-interactive/data/guitars.csv)

## 3. Code basic guitar graph with popups. 
For the qualitative segment, I looped through the table to build a graph with JavaScript p5.js canvas, and created popups with Jquery, styled with CSS.
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-qual/guitars.js)
![Graph](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-qual/FENDER_VS_GIBSON_FINAL.png) 

## 4. Implement Filter
For the interactive segment, I coded a filter of guitar makes and models with JavaScript and Jquery.
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-int/guitars.js)
![Filter view](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/fender-vs-gibson/filter_view.png)

## 5. Ideation for Sound and Waveform Comparison 
Also for the interactive segment, I was inspired by online debate and kitchen science such as [this article](https://www.cycfi.com/2013/11/sustain-myth-science/),  to create a guitar sound and waveform analyzer interactive using the p5.js FFT analyzer. ![Sound sketch](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/fender-vs-gibson/waveform_ideation.png) 

## 6. Code Sound and Waveform 
Built visualization with p5.js FFT from p5 sound library, code interactions with JavaScript.
[Script](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/met-int/guitars.js)

## 7. Ideation for Mobile Version 
Given the size of the graph and waveform canvases, recreating the site for mobile screens required re-envisioning it in multi-page form with Illustrator.
![Sketch](https://github.com/dangrunebaum/dangrunebaum.github.io/blob/master/fender-vs-gibson/mobile_ideation.png)

## 8. Code Mobile Site
Wrote separate JavaScript, CSS and HTML scripts for mobile site as well as new index.html for redirect to desktop or mobile. 
[Scripts](https://github.com/dangrunebaum/dangrunebaum.github.io/tree/master/fender-vs-gibson/met-mobile)
