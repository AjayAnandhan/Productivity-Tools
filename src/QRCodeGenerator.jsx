import "./App.css";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState } from "react";

function QRCodeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");
  const [size, setSize] = useState(150);
  const [data, setData] = useState("");

  async function QRCodeGen() {
    setIsLoading(true);
    try {
      const URL = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`;
      setImg(URL);
    } catch (error) {
      console.error("Something went wrong", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-contaciner">
      <h1>QR Code Generator</h1>
      {img && <img src={img} className="qrImage" alt="" />}
      <div className="form">
        <label className="inputLabel" htmlFor="data">
          Data for QR Code
        </label>
        <TextField
          id="data"
          label="Data for QR Code"
          type="text"
          onChange={(e) => setData(e.target.value)}
        />
        <label className="inputLabel" htmlFor="size">
          Image size `(e.g., 150)`
        </label>
        <OutlinedInput
          id="size"
          placeholder="(e.g., 150)"
          endAdornment={<InputAdornment position="end">px</InputAdornment>}
          aria-describedby="outlined-weight-helper-text"
          inputProps={{
            "aria-label": "weight",
          }}
          defaultValue={150}
          onFocus={(e) => e.target.select()}
          onChange={(e) => setSize(e.target.value)}
        />
        <Stack spacing={2} direction="row" marginBottom="5px" marginTop="10px">
          <Button variant="contained" onClick={QRCodeGen}>
            Generate
          </Button>
          <Button variant="contained" color="success">
            Download
          </Button>
        </Stack>
      </div>
      {isLoading && (
        <Box sx={{ display: "flex", position: "absolute" }} className="overlay">
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default QRCodeGenerator;
