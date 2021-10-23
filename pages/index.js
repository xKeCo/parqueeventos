import { useState } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import { LocationOn as LocationOnIcon } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import * as data from "./data/parks";

// Styles
import styles from "../styles/Home.module.css";

export default function Home() {
  const REACT_APP_MAPBOX_TOKEN =
    "pk.eyJ1Ijoia2V2Y29sbGF6b3MiLCJhIjoiY2t2MnY4b3ZrODluZjJ3bnpjNmV0aDJhOSJ9.2fKEkC84IvmFQ1M9sdnsIg";

  const [viewport, setViewport] = useState({
    latitude: 3.42158,
    longitude: -76.5205,
    width: "74vw",
    height: "100vh",
    zoom: 12,
  });

  const goTo = () => {
    setViewport({
      ...viewport,
      latitude: 3.3868,
      longitude: -76.5297,
      zoom: 16,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  };

  console.log(data);

  return (
    <>
      <div className={styles.map}>
        <div className="info_container">
          <h1>Hola</h1>
          <button onClick={goTo}>hola</button>
        </div>
        <div className="map_container">
          <ReactMapGL
            {...viewport}
            mapboxApiAccessToken={REACT_APP_MAPBOX_TOKEN}
            mapStyle={`mapbox://styles/kevcollazos/ckv2v68vb449914s1cojha71p`}
            onViewportChange={setViewport}
          >
            {/* {data.map((park) => (
              <Marker
                key={park.id}
                latitude={park.latitude}
                longitude={park.longitude}
              >
                holis
              </Marker>
            ))} */}

            <Marker key={1} latitude={3.3868} longitude={-76.5297}>
              <IconButton color="secondary">
                <LocationOnIcon />
              </IconButton>
            </Marker>
            <Marker key={2} latitude={3.3848} longitude={-76.5257}>
              <IconButton color="secondary">
                <LocationOnIcon />
              </IconButton>
            </Marker>
          </ReactMapGL>
        </div>
      </div>
    </>
  );
}
