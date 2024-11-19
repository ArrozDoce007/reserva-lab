document.addEventListener('DOMContentLoaded', function () {
    const buttonText = document.getElementById('button-text2');
    const loadingSpinner = document.getElementById('loading-spinner2');
    const cadastroForm = document.getElementById('cadastro-form');
    const nomeInput = document.getElementById('nome');
    const matriculaInput = document.getElementById('matricula2');
    const emailInput = document.getElementById('email');
    const passwordInput2 = document.getElementById('password2');
    const passwordInput3 = document.getElementById('password3');
    const togglePassword = document.getElementById('toggle-password2');
    const eyeIcon = document.getElementById('eye-icon2');
    const soundButton = document.getElementById('soundButton');
    const checkbox = document.getElementById('reg-log');
    const professorCheckbox = document.getElementById('professor'); // Checkbox para professor
    const coordenadorCheckbox = document.getElementById('coordenador'); // Checkbox para coordenador
    const funcionarioCheckbox = document.getElementById('funcionario'); // Checkbox para funcionario
    const matriculaField = document.getElementById('matriculaField'); // Campo matrícula
    const mainCheckbox = document.querySelector('.checkbox'); // A checkbox principal que controla as outras
    const checkboxes = [professorCheckbox, coordenadorCheckbox, funcionarioCheckbox]; // Todas as checkboxes específicas
    const card3dWraps = document.querySelectorAll('.card-3d-wrap'); // Seleciona todos os elementos com a classe .card-3d-wrap

    // Função para exibir ou esconder o campo de matrícula
    function toggleMatricula() {
        const isAnyChecked = professorCheckbox.checked || coordenadorCheckbox.checked || funcionarioCheckbox.checked;
        matriculaField.style.display = isAnyChecked ? 'block' : 'none';
    }

    // Função para garantir que apenas uma checkbox esteja marcada
    function handleCheckboxClick(clickedCheckbox) {
        checkboxes.forEach(checkbox => {
            if (checkbox !== clickedCheckbox) {
                checkbox.checked = false; // Desmarcar as outras checkboxes
            }
        });
        toggleMatricula(); // Atualiza visibilidade do campo "Matrícula"

        // Muda a altura de todos os elementos com a classe .card-3d-wrap
        const isAnyChecked = professorCheckbox.checked || coordenadorCheckbox.checked || funcionarioCheckbox.checked;
        card3dWraps.forEach(card3dWrap => {
            if (isAnyChecked) {
                card3dWrap.style.height = '1100px'; // Aumenta a altura para 1100px
            } else if (mainCheckbox.checked) {
                card3dWrap.style.height = '1020px'; // Se a checkbox principal for marcada, ajusta para 1020px
            } else {
                card3dWrap.style.height = '900px'; // Reverte a altura para 900px quando nenhuma checkbox está marcada
            }
        });
    }

    // Adiciona o evento de clique para cada checkbox específica
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function () {
            handleCheckboxClick(checkbox);
        });
    });

    // Lógica para desmarcar todas as checkboxes específicas quando a .checkbox principal for desmarcada
    mainCheckbox.addEventListener('change', function () {
        if (!mainCheckbox.checked) {
            // Se a checkbox principal for desmarcada, desmarque todas as outras
            checkboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            toggleMatricula(); // Atualiza a visibilidade do campo "Matrícula" (vai esconder se tudo estiver desmarcado)

            // Reverte a altura de todos os elementos .card-3d-wrap
            card3dWraps.forEach(card3dWrap => {
                card3dWrap.style.height = '900px'; // Reverte a altura para 900px
            });
        } else {
            // Se a checkbox principal for marcada, ajusta a altura para 1020px
            card3dWraps.forEach(card3dWrap => {
                card3dWrap.style.height = '1020px';
            });
        }
    });

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

    // Alterna a visibilidade da senha
    togglePassword.addEventListener('click', function () {
        const type = passwordInput2.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput2.setAttribute('type', type);

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

    // Validação do formulário e envio
    cadastroForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        // Validação dos campos
        if (!validateForm()) {
            return;
        }

        const submitButton = document.getElementById('login-button2');
        submitButton.disabled = true; // Desabilita o botão
        buttonText.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        // Identifica o tipo de usuário com base no checkbox selecionado
        let tipoUsuario = '';
        if (professorCheckbox.checked) {
            tipoUsuario = 'Professor';
        } else if (coordenadorCheckbox.checked) {
            tipoUsuario = 'Coordenador';
        } else if (funcionarioCheckbox.checked) {
            tipoUsuario = 'Funcionário';
        }

        // Preparar dados para envio
        const formData = {
            nome: nomeInput.value.trim(),
            matricula: matriculaInput.value.trim(),
            email: emailInput.value.trim(),
            senha: passwordInput2.value,
            tipoUsuario: tipoUsuario  // Adiciona o tipo de usuário selecionado
        };

        try {
            const response = await fetch('/cadastro', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                cadastroForm.reset();
                // Mostra o modal e desmarca o checkbox quando o modal for fechado
                showModal('Cadastro solicitado com sucesso! Aguarde a aprovação.', () => {
                    checkbox.checked = false;
                });
            } else {
                showModal(data.message || 'Erro ao solicitar o cadastro. Tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao tentar cadastrar:', error);
            showModal('Ocorreu um erro. Tente novamente.');
        } finally {
            // Oculta o spinner e retorna ao texto original do botão
            buttonText.classList.remove('hidden');
            loadingSpinner.classList.add('hidden');
            submitButton.disabled = false; // Reabilita o botão após o processamento
        }
    });

    function validateForm() {
        let isValid = true;

        if (nomeInput.value.trim() === '') {
            showError(nomeInput, 'Nome é obrigatório');
            isValid = false;
        } else {
            clearError(nomeInput);
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value.trim())) {
            showError(emailInput, 'Email inválido');
            isValid = false;
        } else {
            clearError(emailInput);
        }

        if (passwordInput2.value.length < 8) {
            showError(passwordInput3, 'A senha deve ter pelo menos 8 caracteres');
            isValid = false;
        } else {
            clearError(passwordInput3);
        }

        return isValid;
    }

    function showError(input, message) {
        const formControl = input.parentElement;
        const errorElement = formControl.querySelector('.error-message') || document.createElement('p');
        errorElement.className = 'error-message text-red-500 text-sm mt-1';
        errorElement.textContent = message;
        if (!formControl.querySelector('.error-message')) {
            formControl.appendChild(errorElement);
        }
    }

    function clearError(input) {
        const formControl = input.parentElement;
        const errorElement = formControl.querySelector('.error-message');
        if (errorElement) {
            formControl.removeChild(errorElement);
        }
    }

    // Função para criar e exibir o modal com callback opcional para o evento de fechar
    function showModal(message, onCloseCallback = null) {
        // Remove um modal existente, se houver
        const existingModal = document.getElementById('custom-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // Cria os elementos do modal
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

        // Fecha o modal e executa o callback opcional
        closeButton.onclick = () => {
            modal.remove();
            if (onCloseCallback) {
                onCloseCallback();  // Executa o callback se ele for passado
            }
        };

        // Permitir que o usuário use 'Enter' ou 'Space' para fechar o modal
        closeButton.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();  // Impede o comportamento padrão do botão
                closeButton.onclick();
            }
        };

        // Definir ícone e cores
        modalIcon.className += ' bg-blue-100';
        modalIcon.innerHTML = '<svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

        // Monta o modal
        modalBody.appendChild(modalIcon);
        modalBody.appendChild(modalText);
        modalBody.appendChild(closeButton);
        modalContent.appendChild(modalBody);
        modal.appendChild(modalContent);

        // Adiciona o modal ao documento
        document.body.appendChild(modal);

        // Focar no botão de fechar quando o modal for exibido
        closeButton.focus();

        // Lê o texto do modal se a leitura em voz alta estiver ativada
        if (isSoundActive) {
            readText(modalText);
        }
    }
});