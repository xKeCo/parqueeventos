import { useEffect, useState } from "react";
import { query, collection, getDocs, getFirestore } from "firebase/firestore";
import { app } from "../config/firebase";

const useParks = () => {
  const db = getFirestore(app);
  const [docs, setDocs] = useState([]);
  // loader
  const [loading, setLoading] = useState(true);
  // error
  const [error, setError] = useState(null);

  const getData = async () => {
    try {
      const parks = await getDocs(query(collection(db, "parks")));
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
    getData();
  }, []);

  return {
    docs,
    loading,
    error,
  };
};

export default useParks;
