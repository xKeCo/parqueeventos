import React, { useState, useCallback, useEffect } from "react";
import {
  LocationOn as LocationOnIcon,
  Delete as DeleteIcon,
  Home as HomeIcon,
  DateRange as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Modal,
  Button,
  Text,
  Input,
  Card,
  Avatar,
  Loading,
} from "@nextui-org/react";
import {
  collection,
  addDoc,
  getFirestore,
  GeoPoint,
  where,
  orderBy,
  getDocs,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { app } from "../../config/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import Map, { Marker } from "react-map-gl";
import s from "../../styles/Home.module.css";
import useAuth from "../../hook/useAuth";
import { useRouter } from "next/router";
import SEO from "../../components/SEO";
import Link from "next/link";

function IndexAdmin() {
  const db = getFirestore(app);
  const router = useRouter();
  const { user, signOut } = useAuth();
  const REACT_APP_MAPBOX_TOKEN =
    "pk.eyJ1Ijoia2V2Y29sbGF6b3MiLCJhIjoiY2t2MnY4b3ZrODluZjJ3bnpjNmV0aDJhOSJ9.2fKEkC84IvmFQ1M9sdnsIg";

  const [viewport, setViewport] = useState({
    latitude: 3.42158,
    longitude: -76.5205,
    width: "100%",
    height: "20rem",
    zoom: 11,
    bearing: 0,
    pitch: 0,
  });
  const [marker, setMarker] = useState({
    latitude: 3.42158,
    longitude: -76.5205,
  });
  const [events, logEvents] = useState({});

  const onMarkerDragEnd = useCallback((event) => {
    logEvents((_events) => ({ ..._events, onDragEnd: event.lngLat }));
    setMarker({
      longitude: event.lngLat.lng,
      latitude: event.lngLat.lat,
    });
  }, []);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingParks, setLoadingParks] = useState(false);
  const [recomendation, setRecomendation] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");
  const [location, setLocation] = useState("");
  const [visibleCerrarSesion, setVisibleCerrarSesion] = useState(false);

  const closeHandlerCerrarSesion = () => {
    setVisibleCerrarSesion(false);
  };
  const [docs, setDocs] = useState([]);

  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
  };

  const storage = getStorage(app);

  const uploadHandler = async () => {
    const imageRef = ref(storage, file.name);
    try {
      const uploadResult = await uploadBytesResumable(imageRef, file);

      const downloadURL = await getDownloadURL(uploadResult.ref);
      return downloadURL;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const url = await uploadHandler();

    await addDoc(collection(db, "parks"), {
      assistants: [],
      name: name,
      date: date,
      time: time,
      description: description,
      recomendations:
        recomendation.map((item) => {
          return item.value;
        }) || [],
      count: 0,
      image: url || "",
      location: location,
      searchid: name.toLowerCase().trim() || "",
      coordinates: new GeoPoint(marker.latitude, marker.longitude),
      emailCreator: user.email,
    });
    setVisible(false);
    setLoading(false);
    getParksData();
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const url = await uploadHandler();

    await deleteDoc(doc(db, "parks", id));
    setLoading(false);
    getParksData();
  };

  const getParksData = async () => {
    try {
      const parks = await getDocs(
        query(
          collection(db, "parks"),
          where("emailCreator", "==", user.email),
          orderBy("date")
        )
      );
      const docs = parks.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDocs(docs);
      setLoadingParks(false);
    } catch (error) {
      console.log(error);
      setLoadingParks(false);
    }
  };

  useEffect(() => {
    if (user) {
      getParksData();
    }
  }, [user]);

  return (
    <div className={s.admin}>
      {loadingParks ? (
        <Loading />
      ) : (
        <div className={s.admin_container}>
          <SEO />
          <div className={s.admin_top_container}>
            {user && (
              <Avatar
                pointer
                squared
                src={user.photoURL}
                onClick={() => {
                  setVisibleCerrarSesion(true);
                }}
              />
            )}
            <Link href="/" passHref>
              <Button
                auto
                className={s.mb_03}
                color="default"
                shadow
                icon={<HomeIcon />}
              ></Button>
            </Link>
            <Button
              auto
              className={s.mb_03}
              color="default"
              shadow
              onClick={handler}
            >
              Agregar un evento
            </Button>
            <Button auto className={s.mb_03} color="default" shadow>
              Permisos
            </Button>
          </div>
          <h2 className={s.mb_03}>Mis eventos</h2>
          <div className={s.admin_container_parks}>
            {docs.map((doc) => (
              <div key={doc.id} className={s.cardInfo_container}>
                <Card>
                  <Card.Image
                    showSkeleton
                    src={doc.image || "/defaultImage.png"}
                  />
                  <div>
                    <h2> {doc.name} </h2>
                    {/* <Text> {doc.location} </Text> */}
                    <div className={s.infoIconContainer}>
                      <LocationOnIcon fontSize="small" />
                      <p>{doc.location}</p>
                    </div>
                    {/* <Text> {doc.date}</Text> */}
                    <div className={s.infoIconContainer}>
                      <DateRangeIcon fontSize="small" />
                      <p>{doc.date}</p>
                    </div>
                    {/* <Text> {doc.time}</Text> */}
                    <div className={s.infoIconContainer}>
                      <AccessTimeIcon fontSize="small" />
                      <p>{doc.time}</p>
                    </div>
                    {/* <Text> {doc.assistants.length}</Text> */}
                    <div className={s.infoIconContainer}>
                      <PersonIcon fontSize="small" />
                      <p>
                        {doc.assistants.length}{" "}
                        {doc.assistants.length === 1
                          ? "Asistente"
                          : "Asistentes"}
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    color="error"
                    className={s.mb_0303}
                    onClick={() => {
                      handleDelete(doc.id);
                    }}
                  >
                    Eliminar evento
                  </Button>
                </Card>
              </div>
            ))}
          </div>

          {/* Cerrar sesion */}
          <Modal
            closeButton
            blur
            aria-labelledby="modal-title"
            open={visibleCerrarSesion}
            onClose={closeHandlerCerrarSesion}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                Seguro que quieres{" "}
                <Text b size={18}>
                  cerrar sesi&oacute;n?
                </Text>
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Button
                auto
                flat
                color="error"
                onClick={() => {
                  signOut();
                  closeHandlerCerrarSesion();
                  router.push("/");
                }}
              >
                Cerrar sesi&oacute;n
              </Button>
              <Button auto onClick={closeHandlerCerrarSesion}>
                Cancelar
              </Button>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>

          {/* Crear actividad */}
          <Modal
            closeButton
            blur
            aria-labelledby="modal-title"
            open={visible}
            onClose={closeHandler}
          >
            <Modal.Header>
              <Text id="modal-title" size={18}>
                Registra un nuevo evento
              </Text>
            </Modal.Header>
            <Modal.Body>
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="large"
                placeholder="Nombre del evento"
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="large"
                placeholder="Lugar del evento"
                onChange={(e) => setLocation(e.target.value)}
              />
              <Input
                bordered
                fullWidth
                color="primary"
                size="large"
                type="date"
                min="2021-11-19"
                onChange={(e) => setDate(e.target.value)}
              />
              <Input
                bordered
                fullWidth
                color="primary"
                size="large"
                type="time"
                onChange={(e) => setTime(e.target.value)}
              />
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                size="large"
                placeholder="Descripcion del evento"
                onChange={(e) => setDescription(e.target.value)}
              />
              {recomendation.map((value) => (
                <div key={value.id}>
                  <Input
                    clearable
                    bordered
                    fullWidth
                    color="primary"
                    size="large"
                    placeholder="Recomendacion"
                    onChange={(e) => {
                      const newArray = [...recomendation];
                      const currentRecomendation = newArray.findIndex(
                        (item) => item.id === value.id
                      );
                      newArray[currentRecomendation].value = e.target.value;
                      setRecomendation(newArray);
                    }}
                  />
                  <Button
                    color="secondary"
                    onClick={() => {
                      const newArray = recomendation.filter(
                        (item) => item.id !== value.id
                      );
                      setRecomendation(newArray);
                    }}
                    icon={<DeleteIcon />}
                  ></Button>
                </div>
              ))}
              <Button
                onClick={() => {
                  setRecomendation([
                    ...recomendation,
                    { value: "", id: new Date().valueOf() },
                  ]);
                }}
              >
                Anadir recomendaci&oacute;n
              </Button>
              <Input
                clearable
                bordered
                fullWidth
                color="primary"
                label="Imagen del evento"
                size="large"
                type="file"
                placeholder="Descripcion del evento"
                onChange={(e) => {
                  e.target.files[0] && setFile(e.target.files[0]);
                }}
              />
              <p>Seleccione la ubicacion en el mapa</p>
              <Map
                {...viewport}
                mapboxAccessToken={REACT_APP_MAPBOX_TOKEN}
                mapStyle={`mapbox://styles/kevcollazos/ckv2v68vb449914s1cojha71p`}
                onMove={(evt) => setViewport(evt.viewport)}
                minZoom={12}
                maxZoom={16}
              >
                <Marker
                  latitude={marker.latitude}
                  longitude={marker.longitude}
                  draggable
                  onDragEnd={onMarkerDragEnd}
                  anchor="bottom"
                  offset={[500, -825]}
                >
                  <img src="/pin2.svg" alt="pin" />
                </Marker>
              </Map>
            </Modal.Body>
            <Modal.Footer>
              <Button
                disabled={loading}
                auto
                flat
                color="error"
                onClick={closeHandler}
              >
                Cancelar
              </Button>
              <Button disabled={loading} auto onClick={handleSubmit}>
                Agregar
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </div>
  );
}

export default IndexAdmin;
