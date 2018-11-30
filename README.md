1. Obtain code for applicaiton
Visit git hub at https://github.com/rmille4612/neighborhood-map-dec-2018.  Download or clone the repository to your computer.

2. Update API Key
Only the version of this code submitted to Udacity has a complete API key in the code.  Visit https://cloud.google.com/apis/  and sign in or create an account.  Afterward obatain a personal API key.  You must past and save this key into the Google API link in the Map.js component of the code in the spot indicated by YOUR_API_KEY_HERE.

3. Install dependencies
Dependencies are not included in the repository as they may contain many thousands of files.  Open NPM Command prompt and nagivate to the directory containing the project files.  Run the following commands.  Note they may take several minutes each to complete.

npm install
npm install react react-router-dom

4. Running the app
Execute the command npm start.  The sever will load app at http://localhost:3000.  

5. Using the App
The app loads up with a view of six featured sites in the City of Akron Ohio.  Use the filter option at left to search for a specific avaialble site.  You may also simply click on any of the sites on the map indicated by a marker.  This will provide an information window about the site and a link to its wikipedia page.