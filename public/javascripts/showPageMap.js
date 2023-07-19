mapboxgl.accessToken = mbxToken;
const campgroundInfo = campgroundAllInfo;

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: campgroundInfo.geometry.coordinates, 
  zoom: 8
});

new mapboxgl.Marker()
    .setLngLat(campgroundInfo.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25 })
        .setHTML(
            `<h5>${campgroundInfo.title}</h5>`
        )
    )
    .addTo(map)