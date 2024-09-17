document.addEventListener('DOMContentLoaded', function () {
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eye-icon');
  const matriculaInput = document.getElementById('matricula');
  const matriculaError = document.getElementById('matricula-error');
  const form = document.getElementById('login-form');
  const toast = document.getElementById('toast');
  const loginMessage = localStorage.getItem('loginMessage');

  if (loginMessage) {
    toast.textContent = loginMessage;
    toast.className = 'toast show';

    // Remove a mensagem após exibir
    localStorage.removeItem('loginMessage');

    // Esconde o toast após 3 segundos
    setTimeout(function () {
      toast.className = toast.className.replace('show', '');
    }, 3000);
  }

  // Alterna a visibilidade da senha
  togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Alterna o ícone de olho
    eyeIcon.setAttribute('d', type === 'password'
      ? 'M10 2C5.858 2 2.527 4.71 1.335 8.641a1 1 0 000 .718C2.527 15.29 5.858 18 10 18c4.142 0 7.473-2.71 8.665-6.641a1 1 0 000-.718C17.473 4.71 14.142 2 10 2zM10 4c3.243 0 5.98 2.202 6.945 5C15.98 12.798 13.243 15 10 15c-3.243 0-5.98-2.202-6.945-5C4.02 6.202 6.757 4 10 4zm0 2a3 3 0 100 6 3 3 0 000-6zM10 8a1 1 0 110 2 1 1 0 010-2z'
      : 'M10 4c3.243 0 5.98 2.202 6.945 5C15.98 12.798 13.243 15 10 15c-3.243 0-5.98-2.202-6.945-5C4.02 6.202 6.757 4 10 4z');
  });

  // Validação da matrícula e envio do formulário
  form.addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const matriculaValue = matriculaInput.value.trim();
    const passwordValue = passwordInput.value;

    // Valida a matrícula
    if (!/^\d{8}$/.test(matriculaValue)) {
      matriculaError.classList.remove('hidden');
      return;
    } else {
      matriculaError.classList.add('hidden');
    }

    // Envia a requisição para a API
    try {
      const response = await fetch('https://api-reserva-lab.vercel.app/login', { // Atualize a URL conforme necessário
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matricula: matriculaValue,
          senha: passwordValue,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Armazena informações do usuário no localStorage
        localStorage.setItem('userName', data.nome);
        localStorage.setItem('userMatricula', data.matricula);
        localStorage.setItem('userType', data.tipo_usuario);

        // Redireciona para a página principal
        window.location.href = './home/home.html'; // Altere para a URL desejada
      } else {
        alert(data.message || 'Matrícula ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      alert('Ocorreu um erro. Tente novamente.');
    }
  });
});
