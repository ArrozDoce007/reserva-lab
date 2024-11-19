let colorbg = new Color4Bg.ChaosWavesBg({
  dom: "bg-container",
  colors: ["#F1D1FC", "#FCDBF8", "#E8FAFF", "#C9F1FF", "#C5D9FC", "#F1D1FC"],
  loop: true
})

document.addEventListener('DOMContentLoaded', function () {
  const buttonText = document.getElementById('button-text');
  const loadingSpinner = document.getElementById('loading-spinner');
  const togglePassword = document.getElementById('toggle-password');
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eye-icon');
  const matriculaInput = document.getElementById('matricula');
  const form = document.getElementById('login-form');
  const toast = document.getElementById('toast');
  const loginMessage = localStorage.getItem('loginMessage');
  const soundButton = document.getElementById('soundButton');


  // Recuperar o estado do localStorage ou definir como false
  let isSoundActive = JSON.parse(localStorage.getItem('isSoundActive')) || false;
  let currentHighlight = null;

  // Atualiza o botão e o cursor ao carregar a página
  if (isSoundActive) {
    soundButton.classList.add('active');
    document.body.style.cursor = 'pointer';
  }

  // VLibras
  new window.VLibras.Widget('https://vlibras.gov.br/app');

  // Alterna o estado de ativação da função de leitura em voz alta
  soundButton.addEventListener('click', function () {
    isSoundActive = !isSoundActive;
    this.classList.toggle('active', isSoundActive);

    // Armazenar o estado no localStorage
    localStorage.setItem('isSoundActive', JSON.stringify(isSoundActive));

    if (isSoundActive) {
      showModal('Função de leitura em voz alta ativada. Clique no texto ou use Tab para navegar.');
      document.body.style.cursor = 'pointer';
    } else {
      window.speechSynthesis.cancel();
      if (currentHighlight) {
        currentHighlight.classList.remove('highlight');
        currentHighlight = null;
      }
      document.body.style.cursor = 'default';

      // Mostrar mensagem ao desativar a função
      showModal('Função de leitura em voz alta desativada.');

      // Ler automaticamente a mensagem ao desativar
      const message = 'Função de leitura em voz alta desativada.';
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  });

  // Função para ler texto em voz alta e destacar o elemento
  function readText(element) {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    if (currentHighlight) {
      currentHighlight.classList.remove('highlight');
    }

    element.classList.add('highlight');
    currentHighlight = element;

    const text = element.textContent.trim();
    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.onend = function () {
        element.classList.remove('highlight');
        currentHighlight = null;
      };
      window.speechSynthesis.speak(utterance);
    }
  }

  // Lida com o clique para leitura em voz alta
  document.addEventListener('click', function (e) {
    if (e.target.closest('.accessibility-container')) return;

    if (isSoundActive) {
      readText(e.target);
    }
  });

  // Lida com o foco via teclado (Tab) para leitura em voz alta
  document.addEventListener('focusin', function (e) {
    // Verifica se a leitura está ativa e se o elemento tem tabindex
    if (isSoundActive && e.target.getAttribute('tabindex') !== null) {
      readText(e.target);
    }
  }, true);

  // Lida com a navegação com Tab para ler textos em elementos focados
  document.addEventListener('keydown', function (e) {
    // Verifica se a tecla Tab foi pressionada e se a leitura está ativa
    if (isSoundActive && e.key === 'Tab') {
      let focusedElement = document.activeElement;
      // Lê apenas se o elemento focado tiver tabindex
      if (focusedElement.getAttribute('tabindex') !== null) {
        readText(focusedElement);
      }
    }
  });

  // Função para criar e exibir o modal
  function showModal(message) {
    // Remove um modal existente, se houver
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal elements
    const modal = document.createElement('div');
    modal.id = 'custom-modal';
    modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
    modal.style.zIndex = '10000000000';

    const modalContent = document.createElement('div');
    modalContent.className = 'bg-white p-5 border w-96 shadow-lg rounded-md';

    const modalBody = document.createElement('div');
    modalBody.className = 'mt-3 text-center';

    const modalIcon = document.createElement('div');
    modalIcon.className = 'mx-auto flex items-center justify-center h-12 w-12 rounded-full';

    const modalText = document.createElement('h3');
    modalText.className = 'text-lg leading-6 font-medium text-gray-900 mt-5';
    modalText.textContent = message;

    const closeButton = document.createElement('button');
    closeButton.className = 'mt-5 px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300';
    closeButton.textContent = 'Fechar';

    // Fecha o modal e retorna o foco
    closeButton.onclick = () => {
      modal.remove();
      soundButton.focus();  // Retorna o foco ao botão de som
    };

    // Permitir que o usuário use 'Enter' ou 'Space' para fechar o modal
    closeButton.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();  // Impede o comportamento padrão do botão
        closeButton.onclick();
      }
    };

    // Set icon and colors
    modalIcon.className += ' bg-blue-100';
    modalIcon.innerHTML = '<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

    // Assemble the modal
    modalBody.appendChild(modalIcon);
    modalBody.appendChild(modalText);
    modalBody.appendChild(closeButton);
    modalContent.appendChild(modalBody);
    modal.appendChild(modalContent);

    // Add the modal to the document
    document.body.appendChild(modal);

    // Focar no botão de fechar quando o modal for exibido
    closeButton.focus();

    // Lê o texto do modal se a leitura em voz alta estiver ativada
    if (isSoundActive) {
      readText(modalText);
    }
  }

  if (loginMessage) {
    toast.textContent = loginMessage;
    toast.className = 'toast show';

    // Remove a mensagem após exibir
    localStorage.removeItem('loginMessage');

    // Esconde o toast após segundos
    setTimeout(function () {
      toast.className = toast.className.replace('show', '');
    }, 5000);
  }

  // Alterna a visibilidade da senha
  togglePassword.addEventListener('click', function () {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);

    // Alterna o ícone de olho
    if (type === 'password') {
      // Ícone de olho fechado com corte
      eyeIcon.innerHTML = `
        <path d="M10 4c3.243 0 5.98 2.202 6.945 5C15.98 12.798 13.243 15 10 15c-3.243 0-5.98-2.202-6.945-5C4.02 6.202 6.757 4 10 4z" />
        <path d="M2 2l16 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      `;
    } else {
      // Ícone de olho aberto sem corte
      eyeIcon.innerHTML = `
        <path d="M10 2C5.858 2 2.527 4.71 1.335 8.641a1 1 0 000 .718C2.527 15.29 5.858 18 10 18c4.142 0 7.473-2.71 8.665-6.641a1 1 0 000-.718C17.473 4.71 14.142 2 10 2zM10 4c3.243 0 5.98 2.202 6.945 5C15.98 12.798 13.243 15 10 15c-3.243 0-5.98-2.202-6.945-5C4.02 6.202 6.757 4 10 4zm0 2a3 3 0 100 6 3 3 0 000-6zM10 8a1 1 0 110 2 1 1 0 010-2z" />
      `;
    }
  });

  // Validação da matrícula e envio do formulário
  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const matriculaValue = matriculaInput.value.trim();
    const passwordValue = passwordInput.value;

    // Exibe o spinner e muda o texto do botão
    buttonText.classList.add('hidden');
    loadingSpinner.classList.remove('hidden');

    // Envia a requisição para a API
    try {
      const response = await fetch('/login', {
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

        // Armazena o token JWT no localStorage
        localStorage.setItem('authToken', data.token);

        // Define o estado de login no sessionStorage
        sessionStorage.setItem('isLoggedIn', 'true');

        // Redireciona para a página principal
        window.location.replace('./home/home.html');
      } else {
        showModal(data.message || 'Matrícula ou senha inválidos');
      }
    } catch (error) {
      console.error('Erro ao tentar fazer login:', error);
      showModal('Ocorreu um erro. Tente novamente.');
    } finally {
      // Oculta o spinner e retorna ao texto original do botão
      buttonText.classList.remove('hidden');
      loadingSpinner.classList.add('hidden');
    }
  });
});