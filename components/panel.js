import s from "../styles/Home.module.css";
import { Loading, Card, Text, Button } from "@nextui-org/react";
import useAuth from "../hook/useAuth";
import Link from "next/link";

export default function Panel({ docs, loading, error, goTo, setCurrentPark }) {
  const { user } = useAuth();
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
            {user &&
              (user.email === "kevin.collazos@uao.edu.co" ||
                user.email === "joyd.lasprilla@uao.edu.co" ||
                user.email === "kevcollazos@gmail.com") && (
                <Link href="/admin">
                  <Button className={s.mb_03}>
                    Ir al panel de administrador
                  </Button>
                </Link>
              )}
            {docs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => {
                  goTo(doc.coordinates.latitude, doc.coordinates.longitude);
                  setCurrentPark(doc);
                }}
                className={s.cardInfo_container}
              >
                <Card>
                  <Card.Image
                    showSkeleton
                    src={doc.image || "/defaultImage.png"}
                  />
                  <div>
                    <Text h4> {doc.name} </Text>
                    <Text> {doc.location} </Text>
                    <Text> {doc.date}</Text>
                    <Text> {doc.time}</Text>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
}
