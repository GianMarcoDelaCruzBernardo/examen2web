// Validacion de formularios en el cliente (antes de enviar al back-end)
(function () {
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.setAttribute('novalidate', 'novalidate');

    function limpiar(inp) {
      inp.classList.remove('invalido');
      var prev = inp.parentNode.querySelector('.campo-error');
      if (prev) prev.remove();
    }

    function marcar(inp, msg) {
      inp.classList.add('invalido');
      var s = document.createElement('small');
      s.className = 'campo-error';
      s.textContent = msg;
      inp.parentNode.appendChild(s);
    }

    function validar(inp) {
      limpiar(inp);
      if (inp.type === 'hidden' || inp.disabled) return true;
      var valor = inp.value.trim();
      if (inp.required && !valor) {
        marcar(inp, inp.dataset.msg || 'Este campo es obligatorio');
        return false;
      }
      if (valor && !inp.checkValidity()) {
        marcar(inp, inp.dataset.msg || inp.validationMessage);
        return false;
      }
      if (inp.name === 'confirmar') {
        var pass = form.querySelector('[name=password]');
        if (pass && pass.value !== inp.value) {
          marcar(inp, 'Las claves no coinciden');
          return false;
        }
      }
      return true;
    }

    var campos = form.querySelectorAll('input, select, textarea');

    campos.forEach(function (inp) {
      inp.addEventListener('blur', function () { validar(inp); });
      inp.addEventListener('input', function () { if (inp.classList.contains('invalido')) validar(inp); });
    });

    form.addEventListener('submit', function (e) {
      var primero = null;
      campos.forEach(function (inp) {
        if (!validar(inp) && !primero) primero = inp;
      });
      if (primero) {
        e.preventDefault();
        primero.focus();
      }
    });
  });
})();
