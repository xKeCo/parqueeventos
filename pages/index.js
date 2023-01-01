import { useState, useRef } from "react";

// Mapbox
import Map, { Marker } from "react-map-gl";
// Mapbox Styles
import "mapbox-gl/dist/mapbox-gl.css";

// hook
import useParks from "../hook/useParks";

// Styles
import s from "../styles/Home.module.css";

// Components
import { EventInfo, SearchBar, Panel, SEO } from "../components/";

// Icons
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function Home() {
  const { docs, loading, error, getParksData } = useParks();
  const [currentPark, setCurrentPark] = useState(null);
  const [searchResult, setSearchResult] = useState([]);
  const [searchText, setSearchText] = useState("");

  const REACT_APP_MAPBOX_TOKEN =
    "pk.eyJ1Ijoia2V2Y29sbGF6b3MiLCJhIjoiY2t2MnY4b3ZrODluZjJ3bnpjNmV0aDJhOSJ9.2fKEkC84IvmFQ1M9sdnsIg";

  const [viewport, setViewport] = useState({
    latitude: 3.42158,
    longitude: -76.5205,
    width: "100vw",
    height: "100vh",
    zoom: 12,
  });

  const mapRef = useRef(null);

  const refMap = mapRef.current?.flyTo;

  const goTo = (longitude, latitude) => {
    refMap({
      center: [longitude, latitude],
      duration: 2000,
      zoom: 16,
    });
  };

  return (
    <>
      <div className={s.map}>
        <SEO />
        <div className={s.info_container}>
          <SearchBar
            setSearchResult={setSearchResult}
            searchText={searchText}
            setSearchText={setSearchText}
          />

          {currentPark ? (
            <EventInfo
              currentPark={currentPark}
              viewport={viewport}
              setViewport={setViewport}
              setCurrentPark={setCurrentPark}
              getParksData={getParksData}
              setSearchText={setSearchText}
              setSearchResult={setSearchResult}
              refMap={refMap}
            />
          ) : (
            <Panel
              docs={searchResult.length > 0 ? searchResult : docs}
              loading={loading}
              error={error}
              goTo={goTo}
              setCurrentPark={setCurrentPark}
            />
          )}
        </div>

        <div className={s.map_container}>
          <Map
            {...viewport}
            ref={mapRef}
            minZoom={12}
            maxZoom={16}
            mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
            mapStyle={`mapbox://styles/kevcollazos/ckv2v68vb449914s1cojha71p`}
            onMove={(evt) => setViewport(evt.viewport)}
          >
            {docs.map((park) => (
              <Marker
                key={`marker-${park.id}`}
                latitude={park.coordinates._lat}
                longitude={park.coordinates._long}
                onClick={() => {
                  goTo(park.coordinates._long, park.coordinates._lat);
                  setCurrentPark(park);
                }}
                anchor="bottom"
              >
                <LocationOnIcon
                  className={s.marker}
                  color="error"
                  fontSize="large"
                />
              </Marker>
            ))}
          </Map>
        </div>
      </div>
      <div className={s.phoneView}>
        <h1>
          Website optimized for computer viewing only, please re-enter from a
          computer. Thank U! ❤️
        </h1>
        <img src="/phone.svg" alt="Imagen" width="80%" />
      </div>
    </>
  );
}
