// This code creates a Mapbox map and adds a marker to it with a specific location.
// sets the access token required to use Mapbox's services. The token is a string of characters that provides authorization to access Mapbox's resources.
mapboxgl.accessToken =
  "insert our token here from mapbox";
const lat = 48.8606;
const lng = 2.3376;

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 8,
  center: [lng, lat],
});

const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);