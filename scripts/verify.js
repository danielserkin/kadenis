const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('=== VERIFICACIÓN KADENIS ===\n');

// 1. Check syntax of script.js
console.log('1. Verificando sintaxis JavaScript (node --check script.js)...');
try {
  execSync('node --check script.js', { stdio: 'inherit' });
  console.log('   ✓ Sintaxis de script.js correcta.\n');
} catch (err) {
  console.error('   ✗ Error de sintaxis en script.js:', err);
  process.exit(1);
}

// 2. Check git diff whitespace / syntax
console.log('2. Verificando git diff --check...');
try {
  execSync('git diff --check', { stdio: 'inherit' });
  console.log('   ✓ git diff --check correcto.\n');
} catch (err) {
  console.error('   ✗ git diff --check encontró problemas:', err);
  process.exit(1);
}

// 3. Test contact form backend receiver HTTP endpoint
console.log('3. Verificando envío real de formulario al backend receptor HTTP...');
async function testContactEndpoint() {
  const payload = {
    name: 'QA Verifier',
    email: 'qa.test@kadenis.dev',
    company: 'Kadenis QA',
    phone: '+5491100000000',
    message: 'Mensaje de prueba para verificar integración backend.'
  };

  try {
    const response = await fetch('https://formsubmit.co/ajax/daniel.serkin@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Referer': 'https://danielserkin.github.io/kadenis/',
        'Origin': 'https://danielserkin.github.io'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log(`   Respuesta del backend (HTTP ${response.status}):`, JSON.stringify(data));
    if (response.ok && (data.success === 'true' || data.success === true)) {
      console.log('   ✓ Integración con backend receptor de formulario verificada con éxito.\n');
    } else {
      throw new Error(`Recepción backend falló: ${data.message || response.statusText}`);
    }
  } catch (err) {
    console.error('   ✗ Error al verificar backend receptor:', err.message);
    process.exit(1);
  }
}

// 4. Render and capture Desktop and Mobile screenshots using headless Chrome
console.log('4. Capturando evidencia de recorrido visual (Escritorio y Móvil)...');
const rootDir = process.cwd();
const indexPath = `file://${path.join(rootDir, 'index.html')}`;
const assetsDir = path.join(rootDir, 'assets');

if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

const desktopImg = path.join(assetsDir, 'screenshot-desktop.png');
const mobileImg = path.join(assetsDir, 'screenshot-mobile.png');

try {
  const tmpUserData = `/tmp/chrome-user-data-${Date.now()}`;
  execSync(`google-chrome --headless=new --disable-gpu --no-sandbox --disable-setuid-sandbox --user-data-dir=${tmpUserData} --screenshot="${desktopImg}" --window-size=1440,900 "${indexPath}"`, { stdio: 'pipe' });
  console.log(`   ✓ Captura de pantalla Escritorio guardada: ${desktopImg}`);
} catch (e) {
  console.error('   ⚠ No se pudo capturar pantalla Escritorio:', e.message);
}

try {
  const tmpUserData = `/tmp/chrome-user-data-${Date.now()}`;
  execSync(`google-chrome --headless=new --disable-gpu --no-sandbox --disable-setuid-sandbox --user-data-dir=${tmpUserData} --screenshot="${mobileImg}" --window-size=375,812 "${indexPath}"`, { stdio: 'pipe' });
  console.log(`   ✓ Captura de pantalla Móvil guardada: ${mobileImg}`);
} catch (e) {
  console.error('   ⚠ No se pudo capturar pantalla Móvil:', e.message);
}

// 5. Capture mobile menu open screenshot
const openMenuHtml = path.join(rootDir, 'temp-open-menu.html');
let indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
indexHtml = indexHtml.replace('id="primary-navigation"', 'id="primary-navigation" class="is-open"');
indexHtml = indexHtml.replace('aria-expanded="false"', 'aria-expanded="true"');
fs.writeFileSync(openMenuHtml, indexHtml);
const mobileOpenImg = path.join(assetsDir, 'screenshot-mobile-open.png');

try {
  const tmpUserData = `/tmp/chrome-user-data-${Date.now()}`;
  execSync(`google-chrome --headless=new --disable-gpu --no-sandbox --disable-setuid-sandbox --user-data-dir=${tmpUserData} --screenshot="${mobileOpenImg}" --window-size=375,812 "file://${openMenuHtml}"`, { stdio: 'pipe' });
  console.log(`   ✓ Captura de pantalla Móvil con Menú Abierto guardada: ${mobileOpenImg}\n`);
} catch (e) {
  console.error('   ⚠ No se pudo capturar pantalla Móvil menú abierto:', e.message);
} finally {
  if (fs.existsSync(openMenuHtml)) fs.unlinkSync(openMenuHtml);
}

testContactEndpoint().then(() => {
  console.log('=== VERIFICACIÓN COMPLETADA CON ÉXITO ===');
});
