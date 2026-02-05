/**
 * CountryPhoneInput Component
 * Reusable country selector with phone input and search functionality
 * Full Material UI Design System compliance
 */

'use client';

import React, { useMemo } from 'react';
import {
  parsePhoneNumber,
  getExampleNumber,
  AsYouType,
  CountryCode,
} from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';
import {
  Box,
  TextField,
  Grid,
  Autocomplete,
  Typography,
  useTheme,
  alpha,
  Avatar,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  InputAdornment,
  Chip,
  AutocompleteRenderInputParams,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

// Import flag SVGs
import CO from 'country-flag-icons/react/3x2/CO';
import US from 'country-flag-icons/react/3x2/US';
import MX from 'country-flag-icons/react/3x2/MX';
import AR from 'country-flag-icons/react/3x2/AR';
import CL from 'country-flag-icons/react/3x2/CL';
import PE from 'country-flag-icons/react/3x2/PE';
import EC from 'country-flag-icons/react/3x2/EC';
import VE from 'country-flag-icons/react/3x2/VE';
import BR from 'country-flag-icons/react/3x2/BR';
import ES from 'country-flag-icons/react/3x2/ES';
import PA from 'country-flag-icons/react/3x2/PA';
import CR from 'country-flag-icons/react/3x2/CR';
import CA from 'country-flag-icons/react/3x2/CA';
import GB from 'country-flag-icons/react/3x2/GB';
import UY from 'country-flag-icons/react/3x2/UY';
import BO from 'country-flag-icons/react/3x2/BO';
import PY from 'country-flag-icons/react/3x2/PY';
import DO from 'country-flag-icons/react/3x2/DO';
import GT from 'country-flag-icons/react/3x2/GT';
import HN from 'country-flag-icons/react/3x2/HN';
import NI from 'country-flag-icons/react/3x2/NI';
import SV from 'country-flag-icons/react/3x2/SV';
import FR from 'country-flag-icons/react/3x2/FR';
import DE from 'country-flag-icons/react/3x2/DE';
import IT from 'country-flag-icons/react/3x2/IT';
import PT from 'country-flag-icons/react/3x2/PT';
import CN from 'country-flag-icons/react/3x2/CN';
import JP from 'country-flag-icons/react/3x2/JP';
import IN from 'country-flag-icons/react/3x2/IN';
import AU from 'country-flag-icons/react/3x2/AU';

export interface Country {
  code: string;
  name: string;
  dial: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Flag: any; // SVG Component from country-flag-icons library
}

// Countries ordered by Venezuelan diaspora: Venezuela first, then main destination countries
export const ALL_COUNTRIES: Country[] = [
  // Venezuela y principales destinos de la diáspora venezolana
  { code: 'VE', name: 'Venezuela', dial: '+58', Flag: VE },
  { code: 'CO', name: 'Colombia', dial: '+57', Flag: CO },
  { code: 'PE', name: 'Perú', dial: '+51', Flag: PE },
  { code: 'EC', name: 'Ecuador', dial: '+593', Flag: EC },
  { code: 'CL', name: 'Chile', dial: '+56', Flag: CL },
  { code: 'BR', name: 'Brasil', dial: '+55', Flag: BR },
  { code: 'US', name: 'Estados Unidos', dial: '+1', Flag: US },
  { code: 'AR', name: 'Argentina', dial: '+54', Flag: AR },
  { code: 'ES', name: 'España', dial: '+34', Flag: ES },
  { code: 'MX', name: 'México', dial: '+52', Flag: MX },
  { code: 'PA', name: 'Panamá', dial: '+507', Flag: PA },
  { code: 'DO', name: 'República Dominicana', dial: '+1-809', Flag: DO },
  { code: 'CR', name: 'Costa Rica', dial: '+506', Flag: CR },
  { code: 'UY', name: 'Uruguay', dial: '+598', Flag: UY },
  // Otros países (alfabéticamente)
  { code: 'DE', name: 'Alemania', dial: '+49', Flag: DE },
  { code: 'AU', name: 'Australia', dial: '+61', Flag: AU },
  { code: 'BO', name: 'Bolivia', dial: '+591', Flag: BO },
  { code: 'CA', name: 'Canadá', dial: '+1', Flag: CA },
  { code: 'CN', name: 'China', dial: '+86', Flag: CN },
  { code: 'SV', name: 'El Salvador', dial: '+503', Flag: SV },
  { code: 'FR', name: 'Francia', dial: '+33', Flag: FR },
  { code: 'GT', name: 'Guatemala', dial: '+502', Flag: GT },
  { code: 'HN', name: 'Honduras', dial: '+504', Flag: HN },
  { code: 'IN', name: 'India', dial: '+91', Flag: IN },
  { code: 'IT', name: 'Italia', dial: '+39', Flag: IT },
  { code: 'JP', name: 'Japón', dial: '+81', Flag: JP },
  { code: 'NI', name: 'Nicaragua', dial: '+505', Flag: NI },
  { code: 'PY', name: 'Paraguay', dial: '+595', Flag: PY },
  { code: 'PT', name: 'Portugal', dial: '+351', Flag: PT },
  { code: 'GB', name: 'Reino Unido', dial: '+44', Flag: GB },
];

export interface CountryPhoneInputProps {
  /** Current selected country */
  selectedCountry: Country;
  /** Callback when country changes */
  onCountryChange: (country: Country) => void;
  /** Current phone number (without dial code) */
  phoneNumber: string;
  /** Callback when phone number changes */
  onPhoneChange: (phoneNumber: string) => void;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Whether the phone number is required */
  required?: boolean;
  /** Placeholder text for phone input */
  placeholder?: string;
  /** Input ID for accessibility */
  inputId?: string;
  /** Label text */
  label?: string;
  /** List of countries to show (defaults to ALL_COUNTRIES) */
  countries?: Country[];
}

/**
 * CountryPhoneInput Component
 * Material Design country selector with search and phone input
 */
export default function CountryPhoneInput({
  selectedCountry,
  onCountryChange,
  phoneNumber,
  onPhoneChange,
  disabled = false,
  required = false,
  placeholder = '300 123 4567',
  inputId = 'phone-input',
  label = 'Teléfono',
  countries = ALL_COUNTRIES,
}: CountryPhoneInputProps) {
  const theme = useTheme();

  // Get dynamic placeholder based on selected country
  const dynamicPlaceholder = useMemo(() => {
    try {
      const exampleNumber = getExampleNumber(selectedCountry.code as CountryCode, examples);
      if (exampleNumber) {
        return exampleNumber.formatNational();
      }
    } catch (_error) {
      // Fallback to country-specific examples
    }

    // Fallback placeholders for common countries
    const placeholders: Record<string, string> = {
      VE: '0414 123 4567',
      CO: '300 123 4567',
      PE: '987 654 321',
      EC: '99 123 4567',
      CL: '9 1234 5678',
      BR: '11 91234 5678',
      US: '(201) 555-0123',
      AR: '11 1234-5678',
      ES: '612 34 56 78',
      MX: '55 1234 5678',
      PA: '6123-4567',
      DO: '809 234 5678',
      CR: '8312 3456',
      UY: '094 123 456',
      DE: '1512 3456789',
      AU: '0412 345 678',
      BO: '71234567',
      CA: '(204) 234-5678',
      CN: '131 2345 6789',
      SV: '7012 3456',
      FR: '06 12 34 56 78',
      GT: '5123 4567',
      HN: '9123 4567',
      IN: '081234 56789',
      IT: '312 345 6789',
      JP: '090-1234-5678',
      NI: '8123 4567',
      PY: '0981 123456',
      PT: '912 345 678',
      GB: '07400 123456',
    };

    return placeholders[selectedCountry.code] || '123 456 789';
  }, [selectedCountry.code]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-numeric characters
    let value = e.target.value.replace(/[^0-9]/g, '');

    // Remove country dial code if present at the beginning
    const dialCode = selectedCountry.dial.replace(/[^0-9]/g, ''); // e.g., "57" from "+57"

    // Check if the value starts with the dial code
    if (value.startsWith(dialCode)) {
      value = value.slice(dialCode.length);
    }

    // Handle special cases like Dominican Republic (+1-809)
    // Extract all digits from dial code for these cases
    const allDialDigits = selectedCountry.dial.replace(/\D/g, '');
    if (allDialDigits !== dialCode && value.startsWith(allDialDigits)) {
      value = value.slice(allDialDigits.length);
    }

    // Format as user types using AsYouType
    if (value) {
      try {
        const formatter = new AsYouType(selectedCountry.code as CountryCode);
        const formatted = formatter.input(value);
        // Extract just the national number part (without country code)
        const nationalNumber = formatted.replace(selectedCountry.dial, '').trim();
        onPhoneChange(nationalNumber);
        return;
      } catch (_error) {
        // Fallback to unformatted
      }
    }

    onPhoneChange(value);
  };

  // Format and validate phone number
  const phoneValidation = useMemo(() => {
    if (!phoneNumber) return { isValid: false, formatted: '', international: '' };

    try {
      const fullNumber = `${selectedCountry.dial}${phoneNumber}`;
      const parsed = parsePhoneNumber(fullNumber, selectedCountry.code as CountryCode);

      if (parsed) {
        return {
          isValid: parsed.isValid(),
          formatted: parsed.formatNational(),
          international: parsed.formatInternational(),
        };
      }
    } catch (_error) {
      // If parsing fails, return raw number
    }

    return {
      isValid: false,
      formatted: phoneNumber,
      international: `${selectedCountry.dial} ${phoneNumber}`,
    };
  }, [phoneNumber, selectedCountry]);

  return (
    <Grid size={{ xs: 12 }}>
      <Typography
        component="label"
        variant="body2"
        sx={{
          display: 'block',
          mb: 1,
          fontWeight: 500,
          color: 'text.secondary',
        }}
      >
        {label}{' '}
        {required && (
          <Box component="span" sx={{ color: 'error.main' }}>
            *
          </Box>
        )}
      </Typography>
      <Grid container spacing={1.5}>
        {/* Country Selector with Search */}
        <Grid size={{ xs: 12, sm: 5 }}>
          <Autocomplete
            value={selectedCountry}
            onChange={(event, newValue) => {
              if (newValue) {
                onCountryChange(newValue);
              }
            }}
            options={countries}
            getOptionLabel={(option) => `${option.name} ${option.dial}`}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            filterOptions={(options, state) => {
              const inputValue = state.inputValue.toLowerCase();
              return options.filter(
                (option) =>
                  option.name.toLowerCase().includes(inputValue) ||
                  option.dial.includes(inputValue) ||
                  option.code.toLowerCase().includes(inputValue)
              );
            }}
            popupIcon={<SearchIcon />}
            slotProps={{
              paper: {
                elevation: 8,
                sx: {
                  mt: 1,
                  maxHeight: 320,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                },
              },
            }}
            ListboxProps={{
              sx: {
                maxHeight: 280,
                overflow: 'auto',
                py: 0,
                '&::-webkit-scrollbar': {
                  width: 8,
                },
                '&::-webkit-scrollbar-track': {
                  bgcolor: 'transparent',
                },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: alpha(theme.palette.primary.main, 0.2),
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.3),
                  },
                },
              },
            }}
            renderOption={(props, option, state) => {
              const FlagComponent = option.Flag;
              const { key: _key, ...otherProps } = props;
              return (
                <Box key={option.code}>
                  <ListItemButton
                    {...otherProps}
                    component="li"
                    selected={state.selected}
                    sx={{
                      py: 1.5,
                      px: 2,
                      minHeight: 56,
                      transition: theme.transitions.create(['background-color'], {
                        duration: theme.transitions.duration.shorter,
                      }),
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                      },
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.16),
                        },
                      },
                    }}
                  >
                    <ListItemAvatar sx={{ minWidth: 48 }}>
                      <Avatar
                        variant="rounded"
                        sx={{
                          width: 32,
                          height: 24,
                          bgcolor: 'transparent',
                          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                          boxShadow: theme.shadows[1],
                        }}
                      >
                        <FlagComponent
                          style={{ width: '100%', height: '100%', display: 'block' }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={option.name}
                      primaryTypographyProps={{
                        variant: 'body2',
                        fontWeight: 500,
                        color: 'text.primary',
                      }}
                      sx={{ flex: 1, my: 0 }}
                    />
                    <Chip
                      label={option.dial}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{
                        height: 24,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        borderRadius: 1.5,
                      }}
                    />
                  </ListItemButton>
                  {state.index < countries.length - 1 && <Divider component="li" sx={{ my: 0 }} />}
                </Box>
              );
            }}
            renderInput={(params: AutocompleteRenderInputParams) => {
              const FlagComponent = selectedCountry.Flag;
              return (
                <TextField
                  {...params}
                  placeholder="Buscar..."
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Avatar
                          variant="rounded"
                          sx={{
                            width: 28,
                            height: 20,
                            bgcolor: 'transparent',
                            border: `1px solid ${theme.palette.divider}`,
                            boxShadow: theme.shadows[1],
                            mr: 0.5,
                          }}
                        >
                          <FlagComponent
                            style={{ width: '100%', height: '100%', display: 'block' }}
                          />
                        </Avatar>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          color="primary.main"
                          sx={{ minWidth: 40 }}
                        >
                          {selectedCountry.dial}
                        </Typography>
                      </InputAdornment>
                    ),
                    endAdornment: params.InputProps.endAdornment,
                  }}
                  inputProps={{
                    ...params.inputProps,
                    'aria-label': 'Buscar país por nombre o código',
                  }}
                />
              );
            }}
            disableClearable
            disabled={disabled}
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Grid>

        {/* Phone Number Input */}
        <Grid size={{ xs: 12, sm: 7 }}>
          <TextField
            fullWidth
            required={required}
            id={inputId}
            name="phone"
            type="tel"
            placeholder={dynamicPlaceholder}
            value={phoneNumber}
            onChange={handlePhoneChange}
            disabled={disabled}
            variant="outlined"
            autoComplete="tel"
            error={phoneNumber.length > 0 && !phoneValidation.isValid}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="action" />
                </InputAdornment>
              ),
            }}
            inputProps={{
              'aria-label': required ? 'Número de teléfono (requerido)' : 'Número de teléfono',
              'aria-required': required,
              minLength: 7,
              maxLength: 15,
            }}
            helperText={
              phoneNumber && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    mt: 1,
                    width: '100%',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      color: phoneValidation.isValid ? 'success.main' : 'warning.main',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    {phoneValidation.isValid ? (
                      <>
                        <CheckCircleIcon sx={{ fontSize: 12 }} />
                        Número válido para confirmación del pago
                      </>
                    ) : (
                      <>
                        <ErrorOutlineIcon sx={{ fontSize: 12 }} />
                        Verifica el formato del número
                      </>
                    )}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 2,
                      py: 1.25,
                      borderRadius: 2.5,
                      bgcolor: phoneValidation.isValid
                        ? alpha(theme.palette.success.main, 0.08)
                        : alpha(theme.palette.warning.main, 0.08),
                      border: `1px solid ${
                        phoneValidation.isValid
                          ? alpha(theme.palette.success.main, 0.3)
                          : alpha(theme.palette.warning.main, 0.3)
                      }`,
                      backdropFilter: 'blur(8px)',
                      transition: theme.transitions.create(['background-color', 'border-color'], {
                        duration: theme.transitions.duration.short,
                      }),
                    }}
                  >
                    <PhoneIcon
                      sx={{
                        fontSize: 18,
                        color: phoneValidation.isValid ? 'success.main' : 'warning.main',
                      }}
                    />
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontWeight: 600,
                        color: phoneValidation.isValid ? 'success.main' : 'warning.main',
                        fontSize: '0.9rem',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {selectedCountry.dial}
                    </Typography>
                    <Box
                      component="span"
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: phoneValidation.isValid
                          ? alpha(theme.palette.success.main, 0.5)
                          : alpha(theme.palette.warning.main, 0.5),
                      }}
                    />
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        fontWeight: 500,
                        color: 'text.primary',
                        fontSize: '0.9rem',
                      }}
                    >
                      {phoneValidation.formatted || phoneNumber}
                    </Typography>
                  </Box>
                </Box>
              )
            }
            sx={{
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
