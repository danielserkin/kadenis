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

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = 'Revisá los campos obligatorios antes de continuar.';
    return;
  }

  const values = new FormData(form);
  const name = values.get('name') || '';
  const email = values.get('email') || '';
  const company = values.get('company') || 'No indicada';
  const phone = values.get('phone') || 'No indicado';
  const message = values.get('message') || '';

  const subject = 'Consulta web — Kadenis';
  const body = `Nombre: ${name}\nEmail: ${email}\nEmpresa: ${company}\nTeléfono: ${phone}\n\nConsulta:\n${message}`;

  const mailtoUrl = `mailto:daniel.serkin@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.textContent = 'Abriendo tu cliente de correo…';
  window.location.href = mailtoUrl;

  setTimeout(() => {
    status.textContent = '¡Gracias! Se preparó el correo en tu aplicación predeterminada para el envío.';
    form.reset();
  }, 1000);
});
