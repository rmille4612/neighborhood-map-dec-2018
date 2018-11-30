import React, { Component } from 'react';
import PropTypes from 'prop-types'

class PlaceList extends Component {

  static propTypes = 
  {
    map: PropTypes.object.isRequired, standardIcon: PropTypes.object.isRequired, mouseOverIcon: PropTypes.object.isRequired,
    infowindow: PropTypes.object.isRequired, markers: PropTypes.array.isRequired, mapMarkers: PropTypes.array.isRequired,
    makeMarkers: PropTypes.func.isRequired, removeMarkers: PropTypes.func.isRequired, populateInfoWindow: PropTypes.func.isRequired
  }

  state = {                                           //Featured sites search element is initialized without a specified value
    seachVaule: '',
  }

  queryEvent = (e) => {                               //The state of the searched for value entered by a user is set
    this.setState({seachVaule: e.target.value})
  }

  iconReload = (mapMarkers, standardIcon) => {        //Return markers for all listed sites when search criteria is removed
    mapMarkers.forEach(mapMarker => {
      mapMarker.setIcon(standardIcon)
    })
  }

  render() {                                          //Render values for featrued sites and their marks based on serach criteria
    var { map, markers, mapMarkers, infowindow, standardIcon, mouseOverIcon, makeMarkers, removeMarkers, populateInfoWindow } = this.props
    var { seachVaule } = this.state
    var filteredMapMarkers = mapMarkers.filter(mapMarker => mapMarker.title.toUpperCase().includes(seachVaule.toUpperCase()))
    var filteredMarkers = markers.filter(marker => marker.title.toUpperCase().includes(seachVaule.toUpperCase()))
    return (
      <div className='locationList'>
        <form className='sidebarSearch' onSubmit={(e) => {removeMarkers(mapMarkers); makeMarkers(map, filteredMarkers, infowindow); e.preventDefault()}} >
          <input className='search-input' aria-label='search' type='text' value={seachVaule} placeholder='Featured Site Search' onChange={this.queryEvent} />
          <input className='search-filter' type='submit' value='Sort' />
        </form>
        <ul>
          {filteredMapMarkers.map(mapMarker => (
            <li key={mapMarker.title} tabIndex='0' onClick={() => populateInfoWindow(mapMarker, infowindow, map)}
              onMouseOver={() => mapMarker.setIcon(mouseOverIcon)} onMouseOut={() => {mapMarker.setIcon(standardIcon)}}
              onFocus={() => {this.iconReload(mapMarkers, standardIcon); mapMarker.setIcon(mouseOverIcon)}}
              onKeyPress={(event) => {if (event.key === 'Enter') populateInfoWindow(mapMarker, infowindow, map)}} >
              {mapMarker.title}
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default PlaceList