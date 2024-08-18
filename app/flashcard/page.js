'use client'

import { useUser } from "@clerk/nextjs";
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography, AppBar, Toolbar, IconButton, CircularProgress } from "@mui/material";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from '@/firebase';
import { useSearchParams } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

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
    backgroundColor: theme.palette.primary.main,
    boxShadow: 'none',
    width: '100vw',
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
    perspective: '1000px',
}));

const CardFace = styled(Box)(({ theme }) => ({
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    position: 'relative',
    width: '100%',
    height: '200px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    '& > div': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backfaceVisibility: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
        boxSizing: 'border-box',
    },
    '& > div:nth-of-type(2)': {
        transform: 'rotateY(180deg)',
    },
}));

const Footer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    backgroundColor: theme.palette.background.paper,
    textAlign: 'center',
    width: '100vw',
    position: 'fixed',
    bottom: 0,
    left: 0,
    zIndex: theme.zIndex.appBar - 1,
}));

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const router = useRouter();
    const searchParams = useSearchParams();
    const search = searchParams.get('id');

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
        async function getFlashcard() {
            if (!search || !user) return;

            const docRef = doc(collection(doc(collection(db, 'users'), user.id), "flashcardSets"), search);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                const flashcards = data.flashcards || [];
                setFlashcards(flashcards);
            } else {
                console.log('No such document!');
            }
        }
        getFlashcard();
    }, [search, user]);

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <ThemeProvider theme={theme}>
            <CustomAppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="logo" href="/">
                        <FlashOnIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
                        Flashcards
                    </Typography>
                </Toolbar>
            </CustomAppBar>
            <Container maxWidth="lg" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', pt: 8, pb: 6 }}>
                <Box flexGrow={1} display="flex" flexDirection="column" alignItems="center" sx={{ py: 4 }}>
                    <Grid container spacing={3}>
                        {flashcards.length > 0 ? (
                            flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <CustomCard>
                                        <CardActionArea onClick={() => handleCardClick(index)}>
                                            <CardContent>
                                                <CardFace sx={{
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                }}>
                                                    <Box>
                                                        <Typography variant='h5'>{flashcard.front}</Typography>
                                                    </Box>
                                                    <Box>
                                                        <Typography variant='h5'>{flashcard.back}</Typography>
                                                    </Box>
                                                </CardFace>
                                            </CardContent>
                                        </CardActionArea>
                                    </CustomCard>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="h6" sx={{ mt: 4 }}>
                                No flashcards available.
                            </Typography>
                        )}
                    </Grid>
                </Box>
            </Container>
            <Footer>
                <Typography variant="body2" color="textSecondary">
                    © {new Date().getFullYear()} Flashcards. All rights reserved.
                </Typography>
            </Footer>
        </ThemeProvider>
    );
}
