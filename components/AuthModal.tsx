'use client';

import React, { useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import logo from '../app/assets/logotipo.png';

import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
  useTheme,
  alpha,
  Fade,
  Grow,
} from '@mui/material';
import {
  Close as CloseIcon,
  Google as GoogleIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
} from '@mui/icons-material';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const theme = useTheme();
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleReset = React.useCallback(() => {
    setAuthMode('login');
    setEmail('');
    setPassword('');
    setName('');
    setError(null);
    setIsProcessing(false);
  }, []);

  const handleClose = React.useCallback(() => {
    onClose();
    // Delay reset to avoid layout shift during closing animation
    setTimeout(handleReset, 300);
  }, [onClose, handleReset]);

  // Safety net: Close modal if user is detected
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && open) {
        setIsProcessing(false);
        handleClose();
      }
    });
    return () => unsubscribe();
  }, [open, handleClose]);

  const handleGoogleAuth = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);

      setIsProcessing(false);
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      console.error('Auth Error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocurrió un error desconocido');
      }
      setIsProcessing(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isProcessing) return;

    setIsProcessing(true);
    setError(null);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else if (authMode === 'register') {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
      } else {
        await sendPasswordResetEmail(auth, email);
        setError('Correo de recuperación enviado. Revisa tu bandeja de entrada.');
        setAuthMode('login');
        setIsProcessing(false);
        return;
      }
      setIsProcessing(false);
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      console.error('Auth Error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido');
      }
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      TransitionComponent={Grow}
      PaperProps={{
        sx: {
          borderRadius: 6,
          bgcolor: 'background.paper',
          backgroundImage: 'none',
          p: 1,
        },
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 16,
          top: 16,
          color: 'text.disabled',
          '&:hover': { color: 'text.primary' },
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
        <Box sx={{ mb: 4 }}>
          <Image
            src={logo}
            alt="V-Trading Logo"
            width={140}
            height={36}
            style={{
              height: 'auto',
              filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
              marginBottom: '24px',
            }}
          />
          <Typography variant="h5" fontWeight="800" sx={{ letterSpacing: '-0.03em' }}>
            {authMode === 'login'
              ? 'Bienvenido'
              : authMode === 'register'
                ? 'Crea tu cuenta'
                : 'Recuperar acceso'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {authMode === 'login'
              ? 'Ingresa para monitorear tus mercados'
              : authMode === 'register'
                ? 'Únete a la plataforma de monitoreo más avanzada'
                : 'Enviaremos un enlace a tu correo'}
          </Typography>
        </Box>

        {error && (
          <Fade in>
            <Box
              sx={{
                mb: 3,
                p: 2,
                borderRadius: 3,
                bgcolor: alpha(theme.palette.error.main, 0.1),
                border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
              }}
            >
              <Typography variant="caption" color="error" fontWeight="700">
                {error}
              </Typography>
            </Box>
          </Fade>
        )}

        <form onSubmit={handleEmailAuth}>
          {authMode === 'register' && (
            <TextField
              fullWidth
              placeholder="Nombre completo"
              variant="outlined"
              margin="dense"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: alpha(theme.palette.text.primary, 0.02) },
              }}
            />
          )}

          <TextField
            fullWidth
            placeholder="Correo electrónico"
            variant="outlined"
            margin="dense"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon fontSize="small" color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: alpha(theme.palette.text.primary, 0.02) },
            }}
          />

          {authMode !== 'forgot' && (
            <TextField
              fullWidth
              placeholder="Contraseña"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="dense"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon fontSize="small" color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 3, bgcolor: alpha(theme.palette.text.primary, 0.02) },
              }}
            />
          )}

          {authMode === 'login' && (
            <Box textAlign="right" sx={{ mt: 1 }}>
              <Button
                variant="text"
                size="small"
                onClick={() => setAuthMode('forgot')}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  color: 'primary.main',
                  fontSize: '0.75rem',
                }}
              >
                ¿Olvidaste tu contraseña?
              </Button>
            </Box>
          )}

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={isProcessing}
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 800,
              textTransform: 'none',
              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            }}
          >
            {isProcessing ? (
              <CircularProgress size={24} color="inherit" />
            ) : authMode === 'login' ? (
              'Iniciar Sesión'
            ) : authMode === 'register' ? (
              'Registrarse'
            ) : (
              'Enviar Enlace'
            )}
          </Button>
        </form>

        <Box sx={{ my: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Divider sx={{ flexGrow: 1, opacity: 0.5 }} />
          <Typography variant="caption" color="text.disabled" fontWeight="700">
            O
          </Typography>
          <Divider sx={{ flexGrow: 1, opacity: 0.5 }} />
        </Box>

        <Button
          fullWidth
          variant="outlined"
          onClick={handleGoogleAuth}
          startIcon={<GoogleIcon />}
          sx={{
            py: 1.2,
            borderRadius: 3,
            fontWeight: 700,
            textTransform: 'none',
            borderColor: theme.palette.divider,
            color: 'text.primary',
            '&:hover': {
              borderColor: theme.palette.text.primary,
              bgcolor: alpha(theme.palette.text.primary, 0.02),
            },
          }}
        >
          Continuar con Google
        </Button>

        <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary', fontSize: '0.85rem' }}>
          {authMode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
          <Button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            sx={{
              ml: 0.5,
              textTransform: 'none',
              fontWeight: 800,
              color: 'primary.main',
              minWidth: 'auto',
              p: 0,
              fontSize: '0.85rem',
            }}
          >
            {authMode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
          </Button>
        </Typography>
      </DialogContent>
    </Dialog>
  );
}
