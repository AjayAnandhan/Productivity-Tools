import "./App.css";
import { Button } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import { useState } from "react";
import qr from "./assets/QR Code.png";

function QRCodeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");
  const [size, setSize] = useState(150);
  const [data, setData] = useState(
    "https://github.com/AjayAnandhan/QRCode-Generator"
  );
  const [isDisabled, setIsDisabled] = useState(true);

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

  const handleChange = (e) => {
    setData(e.target.value);
    if (e.target.value != "") {
      setIsDisabled(false);
    } else setIsDisabled(true);
  };

  const handleDownload = () => {
    fetch(img)
      .then((response) => response.blob())
      .then((blob) => {
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        const filename = `${"qr_code"}_${today}.png`;

        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Something went wrong", error));
  };

  return (
    <div className="app-contaciner">
      <h1>QR Code Generator</h1>
      {img ? (
        <img src={img} className="qrImage" alt="" />
      ) : (
        <img src={qr} className="qrImage" alt="" />
      )}
      <div className="form">
        <label className="inputLabel" htmlFor="data">
          Data for QR Code
        </label>
        <TextField
          id="data"
          label="Data for QR Code"
          type="text"
          onChange={(e) => handleChange(e)}
          required
          onFocus={(e) => e.target.select()}
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
          <Button variant="contained" onClick={QRCodeGen} disabled={isDisabled}>
            Generate
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleDownload}
            disabled={!img}
          >
            Download
          </Button>
        </Stack>
      </div>
      <p>
        Created by{" "}
        <a
          href="https://github.com/AjayAnandhan/QRCode-Generator"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ajay
        </a>
      </p>
      {isLoading && (
        <Box sx={{ display: "flex", position: "absolute" }} className="overlay">
          <CircularProgress />
        </Box>
      )}
    </div>
  );
}

export default QRCodeGenerator;
