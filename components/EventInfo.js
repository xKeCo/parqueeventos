import { useState } from "react";
// Icons
import {
  LocationOn as LocationOnIcon,
  Cancel as CancelIcon,
  DateRange as DateRangeIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
// Material UI
import { IconButton } from "@mui/material";
// Next UI
import { Modal, Button, Text } from "@nextui-org/react";
// Firebase
import { app } from "../config/firebase";
import { doc, updateDoc, getFirestore } from "firebase/firestore";
// Hooks
import useAuth from "../hook/useAuth";

const EventInfo = ({
  setCurrentPark,
  currentPark,
  setViewport,
  viewport,
  s,
  getParksData,
  setSearchText,
  setSearchResult,
}) => {
  const db = getFirestore(app);
  const eventRef = doc(db, "parks", currentPark.id);
  const [visible, setVisible] = useState(false);
  const { user, loadingUser, googleAuth, facebookAuth } = useAuth();

  const isUserInscribed =
    currentPark?.assistants?.some((assistant) => assistant.uid === user?.uid) ||
    false;

  const handler = async () => {
    if (!loadingUser) {
      if (user) {
        if (!isUserInscribed) {
          const newAssistant = [
            ...currentPark.assistants,
            {
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              uid: user.uid,
            },
          ];

          await updateDoc(eventRef, {
            assistants: newAssistant,
          });
          setCurrentPark({
            ...currentPark,
            assistants: newAssistant,
          });
          await getParksData();
        } else {
          const newAssistants = currentPark.assistants.filter(
            (assistant) => assistant.uid !== user.uid
          ); // Remove user from assistants
          await updateDoc(eventRef, {
            assistants: newAssistants,
          });
          setCurrentPark({
            ...currentPark,
            assistants: newAssistants,
          });
          await getParksData();
        }
      } else {
        setVisible(true);
      }
    }

    setVisible(true);
  };

  const closeHandler = () => {
    setVisible(false);
  };
  return (
    <div className={s.eventinfo_container}>
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
            setSearchResult([]);
            setSearchText("");
          }}
        >
          <CancelIcon className={s.button} />
        </IconButton>
        <img
          src={currentPark.image || "/defaultImage.png"}
          alt="event_image"
          width="100%"
        />

        <div className={s.info}>
          <h1>{currentPark.name}</h1>
          <div className={s.infoIconContainer}>
            <LocationOnIcon fontSize="small" />
            <p>{currentPark.location}</p>
          </div>
          <div className={s.infoIconContainer}>
            <DateRangeIcon fontSize="small" />
            <p>{currentPark.date}</p>
          </div>
          <div className={s.infoIconContainer}>
            <DateRangeIcon fontSize="small" />
            <p>{currentPark.time}</p>
          </div>
          <div className={s.infoIconContainer}>
            <PersonIcon fontSize="small" />
            <p>
              {currentPark.assistants.length}{" "}
              {currentPark.assistants.length === 1 ? "Asistente" : "Asistentes"}
            </p>
          </div>
          <Button
            flat={isUserInscribed}
            auto
            size="small"
            color={isUserInscribed ? "error" : "primary"}
            onClick={handler}
            className={s.mb_03}
          >
            {isUserInscribed ? "Cancelar inscripcion" : "Inscribirme"}
          </Button>

          <br />
          <h4>Descripci&oacute;n</h4>
          <p>{currentPark.description}</p>
          <ul>
            <br />
            <h4>Recomendaci&oacute;n</h4>
            {currentPark.recomendations.map((recomendation) => (
              <li key={recomendation}>{recomendation}</li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible && !user}
        onClose={closeHandler}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Upaaaa! Aun estas loggeado.
            <br />
            <Text b size={18}>
              Inicia sesi&oacute;n para inscribirte 🤨.
            </Text>
          </Text>
        </Modal.Header>
        <Modal.Body>
          <Button
            onClick={googleAuth}
            color="#DB4437"
            iconRight={<GoogleIcon />}
          >
            Continuar con Google
          </Button>
          <Button
            onClick={facebookAuth}
            color="#3b5998"
            iconRight={<FacebookIcon />}
          >
            Continuar con Facebook
          </Button>
        </Modal.Body>
        <Modal.Footer />
      </Modal>
    </div>
  );
};

export default EventInfo;
