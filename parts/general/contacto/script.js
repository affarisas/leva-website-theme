registerComponent(() => {
  /**
   * 1. Key
   */
  const srcScript = new URL(document.currentScript.src);
  const queryParams = new URLSearchParams(srcScript.search);
  const uniqueId = queryParams.get('key');

  /**
   * 2. Global variables
   */
  const parentEl = document.getElementById(uniqueId);
  const submitBtn = parentEl.querySelector('#submit-contact-btn');
  const resetBtn = parentEl.querySelector('#reset-form-btn');
  const successMessage = parentEl.querySelector('.success-message');
  const formActions = parentEl.querySelector('.form-actions');
  const formRows = parentEl.querySelectorAll('.form-row');

  // ============================================
  // LOGIC
  // ============================================

  function validateForm() {
    const email = parentEl.querySelector('#email-input').value.trim();
    const telefono = parentEl.querySelector('#telefono-input').value.trim();
    const cedula = parentEl.querySelector('#cedula-input').value.trim();
    const tipoRadio = parentEl.querySelector(`input[name="tipo-documento-${uniqueId}"]:checked`);
    
    if (!email) {
      alert('Por favor ingresa tu correo electrónico');
      return false;
    }
    
    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!telefono) {
      alert('Por favor ingresa tu número de celular');
      return false;
    }

    if (!cedula) {
      alert('Por favor ingresa tu cédula');
      return false;
    }

    return {
      email,
      telefono,
      cedula,
      tipo: tipoRadio ? tipoRadio.value : 'C.C.'
    };
  }

  function toggleFormVisibility(showForm) {
    if (showForm) {
      formRows.forEach(row => row.style.display = 'flex');
      formActions.style.display = 'flex';
      successMessage.style.display = 'none';
      
      // Reset inputs
      parentEl.querySelector('#email-input').value = '';
      parentEl.querySelector('#telefono-input').value = '';
      parentEl.querySelector('#cedula-input').value = '';
    } else {
      formRows.forEach(row => row.style.display = 'none');
      formActions.style.display = 'none';
      successMessage.style.display = 'block';
    }
  }

  // ============================================
  // EVENT LISTENERS
  // ============================================

  submitBtn.addEventListener('click', () => {
    const formData = validateForm();
    if (!formData) return;

    // Disable button
    submitBtn.disabled = true;
    submitBtn.innerText = 'Enviando...';

    // HubSpot API configuration
    const portalId = '50967176';
    const formGuid = '616f8420-c075-44c1-ba5e-eebab34cded1';
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    const data = {
      fields: [
        { name: 'email', value: formData.email },
        { name: 'telefono', value: formData.telefono },
        { name: 'cedula', value: formData.cedula },
        { name: 'tipo', value: formData.tipo }
      ],
      context: {
        pageUri: window.location.href,
        pageName: document.title
      }
    };

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
        if (response.ok) {
            toggleFormVisibility(false);
        } else {
             return response.json().then(errData => {
                 console.error('HubSpot Error:', errData);
                 throw new Error('HubSpot submission failed');
             }).catch(() => {
                 throw new Error('HubSpot submission failed');
             });
        }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('Hubo un problema al enviar la solicitud. Por favor intenta nuevamente.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.innerText = 'Enviar solicitud';
    });
  });

  resetBtn.addEventListener('click', () => {
    toggleFormVisibility(true);
  });
});