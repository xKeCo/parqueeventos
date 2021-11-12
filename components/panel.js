import s from "../styles/Home.module.css";
import { Loading, Card, Text } from "@nextui-org/react";

export default function Panel({ docs, loading, error, goTo, setCurrentPark }) {
  return (
    <>
      {loading ? (
        <div className={s.loader}>
          <Loading size="large" />
        </div>
      ) : error ? (
        <div>{error.message}</div>
      ) : (
        <>
          <div className={s.parksContainer}>
            {docs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  goTo(doc.coordinates.latitude, doc.coordinates.longitude);
                  setCurrentPark(doc);
                }}
                className={s.cardInfo_container}
              >
                {/* <div>
                  <Avatar squared src={doc.image} size="xlarge" />
                </div> */}
                <Card>
                  <Card.Image showSkeleton src={doc.image} />
                  <div>
                    <Text h4> {doc.name} </Text>
                    <Text> {doc.location} </Text>
                    <Text>
                      {" "}
                      {new Date(doc.date.toDate())
                        .toLocaleString()
                        .substring(
                          0,
                          new Date(doc.date.toDate().toString())
                        )}{" "}
                    </Text>
                  </div>
                </Card>
                {/* <button
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
                </button> */}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
