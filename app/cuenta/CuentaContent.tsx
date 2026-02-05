'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  deleteUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User,
  createUserWithEmailAndPassword,
  updateProfile,
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  PhoneAuthProvider,
  multiFactor,
  RecaptchaVerifier,
  PhoneMultiFactorGenerator,
} from 'firebase/auth';
import { messaging } from '@/lib/firebase';
import { getToken } from 'firebase/messaging';
import { subscribeToTopicAction, unsubscribeFromTopicAction } from '@/app/actions/notifications';
import { logger } from '@/lib/logger';
import { auth } from '@/lib/firebase';
import Image from 'next/image';
import Link from 'next/link';
import md5 from 'md5';
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
  CircularProgress,
  IconButton,
  useTheme,
  Snackbar,
  InputAdornment,
  alpha,
  Grow,
  Fade,
  Switch,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Select,
  MenuItem,
  FormControl,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';

// Icons
import {
  Google as GoogleIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  History as HistoryIcon,
  Logout as LogoutIcon,
  PhotoCamera as PhotoCameraIcon,
  VerifiedUser as VerifiedUserIcon,
  Vibration as VibrationIcon,
  Lock as LockIcon,
  LaptopMac as LaptopMacIcon,
  Smartphone as SmartphoneIcon,
  Email as EmailIcon,
  LightMode as LightIcon,
  DarkMode as DarkIcon,
} from '@mui/icons-material';

import { useColorMode } from '@/context/ThemeContext';
import { useSearchParams } from 'next/navigation';

// --- Styled Components / Reusable Styles ---

const GlassCard = ({ children, sx, ...props }: any) => {
  const theme = useTheme();
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: alpha(theme.palette.background.paper, 0.6),
        backdropFilter: 'blur(12px)',
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: `0 8px 32px 0 ${alpha(theme.palette.common.black, 0.1)}`,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
      {icon}
      <Typography variant="h6" fontWeight="800" sx={{ letterSpacing: '-0.02em' }}>
        {title}
      </Typography>
    </Box>
  );
};

export default function CuentaPage() {
  const theme = useTheme();
  const searchParams = useSearchParams();
  const colorMode = useColorMode();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Get initial tab from URL or default to 'profile'
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update activeTab when URL changes
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['profile', 'security', 'activity', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Feedback states
  const [isProcessing, setIsProcessing] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });

  const showMessage = (
    message: string,
    severity: 'success' | 'error' | 'info' | 'warning' = 'info'
  ) => {
    setSnackbar({ open: true, message, severity });
  };

  const getGravatarUrl = (email: string) => {
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=mp&s=200`;
  };

  // --- Dialog & Edit States ---
  const [openReauthDialog, setOpenReauthDialog] = useState(false);
  const [openChangePassDialog, setOpenChangePassDialog] = useState(false);
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);

  // Pending Action State (to resume after re-auth)
  const [pendingAction, setPendingAction] = useState<{
    type: 'password' | 'email' | 'delete';
    payload?: any;
  } | null>(null);

  // Form Data
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  // Populate edit fields
  useEffect(() => {
    if (user) {
      setEditName(user.displayName || '');
      setEditEmail(user.email || '');
    }
  }, [user]);

  // --- Actions ---

  const handleReauthSubmit = async () => {
    if (!user || !currentPassword) return;
    setIsProcessing(true);
    try {
      const credential = EmailAuthProvider.credential(user.email!, currentPassword);
      await reauthenticateWithCredential(user, credential);
      setOpenReauthDialog(false);
      setCurrentPassword('');

      // Resume pending action
      if (pendingAction) {
        if (pendingAction.type === 'password') {
          await updatePassword(user, pendingAction.payload);
          showMessage('Contraseña actualizada correctamente', 'success');
          setOpenChangePassDialog(false);
          setNewPassword('');
          setConfirmNewPassword('');
        } else if (pendingAction.type === 'email') {
          await updateEmail(user, pendingAction.payload);
          showMessage('Correo actualizado correctamente', 'success');
        } else if (pendingAction.type === 'delete') {
          await deleteUser(user);
          // Auth state change will handle redirect/UI update
          showMessage('Cuenta eliminada permanentemente', 'success');
        }
      }
      setPendingAction(null);
    } catch (err: any) {
      showMessage('Error de autenticación: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateProfileData = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      let needsReauth = false;

      // Update Name
      if (editName !== user.displayName) {
        await updateProfile(user, { displayName: editName });
      }

      // Update Email
      if (editEmail !== user.email) {
        try {
          await updateEmail(user, editEmail);
        } catch (err: any) {
          if (err.code === 'auth/requires-recent-login') {
            needsReauth = true;
            setPendingAction({ type: 'email', payload: editEmail });
            setOpenReauthDialog(true);
          } else {
            throw err;
          }
        }
      }

      if (!needsReauth) {
        showMessage('Perfil actualizado correctamente', 'success');
      }
    } catch (err: any) {
      showMessage('Error al actualizar perfil: ' + err.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleChangePasswordSubmit = async () => {
    if (!user) return;
    if (newPassword !== confirmNewPassword) {
      showMessage('Las contraseñas no coinciden', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showMessage('La contraseña debe tener al menos 6 caracteres', 'warning');
      return;
    }

    setIsProcessing(true);
    try {
      await updatePassword(user, newPassword);
      showMessage('Contraseña actualizada correctamente', 'success');
      setOpenChangePassDialog(false);
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setPendingAction({ type: 'password', payload: newPassword });
        setOpenReauthDialog(true);
      } else {
        showMessage('Error: ' + err.message, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteAccountSubmit = async () => {
    if (!user) return;
    setIsProcessing(true);
    try {
      await deleteUser(user);
      showMessage('Cuenta eliminada permanentemente', 'success');
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setPendingAction({ type: 'delete' });
        setOpenReauthDialog(true);
      } else {
        showMessage('Error al eliminar cuenta: ' + err.message, 'error');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Estados para 2FA y Notificaciones
  const [newsletterEnabled, setNewsletterEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [open2FADialog, setOpen2FADialog] = useState(false);
  const [open2FAVerifyDialog, setOpen2FAVerifyDialog] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const recaptchaVerifierRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        setTwoFactorEnabled(multiFactor(currentUser).enrolledFactors.length > 0);
      }
    });

    // Check Notification permission
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushEnabled(Notification.permission === 'granted');
    }

    return () => unsubscribe();
  }, []);

  const handleToggleNewsletter = async () => {
    if (newsletterEnabled) {
      // Unsubscribe
      try {
        if (messaging) {
          const token = await getToken(messaging, {
            vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
          });
          if (token) {
            await unsubscribeFromTopicAction(token, 'newsletter');
          }
        }
        setNewsletterEnabled(false);
        showMessage('Suscripción al newsletter cancelada', 'success');
      } catch (error) {
        logger.error('Error unsubscribing:', error);
        // Even if server action fails, we update UI? Better to warn.
        // But for UX we might just disable it locally.
        setNewsletterEnabled(false);
        showMessage('Notificaciones desactivadas localmente', 'info');
      }
    } else {
      // Subscribe
      try {
        // Request permission if not granted
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          if (messaging) {
            const token = await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            if (token) {
              const result = await subscribeToTopicAction(token, 'newsletter');
              if (result.success) {
                setNewsletterEnabled(true);
                showMessage('Suscrito al newsletter exitosamente', 'success');
              } else {
                throw new Error(result.error);
              }
            }
          }
        } else {
          showMessage('Permiso de notificaciones denegado', 'warning');
        }
      } catch (error: any) {
        logger.error('Error subscribing:', error);
        showMessage('Error al suscribir: ' + error.message, 'error');
      }
    }
  };

  const handleTogglePush = async () => {
    if (!pushEnabled) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          if (messaging) {
            await getToken(messaging, {
              vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
            });
            setPushEnabled(true);
            showMessage('Notificaciones push activadas', 'success');
          } else {
            showMessage('El servicio de mensajería no está disponible', 'error');
          }
        } else {
          showMessage('Permiso de notificaciones denegado', 'warning');
        }
      } catch (error: any) {
        logger.error('Push notifications activation error', error);
        showMessage('Error al activar notificaciones', 'error');
      }
    } else {
      // No se puede "revocar" el permiso programáticamente, solo actualizar estado local
      setPushEnabled(false);
      showMessage('Notificaciones push desactivadas', 'info');
    }
  };

  const handleToggle2FA = async () => {
    if (twoFactorEnabled) {
      // Desactivar 2FA
      if (
        window.confirm(
          '¿Estás seguro de desactivar la autenticación de dos pasos? Esto reducirá la seguridad de tu cuenta.'
        )
      ) {
        try {
          setIsProcessing(true);
          const enrolledFactors = multiFactor(user!).enrolledFactors;
          if (enrolledFactors.length > 0) {
            await multiFactor(user!).unenroll(enrolledFactors[0]);
            setTwoFactorEnabled(false);
            showMessage('2FA desactivado correctamente', 'success');
          }
        } catch (error: any) {
          showMessage('Error al desactivar 2FA: ' + error.message, 'error');
        } finally {
          setIsProcessing(false);
        }
      }
    } else {
      // Activar 2FA - Abrir diálogo
      setOpen2FADialog(true);
      // Inicializar Recaptcha
      setTimeout(() => {
        if (!recaptchaVerifierRef.current && user) {
          try {
            recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
              size: 'invisible',
            });
          } catch (e) {
            logger.error('Recaptcha initialization error', e);
          }
        }
      }, 500);
    }
  };

  const handleSendPhoneCode = async () => {
    if (!phoneNumber) return;
    setIsProcessing(true);
    try {
      const session = await multiFactor(user!).getSession();
      const phoneOptions = {
        phoneNumber: phoneNumber,
        session: session,
      };
      const verificationId = await new PhoneAuthProvider(auth).verifyPhoneNumber(
        phoneOptions,
        recaptchaVerifierRef.current
      );
      setVerificationId(verificationId);
      setOpen2FADialog(false);
      setOpen2FAVerifyDialog(true);
      showMessage('Código enviado a su teléfono', 'success');
    } catch (error: any) {
      logger.error('Error sending 2FA phone code', error);
      showMessage('Error enviando código: ' + error.message, 'error');
      // Reset recaptcha
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVerifyPhoneCode = async () => {
    if (!verificationCode || !verificationId) return;
    setIsProcessing(true);
    try {
      const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
      const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
      await multiFactor(user!).enroll(multiFactorAssertion, 'Número Personal');
      setTwoFactorEnabled(true);
      setOpen2FAVerifyDialog(false);
      showMessage('2FA activado correctamente', 'success');
    } catch (error: any) {
      showMessage('Error verificando código: ' + error.message, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsProcessing(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
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
    } catch (error: any) {
      logger.error('Sign out error', error);
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

  if (loading) {
    return (
      <Box
        display="flex"
        minHeight="100vh"
        alignItems="center"
        justifyContent="center"
        sx={{ bgcolor: 'background.default' }}
      >
        <CircularProgress size={40} thickness={4} />
      </Box>
    );
  }

  const sidebarItems = [
    { id: 'profile', label: 'Mi Perfil', icon: <PersonIcon /> },
    { id: 'security', label: 'Seguridad', icon: <SecurityIcon /> },
    { id: 'activity', label: 'Actividad', icon: <HistoryIcon /> },
    { id: 'settings', label: 'Ajustes', icon: <SettingsIcon /> },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        backgroundImage: `linear-gradient(${alpha(theme.palette.text.primary, 0.03)} 1px, transparent 1px), linear-gradient(90deg, ${alpha(theme.palette.text.primary, 0.03)} 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />

      <Container maxWidth="xl" sx={{ flexGrow: 1, pt: { xs: 16, md: 20 }, pb: { xs: 4, md: 8 } }}>
        {!user ? (
          // Auth Layout
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '60vh',
            }}
          >
            <Grow in timeout={600}>
              <GlassCard sx={{ maxWidth: 450, width: '100%', p: { xs: 4, sm: 6 } }}>
                <Box
                  component={Link}
                  href="/"
                  sx={{ display: 'block', textAlign: 'center', mb: 4 }}
                >
                  <Image
                    src={logo}
                    alt="V-Trading Logo"
                    width={180}
                    height={48}
                    style={{
                      height: 'auto',
                      margin: '0 auto',
                      filter: theme.palette.mode === 'dark' ? 'brightness(0) invert(1)' : 'none',
                    }}
                  />
                </Box>

                <Typography variant="h4" fontWeight="800" align="center" gutterBottom>
                  {authMode === 'login' ? 'Bienvenido' : 'Crear Cuenta'}
                </Typography>
                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 4 }}>
                  {authMode === 'login'
                    ? 'Accede a tu panel de control financiero'
                    : 'Únete a la comunidad de VTrading'}
                </Typography>

                <form onSubmit={handleEmailAuth}>
                  {authMode === 'register' && (
                    <TextField
                      fullWidth
                      label="Nombre completo"
                      margin="normal"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 3 },
                      }}
                    />
                  )}
                  <TextField
                    fullWidth
                    label="Correo electrónico"
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="action" />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 },
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Contraseña"
                    type={showPassword ? 'text' : 'password'}
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 3 },
                    }}
                  />

                  {authMode === 'login' && (
                    <Box textAlign="right" mt={1}>
                      <Button
                        onClick={handleForgotPassword}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
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
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '1rem',
                    }}
                  >
                    {isProcessing ? (
                      <CircularProgress size={24} />
                    ) : authMode === 'login' ? (
                      'Iniciar Sesión'
                    ) : (
                      'Registrarse'
                    )}
                  </Button>
                </form>

                <Divider sx={{ my: 4 }}>O continúa con</Divider>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleGoogleAuth}
                  startIcon={<GoogleIcon />}
                  sx={{ py: 1.5, borderRadius: 3, textTransform: 'none', fontWeight: 700 }}
                >
                  Google
                </Button>

                <Box mt={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    {authMode === 'login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                    <Button
                      onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                      sx={{ ml: 1, fontWeight: 800, textTransform: 'none' }}
                    >
                      {authMode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                    </Button>
                  </Typography>
                </Box>
              </GlassCard>
            </Grow>
          </Box>
        ) : (
          // Dashboard Layout
          <Grid container spacing={4}>
            {/* Sidebar */}
            <Grid size={{ xs: 12, lg: 3 }}>
              <GlassCard sx={{ position: 'sticky', top: 100, py: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  {sidebarItems.map((item) => (
                    <Box
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        px: 3,
                        py: 2,
                        cursor: 'pointer',
                        color: activeTab === item.id ? 'primary.main' : 'text.secondary',
                        bgcolor:
                          activeTab === item.id
                            ? alpha(theme.palette.primary.main, 0.08)
                            : 'transparent',
                        borderRight:
                          activeTab === item.id
                            ? `3px solid ${theme.palette.primary.main}`
                            : '3px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': {
                          bgcolor: alpha(theme.palette.text.primary, 0.05),
                          color: 'text.primary',
                        },
                      }}
                    >
                      {item.icon}
                      <Typography fontWeight="600">{item.label}</Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2, mx: 3 }} />

                  <Box sx={{ px: 3, pb: 1 }}>
                    <Button
                      fullWidth
                      color="error"
                      variant="outlined"
                      startIcon={<LogoutIcon />}
                      onClick={handleSignOut}
                      sx={{
                        justifyContent: 'flex-start',
                        bgcolor: alpha(theme.palette.error.main, 0.1),
                        color: 'error.main',
                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) },
                      }}
                    >
                      Cerrar Sesión
                    </Button>
                  </Box>
                </Box>
              </GlassCard>
            </Grid>

            {/* Main Content */}
            <Grid
              size={{ xs: 12, lg: 9 }}
              sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
            >
              {/* Header Card (Always visible or part of Profile) */}
              <GlassCard sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <Avatar
                      src={user.photoURL || (user.email ? getGravatarUrl(user.email) : undefined)}
                      alt={user.displayName || 'Usuario'}
                      sx={{
                        width: 100,
                        height: 100,
                        fontSize: '2.5rem',
                        fontWeight: 800,
                        bgcolor: 'primary.main',
                        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.4)}`,
                        border: `4px solid ${theme.palette.background.paper}`,
                      }}
                    >
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </Avatar>
                    <IconButton
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: 2,
                        '&:hover': { bgcolor: 'background.default' },
                      }}
                    >
                      <PhotoCameraIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ textAlign: { xs: 'center', md: 'left' }, flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        justifyContent: { xs: 'center', md: 'flex-start' },
                        mb: 1,
                      }}
                    >
                      <Typography variant="h4" fontWeight="800">
                        {user.displayName || 'Usuario VTrading'}
                      </Typography>
                      <Chip
                        label="PREMIUM"
                        size="small"
                        color="primary"
                        sx={{ fontWeight: 900, borderRadius: 1, height: 20, fontSize: '0.65rem' }}
                      />
                    </Box>
                    <Typography color="text.secondary" sx={{ mb: 0.5 }}>
                      {user.email}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="text.disabled"
                      sx={{ fontStyle: 'italic' }}
                    >
                      Miembro desde{' '}
                      {new Date(user.metadata.creationTime || Date.now()).toLocaleDateString()}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600 }}
                  >
                    Editar Perfil
                  </Button>
                </Box>
              </GlassCard>

              {/* Sections */}
              {activeTab === 'security' && (
                <Fade in>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <GlassCard sx={{ p: 4 }}>
                      <SectionTitle
                        icon={<VerifiedUserIcon color="primary" />}
                        title="Seguridad de la Cuenta"
                      />

                      <List disablePadding>
                        <ListItem
                          sx={{
                            bgcolor: alpha(theme.palette.text.primary, 0.03),
                            borderRadius: 3,
                            mb: 2,
                            p: 2,
                          }}
                        >
                          <ListItemIcon>
                            <VibrationIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography fontWeight="600">
                                Autenticación de dos pasos (2FA)
                              </Typography>
                            }
                            secondary={
                              twoFactorEnabled
                                ? 'Activado'
                                : 'Añade una capa extra de seguridad a tu cuenta.'
                            }
                          />
                          <Switch checked={twoFactorEnabled} onChange={handleToggle2FA} />
                        </ListItem>

                        <ListItem
                          sx={{
                            bgcolor: alpha(theme.palette.text.primary, 0.03),
                            borderRadius: 3,
                            p: 2,
                          }}
                        >
                          <ListItemIcon>
                            <LockIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography fontWeight="600">Contraseña</Typography>}
                            secondary={
                              user?.metadata?.lastSignInTime
                                ? `Último acceso: ${new Date(user.metadata.lastSignInTime).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' })}`
                                : 'Protege tu cuenta con una contraseña segura.'
                            }
                          />
                          <Button
                            size="small"
                            sx={{ fontWeight: 700 }}
                            onClick={() => setOpenChangePassDialog(true)}
                          >
                            Cambiar
                          </Button>
                        </ListItem>
                      </List>
                    </GlassCard>

                    <GlassCard
                      sx={{ p: 4, opacity: 0.6, pointerEvents: 'none', filter: 'grayscale(1)' }}
                    >
                      <Typography
                        variant="subtitle2"
                        fontWeight="800"
                        color="text.secondary"
                        sx={{ mb: 3, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                      >
                        Sesiones Activas (En Construcción)
                      </Typography>

                      <List disablePadding>
                        <ListItem
                          sx={{ borderBottom: `1px solid ${theme.palette.divider}`, py: 2 }}
                        >
                          <ListItemIcon>
                            <LaptopMacIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography fontWeight="600">Dispositivo Actual</Typography>}
                            secondary="Ubicación desconocida • IP: ---.---.---.---"
                          />
                          <Chip
                            label="ACTIVA"
                            color="success"
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 800, fontSize: '0.65rem' }}
                          />
                        </ListItem>
                        <ListItem sx={{ py: 2 }}>
                          <ListItemIcon>
                            <SmartphoneIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography fontWeight="600">Dispositivo Móvil</Typography>}
                            secondary="Hace -- horas"
                          />
                          <Button
                            color="error"
                            size="small"
                            sx={{ fontSize: '0.75rem', fontWeight: 700 }}
                            disabled
                          >
                            CERRAR
                          </Button>
                        </ListItem>
                      </List>
                    </GlassCard>
                  </Box>
                </Fade>
              )}

              {activeTab === 'activity' && (
                <Fade in>
                  <GlassCard
                    sx={{
                      p: 4,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: 300,
                      textAlign: 'center',
                    }}
                  >
                    <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h5" fontWeight="800" color="text.secondary" gutterBottom>
                      Sección en Construcción
                    </Typography>
                    <Typography color="text.disabled" sx={{ maxWidth: 400 }}>
                      Estamos trabajando para traerte un historial detallado de tu actividad en la
                      plataforma. ¡Pronto disponible!
                    </Typography>
                  </GlassCard>
                </Fade>
              )}

              {(activeTab === 'settings' || activeTab === 'profile') && (
                <Fade in>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* Only show Settings content if tab is settings, or if profile (default view includes settings often? No, let's keep strict tabs) */}
                    {/* Actually, for 'profile' tab, maybe we just show basic info or edit form. Let's make 'profile' show a summary or edit form */}

                    {activeTab === 'profile' && (
                      <GlassCard sx={{ p: 4 }}>
                        <SectionTitle
                          icon={<PersonIcon color="primary" />}
                          title="Información Personal"
                        />
                        <Grid container spacing={3}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Nombre completo"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              fullWidth
                              label="Correo electrónico"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              variant="outlined"
                              helperText="Cambiar el email puede requerir re-autenticación"
                            />
                          </Grid>
                          <Grid size={12}>
                            <TextField
                              fullWidth
                              label="Descripción (En Construcción)"
                              multiline
                              rows={3}
                              placeholder="Próximamente podrás añadir una descripción..."
                              variant="outlined"
                              disabled
                            />
                          </Grid>
                          <Grid size={12} sx={{ textAlign: 'right' }}>
                            <Button
                              variant="contained"
                              sx={{ fontWeight: 800 }}
                              onClick={handleUpdateProfileData}
                              disabled={isProcessing}
                            >
                              {isProcessing ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                          </Grid>
                        </Grid>
                      </GlassCard>
                    )}

                    {activeTab === 'settings' && (
                      <GlassCard sx={{ p: 4 }}>
                        <SectionTitle
                          icon={<SettingsIcon color="primary" />}
                          title="Preferencias Globales"
                        />

                        <Grid container spacing={4}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Typography
                              variant="subtitle2"
                              fontWeight="800"
                              color="text.secondary"
                              sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            >
                              Notificaciones
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  opacity: 0.5,
                                  pointerEvents: 'none',
                                }}
                              >
                                <Typography variant="body2">
                                  Alertas de precio por Email (En Construcción)
                                </Typography>
                                <Switch disabled />
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography variant="body2">Notificaciones Push</Typography>
                                <Switch checked={pushEnabled} onChange={handleTogglePush} />
                              </Box>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Typography variant="body2">Newsletter semanal</Typography>
                                <Switch
                                  checked={newsletterEnabled}
                                  onChange={handleToggleNewsletter}
                                />
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box sx={{ mb: 4, opacity: 0.5, pointerEvents: 'none' }}>
                              <Typography
                                variant="subtitle2"
                                fontWeight="800"
                                color="text.secondary"
                                sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                              >
                                Idioma (En Construcción)
                              </Typography>
                              <FormControl fullWidth size="small" disabled>
                                <Select value="es" sx={{ borderRadius: 2 }}>
                                  <MenuItem value="es">Español (ES)</MenuItem>
                                </Select>
                              </FormControl>
                            </Box>

                            <Box>
                              <Typography
                                variant="subtitle2"
                                fontWeight="800"
                                color="text.secondary"
                                sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                              >
                                Tema
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button
                                  variant={theme.palette.mode === 'dark' ? 'contained' : 'outlined'}
                                  startIcon={<DarkIcon />}
                                  onClick={colorMode.toggleColorMode}
                                  fullWidth
                                  sx={{ borderRadius: 3 }}
                                >
                                  Oscuro
                                </Button>
                                <Button
                                  variant={
                                    theme.palette.mode === 'light' ? 'contained' : 'outlined'
                                  }
                                  startIcon={<LightIcon />}
                                  onClick={colorMode.toggleColorMode}
                                  fullWidth
                                  sx={{ borderRadius: 3 }}
                                >
                                  Claro
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>

                        <Box
                          sx={{
                            mt: 4,
                            pt: 4,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography
                              variant="subtitle2"
                              fontWeight="800"
                              color="error.main"
                              sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}
                            >
                              Zona de Peligro
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              Esta acción no se puede deshacer.
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            color="error"
                            sx={{ borderRadius: 3, fontWeight: 800 }}
                            onClick={() => setOpenDeleteAccountDialog(true)}
                          >
                            Eliminar Cuenta
                          </Button>
                        </Box>

                        <Box
                          sx={{
                            mt: 4,
                            pt: 4,
                            borderTop: `1px solid ${theme.palette.divider}`,
                            display: 'flex',
                            justifyContent: 'flex-end',
                          }}
                        >
                          <Button
                            variant="contained"
                            size="large"
                            sx={{ px: 4, borderRadius: 3, fontWeight: 800 }}
                          >
                            Guardar Preferencias
                          </Button>
                        </Box>
                      </GlassCard>
                    )}
                  </Box>
                </Fade>
              )}
            </Grid>
          </Grid>
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Footer />

      {/* --- Dialogs --- */}

      {/* Re-Auth Dialog */}
      <Dialog open={openReauthDialog} onClose={() => setOpenReauthDialog(false)}>
        <DialogTitle>Confirmar Identidad</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Para continuar con esta acción sensible, por favor confirma tu contraseña actual.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            type="password"
            label="Contraseña Actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReauthDialog(false)}>Cancelar</Button>
          <Button onClick={handleReauthSubmit} variant="contained" disabled={isProcessing}>
            {isProcessing ? 'Verificando...' : 'Confirmar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo 2FA Telefono */}
      <Dialog open={open2FADialog} onClose={() => setOpen2FADialog(false)}>
        <DialogTitle>Configurar 2FA</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Ingresa tu número de teléfono para recibir un código de verificación por SMS.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Número de Teléfono (+58...)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+584121234567"
            variant="outlined"
          />
          <div id="recaptcha-container" style={{ marginTop: 20 }}></div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen2FADialog(false)}>Cancelar</Button>
          <Button onClick={handleSendPhoneCode} variant="contained" disabled={isProcessing}>
            {isProcessing ? 'Enviando...' : 'Enviar Código'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo 2FA Verificacion */}
      <Dialog open={open2FAVerifyDialog} onClose={() => setOpen2FAVerifyDialog(false)}>
        <DialogTitle>Verificar Código</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Ingresa el código de 6 dígitos que enviamos a {phoneNumber}.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Código de Verificación"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="123456"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen2FAVerifyDialog(false)}>Cancelar</Button>
          <Button onClick={handleVerifyPhoneCode} variant="contained" disabled={isProcessing}>
            {isProcessing ? 'Verificando...' : 'Verificar y Activar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={openChangePassDialog} onClose={() => setOpenChangePassDialog(false)}>
        <DialogTitle>Cambiar Contraseña</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Ingresa tu nueva contraseña. Debe tener al menos 6 caracteres.
          </DialogContentText>
          <TextField
            fullWidth
            type="password"
            label="Nueva Contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Confirmar Nueva Contraseña"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePassDialog(false)}>Cancelar</Button>
          <Button onClick={handleChangePasswordSubmit} variant="contained" disabled={isProcessing}>
            {isProcessing ? 'Actualizando...' : 'Cambiar Contraseña'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={openDeleteAccountDialog} onClose={() => setOpenDeleteAccountDialog(false)}>
        <DialogTitle sx={{ color: 'error.main' }}>¿Eliminar Cuenta?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Estás a punto de eliminar tu cuenta permanentemente. Todos tus datos se perderán y no
            podrás recuperarlos.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteAccountDialog(false)}>Cancelar</Button>
          <Button
            onClick={handleDeleteAccountSubmit}
            variant="contained"
            color="error"
            disabled={isProcessing}
          >
            {isProcessing ? 'Eliminando...' : 'Sí, Eliminar Cuenta'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
