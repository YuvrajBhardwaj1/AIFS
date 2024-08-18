'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Container, Grid, Card, CardActionArea, CardContent, Typography } from '@mui/material';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase';

export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

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
        <Container maxWidth="md">
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.length > 0 ? (
                    flashcards.map((flashcard, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card>
                                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                    <CardContent>
                                        <Typography variant="h5" component="div">
                                            {flashcard.name}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6" component="div" sx={{ mt: 4 }}>
                        No flashcards available.
                    </Typography>
                )}
            </Grid>
        </Container>
    );
}
