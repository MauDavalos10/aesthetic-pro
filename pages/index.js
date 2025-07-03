import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
} from "@mui/material";
import {
  Face,
  PhotoCamera,
  Palette,
  AutoAwesome,
  Google,
  CheckCircle,
} from "@mui/icons-material";
import { signInWithGoogle } from "../lib/supabase";

export default function LandingPage() {
  const user = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        console.error("Error de autenticación:", error);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <Face color="primary" sx={{ fontSize: 40 }} />,
      title: "Detección Facial Automática",
      description:
        "IA avanzada detecta automáticamente nariz y labios para simulaciones precisas",
    },
    {
      icon: <Palette color="primary" sx={{ fontSize: 40 }} />,
      title: "Editor Intuitivo",
      description:
        "Herramientas fáciles de usar para modificar y ajustar características faciales",
    },
    {
      icon: <PhotoCamera color="primary" sx={{ fontSize: 40 }} />,
      title: "Comparación Antes/Después",
      description:
        "Visualiza los resultados lado a lado para mostrar a tus pacientes",
    },
    {
      icon: <AutoAwesome color="primary" sx={{ fontSize: 40 }} />,
      title: "Simulaciones Realistas",
      description:
        "Tecnología de última generación para resultados naturales y convincentes",
    },
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "$0",
      simulations: "5 simulaciones/mes",
      features: ["Simulaciones básicas", "Soporte por email"],
      popular: false,
    },
    {
      name: "Básico",
      price: "$29",
      simulations: "50 simulaciones/mes",
      features: [
        "Simulaciones ilimitadas",
        "Soporte prioritario",
        "Exportación HD",
      ],
      popular: true,
    },
    {
      name: "Pro",
      price: "$99",
      simulations: "Simulaciones ilimitadas",
      features: [
        "Todo en Básico",
        "Branding personalizado",
        "API access",
        "Analytics avanzados",
      ],
      popular: false,
    },
  ];

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 8, pb: 6 }}>
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" }, mb: 2 }}
          >
            Simula Resultados Estéticos con
            <Box
              component="span"
              sx={{ color: "primary.main", display: "block" }}
            >
              Inteligencia Artificial
            </Box>
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 4, maxWidth: "600px", mx: "auto" }}
          >
            Transforma tu consulta estética con simulaciones realistas de nariz
            y labios. Muestra a tus pacientes los resultados antes del
            procedimiento.
          </Typography>

          <Button
            variant="contained"
            size="large"
            startIcon={<Google />}
            onClick={handleGoogleSignIn}
            disabled={loading}
            sx={{
              py: 1.5,
              px: 4,
              fontSize: "1.1rem",
              background: "linear-gradient(45deg, #6366f1 30%, #8b5cf6 90%)",
              "&:hover": {
                background: "linear-gradient(45deg, #5855eb 30%, #7c3aed 90%)",
              },
            }}
          >
            {loading ? "Iniciando sesión..." : "Comenzar con Google"}
          </Button>
        </Box>

        {/* Features */}
        <Grid container spacing={4} sx={{ mt: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <Card sx={{ height: "100%", p: 2 }}>
                <CardContent>
                  <Box textAlign="center" mb={2}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" textAlign="center" mb={1}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary" textAlign="center">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box sx={{ bgcolor: "background.paper", py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" textAlign="center" mb={6}>
            Planes para tu Clínica
          </Typography>

          <Grid container spacing={4} justifyContent="center">
            {plans.map((plan, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    position: "relative",
                    border: plan.popular ? 2 : 0,
                    borderColor: "primary.main",
                    transform: plan.popular ? "scale(1.05)" : "none",
                  }}
                >
                  {plan.popular && (
                    <Chip
                      label="Más Popular"
                      color="primary"
                      sx={{
                        position: "absolute",
                        top: -10,
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  )}
                  <CardContent sx={{ p: 4, textAlign: "center" }}>
                    <Typography variant="h5" mb={1}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h3" color="primary.main" mb={1}>
                      {plan.price}
                      <Typography component="span" variant="body2">
                        /mes
                      </Typography>
                    </Typography>
                    <Typography color="text.secondary" mb={3}>
                      {plan.simulations}
                    </Typography>

                    <Stack spacing={1} mb={4}>
                      {plan.features.map((feature, i) => (
                        <Box
                          key={i}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <CheckCircle
                            color="primary"
                            sx={{ mr: 1, fontSize: 20 }}
                          />
                          <Typography variant="body2">{feature}</Typography>
                        </Box>
                      ))}
                    </Stack>

                    <Button
                      variant={plan.popular ? "contained" : "outlined"}
                      fullWidth
                      size="large"
                    >
                      Elegir Plan
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Typography textAlign="center" color="text.secondary">
            © 2024 AestheticPro. Transforma tu consulta estética.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
