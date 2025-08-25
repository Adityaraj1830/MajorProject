// const map = new maplibregl.Map({
//   container: "map",
//   style: "https://demotiles.maplibre.org/style.json",
//   center: [77.209, 28.6139],
//   zoom: 5
// });
// map.addControl(new maplibregl.NavigationControl());
// // Add a marker at the desired coordinates
//   new maplibregl.Marker()
//     .setLngLat([77.209, 28.6139])
//     .addTo(map);

// const map = new maplibregl.Map({
//   container: "map",
//   style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
//   center: coordinates,
//   zoom: 5
// });
// map.addControl(new maplibregl.NavigationControl());
// new maplibregl.Marker()
//   .setLngLat(coordinates)
//   .addTo(map);





// Expecting `coordinates` from show.ejs as [lng, lat]

// (function () {
//   // 1) Confirm MapLibre loaded
//   if (!window.maplibregl) {
//     console.error("MapLibre GL failed to load. Check <script> includes in boilerplate.ejs.");
//     return;
//   }

//   // 2) Validate coordinates & set a safe fallback (New Delhi)
//   let coords = Array.isArray(window.coordinates) ? window.coordinates : [77.209, 28.6139];
//   coords = [Number(coords[0]), Number(coords[1])];
//   if (!Number.isFinite(coords[0]) || !Number.isFinite(coords[1])) {
//     coords = [77.209, 28.6139];
//   }

//   // 3) Initialize the map
//   const map = new maplibregl.Map({
//     container: "map",
//     style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
//     center: coords,
//     zoom: 5
//   });

//   map.addControl(new maplibregl.NavigationControl());

//   new maplibregl.Marker().setLngLat(coords).addTo(map);
// })();
 


(function () {
  if (!window.maplibregl) {
    console.error("MapLibre GL failed to load.");
    return;
  }

  if (!Array.isArray(window.coordinates) || window.coordinates.length !== 2) {
    console.error("No valid coordinates found. Map cannot be displayed.");
    return;
  }

  const lng = Number(window.coordinates[0]);
  const lat = Number(window.coordinates[1]);

  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    console.error("Invalid coordinate values.");
    return;
  }

  const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.stadiamaps.com/styles/osm_bright.json",
    center: [lng, lat],
    zoom: 9
  });

  map.addControl(new maplibregl.NavigationControl());
  new maplibregl.Marker()
  .setLngLat([lng, lat])
  .setPopup(
    new maplibregl.Popup({ offset: 25 })
        .setHTML(`<h3>${window.listingTitle}</h3><p>${window.listingLocation}</p>`)
  )
  .addTo(map);
})();



