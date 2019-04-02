# This is my Data Visualization Design README
------

### Art Piece
![Ryan Bloom](images/ReadmeShot1.JPG?raw=true "Ryan Bloom")
![Ryan Bloom](images/ReadmeShot2.JPG?raw=true "Ryan Bloom")

For this project, I created a visualization representing alcohol intakes for countries around the world.  The dataset that I used came from the World Health Organization (WHO) and provided information on countries' per capital alcohol consumption in liters, broken down into various different types of alcohol, including beer, wine, spirits, other, and total, from 2010-2016.  This complete dataset can be found here: http://apps.who.int/gho/data/node.main.A1039?lang=en  

For my visualization, I originally thought about creating a map of the world and display each country's data when either clicking on or hovering over that country.  However, I decided that I wanted to continue to try to create more abstract and minimalistic works, and therefore chose to represent each country with a simple bubble.  I chose this shape (an ellipse) because when displayed on the screen together, the bubbles resemble bubbles that form in various alcoholic (and non-alcoholic) drinks, which made an interesting connection between my visualization and the data set.  Furthermore, I used SceneManager in order to display a title page and then some information about my visualization and my dataset to the viewer before actually displaying my visualization. Finally, I display each country's bubble, which expands and displays specific numbered data points about that country when the mouse hovers over it.    

The bubbles are arranged in a partly random and partly organized manner.  Along the x-axis (horizontal), the bubble's locations are randomly assigned, with the only requirement being that they do not overlap with one another.  However, along the y-axis (vertical), the bubbles that are larger (larger bubbles are countries with larger total alcohol consumptions per capita from 2010-2016) are found further down the screen.  This helps to add depth to my visualization, as the smaller bubbles appear to disappear deep into the screen.  I also created a color gradient for each bubble's stroke (larger bubbles having lighter strokes) which was added for aesthetic affect.  Images of my sketch are seen above, and a link to the full sketch can be found below!

[Here's a link to the piece](https://ryanab702.github.io/DataVisualization1/)