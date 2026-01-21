'use client';

import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  useTheme, 
  alpha,
  Fade,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Componente para el Gauge de Integridad
const IntegrityGauge = ({ value }: { value: number }) => {
  const theme = useTheme();
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <Box sx={{ position: 'relative', width: 200, height: 200, mb: 3 }}>
      <svg width="200" height="200" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke={alpha(theme.palette.divider, 0.1)}
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          stroke="#00FF94"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary' }}>
          Integrity Index
        </Typography>
      </Box>
    </Box>
  );
};

// Componente para los logs de actividad
const ActivityLogs = () => {
  const [logs, setLogs] = useState([
    { time: '14:02:11', type: 'INFO', message: 'Connected to BCV Gateway.', color: '#3B82F6' },
    { time: '14:02:12', type: 'SUCCESS', message: 'Fetched USD/VES from BCV...', status: 'OK', color: '#00FF94' },
    { time: '14:02:15', type: 'INFO', message: 'Polling IBVC Index session start.', color: '#3B82F6' },
    { time: '14:02:18', type: 'SUCCESS', message: 'BTC/VES update broadcasted to 12.4k clients.', color: '#00FF94' },
    { time: '14:02:22', type: 'WARN', message: 'P2P Latency spike detected (+120ms).', color: '#F59E0B' },
    { time: '14:02:25', type: 'INFO', message: 'Checksum validation for MVZ.A...', status: 'VALID', color: '#3B82F6' },
    { time: '14:02:30', type: 'SUCCESS', message: 'Fetched USDT/VES P2P...', status: 'OK', color: '#00FF94' },
  ]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: 'black',
        borderRadius: 6,
        border: '1px solid',
        borderColor: alpha('#fff', 0.1),
        height: 400,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'JetBrains Mono, monospace',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, mb: 2, pb: 2, borderBottom: '1px solid', borderColor: alpha('#fff', 0.05) }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#EF4444' }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#F59E0B' }} />
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#00FF94' }} />
        <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary', fontWeight: 700, fontSize: '0.6rem' }}>
          VTR-MONITOR-CLI
        </Typography>
      </Box>
      <Box sx={{ flex: 1, overflowY: 'auto', '&::-webkit-scrollbar': { width: 4 }, '&::-webkit-scrollbar-thumb': { bgcolor: alpha('#fff', 0.1), borderRadius: 10 } }}>
        {logs.map((log, i) => (
          <Box key={i} sx={{ mb: 1, fontSize: '0.75rem' }}>
            <Typography component="span" sx={{ color: 'text.secondary', fontSize: 'inherit' }}>[{log.time}] </Typography>
            <Typography component="span" sx={{ color: log.color, fontWeight: 700, fontSize: 'inherit' }}>{log.type}: </Typography>
            <Typography component="span" sx={{ color: 'text.primary', fontSize: 'inherit' }}>{log.message} </Typography>
            {log.status && (
              <Typography component="span" sx={{ color: log.color, fontWeight: 900, fontSize: 'inherit' }}>{log.status}</Typography>
            )}
          </Box>
        ))}
        <Box sx={{ display: 'inline-block', width: 8, height: 16, bgcolor: '#00FF94', animation: 'pulse 1s infinite', verticalAlign: 'middle', ml: 0.5 }} />
      </Box>
    </Paper>
  );
};

import { getMarketDataAction } from '@/app/actions/market';

export default function StatusPage() {
  const theme = useTheme();
  const [marketData, setMarketData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMarketDataAction();
        setMarketData(data);
      } catch (error) {
        console.error('Error fetching market status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  const services = [
    { name: 'BCV-API-RELAY', source: 'bcv.org.ve', uptime: '99.98%', status: marketData?.status?.state || 'OPERATIONAL', color: marketData?.status?.state === 'CERRADO' ? '#FF3B3B' : '#00FF94' },
    { name: 'BVC-MARKET-FEED', source: 'bolsadecaracas.com', uptime: '99.92%', status: marketData?.status?.state || 'OPERATIONAL', color: marketData?.status?.state === 'CERRADO' ? '#FF3B3B' : '#00FF94' },
    { name: 'P2P-BIN-AGGREGATOR', source: 'p2p.distributed.io', uptime: '98.45%', status: 'OPERATIONAL', color: '#00FF94' },
    { name: 'AUTH-V3-GATEWAY', source: 'internal-aws-us-east', uptime: '100.00%', status: 'OPERATIONAL', color: '#00FF94' },
    { name: 'TICKER-WEBSOCKET', source: 'ws.vtrading.io', uptime: '99.99%', status: 'OPERATIONAL', color: '#00FF94' },
  ];

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <Container maxWidth="lg" sx={{ pt: { xs: 20, md: 25 }, pb: 15, flex: 1 }}>
        <Fade in timeout={1000}>
          <Box sx={{ mb: 8 }}>
            <Box 
              sx={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: 1.5, 
                px: 2, 
                py: 0.8, 
                borderRadius: 2, 
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                mb: 3
              }}
            >
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#00FF94', animation: 'pulse 2s infinite' }} />
              <Typography variant="caption" sx={{ fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'text.secondary', fontSize: '0.65rem' }}>
                System Infrastructure Health
              </Typography>
            </Box>
            
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, letterSpacing: '-0.03em', fontSize: { xs: '2.5rem', md: '4rem' } }}>
              System <Box component="span" sx={{ color: 'primary.main' }}>Status</Box>
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, fontSize: '1.1rem', lineHeight: 1.6 }}>
              Real-time status of data ingestion clusters, gateway nodes, and distributed service health.
            </Typography>
          </Box>
        </Fade>

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {/* Integrity Index Gauge */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 6,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  bgcolor: '#00FF94',
                }
              }}
            >
              <IntegrityGauge value={marketData?.status?.state === 'CERRADO' ? 95.0 : 99.2} />
              <Chip 
                label={marketData?.status?.state === 'CERRADO' ? "Market Closed" : "All Systems Operational"} 
                sx={{ 
                  bgcolor: alpha(marketData?.status?.state === 'CERRADO' ? '#FF3B3B' : '#00FF94', 0.1), 
                  color: marketData?.status?.state === 'CERRADO' ? '#FF3B3B' : '#00FF94', 
                  fontWeight: 900, 
                  fontSize: '0.7rem',
                  borderRadius: 2,
                  border: `1px solid ${alpha(marketData?.status?.state === 'CERRADO' ? '#FF3B3B' : '#00FF94', 0.2)}`,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }} 
              />
            </Paper>
          </Grid>

          {/* Node Distribution Grid */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                height: '100%',
                borderRadius: 6,
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 0.5 }}>Node Distribution</Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>Active regional data relays & ingestors</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  {['AMER: ACTIVE', 'EMEA: ACTIVE'].map((region) => (
                    <Box 
                      key={region}
                      sx={{ 
                        px: 1.5, 
                        py: 0.5, 
                        bgcolor: alpha(theme.palette.divider, 0.05), 
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                        fontSize: '0.6rem',
                        fontFamily: 'JetBrains Mono, monospace',
                        fontWeight: 700,
                        color: 'text.secondary'
                      }}
                    >
                      {region}
                    </Box>
                  ))}
                </Box>
              </Box>

              <Grid container spacing={1.5}>
                {Array.from({ length: 16 }).map((_, i) => (
                  <Grid key={i} size={{ xs: 3, sm: 1.5 }}>
                    <Box
                      sx={{
                        aspectRatio: '1/1',
                        borderRadius: 2,
                        bgcolor: alpha(i === 2 || i === 14 ? '#3B82F6' : i === 10 ? '#F59E0B' : '#00FF94', 0.1),
                        border: '1px solid',
                        borderColor: alpha(i === 2 || i === 14 ? '#3B82F6' : i === 10 ? '#F59E0B' : '#00FF94', 0.2),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          bgcolor: alpha(i === 2 || i === 14 ? '#3B82F6' : i === 10 ? '#F59E0B' : '#00FF94', 0.2),
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 6, 
                          height: 6, 
                          borderRadius: '50%', 
                          bgcolor: i === 2 || i === 14 ? '#3B82F6' : i === 10 ? '#F59E0B' : '#00FF94',
                          animation: i === 0 ? 'pulse 2s infinite' : 'none'
                        }} 
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ position: 'absolute', bottom: 24, left: 32, right: 32, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'text.secondary' }}>
                  VTR-GATEWAY-X1-CLUSTER: <Box component="span" sx={{ color: '#00FF94' }}>ONLINE</Box>
                </Typography>
                <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', fontSize: '0.6rem', color: 'text.secondary' }}>
                  LATENCY: 42ms
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Active Service Nodes Table */}
          <Grid size={{ xs: 12, lg: 8 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ color: 'primary.main', display: 'flex' }}>
                <span className="material-symbols-outlined">dns</span>
              </Box>
              Active Service Nodes
            </Typography>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 6, border: `1px solid ${theme.palette.divider}`, bgcolor: 'background.paper' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha(theme.palette.divider, 0.05) }}>
                    {['Service Name', 'Source', 'Uptime', 'Status'].map((head) => (
                      <TableCell key={head} sx={{ py: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
                        <Typography variant="caption" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'text.secondary' }}>
                          {head}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.name} sx={{ '&:hover': { bgcolor: alpha(theme.palette.divider, 0.02) } }}>
                      <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>{service.name}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                        <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary' }}>{service.source}</Typography>
                      </TableCell>
                      <TableCell sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                        <Typography variant="caption" sx={{ fontFamily: 'JetBrains Mono', color: 'text.secondary' }}>{service.uptime}</Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}` }}>
                        <Chip 
                          label={service.status} 
                          sx={{ 
                            height: 24,
                            bgcolor: alpha(service.color, 0.1), 
                            color: service.color, 
                            fontWeight: 800, 
                            fontSize: '0.6rem',
                            borderRadius: 1.5,
                            border: `1px solid ${alpha(service.color, 0.2)}`
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          {/* Activity Logs */}
          <Grid size={{ xs: 12, lg: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 800, mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ color: '#00FF94', display: 'flex' }}>
                <span className="material-symbols-outlined">terminal</span>
              </Box>
              Live Activity Logs
            </Typography>
            <ActivityLogs />
          </Grid>
        </Grid>
      </Container>

      <Footer />
      
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}
