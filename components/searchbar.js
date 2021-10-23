// Material UI Components
import {
  InputAdornment,
  OutlinedInput,
  IconButton,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
// import { database } from "../firebase/client";

export default function SearchBar({ setData }) {
  // const handleInput = async (e) => {
  //   const users = await database
  //     .collection("clientes")
  //     .limit(10)
  //     .where("nombreBusqueda", ">=", e.target.value.trim().toLowerCase())
  //     .where(
  //       "nombreBusqueda",
  //       "<=",
  //       e.target.value.trim().toLowerCase() + "\uf8ff"
  //     )
  //     .get();

  //   const docs = [];

  //   users.forEach((doc) => {
  //     docs.push({ ...doc.data(), id: doc.id });
  //   });

  //   setData(docs);
  // };

  return (
    <div>
      <FormControl sx={{ width: "100%" }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Search</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          endAdornment={
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
    </div>
  );
}
