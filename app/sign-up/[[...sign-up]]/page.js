'use client'

import React from 'react';
import { Container, Box, Typography, AppBar, Toolbar, Button, IconButton } from '@mui/material';
import { SignUp } from '@clerk/nextjs';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

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
}));

const CustomButton = styled(Button)(({ theme }) => ({
    color: '#6C63FF',
    '&:hover': {
        backgroundColor: 'transparent',
        color: '#8A7FF0',
    },
}));

export default function SignUpPage() {
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="100vw" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar>
                        <IconButton edge="start" color="primary" aria-label="logo" href="/">
                            <FlashOnIcon fontSize="large" />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 700, color: '#333' }}>
                            FlashCards
                        </Typography>
                        <SignedOut>
                            <Button color="primary" variant="text" href="/sign-in" sx={{ marginRight: 2 }}>Login</Button>
                            <Button color="primary" variant="contained" href="/sign-up">Sign Up</Button>
                        </SignedOut>
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </Toolbar>
                </AppBar>
                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ flexGrow: 1, textAlign: 'center', my: 4 }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mx: 'auto',
                            p: 2,
                            backgroundColor: '#f5f5f5',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '600px',
                        }}
                    >
                        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, color: '#333' }}>
                            Sign Up
                        </Typography>
                        <SignUp />
                    </Box>
                </Box>
                <Box sx={{ py: 4, backgroundColor: '#f5f5f5' }}>
                    <Container maxWidth="lg">
                        <Typography variant="body2" color="textSecondary" align="center">
                            © {new Date().getFullYear()} FlashCards. All rights reserved.
                        </Typography>
                    </Container>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
