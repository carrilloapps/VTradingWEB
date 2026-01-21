'use client';

import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  deleteUser, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import logo from '../assets/logotipo.png';

// Material UI Components
import {
  Container,
  Grid,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
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
  Tab,
  Tabs,
  alpha,
  Grow
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
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  History as HistoryIcon
} from '@mui/icons-material';

export default function CuentaPage() {
  const theme = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Feedback states
  const [isProcessing, setIsProcessing] = useState(false);
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

  const handleGoogleAuth = async () => {
    setIsProcessing(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Save user to firestore if new
      const userRef = doc(db, 'users', result.user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString()
        });
      }
      
      showMessage('Sesión iniciada correctamente', 'success');
    } catch (err: any) {
      showMessage('Error: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (authMode === 'register' && !name)) {
      showMessage('Por favor, completa todos los campos', 'warning');
      return;
    }
    setIsProcessing(true);
    try {
      if (authMode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        showMessage('Sesión iniciada correctamente', 'success');
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        
        // Save to firestore
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          displayName: name,
          email: email,
          createdAt: new Date().toISOString()
        });
        
        showMessage('Cuenta creada correctamente', 'success');
      }
    } catch (err: any) {
      showMessage('Error: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      showMessage('Sesión cerrada', 'info');
    } catch (err: any) {
      showMessage('Error al cerrar sesión', 'error');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showMessage('Ingresa tu correo electrónico', 'warning');
      return;
    }
    setIsProcessing(true);
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage('Correo de recuperación enviado', 'success');
    } catch (err: any) {
      showMessage('Error: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setOpenConfirmDialog(false);
    setIsProcessing(true);
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      showMessage('Cuenta eliminada permanentemente', 'success');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        showMessage('Re-autentícate para realizar esta acción', 'info');
        setTimeout(() => auth.signOut(), 2000);
      } else {
        showMessage('Error: ' + err.message, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" minHeight="100vh" alignItems="center" justifyContent="center" sx={{ bgcolor: 'background.default' }}>
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ flexGrow: 1, py: { xs: 8, md: 12 }, mt: 4 }}>
        {!user ? (
          // Auth Section (Login/Register)
          <Grow in timeout={800}>
            <Box sx={{ maxWidth: 450, mx: 'auto' }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 4, sm: 6 }, 
                  borderRadius: 8, 
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  textAlign: 'center',
                  boxShadow: `0 20px 40px ${alpha(theme.palette.common.black, 0.05)}`
                }}
              >
                <Box 
                  component={Link}
                  href="/"
                  sx={{ 
                    display: 'inline-flex', 
                    mb: 4,
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'scale(1.05)' }
                  }}
                >
                  <Image
                    src={logo}
                    alt="V-Trading Logo"
                    width={160}
                    height={42}
                    style={{ 
                      height: 'auto', 
                      filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none' 
                    }}
                  />
                </Box>

                <Typography variant="h4" fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.03em' }}>
                  {authMode === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  {authMode === 'login' ? 'Ingresa tus credenciales para continuar' : 'Únete a la plataforma de monitoreo más avanzada'}
                </Typography>

                <form onSubmit={handleEmailAuth}>
                  {authMode === 'register' && (
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      variant="outlined"
                      margin="normal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon fontSize="small" color="action" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 }
                      }}
                    />
                  )}
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    variant="outlined"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon fontSize="small" color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    variant="outlined"
                    margin="normal"
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
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 }
                    }}
                  />

                  {authMode === 'login' && (
                    <Box textAlign="right" sx={{ mt: 1 }}>
                      <Button 
                        variant="text" 
                        size="small" 
                        onClick={handleForgotPassword}
                        sx={{ textTransform: 'none', fontWeight: 600, color: 'primary.main' }}
                      >
                        ¿Olvidaste tu contraseña?
                      </Button>
                    </Box>
                  )}

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isProcessing}
                    sx={{ 
                      mt: 4, 
                      py: 1.8, 
                      borderRadius: 3, 
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`
                    }}
                  >
                    {isProcessing ? <CircularProgress size={24} color="inherit" /> : (authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse')}
                  </Button>
                </form>

                <Box sx={{ my: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Divider sx={{ flexGrow: 1, opacity: 0.5 }} />
                  <Typography variant="caption" color="text.disabled" fontWeight="700">O CONTINÚA CON</Typography>
                  <Divider sx={{ flexGrow: 1, opacity: 0.5 }} />
                </Box>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleAuth}
                  startIcon={<GoogleIcon />}
                  sx={{ 
                    py: 1.5, 
                    borderRadius: 3, 
                    fontWeight: 700, 
                    textTransform: 'none',
                    borderColor: theme.palette.divider,
                    color: 'text.primary',
                    '&:hover': {
                      borderColor: theme.palette.text.primary,
                      bgcolor: alpha(theme.palette.text.primary, 0.02)
                    }
                  }}
                >
                  Google
                </Button>

                <Typography variant="body2" sx={{ mt: 4, color: 'text.secondary' }}>
                  {authMode === 'login' ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
                  <Button 
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    sx={{ ml: 0.5, textTransform: 'none', fontWeight: 800, color: 'primary.main', minWidth: 'auto', p: 0 }}
                  >
                    {authMode === 'login' ? 'Regístrate aquí' : 'Inicia sesión'}
                  </Button>
                </Typography>
              </Paper>
            </Box>
          </Grow>
        ) : (
          // User Dashboard (Account Management)
          <Fade in timeout={800}>
            <Grid container spacing={4}>
            {/* Sidebar */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 4, 
                  borderRadius: 6, 
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  position: 'sticky',
                  top: 100
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Avatar 
                    src={user.photoURL || ''} 
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '2.5rem',
                      fontWeight: 800,
                      boxShadow: `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`
                    }}
                  >
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </Avatar>
                  <Typography variant="h5" fontWeight="800">{user.displayName || 'Usuario de VTrading'}</Typography>
                  <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                </Box>

                <Tabs 
                  orientation="vertical" 
                  value={activeTab} 
                  onChange={(_, val) => setActiveTab(val)}
                  sx={{ 
                    borderRight: 0,
                    '& .MuiTabs-indicator': { display: 'none' },
                    '& .MuiTab-root': {
                      alignItems: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 3,
                      mb: 1,
                      minHeight: 48,
                      color: 'text.secondary',
                      transition: 'all 0.2s',
                      '&.Mui-selected': {
                        color: 'primary.main',
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                      },
                      '&:hover:not(.Mui-selected)': {
                        bgcolor: alpha(theme.palette.text.primary, 0.05)
                      }
                    }
                  }}
                >
                  <Tab icon={<PersonIcon sx={{ mr: 2 }} />} iconPosition="start" label="Perfil" />
                  <Tab icon={<SettingsIcon sx={{ mr: 2 }} />} iconPosition="start" label="Preferencias" />
                  <Tab icon={<SecurityIcon sx={{ mr: 2 }} />} iconPosition="start" label="Seguridad" />
                  <Tab icon={<HistoryIcon sx={{ mr: 2 }} />} iconPosition="start" label="Actividad" />
                </Tabs>

                <Divider sx={{ my: 3, opacity: 0.5 }} />

                <Button
                  fullWidth
                  variant="text"
                  startIcon={<LogoutIcon />}
                  onClick={handleSignOut}
                  sx={{ 
                    justifyContent: 'flex-start', 
                    color: 'error.main', 
                    fontWeight: 700, 
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    textTransform: 'none',
                    '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.1) }
                  }}
                >
                  Cerrar Sesión
                </Button>
              </Paper>
            </Grid>

            {/* Content Area */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: { xs: 4, md: 6 }, 
                  borderRadius: 6, 
                  bgcolor: 'background.paper',
                  border: `1px solid ${theme.palette.divider}`,
                  minHeight: 500
                }}
              >
                {activeTab === 0 && (
                  <Fade in>
                    <Box>
                      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.02em' }}>Perfil de Usuario</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>Gestiona tu información personal y cómo te ven otros usuarios.</Typography>
                      
                      <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" fontWeight="800" color="text.disabled" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>Nombre</Typography>
                          <Typography variant="body1" fontWeight="600">{user.displayName || 'No configurado'}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" fontWeight="800" color="text.disabled" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>Email</Typography>
                          <Typography variant="body1" fontWeight="600">{user.email}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                          <Typography variant="caption" fontWeight="800" color="text.disabled" sx={{ textTransform: 'uppercase', mb: 1, display: 'block' }}>UID</Typography>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', opacity: 0.7 }}>{user.uid}</Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Fade>
                )}

                {activeTab === 2 && (
                  <Fade in>
                    <Box>
                      <Typography variant="h4" fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.02em' }}>Seguridad</Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 6 }}>Protege tu cuenta y gestiona el acceso a tus datos financieros.</Typography>
                      
                      <Box sx={{ p: 4, borderRadius: 4, bgcolor: alpha(theme.palette.error.main, 0.02), border: `1px solid ${alpha(theme.palette.error.main, 0.1)}` }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                          <WarningIcon color="error" />
                          <Typography variant="h6" fontWeight="800" color="error.main">Zona de Peligro</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                          Una vez que elimines tu cuenta, no hay vuelta atrás. Todos tus datos, preferencias y alertas configuradas se borrarán permanentemente.
                        </Typography>
                        <Button 
                          variant="contained" 
                          color="error" 
                          startIcon={<DeleteIcon />}
                          onClick={() => setOpenConfirmDialog(true)}
                          sx={{ borderRadius: 3, py: 1.2, px: 3, fontWeight: 800, textTransform: 'none' }}
                        >
                          Eliminar mi cuenta
                        </Button>
                      </Box>
                    </Box>
                  </Fade>
                )}

                {activeTab === 1 && (
                  <Box textAlign="center" py={10}>
                    <SettingsIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" color="text.secondary">Próximamente: Personalización de Dashboard</Typography>
                  </Box>
                )}

                {activeTab === 3 && (
                  <Box textAlign="center" py={10}>
                    <HistoryIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2, opacity: 0.3 }} />
                    <Typography variant="h6" color="text.secondary">Próximamente: Historial de sesiones y alertas</Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Fade>
        )}
      </Container>

      <Footer />

      {/* Confirm Delete Dialog */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        PaperProps={{ sx: { borderRadius: 5, p: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: '1.5rem' }}>
          ¿Estás absolutamente seguro?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Esta acción es irreversible. Se eliminará permanentemente tu acceso a VTrading y todos tus datos asociados.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenConfirmDialog(false)} sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none', color: 'text.secondary' }}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteAccount} color="error" variant="contained" sx={{ borderRadius: 3, fontWeight: 700, textTransform: 'none' }}>
            Sí, eliminar permanentemente
          </Button>
        </DialogActions>
      </Dialog>

      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backdropFilter: 'blur(4px)' }} open={isProcessing}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled" sx={{ width: '100%', borderRadius: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
