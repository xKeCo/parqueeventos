import { useState } from "react";
// Next UI
import {
  Search as SearchIcon,
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import useAuth from "../hook/useAuth";
import { Input, Avatar, Modal, Button, Text } from "@nextui-org/react";

//styles
import s from "../styles/Home.module.css";
//firebase
import { app } from "../config/firebase";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";

export default function SearchBar({
  setSearchResult,
  searchText,
  setSearchText,
}) {
  const [visibleCerrarSesion, setVisibleCerrarSesion] = useState(false);
  const [visibleIniciarSesion, setVisibleIniciarSesion] = useState(false);
  const handlerCerrarSesion = () => setVisibleCerrarSesion(true);
  const closeHandlerCerrarSesion = () => {
    setVisibleCerrarSesion(false);
  };
  const handlerIniciarSesion = () => setVisibleIniciarSesion(true);
  const closeHandlerIniciarSesion = () => {
    setVisibleIniciarSesion(false);
  };
  const db = getFirestore(app);
  const EventsRef = collection(db, "parks");
  const { user, signOut, googleAuth, facebookAuth } = useAuth();

  const handleInput = async (e) => {
    setSearchText(e.target.value);
    const eventsQuery = query(
      EventsRef,
      where("searchid", ">=", e.target.value.trim().toLowerCase()),
      where("searchid", "<=", e.target.value.trim().toLowerCase() + "\uf8ff")
    );

    const events = await getDocs(eventsQuery);

    let docs = [];

    events.forEach((event) => {
      docs.push({ ...event.data(), id: event.id });
    });

    setSearchResult(docs);
  };

  return (
    <div className={s.searchBar}>
      <Input
        fullWidth
        placeholder="Search"
        size="large"
        contentRight={<SearchIcon />}
        onChange={handleInput}
        value={searchText}
      />
      {user ? (
        <Avatar
          pointer
          squared
          src={user.photoURL}
          onClick={handlerCerrarSesion}
        />
      ) : (
        <Avatar
          pointer
          squared
          icon={<LoginIcon />}
          onClick={handlerIniciarSesion}
        />
      )}

      {/* Modal inicio de sesion */}
      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visibleIniciarSesion && !user}
        onClose={closeHandlerIniciarSesion}
      >
        <Modal.Header>
          <Text id="modal-title" size={18}>
            Upaaaa! Aun estas loggeado.
            <br />
            <Text b size={18}>
              Inicia sesi&oacute;n 🤨.
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

      {/* Modal cerrar sesion */}
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
    </div>
  );
}
