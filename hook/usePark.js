import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { app } from "../config/firebase";

const usePark = () => {
  const db = getFirestore(app);
  const [parkData, setParkData] = useState([]);
  // loader
  const [loading, setLoading] = useState(true);
  // error
  const [error, setError] = useState(null);

  const getParkData = async (id) => {
    try {
      const docsRef = doc(db, "parks", id);
      const parks = await getDoc(docsRef);
      const parkDataDoc = { ...parks.data(), id: parks.id };

      setParkData(parkDataDoc);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  return {
    parkData,
    loading,
    error,
    getParkData,
  };
};

export default usePark;
