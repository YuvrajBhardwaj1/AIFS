'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import Head from 'next/head';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography } from "@mui/material";

export default function Home() {
  
  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: { origin: 'http://localhost:3000' },
    })
    const checkoutSessionJson = await checkoutSession.json()
  
    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
  
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <Container maxWidth="100vw">
      <Head>
        <title>FlashCard</title>
        <meta name="description" content="Create flashcard from your text"/>
      </Head>

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow:1}}>FlashCards</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton></UserButton>
          </SignedIn>
        </Toolbar>
      </AppBar>

      <Box sx={{
        textAlign:"center",
        my:4,      
      }}>
        <Typography variant="h2" gutterBottom>Welcome to the flashcards</Typography>
        <Typography variant="h5" gutterBottom>
          {''}
          The easiest way of the flashcard from your text
        </Typography>
        <Button variant="contained" color="primary" sx={{mt : 2}} href="/generate">Get Started</Button>
      </Box>


      <Box sx={{my:6}}>
        <Typography variant="h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Easy text Input</Typography>
            <Typography>
              {''}
              Simply type the text and let the software do the rest. 
              Creating flashcards has never been easier.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Smart FlashCard</Typography>
            <Typography>
              {''}
              Our AI intelligently breaks down your text into concise flashcard.
              Perfect for studying. </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>accessible anywhere</Typography>
            <Typography>
              {''}
              Access your flashcards from any device, at any time, Study on the go with ease.</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{my:6 , textAlign:"center"}}>
      <Typography variant="h4" gutterBottom>
          Pricing
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant="h5" gutterBottom>Basic</Typography>
            <Typography variant="h6" gutterBottom>$5 / month</Typography>
            <Typography>
              {''}
              Access to basic flashcard features and limited storage.
            </Typography>
            <Button variant="contained" color="primary" sx={{mt:2}}>Choose basic</Button>
              </Box>
          </Grid>
          <Grid item xs={12} md={6}>
          <Box sx={{
              p:3,
              border: '1px solid',
              borderColor: 'grey.300',
              borderRadius: 2,
            }}>
            <Typography variant="h5" gutterBottom>Pro</Typography>
            <Typography variant="h6" gutterBottom>$10 / month</Typography>
            <Typography>
              {''}
              unlimited flashcards and storage, with priority support.
            </Typography>
            <Button variant="contained" color="primary" sx={{mt:2}} onClick={handleSubmit}>Choose Pro</Button>
              </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}
