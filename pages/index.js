import { useState } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import { LocationOn as LocationOnIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

// hook
import useParks from "../hook/useParks";

// Styles
import styles from "../styles/Home.module.css";
import SearchBar from "../components/searchbar";
import Panel from "../components/panel";

export default function Home() {
  const { docs, loading, error } = useParks(data);
  const [currentPark, setCurrentPark] = useState(null);

  const REACT_APP_MAPBOX_TOKEN =
    "pk.eyJ1Ijoia2V2Y29sbGF6b3MiLCJhIjoiY2t2MnY4b3ZrODluZjJ3bnpjNmV0aDJhOSJ9.2fKEkC84IvmFQ1M9sdnsIg";

  const [viewport, setViewport] = useState({
    latitude: 3.42158,
    longitude: -76.5205,
    width: "74vw",
    height: "100vh",
    zoom: 12,
  });

  const goTo = (latitude, longitude) => {
    setViewport({
      ...viewport,
      latitude: latitude,
      longitude: longitude,
      zoom: 16,
      transitionDuration: 1500,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  return (
    <>
      <div className={styles.map}>
        <div className={styles.info_container}>
          <SearchBar />
          {currentPark ? (
            <>
              <button
                onClick={() => {
                  setCurrentPark(null);
                  setViewport({
                    ...viewport,
                    zoom: 14,
                    transitionDuration: 1500,
                  });
                }}
              >
                X
              </button>
              <h1>{currentPark.name}</h1>
              <p>{currentPark.location}</p>
              <p>{currentPark.description}</p>
              <ul>
                {currentPark.recomendations.map((recomendation) => (
                  <li key={recomendation}>{recomendation}</li>
                ))}
              </ul>
            </>
          ) : (
            <Panel
              docs={docs}
              loading={loading}
              error={error}
              goTo={goTo}
              setCurrentPark={setCurrentPark}
            />
          )}
        </div>
        <div className="map_container">
          <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
            mapStyle={`mapbox://styles/kevcollazos/ckv2v68vb449914s1cojha71p`}
            onViewportChange={(viewport) => setViewport(viewport)}
          >
            {docs.map((park) => (
              <Marker
                key={park.id}
                latitude={park.coordinates.latitude}
                longitude={park.coordinates.longitude}
                offsetLeft={-20}
                offsetTop={-20}
              >
                <IconButton
                  color="secondary"
                  onClick={() => {
                    goTo(park.coordinates.latitude, park.coordinates.longitude);
                    setCurrentPark(park);
                  }}
                >
                  <LocationOnIcon />
                </IconButton>
              </Marker>
            ))}
          </ReactMapGL>
        </div>
      </div>
    </>
  );
}
