const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#primary-navigation');

if (menuToggle && navigation) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    navigation.classList.remove('is-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Revisá los campos obligatorios antes de continuar.';
    return;
  }

  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitBtn) submitBtn.disabled = true;
  status.textContent = 'Enviando consulta…';

  const values = new FormData(form);
  const payload = {
    name: values.get('name') || '',
    email: values.get('email') || '',
    company: values.get('company') || 'No indicada',
    phone: values.get('phone') || 'No indicado',
    message: values.get('message') || ''
  };

  try {
    const endpoint = form.action || 'https://formsubmit.co/ajax/daniel.serkin@gmail.com';
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
      status.textContent = '¡Gracias! Tu consulta fue enviada con éxito a nuestro backend receptor. Te responderemos a la brevedad.';
      form.reset();
    } else {
      throw new Error(data.message || 'Respuesta no exitosa del backend.');
    }
  } catch (error) {
    console.warn('Backend indisponible o error de red, usando fallback mailto:', error);
    status.textContent = 'No se pudo contactar al servidor receptor. Abriendo tu cliente de correo…';
    const subject = 'Consulta web — Kadenis';
    const body = `Nombre: ${payload.name}\nEmail: ${payload.email}\nEmpresa: ${payload.company}\nTeléfono: ${payload.phone}\n\nConsulta:\n${payload.message}`;
    window.location.href = `mailto:daniel.serkin@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});
