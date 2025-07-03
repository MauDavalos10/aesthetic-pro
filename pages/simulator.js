import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  Paper,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import {
  CloudUpload,
  Face,
  Face as LipsIcon,
  Undo,
  Redo,
  Save,
  Download,
  Compare,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import { useStore } from "../store/useStore";
import SimulationCanvas from "../components/SimulationCanvas";

export default function Simulator() {
  const router = useRouter();
  const user = useUser();
  const canvasRef = useRef(null);

  const {
    originalImage,
    modifiedImage,
    editorMode,
    setOriginalImage,
    setModifiedImage,
    setEditorMode,
    userPlan,
    simulationsCount,
    incrementSimulationsCount,
  } = useStore();

  const [loading, setLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [showComparison, setShowComparison] = useState(false);

  // Configuraciones de simulación
  const [noseConfig, setNoseConfig] = useState({
    width: 0,
    height: 0,
    bridge: 0,
    tip: 0,
  });

  const [lipsConfig, setLipsConfig] = useState({
    volume: 0,
    width: 0,
    cupid: 0,
    definition: 0,
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // Verificar límites del plan
  const canCreateSimulation = () => {
    const limits = { FREE: 5, BASIC: 50, PRO: 999 };
    return simulationsCount < limits[userPlan];
  };

  const onDrop = async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (!canCreateSimulation()) {
      alert("Has alcanzado el límite de simulaciones de tu plan");
      return;
    }

    setLoading(true);
    try {
      // Crear URL local para preview
      const imageUrl = URL.createObjectURL(file);
      setOriginalImage(imageUrl);

      // Aquí iría la lógica para subir a Cloudinary
      // const uploadResponse = await uploadToCloudinary(file)
      // setOriginalImage(uploadResponse.secure_url)
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setEditorMode(newMode);
    }
  };

  const handleConfigChange = (type, property, value) => {
    if (type === "nose") {
      setNoseConfig((prev) => ({ ...prev, [property]: value }));
    } else {
      setLipsConfig((prev) => ({ ...prev, [property]: value }));
    }

    // Aplicar cambios al canvas
    if (canvasRef.current) {
      canvasRef.current.applyModification(type, property, value);
    }
  };

  const handleSave = async () => {
    if (!patientName.trim()) {
      alert("Por favor ingresa el nombre del paciente");
      return;
    }

    setLoading(true);
    try {
      // Obtener imagen modificada del canvas
      const modifiedImageData = canvasRef.current?.getModifiedImage();

      // Aquí iría la lógica para guardar en Supabase
      // const result = await saveSimulation({
      //   patientName,
      //   originalImage,
      //   modifiedImage: modifiedImageData,
      //   noseConfig,
      //   lipsConfig,
      //   userId: user.id
      // })

      incrementSimulationsCount();
      setSaveDialogOpen(false);
      setPatientName("");

      alert("Simulación guardada exitosamente!");
    } catch (error) {
      console.error("Error saving simulation:", error);
      alert("Error al guardar la simulación");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      canvasRef.current.downloadImage();
    }
  };

  const resetSimulation = () => {
    setNoseConfig({ width: 0, height: 0, bridge: 0, tip: 0 });
    setLipsConfig({ volume: 0, width: 0, cupid: 0, definition: 0 });
    if (canvasRef.current) {
      canvasRef.current.reset();
    }
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Simulador de Procedimientos Estéticos
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Carga una imagen y simula cambios en nariz y labios con herramientas
          profesionales
        </Typography>

        {!canCreateSimulation() && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            Has alcanzado el límite de simulaciones de tu plan {userPlan}.
            <Button size="small" sx={{ ml: 1 }}>
              Actualizar Plan
            </Button>
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Panel de Carga y Controles */}
          <Grid item xs={12} md={4}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Cargar Imagen
                </Typography>

                {!originalImage ? (
                  <Paper
                    {...getRootProps()}
                    sx={{
                      p: 4,
                      textAlign: "center",
                      border: "2px dashed",
                      borderColor: isDragActive ? "primary.main" : "grey.300",
                      bgcolor: isDragActive
                        ? "primary.light"
                        : "background.paper",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "primary.light",
                      },
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUpload
                      sx={{ fontSize: 48, color: "primary.main", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Arrastra una imagen aquí
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      o haz clic para seleccionar
                    </Typography>
                    <Typography
                      variant="caption"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      JPG, PNG (máx. 10MB)
                    </Typography>
                  </Paper>
                ) : (
                  <Box textAlign="center">
                    <img
                      src={originalImage}
                      alt="Original"
                      style={{
                        width: "100%",
                        maxHeight: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                      }}
                    />
                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => setOriginalImage(null)}
                      sx={{ mt: 2 }}
                    >
                      Cargar Nueva Imagen
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Selector de Modo */}
            {originalImage && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Área de Edición
                  </Typography>
                  <ToggleButtonGroup
                    value={editorMode}
                    exclusive
                    onChange={handleModeChange}
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    <ToggleButton value="nose">
                      <Face sx={{ mr: 1 }} />
                      Nariz
                    </ToggleButton>
                    <ToggleButton value="lips">
                      <LipsIcon sx={{ mr: 1 }} />
                      Labios
                    </ToggleButton>
                  </ToggleButtonGroup>
                </CardContent>
              </Card>
            )}

            {/* Controles de Nariz */}
            {originalImage && editorMode === "nose" && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ajustes de Nariz
                  </Typography>

                  <Box mb={3}>
                    <Typography gutterBottom>Ancho</Typography>
                    <Slider
                      value={noseConfig.width}
                      onChange={(e, value) =>
                        handleConfigChange("nose", "width", value)
                      }
                      valueLabelDisplay="auto"
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography gutterBottom>Altura</Typography>
                    <Slider
                      value={noseConfig.height}
                      onChange={(e, value) =>
                        handleConfigChange("nose", "height", value)
                      }
                      valueLabelDisplay="auto"
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography gutterBottom>Puente</Typography>
                    <Slider
                      value={noseConfig.bridge}
                      onChange={(e, value) =>
                        handleConfigChange("nose", "bridge", value)
                      }
                      valueLabelDisplay="auto"
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography gutterBottom>Punta</Typography>
                    <Slider
                      value={noseConfig.tip}
                      onChange={(e, value) =>
                        handleConfigChange("nose", "tip", value)
                      }
                      valueLabelDisplay="auto"
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Controles de Labios */}
            {originalImage && editorMode === "lips" && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Ajustes de Labios
                  </Typography>

                  <Box mb={3}>
                    <Typography gutterBottom>Volumen</Typography>
                    <Slider
                      value={lipsConfig.volume}
                      onChange={(e, value) =>
                        handleConfigChange("lips", "volume", value)
                      }
                      valueLabelDisplay="auto"
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography gutterBottom>Ancho</Typography>
                    <Slider
                      value={lipsConfig.width}
                      onChange={(e, value) =>
                        handleConfigChange("lips", "width", value)
                      }
                      valueLabelDisplay="auto"
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography gutterBottom>Arco de Cupido</Typography>
                    <Slider
                      value={lipsConfig.cupid}
                      onChange={(e, value) =>
                        handleConfigChange("lips", "cupid", value)
                      }
                      valueLabelDisplay="auto"
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </Box>

                  <Box mb={3}>
                    <Typography gutterBottom>Definición</Typography>
                    <Slider
                      value={lipsConfig.definition}
                      onChange={(e, value) =>
                        handleConfigChange("lips", "definition", value)
                      }
                      valueLabelDisplay="auto"
                      min={-50}
                      max={50}
                      step={1}
                    />
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Acciones */}
            {originalImage && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Acciones
                  </Typography>

                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Undo />}
                        onClick={resetSimulation}
                      >
                        Reset
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<Compare />}
                        onClick={() => setShowComparison(!showComparison)}
                      >
                        {showComparison ? "Ocultar" : "Comparar"}
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Save />}
                        onClick={() => setSaveDialogOpen(true)}
                        disabled={loading}
                      >
                        Guardar
                      </Button>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        startIcon={<Download />}
                        onClick={handleDownload}
                      >
                        Descargar
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Canvas de Simulación */}
          <Grid item xs={12} md={8}>
            <Card sx={{ height: "80vh" }}>
              <CardContent sx={{ height: "100%" }}>
                {originalImage ? (
                  <SimulationCanvas
                    ref={canvasRef}
                    originalImage={originalImage}
                    editorMode={editorMode}
                    showComparison={showComparison}
                    noseConfig={noseConfig}
                    lipsConfig={lipsConfig}
                  />
                ) : (
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    sx={{ bgcolor: "grey.50", borderRadius: 1 }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Carga una imagen para comenzar la simulación
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Dialog para guardar */}
        <Dialog open={saveDialogOpen} onClose={() => setSaveDialogOpen(false)}>
          <DialogTitle>Guardar Simulación</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre del Paciente"
              fullWidth
              variant="outlined"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSaveDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={loading || !patientName.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : <Save />}
            >
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
