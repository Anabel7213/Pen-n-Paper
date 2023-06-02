# Pen&Paper

Pen&Paper is my first comprehensive project. It combines a dictionary of the English language and a translator available for almost one hundred different languages. The dictionary is built with the Free Dictionary API, which has certain limitations due to its object's structure. I have bypassed those limitations by looping through the object's arrays. However, some words may still not have definitions, examples, or synonyms available due to missing values in the API itself.

The translator utilizes the MyMemory API and features reverse translation and audio pronunciation, just like the dictionary does. All scripts are written in jQuery and split into modules to maintain neatness and make them easier to debug.

The website is fully optimized for all devices and platforms and features a dark theme achieved by combining CSS variables with SCSS. To preserve the theme selection across all webpages, I made use of local storage. Theme toggling is also available on mobile.
