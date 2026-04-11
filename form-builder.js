/* ============================================================
   MultiStepForm Embed Widget — form-builder.js
   Vanilla JS, kein Build-Tool erforderlich.
   ============================================================ */

(function (global) {
  'use strict';

  // ── Utils ────────────────────────────────────────────────────

  var Utils = {
    uuid: function () {
      if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    },

    getUtmParams: function () {
      if (typeof window === 'undefined') return {};
      var params = new URLSearchParams(window.location.search);
      var result = {};
      if (params.get('utm_source')) result.utm_source = params.get('utm_source');
      if (params.get('utm_campaign')) result.utm_campaign = params.get('utm_campaign');
      if (params.get('utm_medium')) result.utm_medium = params.get('utm_medium');
      if (params.get('utm_content')) result.utm_content = params.get('utm_content');
      return result;
    },

    el: function (tag, attrs, children) {
      var elem = document.createElement(tag);
      if (attrs) {
        Object.keys(attrs).forEach(function (key) {
          if (key === 'className') {
            elem.className = attrs[key];
          } else if (key === 'style' && typeof attrs[key] === 'object') {
            Object.assign(elem.style, attrs[key]);
          } else if (key.startsWith('data-')) {
            elem.setAttribute(key, attrs[key]);
          } else if (key === 'type' || key === 'value' || key === 'placeholder' ||
                     key === 'min' || key === 'max' || key === 'step' ||
                     key === 'rows' || key === 'href' || key === 'target' ||
                     key === 'rel' || key === 'disabled' || key === 'id') {
            elem[key] = attrs[key];
          } else {
            elem.setAttribute(key, attrs[key]);
          }
        });
      }
      if (children) {
        if (typeof children === 'string') {
          elem.textContent = children;
        } else if (Array.isArray(children)) {
          children.forEach(function (child) {
            if (child) elem.appendChild(typeof child === 'string' ? document.createTextNode(child) : child);
          });
        } else {
          elem.appendChild(children);
        }
      }
      return elem;
    },

    svgCheckmark: function () {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '12');
      svg.setAttribute('height', '12');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'white');
      svg.setAttribute('stroke-width', '3');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('d', 'M5 13l4 4L19 7');
      svg.appendChild(path);
      return svg;
    },

    svgArrowRight: function () {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '16');
      svg.setAttribute('height', '16');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('d', 'M14 5l7 7m0 0l-7 7m7-7H3');
      svg.appendChild(path);
      return svg;
    },

    svgArrowLeft: function () {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '14');
      svg.setAttribute('height', '14');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('d', 'M10 19l-7-7m0 0l7-7m-7 7h18');
      svg.appendChild(path);
      return svg;
    }
  };

  // ── Logic (Conditional) ──────────────────────────────────────

  var Logic = {
    evaluateRule: function (rule, data) {
      var fieldValue = data[rule.field];
      var ruleValue = rule.value;

      switch (rule.operator) {
        case 'equals':
          if (Array.isArray(fieldValue)) return fieldValue.includes(String(ruleValue));
          return String(fieldValue != null ? fieldValue : '') === String(ruleValue != null ? ruleValue : '');

        case 'not_equals':
          if (Array.isArray(fieldValue)) return !fieldValue.includes(String(ruleValue));
          return String(fieldValue != null ? fieldValue : '') !== String(ruleValue != null ? ruleValue : '');

        case 'contains':
          if (Array.isArray(fieldValue)) {
            return fieldValue.some(function (v) {
              return String(v).toLowerCase().includes(String(ruleValue != null ? ruleValue : '').toLowerCase());
            });
          }
          return String(fieldValue != null ? fieldValue : '').toLowerCase()
            .includes(String(ruleValue != null ? ruleValue : '').toLowerCase());

        case 'not_contains':
          if (Array.isArray(fieldValue)) {
            return !fieldValue.some(function (v) {
              return String(v).toLowerCase().includes(String(ruleValue != null ? ruleValue : '').toLowerCase());
            });
          }
          return !String(fieldValue != null ? fieldValue : '').toLowerCase()
            .includes(String(ruleValue != null ? ruleValue : '').toLowerCase());

        case 'greater_than':
          return Number(fieldValue) > Number(ruleValue);

        case 'less_than':
          return Number(fieldValue) < Number(ruleValue);

        case 'greater_than_or_equal':
          return Number(fieldValue) >= Number(ruleValue);

        case 'less_than_or_equal':
          return Number(fieldValue) <= Number(ruleValue);

        case 'is_empty':
          if (Array.isArray(fieldValue)) return fieldValue.length === 0;
          return fieldValue === null || fieldValue === undefined || fieldValue === '';

        case 'is_not_empty':
          if (Array.isArray(fieldValue)) return fieldValue.length > 0;
          return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';

        default:
          return false;
      }
    },

    evaluateConditionGroup: function (group, data) {
      if (!group || !group.rules || group.rules.length === 0) return true;
      var self = Logic;
      if (group.operator === 'AND') {
        return group.rules.every(function (rule) { return self.evaluateRule(rule, data); });
      }
      if (group.operator === 'OR') {
        return group.rules.some(function (rule) { return self.evaluateRule(rule, data); });
      }
      return true;
    },

    isStepVisible: function (step, data) {
      if (!step.condition) return true;
      return Logic.evaluateConditionGroup(step.condition.show_if, data);
    },

    isFieldVisible: function (field, data) {
      if (!field.condition) return true;
      return Logic.evaluateConditionGroup(field.condition.show_if, data);
    },

    filterVisibleSteps: function (steps, data) {
      return steps.filter(function (step) { return Logic.isStepVisible(step, data); });
    },

    filterVisibleFields: function (fields, data) {
      return fields.filter(function (field) { return Logic.isFieldVisible(field, data); });
    },

    getVisibleFieldNames: function (step, data) {
      if (step.type === 'loader') return new Set();
      var visible = Logic.filterVisibleFields(step.fields, data);
      return new Set(visible.map(function (f) { return f.name; }));
    }
  };

  // ── Validator ────────────────────────────────────────────────

  var Validator = {
    validateField: function (fieldConfig, value) {
      var rules = fieldConfig.validation || {};

      // Required
      if (rules.required) {
        var isEmpty = value === null || value === undefined || value === '' ||
          (Array.isArray(value) && value.length === 0);
        if (isEmpty) {
          return rules.required_message || (fieldConfig.label + ' ist erforderlich.');
        }
      }

      if (value === null || value === undefined || value === '' ||
        (Array.isArray(value) && value.length === 0)) {
        return undefined;
      }

      var strValue = Array.isArray(value) ? '' : String(value);

      // minLength / maxLength
      if (!Array.isArray(value)) {
        if (rules.min_length !== undefined && strValue.length < rules.min_length) {
          return rules.min_length_message || ('Mindestens ' + rules.min_length + ' Zeichen erforderlich.');
        }
        var effectiveMaxLength = rules.max_length !== undefined ? rules.max_length : (fieldConfig.type === 'textarea' ? 1000 : undefined);
        if (effectiveMaxLength !== undefined && strValue.length > effectiveMaxLength) {
          return rules.max_length_message || ('Maximal ' + effectiveMaxLength + ' Zeichen erlaubt.');
        }
      }

      // Email
      var shouldValidateEmail = rules.email_format || fieldConfig.type === 'email';
      if (shouldValidateEmail && strValue) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(strValue)) {
          return rules.pattern_message || 'Bitte geben Sie eine gültige E-Mail-Adresse ein.';
        }
      }

      // Phone
      var shouldValidatePhone = rules.phone_format || fieldConfig.type === 'phone';
      if (shouldValidatePhone && strValue) {
        var phoneRegex = /^[\+\d][\d\s\(\)\-\.\/]{6,20}$/;
        if (!phoneRegex.test(strValue)) {
          return rules.pattern_message || 'Bitte geben Sie eine gültige Telefonnummer ein.';
        }
      }

      // Number/Slider range
      if ((fieldConfig.type === 'number' || fieldConfig.type === 'slider') &&
          value !== undefined && value !== null) {
        var numValue = Number(value);
        if (rules.min !== undefined && numValue < rules.min) {
          return rules.min_message || ('Mindestwert ist ' + rules.min + '.');
        }
        if (rules.max !== undefined && numValue > rules.max) {
          return rules.max_message || ('Maximalwert ist ' + rules.max + '.');
        }
      }

      // Multi select
      if (fieldConfig.type === 'multi_select' && Array.isArray(value)) {
        if (fieldConfig.min_selections !== undefined && value.length < fieldConfig.min_selections) {
          return 'Bitte wählen Sie mindestens ' + fieldConfig.min_selections + ' Option(en).';
        }
        if (fieldConfig.max_selections !== undefined && value.length > fieldConfig.max_selections) {
          return 'Sie können maximal ' + fieldConfig.max_selections + ' Option(en) auswählen.';
        }
      }

      // Custom pattern
      if (rules.pattern && strValue) {
        var regex = new RegExp(rules.pattern);
        if (!regex.test(strValue)) {
          return rules.pattern_message || 'Ungültiges Format.';
        }
      }

      return undefined;
    },

    validateStep: function (stepConfig, data, visibleFieldNames) {
      var errors = {};
      if (stepConfig.type === 'loader') return errors;
      stepConfig.fields.forEach(function (field) {
        if (!visibleFieldNames.has(field.name)) return;
        var error = Validator.validateField(field, data[field.name]);
        if (error) errors[field.name] = error;
      });
      return errors;
    }
  };

  // ── API Submit ───────────────────────────────────────────────
  // Sends form data to the dashboard API using a form_key.
  // No Supabase credentials or client_id are exposed in the frontend.

  var Supabase = {
    submitLead: async function (config, data) {
      var apiUrl = (config.api_url || '').replace(/\/$/, '');
      if (!apiUrl) throw new Error('api_url fehlt in der FormConfig');
      if (!config.form_key) throw new Error('form_key fehlt in der FormConfig');

      var response = await fetch(apiUrl + '/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_key: config.form_key, fields: data })
      });

      if (!response.ok) {
        var errData = await response.json().catch(function () { return {}; });
        var status = response.status;
        if (status === 404) {
          throw new Error('form_key "' + config.form_key + '" nicht gefunden. Bitte im Admin-Dashboard prüfen ob der Key aktiv ist.');
        } else if (status === 403) {
          throw new Error('Zugriff verweigert (HTTP 403).');
        } else if (status >= 500) {
          throw new Error('Server-Fehler (HTTP ' + status + '). Bitte später erneut versuchen.');
        }
        throw new Error(errData.error || ('HTTP ' + status));
      }

      var result = await response.json();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('multistepform:submit', {
          detail: { form_name: config.form_key, lead_id: result.lead_id }
        }));
      }
    },

    trackEvent: function () {
      // Analytics tracking is handled server-side; no-op in the embed widget.
    }
  };

  // ── Analytics ────────────────────────────────────────────────

  var Analytics = {
    track: function (config, eventType, extra, sessionId, utmParams) {
      var event = Object.assign({
        form_key: config.form_key,
        form_name: config.form_name,
        event_type: eventType,
        session_id: sessionId,
        timestamp: new Date().toISOString()
      },
        config.variant ? { variant: config.variant } : {},
        utmParams || {},
        extra || {}
      );
      Supabase.trackEvent(config, event);
    }
  };

  // ── Field Renderers ──────────────────────────────────────────

  var Fields = {
    renderLabel: function (cfg) {
      if (!cfg.label) return null;
      return Utils.el('label', { className: 'msf-field-label', 'for': cfg.name }, cfg.label);
    },

    renderHint: function (cfg) {
      if (!cfg.hint) return null;
      return Utils.el('p', { className: 'msf-hint' }, cfg.hint);
    },

    renderError: function (error) {
      if (!error) return null;
      return Utils.el('p', { className: 'msf-error-msg' }, error);
    },

    // Sofort-Feedback beim Verlassen eines Feldes (ohne globales render())
    blurValidate: function (cfg, inputEl, value) {
      var fieldWrap = inputEl.closest('[data-field]');
      if (!fieldWrap) return;
      var existing = fieldWrap.querySelector('.msf-error-msg');
      var errorMsg = Validator.validateField(cfg, value || null);
      if (errorMsg) {
        inputEl.classList.add('msf-input--error');
        if (!existing) {
          var errEl = Utils.el('p', { className: 'msf-error-msg' }, errorMsg);
          fieldWrap.appendChild(errEl);
        } else {
          existing.textContent = errorMsg;
        }
      } else {
        inputEl.classList.remove('msf-input--error');
        if (existing) existing.remove();
      }
    },

    wrapField: function (cfg, children) {
      var wrap = Utils.el('div', { className: 'msf-field', 'data-field': cfg.name });
      children.forEach(function (c) { if (c) wrap.appendChild(c); });
      return wrap;
    },

    text: function (cfg, value, error, onChange, onFocus, onNext) {
      var input = Utils.el('input', {
        type: 'text',
        id: cfg.name,
        className: 'msf-input' + (error ? ' msf-input--error' : ''),
        placeholder: cfg.placeholder || '',
        value: value != null ? String(value) : ''
      });
      input.addEventListener('input', function (e) { onChange(e.target.value); });
      input.addEventListener('focus', function () { onFocus(cfg.name); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (onNext) onNext(); } });
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), input, Fields.renderHint(cfg), Fields.renderError(error)]);
    },

    email: function (cfg, value, error, onChange, onFocus, onNext) {
      var input = Utils.el('input', {
        type: 'email',
        id: cfg.name,
        className: 'msf-input' + (error ? ' msf-input--error' : ''),
        placeholder: cfg.placeholder || '',
        value: value != null ? String(value) : ''
      });
      input.addEventListener('input', function (e) { onChange(e.target.value); });
      input.addEventListener('focus', function () { onFocus(cfg.name); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (onNext) onNext(); } });
      input.addEventListener('blur', function () { Fields.blurValidate(cfg, input, input.value); });
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), input, Fields.renderHint(cfg), Fields.renderError(error)]);
    },

    phone: function (cfg, value, error, onChange, onFocus, onNext) {
      var input = Utils.el('input', {
        type: 'tel',
        id: cfg.name,
        className: 'msf-input' + (error ? ' msf-input--error' : ''),
        placeholder: cfg.placeholder || '',
        value: value != null ? String(value) : ''
      });
      input.addEventListener('input', function (e) { onChange(e.target.value); });
      input.addEventListener('focus', function () { onFocus(cfg.name); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); if (onNext) onNext(); } });
      input.addEventListener('blur', function () { Fields.blurValidate(cfg, input, input.value); });
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), input, Fields.renderHint(cfg), Fields.renderError(error)]);
    },

    number: function (cfg, value, error, onChange, onFocus, onNext) {
      var min = cfg.min !== undefined ? Number(cfg.min) : null;
      var max = cfg.max !== undefined ? Number(cfg.max) : null;
      var step = cfg.step !== undefined ? Number(cfg.step) : 1;
      var current = value != null ? Number(value) : (min !== null ? min : 0);

      var input = Utils.el('input', {
        type: 'text',
        id: cfg.name,
        className: 'msf-input msf-number-input' + (error ? ' msf-input--error' : ''),
        placeholder: cfg.placeholder || '',
        value: current !== null ? String(current) : ''
      });
      input.setAttribute('inputmode', 'numeric');

      var btnMinus = Utils.el('button', { type: 'button', className: 'msf-number-btn' });
      btnMinus.innerHTML = '<svg width="12" height="2" viewBox="0 0 12 2" fill="none"><rect width="12" height="2" rx="1" fill="currentColor"/></svg>';
      var btnPlus = Utils.el('button', { type: 'button', className: 'msf-number-btn' });
      btnPlus.innerHTML = '<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="5" width="2" height="12" rx="1" fill="currentColor"/><rect y="5" width="12" height="2" rx="1" fill="currentColor"/></svg>';

      function update(val) {
        var n = Number(val);
        if (isNaN(n)) return;
        if (min !== null && n < min) n = min;
        if (max !== null && n > max) n = max;
        current = n;
        input.value = String(n);
        onChange(n);
        btnMinus.disabled = min !== null && n <= min;
        btnPlus.disabled  = max !== null && n >= max;
      }

      btnMinus.addEventListener('click', function() { update(current - step); });
      btnPlus.addEventListener('click',  function() { update(current + step); });
      input.addEventListener('input', function(e) { onChange(e.target.value !== '' ? Number(e.target.value) : null); });
      input.addEventListener('blur',  function(e) { if (e.target.value !== '') update(Number(e.target.value)); });
      input.addEventListener('focus', function() { onFocus(cfg.name); });
      input.addEventListener('keydown', function(e) { if (e.key === 'Enter') { e.preventDefault(); if (onNext) onNext(); } });

      btnMinus.disabled = min !== null && current <= min;
      btnPlus.disabled  = max !== null && current >= max;

      var group = Utils.el('div', { className: 'msf-number-group' });
      group.appendChild(btnMinus); group.appendChild(input); group.appendChild(btnPlus);
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), group, Fields.renderHint(cfg), Fields.renderError(error)]);
    },

    date: function (cfg, value, error, onChange, onFocus, onNext) {
      var today = new Date();
      var minDate = cfg.min_date !== null ? (cfg.min_date || today.toISOString().split('T')[0]) : null;
      var maxDate = cfg.max_date || null;
      if (cfg.max_days_from_now !== undefined) {
        var maxD = new Date(); maxD.setDate(maxD.getDate() + cfg.max_days_from_now);
        maxDate = maxD.toISOString().split('T')[0];
      }
      var selectedDate = value ? new Date(value + 'T00:00:00') : null;
      var viewYear = selectedDate ? selectedDate.getFullYear() : today.getFullYear();
      var viewMonth = selectedDate ? selectedDate.getMonth() : today.getMonth();
      var MONTHS = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];

      function formatDisplay(d) {
        if (!d) return '';
        var dd = String(d.getDate()).padStart(2,'0');
        var mm = String(d.getMonth()+1).padStart(2,'0');
        return dd + '.' + mm + '.' + d.getFullYear();
      }

      var hiddenInput = Utils.el('input', { type: 'hidden', id: cfg.name, value: value != null ? String(value) : '' });

      // Wrapper: Text-Input + Icon-Button nebeneinander
      var triggerWrap = Utils.el('div', { className: 'msf-date-trigger-wrap' + (error ? ' msf-date-trigger-wrap--error' : '') });
      var trigger = Utils.el('input', {
        type: 'text',
        className: 'msf-date-trigger-input',
        placeholder: cfg.placeholder || 'TT.MM.JJJJ',
        autocomplete: 'off'
      });
      trigger.value = selectedDate ? formatDisplay(selectedDate) : '';
      var iconBtn = Utils.el('button', { type: 'button', className: 'msf-date-icon-btn', 'aria-label': 'Kalender öffnen' });
      iconBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="14" height="12" rx="2"/><path d="M5 1v4M11 1v4M1 7h14"/></svg>';
      triggerWrap.appendChild(trigger);
      triggerWrap.appendChild(iconBtn);

      // Tippen: Datum aus "DD.MM.YYYY" parsen
      trigger.addEventListener('input', function(e) {
        var v = e.target.value.trim();
        var parts = v.split('.');
        if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
          var d = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
          if (!isNaN(d.getTime())) {
            var iso = parts[2] + '-' + parts[1].padStart(2,'0') + '-' + parts[0].padStart(2,'0');
            if ((!minDate || iso >= minDate) && (!maxDate || iso <= maxDate)) {
              selectedDate = d;
              hiddenInput.value = iso;
              viewYear = d.getFullYear(); viewMonth = d.getMonth();
              onChange(iso);
            }
          }
        }
      });
      trigger.addEventListener('blur', function() {
        // Bei ungültigem Text zurücksetzen
        if (selectedDate) trigger.value = formatDisplay(selectedDate);
        else if (!trigger.value.match(/^\d{2}\.\d{2}\.\d{4}$/)) trigger.value = '';
      });

      var popup = Utils.el('div', { className: 'msf-date-popup' });
      popup.style.display = 'none';

      function renderCalendar() {
        popup.innerHTML = '';
        var header = Utils.el('div', { className: 'msf-date-header' });
        var btnPrev = Utils.el('button', { type: 'button', className: 'msf-date-nav' }, '‹');
        var btnNext = Utils.el('button', { type: 'button', className: 'msf-date-nav' }, '›');
        var title = Utils.el('span', { className: 'msf-date-title' }, MONTHS[viewMonth] + ' ' + viewYear);
        header.appendChild(btnPrev); header.appendChild(title); header.appendChild(btnNext);
        popup.appendChild(header);
        btnPrev.onclick = function(e) { e.stopPropagation(); viewMonth--; if (viewMonth < 0) { viewMonth = 11; viewYear--; } renderCalendar(); };
        btnNext.onclick = function(e) { e.stopPropagation(); viewMonth++; if (viewMonth > 11) { viewMonth = 0; viewYear++; } renderCalendar(); };

        var dayNames = Utils.el('div', { className: 'msf-date-daynames' });
        ['Mo','Di','Mi','Do','Fr','Sa','So'].forEach(function(d) { dayNames.appendChild(Utils.el('span', {}, d)); });
        popup.appendChild(dayNames);

        var grid = Utils.el('div', { className: 'msf-date-grid' });
        var firstDay = new Date(viewYear, viewMonth, 1).getDay();
        var offset = firstDay === 0 ? 6 : firstDay - 1;
        var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        for (var i = 0; i < offset; i++) grid.appendChild(Utils.el('span', { className: 'msf-date-empty' }));
        for (var day = 1; day <= daysInMonth; day++) {
          var iso = viewYear + '-' + String(viewMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
          var disabled = (minDate && iso < minDate) || (maxDate && iso > maxDate);
          var isSel = selectedDate && selectedDate.getDate() === day && selectedDate.getMonth() === viewMonth && selectedDate.getFullYear() === viewYear;
          var isTod = today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
          var cls = 'msf-date-day' + (isSel ? ' msf-date-day--selected' : '') + (isTod && !isSel ? ' msf-date-day--today' : '') + (disabled ? ' msf-date-day--disabled' : '');
          var btn = Utils.el('button', { type: 'button', className: cls, disabled: disabled }, String(day));
          ;(function(isoVal, yr, mo, dy) {
            btn.onclick = function(e) {
              e.stopPropagation();
              selectedDate = new Date(yr, mo, dy);
              hiddenInput.value = isoVal;
              trigger.value = formatDisplay(selectedDate);
              onChange(isoVal);
              popup.style.display = 'none';
            };
          })(iso, viewYear, viewMonth, day);
          grid.appendChild(btn);
        }
        popup.appendChild(grid);
      }

      renderCalendar();
      document.body.appendChild(popup);

      function positionPopup() {
        var rect = triggerWrap.getBoundingClientRect();
        popup.style.top = (rect.bottom + window.scrollY + 4) + 'px';
        var left = rect.left + window.scrollX;
        var maxLeft = window.innerWidth - 288;
        popup.style.left = Math.min(left, maxLeft) + 'px';
      }

      function openPopup() {
        positionPopup();
        popup.style.display = 'block';
      }
      iconBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        onFocus(cfg.name);
        if (popup.style.display === 'none') { openPopup(); } else { popup.style.display = 'none'; }
      });
      trigger.addEventListener('focus', function() { onFocus(cfg.name); });
      document.addEventListener('click', function(e) {
        if (!popup.contains(e.target) && e.target !== trigger && e.target !== iconBtn) popup.style.display = 'none';
      });
      window.addEventListener('scroll', function() { popup.style.display = 'none'; }, true);
      window.addEventListener('resize', function() { popup.style.display = 'none'; });

      var wrap = Fields.wrapField(cfg, [Fields.renderLabel(cfg), triggerWrap, hiddenInput, Fields.renderHint(cfg), Fields.renderError(error)]);
      return wrap;
    },

    textarea: function (cfg, value, error, onChange, onFocus) {
      var ta = Utils.el('textarea', {
        id: cfg.name,
        className: 'msf-input' + (error ? ' msf-input--error' : ''),
        placeholder: cfg.placeholder || '',
        rows: cfg.rows || 4
      });
      ta.value = value != null ? String(value) : '';
      ta.addEventListener('input', function (e) { onChange(e.target.value); });
      ta.addEventListener('focus', function () { onFocus(cfg.name); });
      var maxLen = (cfg.validation && cfg.validation.max_length) || 1000;
      var counter = null;
      if (maxLen) {
        var currentLen = (value != null ? String(value) : '').length;
        counter = Utils.el('span', { className: 'msf-char-counter' }, currentLen + ' / ' + maxLen);
        ta.addEventListener('input', function (e) {
          counter.textContent = e.target.value.length + ' / ' + maxLen;
        });
      }
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), ta, counter, Fields.renderHint(cfg), Fields.renderError(error)]);
    },

    boolean: function (cfg, value, error, onChange, onAutoAdvance) {
      var trueLabel = cfg.true_label || 'Ja';
      var falseLabel = cfg.false_label || 'Nein';
      var group = Utils.el('div', { className: 'msf-boolean-group' });

      var btnTrue = Utils.el('button', {
        type: 'button',
        className: 'msf-boolean-btn' + (value === true ? ' msf-boolean-btn--selected' : '')
      }, trueLabel);
      var btnFalse = Utils.el('button', {
        type: 'button',
        className: 'msf-boolean-btn' + (value === false ? ' msf-boolean-btn--selected' : '')
      }, falseLabel);

      function updateSelection(isTrue) {
        btnTrue.className = 'msf-boolean-btn' + (isTrue === true ? ' msf-boolean-btn--selected' : '');
        btnFalse.className = 'msf-boolean-btn' + (isTrue === false ? ' msf-boolean-btn--selected' : '');
      }

      btnTrue.addEventListener('click', function () {
        updateSelection(true);
        onChange(true);
        if (onAutoAdvance) setTimeout(onAutoAdvance, 280);
      });
      btnFalse.addEventListener('click', function () {
        updateSelection(false);
        onChange(false);
        if (onAutoAdvance) setTimeout(onAutoAdvance, 280);
      });

      group.appendChild(btnTrue);
      group.appendChild(btnFalse);
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), group, Fields.renderError(error)]);
    },

    select: function (cfg, value, error, onChange, onAutoAdvance) {
      var group = Utils.el('div', { className: 'msf-select-group' });
      var allBtns = [];
      cfg.options.forEach(function (opt) {
        var selected = value === opt.value;
        var btn = Utils.el('button', {
          type: 'button',
          className: 'msf-select-btn' + (selected ? ' msf-select-btn--selected' : '')
        });
        var check = Utils.el('span', { className: 'msf-select-check' });
        if (selected) check.appendChild(Utils.svgCheckmark());
        btn.appendChild(check);
        btn.appendChild(document.createTextNode(opt.label));
        btn.addEventListener('click', function () {
          // Visuell direkt im DOM updaten – kein globales render()
          allBtns.forEach(function(b) {
            b.btn.classList.remove('msf-select-btn--selected');
            b.check.innerHTML = '';
          });
          btn.classList.add('msf-select-btn--selected');
          check.appendChild(Utils.svgCheckmark());
          onChange(opt.value);
          if (onAutoAdvance) setTimeout(onAutoAdvance, 220);
        });
        allBtns.push({ btn: btn, check: check });
        group.appendChild(btn);
      });
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), group, Fields.renderError(error)]);
    },

    multi_select: function (cfg, value, error, onChange) {
      var current = Array.isArray(value) ? value.slice() : [];
      var rules = cfg.validation || {};
      var showCounter = rules.min !== undefined || rules.max !== undefined;
      var total = cfg.options.length;

      var counter = null;
      if (showCounter) {
        counter = Utils.el('p', { className: 'msf-multi-counter' },
          current.length + ' von ' + total + ' ausgewählt');
      }

      var group = Utils.el('div', { className: 'msf-multi-group' });
      cfg.options.forEach(function (opt) {
        var selected = current.includes(opt.value);
        var btn = Utils.el('button', {
          type: 'button',
          className: 'msf-multi-btn' + (selected ? ' msf-multi-btn--selected' : '')
        });
        btn.appendChild(document.createTextNode(opt.label));
        btn.addEventListener('click', function () {
          var idx = current.indexOf(opt.value);
          if (idx === -1) {
            current = current.concat([opt.value]);
            btn.classList.add('msf-multi-btn--selected');
          } else {
            current = current.filter(function (v) { return v !== opt.value; });
            btn.classList.remove('msf-multi-btn--selected');
          }
          if (counter) counter.textContent = current.length + ' von ' + total + ' ausgewählt';
          onChange(current);
        });
        group.appendChild(btn);
      });
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), group, counter, Fields.renderHint(cfg), Fields.renderError(error)]);
    },

    image_select: function (cfg, value, error, onChange, onAutoAdvance) {
      var isMulti = cfg.multi === true;
      var current = isMulti
        ? (Array.isArray(value) ? value.slice() : [])
        : (value || null);

      var count = cfg.options.length;
      var gridClass = 'msf-image-grid';
      if (count === 3) gridClass += ' msf-image-grid-3';
      else if (count === 4) gridClass += ' msf-image-grid-4';
      else if (count === 6) gridClass += ' msf-image-grid-6';

      var grid = Utils.el('div', { className: gridClass });
      var btnMap = {}; // opt.value → btn (für In-Place Deselect)

      cfg.options.forEach(function (opt) {
        var selected = isMulti
          ? (Array.isArray(current) && current.includes(opt.value))
          : current === opt.value;

        var btn = Utils.el('button', {
          type: 'button',
          className: 'msf-image-btn' + (selected ? ' msf-image-btn--selected' : '')
        });

        var ratio = Utils.el('div', { className: 'msf-image-ratio' });
        var img = Utils.el('img', { src: opt.image_url || '', alt: opt.label });
        img.loading = 'lazy';
        if (opt.image_position) {
          img.style.objectPosition = opt.image_position;
        }
        ratio.appendChild(img);
        btn.appendChild(ratio);

        if (selected) {
          var initBadge = Utils.el('div', { className: 'msf-image-selected-badge' });
          initBadge.appendChild(Utils.svgCheckmark());
          ratio.appendChild(initBadge);
        }

        var labelWrap = Utils.el('div', { className: 'msf-image-btn-label' });
        labelWrap.appendChild(Utils.el('span', { className: 'msf-image-btn-title' }, opt.label));
        if (opt.description) {
          labelWrap.appendChild(Utils.el('span', { className: 'msf-image-btn-desc' }, opt.description));
        }
        btn.appendChild(labelWrap);

        btn.addEventListener('click', function () {
          if (isMulti) {
            var arr = Array.isArray(current) ? current.slice() : [];
            var idx = arr.indexOf(opt.value);
            if (idx === -1) {
              arr = arr.concat([opt.value]);
              btn.classList.add('msf-image-btn--selected');
              var b = Utils.el('div', { className: 'msf-image-selected-badge' });
              b.appendChild(Utils.svgCheckmark());
              btn.querySelector('.msf-image-ratio').appendChild(b);
            } else {
              arr = arr.filter(function (v) { return v !== opt.value; });
              btn.classList.remove('msf-image-btn--selected');
              var eb = btn.querySelector('.msf-image-selected-badge');
              if (eb) eb.remove();
            }
            current = arr;
            onChange(arr);
          } else {
            // Alle anderen deselektieren (In-Place)
            Object.keys(btnMap).forEach(function (val) {
              btnMap[val].classList.remove('msf-image-btn--selected');
              var eb = btnMap[val].querySelector('.msf-image-selected-badge');
              if (eb) eb.remove();
            });
            // Diesen selektieren
            btn.classList.add('msf-image-btn--selected');
            var badge = Utils.el('div', { className: 'msf-image-selected-badge' });
            badge.appendChild(Utils.svgCheckmark());
            btn.querySelector('.msf-image-ratio').appendChild(badge);
            current = opt.value;
            onChange(opt.value);
            if (onAutoAdvance) setTimeout(onAutoAdvance, 280);
          }
        });

        btnMap[opt.value] = btn;
        grid.appendChild(btn);
      });
      return Fields.wrapField(cfg, [Fields.renderLabel(cfg), grid, Fields.renderError(error)]);
    },

    slider: function (cfg, value, error, onChange, onFocus) {
      var currentVal = value != null ? Number(value) : (cfg.default_value != null ? cfg.default_value : cfg.min);
      var pct = ((currentVal - cfg.min) / (cfg.max - cfg.min)) * 100;

      var display = null;
      if (cfg.display_value !== false) {
        var valStr = cfg.unit ? currentVal.toLocaleString('de-DE') + '\u202f' + cfg.unit : String(currentVal);
        display = Utils.el('div', { className: 'msf-slider-display', id: cfg.name + '-display' }, valStr);
      }

      var input = Utils.el('input', {
        type: 'range',
        id: cfg.name,
        className: 'msf-slider',
        min: cfg.min,
        max: cfg.max,
        step: cfg.step || 1,
        value: currentVal
      });
      input.style.setProperty('--msf-slider-pct', pct + '%');

      input.addEventListener('input', function (e) {
        // Visuelles Update (Gradient + Display) ohne State-Speicherung
        var val = Number(e.target.value);
        var p = ((val - cfg.min) / (cfg.max - cfg.min)) * 100;
        e.target.style.setProperty('--msf-slider-pct', p + '%');
        if (display) {
          var vs = cfg.unit ? val.toLocaleString('de-DE') + '\u202f' + cfg.unit : String(val);
          display.textContent = vs;
        }
      });
      input.addEventListener('change', function (e) {
        // State erst beim Loslassen speichern
        onChange(Number(e.target.value));
      });
      input.addEventListener('focus', function () { onFocus(cfg.name); });

      var labels = Utils.el('div', { className: 'msf-slider-labels' });
      labels.appendChild(Utils.el('span', {}, (cfg.unit ? cfg.min.toLocaleString('de-DE') + ' ' + cfg.unit : String(cfg.min))));
      labels.appendChild(Utils.el('span', {}, (cfg.unit ? cfg.max.toLocaleString('de-DE') + ' ' + cfg.unit : String(cfg.max))));

      return Fields.wrapField(cfg, [
        Fields.renderLabel(cfg),
        display,
        input,
        labels,
        Fields.renderError(error)
      ]);
    },

    render: function (fieldCfg, value, error, onChange, onFocus, onAutoAdvance, onNext) {
      var type = fieldCfg.type;
      switch (type) {
        case 'text':    return Fields.text(fieldCfg, value, error, onChange, onFocus, onNext);
        case 'email':   return Fields.email(fieldCfg, value, error, onChange, onFocus, onNext);
        case 'phone':   return Fields.phone(fieldCfg, value, error, onChange, onFocus, onNext);
        case 'number':  return Fields.number(fieldCfg, value, error, onChange, onFocus, onNext);
        case 'date':    return Fields.date(fieldCfg, value, error, onChange, onFocus, onNext);
        case 'textarea': return Fields.textarea(fieldCfg, value, error, onChange, onFocus);
        case 'boolean': return Fields.boolean(fieldCfg, value, error, onChange, onAutoAdvance);
        case 'select':  return Fields.select(fieldCfg, value, error, onChange, onAutoAdvance);
        case 'multi_select': return Fields.multi_select(fieldCfg, value, error, onChange);
        case 'image_select': return Fields.image_select(fieldCfg, value, error, onChange, onAutoAdvance);
        case 'slider':  return Fields.slider(fieldCfg, value, error, onChange, onFocus);
        default: return Utils.el('div', {}, 'Unknown field type: ' + type);
      }
    }
  };

  // ── FormWidget ───────────────────────────────────────────────

  var BUTTON_FIELD_TYPES = ['boolean', 'select', 'image_select', 'multi_select'];

  class FormWidget {
    constructor(container, config, options) {
      this.container = container;
      this.config = config;
      this.options = options || {};
      this.sessionId = Utils.uuid();
      this.utmParams = Utils.getUtmParams();
      this.stepStartTime = Date.now();
      this.loaderTimer = null;
      this.formStarted = false;
      this.isLandingMode = this.options.landingMode === true;

      // Validate required config fields
      if (!config.form_key) console.error('[MultiStepForm] config.form_key fehlt — Funnel-Übergabe zwischen Landing und Formular funktioniert nicht.');
      if (!config.form_name) console.error('[MultiStepForm] config.form_name fehlt — Formular kann nicht korrekt initialisiert werden.');
      if (!this.isLandingMode && !config.api_url) console.warn('[MultiStepForm] config.api_url fehlt — Formular kann nicht abgesendet werden.');

      // Build initial data from defaults (only for non-button field types)
      var initialData = {};
      config.steps.forEach(function (step) {
        if (step.type === 'loader') return;
        step.fields.forEach(function (field) {
          if (field.default_value !== undefined && BUTTON_FIELD_TYPES.indexOf(field.type) === -1) {
            initialData[field.name] = field.default_value;
          }
        });
      });

      // Try to load sessionStorage data (cross-page funnel)
      var storageKey = config.funnel_storage_key ||
        ('msf_funnel_' + config.form_key + '_' + config.form_name);
      var startIndex = 0;

      if (!this.isLandingMode) {
        var funnelData = null;
        var urlParams = new URLSearchParams(window.location.search);
        var fromLanding = urlParams.get('from_landing') === '1';

        if (fromLanding) {
          // Vom Landing-Step: sessionStorage lesen
          try {
            var stored = sessionStorage.getItem(storageKey);
            if (stored) funnelData = JSON.parse(stored);
          } catch (e) {}
          // Fallback: URL-Parameter (file:// oder blockierte sessionStorage)
          if (!funnelData) {
            try {
              var msfParam = urlParams.get('msf_data');
              if (msfParam) funnelData = JSON.parse(decodeURIComponent(msfParam));
            } catch (e) {}
          }
          // URL aufräumen
          if (window.history && window.history.replaceState) {
            urlParams.delete('from_landing');
            urlParams.delete('msf_data');
            var cleanUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
            window.history.replaceState({}, '', cleanUrl);
          }
        } else {
          // Nicht vom Landing → stale Funnel-Daten löschen
          try { sessionStorage.removeItem(storageKey); } catch (e) {}
        }

        if (funnelData) {
          Object.assign(initialData, funnelData);
          startIndex = 1;
        }
      }

      // Try localStorage persistence
      if (config.persist_to_local_storage && !this.isLandingMode) {
        var lsKey = config.local_storage_key || ('msf_' + config.form_key + '_' + config.form_name);
        try {
          var lsData = localStorage.getItem(lsKey);
          if (lsData) {
            var lsParsed = JSON.parse(lsData);
            if (lsParsed.data) {
              var multiSelectNames = {};
              config.steps.forEach(function(step) {
                if (step.type === 'loader') return;
                step.fields.forEach(function(field) {
                  if (field.type === 'multi_select') multiSelectNames[field.name] = true;
                });
              });
              Object.keys(lsParsed.data).forEach(function(key) {
                if (multiSelectNames[key]) initialData[key] = lsParsed.data[key];
              });
            }
            if (lsParsed.stepIndex !== undefined && startIndex === 0) {
              startIndex = lsParsed.stepIndex;
            }
          }
        } catch (e) {}
        this._lsKey = lsKey;
      }

      this.state = {
        currentStepIndex: startIndex,
        data: initialData,
        errors: {},
        isSubmitting: false,
        isSubmitted: false,
        submitError: null
      };

      this._setupAbandon();
      this.render();

      // Bfcache-Fix: Wenn die Seite aus dem Back/Forward-Cache wiederhergestellt wird,
      // muss _advancing zurückgesetzt werden, damit auto_advance erneut funktioniert.
      var self = this;
      window.addEventListener('pageshow', function (event) {
        if (event.persisted) {
          self._advancing = false;
        }
      });
    }

    // ── State helpers ──────────────────────────────────────────

    _persistLS() {
      if (!this._lsKey) return;
      try {
        localStorage.setItem(this._lsKey, JSON.stringify({
          data: this.state.data,
          stepIndex: this.state.currentStepIndex
        }));
      } catch (e) {}
    }

    _clearLS() {
      if (!this._lsKey) return;
      try { localStorage.removeItem(this._lsKey); } catch (e) {}
    }

    _setupAbandon() {
      var self = this;
      window.addEventListener('beforeunload', function () {
        if (!self.state.isSubmitted && self.config.submit_on_abandon) {
          var data = self.state.data;
          if (data.email) {
            // sendBeacon cannot set Authorization headers.
            // For production use a permissive RLS policy or Edge Function.
            console.log('[MultiStepForm] Abandon lead (implement sendBeacon with Edge Function for production)');
          }
          Analytics.track(self.config, 'form_abandoned', null, self.sessionId, self.utmParams);
        }
      });
    }

    _dispatchEvent(name, detail) {
      window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
    }

    // ── Computed ───────────────────────────────────────────────

    _getVisibleSteps() {
      return Logic.filterVisibleSteps(this.config.steps, this.state.data);
    }

    _getSafeIndex(visibleSteps) {
      return Math.min(this.state.currentStepIndex, visibleSteps.length - 1);
    }

    _getDisplaySteps(visibleSteps) {
      return visibleSteps.filter(function (s) { return s.type !== 'loader'; });
    }

    _getSafeDisplayIndex(visibleSteps, safeIndex) {
      var displaySteps = this._getDisplaySteps(visibleSteps);
      for (var i = safeIndex; i >= 0; i--) {
        if (visibleSteps[i] && visibleSteps[i].type !== 'loader') {
          return displaySteps.indexOf(visibleSteps[i]);
        }
      }
      return 0;
    }

    // ── Handlers ───────────────────────────────────────────────

    _handleChange(fieldName, value) {
      this.state.data[fieldName] = value;
      // Clear error in-place
      if (this.state.errors[fieldName]) {
        delete this.state.errors[fieldName];
        var errEl = this.container.querySelector('[data-field="' + fieldName + '"] .msf-error-msg');
        if (errEl) errEl.remove();
        var inputEl = this.container.querySelector('[data-field="' + fieldName + '"] .msf-input');
        if (inputEl) inputEl.classList.remove('msf-input--error');
      }
      this._persistLS();
      // Track field change
      var visibleSteps = this._getVisibleSteps();
      var safeIndex = this._getSafeIndex(visibleSteps);
      var currentStep = visibleSteps[safeIndex];
      if (currentStep) {
        Analytics.track(this.config, 'field_changed', {
          field_name: fieldName,
          step_id: currentStep.id,
          step_index: safeIndex
        }, this.sessionId, this.utmParams);
      }
    }

    _handleFocus(fieldName) {
      var visibleSteps = this._getVisibleSteps();
      var safeIndex = this._getSafeIndex(visibleSteps);
      var currentStep = visibleSteps[safeIndex];
      if (currentStep) {
        Analytics.track(this.config, 'field_focused', {
          field_name: fieldName,
          step_id: currentStep.id,
          step_index: safeIndex
        }, this.sessionId, this.utmParams);
      }
    }

    async _handleNext() {
      var visibleSteps = this._getVisibleSteps();
      var safeIndex = this._getSafeIndex(visibleSteps);
      var currentStep = visibleSteps[safeIndex];
      if (!currentStep || currentStep.type === 'loader') return;

      var visibleFieldNames = Logic.getVisibleFieldNames(currentStep, this.state.data);
      var errors = Validator.validateStep(currentStep, this.state.data, visibleFieldNames);

      if (Object.keys(errors).length > 0) {
        this.state.errors = errors;
        this.render();
        // Scroll first error into view
        var firstError = Object.keys(errors)[0];
        var errEl = this.container.querySelector('[data-field="' + firstError + '"]');
        if (errEl) errEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      var timeSpent = Date.now() - this.stepStartTime;
      Analytics.track(this.config, 'step_completed', {
        step_id: currentStep.id,
        step_index: safeIndex,
        time_spent_ms: timeSpent
      }, this.sessionId, this.utmParams);

      this._dispatchEvent('multistepform:step_complete', {
        form_name: this.config.form_name,
        step_index: safeIndex,
        step_title: currentStep.title || null
      });

      // Check if next step contains email
      var isLastStep = safeIndex === visibleSteps.length - 1;
      if (!isLastStep) {
        var nextStep = visibleSteps[safeIndex + 1];
        if (nextStep && nextStep.type !== 'loader' &&
            nextStep.fields.some(function (f) { return f.type === 'email'; })) {
          this._dispatchEvent('multistepform:contact_reached', { form_name: this.config.form_name });
        }
      }

      // LandingStep mode: save to sessionStorage and redirect
      if (this.isLandingMode) {
        var storageKey = this.config.funnel_storage_key ||
          ('msf_funnel_' + this.config.form_key + '_' + this.config.form_name);
        var stored = false;
        try {
          sessionStorage.setItem(storageKey, JSON.stringify(this.state.data));
          stored = true;
        } catch (e) {
          console.warn('[MultiStepForm] sessionStorage nicht verfügbar. Daten werden als URL-Parameter übergeben.', e);
        }
        // Redirect zur Funnel-Seite mit Marker from_landing=1
        var url = this.config.funnel_page_url;
        var sep = url.indexOf('?') === -1 ? '?' : '&';
        url += sep + 'from_landing=1';
        if (!stored) {
          url += '&msf_data=' + encodeURIComponent(JSON.stringify(this.state.data));
        }
        window.location.href = url;
        return;
      }

      if (isLastStep) {
        this.state.isSubmitting = true;
        this.render();
        if (this.config.demo_mode) {
          // Demo-Modus: API-Call überspringen, direkt Success zeigen
          this.state.isSubmitting = false;
          this.state.isSubmitted = true;
          this._redirectOrRender();
        } else {
          // Fire-and-forget: Submit im Hintergrund, sofort weiterleiten
          var apiUrl = (this.config.api_url || '').replace(/\/$/, '');
          var payload = JSON.stringify({ form_key: this.config.form_key, fields: this.state.data });

          // sendBeacon überlebt Page-Navigation
          var beaconSent = false;
          if (navigator.sendBeacon) {
            beaconSent = navigator.sendBeacon(
              apiUrl + '/api/submit',
              new Blob([payload], { type: 'application/json' })
            );
          }
          // Fallback: fetch mit keepalive
          if (!beaconSent) {
            fetch(apiUrl + '/api/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: payload,
              keepalive: true
            }).catch(function() {});
          }

          Analytics.track(this.config, 'form_submitted', null, this.sessionId, this.utmParams);
          this._clearLS();
          this.state.isSubmitting = false;
          this.state.isSubmitted = true;
          this._redirectOrRender();
        }
      } else {
        this.state.errors = {};
        this.state.currentStepIndex = safeIndex + 1;
        this._persistLS();
        this.render();
      }
    }

    _handleBack() {
      var visibleSteps = this._getVisibleSteps();
      var safeIndex = this._getSafeIndex(visibleSteps);
      var currentStep = visibleSteps[safeIndex];

      if (currentStep) {
        Analytics.track(this.config, 'step_abandoned', {
          step_id: currentStep.id,
          step_index: safeIndex
        }, this.sessionId, this.utmParams);
        this._dispatchEvent('multistepform:step_back', {
          form_name: this.config.form_name,
          from_step: safeIndex
        });
      }

      var targetIndex = safeIndex - 1;
      while (targetIndex > 0 && visibleSteps[targetIndex] && visibleSteps[targetIndex].type === 'loader') {
        targetIndex--;
      }
      this.state.currentStepIndex = Math.max(0, targetIndex);
      this.state.errors = {};
      this._persistLS();
      this.render();
    }

    // ── Render ─────────────────────────────────────────────────

    render() {
      // Clear loader timer
      if (this.loaderTimer) {
        clearTimeout(this.loaderTimer);
        this.loaderTimer = null;
      }

      this.container.classList.add('msf-widget');
      this.container.innerHTML = '';
      this._advancing = false;
      this.container.style.transition = '';
      this.container.style.opacity = '';
      // Remove any date popups left in body from previous step
      document.querySelectorAll('.msf-date-popup').forEach(function(p) { p.remove(); });

      if (this.state.isSubmitted) {
        this.container.classList.remove('msf-widget--image-step');
        this.container.style.maxWidth = '600px';
        this.container.style.marginLeft = 'auto';
        this.container.style.marginRight = 'auto';
        this.container.appendChild(this._renderSuccess());
        return;
      }

      var visibleSteps = this._getVisibleSteps();
      var safeIndex = this._getSafeIndex(visibleSteps);
      var currentStep = visibleSteps[safeIndex];
      if (!currentStep) return;

      // Breite je Step: image_select → volle Host-Breite, sonst 600px
      // inline-style schlägt externe ID/Klassen-Selektoren
      var hasImageSelect = currentStep.type !== 'loader' &&
        currentStep.fields &&
        currentStep.fields.some(function(f) { return f.type === 'image_select'; });
      if (hasImageSelect) {
        this.container.classList.add('msf-widget--image-step');
        var imgField = currentStep.fields.find(function(f) { return f.type === 'image_select'; });
        var optCount = imgField ? imgField.options.length : 0;
        if (optCount <= 4) {
          this.container.style.maxWidth = '1200px';
        } else {
          this.container.style.maxWidth = '960px';
        }
      } else {
        this.container.classList.remove('msf-widget--image-step');
        this.container.style.maxWidth = '600px';
      }
      this.container.style.marginLeft = 'auto';
      this.container.style.marginRight = 'auto';

      var displaySteps = this._getDisplaySteps(visibleSteps);
      var safeDisplayIndex = this._getSafeDisplayIndex(visibleSteps, safeIndex);
      // Wenn Loader läuft: vorherigen Display-Step als "done" markieren (+2 statt +1)
      var isLoaderRunning = currentStep.type === 'loader';
      var progressCurrent = isLoaderRunning ? safeDisplayIndex + 2 : safeDisplayIndex + 1;
      var progress = displaySteps.length > 0
        ? Math.round((progressCurrent / displaySteps.length) * 100)
        : 0;

      // Progress bar
      if (this.config.show_progress_bar !== false && displaySteps.length > 1) {
        this.container.appendChild(
          this._renderProgressBar(progressCurrent, displaySteps.length, progress)
        );
      }

      // Submit error
      if (this.state.submitError) {
        this.container.appendChild(this._renderErrorBanner(this.state.submitError));
      }

      // Step content
      if (currentStep.type === 'loader') {
        this.container.appendChild(this._renderLoaderStep(currentStep));
        var duration = currentStep.duration_ms != null ? currentStep.duration_ms : 2000;
        var self = this;
        this.loaderTimer = setTimeout(function () {
          self.state.currentStepIndex = safeIndex + 1;
          self.render();
        }, duration);
      } else {
        var isFirstStep = safeIndex === 0;
        var isLastStep = safeIndex === visibleSteps.length - 1;
        this.container.appendChild(
          this._renderStep(currentStep, isFirstStep, isLastStep)
        );
      }

      // Track step start
      var self = this;
      this.stepStartTime = Date.now();
      Analytics.track(this.config, 'step_started', {
        step_id: currentStep.id,
        step_index: safeIndex
      }, this.sessionId, this.utmParams);

      if (safeIndex === 0 && !this.formStarted) {
        this.formStarted = true;
        this._dispatchEvent('multistepform:start', { form_name: this.config.form_name });
      }
    }

    _renderProgressBar(current, total, progress) {
      var variant = this.config.progress_bar_variant || 'line';
      var wrap = Utils.el('div', { className: 'msf-progress' });

      if (variant === 'line') {
        var track = Utils.el('div', { className: 'msf-progress-line-track' });
        var fill = Utils.el('div', { className: 'msf-progress-line-fill' });
        fill.style.width = progress + '%';
        track.appendChild(fill);
        wrap.appendChild(track);
        var pct = Utils.el('span', { className: 'msf-progress-pct' }, progress + ' %');
        wrap.appendChild(pct);
      } else if (variant === 'steps') {
        var stepsRow = Utils.el('div', { className: 'msf-progress-steps', role: 'list' });
        for (var i = 1; i <= total; i++) {
          var state = i < current ? 'abgeschlossen' : i === current ? 'aktuell' : 'ausstehend';
          var circle = Utils.el('div', {
            className: 'msf-progress-step-circle' + (i < current ? ' msf-progress-step-circle--done' : i === current ? ' msf-progress-step-circle--active' : ' msf-progress-step-circle--pending'),
            role: 'listitem'
          });
          circle.setAttribute('aria-label', 'Schritt ' + i + ' von ' + total + ', ' + state);
          if (i < current) {
            circle.appendChild(Utils.svgCheckmark());
          } else {
            circle.textContent = String(i);
          }
          stepsRow.appendChild(circle);
          if (i < total) {
            var connector = Utils.el('div', { className: 'msf-progress-step-connector' + (i < current ? ' msf-progress-step-connector--done' : '') });
            stepsRow.appendChild(connector);
          }
        }
        wrap.appendChild(stepsRow);
      } else if (variant === 'dots') {
        var dotsRow = Utils.el('div', { className: 'msf-progress-dots' });
        for (var j = 1; j <= total; j++) {
          var dot = Utils.el('div', { className: 'msf-progress-dot' + (j === current ? ' msf-progress-dot--active' : j < current ? ' msf-progress-dot--done' : '') });
          dotsRow.appendChild(dot);
        }
        wrap.appendChild(dotsRow);
      }

      return wrap;
    }

    _renderLoaderStep(step) {
      var loader = Utils.el('div', { className: 'msf-loader' });
      loader.appendChild(Utils.el('div', { className: 'msf-spinner' }));
      var msgEl = Utils.el('p', { className: 'msf-loader-message' }, step.message || '');
      loader.appendChild(msgEl);

      if (Array.isArray(step.messages) && step.messages.length > 0) {
        var msgs = step.messages;
        var duration = step.duration_ms != null ? step.duration_ms : 2000;
        var interval = Math.floor(duration / msgs.length);
        var idx = 0;
        msgEl.textContent = msgs[0];
        msgEl.style.transition = 'opacity 0.25s';
        var timer = setInterval(function () {
          idx++;
          if (idx >= msgs.length) { clearInterval(timer); return; }
          msgEl.style.opacity = '0';
          setTimeout(function () {
            msgEl.textContent = msgs[idx];
            msgEl.style.opacity = '1';
          }, 200);
        }, interval);
      }

      return loader;
    }

    _renderStep(step, isFirstStep, isLastStep) {
      var self = this;
      var wrap = Utils.el('div', { className: 'msf-step' });

      // Badge
      if (step.badge_text) {
        var badge = Utils.el('div', { className: 'msf-step-badge' }, step.badge_text);
        wrap.appendChild(badge);
      }

      // Title
      if (step.title) {
        wrap.appendChild(Utils.el('h2', { className: 'msf-step-title' }, step.title));
      }

      // Subtitle
      if (step.subtitle) {
        wrap.appendChild(Utils.el('p', { className: 'msf-step-subtitle' }, step.subtitle));
      }

      // Fields
      var visibleFields = Logic.filterVisibleFields(step.fields, this.state.data);
      var shouldAutoAdvance = step.auto_advance === true;

      var fieldsWrap = Utils.el('div', { className: 'msf-fields' });
      visibleFields.forEach(function (fieldCfg) {
        var value = self.state.data[fieldCfg.name];
        var error = self.state.errors[fieldCfg.name];
        var onAutoAdv = shouldAutoAdvance ? function () {
          if (self._advancing) return;
          self._advancing = true;
          if (self.isLandingMode) {
            // Im LandingMode: direkt weiter, kein Fade (Browser-Redirect ersetzt die Seite)
            self._handleNext();
          } else {
            // Kurzes Fade-out vor dem Step-Wechsel
            self.container.style.transition = 'opacity 0.15s ease';
            self.container.style.opacity = '0';
            setTimeout(function () { self._handleNext(); }, 150);
          }
        } : null;

        var isButtonField = BUTTON_FIELD_TYPES.indexOf(fieldCfg.type) !== -1;
        var fieldEl = Fields.render(
          fieldCfg,
          value != null ? value : (!isButtonField && fieldCfg.default_value != null ? fieldCfg.default_value : null),
          error,
          function (val) {
            self._handleChange(fieldCfg.name, val);
          },
          function (name) { self._handleFocus(name); },
          onAutoAdv,
          function () { self._handleNext(); }
        );
        fieldsWrap.appendChild(fieldEl);
      });
      wrap.appendChild(fieldsWrap);

      // Navigation
      var showBack = !isFirstStep && this.config.allow_back_navigation !== false && !this.isLandingMode;
      var hasMultiSelect = step.fields && step.fields.some(function(f) { return f.multi_select === true; });
      var showNextBtn = !shouldAutoAdvance || hasMultiSelect;
      var nav = Utils.el('div', { className: 'msf-nav' + (showBack ? ' msf-nav--has-back' : '') });

      if (showBack) {
        var backBtn = Utils.el('button', { type: 'button', className: 'msf-btn-back' });
        backBtn.appendChild(Utils.svgArrowLeft());
        backBtn.appendChild(document.createTextNode('Zurück'));
        backBtn.addEventListener('click', function () { self._handleBack(); });
        nav.appendChild(backBtn);
      }

      if (showNextBtn) {
        var nextBtn = Utils.el('button', {
          type: 'button',
          className: 'msf-btn-next',
          disabled: this.state.isSubmitting
        });
        nextBtn.appendChild(document.createTextNode(this.state.isSubmitting ? 'Wird gesendet…' : (isLastStep ? 'Absenden' : 'Weiter')));
        if (!this.state.isSubmitting) nextBtn.appendChild(Utils.svgArrowRight());
        nextBtn.addEventListener('click', function () { self._handleNext(); });
        nav.appendChild(nextBtn);
      }

      wrap.appendChild(nav);
      return wrap;
    }

    _renderErrorBanner(msg) {
      var self = this;
      var banner = Utils.el('div', { className: 'msf-error-banner', role: 'alert' });
      var isFetchError = msg && msg.toLowerCase().includes('failed to fetch');
      var isCorsError = msg && (msg.toLowerCase().includes('cors') || msg.toLowerCase().includes('networkerror'));
      var displayMsg;
      if (isFetchError || isCorsError) {
        if (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          displayMsg = 'Verbindungsfehler. Für lokale Tests "demo_mode: true" in der Config setzen.';
        } else {
          displayMsg = 'Verbindungsfehler beim Senden. Bitte Seite neu laden und erneut versuchen.';
        }
      } else {
        displayMsg = msg;
      }
      banner.appendChild(Utils.el('span', {}, 'Fehler beim Absenden: ' + displayMsg));
      var retryBtn = Utils.el('button', { type: 'button', className: 'msf-error-retry' }, 'Erneut versuchen');
      retryBtn.addEventListener('click', function () {
        self.state.submitError = null;
        self._handleNext();
      });
      banner.appendChild(retryBtn);
      return banner;
    }

    _redirectOrRender() {
      // Funnel-Daten aus sessionStorage aufräumen (wurde beim Laden nicht gelöscht)
      var funnelKey = this.config.funnel_storage_key ||
        ('msf_funnel_' + this.config.form_key + '_' + this.config.form_name);
      try { sessionStorage.removeItem(funnelKey); } catch (e) {}

      if (this.config.thank_you_page_url) {
        var tyKey = 'msf_ty_' + this.config.form_key + '_' + this.config.form_name;
        try {
          sessionStorage.setItem(tyKey, JSON.stringify({
            data: this.state.data,
            config: {
              steps: this.config.steps,
              success_message: this.config.success_message,
              success_description: this.config.success_description,
              success_cta_url: this.config.success_cta_url,
              success_cta_label: this.config.success_cta_label,
              _accentColor: this.config._accentColor
            }
          }));
        } catch (e) {}
        window.location.href = this.config.thank_you_page_url;
      } else {
        this.render();
      }
    }

    _renderSuccess() {
      var cfg = this.config;
      var wrap = Utils.el('div', { className: 'msf-success' });

      // Confetti
      var confettiColors = [cfg._accentColor || '#2D5016', '#C9A84C'];
      for (var i = 0; i < 6; i++) {
        var piece = Utils.el('div', { className: 'msf-confetti-piece' });
        piece.style.background = confettiColors[i % 2];
        piece.style.top = (20 + i * 5) + '%';
        piece.style.left = (15 + i * 12) + '%';
        piece.style.animationDelay = (i * 0.12) + 's';
        piece.style.transform = 'rotate(' + (i * 45) + 'deg)';
        wrap.appendChild(piece);
      }

      // Checkmark
      var circle = Utils.el('div', { className: 'msf-checkmark-circle' });
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '40');
      svg.setAttribute('height', '40');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'var(--msf-accent)');
      svg.setAttribute('stroke-width', '2.5');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'msf-checkmark-path');
      path.setAttribute('stroke-linecap', 'round');
      path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('d', 'M5 13l4 4L19 7');
      svg.appendChild(path);
      circle.appendChild(svg);
      wrap.appendChild(circle);

      wrap.appendChild(Utils.el('h2', { className: 'msf-success-title' }, cfg.success_message));

      if (cfg.success_description) {
        wrap.appendChild(Utils.el('p', { className: 'msf-success-desc' }, cfg.success_description));
      }

      // Summary
      var summaryItems = this._buildSummaryItems();
      if (summaryItems.length > 0) {
        var summary = Utils.el('div', { className: 'msf-success-summary' });
        summaryItems.forEach(function (item) {
          var row = Utils.el('div', { className: 'msf-success-summary-row' });
          row.appendChild(Utils.el('span', { className: 'msf-success-summary-label' }, item.label));
          row.appendChild(Utils.el('span', { className: 'msf-success-summary-value' }, item.value));
          summary.appendChild(row);
        });
        wrap.appendChild(summary);
      }

      if (cfg.success_cta_url && cfg.success_cta_label) {
        var cta = Utils.el('a', {
          href: cfg.success_cta_url,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'msf-success-cta'
        }, cfg.success_cta_label);
        cta.appendChild(Utils.svgArrowRight());
        wrap.appendChild(cta);
      }

      return wrap;
    }

    _buildSummaryItems() {
      var items = [];
      var data = this.state.data;
      this.config.steps.forEach(function (step) {
        if (step.type === 'loader' || !step.fields) return;
        step.fields.forEach(function (field) {
          var val = data[field.name];
          if (val === undefined || val === null || val === '') return;
          if (Array.isArray(val) && val.length === 0) return;
          // Leere Labels: Fallback auf Step-Titel, dann Feldname
          var label = field.label || step.title || field.name;
          var displayVal;
          if (field.options) {
            var opts = field.options;
            if (Array.isArray(val)) {
              displayVal = val.map(function (v) {
                var found = opts.find(function (o) { return o.value === v; });
                return found ? found.label : v;
              }).join(', ');
            } else {
              var found = opts.find(function (o) { return o.value === val; });
              displayVal = found ? found.label : String(val);
            }
          } else if (field.type === 'boolean') {
            displayVal = val === true ? (field.true_label || 'Ja') : (field.false_label || 'Nein');
          } else if (field.type === 'slider' && field.unit) {
            displayVal = Number(val).toLocaleString('de-DE') + '\u202f' + field.unit;
          } else if (field.type === 'date' && val) {
            // ISO-Datum (YYYY-MM-DD) → deutsches Format (DD.MM.YYYY)
            var parts = String(val).split('-');
            displayVal = parts.length === 3 ? parts[2] + '.' + parts[1] + '.' + parts[0] : String(val);
          } else {
            displayVal = String(val);
          }
          if (label) items.push({ label: label, value: displayVal });
        });
      });
      return items;
    }
  }

  // ── ThankYouWidget ───────────────────────────────────────────

  class ThankYouWidget {
    constructor(container, config) {
      this.container = container;
      this.config = config;

      var tyKey = 'msf_ty_' + config.form_key + '_' + config.form_name;
      var stored = null;
      try {
        var raw = sessionStorage.getItem(tyKey);
        if (!raw) {
          // Fallback: nach einem beliebigen Key mit gleichem form_key-Prefix suchen
          var prefix = 'msf_ty_' + config.form_key + '_';
          for (var i = 0; i < sessionStorage.length; i++) {
            var k = sessionStorage.key(i);
            if (k && k.indexOf(prefix) === 0) { raw = sessionStorage.getItem(k); tyKey = k; break; }
          }
        }
        if (raw) {
          stored = JSON.parse(raw);
          sessionStorage.removeItem(tyKey);
        }
      } catch (e) {}

      this.formData = stored ? stored.data : {};
      if (stored && stored.config) {
        this.config = Object.assign({}, config, stored.config);
      }
      this.render();
    }

    render() {
      this.container.classList.add('msf-widget');
      this.container.innerHTML = '';
      this.container.appendChild(this._renderContent());
    }

    _renderContent() {
      var cfg = this.config;
      var wrap = Utils.el('div', { className: 'msf-success' });

      // Confetti
      var confettiColors = [cfg._accentColor || '#2D5016', '#C9A84C'];
      for (var i = 0; i < 6; i++) {
        var piece = Utils.el('div', { className: 'msf-confetti-piece' });
        piece.style.background = confettiColors[i % 2];
        piece.style.top = (20 + i * 5) + '%';
        piece.style.left = (15 + i * 12) + '%';
        piece.style.animationDelay = (i * 0.12) + 's';
        piece.style.transform = 'rotate(' + (i * 45) + 'deg)';
        wrap.appendChild(piece);
      }

      // Checkmark
      var circle = Utils.el('div', { className: 'msf-checkmark-circle' });
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '40'); svg.setAttribute('height', '40');
      svg.setAttribute('viewBox', '0 0 24 24'); svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'var(--msf-accent)'); svg.setAttribute('stroke-width', '2.5');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('class', 'msf-checkmark-path');
      path.setAttribute('stroke-linecap', 'round'); path.setAttribute('stroke-linejoin', 'round');
      path.setAttribute('d', 'M5 13l4 4L19 7');
      svg.appendChild(path); circle.appendChild(svg); wrap.appendChild(circle);

      wrap.appendChild(Utils.el('h2', { className: 'msf-success-title' }, cfg.success_message || 'Vielen Dank!'));

      if (cfg.success_description) {
        wrap.appendChild(Utils.el('p', { className: 'msf-success-desc' }, cfg.success_description));
      }

      // Summary
      var summaryItems = this._buildSummaryItems();
      if (summaryItems.length > 0) {
        var summary = Utils.el('div', { className: 'msf-success-summary' });
        summaryItems.forEach(function (item) {
          var row = Utils.el('div', { className: 'msf-success-summary-row' });
          row.appendChild(Utils.el('span', { className: 'msf-success-summary-label' }, item.label));
          row.appendChild(Utils.el('span', { className: 'msf-success-summary-value' }, item.value));
          summary.appendChild(row);
        });
        wrap.appendChild(summary);
      }

      if (cfg.success_cta_url && cfg.success_cta_label) {
        var cta = Utils.el('a', {
          href: cfg.success_cta_url,
          target: '_blank',
          rel: 'noopener noreferrer',
          className: 'msf-success-cta'
        }, cfg.success_cta_label);
        cta.appendChild(Utils.svgArrowRight());
        wrap.appendChild(cta);
      }

      return wrap;
    }

    _buildSummaryItems() {
      var items = [];
      var data = this.formData;
      var steps = this.config.steps || [];
      steps.forEach(function (step) {
        if (step.type === 'loader' || !step.fields) return;
        step.fields.forEach(function (field) {
          var val = data[field.name];
          if (val === undefined || val === null || val === '') return;
          if (Array.isArray(val) && val.length === 0) return;
          var label = field.label || step.title || field.name;
          var displayVal;
          if (field.options) {
            var opts = field.options;
            if (Array.isArray(val)) {
              displayVal = val.map(function (v) {
                var found = opts.find(function (o) { return o.value === v; });
                return found ? found.label : v;
              }).join(', ');
            } else {
              var found = opts.find(function (o) { return o.value === val; });
              displayVal = found ? found.label : String(val);
            }
          } else if (field.type === 'boolean') {
            displayVal = val === true ? (field.true_label || 'Ja') : (field.false_label || 'Nein');
          } else if (field.type === 'slider' && field.unit) {
            displayVal = Number(val).toLocaleString('de-DE') + '\u202f' + field.unit;
          } else if (field.type === 'date' && val) {
            var parts = String(val).split('-');
            displayVal = parts.length === 3 ? parts[2] + '.' + parts[1] + '.' + parts[0] : String(val);
          } else {
            displayVal = String(val);
          }
          if (label) items.push({ label: label, value: displayVal });
        });
      });
      return items;
    }
  }

  // ── Public API ───────────────────────────────────────────────

  global.MultiStepForm = {
    /**
     * Initialize a full multi-step form.
     * @param {string} selector - CSS selector for the container element
     * @param {object} config   - FormConfig object
     * @returns {FormWidget}
     */
    init: function (selector, config) {
      var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) {
        console.warn('[MultiStepForm] Container not found:', selector);
        return null;
      }
      return new FormWidget(el, config);
    },

    /**
     * Initialize only the first step (LandingStep mode).
     * On "Next", saves data to sessionStorage and redirects to config.funnel_page_url.
     * @param {string} selector - CSS selector for the container element
     * @param {object} config   - FormConfig object (must have funnel_page_url set)
     * @returns {FormWidget}
     */
    /**
     * Initialize a Thank You widget on a dedicated thank-you page.
     * Reads submitted form data from sessionStorage and renders the success summary.
     * @param {string} selector - CSS selector for the container element
     * @param {object} config   - FormConfig object (form_key + form_name must match the form)
     * @returns {ThankYouWidget}
     */
    initThankYou: function (selector, config) {
      var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) {
        console.warn('[MultiStepForm] Container not found:', selector);
        return null;
      }
      return new ThankYouWidget(el, config);
    },

    initLanding: function (selector, config) {
      var el = typeof selector === 'string' ? document.querySelector(selector) : selector;
      if (!el) {
        console.warn('[MultiStepForm] Container not found:', selector);
        return null;
      }
      if (!config.funnel_page_url) {
        console.error('[MultiStepForm] initLanding requires config.funnel_page_url to be set.');
        return null;
      }
      if (!config.form_key) {
        console.error('[MultiStepForm] initLanding: config.form_key fehlt — Funnel-Übergabe zur Formular-Seite funktioniert nicht.');
      }
      return new FormWidget(el, config, { landingMode: true });
    },

    /**
     * Auto-init: looks for window.FORM_CONFIG and [data-msf-container] or #msf-form.
     */
    autoInit: function () {
      var cfg = global.FORM_CONFIG;
      if (!cfg) {
        var c = document.querySelector('[data-msf-container]') || document.querySelector('#msf-form');
        if (c) {
          console.error('[MultiStepForm] window.FORM_CONFIG ist nicht definiert. Die Config-Datei muss mit "window.FORM_CONFIG = { ... };" beginnen.');
          c.innerHTML = '<div style="padding:24px;color:#B91C1C;font-family:system-ui;font-size:14px;background:#FEF2F2;border:1px solid #FECACA;border-radius:12px;text-align:center;">\u26A0 Formular-Konfiguration fehlt \u2014 <code>window.FORM_CONFIG</code> ist nicht definiert.</div>';
        }
        return;
      }
      var el = document.querySelector('[data-msf-container]') || document.querySelector('#msf-form');
      if (!el) {
        console.error('[MultiStepForm] Kein Container gefunden. Erwartet: Element mit data-msf-container oder id="msf-form".');
        return;
      }
      var landingMode = el.hasAttribute('data-msf-landing');
      if (landingMode) {
        global.MultiStepForm.initLanding(el, cfg);
      } else {
        global.MultiStepForm.init(el, cfg);
      }
    }
  };

  // Auto-init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', global.MultiStepForm.autoInit);
  } else {
    global.MultiStepForm.autoInit();
  }

})(window);
