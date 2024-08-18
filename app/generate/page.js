'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Head from 'next/head';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Paper,
    Grid,
    Card,
    CardActionArea,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    CircularProgress,
    AppBar,
    Toolbar,
    IconButton,
} from '@mui/material'
import { createTheme, ThemeProvider, styled } from '@mui/material/styles'
import { collection, doc, getDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/firebase';
import FlashOnIcon from '@mui/icons-material/FlashOn';

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

const CustomCard = styled(Card)(({ theme }) => ({
    borderRadius: '16px',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.2)',
    },
}));

const GradientButton = styled(Button)(({ theme }) => ({
    background: 'linear-gradient(90deg, #6C63FF, #8A7FF0)',
    '&:hover': {
        background: 'linear-gradient(90deg, #6C63FF, #8A7FF0)',
    },
}));

const FlashcardFront = styled(Box)(({ theme }) => ({
    backgroundColor: '#EDE7F6',
    color: '#6C63FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: '8px',
}));

const FlashcardBack = styled(Box)(({ theme }) => ({
    backgroundColor: '#F3E5F5',
    color: '#6C63FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    borderRadius: '8px',
}));

export default function Generate() {
    const [text, setText] = useState('')
    const [flashcards, setFlashcards] = useState([])
    const { isLoaded, isSignedIn, user } = useUser()
    const [setName, setSetName] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)
    const [flipped, setFlipped] = useState([])
    const [loading, setLoading] = useState(false)
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

    const handleSubmit = async () => {
        if (!text.trim()) {
            alert('Please enter some text to generate flashcards.')
            return
        }

        setLoading(true)

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                body: text,
            })

            if (!response.ok) {
                throw new Error('Failed to generate flashcards')
            }

            const data = await response.json()
            setFlashcards(data)
        } catch (error) {
            console.error('Error generating flashcards:', error)
            alert('An error occurred while generating flashcards. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpenDialog = () => setDialogOpen(true)
    const handleCloseDialog = () => setDialogOpen(false)

    const saveFlashcards = async () => {
        if (!setName.trim()) {
            alert('Please enter a name for your flashcard set.')
            return
        }

        try {
            const userDocRef = doc(collection(db, 'users'), user.id)
            const userDocSnap = await getDoc(userDocRef)

            const batch = writeBatch(db)

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data()
                const updatedSets = [...(userData.flashcardSets || []), { name: setName }]
                batch.update(userDocRef, { flashcardSets: updatedSets })
            } else {
                batch.set(userDocRef, { flashcardSets: [{ name: setName }] })
            }

            const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName)
            batch.set(setDocRef, { flashcards })

            await batch.commit()

            alert('Flashcards saved successfully!')
            handleCloseDialog()
            setSetName('')
            router.push(`/flashcards`);
        } catch (error) {
            console.error('Error saving flashcards:', error)
            alert('An error occurred while saving flashcards. Please try again.')
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Head>
                <title>FlashCard</title>
                <meta name="description" content="Create flashcards from your text" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
            </Head>

            <AppBar position="static" color="transparent" elevation={0}>
                <Toolbar>
                    {/* Logo */}
                    <IconButton edge="start" color="primary" aria-label="logo" href="/">
                        <FlashOnIcon fontSize="large" />
                    </IconButton>

                    {/* Title */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#333' }}>
                        FlashCards
                    </Typography>

                    <Button color="primary" variant="text" href="/flashcards" sx={{ marginRight: 2 }}>My Flashcards</Button>

                </Toolbar>
            </AppBar>


            <Container maxWidth="md">
                <Box sx={{ mt: 4, mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
                        Generate Flashcards
                    </Typography>
                    <Paper sx={{ p: 4, width: '100%', background: '#f5f5f5', borderRadius: '16px' }}>
                        <TextField
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            label="Enter text"
                            fullWidth
                            multiline
                            rows={4}
                            variant="outlined"
                            sx={{ mb: 2 }}
                        />
                        <GradientButton
                            variant="contained"
                            onClick={handleSubmit}
                            fullWidth
                            disabled={loading}
                        >
                            Generate Flashcards
                        </GradientButton>
                    </Paper>
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                        <CircularProgress />
                    </Box>
                ) : flashcards.length > 0 ? (
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 700 }}>
                            Generated Flashcards
                        </Typography>
                        <Grid container spacing={3}>
                            {flashcards.map((flashcard, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <CustomCard onClick={() => handleCardClick(index)}>
                                        <CardActionArea>
                                            <CardContent>
                                                <Box sx={{
                                                    perspective: "1000px",
                                                    '& > div': {
                                                        transition: 'transform 0.6s ease-in-out',
                                                        transformStyle: 'preserve-3d',
                                                        position: 'relative',
                                                        width: '100%',
                                                        height: '200px',
                                                        transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                                    },
                                                    '& > div > div': {
                                                        position: 'absolute',
                                                        width: '100%',
                                                        height: '100%',
                                                        backfaceVisibility: 'hidden',
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        padding: 2,
                                                        boxSizing: 'border-box',
                                                        borderRadius: '8px',
                                                    },
                                                    '& > div > div:nth-of-type(2)': {
                                                        transform: 'rotateY(180deg)',
                                                    },
                                                }}>
                                                    <div>
                                                        <FlashcardFront>
                                                            <Typography variant='h6' component="div">
                                                                {flashcard.front}
                                                            </Typography>
                                                        </FlashcardFront>
                                                        <FlashcardBack>
                                                            <Typography variant='h6' component="div">
                                                                {flashcard.back}
                                                            </Typography>
                                                        </FlashcardBack>
                                                    </div>
                                                </Box>
                                            </CardContent>
                                        </CardActionArea>
                                    </CustomCard>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ) : null}

                {flashcards.length > 0 && (
                    <Box sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
                        <GradientButton
                            variant="contained"
                            onClick={handleOpenDialog}
                            size="large"
                        >
                            Save Flashcards
                        </GradientButton>
                    </Box>
                )}

                <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                    <DialogTitle>Save Flashcard Set</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Enter a name for your flashcard set to save it.
                        </DialogContentText>
                        <TextField
                            value={setName}
                            onChange={(e) => setSetName(e.target.value)}
                            label="Set Name"
                            fullWidth
                            margin="dense"
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="secondary">
                            Cancel
                        </Button>
                        <Button onClick={saveFlashcards} color="primary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
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
