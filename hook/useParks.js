// React
import { useEffect, useState } from "react";

// Firebase
import {
  query,
  collection,
  getDocs,
  getFirestore,
  orderBy,
} from "firebase/firestore";
import { app } from "../config/firebase";

const useParks = () => {
  const db = getFirestore(app);
  const [docs, setDocs] = useState([]);
  // loader
  const [loading, setLoading] = useState(true);
  // error
  const [error, setError] = useState(null);

  const getParksData = async () => {
    try {
      const parks = await getDocs(
        query(collection(db, "parks"), orderBy("date"))
      );
      const docs = parks.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDocs(docs);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getParksData();
  }, []);

  return {
    docs,
    loading,
    error,
    getParksData,
  };
};

export default useParks;
