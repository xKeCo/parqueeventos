import { useState } from "react";
// Next UI
import { Search as SearchIcon } from "@mui/icons-material";
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
  const [visible, setVisible] = useState(false);
  const handler = () => setVisible(true);
  const closeHandler = () => {
    setVisible(false);
    console.log("closed");
  };
  const db = getFirestore(app);
  const EventsRef = collection(db, "parks");
  const { user, signOut } = useAuth();

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
      {user && <Avatar pointer squared src={user.photoURL} onClick={handler} />}

      <Modal
        closeButton
        blur
        aria-labelledby="modal-title"
        open={visible}
        onClose={closeHandler}
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
              closeHandler();
            }}
          >
            Cerrar sesi&oacute;n
          </Button>
          <Button auto onClick={closeHandler}>
            Cancelar
          </Button>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </div>
  );
}
