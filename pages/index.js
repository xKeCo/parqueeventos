import { useState } from "react";
import ReactMapGL, { Marker, FlyToInterpolator } from "react-map-gl";
import {
  LocationOn as LocationOnIcon,
  Cancel as CancelIcon,
  DateRange as DateRangeIcon,
} from "@mui/icons-material";
import { IconButton } from "@mui/material";

// hook
import useParks from "../hook/useParks";

// Styles
import s from "../styles/Home.module.css";
import SearchBar from "../components/searchbar";
import Panel from "../components/panel";

export default function Home() {
  const { docs, loading, error } = useParks();
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
      <div className={s.map}>
        <div className={s.info_container}>
          <SearchBar />

          {currentPark ? (
            <div className={s.desc_container}>
              <h3>Informaci&oacute;n</h3>
              <IconButton
                className={s.cancel_button}
                onClick={() => {
                  setCurrentPark(null);
                  setViewport({
                    ...viewport,
                    zoom: 14,
                    transitionDuration: 1500,
                  });
                }}
              >
                <CancelIcon className={s.button} />
              </IconButton>
              <img src={currentPark.image} alt="event_image" width="100%" />

              <div className={s.info}>
                <h1>{currentPark.name}</h1>
                <div className={s.infoIconContainer}>
                  <LocationOnIcon fontSize="small" />
                  <p>{currentPark.location}</p>
                </div>
                <div className={s.infoIconContainer}>
                  <DateRangeIcon fontSize="small" />
                  <p>
                    {new Date(currentPark.date.toDate())
                      .toLocaleString()
                      .substring(
                        0,
                        new Date(currentPark.date.toDate().toString())
                      )}
                  </p>
                </div>

                <br />

                <p>{currentPark.description}</p>
                <ul>
                  <br />
                  <h4>Recomendacion</h4>
                  {currentPark.recomendations.map((recomendation) => (
                    <li key={recomendation}>{recomendation}</li>
                  ))}
                </ul>
              </div>
            </div>
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
