'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import Head from 'next/head';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, useMediaQuery, useTheme, IconButton } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Fade, Slide } from '@mui/material';
import { useEffect, useState } from 'react';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DevicesIcon from '@mui/icons-material/Devices';

export default function Home() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  const handleSubmit = async (plan) => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'origin': 'http://localhost:3000',
      },
      body: JSON.stringify({ plan }),
    });

    const checkoutSessionJson = await checkoutSession.json();

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  }

  const customTheme = createTheme({
    palette: {
      primary: {
        main: '#6C63FF',
      },
      secondary: {
        main: '#FF6584',
      },
    },
    typography: {
      fontFamily: 'Inter, sans-serif',
    },
  });

  return (
    <ThemeProvider theme={customTheme}>
      <Head>
        <title>FlashCard</title>
        <meta name="description" content="Create flashcards from your text" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </Head>

      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <IconButton edge="start" color="primary" aria-label="logo" href="/">
            <FlashOnIcon fontSize="large" />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#333' }}>
            FlashCards
          </Typography>
          <SignedOut>
            <Button color="primary" variant="contained" href="/sign-in" sx={{ marginRight: 2 }}>Login</Button>
            <Button color="primary" variant="contained" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Slide direction="up" in={checked} mountOnEnter unmountOnExit>
              <Box>
                <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
                  Welcome to FlashCards
                </Typography>
                <Typography variant="h5" color="textSecondary" paragraph>
                  The easiest way to create flashcards from your text. Enhance your learning experience effortlessly.
                </Typography>
                <Button variant="contained" color="primary" size="large" href="/generate" sx={{ mt: 2, transition: 'all 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                  Get Started
                </Button>
              </Box>
            </Slide>
          </Grid>
          <Grid item xs={12} md={6}>
            <Fade in={checked} timeout={1000}>
              <Box sx={{ textAlign: 'center' }}>
                <Image src="/flashcard-illustration.png" alt="Flashcards Illustration" width={isMobile ? 300 : 500} height={isMobile ? 300 : 500} />
              </Box>
            </Fade>
          </Grid>
        </Grid>

        <Box sx={{ my: 10 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Features
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <TextFieldsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>Easy Text Input</Typography>
                <Typography color="textSecondary">
                  Simply type or paste your text and let our software do the rest. Creating flashcards has never been easier.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <AutoAwesomeIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>Smart Flashcards</Typography>
                <Typography color="textSecondary">
                  Our AI intelligently breaks down your text into concise flashcards. Perfect for efficient studying.
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center', p: 3 }}>
                <DevicesIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
                <Typography color="textSecondary">
                  Access your flashcards from any device, at any time. Study on the go with ease and flexibility.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ my: 10 }}>
          <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 700 }}>
            Pricing
          </Typography>
          <Grid container spacing={4} sx={{ mt: 4 }} justifyContent="center">
            <Grid item xs={12} md={4}>
              <Fade in={checked} timeout={1500}>
                <Box sx={{
                  p: 4,
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'scale(1.05)',
                  },
                }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Basic</Typography>
                  <Typography variant="h6" gutterBottom>$5 / month</Typography>
                  <Typography color="textSecondary" paragraph>
                    Access to basic flashcard features and limited storage.
                  </Typography>
                  <Button variant="outlined" color="primary" size="large" sx={{ mt: 2 }} onClick={() => handleSubmit('basic')}>Choose Basic</Button>
                </Box>
              </Fade>
            </Grid>
            <Grid item xs={12} md={4}>
              <Fade in={checked} timeout={2000}>
                <Box sx={{
                  p: 4,
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  textAlign: 'center',
                  backgroundColor: 'primary.light',
                  transition: 'all 0.3s',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'scale(1.05)',
                  },
                }}>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>Pro</Typography>
                  <Typography variant="h6" gutterBottom>$10 / month</Typography>
                  <Typography color="textSecondary" paragraph>
                    Unlimited flashcards and storage, with priority support.
                  </Typography>
                  <Button variant="contained" color="secondary" size="large" sx={{ mt: 2 }} onClick={() => handleSubmit('pro')}>Choose Pro</Button>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Box sx={{ py: 4, backgroundColor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="textSecondary" align="center">
            © {new Date().getFullYear()} FlashCards. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  )
}
