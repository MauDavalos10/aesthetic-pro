import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from "react";
import { fabric } from "fabric";
import { Box, Typography, CircularProgress } from "@mui/material";

const SimulationCanvas = forwardRef(
  (
    { originalImage, editorMode, showComparison, noseConfig, lipsConfig },
    ref
  ) => {
    const canvasRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const originalCanvasRef = useRef(null);
    const originalFabricCanvasRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [facialPoints, setFacialPoints] = useState(null);
    const loadingTimeoutRef = useRef(null);

    // Puntos faciales simulados (en una implementación real usarías MediaPipe)
    const mockFacialPoints = {
      nose: {
        center: { x: 250, y: 200 },
        tip: { x: 250, y: 230 },
        leftWing: { x: 235, y: 225 },
        rightWing: { x: 265, y: 225 },
        bridge: { x: 250, y: 180 },
      },
      lips: {
        upperCenter: { x: 250, y: 270 },
        lowerCenter: { x: 250, y: 285 },
        leftCorner: { x: 230, y: 277 },
        rightCorner: { x: 270, y: 277 },
        cupidBow: { x: 250, y: 268 },
      },
    };

    useImperativeHandle(ref, () => ({
      applyModification: (type, property, value) => {
        applySimulationModification(type, property, value);
      },
      getModifiedImage: () => {
        return fabricCanvasRef.current?.toDataURL("image/png");
      },
      downloadImage: () => {
        downloadCanvasImage();
      },
      reset: () => {
        resetCanvas();
      },
    }));

    useEffect(() => {
      console.log("🔄 useEffect triggered - originalImage:", originalImage);
      if (originalImage) {
        console.log("✅ Original image exists, initializing canvas");
        initializeCanvas();
      } else {
        console.log("❌ No original image provided");
      }
      return () => {
        console.log("🧹 Cleanup useEffect");
        cleanup();
      };
    }, [originalImage]);

    useEffect(() => {
      if (noseConfig && editorMode === "nose") {
        applyNoseModifications();
      }
    }, [noseConfig, editorMode]);

    useEffect(() => {
      if (lipsConfig && editorMode === "lips") {
        applyLipsModifications();
      }
    }, [lipsConfig, editorMode]);

    const cleanup = () => {
      console.log("🧹 Cleaning up canvas resources");

      // Clear loading timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }

      if (fabricCanvasRef.current) {
        fabricCanvasRef.current.dispose();
        fabricCanvasRef.current = null;
      }
      if (originalFabricCanvasRef.current) {
        originalFabricCanvasRef.current.dispose();
        originalFabricCanvasRef.current = null;
      }
    };

    const initializeCanvas = async () => {
      setLoading(true);
      console.log("🔄 Initializing canvas with image:", originalImage);

      // Clear any existing timeout
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      try {
        // Cleanup previous canvas
        cleanup();

        // Check if canvas ref exists
        if (!canvasRef.current) {
          console.error("❌ Canvas ref is null");
          setLoading(false);
          return;
        }

        // Initialize main canvas
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: showComparison ? 400 : 500,
          height: 400,
          backgroundColor: "#f5f5f5",
        });
        fabricCanvasRef.current = canvas;

        // Initialize comparison canvas if needed
        if (showComparison && originalCanvasRef.current) {
          const originalCanvas = new fabric.Canvas(originalCanvasRef.current, {
            width: 400,
            height: 400,
            backgroundColor: "#f5f5f5",
          });
          originalFabricCanvasRef.current = originalCanvas;
        }

        // Check if image URL is valid
        if (!originalImage || typeof originalImage !== "string") {
          console.error("❌ Invalid image URL:", originalImage);
          setLoading(false);
          return;
        }

        // Load image with error handling
        fabric.Image.fromURL(
          originalImage,
          (img) => {
            console.log("✅ Image loaded successfully:", img);

            if (!img || !img.width || !img.height) {
              console.error("❌ Invalid image object:", img);
              setLoading(false);
              return;
            }

            try {
              // Scale image to fit canvas
              const canvasWidth = showComparison ? 400 : 500;
              const canvasHeight = 400;

              const scale = Math.min(
                canvasWidth / img.width,
                canvasHeight / img.height
              );

              img.scale(scale);
              img.set({
                left: (canvasWidth - img.width * scale) / 2,
                top: (canvasHeight - img.height * scale) / 2,
                selectable: false,
                evented: false,
              });

              // Add to main canvas
              canvas.add(img);
              canvas.renderAll();

              // Add to comparison canvas
              if (showComparison && originalFabricCanvasRef.current) {
                fabric.Image.fromURL(
                  originalImage,
                  (originalImg) => {
                    try {
                      originalImg.scale(scale);
                      originalImg.set({
                        left: (400 - originalImg.width * scale) / 2,
                        top: (canvasHeight - originalImg.height * scale) / 2,
                        selectable: false,
                        evented: false,
                      });
                      originalFabricCanvasRef.current.add(originalImg);
                      originalFabricCanvasRef.current.renderAll();
                    } catch (error) {
                      console.error(
                        "❌ Error loading comparison image:",
                        error
                      );
                    }
                  },
                  {
                    crossOrigin: "anonymous",
                  }
                );
              }

              // Simulate facial detection
              setFacialPoints(mockFacialPoints);

              // Add guide points if in edit mode
              if (editorMode) {
                addGuidePoints(canvas, editorMode);
              }

              console.log("✅ Canvas initialization complete");

              // Clear timeout and set loading to false
              if (loadingTimeoutRef.current) {
                clearTimeout(loadingTimeoutRef.current);
              }
              setLoading(false);
            } catch (error) {
              console.error("❌ Error processing image:", error);
              setLoading(false);
            }
          },
          {
            crossOrigin: "anonymous",
            // Add error callback
            onError: (error) => {
              console.error("❌ Fabric.js image loading error:", error);
              setLoading(false);
            },
          }
        );

        // Add timeout fallback
        loadingTimeoutRef.current = setTimeout(() => {
          console.warn("⚠️ Image loading timeout, forcing loading to false");
          setLoading(false);
        }, 10000); // 10 second timeout
      } catch (error) {
        console.error("❌ Error initializing canvas:", error);
        setLoading(false);
      }
    };

    const addGuidePoints = (canvas, mode) => {
      if (!facialPoints) {
        console.warn("⚠️ No facial points available for guide points");
        return;
      }

      const points = mode === "nose" ? facialPoints.nose : facialPoints.lips;

      if (!points) {
        console.warn("⚠️ No points available for mode:", mode);
        return;
      }

      Object.entries(points).forEach(([key, point]) => {
        const circle = new fabric.Circle({
          left: point.x - 3,
          top: point.y - 3,
          radius: 3,
          fill: mode === "nose" ? "#ff6b6b" : "#4ecdc4",
          stroke: "#fff",
          strokeWidth: 1,
          selectable: false,
          evented: false,
          opacity: 0.8,
        });

        canvas.add(circle);
      });

      canvas.renderAll();
    };

    const applySimulationModification = (type, property, value) => {
      if (type === "nose") {
        applyNoseModifications();
      } else if (type === "lips") {
        applyLipsModifications();
      }
    };

    const applyNoseModifications = () => {
      if (!fabricCanvasRef.current || !facialPoints) return;

      const canvas = fabricCanvasRef.current;

      // Remove previous modification overlays
      const objects = canvas.getObjects();
      objects.forEach((obj) => {
        if (obj.customType === "noseModification") {
          canvas.remove(obj);
        }
      });

      // Apply nose modifications
      if (
        noseConfig.width !== 0 ||
        noseConfig.height !== 0 ||
        noseConfig.bridge !== 0 ||
        noseConfig.tip !== 0
      ) {
        const noseOverlay = createNoseOverlay(noseConfig);
        if (noseOverlay) {
          canvas.add(noseOverlay);
        }
      }

      canvas.renderAll();
    };

    const applyLipsModifications = () => {
      if (!fabricCanvasRef.current || !facialPoints) return;

      const canvas = fabricCanvasRef.current;

      // Remove previous modification overlays
      const objects = canvas.getObjects();
      objects.forEach((obj) => {
        if (obj.customType === "lipsModification") {
          canvas.remove(obj);
        }
      });

      // Apply lips modifications
      if (
        lipsConfig.volume !== 0 ||
        lipsConfig.width !== 0 ||
        lipsConfig.cupid !== 0 ||
        lipsConfig.definition !== 0
      ) {
        const lipsOverlay = createLipsOverlay(lipsConfig);
        if (lipsOverlay) {
          canvas.add(lipsOverlay);
        }
      }

      canvas.renderAll();
    };

    const createNoseOverlay = (config) => {
      const { nose } = facialPoints;
      const baseWidth = 30;
      const baseHeight = 50;

      // Calculate modifications
      const widthMod = config.width * 0.3;
      const heightMod = config.height * 0.3;
      const bridgeMod = config.bridge * 0.2;
      const tipMod = config.tip * 0.2;

      // Create nose shape path
      const path = `M ${nose.center.x - baseWidth / 2 - widthMod} ${
        nose.bridge.y + bridgeMod
      }
                  Q ${nose.center.x} ${nose.bridge.y - heightMod + bridgeMod} 
                    ${nose.center.x + baseWidth / 2 + widthMod} ${
        nose.bridge.y + bridgeMod
      }
                  L ${nose.rightWing.x + widthMod} ${nose.rightWing.y + tipMod}
                  Q ${nose.tip.x} ${nose.tip.y + heightMod + tipMod}
                    ${nose.leftWing.x - widthMod} ${nose.leftWing.y + tipMod}
                  Z`;

      const noseShape = new fabric.Path(path, {
        fill: "rgba(255, 182, 193, 0.3)",
        stroke: "rgba(255, 182, 193, 0.6)",
        strokeWidth: 2,
        selectable: false,
        evented: false,
        customType: "noseModification",
      });

      return noseShape;
    };

    const createLipsOverlay = (config) => {
      const { lips } = facialPoints;
      const baseWidth = 40;
      const baseHeight = 15;

      // Calculate modifications
      const volumeMod = config.volume * 0.2;
      const widthMod = config.width * 0.3;
      const cupidMod = config.cupid * 0.1;
      const definitionMod = config.definition * 0.1;

      // Create upper lip path
      const upperPath = `M ${lips.leftCorner.x - widthMod} ${lips.leftCorner.y}
                       Q ${lips.cupidBow.x - 10} ${
        lips.cupidBow.y - volumeMod - cupidMod
      }
                         ${lips.cupidBow.x} ${lips.cupidBow.y - cupidMod}
                       Q ${lips.cupidBow.x + 10} ${
        lips.cupidBow.y - volumeMod - cupidMod
      }
                         ${lips.rightCorner.x + widthMod} ${lips.rightCorner.y}
                       L ${lips.upperCenter.x + widthMod / 2} ${
        lips.upperCenter.y
      }
                       Q ${lips.upperCenter.x} ${
        lips.upperCenter.y + definitionMod
      }
                         ${lips.upperCenter.x - widthMod / 2} ${
        lips.upperCenter.y
      }
                       Z`;

      // Create lower lip path
      const lowerPath = `M ${lips.leftCorner.x - widthMod} ${lips.leftCorner.y}
                       L ${lips.lowerCenter.x - widthMod / 2} ${
        lips.lowerCenter.y
      }
                       Q ${lips.lowerCenter.x} ${
        lips.lowerCenter.y + volumeMod + definitionMod
      }
                         ${lips.lowerCenter.x + widthMod / 2} ${
        lips.lowerCenter.y
      }
                       L ${lips.rightCorner.x + widthMod} ${lips.rightCorner.y}
                       Q ${lips.lowerCenter.x} ${
        lips.lowerCenter.y - volumeMod / 2
      }
                         ${lips.leftCorner.x - widthMod} ${lips.leftCorner.y}
                       Z`;

      const upperLip = new fabric.Path(upperPath, {
        fill: "rgba(255, 182, 193, 0.4)",
        stroke: "rgba(255, 182, 193, 0.7)",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        customType: "lipsModification",
      });

      const lowerLip = new fabric.Path(lowerPath, {
        fill: "rgba(255, 182, 193, 0.4)",
        stroke: "rgba(255, 182, 193, 0.7)",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        customType: "lipsModification",
      });

      // Group both lips
      const lipsGroup = new fabric.Group([upperLip, lowerLip], {
        selectable: false,
        evented: false,
        customType: "lipsModification",
      });

      return lipsGroup;
    };

    const downloadCanvasImage = () => {
      if (!fabricCanvasRef.current) return;

      const dataURL = fabricCanvasRef.current.toDataURL({
        format: "png",
        quality: 1.0,
      });

      const link = document.createElement("a");
      link.download = `simulacion-${Date.now()}.png`;
      link.href = dataURL;
      link.click();
    };

    const resetCanvas = () => {
      if (fabricCanvasRef.current) {
        const objects = fabricCanvasRef.current.getObjects();
        objects.forEach((obj) => {
          if (
            obj.customType === "noseModification" ||
            obj.customType === "lipsModification"
          ) {
            fabricCanvasRef.current.remove(obj);
          }
        });
        fabricCanvasRef.current.renderAll();
      }
    };

    return (
      <Box sx={{ height: "100%", display: "flex", gap: 2 }}>
        {loading && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Procesando imagen...</Typography>
          </Box>
        )}

        {/* Canvas principal */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" gutterBottom>
            {showComparison ? "Después" : "Simulación"}
          </Typography>
          <canvas
            ref={canvasRef}
            style={{
              border: "2px solid #e0e0e0",
              borderRadius: 8,
              backgroundColor: "#f5f5f5",
            }}
          />
        </Box>

        {/* Canvas de comparación */}
        {showComparison && (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" gutterBottom>
              Antes
            </Typography>
            <canvas
              ref={originalCanvasRef}
              style={{
                border: "2px solid #e0e0e0",
                borderRadius: 8,
                backgroundColor: "#f5f5f5",
              }}
            />
          </Box>
        )}
      </Box>
    );
  }
);

SimulationCanvas.displayName = "SimulationCanvas";

export default SimulationCanvas;
