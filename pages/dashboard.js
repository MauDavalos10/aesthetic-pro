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
  Avatar,
  Chip,
  LinearProgress,
  Stack,
  Alert,
} from "@mui/material";
import {
  PhotoCamera,
  People,
  Timeline,
  TrendingUp,
  Add,
  Face,
} from "@mui/icons-material";
import Layout from "../components/Layout";
import { useStore } from "../store/useStore";

export default function Dashboard() {
  const router = useRouter();
  const user = useUser();
  const { userPlan, simulationsCount } = useStore();

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) {
    return <div>Cargando...</div>;
  }

  // Datos simulados para el dashboard
  const dashboardData = {
    totalSimulations: simulationsCount,
    totalPatients: 12,
    thisMonth: 8,
    planLimits: {
      FREE: 5,
      BASIC: 50,
      PRO: 999,
    },
  };

  const planLimit = dashboardData.planLimits[userPlan];
  const usagePercentage =
    planLimit === 999 ? 0 : (simulationsCount / planLimit) * 100;

  const quickActions = [
    {
      title: "Nueva Simulación",
      description: "Inicia una nueva simulación de nariz o labios",
      icon: <PhotoCamera />,
      color: "primary",
      action: () => router.push("/simulator"),
    },
    {
      title: "Gestionar Pacientes",
      description: "Ver y organizar tus pacientes",
      icon: <People />,
      color: "secondary",
      action: () => router.push("/patients"),
    },
    {
      title: "Ver Simulaciones",
      description: "Revisa tus simulaciones anteriores",
      icon: <Timeline />,
      color: "success",
      action: () => router.push("/simulations"),
    },
  ];

  const recentActivity = [
    {
      type: "simulation",
      patient: "María González",
      procedure: "Nariz",
      date: "2024-01-15",
    },
    {
      type: "simulation",
      patient: "Carlos Ruiz",
      procedure: "Labios",
      date: "2024-01-14",
    },
    {
      type: "patient",
      patient: "Ana Martínez",
      procedure: "Nuevo paciente",
      date: "2024-01-13",
    },
  ];

  return (
    <Layout>
      <Box>
        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" gutterBottom>
            ¡Bienvenido de nuevo! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Aquí tienes un resumen de tu actividad y accesos rápidos
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                    <PhotoCamera />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {dashboardData.totalSimulations}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Simulaciones Totales
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: "secondary.main", mr: 2 }}>
                    <People />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {dashboardData.totalPatients}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pacientes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: "success.main", mr: 2 }}>
                    <TrendingUp />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {dashboardData.thisMonth}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Este Mes
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Avatar sx={{ bgcolor: "warning.main", mr: 2 }}>
                    <Face />
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{userPlan}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Plan Actual
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Usage Progress */}
        {userPlan !== "PRO" && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Uso del Plan {userPlan}
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Box flexGrow={1} mr={2}>
                  <LinearProgress
                    variant="determinate"
                    value={usagePercentage}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {simulationsCount} / {planLimit}
                </Typography>
              </Box>
              {usagePercentage > 80 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Te estás acercando al límite de tu plan.
                  <Button size="small" sx={{ ml: 1 }}>
                    Actualizar Plan
                  </Button>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        <Grid container spacing={3}>
          {/* Quick Actions */}
          <Grid item xs={12} md={8}>
            <Typography variant="h6" gutterBottom>
              Acciones Rápidas
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ height: "100%" }}>
                    <CardContent>
                      <Box display="flex" alignItems="center" mb={2}>
                        <Avatar sx={{ bgcolor: `${action.color}.main`, mr: 2 }}>
                          {action.icon}
                        </Avatar>
                        <Typography variant="h6">{action.title}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" mb={2}>
                        {action.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        variant="contained"
                        color={action.color}
                        onClick={action.action}
                        startIcon={<Add />}
                      >
                        Iniciar
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Actividad Reciente
            </Typography>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  {recentActivity.map((activity, index) => (
                    <Box key={index}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="start"
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {activity.patient}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {activity.procedure}
                          </Typography>
                        </Box>
                        <Chip
                          label={activity.date}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      {index < recentActivity.length - 1 && (
                        <Box
                          sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            mt: 1,
                          }}
                        />
                      )}
                    </Box>
                  ))}
                </Stack>
              </CardContent>
              <CardActions>
                <Button size="small">Ver Todo</Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}
