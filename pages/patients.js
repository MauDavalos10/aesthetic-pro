import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add,
  Person,
  PhotoCamera,
  MoreVert,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import { useStore } from "../store/useStore";

export default function Patients() {
  const router = useRouter();
  const user = useUser();
  const { patients, addPatient } = useStore();

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Datos de pacientes simulados
  const mockPatients = [
    {
      id: 1,
      name: "María González",
      age: 28,
      totalSimulations: 3,
      lastVisit: "2024-01-15",
      procedures: ["Nariz", "Labios"],
      avatar: null,
    },
    {
      id: 2,
      name: "Carlos Ruiz",
      age: 35,
      totalSimulations: 1,
      lastVisit: "2024-01-14",
      procedures: ["Labios"],
      avatar: null,
    },
    {
      id: 3,
      name: "Ana Martínez",
      age: 42,
      totalSimulations: 5,
      lastVisit: "2024-01-13",
      procedures: ["Nariz"],
      avatar: null,
    },
    {
      id: 4,
      name: "Diego López",
      age: 29,
      totalSimulations: 2,
      lastVisit: "2024-01-12",
      procedures: ["Nariz", "Labios"],
      avatar: null,
    },
  ];

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const handleMenuOpen = (event, patient) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatient(patient);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatient(null);
  };

  const handleAddPatient = async () => {
    if (!newPatientName.trim()) {
      alert("Por favor ingresa el nombre del paciente");
      return;
    }

    try {
      const newPatient = {
        id: Date.now(),
        name: newPatientName.trim(),
        age: null,
        totalSimulations: 0,
        lastVisit: new Date().toISOString().split("T")[0],
        procedures: [],
        avatar: null,
      };

      addPatient(newPatient);
      setNewPatientName("");
      setAddDialogOpen(false);

      alert("Paciente agregado exitosamente!");
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Error al agregar paciente");
    }
  };

  const handleViewPatient = (patient) => {
    router.push(`/patients/${patient.id}`);
    handleMenuClose();
  };

  const handleEditPatient = (patient) => {
    // Aquí implementarías la edición
    console.log("Edit patient:", patient);
    handleMenuClose();
  };

  const handleDeletePatient = (patient) => {
    if (confirm(`¿Estás seguro de eliminar al paciente ${patient.name}?`)) {
      // Aquí implementarías la eliminación
      console.log("Delete patient:", patient);
    }
    handleMenuClose();
  };

  const handleStartSimulation = (patient) => {
    // Redirigir al simulador con datos del paciente
    router.push(`/simulator?patient=${patient.id}`);
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              Gestión de Pacientes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Administra tu base de datos de pacientes y sus simulaciones
            </Typography>
          </Box>

          <Fab
            color="primary"
            aria-label="add patient"
            onClick={() => setAddDialogOpen(true)}
          >
            <Add />
          </Fab>
        </Box>

        {/* Lista de Pacientes */}
        <Grid container spacing={3}>
          {mockPatients.map((patient) => (
            <Grid item xs={12} sm={6} md={4} key={patient.id}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      {patient.avatar ? (
                        <img src={patient.avatar} alt={patient.name} />
                      ) : (
                        <Person />
                      )}
                    </Avatar>
                    <Box flexGrow={1}>
                      <Typography variant="h6">{patient.name}</Typography>
                      {patient.age && (
                        <Typography variant="body2" color="text.secondary">
                          {patient.age} años
                        </Typography>
                      )}
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuOpen(e, patient)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>

                  <Box mb={2}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Simulaciones:</strong> {patient.totalSimulations}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Última visita:</strong> {patient.lastVisit}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="body2" gutterBottom>
                      <strong>Procedimientos:</strong>
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      {patient.procedures.length > 0 ? (
                        patient.procedures.map((procedure, index) => (
                          <Chip
                            key={index}
                            label={procedure}
                            size="small"
                            variant="outlined"
                            color={
                              procedure === "Nariz" ? "primary" : "secondary"
                            }
                          />
                        ))
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Sin procedimientos
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<PhotoCamera />}
                    onClick={() => handleStartSimulation(patient)}
                    fullWidth
                  >
                    Nueva Simulación
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Empty State */}
        {mockPatients.length === 0 && (
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="400px"
            textAlign="center"
          >
            <Person sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              No tienes pacientes registrados
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Agrega tu primer paciente para comenzar a crear simulaciones
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setAddDialogOpen(true)}
            >
              Agregar Primer Paciente
            </Button>
          </Box>
        )}

        {/* Menu contextual */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={() => handleViewPatient(selectedPatient)}>
            <Visibility sx={{ mr: 1 }} />
            Ver Detalles
          </MenuItem>
          <MenuItem onClick={() => handleEditPatient(selectedPatient)}>
            <Edit sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem
            onClick={() => handleDeletePatient(selectedPatient)}
            sx={{ color: "error.main" }}
          >
            <Delete sx={{ mr: 1 }} />
            Eliminar
          </MenuItem>
        </Menu>

        {/* Dialog para agregar paciente */}
        <Dialog
          open={addDialogOpen}
          onClose={() => setAddDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre Completo"
              fullWidth
              variant="outlined"
              value={newPatientName}
              onChange={(e) => setNewPatientName(e.target.value)}
              sx={{ mt: 2 }}
            />

            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Nota: Podrás agregar más información como edad y notas después de
              crear el paciente.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setAddDialogOpen(false)}>Cancelar</Button>
            <Button
              onClick={handleAddPatient}
              variant="contained"
              disabled={!newPatientName.trim()}
            >
              Agregar Paciente
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}
