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

if (form) {
  const fields = {
    name: {
      input: form.querySelector('#name'),
      error: form.querySelector('#name-error'),
      validate: (val) => val.trim().length > 0 ? '' : 'Por favor, ingresá tu nombre.'
    },
    email: {
      input: form.querySelector('#email'),
      error: form.querySelector('#email-error'),
      validate: (val) => {
        if (!val.trim()) return 'Por favor, ingresá tu correo electrónico.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) return 'Ingresá una dirección de correo válida (ejemplo@dominio.com).';
        return '';
      }
    },
    message: {
      input: form.querySelector('#message'),
      error: form.querySelector('#message-error'),
      validate: (val) => val.trim().length > 0 ? '' : 'Por favor, escribí tu consulta o mensaje.'
    }
  };

  const validateField = (key) => {
    const fieldObj = fields[key];
    if (!fieldObj || !fieldObj.input) return true;
    const errorMsg = fieldObj.validate(fieldObj.input.value);
    if (errorMsg) {
      fieldObj.input.setAttribute('aria-invalid', 'true');
      if (fieldObj.error) fieldObj.error.textContent = errorMsg;
      return false;
    } else {
      fieldObj.input.setAttribute('aria-invalid', 'false');
      if (fieldObj.error) fieldObj.error.textContent = '';
      return true;
    }
  };

  Object.keys(fields).forEach((key) => {
    const fieldObj = fields[key];
    if (fieldObj && fieldObj.input) {
      fieldObj.input.addEventListener('blur', () => validateField(key));
      fieldObj.input.addEventListener('input', () => {
        if (fieldObj.input.getAttribute('aria-invalid') === 'true') {
          validateField(key);
        }
      });
    }
  });

  const handleSubmission = async () => {
    let isValid = true;
    let firstInvalidInput = null;

    Object.keys(fields).forEach((key) => {
      const fieldValid = validateField(key);
      if (!fieldValid) {
        isValid = false;
        if (!firstInvalidInput && fields[key].input) {
          firstInvalidInput = fields[key].input;
        }
      }
    });

    if (!isValid) {
      if (status) {
        status.className = 'form-status form-status-error';
        status.textContent = 'Por favor, revisá los campos obligatorios antes de enviar.';
      }
      if (firstInvalidInput) {
        firstInvalidInput.focus();
      }
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    if (status) {
      status.className = 'form-status';
      status.textContent = 'Enviando consulta…';
    }

    const values = new FormData(form);
    const payload = {
      name: (values.get('name') || '').toString().trim(),
      email: (values.get('email') || '').toString().trim(),
      company: (values.get('company') || '').toString().trim() || 'No indicada',
      phone: (values.get('phone') || '').toString().trim() || 'No indicado',
      message: (values.get('message') || '').toString().trim()
    };

    try {
      const endpoint = form.action || 'https://formsubmit.co/ajax/daniel.serkin@gmail.com';
      let response;

      if (window.location.protocol === 'file:') {
        response = {
          ok: true,
          status: 200,
          json: async () => ({ success: 'true', message: 'Consulta recibida en entorno de prueba.' })
        };
      } else {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json().catch(() => ({}));
      if (response.ok && (data.success === 'true' || data.success === true || response.status === 200)) {
        if (status) {
          status.className = 'form-status form-status-success';
          status.textContent = '¡Gracias! Tu consulta fue enviada con éxito. Te responderemos en menos de 24 horas hábiles.';
        }
        form.reset();
        Object.keys(fields).forEach((key) => {
          if (fields[key].input) fields[key].input.removeAttribute('aria-invalid');
          if (fields[key].error) fields[key].error.textContent = '';
        });
      } else {
        throw new Error(data.message || 'Respuesta no exitosa del servidor receptor.');
      }
    } catch (error) {
      console.warn('Error al enviar el formulario por fetch:', error);
      if (status) {
        status.className = 'form-status form-status-error';
        const subject = 'Consulta web — Kadenis';
        const body = `Nombre: ${payload.name}\nEmail: ${payload.email}\nEmpresa: ${payload.company}\nTeléfono: ${payload.phone}\n\nConsulta:\n${payload.message}`;
        const mailtoUrl = `mailto:daniel.serkin@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        status.innerHTML = `
          <div>No se pudo contactar al servidor receptor en este momento. Podés reintentar el envío o escribirnos por correo:</div>
          <div class="status-actions">
            <button type="button" class="button-retry" id="btn-retry-submit">Reintentar envío</button>
            <a href="${mailtoUrl}" class="button-mailto-fallback">Enviar vía correo ↗</a>
          </div>
        `;

        const retryBtn = status.querySelector('#btn-retry-submit');
        if (retryBtn) {
          retryBtn.addEventListener('click', () => handleSubmission());
        }
      }
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  };

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSubmission();
  });
}
