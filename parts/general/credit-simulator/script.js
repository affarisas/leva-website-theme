registerComponent(() => {
  /**
   * 1. Key
   * 
   * @description Obtener el ID del key generado desde PHP extrayendo el src="" único de este script invocado.
   */
  const srcScript = new URL(document.currentScript.src);
  const queryParams = new URLSearchParams(srcScript.search);
  const uniqueId = queryParams.get('key');
	const templateUrl = queryParams.get('templateUrl');

  /**
   * 2. Global (component-scope) variables
   * 
   * @description Crear controles y lógica sólo para el contenedor con el id único
   */
  const parentEl = document.getElementById(uniqueId);
	const vipIcon = `${templateUrl}/assets/img/parts/general/credit-simulator/vip.svg`;

  /**
   * 3. Component logic
   * 
   * @description ↓↓↓↓↓↓↓ Todo el resto de la lógica irá abajo ↓↓↓↓↓↓↓
   */

  // ============================================
  // CONSTANTES Y CONFIGURACIÓN
  // ============================================
  let configData = {};
  try {
      const configParam = queryParams.get('configData');
      if (configParam) {
          configData = JSON.parse(decodeURIComponent(configParam));
          console.log('got configData:', configData);
      }
  } catch (e) {
      console.error('Error parsing credit simulator config', e);
  }

  const CREDIT_PARAMS = {
    LV: configData.LV,
    LAF: configData.LAF
  };

  // Estados de la aplicación
  let currentStep = 1;
  let calculationData = null;
  let selectedRate = null;

  // ============================================
  // FUNCIONES DE TRACKING (GA4)
  // ============================================

  /**
   * Envía eventos a Google Analytics (GA4)
   * 
   * @param {string} eventName - Nombre del evento
   * @param {object} params - Parámetros del evento
   */
  function trackEvent(eventName, params = {}) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', eventName, params);
        console.log(`[GA4] Event tracked: ${eventName}`, params);
      } else if (window.dataLayer) {
        window.dataLayer.push({
          event: eventName,
          ...params
        });
        console.log(`[GTM] Event pushed: ${eventName}`, params);
      } else {
        console.log(`[Analytics] Mock track: ${eventName}`, params);
      }
    } catch (e) {
      console.warn('Error tracking event:', e);
    }
  }

  // ============================================
  // FUNCIONES DE CÁLCULO
  // ============================================

  /**
   * Función PAGO - Equivalente a =PAGO() de Excel
   * Calcula el pago periódico de un préstamo
   * 
   * @param {number} tasa - Tasa de interés por período (como decimal, ej: 4.78% = 0.0478)
   * @param {number} nper - Número total de períodos de pago
   * @param {number} va - Valor actual (presente) del préstamo
   * @param {number} vf - Valor futuro (opcional, por defecto 0)
   * @param {number} tipo - 0 = pagos al final del período, 1 = al inicio (opcional)
   * @returns {number} Pago periódico
   */
  function pago(tasa, nper, va, vf = 0, tipo = 0) {
    if (tasa === 0) {
      return -(va + vf) / nper;
    }
    
    const pvif = Math.pow(1 + tasa, nper);
    let pmt = (tasa * (va * pvif + vf)) / (pvif - 1);
    
    if (tipo === 1) {
      pmt /= (1 + tasa);
    }
    
    return -pmt;
  }

  /**
   * Genera la tabla de amortización completa
   * 
   * @param {number} principal - Monto del préstamo
   * @param {number} tasaPeriodica - Tasa periódica mensual (%)
   * @param {number} plazo - Número de cuotas
   * @param {number} leyMipyme - Porcentaje Ley MiPyME (%)
   * @param {number} seguroRate - Porcentaje del seguro (%)
   * @returns {object} Objeto con tabla de amortización y datos calculados
   */
  function generateAmortizationTable(principal, tasaPeriodica, plazo, leyMipyme, seguroRate) {
    // Convertir tasa periódica de porcentaje a decimal
    const tasaDecimal = tasaPeriodica / 100;
    
    // Calcular cuota neta usando función PAGO (equivalente a Excel)
    const cuotaNeta = pago(tasaDecimal, plazo, -principal);
    
    // Calcular Ley MiPyME (constante para todas las cuotas, basado en monto inicial)
    // Formula: REDONDEAR(((principal * constante ley mipyme) * 1.19) / 12, 0)
    const leyMipymeAmount = Math.round(((principal * (leyMipyme / 100)) * 1.19) / 12);
    
    // Calcular seguro (constante para todas las cuotas)
    const seguro = principal * (seguroRate / 100);
    
    const table = [];
    let saldoAnterior = principal;
    
    const startDate = new Date();
    
    for (let i = 1; i <= plazo; i++) {
      // Interés: saldo anterior * tasa periódica
      const interes = saldoAnterior * tasaDecimal;
      
      // Valor cuota: cuota neta + ley mipyme + seguro
      const valorCuota = cuotaNeta + leyMipymeAmount + seguro;
      
      // Capital: valor cuota - interés - ley mipyme - seguro
      const capital = valorCuota - interes - leyMipymeAmount - seguro;
      
      // Saldo capital: saldo anterior - capital
      const saldoCapital = saldoAnterior - capital;
      
      const fechaVencimiento = new Date(startDate);
      fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i);
      
      table.push({
        cuota: i,
        fechaDesembolso: i === 1 ? new Date(startDate) : null,
        fechaPrimerVencimiento: i === 1 ? fechaVencimiento : null,
        fechaVencimiento: fechaVencimiento,
        saldoAnterior: saldoAnterior,
        interes: interes,
        leyMipyme: leyMipymeAmount,
        seguro: seguro,
        capital: capital,
        valorCuota: valorCuota,
        saldoCapital: saldoCapital > 0.01 ? saldoCapital : 0
      });
      
      // Actualizar saldo anterior para la siguiente iteración
      saldoAnterior = saldoCapital > 0.01 ? saldoCapital : 0;
    }
    
    return {
      table: table,
      monthlyPayment: cuotaNeta,
      leyMipymeAmount: leyMipymeAmount,
      periodicRate: tasaDecimal,
      seguroAmount: seguro
    };
  }

  /**
   * Formatea número a formato de moneda colombiana
   */
  function formatCurrency(value) {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Formatea número sin símbolo de moneda
   */
  function formatNumber(value) {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }

  /**
   * Formatea porcentaje
   */
  function formatPercentage(value) {
    return value.toFixed(2) + '%';
  }

  /**
   * Formatea fecha
   */
  function formatDate(date) {
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  /**
   * Parsea valor de moneda a número
   */
  function parseCurrency(value) {
    return parseFloat(value.replace(/[^0-9]/g, ''));
  }

  // ============================================
  // GESTIÓN DE UI
  // ============================================

  /**
   * Muestra un step específico
   */
  function showStep(stepNumber) {
    // Ocultar todos los steps
    parentEl.querySelectorAll('[data-step]').forEach(step => {
      step.style.display = 'none';
    });
    
    // Mostrar el step solicitado
    const targetStep = parentEl.querySelector(`[data-step="${stepNumber}"]`);
    if (targetStep) {
      targetStep.style.display = 'block';
      currentStep = stepNumber;
      
      // Track step view
      trackEvent('credit_simulator_step_view', {
        step_number: stepNumber,
        step_name: getStepName(stepNumber)
      });
    }
  }

  function getStepName(step) {
    switch(step) {
      case 1: return 'calculator_form';
      case 2: return 'loading';
      case 3: return 'results';
      case 5: return 'contact_form';
      default: return 'unknown';
    }
  }

  /**
   * Valida el formulario
   */
  function validateForm() {
    const montoInput = parentEl.querySelector('#monto-input');
    const cuotasSelect = parentEl.querySelector('#cuotas-select');
    const telefonoInput = parentEl.querySelector('#telefono-input');
    
    const monto = parseCurrency(montoInput.value);
    const cuotas = parseInt(cuotasSelect.value);
    // Limpiar el teléfono de espacios y caracteres no numéricos
    let telefono = telefonoInput.value.replace(/\D/g, '');
    
    // Si empieza con 57 y tiene 12 dígitos, remover el código de país
    if (telefono.length === 12 && telefono.startsWith('57')) {
      telefono = telefono.substring(2);
    }

    const termsCheck = parentEl.querySelector('#terms-check');
    
    if (!monto || monto <= 0) {
      alert('Por favor ingresa un monto válido');
      return false;
    }
    
    if (!cuotas || cuotas <= 0) {
      alert('Por favor selecciona el número de cuotas');
      return false;
    }
    
    // Validar formato celular Colombia (3xx xxx xxxx)
    const phoneRegex = /^3\d{9}$/;
    if (!phoneRegex.test(telefono)) {
      alert('Por favor ingresa un número de celular válido (10 dígitos comenzando por 3)');
      return false;
    }

    if (!termsCheck.checked) {
      alert('Debes aceptar el tratamiento de datos personales para continuar');
      return false;
    }
    
    return { monto, cuotas, telefono };
  }

  /**
   * Calcula y muestra resultados
   */
  function calculateResults(formData) {
    const { monto, cuotas } = formData;
    
    // Determine effective leyMipyme for LV
    let lvLeyMipyme = CREDIT_PARAMS.LV.leyMipyme;
    if (CREDIT_PARAMS.LV.salarioMinimo > 0 && monto > (CREDIT_PARAMS.LV.salarioMinimo * 4)) {
      lvLeyMipyme = CREDIT_PARAMS.LV.leyMipymeDescuento;
    }

    // Calcular para LV
    const lvResults = generateAmortizationTable(
      monto,
      CREDIT_PARAMS.LV.tasaPeriodica,
      cuotas,
      lvLeyMipyme,
      CREDIT_PARAMS.LV.seguro
    );
    
    // Determine effective leyMipyme for LAF
    let lafLeyMipyme = CREDIT_PARAMS.LAF.leyMipyme;
    if (CREDIT_PARAMS.LAF.salarioMinimo > 0 && monto > (CREDIT_PARAMS.LAF.salarioMinimo * 4)) {
      lafLeyMipyme = CREDIT_PARAMS.LAF.leyMipymeDescuento;
    }

    // Calcular para LAF
    const lafResults = generateAmortizationTable(
      monto,
      CREDIT_PARAMS.LAF.tasaPeriodica,
      cuotas,
      lafLeyMipyme,
      CREDIT_PARAMS.LAF.seguro
    );
    
    calculationData = {
      formData,
      lv: { ...lvResults, params: { ...CREDIT_PARAMS.LV, leyMipyme: lvLeyMipyme } },
      laf: { ...lafResults, params: { ...CREDIT_PARAMS.LAF, leyMipyme: lafLeyMipyme } }
    };
    
    renderResults();
  }

  /**
   * Renderiza los resultados en el Step 3
   */
  function renderResults() {
    const resultsContainer = parentEl.querySelector('#results-container');
    const { formData, lv, laf } = calculationData;
    
    // Determine default selected rate based on visibility
    if (CREDIT_PARAMS.LAF.visible) {
        selectedRate = 'laf';
    } else if (CREDIT_PARAMS.LV.visible) {
        selectedRate = 'lv';
    } else {
        selectedRate = null;
    }

    let cardsHtml = '';
    
    if (CREDIT_PARAMS.LV.visible) {
        cardsHtml += `
        <div class="result-card ${selectedRate === 'lv' ? 'selected' : ''}" data-rate="lv">
          <div class="card-header">
            <input type="radio" name="rate-selection" id="rate-lv" value="lv" ${selectedRate === 'lv' ? 'checked' : ''}>
            <label for="rate-lv">
              <span class="rate-name">${CREDIT_PARAMS.LV.name}</span>
            </label>
          </div>
          <div class="card-body">
            <div class="monthly-payment">${formatCurrency(lv.monthlyPayment + lv.leyMipymeAmount + lv.seguroAmount)}</div>
            <div class="payment-label">por mes</div>
            <button class="view-plan-btn" data-rate="lv">Ver planes de pago →</button>
          </div>
        </div>`;
    }

    if (CREDIT_PARAMS.LAF.visible) {
        cardsHtml += `
        <div class="result-card ${selectedRate === 'laf' ? 'selected' : ''}" data-rate="laf">
          <div class="card-header">
            <input type="radio" name="rate-selection" id="rate-laf" value="laf" ${selectedRate === 'laf' ? 'checked' : ''}>
            <label for="rate-laf">
              <span class="rate-name">${CREDIT_PARAMS.LAF.name}</span>
              <img src="${vipIcon}" alt="VIP" class="vip-icon" width="20" height="20" style="margin-left: 8px;">
            </label>
          </div>
          <div class="card-body">
            <div class="monthly-payment" style="color: var(--main-color);">${formatCurrency(laf.monthlyPayment + laf.leyMipymeAmount + laf.seguroAmount)}</div>
            <div class="payment-label">por mes</div>
            <button class="view-plan-btn" data-rate="laf">Ver planes de pago →</button>
          </div>
        </div>`;
    }

    // Determine grid style
    let gridStyle = '';
    if (CREDIT_PARAMS.LV.visible && CREDIT_PARAMS.LAF.visible) {
        gridStyle = ''; 
    } else {
        gridStyle = 'grid-template-columns: 1fr;';
    }

    resultsContainer.innerHTML = `
      <div class="results-header">
        <h3>Para un monto de <span>${formatCurrency(formData.monto)}</span> en <span>${formData.cuotas}</span> cuotas pagarías:</h3>
      </div>
      
      <div class="results-cards" style="${gridStyle}">
        ${cardsHtml}
      </div>
      
      <section id="laf-notice" class="general-notice <?php echo get_sub_field('tipo'); ?>" style="margin-bottom: 15px; display: ${selectedRate === 'laf' ? 'block' : 'none'};">
        <div class="lock__ui">
          <img src="${templateUrl}/assets/img/parts/general/notice/info-bold.svg" alt="Info" />
          <p>
            <span class="bold">
              Nota:
            </span>
            para este crédito se requiere un buen puntaje en data crédito
          </p>
        </div>
      </section>

      <div class="results-actions">
        <button class="change-amount-btn">← Quiero cambiar el monto</button>
        <button class="fill primary request-credit-btn" ${!selectedRate ? 'disabled' : ''}>Solicitar crédito</button>
      </div>
    `;
    
    // Helper to update styles
    const updateCardStyles = () => {
      resultsContainer.querySelectorAll('.result-card').forEach(card => {
        const radio = card.querySelector('input[type="radio"]');
        if (radio && radio.checked) {
          card.classList.add('selected');
        } else {
          card.classList.remove('selected');
        }
      });

      const notice = resultsContainer.querySelector('#laf-notice');
      if (notice) {
        notice.style.display = selectedRate === 'laf' ? 'block' : 'none';
      }
    };

    // Event listeners para los resultados
    resultsContainer.querySelectorAll('input[name="rate-selection"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        selectedRate = e.target.value;
        updateCardStyles();
        
        // Track rate selection change
        trackEvent('credit_simulator_select_rate', {
            rate_type: selectedRate,
            amount: formData.monto,
            months: formData.cuotas
        });
      });
    });

    // Click listener for cards
          resultsContainer.querySelectorAll('.result-card').forEach(card => {
            card.addEventListener('click', (e) => {
              // Prevent double triggering if clicking directly on radio, label or button
              if (e.target.type === 'radio' || e.target.closest('label') || e.target.closest('.view-plan-btn')) return;
              
              const radio = card.querySelector('input[type="radio"]');
              if (radio) {
                radio.checked = true;
                // Trigger change logic manually
                selectedRate = radio.value;
                updateCardStyles();
              }
            });
          });
    
    resultsContainer.querySelectorAll('.view-plan-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent card selection when clicking view plan
        const rate = e.target.dataset.rate;
        showPaymentPlanModal(rate);
      });
    });
    
    resultsContainer.querySelector('.change-amount-btn').addEventListener('click', () => {
      showStep(1);
    });
    
    const requestBtn = resultsContainer.querySelector('.request-credit-btn');
    if (requestBtn) {
        requestBtn.addEventListener('click', () => {
          if (selectedRate) {
            // Track request start from results
            trackEvent('credit_simulator_request_start', {
                source: 'results_card',
                plan_type: selectedRate
            });

            showStep(5);
          }
        });
    }
  }

  /**
   * Muestra el modal de planes de pago
   */
  function showPaymentPlanModal(rate) {
    const modal = parentEl.querySelector('#payment-plan-modal');
    const data = calculationData[rate];
    const params = data.params;
    const { formData } = calculationData;
    
    // Renderizar parámetros
    const paramsContainer = modal.querySelector('#modal-params');
    paramsContainer.innerHTML = `
      <div class="param-item">
        <div class="param-label">Monto del crédito</div>
        <div class="param-value">${formatCurrency(formData.monto)}</div>
      </div>
      <div class="param-item">
        <div class="param-label">Cuota mensual</div>
        <div class="param-value">${formatCurrency(data.monthlyPayment + data.leyMipymeAmount + data.seguroAmount)}</div>
      </div>
      <div class="param-item">
        <div class="param-label">Plazo</div>
        <div class="param-value">${formData.cuotas} meses</div>
      </div>
      <div class="param-item">
        <div class="param-label">Tasa E.A. <span class="info-icon" title="Tasa Efectiva Anual">ⓘ</span></div>
        <div class="param-value">${formatPercentage(params.tasaEA)}</div>
      </div>
      <div class="param-item">
        <div class="param-label">Tasa E.M. <span class="info-icon" title="Tasa Efectiva Mensual">ⓘ</span></div>
        <div class="param-value">${formatPercentage(data.periodicRate * 100)}</div>
      </div>
      <div class="param-item">
        <div class="param-label">Ley MiPyME <span class="info-icon" title="Ley de MiPyME">ⓘ</span></div>
        <div class="param-value">${formatPercentage(params.leyMipyme)}</div>
      </div>
      <div class="param-item">
        <div class="param-label">Seguro <span class="info-icon" title="Seguro del crédito">ⓘ</span></div>
        <div class="param-value">${formatPercentage(params.seguro)}</div>
      </div>
    `;
    
    // Renderizar tabla
    const tableBody = modal.querySelector('#modal-table tbody');
    tableBody.innerHTML = '';
    
    data.table.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${row.cuota}</td>
        <td>${formatCurrency(row.saldoAnterior)}</td>
        <td>${formatCurrency(row.interes)}</td>
        <td>${formatCurrency(row.leyMipyme)}</td>
        <td>${formatCurrency(row.seguro)}</td>
        <td>${formatCurrency(row.capital)}</td>
        <td>${formatCurrency(row.valorCuota)}</td>
        <td>${formatCurrency(row.saldoCapital)}</td>
      `;
      tableBody.appendChild(tr);
    });
    
    modal.style.display = 'flex';
    
    // Guardar el rate actual para el PDF
    modal.dataset.currentRate = rate;

    // Track view payment plan
    trackEvent('credit_simulator_view_plan', {
        plan_type: rate, // 'lv' or 'laf'
        amount: formData.monto,
        months: formData.cuotas
    });
  }

  /**
   * Genera y descarga el PDF
   */
  async function downloadPDF() {
    const modal = parentEl.querySelector('#payment-plan-modal');
    const rate = modal.dataset.currentRate;
    const data = calculationData[rate];
    const { formData } = calculationData;
    const params = data.params;
    
    // Verificar si jsPDF está disponible
    if (typeof window.jspdf === 'undefined') {
      // Cargar jsPDF dinámicamente
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => generatePDFContent(data, formData, params);
      document.head.appendChild(script);
      return;
    }
    
    generatePDFContent(data, formData, params);
  }

  /**
   * Genera el contenido del PDF
   */
  function generatePDFContent(data, formData, params) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(18);
    doc.text('Plan de Pago - Simulación de Crédito', 20, 20);
    
    // Parámetros
    doc.setFontSize(12);
    doc.text('Parámetros del Crédito', 20, 35);
    
    doc.setFontSize(10);
    let yPos = 45;
    doc.text(`Monto del crédito: ${formatCurrency(formData.monto)}`, 20, yPos); yPos += 7;
    doc.text(`Cuota mensual: ${formatCurrency(data.monthlyPayment + data.leyMipymeAmount + data.seguroAmount)}`, 20, yPos); yPos += 7;
    doc.text(`Plazo: ${formData.cuotas} meses`, 20, yPos); yPos += 7;
    doc.text(`Tasa E.A.: ${formatPercentage(params.tasaEA)}`, 20, yPos); yPos += 7;
    doc.text(`Tasa E.M.: ${formatPercentage(data.periodicRate * 100)}`, 20, yPos); yPos += 7;
    doc.text(`Ley MiPyME: ${formatPercentage(params.leyMipyme)}`, 20, yPos); yPos += 7;
    doc.text(`Seguro: ${formatPercentage(params.seguro)}`, 20, yPos); yPos += 10;
    
    // Tabla
    doc.setFontSize(12);
    doc.text('Proyección de Pagos', 20, yPos); yPos += 10;
    
    // Headers
    doc.setFontSize(8);
    const headers = ['#', 'Saldo Ant.', 'Interés', 'MiPyME', 'Seguro', 'Capital', 'Valor Cuota', 'Saldo Cap.'];
    const colWidth = 22;
    headers.forEach((header, i) => {
      doc.text(header, 20 + (i * colWidth), yPos);
    });
    yPos += 7;
    
    // Rows
    data.table.forEach((row, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.text(row.cuota.toString(), 20, yPos);
      doc.text(formatNumber(row.saldoAnterior).substring(0, 10), 20 + colWidth, yPos);
      doc.text(formatNumber(row.interes).substring(0, 10), 20 + (colWidth * 2), yPos);
      doc.text(formatNumber(row.leyMipyme).substring(0, 10), 20 + (colWidth * 3), yPos);
      doc.text(formatNumber(row.seguro).substring(0, 10), 20 + (colWidth * 4), yPos);
      doc.text(formatNumber(row.capital).substring(0, 10), 20 + (colWidth * 5), yPos);
      doc.text(formatNumber(row.valorCuota).substring(0, 10), 20 + (colWidth * 6), yPos);
      doc.text(formatNumber(row.saldoCapital).substring(0, 10), 20 + (colWidth * 7), yPos);
      yPos += 6;
    });
    
    // Descargar
    doc.save(`plan-de-pago-${new Date().getTime()}.pdf`);
  }

  // ============================================
  // EVENT LISTENERS PRINCIPALES
  // ============================================

  // Botón calcular del formulario (Step 1)
  const calculateBtn = parentEl.querySelector('#calculate-btn');
  calculateBtn.addEventListener('click', () => {
    const formData = validateForm();
    if (formData) {
      // Track calculation attempt
      trackEvent('credit_simulator_calculate', {
        amount: formData.monto,
        months: formData.cuotas
      });

      // Mostrar loading (Step 2)
      showStep(2);
      
      // Simular delay de 250ms
      setTimeout(() => {
        calculateResults(formData);
        showStep(3);
      }, 250);
    }
  });

  // Cerrar modal
  const closeModalBtn = parentEl.querySelector('#close-modal-btn');
  closeModalBtn.addEventListener('click', () => {
    const modal = parentEl.querySelector('#payment-plan-modal');
    modal.style.display = 'none';
  });

  // Descargar PDF
  const downloadPdfBtn = parentEl.querySelector('#download-pdf-btn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
      // Track PDF download
      const modal = parentEl.querySelector('#payment-plan-modal');
      trackEvent('credit_simulator_download_pdf', {
          plan_type: modal.dataset.currentRate
      });
      
      downloadPDF();
    });
  }

  // Solicitar crédito desde modal
  const requestFromModalBtn = parentEl.querySelector('#request-from-modal-btn');
  requestFromModalBtn.addEventListener('click', () => {
    const modal = parentEl.querySelector('#payment-plan-modal');
    
    // Track request start from modal
    trackEvent('credit_simulator_request_start', {
        source: 'modal',
        plan_type: modal.dataset.currentRate
    });

    modal.style.display = 'none';
    showStep(5);
  });

  // Volver desde Step 5
  // const backFromRequestBtn = parentEl.querySelector('#back-from-request-btn');
  // backFromRequestBtn.addEventListener('click', () => {
  //   showStep(3);
  // });

  // Enviar solicitud final
  const submitRequestBtn = parentEl.querySelector('#submit-request-btn');
  submitRequestBtn.addEventListener('click', () => {
    const email = parentEl.querySelector('#email-input').value;
    const cedula = parentEl.querySelector('#cedula-input').value;
    
    // Get selected radio for tipo
    const tipoRadio = parentEl.querySelector('input[name="tarjeta-extranjero"]:checked');
    const tipo = tipoRadio ? tipoRadio.value : '';

    if (!email || !cedula || !tipo) {
      alert('Por favor completa todos los campos');
      return;
    }
    
    // Get phone from previous steps (stored in calculationData.formData.telefono)
    const telefono = calculationData && calculationData.formData ? calculationData.formData.telefono : '';

    if (!telefono) {
        alert('Ocurrió un error al recuperar el teléfono. Por favor intenta nuevamente.');
        showStep(1);
        return;
    }

    // Disable button to prevent multiple submissions
    submitRequestBtn.disabled = true;
    submitRequestBtn.innerText = 'Enviando...';

    // HubSpot API configuration
    const portalId = '51037826';
    const formGuid = 'd30149d3-1675-4594-b567-6daeb717893b';
    const url = `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formGuid}`;

    const data = {
      fields: [
        { name: 'email', value: email },
        { name: 'telefono', value: telefono },
        { name: 'cedula', value: cedula },
        { name: 'tipo', value: tipo }
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
            // Track successful submission
            trackEvent('credit_simulator_submit_success', {
                method: 'hubspot_api',
                amount: calculationData?.formData?.monto || 0,
                months: calculationData?.formData?.cuotas || 0,
                plan_type: calculationData?.formData?.selectedRate || selectedRate || ''
            });

            alert('¡Solicitud enviada! Pronto nos pondremos en contacto contigo.');
            // Reset fields
            parentEl.querySelector('#email-input').value = '';
            parentEl.querySelector('#cedula-input').value = '';
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
      submitRequestBtn.disabled = false;
      submitRequestBtn.innerText = 'Solicitar crédito';
    });
  });

  // Formatear input de monto
  const montoInput = parentEl.querySelector('#monto-input');
  
  // Permitir solo números mientras escribe
  montoInput.addEventListener('input', (e) => {
    // Remover todo excepto números
    let value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
  });
  
  // Formatear cuando pierde el foco
  montoInput.addEventListener('blur', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value && parseInt(value) > 0) {
      e.target.value = formatCurrency(parseInt(value));
    } else {
      e.target.value = '';
    }
  });
  
  // Limpiar formato cuando enfoca para editar
  montoInput.addEventListener('focus', (e) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = value;
  });

  // Inicializar en Step 1
  showStep(1);
})