import React, { Component } from 'react'
import PlaceList from './PlaceList'

function mapLoadValues(source) {            //Obtain map from Google API using a defined API source input as an argument
  var scriptAttributes = document.createElement('script');
  scriptAttributes.type = 'text/javascript';
  scriptAttributes.async = true;
  scriptAttributes.src = source;
  scriptAttributes.onerror = () => {
    alert('Google Map API can not be loaded.');
  }
  var allScripts = document.getElementsByTagName('script')[0];
  allScripts.parentNode.insertBefore(scriptAttributes, allScripts);
}

class Map extends Component {                 //State values which update depending on search status
  state = {map: {}, center: {}, infowindow: {}, markers: [], mapMarkers: [], StandardIcon: {}, mouseOverIcon: {}}


  
  initSetup = () => {                         //Permenant map center.  Akron Ohio USA--Glendale Cemetery
    var center = {
      title: 'Akron Ohio', location: {
        "lat" : 41.083794,
        "lng" : -81.529236
      }
    }
    var markers = [                       //Object array contains locations of six fixed location in Akron Ohio
      {title: "All-America Bridge", location: {
        'lat'  : 41.088740,
        'lng' : -81.512900
      }},
      {title: "Perkins Stone Mansion", location: {
        'lat' : 41.084520,
        'lng' : -81.542300
      }},
      {title: "Quaker Square", location: {
        'lat' : 41.081290,
        'lng' : -81.515240
      }},
      {title: "Glendale Cemetery", location: {
        'lat' : 41.083794,
        'lng' : -81.529236
      }},
      {title: "Akron Zoo", location: {
        'lat' : 41.07945,
        'lng' : -81.54144
      }},
      {title: "Akron Art Museum", location: {
        'lat' : 41.084610,
        'lng' : -81.515370
      }}
    ]

    var map = this.createMap(center)          //Values needed for map set for load
    var infowindow = new window.google.maps.InfoWindow({maxWidth: 200})
    this.makeMarkers(map, markers, infowindow)
    this.setState({map: map, markers: markers, center: center, infowindow: infowindow})
  }


  createMap = (center) => {                   //Function used to initiate and load map over specified center
    return new window.google.maps.Map(document.getElementById('map'), {
      center: center.location,
      zoom: 15
    })
  }

  removeMarkers = (mapMarkers) => {           //Markes not specified by a given filter are removed.
    mapMarkers.forEach((mapMarker) => {
      mapMarker.setMap(null)
    })
  }

  makeMarkers = (map, markers, infowindow) => { //Map markes are created or recreated baed on search values

    var mapScreen = this, StandardIcon = this.makeMarkerIcon('800000'),
    mouseOverIcon = this.makeMarkerIcon('B22222'), mapMarkers = [];

    markers.forEach((placeKeeper) => {
      var givenMarker = new window.google.maps.Marker({
        position: placeKeeper.location,
        map: map,
        title: placeKeeper.title,
        icon: StandardIcon
      })
      mapMarkers.push(givenMarker)

      
      givenMarker.addListener('click', function() { //click event listner for map markers
        mapScreen.populateInfoWindow(givenMarker, infowindow)
      })
      

      givenMarker.addListener('mouseover', function() { //Moverover event. Change to a brighter icon.
        this.setIcon(mouseOverIcon)
      })
      givenMarker.addListener('mouseout', function() {  //Mouseout.  Necessary to change icon back to normal.
        this.setIcon(StandardIcon)
      })

    })

    //State is set based upon values which shuffle depending on search input.
    this.setState({mapMarkers: mapMarkers, StandardIcon: StandardIcon, mouseOverIcon: mouseOverIcon})

  }

  // Media Wiki Api.  3rd Pary Non-Google API used to provide information for info-windows
  extraInfoLookup = (marker, infowindow, map) => {      //Called when information window will open.
    var inputValue = marker.title.split(' ').join('_')
    var wikiLookup = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=extracts&exintro&titles=' + inputValue + '&format=json&utf8'
    var extract = ''
    var mapScreen = this    
    fetch( wikiLookup, {
      method: 'POST',
      headers: new Headers({
          'Api-User-Agent': 'Example/1.0'
      })}).then( function ( response ){
                if (response.ok) {
                  return response.json();
                }
                throw new Error('Response Failed! ' + response.statusText);
      }).then(function(aquiredInfo) {
      var wikiInfo = aquiredInfo.query.pages
      extract = wikiInfo[Object.keys(wikiInfo)[0]].extract
      var firstParagraph = extract.slice(0, extract.indexOf('</p>') + '</p>'.length)
      var directLink = `<a href="https://en.wikipedia.org/wiki/${inputValue}">Additional information found at ${inputValue} at Wikipedia.com</a>`

      mapScreen.infoWindowLoader(marker, infowindow, map, firstParagraph + directLink)
    });
  }

  infoWindowLoader = (marker, infowindow, map, wikiData) => { //Wiki API info prepared for info windows
    infowindow.marker = marker                                //Prepared as html for display
    infowindow.setContent(`<div>${marker.title}</div><div>${wikiData}</div>`)
    infowindow.open(map, marker)
    infowindow.addListener('closeclick', function() {         //Closing window clears the information
      infowindow.marker = null
    })
  }

  populateInfoWindow = (marker, infowindow, map) => {         //Open the infor window with information
    if (infowindow.marker !== marker) {                       //Verify no other window is open
      this.extraInfoLookup(marker, infowindow, map)
    }
  }

  makeMarkerIcon = (markerColor) => {                         //Creates taller and narrow icons which are
    var markerImage = new window.google.maps.MarkerImage(     //more easily visible centered on targe site
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new window.google.maps.Size(19, 37), new window.google.maps.Point(0, 0),
      new window.google.maps.Point(11, 35), new window.google.maps.Size(19,37))
    return markerImage
  }



  componentDidMount() {
    window.initSetup = this.initSetup                         //Call for map from Google API with assigned key
    mapLoadValues('https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&v=3&callback=initSetup')
  }

 

  render() {                                                  //Render content from inported compoenents
    var {map, markers, mapMarkers, infowindow, StandardIcon, mouseOverIcon} = this.state
    return (
      <div id="mainContainer">
        <PlaceList
          map={map} StandardIcon={StandardIcon} mouseOverIcon={mouseOverIcon} //values of application state
          makeMarkers={this.makeMarkers} removeMarkers={this.removeMarkers}
          infowindow={infowindow} markers={markers} mapMarkers={mapMarkers}
          populateInfoWindow={this.populateInfoWindow}
        />
        <div id='map' className='map' ></div>
      </div>
    )
  }
}

export default Map