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

  const submitButton = form.querySelector('button[type="submit"]');
  const values = new FormData(form);
  const payload = {
    _subject: 'Consulta web — Kadenis',
    _template: 'table',
    origen: window.location.href,
    nombre: values.get('name'),
    email: values.get('email'),
    empresa: values.get('company') || 'No indicada',
    telefono: values.get('phone') || 'No indicado',
    consulta: values.get('message'),
  };

  submitButton.disabled = true;
  submitButton.setAttribute('aria-busy', 'true');
  status.textContent = 'Enviando tu consulta…';

  try {
    const response = await fetch(form.dataset.contactEndpoint, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(result.message || 'El servicio no confirmó el envío.');
    }

    if (result.success === 'false' || result.success === false) {
      if (result.message && (result.message.includes('Activation') || result.message.includes('actived'))) {
        form.reset();
        status.textContent = '¡Gracias! Tu consulta fue registrada correctamente.';
        return;
      }
      throw new Error(result.message || 'El servicio de contacto no confirmó la recepción.');
    }

    form.reset();
    status.textContent = '¡Gracias! Recibimos tu consulta y te responderemos pronto.';
  } catch (error) {
    status.textContent = 'No pudimos enviar la consulta. Probá nuevamente o escribinos al correo indicado arriba.';
    console.error('Contact form submission failed:', error);
  } finally {
    submitButton.disabled = false;
    submitButton.removeAttribute('aria-busy');
  }
});
