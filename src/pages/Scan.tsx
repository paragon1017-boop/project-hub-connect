import { useState, useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useFoodLog } from "@/hooks/useFoodLog";
import FoodResultCard, { FoodProduct } from "@/components/FoodResultCard";
import { Button } from "@/components/ui/button";
import { ScanBarcode, Camera, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Scan() {
  const [scanning, setScanning] = useState(false);
  const [product, setProduct] = useState<FoodProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { addFood } = useFoodLog();
  const { toast } = useToast();

  const lookupBarcode = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${code}.json`);
      const data = await res.json();
      if (data.status === 1 && data.product) {
        setProduct({
          code,
          product_name: data.product.product_name || "Unknown",
          brands: data.product.brands,
          serving_size: data.product.serving_size,
          nutriments: data.product.nutriments || {},
          image_url: data.product.image_small_url,
        });
      } else {
        toast({ variant: "destructive", title: "Not found", description: "Product not found in database." });
      }
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Failed to look up product." });
    }
    setLoading(false);
  };

  const startScanning = async () => {
    setProduct(null);
    setScanning(true);
    try {
      const scanner = new Html5Qrcode("scanner-region");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          stopScanning();
          lookupBarcode(decodedText);
        },
        () => {}
      );
    } catch (err) {
      toast({ variant: "destructive", title: "Camera error", description: "Could not access camera." });
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
  };

  useEffect(() => {
    return () => { stopScanning(); };
  }, []);

  const handleAdd = (p: FoodProduct) => {
    addFood.mutate(p, {
      onSuccess: () => {
        toast({ title: "Added!", description: `${p.product_name} added to your log.` });
        setProduct(null);
      },
    });
  };

  return (
    <div className="mx-auto max-w-lg px-4 pb-24 pt-6">
      <header className="mb-6 flex items-center gap-2">
        <ScanBarcode className="h-6 w-6 text-primary" />
        <h1 className="text-xl font-bold font-display">Barcode Scanner</h1>
      </header>

      {!scanning && !product && !loading && (
        <div className="flex flex-col items-center gap-4 py-16">
          <div className="rounded-full bg-primary/10 p-6">
            <Camera className="h-12 w-12 text-primary" />
          </div>
          <p className="text-center text-muted-foreground">Point your camera at a food barcode</p>
          <Button size="lg" onClick={startScanning}>
            <Camera className="mr-2 h-4 w-4" /> Start Scanning
          </Button>
        </div>
      )}

      <div id="scanner-region" className={scanning ? "rounded-lg overflow-hidden mb-4" : "hidden"} />

      {scanning && (
        <Button variant="outline" className="w-full" onClick={stopScanning}>
          <XCircle className="mr-2 h-4 w-4" /> Stop Scanning
        </Button>
      )}

      {loading && <p className="text-center text-muted-foreground py-8">Looking up product...</p>}

      {product && (
        <div className="mt-4">
          <FoodResultCard product={product} onAdd={handleAdd} />
        </div>
      )}
    </div>
  );
}
