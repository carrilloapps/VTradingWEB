'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { 
  applyActionCode, 
  checkActionCode, 
  confirmPasswordReset
} from 'firebase/auth';
import Link from 'next/link';

// MUI Imports
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  IconButton,
  InputAdornment
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  LockReset as LockResetIcon,
  MarkEmailRead as MarkEmailReadIcon,
  ArrowBack as ArrowBackIcon,
  Restore as RestoreIcon
} from '@mui/icons-material';

// --- Styled Components ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        ...sx
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

function AuthActionContent() {
  const searchParams = useSearchParams();
  // const router = useRouter();
  const theme = useTheme();

  const mode = searchParams.get('mode');
  const oobCode = searchParams.get('oobCode');
  // const apiKey = searchParams.get('apiKey'); // Not usually needed if firebase is initialized

  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'input'>('loading');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  
  // Password Reset States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!oobCode || !mode) {
      setStatus('error');
      setMessage('Enlace inválido o expirado. Faltan parámetros requeridos.');
      return;
    }

    // Initial check for some modes or direct execution for others
    const initAction = async () => {
      try {
        // First verify the code is valid
        const info = await checkActionCode(auth, oobCode);
        setEmail(info.data.email || '');

        if (mode === 'resetPassword') {
          setStatus('input'); // Show password reset form
        } else if (mode === 'recoverEmail') {
          setStatus('input'); // Show confirmation before reverting
        } else if (mode === 'verifyEmail') {
          // Can auto-verify or ask user to click. Let's auto-verify for better UX, 
          // or show a "Click to verify" button. 
          // Auto-verify is common.
          await handleVerifyEmail(oobCode);
        } else {
          setStatus('error');
          setMessage('Modo de operación no soportado.');
        }
      } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
        console.error('Action Code Error:', error);
        setStatus('error');
        setMessage(getErrorMessage(error));
      }
    };

    initAction();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, oobCode]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getErrorMessage = (error: any) => {
    switch (error.code) {
      case 'auth/expired-action-code':
        return 'El enlace ha expirado. Por favor solicita uno nuevo.';
      case 'auth/invalid-action-code':
        return 'El enlace es inválido o ya ha sido usado.';
      case 'auth/user-disabled':
        return 'El usuario correspondiente a este enlace ha sido deshabilitado.';
      case 'auth/user-not-found':
        return 'No se encontró el usuario.';
      case 'auth/weak-password':
        return 'La contraseña es demasiado débil.';
      default:
        return error.message || 'Ocurrió un error desconocido.';
    }
  };

  const handleVerifyEmail = async (code: string) => {
    try {
      await applyActionCode(auth, code);
      setStatus('success');
      setMessage('Tu correo electrónico ha sido verificado exitosamente.');
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setStatus('error');
      setMessage(getErrorMessage(error));
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('Las contraseñas no coinciden.');
      return;
    }
    if (newPassword.length < 6) {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (oobCode) {
        await confirmPasswordReset(auth, oobCode, newPassword);
        setStatus('success');
        setMessage('Tu contraseña ha sido restablecida correctamente. Ya puedes iniciar sesión con tu nueva contraseña.');
      }
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRecoverEmail = async () => {
    setIsSubmitting(true);
    try {
      if (oobCode) {
        await applyActionCode(auth, oobCode);
        setStatus('success');
        setMessage('Se ha restaurado tu dirección de correo electrónico anterior. Te hemos enviado un correo para restablecer tu contraseña por seguridad.');
      }
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setStatus('error');
      setMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render Helpers ---

  const renderIcon = () => {
    switch (mode) {
      case 'resetPassword': return <LockResetIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />;
      case 'verifyEmail': return <MarkEmailReadIcon sx={{ fontSize: 60, color: theme.palette.primary.main }} />;
      case 'recoverEmail': return <RestoreIcon sx={{ fontSize: 60, color: theme.palette.warning.main }} />;
      default: return <ErrorIcon sx={{ fontSize: 60, color: theme.palette.error.main }} />;
    }
  };

  const renderTitle = () => {
    if (status === 'loading') return 'Procesando...';
    if (status === 'error') return 'Error';
    
    switch (mode) {
      case 'resetPassword': return status === 'success' ? 'Contraseña Restablecida' : 'Restablecer Contraseña';
      case 'verifyEmail': return status === 'success' ? 'Email Verificado' : 'Verificando Email';
      case 'recoverEmail': return status === 'success' ? 'Email Restaurado' : 'Restaurar Email';
      default: return 'Acción Desconocida';
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <GlassCard sx={{ p: 4, width: '100%', textAlign: 'center' }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          {status === 'loading' ? (
            <CircularProgress size={60} />
          ) : status === 'error' ? (
            <ErrorIcon sx={{ fontSize: 60, color: theme.palette.error.main }} />
          ) : status === 'success' ? (
            <CheckCircleIcon sx={{ fontSize: 60, color: theme.palette.success.main }} />
          ) : (
            renderIcon()
          )}
        </Box>

        <Typography variant="h4" fontWeight="800" gutterBottom>
          {renderTitle()}
        </Typography>

        {email && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {email}
          </Typography>
        )}

        {/* Message / Alert */}
        {message && (status === 'error' || status === 'success' || (status === 'input' && message && mode === 'resetPassword')) && (
          <Alert 
            severity={status === 'error' ? 'error' : status === 'success' ? 'success' : 'info'}
            sx={{ mb: 3, textAlign: 'left' }}
          >
            {message}
          </Alert>
        )}

        {/* Reset Password Form */}
        {status === 'input' && mode === 'resetPassword' && (
          <Box component="form" sx={{ mt: 2, textAlign: 'left' }}>
             <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Nueva Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Contraseña"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, fontWeight: 800 }}
              onClick={handleResetPassword}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Restableciendo...' : 'Restablecer Contraseña'}
            </Button>
          </Box>
        )}

        {/* Recover Email Confirmation */}
        {status === 'input' && mode === 'recoverEmail' && (
          <Box sx={{ mt: 2 }}>
            <Typography paragraph>
              ¿Deseas revertir el cambio de correo electrónico y restaurar el acceso a esta cuenta?
            </Typography>
            <Button
              fullWidth
              variant="contained"
              color="warning"
              size="large"
              sx={{ mt: 2, mb: 2, fontWeight: 800 }}
              onClick={handleRecoverEmail}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Procesando...' : 'Sí, restaurar mi email'}
            </Button>
          </Box>
        )}

        {/* Success / Navigation Actions */}
        {(status === 'success' || status === 'error') && (
          <Box sx={{ mt: 3 }}>
            <Link href="/" passHref style={{ textDecoration: 'none' }}>
              <Button startIcon={<ArrowBackIcon />}>
                Volver al Inicio
              </Button>
            </Link>
            {status === 'success' && mode === 'resetPassword' && (
              <Link href="/cuenta" passHref style={{ textDecoration: 'none' }}>
                <Button variant="contained" sx={{ ml: 2 }}>
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </Box>
        )}
      </GlassCard>
    </Container>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense fallback={
      <Container maxWidth="sm" sx={{ py: 8, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    }>
      <AuthActionContent />
    </Suspense>
  );
}
