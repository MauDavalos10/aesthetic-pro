import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import {
  Person,
  Email,
  Business,
  Upgrade,
  Check,
  Star,
  Edit,
  Save,
  Cancel,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import { useStore } from "../store/useStore";

export default function Settings() {
  const router = useRouter();
  const user = useUser();
  const { userPlan, simulationsCount, setUserPlan } = useStore();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    clinicName: "",
    notifications: true,
    emailReports: false,
  });

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Cargar datos del usuario
    setFormData({
      fullName: user.user_metadata?.full_name || "",
      email: user.email || "",
      clinicName: user.user_metadata?.clinic_name || "",
      notifications: true,
      emailReports: false,
    });
  }, [user, router]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // Aquí iría la lógica para actualizar el perfil en Supabase
      // const { error } = await supabase.auth.updateUser({
      //   data: {
      //     full_name: formData.fullName,
      //     clinic_name: formData.clinicName
      //   }
      // })

      setEditing(false);
      alert("Perfil actualizado correctamente");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = (newPlan) => {
    // En un caso real, esto abriría Stripe Checkout
    alert(`Redirigiendo a checkout para el plan ${newPlan}...`);
    // setUserPlan(newPlan)
  };

  const plans = [
    {
      name: "Gratuito",
      price: "$0",
      period: "/mes",
      simulations: "5 simulaciones",
      features: [
        "Simulaciones básicas",
        "Gestión de pacientes",
        "Soporte por email",
        "Exportación estándar",
      ],
      current: userPlan === "FREE",
      recommended: false,
      color: "default",
    },
    {
      name: "Básico",
      price: "$29",
      period: "/mes",
      simulations: "50 simulaciones",
      features: [
        "Todo en Gratuito",
        "Soporte prioritario",
        "Exportación HD",
        "Comparaciones avanzadas",
        "Sin marca de agua",
      ],
      current: userPlan === "BASIC",
      recommended: true,
      color: "primary",
    },
    {
      name: "Pro",
      price: "$99",
      period: "/mes",
      simulations: "Simulaciones ilimitadas",
      features: [
        "Todo en Básico",
        "Branding personalizado",
        "API access",
        "Analytics avanzados",
        "Soporte telefónico",
        "Integración CRM",
      ],
      current: userPlan === "PRO",
      recommended: false,
      color: "secondary",
    },
  ];

  const currentPlan = plans.find((plan) => plan.current);
  const planLimits = { FREE: 5, BASIC: 50, PRO: 999 };
  const usagePercentage =
    userPlan === "PRO" ? 0 : (simulationsCount / planLimits[userPlan]) * 100;

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <Layout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Configuración
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={4}>
          Gestiona tu perfil, plan de suscripción y preferencias
        </Typography>

        <Grid container spacing={4}>
          {/* Perfil del Usuario */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={3}>
                  <Typography variant="h6" flexGrow={1}>
                    Información del Perfil
                  </Typography>
                  {!editing && (
                    <IconButton onClick={() => setEditing(true)}>
                      <Edit />
                    </IconButton>
                  )}
                </Box>

                <Grid container spacing={3}>
                  <Grid
                    item
                    xs={12}
                    sm={4}
                    display="flex"
                    justifyContent="center"
                  >
                    <Avatar
                      src={user.user_metadata?.avatar_url}
                      sx={{ width: 120, height: 120 }}
                    >
                      <Person sx={{ fontSize: 60 }} />
                    </Avatar>
                  </Grid>

                  <Grid item xs={12} sm={8}>
                    <Stack spacing={3}>
                      <TextField
                        label="Nombre Completo"
                        value={formData.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        disabled={!editing}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <Person sx={{ mr: 1, color: "text.secondary" }} />
                          ),
                        }}
                      />

                      <TextField
                        label="Email"
                        value={formData.email}
                        disabled={true}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <Email sx={{ mr: 1, color: "text.secondary" }} />
                          ),
                        }}
                        helperText="El email no se puede modificar"
                      />

                      <TextField
                        label="Nombre de la Clínica"
                        value={formData.clinicName}
                        onChange={(e) =>
                          handleInputChange("clinicName", e.target.value)
                        }
                        disabled={!editing}
                        fullWidth
                        InputProps={{
                          startAdornment: (
                            <Business sx={{ mr: 1, color: "text.secondary" }} />
                          ),
                        }}
                      />
                    </Stack>
                  </Grid>
                </Grid>

                {editing && (
                  <Box mt={3} display="flex" gap={2}>
                    <Button
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSaveProfile}
                      disabled={loading}
                    >
                      Guardar Cambios
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Cancel />}
                      onClick={() => setEditing(false)}
                    >
                      Cancelar
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>

            {/* Preferencias */}
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Preferencias
                </Typography>

                <Stack spacing={2}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.notifications}
                        onChange={(e) =>
                          handleInputChange("notifications", e.target.checked)
                        }
                      />
                    }
                    label="Notificaciones en la aplicación"
                  />

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.emailReports}
                        onChange={(e) =>
                          handleInputChange("emailReports", e.target.checked)
                        }
                      />
                    }
                    label="Reportes por email"
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Plan Actual */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Plan Actual
                </Typography>

                <Box textAlign="center" mb={2}>
                  <Chip
                    label={currentPlan?.name}
                    color={currentPlan?.color}
                    size="medium"
                    sx={{ mb: 2 }}
                  />
                  <Typography variant="h4" color="primary.main">
                    {currentPlan?.price}
                    <Typography component="span" variant="body2">
                      {currentPlan?.period}
                    </Typography>
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  mb={3}
                >
                  {currentPlan?.simulations}
                </Typography>

                {userPlan !== "PRO" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Has usado {simulationsCount} de {planLimits[userPlan]}{" "}
                    simulaciones este mes ({Math.round(usagePercentage)}%)
                  </Alert>
                )}

                <Stack spacing={1} mb={3}>
                  {currentPlan?.features.map((feature, index) => (
                    <Box key={index} display="flex" alignItems="center">
                      <Check color="success" sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">{feature}</Typography>
                    </Box>
                  ))}
                </Stack>

                {userPlan !== "PRO" && (
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Upgrade />}
                    onClick={() => router.push("#plans")}
                  >
                    Actualizar Plan
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Planes de Suscripción */}
        <Box id="plans" mt={6}>
          <Typography variant="h5" gutterBottom textAlign="center">
            Planes de Suscripción
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            textAlign="center"
            mb={4}
          >
            Elige el plan que mejor se adapte a las necesidades de tu clínica
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    position: "relative",
                    border: plan.current ? 2 : 0,
                    borderColor: plan.current ? "primary.main" : "transparent",
                    transform: plan.recommended ? "scale(1.05)" : "none",
                  }}
                >
                  {plan.recommended && (
                    <Chip
                      label="Recomendado"
                      color="primary"
                      icon={<Star />}
                      sx={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  )}

                  {plan.current && (
                    <Chip
                      label="Plan Actual"
                      color="success"
                      sx={{
                        position: "absolute",
                        top: plan.recommended ? 20 : -10,
                        right: -10,
                      }}
                    />
                  )}

                  <CardContent
                    sx={{ textAlign: "center", pt: plan.recommended ? 4 : 2 }}
                  >
                    <Typography variant="h6" gutterBottom>
                      {plan.name}
                    </Typography>

                    <Typography variant="h3" color="primary.main" gutterBottom>
                      {plan.price}
                      <Typography component="span" variant="body2">
                        {plan.period}
                      </Typography>
                    </Typography>

                    <Typography color="text.secondary" mb={3}>
                      {plan.simulations}
                    </Typography>

                    <Divider sx={{ mb: 2 }} />

                    <Stack spacing={1} mb={3}>
                      {plan.features.map((feature, i) => (
                        <Box key={i} display="flex" alignItems="center">
                          <Check color="success" sx={{ mr: 1, fontSize: 16 }} />
                          <Typography variant="body2" textAlign="left">
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>

                  <CardActions sx={{ p: 2 }}>
                    <Button
                      fullWidth
                      variant={plan.current ? "outlined" : "contained"}
                      color={plan.color}
                      disabled={plan.current}
                      onClick={() =>
                        !plan.current &&
                        handleUpgradePlan(plan.name.toUpperCase())
                      }
                    >
                      {plan.current ? "Plan Actual" : `Cambiar a ${plan.name}`}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}
