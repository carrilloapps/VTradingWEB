'use client';

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  deleteUser, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import logo from '../assets/logotipo.png';

// Material UI Components
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  useTheme,
  Snackbar,
  Backdrop,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  InputAdornment,
  Tooltip,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Warning as WarningIcon,
  ExitToApp as LogoutIcon,
  DeleteForever as DeleteIcon,
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  InfoOutlined as InfoIcon,
  Circle as BulletIcon,
} from '@mui/icons-material';

export default function BorrarCuentaPage() {
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [isDeleting, setIsDeleting] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' | 'warning' }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });
  const showMessage = (message: string, severity: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    setIsDeleting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      showMessage('Sesión iniciada correctamente', 'success');
    } catch (err: any) {
      showMessage('Error al iniciar sesión con Google: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showMessage('Por favor, completa todos los campos', 'warning');
      return;
    }
    setIsDeleting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage('Sesión iniciada correctamente', 'success');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        showMessage('Credenciales inválidas. Verifica tu email y contraseña.', 'error');
      } else {
        showMessage('Error al iniciar sesión: ' + err.message, 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showMessage('Por favor, ingresa tu correo electrónico primero', 'warning');
      return;
    }
    setIsDeleting(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage('Correo de recuperación enviado', 'success');
    } catch (err: any) {
      showMessage('Error al enviar recuperación: ' + err.message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setOpenConfirmDialog(false);
    setIsDeleting(true);
    
    try {
      // 1. Eliminar datos de Firestore
      try {
        await deleteDoc(doc(db, 'users', user.uid));
      } catch (firestoreErr) {
        console.error('Error Firestore:', firestoreErr);
      }

      // 2. Eliminar usuario de Auth
      await deleteUser(user);
      showMessage('Tu cuenta ha sido eliminada permanentemente', 'success');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        showMessage('Por seguridad, debes re-autenticarte para eliminar la cuenta.', 'info');
        setTimeout(() => auth.signOut(), 2000);
      } else {
        showMessage('Error al eliminar cuenta: ' + err.message, 'error');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <Box 
        display="flex" 
        minHeight="100vh" 
        alignItems="center" 
        justifyContent="center" 
        sx={{ bgcolor: 'background.default' }}
      >
        <Box textAlign="center">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontWeight: 500 }}>
            Verificando sesión...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', alignItems: 'center', position: 'relative', py: 6 }}>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggle />
      </Box>

      {/* Backdrop de Carga */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: 'blur(4px)' }}
        open={isDeleting}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>
            Procesando...
          </Typography>
        </Box>
      </Backdrop>

      <Container component="main" maxWidth="xs">
        <Fade in timeout={800}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 3, sm: 5 }, 
              width: '100%', 
              borderRadius: 6, 
              bgcolor: 'background.paper',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Box 
                component={Link}
                href="/"
                sx={{ 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  textDecoration: 'none',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' },
                  mb: 3
                }}
              >
                <Image
                  src={logo}
                  alt="V-Trading Logo"
                  width={150}
                  height={40}
                  priority
                  style={{ 
                    height: 'auto', 
                    filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                    transition: 'filter 0.3s ease'
                  }}
                />
              </Box>
              <Typography variant="h4" component="h1" fontWeight="800" gutterBottom color="text.primary" sx={{ letterSpacing: '-0.5px' }}>
                Eliminar Cuenta
              </Typography>
              <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                <Typography variant="body2" color="text.secondary">
                  Gestión de datos de usuario
                </Typography>
                <Tooltip title="Cumplimiento con Google Play Store">
                  <IconButton size="small" color="inherit" sx={{ opacity: 0.6 }}>
                    <InfoIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>

            <Divider sx={{ mb: 4, opacity: 0.6 }} />

            {/* Login View */}
            {!user ? (
              <Fade in>
                <Box component="form" onSubmit={handleEmailLogin} noValidate>
                  <Alert 
                    severity="info" 
                    variant="outlined" 
                    sx={{ mb: 4, borderRadius: 3, borderStyle: 'dashed' }}
                  >
                    Identifícate para gestionar tu cuenta de forma segura.
                  </Alert>

                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
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
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />

                  <Box display="flex" justifyContent="flex-end" mt={0.5}>
                    <Button
                      variant="text"
                      size="small"
                      onClick={handleForgotPassword}
                      sx={{ textTransform: 'none', fontWeight: 600 }}
                    >
                      ¿Olvidaste tu contraseña?
                    </Button>
                  </Box>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    sx={{ 
                      mt: 4, 
                      mb: 2, 
                      py: 1.5, 
                      borderRadius: 3, 
                      fontWeight: 'bold',
                      boxShadow: theme.shadows[4]
                    }}
                  >
                    Iniciar Sesión
                  </Button>

                  <Divider sx={{ my: 4 }}>
                    <Typography variant="caption" color="text.disabled" fontWeight="bold">
                      O CONTINUAR CON
                    </Typography>
                  </Divider>

                  <Button
                    fullWidth
                    variant="outlined"
                    size="large"
                    startIcon={<GoogleIcon />}
                    onClick={handleGoogleLogin}
                    sx={{ 
                      py: 1.5, 
                      borderRadius: 3, 
                      textTransform: 'none', 
                      fontWeight: 600,
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    Google Account
                  </Button>
                </Box>
              </Fade>
            ) : (
              /* User Info & Delete Account View */
              <Fade in>
                <Box>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2.5, 
                      mb: 4, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2, 
                      borderRadius: 4, 
                      bgcolor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  >
                    <Avatar 
                      src={user.photoURL || undefined} 
                      sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}
                    >
                      {!user.photoURL && user.email?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box flex={1} overflow="hidden">
                      <Typography variant="subtitle1" fontWeight="bold" noWrap>
                        {user.displayName || 'Usuario de VTrading'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {user.email}
                      </Typography>
                    </Box>
                    <Tooltip title="Cerrar sesión">
                      <IconButton onClick={() => auth.signOut()} size="small" sx={{ bgcolor: 'action.hover' }}>
                        <LogoutIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Paper>

                  <Alert 
                    severity="error" 
                    icon={<WarningIcon fontSize="inherit" />}
                    sx={{ mb: 4, borderRadius: 4, '& .MuiAlert-message': { width: '100%' } }}
                  >
                    <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                      Consecuencias de la eliminación:
                    </Typography>
                    <List dense sx={{ p: 0 }}>
                      {[
                        "Eliminación permanente de todos tus datos financieros en nuestros servidores.",
                        "Pérdida de acceso irreversible a la cuenta.",
                        "La configuración local (temas, preferencias) persistirá en este dispositivo."
                      ].map((text, index) => (
                        <ListItem key={index} alignItems="flex-start" sx={{ p: 0, mb: 0.8 }}>
                           <ListItemIcon sx={{ minWidth: 20, mt: 0.7 }}>
                             <BulletIcon sx={{ fontSize: 6, color: index === 2 ? 'primary.main' : 'error.main' }} />
                           </ListItemIcon>
                          <ListItemText 
                            primary={text} 
                            primaryTypographyProps={{ 
                              variant: 'caption', 
                              fontWeight: index === 2 ? 600 : 500,
                              color: index === 2 ? 'text.primary' : 'inherit',
                              sx: { lineHeight: 1.4 }
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Alert>

                  <Button
                    fullWidth
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<DeleteIcon />}
                    onClick={() => setOpenConfirmDialog(true)}
                    sx={{ 
                      py: 2, 
                      mb: 3, 
                      borderRadius: 4, 
                      fontWeight: 'bold',
                      boxShadow: theme.shadows[8]
                    }}
                  >
                    Si, quiero eliminar mi cuenta
                  </Button>

                  <Typography variant="caption" color="text.secondary" align="center" display="block" sx={{ px: 2, lineHeight: 1.6 }}>
                    Este proceso cumple con el <strong>Derecho al Olvido</strong> y las políticas de transparencia de Google Play. Tus datos serán purgados de nuestros sistemas en tiempo real.
                  </Typography>
                </Box>
              </Fade>
            )}

            <Box mt={6} pt={4} textAlign="center" sx={{ borderTop: '1px solid', borderColor: 'divider', opacity: 0.5 }}>
              <Typography variant="caption" fontWeight="800" color="text.disabled" sx={{ letterSpacing: '2px' }}>
                VTRADING ECOSYSTEM &copy; {new Date().getFullYear()}
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>

      {/* Diálogo de Confirmación Profesional */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        PaperProps={{
          sx: { borderRadius: 5, p: 1, maxWidth: 400 }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" /> ¿Estás totalmente seguro?
        </DialogTitle>
        <DialogContent>
          <DialogContentText variant="body2" sx={{ color: 'text.primary', mb: 2 }}>
            Esta acción es <strong>final e irreversible</strong>. Una vez confirmada, no podremos recuperar tus datos bajo ninguna circunstancia.
          </DialogContentText>
          <Alert severity="warning" variant="outlined" sx={{ borderRadius: 3 }}>
            Tus suscripciones y configuraciones se perderán para siempre.
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button 
            onClick={() => setOpenConfirmDialog(false)} 
            variant="outlined" 
            sx={{ borderRadius: 3, textTransform: 'none' }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteAccount} 
            variant="contained" 
            color="error" 
            autoFocus 
            sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 'bold' }}
          >
            Sí, eliminar permanentemente
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para Notificaciones (Toasts) */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          sx={{ width: '100%', borderRadius: 3, boxShadow: theme.shadows[10] }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
