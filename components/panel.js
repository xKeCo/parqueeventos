import s from "../styles/Home.module.css";

export default function Panel({ docs, loading, error, goTo, setCurrentPark }) {
  return (
    <>
      {loading ? (
        <div>Cargando de eventos...</div>
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        <>
          <div className={s.parksContainer}>
            {docs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  goTo(doc.coordinates.latitude, doc.coordinates.longitude);
                  setCurrentPark(doc);
                }}
                className={s.park}
              >
                <h2>{doc.name}</h2>
                <p>{doc.location}</p>
                <p>
                  {new Date(doc.date.toDate())
                    .toLocaleString()
                    .substring(0, new Date(doc.date.toDate().toString()))}
                </p>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
