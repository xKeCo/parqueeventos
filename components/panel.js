import s from "../styles/Home.module.css";
import { Loading, Card, Text, Button } from "@nextui-org/react";
import useAuth from "../hook/useAuth";
import Link from "next/link";
import {
  LocationOn as LocationOnIcon,
  DateRange as DateRangeIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";

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
                  goTo(doc.coordinates.longitude, doc.coordinates.latitude);
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
                    <h3>{doc.name}</h3>
                    <div className={s.infoIconContainer}>
                      <LocationOnIcon fontSize="small" />
                      <p>{doc.location}</p>
                    </div>
                    <div className={s.infoIconContainer}>
                      <DateRangeIcon fontSize="small" />
                      <p>{doc.date}</p>
                    </div>
                    <div className={s.infoIconContainer}>
                      <AccessTimeIcon fontSize="small" />
                      <p>{doc.time}</p>
                    </div>
                    <div className={s.infoIconContainer}>
                      <PersonIcon fontSize="small" />
                      <p>
                        {doc.assistants.length}{" "}
                        {doc.assistants.length === 1
                          ? "Asistente"
                          : "Asistentes"}
                      </p>
                    </div>
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
