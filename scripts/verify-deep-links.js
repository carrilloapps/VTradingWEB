#!/usr/bin/env node

/**
 * Script de verificación de configuración de Deep Links
 * Verifica que los archivos de configuración estén correctos antes de desplegar
 */

const fs = require('fs');
const path = require('path');

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, fileName) {
  log(`\n🔍 Verificando ${fileName}...`, 'cyan');

  if (!fs.existsSync(filePath)) {
    log(`❌ ERROR: No se encontró el archivo ${fileName}`, 'red');
    return false;
  }

  log(`✅ Archivo encontrado`, 'green');

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const json = JSON.parse(content);
    return json;
  } catch (error) {
    log(`❌ ERROR: El archivo no es un JSON válido`, 'red');
    log(`   ${error.message}`, 'red');
    return null;
  }
}

function validateAppleAppSiteAssociation(json) {
  let hasErrors = false;

  if (!json.applinks) {
    log(`❌ ERROR: Falta la propiedad "applinks"`, 'red');
    hasErrors = true;
  }

  if (!json.applinks.details || !Array.isArray(json.applinks.details)) {
    log(`❌ ERROR: Falta o es inválida la propiedad "applinks.details"`, 'red');
    hasErrors = true;
  } else {
    const detail = json.applinks.details[0];

    if (!detail.appID) {
      log(`❌ ERROR: Falta la propiedad "appID"`, 'red');
      hasErrors = true;
    } else if (detail.appID.includes('TEAM_ID')) {
      log(`❌ ERROR: Debes reemplazar "TEAM_ID" con tu Apple Team ID real`, 'red');
      log(`   Formato correcto: "ABC123XYZ.com.vtradingapp"`, 'yellow');
      hasErrors = true;
    } else {
      const parts = detail.appID.split('.');
      if (parts.length < 2) {
        log(`❌ ERROR: El formato de appID es incorrecto`, 'red');
        log(`   Debe ser: "TEAM_ID.BUNDLE_ID"`, 'yellow');
        hasErrors = true;
      } else {
        log(`✅ appID configurado: ${detail.appID}`, 'green');
      }
    }

    if (!detail.paths || !Array.isArray(detail.paths)) {
      log(`❌ ERROR: Falta o es inválida la propiedad "paths"`, 'red');
      hasErrors = true;
    } else {
      log(`✅ ${detail.paths.length} rutas configuradas`, 'green');
    }
  }

  return !hasErrors;
}

function validateAssetLinks(json) {
  let hasErrors = false;

  if (!Array.isArray(json)) {
    log(`❌ ERROR: El archivo debe ser un array`, 'red');
    return false;
  }

  const link = json[0];

  if (!link) {
    log(`❌ ERROR: El array está vacío`, 'red');
    return false;
  }

  if (!link.target) {
    log(`❌ ERROR: Falta la propiedad "target"`, 'red');
    hasErrors = true;
  } else {
    if (!link.target.package_name) {
      log(`❌ ERROR: Falta "target.package_name"`, 'red');
      hasErrors = true;
    } else {
      log(`✅ Package name: ${link.target.package_name}`, 'green');
    }

    if (
      !link.target.sha256_cert_fingerprints ||
      !Array.isArray(link.target.sha256_cert_fingerprints)
    ) {
      log(`❌ ERROR: Falta o es inválida "target.sha256_cert_fingerprints"`, 'red');
      hasErrors = true;
    } else {
      const fingerprint = link.target.sha256_cert_fingerprints[0];

      if (!fingerprint) {
        log(`❌ ERROR: No hay fingerprints configurados`, 'red');
        hasErrors = true;
      } else if (fingerprint === 'SHA256_FINGERPRINT_AQUI') {
        log(
          `❌ ERROR: Debes reemplazar "SHA256_FINGERPRINT_AQUI" con tu SHA-256 fingerprint real`,
          'red'
        );
        log(`   Obtener con: keytool -list -v -keystore your-keystore.jks`, 'yellow');
        hasErrors = true;
      } else if (fingerprint.includes(':')) {
        log(`❌ ERROR: El fingerprint no debe contener dos puntos (:)`, 'red');
        log(`   Debes removerlos. Ejemplo:`, 'yellow');
        log(`   Incorrecto: 14:6D:E9:83...`, 'yellow');
        log(`   Correcto:   146DE983...`, 'yellow');
        hasErrors = true;
      } else if (fingerprint.length !== 64) {
        log(`⚠️  ADVERTENCIA: El fingerprint debería tener 64 caracteres`, 'yellow');
        log(`   Longitud actual: ${fingerprint.length}`, 'yellow');
      } else {
        log(`✅ SHA-256 fingerprint configurado (${fingerprint.substring(0, 16)}...)`, 'green');
      }
    }
  }

  return !hasErrors;
}

function main() {
  log('\n╔════════════════════════════════════════════════════════╗', 'blue');
  log('║   Verificación de Configuración de Deep Links         ║', 'blue');
  log('║              VTradingAPP - vtradingweb                 ║', 'blue');
  log('╚════════════════════════════════════════════════════════╝', 'blue');

  const rootDir = path.join(__dirname, '..');
  const wellKnownDir = path.join(rootDir, 'public', '.well-known');

  // Verificar Apple App Site Association
  const aasaPath = path.join(wellKnownDir, 'apple-app-site-association');
  const aasaJson = checkFile(aasaPath, 'apple-app-site-association');
  const aasaValid = aasaJson ? validateAppleAppSiteAssociation(aasaJson) : false;

  // Verificar Android Asset Links
  const assetLinksPath = path.join(wellKnownDir, 'assetlinks.json');
  const assetLinksJson = checkFile(assetLinksPath, 'assetlinks.json');
  const assetLinksValid = assetLinksJson ? validateAssetLinks(assetLinksJson) : false;

  // Resumen
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('RESUMEN DE VERIFICACIÓN', 'blue');
  log('═══════════════════════════════════════════════════════', 'blue');

  if (aasaValid) {
    log('✅ iOS (Apple App Site Association): OK', 'green');
  } else {
    log('❌ iOS (Apple App Site Association): REQUIERE ATENCIÓN', 'red');
  }

  if (assetLinksValid) {
    log('✅ Android (Digital Asset Links): OK', 'green');
  } else {
    log('❌ Android (Digital Asset Links): REQUIERE ATENCIÓN', 'red');
  }

  if (aasaValid && assetLinksValid) {
    log('\n🎉 ¡Todo listo! Puedes desplegar tu aplicación.', 'green');
    log('   No olvides verificar los archivos en producción después del despliegue.', 'cyan');
    process.exit(0);
  } else {
    log('\n⚠️  HAY ERRORES QUE CORREGIR', 'yellow');
    log('   Revisa los mensajes de error arriba y corrige los archivos.', 'yellow');
    log('   Documentación: docs/DEEP_LINKS_SETUP.md', 'cyan');
    log('   Checklist: DEEP_LINKS_CHECKLIST.md', 'cyan');
    process.exit(1);
  }
}

main();
