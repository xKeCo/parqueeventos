export default function Panel({ docs, loading, error, goTo, setCurrentPark }) {
  return (
    <>
      {loading ? (
        <div>Cargando de eventos...</div>
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        <>
          {docs.map((doc) => (
            <button
              key={doc.id}
              onClick={() => {
                goTo(doc.coordinates.latitude, doc.coordinates.longitude);
                setCurrentPark(doc);
              }}
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
        </>
      )}
    </>
  );
}
