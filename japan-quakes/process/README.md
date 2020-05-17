## Process

EARTHQUAKES AND JAPAN 

Introduction
Japan accounts for about 20 percent of worldwide earthquakes of magnitude 6 or greater. Much of its population is densely concentrated in its most seismically active areas. This map aims to 1) Place Japanese Seismic activity in a global context, 2) Focus on Japan's deadliest earthquakes since precise measurements began in the 20th c., and 3) Allow viewers to zoom in on the nation to highlight the proximity of Japan's largest population centers to earthquake activity. 

Map-1
A world map of all earthquakes over m4.5 over the last month, with magnitude encoded by color value. Time of event and event duration indicated in pop-ups.

Map-2
An inset map of Japan with all earthquakes over m4.5 over the last month, with magnitude encoded by circle size, color value and opacity. Time of event and event duration indicated in pop-ups.

Map-3
An inset map of the Tokyo metropolitan region, the world's largest by population. Earthquakes over m4.5 over the last month are shown with magnitude encoded by circle size, color value and opacity. A Leaflet street map will be overlayed to indicate population density. (If a population density map is available that would be another useful indicator of the high proximity of Japan's people to seismically active zones.)

Final map
The final iteration utilizes a Leaflet/Thunderforest world map, centered on Tokyo, Japan, with zoom adjusted to maximize Japan on screen. Global earthquakes over m4.5 from the last week, and Japan's deadliest earthquakes of the last century (source: Japan Meteorological Agency) are encoded by circles sized by magnitude. The initial plan was to bind the circle color value of Japan's historic earthquakes to the country's intensity scale, but this produced little color variation due to all instances lying between 5-7. Further experiment with deaths as a color value also created little variation, with too much of an outlier effect. This led to a decision to bind circle radius to magnitude and use a high-contrast green/orange color scheme to boost readability and emphasize the difference between current global earthquakes and Japan's historic earthquakes. Some opacity is employed to enable a view of populated areas and topography.
	
Diagram	
The diagram consists of three elements: 1) A comparison of this week's largest global Seismic event and Japan's largest recorded earthquake, the m9.0 2011 Tohoku quake, both represented with circles encoded by magnitude, 2) A bar chart showing Japan's deadliest earthquake, the 1923 Kanto quake, in context with the deadliest earthquakes worldwide 1900-2016 (source: Statista), and 3) A minimal key indicating orange for Japan Seismic events and green for global events. 
	
