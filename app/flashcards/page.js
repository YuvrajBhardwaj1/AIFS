'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Container, Grid, Card, CardActionArea, CardContent, Typography, AppBar, Toolbar, IconButton, Box, CircularProgress } from '@mui/material';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

const theme = createTheme({
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

const CustomAppBar = styled(AppBar)(({ theme }) => ({
    backgroundColor: 'transparent',
    boxShadow: 'none',
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: theme.zIndex.appBar,
}));

const CustomCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    transition: '0.3s',
    '&:hover': {
        boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
    },
    maxWidth: '100%',
}));

const Footer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: '#f5f5f5',
    textAlign: 'center',
    width: '100%',
    position: 'fixed',
    bottom: 0,
    left: 0,
    zIndex: theme.zIndex.appBar - 1,
}));

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (isLoaded && !isSignedIn) {
            router.push('/sign-in')
        }
    }, [isLoaded, isSignedIn, router])

    if (!isLoaded || !isSignedIn) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        )
    }

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return;
            const docRef = doc(collection(db, "users"), user.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const collections = docSnap.data().flashcardSets || [];
                setFlashcards(collections);
            } else {
                await setDoc(docRef, { flashcardSets: [] });
            }
        }
        getFlashcards();
    }, [user]);

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    return (
        <ThemeProvider theme={theme}>
            <CustomAppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="primary" aria-label="logo" href="/">
                        <FlashOnIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, color: '#333' }}>
                        FlashCards
                    </Typography>
                </Toolbar>
            </CustomAppBar>
            <Container
                maxWidth="lg"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    pt: 8,
                    pb: 10,
                }}
            >
                <Box
                    flexGrow={1}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ p: 2 }}
                >
                    <Grid container spacing={3}>
                        {flashcards.length > 0 ? (
                            flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <CustomCard>
                                        <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                            <CardContent>
                                                <Typography variant="h5" component="div">
                                                    {flashcard.name}
                                                </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                    </CustomCard>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" component="div" sx={{ mt: 4 }}>
                                No flashcards available.
                            </Typography>
                        )}
                    </Grid>
                </Box>
            </Container>
            <Footer>
                <Typography variant="body2" color="textSecondary">
                    © {new Date().getFullYear()} FlashCards. All rights reserved.
                </Typography>
            </Footer>
        </ThemeProvider>
    );
}