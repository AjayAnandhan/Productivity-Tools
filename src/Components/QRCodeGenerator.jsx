"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, QrCode, Loader2 } from "lucide-react";

function QRCodeGenerator() {
  const [isLoading, setIsLoading] = useState(false);
  const [img, setImg] = useState("");
  const [size, setSize] = useState(150);
  const [data, setData] = useState("");
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
    setIsDisabled(e.target.value === "");
  };

  const handleDownload = () => {
    fetch(img)
      .then((response) => response.blob())
      .then((blob) => {
        const today = new Date().toISOString().split("T")[0];
        const filename = `qr_code_${today}.png`;

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
    <div className="min-h-screen bg-background py-8 px-4">
      <Card className="w-full max-w-md mx-auto shadow-xl border border-border bg-card">
        <CardHeader className="text-center space-y-3 pb-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <QrCode className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground">
            QR Code Generator
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Generate professional QR codes instantly
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="p-4 bg-background rounded-lg shadow-md border border-border">
              {img ? (
                <img
                  src={img || "/placeholder.svg"}
                  className="w-40 h-40 object-contain"
                  alt="Generated QR Code"
                />
              ) : (
                <div className="w-40 h-40 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="data" className="text-primary font-medium">
                Data for QR Code
              </Label>
              <Input
                id="data"
                type="text"
                value={data}
                onChange={handleChange}
                onFocus={(e) => e.target.select()}
                className="border-border focus:border-primary focus:ring-ring bg-input text-foreground"
                placeholder="Enter text or URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size" className="text-primary font-medium">
                Image Size (pixels)
              </Label>
              <div className="relative">
                <Input
                  id="size"
                  type="number"
                  value={size}
                  onChange={(e) => setSize(Number(e.target.value))}
                  onFocus={(e) => e.target.select()}
                  className="border-border focus:border-primary focus:ring-ring bg-input text-foreground pr-12"
                  placeholder="150"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                  px
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <Button
                onClick={QRCodeGen}
                disabled={isDisabled || isLoading}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4 mr-2" />
                    Generate
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownload}
                disabled={!img}
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/10 bg-transparent"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-3 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Created by{" "}
              <a
                href="https://github.com/AjayAnandhan/QRCode-Generator"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium hover:underline"
              >
                Ajay
              </a>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-card rounded-lg p-6 shadow-xl border border-border">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground mt-2 text-sm">
              Generating QR Code...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRCodeGenerator;
