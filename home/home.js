let colorbg = new Color4Bg.ChaosWavesBg({
    dom: "bg-container",
    colors: ["#F1D1FC", "#FCDBF8", "#E8FAFF", "#C9F1FF", "#C5D9FC", "#F1D1FC"],
    loop: true
})

document.addEventListener('DOMContentLoaded', function () {
    function checkAuth() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
        const userName = localStorage.getItem('userName');
        const userMatricula = localStorage.getItem('userMatricula');
        const token = localStorage.getItem('authToken');

        if (!isLoggedIn || !userName || !userMatricula || !token) {
            // Usuário não está autenticado, redireciona para a página de login
            window.location.replace('../index.html');
        }
    }

    // Chama a verificação de autenticação
    checkAuth();

    // Previne o uso do botão voltar após o logout
    window.history.pushState(null, '', window.location.href);
    window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
    };


    const navMenu = document.getElementById('nav-menu');
    const mainContent = document.getElementById('main-content');
    const profileButton = document.getElementById('profile-button');
    const profileMenu = document.getElementById('profile-menu');
    const logoutButton = document.getElementById('logout-button');
    const loginButton = document.getElementById('login-button');
    const notificationButton = document.getElementById('notification-button');
    const notificationMenu = document.getElementById('notification-menu');
    const clearNotificationsButton = document.getElementById('clear-notifications');
    const notificationCount = document.getElementById('notification-count');
    const notificationsList = document.getElementById('notifications-list');
    const soundButton = document.getElementById('soundButton');

    function truncateName() {
        const userNameElement = document.getElementById('user-name');
        const fullName = userNameElement.innerText.trim(); // Obtém o nome completo sem espaços extras

        // Verifica se há mais de um espaço
        const secondSpaceIndex = fullName.indexOf(' ', fullName.indexOf(' ') + 1);

        if (secondSpaceIndex !== -1) {
            // Substitui o texto após o segundo espaço por reticências
            const truncatedName = fullName.substring(0, secondSpaceIndex) + '...';
            userNameElement.innerText = truncatedName; // Atualiza o conteúdo do div
        }
    }

    // Chama a função para truncar o nome assim que a página for carregada
    window.onload = truncateName;

    function checkAuthToken(callback) {
        const token = localStorage.getItem('authToken');

        // Verifica se o token está presente
        if (!token) {
            redirectToLogin('Usuário não autenticado. Redirecionando para o login.');
        } else {
            try {
                const payload = JSON.parse(atob(token.split('.')[1])); // Decodifica o payload do JWT
                const expirationTime = payload.exp * 1000; // Converte para milissegundos

                // Verifica se o token está expirado
                if (Date.now() >= expirationTime) {
                    redirectToLogin('Token expirado. Redirecionando para o login.');
                } else {
                    // Se o token é válido, chama o callback para continuar o fluxo
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                }
            } catch (error) {
                console.error('Erro ao decodificar o token:', error);
                redirectToLogin('Token inválido. Redirecionando para o login.');
            }
        }
    }

    // Função para redirecionar para a página de login
    function redirectToLogin(message) {
        showModal(message);

        // Limpa o localStorage e sessionStorage
        localStorage.removeItem('userName');
        localStorage.removeItem('userMatricula');
        localStorage.removeItem('userType');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('isLoggedIn');

        // Redireciona para a página de login após um pequeno delay
        setTimeout(() => {
            window.location.replace('../index.html');
        }, 2000); // 2 segundos de delay
    }

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

    let activeSection = 'RESERVAR';

    function showAnimatedConfirmation2(action, _requestId) {
        // Criar elementos do modal
        const modal = document.createElement('div');
        modal.id = 'animated-confirmation';
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center';
        modal.style.zIndex = '10000000000';

        const modalContent = document.createElement('div');
        modalContent.className = 'bg-white p-8 bordas-redondas shadow-2xl transform transition-all duration-500 scale-0';
        modalContent.style.width = '300px';
        modalContent.style.height = '300px';

        const successIcon = document.createElement('div');
        successIcon.innerHTML = getIconSVG(action, getCircleColor(action)); // Passa a cor para o SVG

        const message = document.createElement('h2');
        message.innerHTML = getMessageText(action);
        message.className = 'text-2xl font-bold text-center mt-4 mb-2';

        const subMessage = document.createElement('p');
        subMessage.textContent = getSubMessageText(action);
        subMessage.className = 'text-center text-gray-600';

        const closeButton = document.createElement('button');
        closeButton.textContent = 'OK';
        closeButton.className = `mt-6 px-4 py-2 bg-${getButtonColor(action)}-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-${getButtonColor(action)}-700 focus:outline-none focus:ring-2 focus:ring-${getButtonColor(action)}-300 transition-colors duration-300`;
        closeButton.onclick = () => {
            modalContent.classList.add('scale-0');
            setTimeout(() => {
                modal.remove();
                if (action === 'aprovar' || action === 'rejeitar' || action === 'cancelar') {
                    fetchAndRenderPedidos();
                } else if (action === 'cancelar_solicitacao') {
                    fetchAndRenderRequests();
                } else if (action === 'reservar') {
                    // Hide the reservation form
                    const reservationForm = document.getElementById('reservationForm');
                    if (reservationForm) {
                        reservationForm.classList.add('hidden');
                    }
                    // Scroll to the top of the page
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 500);
        };

        // Listener para pressionar "Enter" ou "Espaço" no botão
        closeButton.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();  // Impede o comportamento padrão do botão
                closeButton.onclick();
            }
        };

        // Listener para pressionar "Enter" ou "Espaço" em qualquer lugar no modal
        modal.onkeydown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                closeButton.onclick();
            }
        };

        if (isSoundActive) {
            readText(subMessage);
        }

        // Montar o modal
        modalContent.appendChild(successIcon);
        modalContent.appendChild(message);
        modalContent.appendChild(subMessage);
        modalContent.appendChild(closeButton);
        modal.appendChild(modalContent);

        // Adicionar o modal ao documento
        document.body.appendChild(modal);

        // Trigger animation
        setTimeout(() => {
            modalContent.classList.remove('scale-0');
            modalContent.classList.add('scale-100');
        }, 10);

        // Focar no botão OK para que esteja pronto para o Enter ou Espaço
        closeButton.focus();
    }

    // As funções abaixo permanecem as mesmas
    function getIconSVG(action, color) {
        switch (action) {
            case 'cancelar':
            case 'cancelar_solicitacao':
                return `
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="${color}"/>
                        <path class="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36"/>
                    </svg>
                `;
            case 'aprovar':
            case 'reservar':
                return `
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="${color}"/>
                        <path class="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                `;
            case 'rejeitar':
                return `
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="${color}"/>
                        <path class="checkmark__check" fill="none" d="M16 16 36 36 M36 16 16 36"/>
                    </svg>
                `;
        }
    }

    function getMessageText(action) {
        switch (action) {
            case 'cancelar':
                return 'Reserva Cancelada!';
            case 'aprovar':
                return 'Reserva <br> Aprovada!';
            case 'rejeitar':
                return 'Reserva Rejeitada!';
            case 'cancelar_solicitacao':
                return 'Solicitação Cancelada!';
            case 'reservar':
                return 'Reserva Solicitada!';
        }
    }

    function getSubMessageText(action) {
        switch (action) {
            case 'cancelar':
                return 'A reserva foi cancelada com sucesso.';
            case 'aprovar':
                return 'A reserva foi aprovada com sucesso.';
            case 'rejeitar':
                return 'A reserva foi rejeitada com sucesso.';
            case 'cancelar_solicitacao':
                return 'A solicitação foi cancelada com sucesso.';
            case 'reservar':
                return 'A reserva foi solicitada com sucesso.';
        }
    }

    function getButtonColor(action) {
        switch (action) {
            case 'cancelar':
            case 'cancelar_solicitacao':
            case 'rejeitar':
                return 'red';
            case 'aprovar':
            case 'reservar':
                return 'green';
        }
    }

    function getCircleColor(action) {
        switch (action) {
            case 'cancelar':
            case 'cancelar_solicitacao':
                return 'red';
            case 'aprovar':
            case 'reservar':
                return 'green';
            case 'rejeitar':
                return 'red';
        }
    }

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
        modalContent.className = 'bg-white p-5 border w-96 bordas-redondas rounded-md';

        const modalBody = document.createElement('div');
        modalBody.className = 'mt-3 text-center';

        const modalIcon = document.createElement('div');
        modalIcon.className = 'mx-auto flex items-center justify-center h-12 w-12 rounded-full';

        const modalText = document.createElement('h3');
        modalText.className = 'text-lg leading-6 font-medium text-gray-900 mt-5';
        modalText.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.className = 'mt-5 px-4 py-2 bg-blue-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300';
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

    async function fetchNotifications() {
        const userMatricula = localStorage.getItem('userMatricula');
        if (!userMatricula) return [];

        try {
            const response = await fetch(`https://api-reserva-lab.vercel.app/notifications/${userMatricula}`);
            if (!response.ok) throw new Error('Failed to fetch notifications');
            return await response.json();
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return [];
        }
    }

    async function updateNotifications() {
        const notifications = await fetchNotifications();
        renderNotifications(notifications);
    }

    function formatDate2(dateString) {
        // Verifica se dateString é válido
        if (!dateString) {
            return "Data inválida";
        }

        // Cria um objeto Date a partir da string, assumindo que está em UTC
        const createdAt = new Date(dateString);

        // Ajusta para UTC-3 (Brasília)
        const localTime = new Date(createdAt.getTime() + (3 * 60 * 60 * 1000));

        // Formata a data no formato desejado
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, // Para 24 horas
        };

        // Converte a data para o formato desejado
        const formattedDate = localTime.toLocaleString('pt-BR', options);

        return formattedDate.replace(',', ''); // Remove a vírgula entre a data e a hora
    }

    function renderNotifications(notifications) {
        if (notifications.length > 0) {
            notificationsList.innerHTML = notifications.map(notification => `
                <div class="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                    <p class="text-sm font-medium">${notification.message}</p>
                    <p class="text-xs text-gray-500">${formatDate2(notification.created_at)}</p>
                </div>
            `).join('');
            notificationCount.textContent = notifications.length;
            notificationCount.classList.remove('hidden');
        } else {
            notificationsList.innerHTML = '<p>Nenhuma nova notificação.</p>';
            notificationCount.classList.add('hidden');
        }
    }

    async function clearNotifications() {
        const userMatricula = localStorage.getItem('userMatricula');
        if (!userMatricula) return;

        try {
            const response = await fetch(`https://api-reserva-lab.vercel.app/notifications/clear/${userMatricula}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to clear notifications');
            updateNotifications();
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    }

    function resetFilters() {
        // Limpar o status filter
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            currentPedidosFilterStatus = 'todos';
            currentFilterStatus = 'todos'; // ou o valor padrão que você deseja
        }

        // Limpar o labName filter
        const labNameFilter = document.getElementById('labNameFilter');
        if (labNameFilter) {
            labNameFilter.value = 'todos'; // ou o valor padrão que você deseja
            currentLabFilter = 'todos';
        }

        // Limpar o date filter
        const dateFilter = document.getElementById('dateFilter');
        if (dateFilter) {
            dateFilter.value = ''; // limpa a data
            currentDateFilter = '';
        }
    }

    // Função para mostrar/ocultar os filtros
    function toggleFilterDropdown() {
        const filterModal = document.getElementById('filterModal');
        filterModal.classList.toggle('hidden');
    }

    function closeFilterDropdown() {
        const filterContent = document.getElementById('filterModal');
        filterContent.classList.add('hidden');
    }

    function renderContent() {
        checkAuth();
        const userType = localStorage.getItem('userType');
        let content = '';

        resetFilters();

        // Mostrar ou esconder o botão "PEDIDOS" com base no tipo de usuário
        const pedidosButton = document.getElementById('btn-pedidos');
        if (pedidosButton) {
            pedidosButton.style.display = userType === 'Administrador' ? 'inline-block' : 'none';
        }

        // Ajustar o layout dos botões
        navMenu.classList.toggle('space-x-10', pedidosButton.style.display === 'none');
        navMenu.classList.toggle('space-x-4', pedidosButton.style.display !== 'none');
        navMenu.classList.toggle('md:space-x-8', pedidosButton.style.display !== 'none');

        switch (activeSection) {
            case 'RESERVAR':
                content = `
                    <h1 class="texto-mancha text-2xl font-bold mb-6" tabindex="6">Salas e Laboratórios de Informática </h1>
                    <div class="mb-4">
                    <input type="text" id="roomSearchInput" placeholder="Pesquisar sala por nome..." class="w-full px-3 p-2 bordas-redondas">
                    </div>
                    <div id="labsContainer" class="grid md:grid-cols-2 gap-8"></div>
        
                    <div id="reservationForm" class="hidden mt-8">
                        <h2 class="texto-mancha text-xl text-white font-bold mb-4">Reservar <span id="labName"></span></h2>
                        <div id="unavailableTimesTable" class="mt-4 mb-4"></div>
                        <form id="labReservationForm" class="bg-white shadow-md bordas-redondas px-8 pt-6 pb-8 mb-4">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="date" tabindex="8">
                                    Data
                                </label>
                                <input class="shadow appearance-none border bordas-redondas w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="date" required tabindex="9">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="time" tabindex="10">
                                    Horário de Início
                                </label>
                                <input class="shadow appearance-none border bordas-redondas w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time" type="time" required tabindex="11">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="time_fim" tabindex="12">
                                    Horário de Término
                                </label>
                                <input class="shadow appearance-none border bordas-redondas w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time_fim" type="time" required tabindex="13">
                            </div>
                            <div class="mb-4 flex items-center" tabindex="14">
                                <input type="checkbox" id="software_especifico" class="mr-2">
                                <label class="text-gray-700 text-sm font-bold" for="software_especifico">
                                    Necessário software específico?
                                </label>
                            </div>
                            <div id="software_nome_container" class="mb-4 hidden" >
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="software_nome" tabindex="15">
                                    Nome do software
                                </label>
                                <input class="shadow appearance-none border bordas-redondas w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="software_nome" type="text" placeholder="Ex: Photoshop" tabindex="16">
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="purpose" tabindex="17">
                                    Finalidade
                                </label>
                                <input class="shadow appearance-none border bordas-redondas w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="purpose" type="text" placeholder="Ex: Aula de Programação" required tabindex="18">
                            </div>
                            <div class="flex items-center justify-between">
                                <button id="reserveButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 bordas-redondas focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out" type="submit" tabindex="19">
                                    Reservar
                                </button>
                            </div>
                        </form>
                    </div>
                `;
                break;
            case 'SOLICITAÇÕES':
                content = `
                    <h1 class="texto-mancha text-2xl font-bold mb-6" tabindex="6">Solicitações de Reserva</h1>
                    <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <button id="filterDropdownBtn" class="text-white bg-blue-500 p-2 bordas-redondas focus:outline-none w-full sm:w-auto">
                            Filtros ☰
                        </button>
                            <div id="filterModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full hidden">
                                <div class="relative top-20 mx-auto p-5 border shadow-lg bordas-redondas bg-white w-full max-w-md">
                                    <h2 class="text-lg leading-6 font-bold text-gray-900 mb-4">Filtros</h2>

                                    <div class="filter-group mb-4">
                                        <label for="statusFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrar status</label>
                                        <select id="statusFilter" class="p-2 border bordas-redondas w-full">
                                            <option value="todos">Todos</option>
                                            <option value="utilizando">Utilizando</option>
                                            <option value="pendente">Pendente</option>
                                            <option value="aprovado">Aprovado</option>
                                            <option value="concluído">Concluído</option>
                                            <option value="rejeitado">Rejeitado</option>
                                            <option value="cancelado">Cancelado</option>
                                        </select>
                                    </div>
                                    
                                    <div class="filter-group mb-4">
                                        <label for="labNameFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrar Laboratório</label>
                                        <select id="labNameFilter" class="p-2 border bordas-redondas w-full"></select>
                                    </div>

                                    <div class="filter-group mb-4">
                                        <label for="dateFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrar por Data</label>
                                        <input type="date" id="dateFilter" class="p-2 border bordas-redondas w-full">
                                    </div>

                                    <div class="flex justify-between">
                                        <button id="okButton" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 bordas-redondas">
                                            OK
                                        </button>
                                    </div>
                                </div>
                            </div>

                        <div class="w-full sm:w-auto text-center">
                            <button id="sortByIdButton" class="text-white bg-blue-500 p-2 bordas-redondas focus:outline-none w-full sm:w-auto" tabindex="7">
                                Ordenar solicitação ▲
                            </button>
                        </div>
                    </div>

                    <div id="requestsList" class="bg-blue-500 bordas-redondas shadow p-6">
                        <p class="text-center text-white">Carregando solicitações...</p>
                    </div>

                    <div id="cancelConfirmationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white">
                            <div class="mt-3 text-center">
                                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </div>
                                <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5" tabindex="9">Confirmar Cancelamento</h3>
                                <div class="mt-2 px-7 py-3">
                                    <p class="text-sm text-gray-500" tabindex="10">
                                        Tem certeza que deseja cancelar esta reserva?
                                    </p>
                                </div>
                                <div class="items-center px-4 py-3">
                                    <button id="confirmCancel" class="px-4 py-2 bg-red-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2" tabindex="11">
                                        Confirmar Cancelamento
                                    </button>
                                    <button id="cancelCancelation" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300" tabindex="12">
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'ADMINISTRAÇÃO':
                if (userType === 'Administrador') {
                    content = `
                            <h1 class="texto-mancha text-2xl font-bold mb-6">Área do Administrador</h1>
                            <div id="buttonsSection" class="bg-dynamicContent bordas-redondas shadow p-6 flex flex-col mt-16 mb-4">
                                <button id="PEDIDOS" class="sombra text-xl font-bold bg-blue-500 text-white text-base bordas-redondas w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4 p-4 h-15">Pedidos de Reserva</button>
                                <button id="SALAS" class="sombra text-xl font-bold bg-blue-500 text-white text-base bordas-redondas w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4 p-4 h-15">Gerenciar Salas</button>
                                <button id="USUARIOS" class="sombra text-xl font-bold bg-blue-500 text-white text-base bordas-redondas w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 p-4 h-15">Gerenciar Usuarios</button>
                            </div>
                            <div id="dynamicContent" class="bg-dynamicContent bordas-redondas shadow p-6 hidden">
                            </div>

                            <div id="createRoomModal" class="bg-gray-600 bg-opacity-50 fixed inset-0 overflow-y-auto h-full w-full hidden">
                                <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white space-y-4">
                                    <h3 class="text-2xl font-bold leading-6 text-gray-900 mb-2">Criar Nova Sala</h3>
                                    <form id="createRoomForm">
                                        <div class="mb-4">
                                            <label for="roomName" class="block text-sm font-medium text-gray-700">Nome da Sala:</label>
                                            <input type="text" id="roomName" name="roomName" required class="px-4 border-2 mt-1 block w-full bordas-redondas border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        </div>
                                        <div class="mb-4">
                                            <label for="roomCapacity" class="block text-sm font-medium text-gray-700">Capacidade:</label>
                                            <input type="number" id="roomCapacity" name="roomCapacity" required class="px-4 border-2 mt-1 block w-full bordas-redondas border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                                        </div>
                                        <div class="mb-4">
                                            <label for="roomDescription" class="block text-sm font-medium text-gray-700">Descrição:</label>
                                            <textarea id="roomDescription" name="roomDescription" rows="3" required class="px-4 border-2 mt-1 block w-full bordas-redondas border-black shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
                                        </div>
                                        <div class="mb-4">
                                            <label for="roomImage" class="block text-sm font-medium text-gray-700">Imagem da Sala:</label>
                                            <input type="file" id="roomImage" name="roomImage" accept=".jpg, .jpeg, .png" required class="border-2 border-black block bordas-redondas w-full mb-4">
                                        </div>
                                        <div class="flex flex-col space-y-4">
                                            <button type="submit" id="submitButton" class="px-4 py-2 bg-blue-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">Criar</button>
                                            <button type="button" id="cancelCreateRoom" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancelar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div id="editRoomModal" class="bg-gray-600 bg-opacity-50 hidden fixed inset-0 flex items-center justify-center">
                                <div class="relative mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white space-y-4">
                                    <h2 class="text-2xl font-bold mb-4">Editar Sala</h2>
                                    <form id="editRoomForm">
                                        <label for="editRoomName">Nome:</label>
                                        <input type="text" id="editRoomName" class="px-4 border-2 border-black block bordas-redondas w-full mb-4" required>
                                        <label for="editRoomCapacity">Capacidade:</label>
                                        <input type="number" id="editRoomCapacity" class="px-4 border-2 border-black block bordas-redondas w-full mb-4" required>
                                        <label for="editRoomDescription">Descrição:</label>
                                        <textarea id="editRoomDescription" class="px-4 border-2 border-black block bordas-redondas w-full mb-4" required></textarea>
                                        <label for="editRoomImage">Nova Imagem:</label>
                                        <input type="file" id="editRoomImage" class="border-2 border-black block bordas-redondas w-full mb-4" accept=".jpg, .jpeg, .png">
                                        <div class="flex flex-col space-y-4">
                                            <button type="submit" id="confirmEditRoom" class="px-4 py-2 bg-blue-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300">Salvar</button>
                                            <button type="button" id="cancelEditRoom" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancelar</button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                            <div id="deleteRoomModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                                <div class="relative top-80 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white">
                                    <div class="mt-3 text-center">
                                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </div>
                                        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5">Confirmar Exclusão</h3>
                                        <div class="mt-2 px-7 py-3">
                                            <p class="text-sm text-gray-500">
                                                Você tem certeza que deseja apagar esta sala?
                                            </p>
                                        </div>
                                        <div class="items-center px-4 py-3">
                                            <button id="confirmDeleteRoom" class="px-4 py-2 bg-red-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2">
                                                Confirmar Exclusão
                                            </button>
                                            <button id="cancelDeleteRoom" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                                Voltar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="deleteUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                                <div class="relative top-80 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white">
                                    <div class="mt-3 text-center">
                                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                            </svg>
                                        </div>
                                        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5">Excluir Usuario</h3>
                                        <div class="mt-2 px-7 py-3">
                                            <p class="text-sm text-gray-500"></p>
                                        </div>
                                        <div class="items-center px-4 py-3">
                                            <button id="confirmDeleteUser" class="px-4 py-2 bg-red-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2">
                                                Excluir Usuário
                                            </button>
                                            <button id="cancelDeleteUser" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                                Voltar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="aproveUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                                <div class="relative top-80 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white">
                                    <div class="mt-3 text-center">
                                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                            </svg>
                                        </div>
                                        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5">Aprovar Usuário</h3>
                                        <div class="mt-2 px-7 py-3">
                                            <p class="text-sm text-gray-500"></p>
                                        </div>
                                        <div class="items-center px-4 py-3">
                                            <button id="aproveConfirmAction" class="px-4 py-2 bg-green-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 mb-2">
                                                Aprovar Usuário
                                            </button>
                                            <button id="cancelAproveUser" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                                Voltar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="promoveUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                                <div class="relative top-80 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white">
                                    <div class="mt-3 text-center">
                                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                                            <img src="https://reserva-lab-nassau.s3.amazonaws.com/assets/coroa.png" class="w-6 h-6">
                                        </div>
                                        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5">Promover Usuário</h3>
                                        <div class="mt-2 px-7 py-3">
                                            <p class="text-sm text-gray-500"></p>
                                        </div>
                                        <div class="items-center px-4 py-3">
                                            <button id="promoveConfirmAction" class="px-4 py-2 bg-yellow-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-300 mb-2">
                                                Promover a Administrador
                                            </button>
                                            <button id="cancelPromoveUser" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                                Voltar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div id="rebaixarUserModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                                <div class="relative top-80 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white">
                                    <div class="mt-3 text-center">
                                        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gray-100">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-5 w-5">
                                                <path d="M4 8l8 8 8-8H14V4h-4v4H4z"/>
                                            </svg>
                                        </div>
                                        <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5">Rebaixar Usuário</h3>
                                        <div class="mt-2 px-7 py-3">
                                            <p class="text-sm text-gray-500"></p>
                                        </div>
                                        <div class="flex items-center space-x-2">
                                        <input type="checkbox" id="professor">
                                        <label class="text-gray-700 text-sm font-bold" for="professor">Professor</label>
                                        <input type="checkbox" id="coordenador">
                                        <label class="text-gray-700 text-sm font-bold" for="coordenador">Coordenador</label>
                                        <input type="checkbox" id="funcionario">
                                        <label class="text-gray-700 text-sm font-bold" for="funcionario">Funcionário</label>
                                        </div>
                                        <div class="items-center px-4 py-3">
                                            <button id="rebaixarConfirmAction" class="px-4 py-2 bg-blue-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2">
                                                Rebaixar Usuário
                                            </button>
                                            <button id="cancelRebaixarUser" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                                Voltar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;

                    // Adicionando evento para os botões
                    setTimeout(() => {
                        const buttonsSection = document.getElementById('buttonsSection');
                        const dynamicContent = document.getElementById('dynamicContent');

                        function showContent(contentHtml) {
                            buttonsSection.classList.add('hidden');
                            dynamicContent.innerHTML = `
                    <button id="backButton" class="bg-blue-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4 p-4  h-15">Voltar</button>
                    ${contentHtml}
                `;
                            dynamicContent.classList.remove('hidden');

                            document.getElementById('backButton').addEventListener('click', () => {
                                dynamicContent.classList.add('hidden');
                                buttonsSection.classList.remove('hidden');
                            });
                        }

                        document.getElementById('PEDIDOS').addEventListener('click', () => {
                            resetFilters();
                            showContent(`
                                    <h1 class="sombra text-2xl text-white font-bold mb-6">Pedidos de Reserva</h1>
                                    <div class="flex flex-wrap justify-between items-center gap-4 mb-4">
                                        <button id="filterDropdownBtn" class="text-white bg-blue-500 p-2 bordas-redondas focus:outline-none w-full sm:w-auto">
                                            Filtros ☰
                                        </button>

                                            <div id="filterModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full hidden">
                                                <div class="relative top-20 mx-auto p-5 border shadow-lg bordas-redondas bg-white w-full max-w-md">
                                                    <h2 class="text-lg leading-6 font-medium text-gray-900 mb-4">Filtros</h2>

                                                    <div class="filter-group mb-4">
                                                        <label for="statusFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrar status</label>
                                                        <select id="statusFilter" class="p-2 border bordas-redondas w-full">
                                                            <option value="todos">Todos</option>
                                                            <option value="utilizando">Utilizando</option>
                                                            <option value="pendente">Pendente</option>
                                                            <option value="aprovado">Aprovado</option>
                                                            <option value="concluído">Concluído</option>
                                                            <option value="rejeitado">Rejeitado</option>
                                                            <option value="cancelado">Cancelado</option>
                                                        </select>
                                                    </div>

                                                    <div class="filter-group mb-4">
                                                        <label for="labNameFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrar Laboratório</label>
                                                        <select id="labNameFilter" class="p-2 border bordas-redondas w-full"></select>
                                                    </div>

                                                    <div class="filter-group mb-4">
                                                        <label for="dateFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrar por Data</label>
                                                        <input type="date" id="dateFilter" class="p-2 border bordas-redondas w-full">
                                                    </div>

                                                    <div class="flex justify-between">
                                                        <button id="okButton" class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 bordas-redondas">
                                                            OK
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                        <div class="w-full sm:w-auto text-center">
                                            <button id="sortByIdButton" class="text-white bg-blue-500 p-2 bordas-redondas focus:outline-none w-full sm:w-auto">
                                                Ordenar solicitação ▲
                                            </button>
                                        </div>
                                    </div>

                                    <div id="requestsList" class="bg-blue-500 bordas-redondas shadow p-6">
                                        <p class="text-center text-white">Carregando pedidos...</p>
                                    </div>
                                    
                                    <div id="cancelConfirmationModal_Administrador" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                                        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white">
                                            <div class="mt-3 text-center">
                                                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                                    <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                                                    </svg>
                                                </div>
                                                <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5">Confirmar Cancelamento</h3>
                                                <div class="mt-2 px-7 py-3">
                                                    <p class="text-sm text-gray-500">
                                                        Tem certeza que deseja cancelar esta reserva?
                                                    </p>
                                                </div>
                                                <div class="items-center px-4 py-3">
                                                    <button id="confirmCancel_Administrador" class="px-4 py-2 bg-red-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2">
                                                        Confirmar Cancelamento
                                                    </button>
                                                    <button id="cancelCancelation_Administrador" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                                        Voltar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div id="confirmationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                                        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg bordas-redondas bg-white">
                                            <div class="mt-3 text-center">
                                                <div id="modalIcon" class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                                    <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                                    </svg>
                                                </div>
                                                <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5" id="modalTitle"></h3>
                                                <div class="mt-2 px-7 py-3">
                                                    <p class="text-sm text-gray-500" id="modalMessage"></p>
                                                </div>
                                                <div class="items-center px-4 py-3">
                                                    <button id="confirmAction" class="px-4 py-2 bg-green-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-green-600 focus:outline-none mb-2">
                                                        Confirmar
                                                    </button>
                                                    <button id="cancelAction" class="px-4 py-2 bg-gray-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-gray-600 focus:outline-none">
                                                        Cancelar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `);

                            fetchAndRenderPedidos();
                            populateLabNameFilter();

                            document.getElementById('filterDropdownBtn').addEventListener('click', toggleFilterDropdown);
                            document.getElementById('okButton').addEventListener('click', closeFilterDropdown);
                        });

                        document.getElementById('SALAS').addEventListener('click', () => {
                            resetFilters();
                            showContent(`
                                    <button id="CriarLab" class="SALAS bg-blue-500 text-white text-base font-medium bordas-redondas w-full shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 mb-4 p-4  h-15">Criar Sala</button>
                                    <h1 class="sombra text-2xl text-white font-bold mb-6">Editar Salas</h1>
                                    <div class="mb-4">
                                    <input type="text" id="roomSearchInput2" placeholder="Pesquisar sala por nome..." class="w-full px-3 p-2 border bordas-redondas">
                                    </div>
                                    <div id="labsContainer2" class="grid md:grid-cols-2 gap-8"></div>
                                `);

                            loadLabs2();

                            // Add event listener for the "Criar Sala" button
                            document.getElementById('CriarLab').addEventListener('click', function () {
                                document.getElementById('createRoomModal').classList.remove('hidden');
                            });

                            // Add event listener for the "Cancelar" button in the modal
                            document.getElementById('cancelCreateRoom').addEventListener('click', function () {
                                // Limpa os campos do formulário
                                document.getElementById('createRoomForm').reset();

                                // Esconde o modal
                                document.getElementById('createRoomModal').classList.add('hidden');
                            });

                            document.getElementById('createRoomForm').addEventListener('submit', async function (e) {
                                e.preventDefault();

                                const submitButton = document.getElementById('submitButton');

                                // Desativar o botão para prevenir múltiplos envios
                                if (submitButton.disabled) return;  // Evitar múltiplos envios
                                submitButton.disabled = true;

                                const formData = new FormData(this);
                                const token = localStorage.getItem('authToken');  // Obtém o token JWT

                                try {
                                    const response = await fetch('https://api-reserva-lab.vercel.app/laboratorios/criar', {
                                        method: 'POST',
                                        body: formData,
                                        headers: {
                                            'Authorization': `Bearer ${token}` // Adiciona o token JWT no cabeçalho
                                        }
                                    });

                                    if (response.ok) {
                                        showModal('Sala criada com sucesso!');
                                        document.getElementById('createRoomModal').classList.add('hidden');
                                        // Recarregar a lista de salas
                                        loadLabs2();
                                        document.getElementById('createRoomForm').reset();
                                    } else {
                                        const errorData = await response.json(); // Pega os dados do erro
                                        showModal(errorData.message || 'Erro ao criar sala. Por favor, tente novamente.');
                                    }
                                } catch (error) {
                                    console.error('Erro:', error);
                                    showModal('Erro ao criar sala. Por favor, tente novamente.');
                                } finally {
                                    // Reabilitar o botão ao final da operação
                                    submitButton.disabled = false;
                                }
                            });
                        });

                        document.getElementById('USUARIOS').addEventListener('click', () => {
                            resetFilters();
                            showContent(`
                                    <h1 class="sombra text-2xl text-white font-bold mb-6">Gerenciar Usuarios</h1>
                                    <div class="mb-4">
                                        <input type="text" id="userSearchInput" placeholder="Buscar usuário por nome ou matrícula..." class="w-full px-3 p-2 border bordas-redondas">
                                    </div>
                                    <div id="userList" class="bg-blue-500 shadow-md bordas-redondas p-6">
                                        <h2 class="text-2xl text-white font-bold mb-4">Lista de Usuários</h2>
                                        <div id="userListContent">
                                        </div>
                                    </div>
                                `);

                            fetchUsuarios();

                            const searchInput = document.getElementById('userSearchInput');
                            searchInput.addEventListener('input', () => {
                                const query = searchInput.value.toLowerCase();
                                filterUsuarios(query);
                            });
                        });
                    }, 0); // Garantindo que o conteúdo seja atualizado no DOM
                }
                break;
        }

        mainContent.innerHTML = content;

        // Chamadas de funções dependendo da seção ativa
        if (activeSection === 'RESERVAR') {
            setupReservationForm();
            loadLabs();
        } else if (activeSection === 'SOLICITAÇÕES') {
            fetchAndRenderRequests();
            populateLabNameFilter();
            document.getElementById('filterDropdownBtn').addEventListener('click', toggleFilterDropdown);
            document.getElementById('okButton').addEventListener('click', closeFilterDropdown);
        } else if (activeSection === 'PEDIDOS' && userType === 'Administrador') {
        }
    }

    function handleNavClick(event) {
        const clickedButton = event.target.closest('button');
        if (clickedButton) {
            const section = clickedButton.textContent.trim();
            if (section) {
                activeSection = section;
                renderContent();
                navMenu.querySelectorAll('button').forEach(button => {
                    button.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600', 'pb-2', 'px-2', 'bg-blue-100');
                    button.classList.add('text-gray-500', 'hover:text-blue-600');
                });
                clickedButton.classList.remove('text-gray-500', 'hover:text-blue-600');
                clickedButton.classList.add('text-blue-600', 'border-b-2', 'border-blue-600', 'pb-2', 'px-2', 'bg-blue-100');
            }
        }
    }

    // Inicializa o conteúdo da seção ativa
    renderContent();

    navMenu.addEventListener('click', handleNavClick);

    notificationButton.addEventListener('click', (event) => {
        event.stopPropagation();
        profileMenu.classList.add('hidden'); // Fecha o menu de perfil, se estiver aberto
        notificationMenu.classList.toggle('hidden');
    });

    // Mostrar/Esconder o menu de perfil ao clicar no botão
    profileButton.addEventListener('click', (event) => {
        event.stopPropagation();
        notificationMenu.classList.add('hidden'); // Fecha o menu de notificações, se estiver aberto
        profileMenu.classList.toggle('hidden');
    });

    clearNotificationsButton.addEventListener('click', clearNotifications);

    updateNotifications();

    document.addEventListener('click', (event) => {
        if (!notificationButton.contains(event.target) && !notificationMenu.contains(event.target)) {
            notificationMenu.classList.add('hidden');
        }
        if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.classList.add('hidden');
        }
    });

    // Fechar o menu de notificações se clicar fora dele
    document.addEventListener('click', (event) => {
        if (!notificationButton.contains(event.target) && !notificationMenu.contains(event.target)) {
            notificationMenu.classList.add('hidden');
        }
    });

    // Fechar o menu de perfil se clicar fora dele
    document.addEventListener('click', (event) => {
        if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.classList.add('hidden');
        }
    });

    // Atualiza o perfil do usuário
    function updateUserProfile() {
        const userName = localStorage.getItem('userName');
        const userMatricula = localStorage.getItem('userMatricula');
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

        if (userName && userMatricula && isLoggedIn) {
            document.getElementById('user-name').textContent = userName;
            document.getElementById('user-matricula').textContent = `Matrícula: ${userMatricula}`;
            loginButton.classList.add('hidden');
            logoutButton.classList.remove('hidden');
        } else {
            document.getElementById('user-name').textContent = '';
            document.getElementById('user-matricula').textContent = '';
            loginButton.classList.remove('hidden');
            logoutButton.classList.add('hidden');
        }
    }

    updateUserProfile();

    // Função de logout
    logoutButton.addEventListener('click', function () {
        // Remove todos os dados do usuário, incluindo o token JWT
        localStorage.removeItem('userName');
        localStorage.removeItem('userMatricula');
        localStorage.removeItem('userType');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('isLoggedIn');

        // Redireciona para a página de login
        window.location.replace('../index.html');
    });

    loginButton.addEventListener('click', function () {
        window.location.href = '../index.html';
    });

    const fetchUsuarios = () => {
        // Verifica o token e faz a requisição apenas se o token for válido
        checkAuthToken(() => {
            const token = localStorage.getItem('authToken');

            // Faz a requisição com o token JWT no cabeçalho Authorization
            fetch('https://api-reserva-lab.vercel.app/usuarios', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Envia o token JWT no cabeçalho
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Erro ao buscar usuários');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        const userMatricula = localStorage.getItem('userMatricula');

                        // Ordena os usuários: primeiro o usuário da matrícula, depois 'null' e depois alfabética
                        const usuariosOrdenados = data.usuarios.sort((a, b) => {
                            // Verifica se o usuário 'a' ou 'b' é o de localStorage
                            if (a.matricula === userMatricula) return -1;
                            if (b.matricula === userMatricula) return 1;

                            // Ordena acesso antes dos demais
                            if (a.acesso === 0 && b.acesso !== 0) {
                                return -1; // a vem antes de b
                            } else if (a.acesso != 0 && b.acesso == 0) {
                                return 1; // b vem antes de a
                            }

                            // Caso ambos sejam do tipo acesso, ordena por nome
                            return a.nome.localeCompare(b.nome);
                        });

                        displayUsuarios(usuariosOrdenados);
                    } else {
                        console.error('Erro ao buscar usuários:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Erro na requisição:', error);
                });
        });
    };

    // Função para exibir os usuários
    const displayUsuarios = (usuarios) => {
        const userListContent = document.getElementById('userListContent');
        userListContent.innerHTML = ''; // Limpa o conteúdo anterior
        usuarios.forEach(user => {
            const userElement = document.createElement('div');
            userElement.className = 'bg-white shadow-md bordas-redondas p-4 mb-4';
            userElement.innerHTML = `
            <div>
                <p class="mb-1 text-sm font-bold text-gray-600 break-words">Nome: ${user.nome}</p>
                <p class="mb-1 text-sm font-bold text-gray-600 break-words">Matrícula: ${user.matricula}</p>
                <p class="mb-1 text-sm font-bold text-gray-600 break-words">Email: ${user.email}</p>
                <p class="mb-1 text-sm font-bold text-gray-600 break-words">Tipo de Usuário: ${user.tipo_usuario}</p>
                ${user.acesso === 0 ? `
                    <button class="aproveUserButton bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 bordas-redondas" data-id="${user.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7 10.293l-2.354-2.353a1 1 0 00-1.414 1.414l3.414 3.414a1 1 0 001.414 0l7-7a1 1 0 00-1.414-1.414L7 10.293z" clip-rule="evenodd" />
                        </svg>
                    </button>
                ` : ''}
                ${user.tipo_usuario !== 'Administrador' && user.acesso === 1 ? `
                    <button class="promoveUserButton bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 bordas-redondas" data-id="${user.id}">
                        <img src="https://reserva-lab-nassau.s3.amazonaws.com/assets/coroa.png" class="w-6 h-6">
                    </button>
                ` : ''}
                ${user.tipo_usuario === 'Administrador' && user.matricula !== localStorage.getItem('userMatricula') ? `
                    <button class="rebaixarUserButton bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 bordas-redondas" data-id="${user.id}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="h-6 w-6">
                            <path d="M4 8l8 8 8-8H14V4h-4v4H4z"/>
                        </svg>
                    </button>
                ` : ''}
                ${user.matricula !== localStorage.getItem('userMatricula') ? `
                <button class="deleteUserButton bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 bordas-redondas" data-id="${user.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                </button>
                ` : ''}
            </div>
            `;

            userListContent.appendChild(userElement);

            document.querySelectorAll('.aproveUserButton').forEach(button => {
                button.addEventListener('click', function () {
                    const userId = this.getAttribute('data-id');
                    const userName = this.closest('div').querySelector('p:nth-child(1)').innerHTML;
                    const userMatricula = this.closest('div').querySelector('p:nth-child(2)').innerHTML;
                    const aproveUserModal = document.getElementById('aproveUserModal');
                    const modalMessage = aproveUserModal.querySelector('p.text-sm.text-gray-500');

                    // Atualiza o texto com o nome do usuário
                    modalMessage.innerHTML = `Você tem certeza que deseja aprovar o usuário para uso do sistema? <br><br>${userName}<br>${userMatricula}`;

                    // Remove a classe 'hidden' para mostrar o modal
                    aproveUserModal.classList.remove('hidden');

                    // Evento de confirmação de aprovação
                    document.getElementById('aproveConfirmAction').onclick = async function () {
                        // Adiciona animação ao botão de confirmação e desabilita
                        const confirmButton = this;
                        confirmButton.classList.add('animate-pulse');
                        confirmButton.textContent = 'Processando...';
                        confirmButton.disabled = true; // Desabilita o botão

                        // Recupera o token JWT
                        const token = localStorage.getItem('authToken');

                        if (!token) {
                            showModal('Você não está autenticado. Faça login para continuar.');
                            return; // Impede que a exclusão continue sem token
                        }

                        try {
                            const response = await fetch(`https://api-reserva-lab.vercel.app/usuarios/aprovar/${userId}`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ acesso: 1 }),
                            });

                            if (response.ok) {
                                showModal('Usuário aprovado com sucesso!');
                                aproveUserModal.classList.add('hidden'); // Esconde o modal
                                fetchUsuarios(); // Atualiza a lista de usuários
                            } else {
                                const errorData = await response.json();
                                showModal(errorData.message || 'Erro ao aprovar o usuário. Tente novamente.');
                            }
                        } catch (error) {
                            console.error('Erro:', error);
                            showModal('Erro ao aprovar o usuário. Por favor, tente novamente.');
                        } finally {
                            // Remove a animação, retorna o botão ao estado original e habilita novamente
                            confirmButton.classList.remove('animate-pulse');
                            confirmButton.textContent = 'Confirmar'; // Restaura o texto original
                            confirmButton.disabled = false; // Habilita o botão novamente
                        }
                    };
                });
            });

            // Evento de cancelar a aprovação
            document.getElementById('cancelAproveUser').onclick = () => {
                aproveUserModal.classList.add('hidden'); // Esconde o modal se o usuário cancelar
            };

            // Evento para o botão de promover
            document.querySelectorAll('.promoveUserButton').forEach(button => {
                button.addEventListener('click', function () {
                    const userId = this.getAttribute('data-id');
                    const userName = this.closest('div').querySelector('p:nth-child(1)').innerHTML;
                    const userMatricula = this.closest('div').querySelector('p:nth-child(2)').innerHTML;
                    const promoveUserModal = document.getElementById('promoveUserModal');
                    const modalMessage = promoveUserModal.querySelector('p.text-sm.text-gray-500');

                    // Atualiza o texto com o nome do usuário
                    modalMessage.innerHTML = `Você tem certeza que deseja promover o usuário para Administrador? <br><br>${userName}<br>${userMatricula}`;

                    // Remove a classe 'hidden' para mostrar o modal
                    promoveUserModal.classList.remove('hidden');

                    // Evento de confirmação de promoção
                    document.getElementById('promoveConfirmAction').onclick = async function () {
                        // Adiciona animação ao botão de confirmação e desabilita
                        const confirmButton = this;
                        confirmButton.classList.add('animate-pulse');
                        confirmButton.textContent = 'Processando...';
                        confirmButton.disabled = true; // Desabilita o botão

                        // Recupera o token JWT
                        const token = localStorage.getItem('authToken');

                        if (!token) {
                            showModal('Você não está autenticado. Faça login para continuar.');
                            return; // Impede que a exclusão continue sem token
                        }

                        try {
                            const response = await fetch(`https://api-reserva-lab.vercel.app/usuarios/atualizar/${userId}`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ tipo_usuario: 'Administrador' }), // Atualiza tipo de usuário para 'Administrador'
                            });

                            if (response.ok) {
                                showModal('Usuário promovido com sucesso!');
                                promoveUserModal.classList.add('hidden'); // Esconde o modal
                                fetchUsuarios(); // Atualiza a lista de usuários
                            } else {
                                const errorData = await response.json();
                                showModal(errorData.message || 'Erro ao promover o usuário. Tente novamente.');
                            }
                        } catch (error) {
                            console.error('Erro:', error);
                            showModal('Erro ao promover o usuário. Por favor, tente novamente.');
                        } finally {
                            // Remove a animação, retorna o botão ao estado original e habilita novamente
                            confirmButton.classList.remove('animate-pulse');
                            confirmButton.textContent = 'Confirmar'; // Restaura o texto original
                            confirmButton.disabled = false; // Habilita o botão novamente
                        }
                    };
                });
            });

            // Evento de cancelar promover
            document.getElementById('cancelPromoveUser').onclick = () => {
                promoveUserModal.classList.add('hidden'); // Esconde o modal se o usuário cancelar
            };

            // Evento para o botão de rebaixar
            document.querySelectorAll('.rebaixarUserButton').forEach(button => {
                button.addEventListener('click', function () {
                    const userId = this.getAttribute('data-id');
                    const userName = this.closest('div').querySelector('p:nth-child(1)').innerHTML;
                    const userMatricula = this.closest('div').querySelector('p:nth-child(2)').innerHTML;
                    const rebaixarUserModal = document.getElementById('rebaixarUserModal');
                    const modalMessage = rebaixarUserModal.querySelector('p.text-sm.text-gray-500');

                    // Atualiza o texto com o nome do usuário
                    modalMessage.innerHTML = `Você tem certeza que deseja rebaixar o usuário? <br><br>${userName}<br>${userMatricula}`;

                    // Remove a classe 'hidden' para mostrar o modal
                    rebaixarUserModal.classList.remove('hidden');

                    // Evento de confirmação de rebaixamento
                    document.getElementById('rebaixarConfirmAction').onclick = async function () {
                        // Valida se pelo menos uma checkbox está marcada
                        const professorCheckbox = document.getElementById('professor');
                        const coordenadorCheckbox = document.getElementById('coordenador');
                        const funcionarioCheckbox = document.getElementById('funcionario');

                        const tipoUsuario = professorCheckbox.checked ? 'Professor' :
                            coordenadorCheckbox.checked ? 'Coordenador' :
                                funcionarioCheckbox.checked ? 'Funcionário' : null;

                        if (!tipoUsuario) {
                            showModal('Por favor, selecione um tipo de usuário para rebaixar.');
                            return; // Impede que a solicitação continue
                        }

                        // Adiciona animação ao botão de confirmação e desabilita
                        const confirmButton = this;
                        confirmButton.classList.add('animate-pulse');
                        confirmButton.textContent = 'Processando...';
                        confirmButton.disabled = true; // Desabilita o botão

                        // Recupera o token JWT
                        const token = localStorage.getItem('authToken');

                        if (!token) {
                            showModal('Você não está autenticado. Faça login para continuar.');
                            return; // Impede que a exclusão continue sem token
                        }

                        try {
                            const response = await fetch(`https://api-reserva-lab.vercel.app/usuarios/atualizar/${userId}`, {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({ tipo_usuario: tipoUsuario }), // Envia o tipo de usuário selecionado
                            });

                            if (response.ok) {
                                showModal('Usuário rebaixado com sucesso!');
                                rebaixarUserModal.classList.add('hidden'); // Esconde o modal
                                // Desmarcar as checkboxes após a ação
                                professorCheckbox.checked = false;
                                coordenadorCheckbox.checked = false;
                                funcionarioCheckbox.checked = false;
                                fetchUsuarios(); // Atualiza a lista de usuários
                            } else {
                                const errorData = await response.json();
                                showModal(errorData.message || 'Erro ao rebaixar o usuário. Tente novamente.');
                            }
                        } catch (error) {
                            console.error('Erro:', error);
                            showModal('Erro ao rebaixar o usuário. Por favor, tente novamente.');
                        } finally {
                            // Remove a animação, retorna o botão ao estado original e habilita novamente
                            confirmButton.classList.remove('animate-pulse');
                            confirmButton.textContent = 'Confirmar'; // Restaura o texto original
                            confirmButton.disabled = false; // Habilita o botão novamente
                        }
                    };
                });
            });

            // Função para garantir que apenas uma checkbox possa ser selecionada por vez
            const checkboxes = document.querySelectorAll('#rebaixarUserModal input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    if (this.checked) {
                        checkboxes.forEach(box => {
                            if (box !== this) {
                                box.checked = false; // Desmarcar outras checkboxes
                            }
                        });
                    }
                });
            });

            // Evento de cancelar rebaixar
            document.getElementById('cancelRebaixarUser').onclick = () => {
                const rebaixarUserModal = document.getElementById('rebaixarUserModal');
                rebaixarUserModal.classList.add('hidden'); // Esconde o modal se o usuário cancelar

                // Desmarcar as checkboxes após a ação
                const professorCheckbox = document.getElementById('professor');
                const coordenadorCheckbox = document.getElementById('coordenador');
                const funcionarioCheckbox = document.getElementById('funcionario');

                professorCheckbox.checked = false;
                coordenadorCheckbox.checked = false;
                funcionarioCheckbox.checked = false;
            };

            // Seleciona botão de exclusão
            document.querySelectorAll('.deleteUserButton').forEach(button => {
                button.addEventListener('click', function () {
                    // Obtém o ID do usuário a partir do botão de exclusão clicado
                    const userId = this.getAttribute('data-id');
                    const userName = this.closest('div').querySelector('p:nth-child(1)').innerHTML;
                    const userMatricula = this.closest('div').querySelector('p:nth-child(2)').innerHTML;

                    // Seleciona o modal e a mensagem no modal
                    const deleteUserModal = document.getElementById('deleteUserModal');
                    const modalMessage = deleteUserModal.querySelector('p.text-sm.text-gray-500');

                    // Atualiza o texto com o nome do usuário
                    modalMessage.innerHTML = `Você tem certeza que deseja apagar o usuário? <br><br>${userName}<br>${userMatricula}`;

                    // Remove a classe 'hidden' para mostrar o modal
                    deleteUserModal.classList.remove('hidden');

                    // Evento de confirmação de exclusão
                    document.getElementById('confirmDeleteUser').onclick = async function () {
                        // Adiciona animação ao botão de confirmação e desabilita
                        const confirmButton = this;
                        confirmButton.classList.add('animate-pulse');
                        confirmButton.textContent = 'Processando...';
                        confirmButton.disabled = true; // Desabilita o botão

                        // Recupera o token JWT
                        const token = localStorage.getItem('authToken');

                        if (!token) {
                            showModal('Você não está autenticado. Faça login para continuar.');
                            return; // Impede que a exclusão continue sem token
                        }

                        try {
                            // Faz a requisição DELETE para deletar o usuário com o token no cabeçalho
                            const response = await fetch(`https://api-reserva-lab.vercel.app/usuarios/deletar/${userId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Authorization': `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
                                    'Content-Type': 'application/json',
                                },
                            });

                            if (response.ok) {
                                // Usuário excluído com sucesso
                                showModal('Usuário excluído com sucesso!');
                                deleteUserModal.classList.add('hidden'); // Esconde o modal

                                // Atualiza a lista de usuários
                                fetchUsuarios(); // Atualiza a lista de usuários
                            } else {
                                // Lidar com erros
                                const errorData = await response.json();
                                showModal(errorData.message || 'Erro ao excluir o usuário. Tente novamente.');
                            }
                        } catch (error) {
                            console.error('Erro:', error);
                            showModal('Erro ao excluir o usuário. Por favor, tente novamente.');
                        } finally {
                            // Remove a animação, retorna o botão ao estado original e habilita novamente
                            confirmButton.classList.remove('animate-pulse');
                            confirmButton.textContent = 'Confirmar'; // Restaura o texto original
                            confirmButton.disabled = false; // Habilita o botão novamente
                        }
                    };
                });
            });

            // Evento de clique no botão de voltar
            document.getElementById('cancelDeleteUser').onclick = () => {
                deleteUserModal.classList.add('hidden'); // Esconde o modal se o usuário voltar
            };
        });
    };

    // Função para filtrar os usuários pelo nome ou matrícula
    const filterUsuarios = (query) => {
        const allUsers = document.querySelectorAll('#userListContent > div');
        allUsers.forEach(userElement => {
            const nome = userElement.querySelector('p:nth-child(1)').textContent.toLowerCase();
            const matricula = userElement.querySelector('p:nth-child(2)').textContent.toLowerCase();
            if (nome.includes(query) || matricula.includes(query)) {
                userElement.style.display = '';
            } else {
                userElement.style.display = 'none';
            }
        });
    };

    async function populateLabNameFilter() {
        await checkAuthToken(async () => {
            const token = localStorage.getItem('authToken');
            const labNameFilter = document.getElementById('labNameFilter');
            labNameFilter.innerHTML = '<option value="todos">Todos</option>'; // Limpa e adiciona a opção padrão

            try {
                const response = await fetch('https://api-reserva-lab.vercel.app/laboratorios', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Adiciona o token de autenticação
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao carregar os laboratórios');
                }

                const labs = await response.json();

                labs.forEach(lab => {
                    const option = document.createElement('option');
                    option.value = lab.name;
                    option.textContent = lab.name;
                    labNameFilter.appendChild(option);
                });
            } catch (error) {
                console.error('Erro ao popular labNameFilter:', error);
            }
        });
    }

    async function loadLabs() {
        // Verifica o token e faz a requisição apenas se o token for válido
        await checkAuthToken(async () => {
            const token = localStorage.getItem('authToken');

            try {
                const response = await fetch('https://api-reserva-lab.vercel.app/laboratorios', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envia o token JWT no cabeçalho
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro na rede: ' + response.status);
                }

                const labs = await response.json();
                const labsContainer = document.getElementById('labsContainer');
                const searchInput = document.getElementById('roomSearchInput');

                // Limpa o contêiner
                labsContainer.innerHTML = '';

                if (labs.length === 0) {
                    labsContainer.innerHTML = `<p class="text-white text-center">Nenhum laboratório disponível no momento.</p>`;
                    return;
                }

                // Função para renderizar os laboratórios
                const renderLabs = (labsToRender) => {
                    labsContainer.innerHTML = '';
                    labsToRender.forEach(lab => {
                        const labDiv = document.createElement('div');
                        labDiv.className = 'bg-white bordas-redondas shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300';

                        const showForm = () => {
                            showReservationForm(lab.name);
                            const softwareNomeInput = document.querySelector('[tabindex="8"]');
                            if (softwareNomeInput) {
                                softwareNomeInput.focus();
                            }
                            const form = document.getElementById('reservationForm');
                            if (form) {
                                form.scrollIntoView({ behavior: 'smooth' });
                            }
                        };

                        labDiv.onclick = showForm;

                        labDiv.tabIndex = 0;
                        labDiv.addEventListener('keydown', (event) => {
                            if (event.key === 'Enter') {
                                showForm();
                            }
                        });

                        labDiv.innerHTML = `
                            <div tabindex="7">
                                <img src="${lab.image}" alt="${lab.name}" class="w-full h-40 object-cover mb-4 bordas-redondas shadow-md">
                                <h2 class="text-xl font-bold text-center">${lab.name}</h2>
                                <p class="block text-gray-700 font-bold mb-2 text-center">${lab.capacity} lugares</p>
                                <p class="block text-gray-700 text-sm font-semibold mb-2 text-center">${lab.description}</p>
                            </div>
                        `;

                        labsContainer.appendChild(labDiv);
                    });
                };

                // Renderização inicial
                renderLabs(labs);

                // Adiciona o listener para o input de busca
                searchInput.addEventListener('input', () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredLabs = labs.filter(lab =>
                        lab.name.toLowerCase().includes(searchTerm)
                    );
                    renderLabs(filteredLabs);
                });

            } catch (error) {
                console.error('Erro ao carregar os laboratórios:', error);
                const labsContainer = document.getElementById('labsContainer');
                labsContainer.innerHTML = `<p class="text-red-500 bg-white text-center">Erro ao carregar os laboratórios. Tente novamente mais tarde.</p>`;
            }
        });
    }

    async function loadLabs2() {
        // Verifica o token e faz a requisição apenas se o token for válido
        await checkAuthToken(async () => {
            const token = localStorage.getItem('authToken');

            try {
                // Faz a requisição para buscar laboratórios com o token no cabeçalho
                const response = await fetch('https://api-reserva-lab.vercel.app/laboratorios', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envia o token JWT no cabeçalho
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro na rede: ' + response.status);
                }

                const labs = await response.json();
                const labsContainer2 = document.getElementById('labsContainer2');
                const searchInput = document.getElementById('roomSearchInput2');

                // Limpa o container
                labsContainer2.innerHTML = '';

                if (labs.length === 0) {
                    labsContainer2.innerHTML = `<p class="text-white text-center">Nenhum laboratório disponível no momento.</p>`;
                    return;
                }

                // Função para renderizar os laboratórios
                const renderLabs = (labsToRender) => {
                    labsContainer2.innerHTML = '';
                    labsToRender.forEach(lab => {
                        const labDiv = document.createElement('div');
                        labDiv.className = 'bg-white bordas-redondas shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300';

                        labDiv.innerHTML = `
                            <div tabindex="10">
                                <img src="${lab.image}" alt="${lab.name}" class="w-full h-40 object-cover mb-4 bordas-redondas shadow-md">
                                <h2 class="text-xl font-bold text-center">${lab.name}</h2>
                                <p class="block text-gray-700 font-bold mb-2 text-center">${lab.capacity} lugares</p>
                                <p class="block text-gray-700 text-sm font-semibold mb-2 text-center">${lab.description}</p>
                                <div class="flex justify-center space-x-4 mt-4">
                                    <button class="editLabButton bg-yellow-500 text-white p-2 bordas-redondas font-bold hover:bg-yellow-600" data-id="${lab.id}">Editar</button>
                                    <button class="deleteLabButton bg-red-500 text-white p-2 bordas-redondas font-bold hover:bg-red-600" data-id="${lab.id}">Apagar</button>
                                </div>
                            </div>
                        `;

                        labsContainer2.appendChild(labDiv);

                        // Adicionar eventos de clique para editar e apagar
                        labDiv.querySelector('.editLabButton').addEventListener('click', () => {
                            openEditModal(lab); // Chama função para abrir o modal de edição
                        });

                        // Adiciona evento de clique para cancelar a edição
                        document.getElementById('cancelEditRoom').addEventListener('click', function () {
                            // Limpa os campos do formulário
                            document.getElementById('editRoomForm').reset();

                            // Esconde o modal
                            document.getElementById('editRoomModal').classList.add('hidden');
                        });

                        // Adiciona evento para abrir o modal de exclusão
                        labDiv.querySelector('.deleteLabButton').addEventListener('click', () => {
                            openDeleteModal(lab.id);
                        });
                    });
                };

                // Renderiza os laboratórios inicialmente
                renderLabs(labs);

                // Adiciona o evento de input para a pesquisa
                searchInput.addEventListener('input', () => {
                    const searchTerm = searchInput.value.toLowerCase();
                    const filteredLabs = labs.filter(lab =>
                        lab.name.toLowerCase().includes(searchTerm)
                    );
                    renderLabs(filteredLabs);
                });
            } catch (error) {
                console.error('Erro ao carregar os laboratórios:', error);
                const labsContainer2 = document.getElementById('labsContainer2');
                labsContainer2.innerHTML = `<p class="text-red-500 bg-white text-center">Erro ao carregar os laboratórios. Tente novamente mais tarde.</p>`;
            }
        });
    }

    function openEditModal(lab) {
        const editRoomModal = document.getElementById('editRoomModal');
        document.getElementById('editRoomName').value = lab.name;
        document.getElementById('editRoomCapacity').value = lab.capacity;
        document.getElementById('editRoomDescription').value = lab.description;
        editRoomModal.classList.remove('hidden'); // Exibe o modal

        const confirmButton = document.getElementById('confirmEditRoom');

        // Adicionar evento de submissão do formulário de edição
        document.getElementById('editRoomForm').onsubmit = async (e) => {
            e.preventDefault();
            confirmButton.disabled = true; // Desabilita o botão antes de enviar a requisição

            const updatedLabData = new FormData(); // Usar FormData para incluir a imagem
            updatedLabData.append('id', lab.id);
            updatedLabData.append('name', document.getElementById('editRoomName').value);
            updatedLabData.append('capacity', document.getElementById('editRoomCapacity').value);
            updatedLabData.append('description', document.getElementById('editRoomDescription').value);

            const newImage = document.getElementById('editRoomImage').files[0];
            if (newImage) {
                updatedLabData.append('roomImage', newImage);
            }

            const token = localStorage.getItem('authToken');  // Obtém o token JWT

            try {
                const response = await fetch(`https://api-reserva-lab.vercel.app/laboratorios/editar/${lab.id}`, {
                    method: 'PUT',
                    body: updatedLabData, // Enviando FormData
                    headers: {
                        'Authorization': `Bearer ${token}` // Adiciona o token JWT no cabeçalho
                    }
                });

                if (response.ok) {
                    showModal('Sala editada com sucesso!');
                    editRoomModal.classList.add('hidden'); // Esconde o modal após edição
                    loadLabs2(); // Recarregar a lista de salas
                    document.getElementById('editRoomForm').reset();
                } else {
                    const errorData = await response.json(); // Pega os dados do erro
                    showModal(errorData.message || 'Erro ao editar sala. Por favor, tente novamente.');
                }
            } catch (error) {
                console.error('Erro:', error);
                showModal('Erro ao editar sala. Por favor, tente novamente.');
            } finally {
                confirmButton.disabled = false; // Habilita o botão após a operação
            }
        };
    }

    function openDeleteModal(labId) {
        const deleteRoomModal = document.getElementById('deleteRoomModal');
        deleteRoomModal.classList.remove('hidden'); // Exibe o modal

        // Evento de clique no botão de confirmação
        document.getElementById('confirmDeleteRoom').onclick = async () => {
            const token = localStorage.getItem('authToken'); // Obtém o token JWT
            const confirmButton = document.getElementById('confirmDeleteRoom'); // Referência ao botão

            // Desabilita o botão para prevenir múltiplos cliques
            confirmButton.disabled = true;

            try {
                const response = await fetch(`https://api-reserva-lab.vercel.app/laboratorios/deletar/${labId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}` // Adiciona o token JWT no cabeçalho
                    }
                });

                if (response.ok) {
                    showModal('Sala excluída com sucesso!');
                    deleteRoomModal.classList.add('hidden'); // Esconde o modal após a exclusão
                    loadLabs2(); // Recarregar a lista de salas
                } else {
                    const errorData = await response.json(); // Pega os dados do erro
                    showModal(errorData.message || 'Erro ao excluir sala. Por favor, tente novamente.');
                }
            } catch (error) {
                console.error('Erro:', error);
                showModal('Erro ao excluir sala. Por favor, tente novamente.');
            } finally {
                // Reabilita o botão ao final da operação
                confirmButton.disabled = false; // Habilita o botão novamente
            }
        };

        // Evento de clique no botão de cancelamento
        document.getElementById('cancelDeleteRoom').onclick = () => {
            deleteRoomModal.classList.add('hidden'); // Esconde o modal se o usuário cancelar
        };
    }

    function setupReservationForm() {
        const form = document.getElementById('labReservationForm');
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const timeFimInput = document.getElementById('time_fim');
        const softwareCheckbox = document.getElementById('software_especifico');
        const softwareNomeInput = document.getElementById('software_nome');
        const softwareNomeContainer = document.getElementById('software_nome_container');
        const reserveButton = document.getElementById('reserveButton');

        softwareCheckbox.addEventListener('change', function () {
            if (this.checked) {
                softwareNomeContainer.classList.remove('hidden');
                softwareNomeInput.required = true;
            } else {
                softwareNomeContainer.classList.add('hidden');
                softwareNomeInput.required = false;
                softwareNomeInput.value = '';
            }
        });

        dateInput.dispatchEvent(new Event('change'));

        async function fetchBrasiliaTime() {
            try {
                const response = await fetch('https://api-reserva-lab.vercel.app/time/brazilia');
                const data = await response.json();
                const currentDateTime = new Date(data.datetime);

                // Obtém a hora atual de Brasília
                const currentHour = currentDateTime.getHours();
                const currentMinutes = currentDateTime.getMinutes();

                const today = currentHour >= 21
                    ? new Date(currentDateTime.setDate(currentDateTime.getDate() - 1)).toISOString().split('T')[0]
                    : currentDateTime.toISOString().split('T')[0];

                dateInput.min = today;
                dateInput.value = today;

                dateInput.addEventListener('input', function () {
                    if (this.value < today) {
                        showModal('Você não pode selecionar uma data anterior a hoje.');
                        this.value = today;  // Reseta a data para hoje se uma anterior for escolhida
                    }
                    updateDate();
                });

                timeInput.value = `${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;
                timeFimInput.value = '';

                dateInput.addEventListener('change', updateDate);
                timeInput.addEventListener('change', updateTimeFimMin);
                timeFimInput.addEventListener('change', validateTimeFim);

                updateDate();
            } catch (error) {
                console.error('Erro ao buscar a hora de Brasília:', error);
                showModal('Erro ao obter a data e hora atual. Por favor, tente novamente mais tarde.');

                // Aguarda 3 segundos antes de redirecionar
                setTimeout(function () {
                    window.location.href = '../index.html';
                }, 2500);
            }
        }

        function updateDate(userInteracted = false) {
            const selectedDate = dateInput.value;
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];

            // Calcula a data de ontem
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedYesterday = yesterday.toISOString().split('T')[0];

            if (selectedDate === currentDate) {
                // Para a data atual, permitir qualquer horário
                timeInput.min = '07:00';
                timeFimInput.min = '07:00';
                timeInput.disabled = false;
                timeFimInput.disabled = false;
                reserveButton.disabled = false
            } else if (selectedDate === formattedYesterday) {
                if (now.getHours() >= 21) {
                    // Após 21:00, bloqueia os campos de horário para ontem
                    timeInput.disabled = true;
                    timeFimInput.disabled = true;
                    reserveButton.disabled = true
                    timeInput.value = '';
                    timeFimInput.value = '';
                    if (userInteracted) {
                        showModal('Os horários para a data selecionada estão bloqueados após as 21:00.');
                    }
                } else {
                    // Antes das 21:00, permite a seleção de horários para ontem
                    timeInput.min = '07:00';
                    timeFimInput.min = '07:00';
                    timeInput.disabled = false;
                    timeFimInput.disabled = false;
                    reserveButton.disabled = false
                }
            } else {
                // Para outras datas (futuras ou passadas, exceto ontem), habilita os campos
                timeInput.min = '07:00';
                timeFimInput.min = '07:00';
                timeInput.disabled = false;
                timeFimInput.disabled = false;
                reserveButton.disabled = false
            }

            updateTimeFimMin();
        }

        function updateTimeFimMin() {
            const selectedDate = dateInput.value;
            const startTime = timeInput.value;
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];

            if (selectedDate === currentDate) {
                timeFimInput.min = startTime || '07:00';
            } else {
                timeFimInput.min = startTime || '07:00';
            }

            validateTimeFim();
        }

        function validateTimeFim() {
            const startTime = timeInput.value;
            const endTime = timeFimInput.value;
            const selectedDate = dateInput.value;

            if (startTime && endTime) {
                const start = new Date(`${selectedDate}T${startTime}:00-03:00`);
                const end = new Date(`${selectedDate}T${endTime}:00-03:00`);
                const maxEnd = new Date(`${selectedDate}T22:00:00-03:00`);

                const timeDifference = (end - start) / (1000 * 60 * 60);

                if (startTime > "21:00" && endTime > "22:00") {
                    showModal('O horário de início não pode ser após 21:00 e o horário de término não pode ser após 22:00.');
                    timeInput.value = '';
                    timeFimInput.value = '';
                    return;
                }

                if (end > maxEnd) {
                    showModal('O horário de término não pode ser após 22:00.');
                    timeFimInput.value = '22:00';
                } else if (end <= start) {
                    showModal('O horário de término não pode ser anterior ou igual ao horário de início.');
                    const newEndTime = new Date(start.getTime() + (60 * 60 * 1000));
                    timeFimInput.value = newEndTime.toTimeString().split(' ')[0].substring(0, 5);
                } else if (timeDifference < 1) {
                    showModal('A duração mínima da reserva deve ser de 1 hora.');
                    const newEndTime = new Date(start.getTime() + (60 * 60 * 1000));
                    timeFimInput.value = newEndTime.toTimeString().split(' ')[0].substring(0, 5);
                }
            }
        }

        function validateStartTime() {
            const startTime = timeInput.value;
            const selectedDate = dateInput.value;
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const formattedYesterday = yesterday.toISOString().split('T')[0];

            const minValidTime = "07:00";
            if (startTime < minValidTime && selectedDate !== formattedYesterday) {
                showModal('O horário de início não pode ser anterior a 7:00.');
                timeInput.value = minValidTime;
            }

            const maxTime = "21:00";

            if (startTime > maxTime && selectedDate !== formattedYesterday) {
                showModal('O horário de início não pode ser após 21:00.');
                timeInput.value = maxTime;
            }

            updateTimeFimMin();
        }

        function setInitialTimes() {
            const now = new Date();
            const currentHour = now.getHours();
            timeInput.value = `${currentHour.toString().padStart(2, '0')}:00`;
            timeFimInput.value = `${(currentHour + 1).toString().padStart(2, '0')}:00`;
        }

        function handleTimeChange(event) {
            const input = event.target;
            const [hours] = input.value.split(':');
            input.value = `${hours}:00`;
        }

        setInitialTimes();

        timeInput.addEventListener('change', validateStartTime);
        timeInput.addEventListener('change', handleTimeChange);
        timeFimInput.addEventListener('change', handleTimeChange);

        fetchBrasiliaTime();

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const userName = localStorage.getItem('userName');
            const userMatricula = localStorage.getItem('userMatricula');
            const token = localStorage.getItem('authToken');

            if (!userName || !userMatricula) {
                localStorage.setItem('loginMessage', 'Por favor, faça o login para continuar.');
                window.location.href = '../index.html';
                return;
            }

            const labName = document.getElementById("labName").textContent;
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;
            const timeFim = document.getElementById("time_fim").value;
            const purpose = document.getElementById("purpose").value;
            const softwareEspecifico = softwareCheckbox.checked;
            let softwareNome = null;

            if (softwareEspecifico) {
                softwareNome = softwareNomeInput.value.trim();
                if (!softwareNome) {
                    showModal('Por favor, preencha o nome do software específico.');
                    return;
                }
            }

            // Check if the selected time slot is available
            const unavailableTimes = await fetchUnavailableTimes(labName);
            const isTimeSlotAvailable = checkTimeSlotAvailability(unavailableTimes, date, time, timeFim);

            if (!isTimeSlotAvailable) {
                showModal('O horário selecionado não está disponível. Por favor, escolha outro horário.');
                return;
            }

            const data = {
                labName,
                date,
                time,
                time_fim: timeFim,
                purpose,
                userName,
                userMatricula,
                softwareEspecifico,
                softwareNome
            };

            // Desabilita o botão de reservar
            reserveButton.disabled = true; // Desabilita o botão
            reserveButton.classList.add('animate-bounce');
            reserveButton.textContent = 'Processando...';

            // Simula um processo de carregamento
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                reserveButton.textContent = `Processando... ${progress}%`;

                if (progress >= 100) {
                    clearInterval(interval);
                    reserveButton.classList.remove('animate-bounce');
                    reserveButton.textContent = 'Concluído!';

                    // Envia os dados para o backend
                    sendReservationData(data, token);
                }
            }, 200);
        });

        async function sendReservationData(data, token) {
            try {
                const response = await fetch("https://api-reserva-lab.vercel.app/reserve", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Adiciona o token JWT no cabeçalho
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    showAnimatedConfirmation2('reservar');
                    await updateNotifications();
                } else {
                    const result = await response.json();
                    const errorMessage = result.error || "Erro ao processar a reserva.";
                    showModal(errorMessage);
                }
            } catch (error) {
                console.error("Erro ao enviar a reserva:", error);
                showModal("Erro ao processar a reserva.");
            } finally {
                reserveButton.textContent = 'Reservar';
                reserveButton.disabled = false; // Reabilita o botão após o processamento
            }
        }

        function checkTimeSlotAvailability(unavailableTimes, date, startTime, endTime) {
            const requestStart = new Date(`${date}T${startTime}`);
            const requestEnd = new Date(`${date}T${endTime}`);

            for (const reservation of unavailableTimes) {
                const reservationStart = new Date(`${reservation.date}T${reservation.time}`);
                const reservationEnd = new Date(`${reservation.date}T${reservation.time_fim}`);

                if (
                    (requestStart >= reservationStart && requestStart < reservationEnd) ||
                    (requestEnd > reservationStart && requestEnd <= reservationEnd) ||
                    (requestStart <= reservationStart && requestEnd >= reservationEnd)
                ) {
                    return false;
                }
            }
            return true;
        }
    }

    let currentFilterStatus = 'todos';

    async function fetchAndRenderRequests() {
        const requestsList = document.getElementById('requestsList');
        const userMatricula = localStorage.getItem('userMatricula');
        const token = localStorage.getItem('authToken'); // Recupera o token JWT

        const statusFilter = document.getElementById('statusFilter');
        const labNameFilter = document.getElementById('labNameFilter'); // Filtro de nome de sala
        const dateFilter = document.getElementById('dateFilter'); // Filtro de data

        // Verifica se o usuário está logado
        if (!userMatricula) {
            requestsList.innerHTML = '<p class="text-center text-white">Por favor, faça o login para ver suas solicitações.</p>';
            return;
        }

        // Verifica o token de autenticação
        await checkAuthToken(async () => {
            requestsList.innerHTML = '<p class="text-center text-white">Carregando solicitações...</p>';

            try {
                const response = await fetch('https://api-reserva-lab.vercel.app/reserve/status', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envia o token JWT no cabeçalho
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar as solicitações');
                }

                const requests = await response.json();
                let userRequests = requests.filter(request => request.user_matricula === userMatricula);

                // Listener para atualizar as solicitações quando o filtro de status mudar
                statusFilter.addEventListener('change', function () {
                    currentFilterStatus = this.value;
                    renderFilteredRequests(userRequests, currentFilterStatus, labNameFilter.value, dateFilter.value);
                });

                // Listener para atualizar as solicitações quando o filtro de sala mudar
                labNameFilter.addEventListener('change', function () {
                    renderFilteredRequests(userRequests, currentFilterStatus, this.value, dateFilter.value);
                });

                // Listener para atualizar as solicitações quando o filtro de data mudar
                dateFilter.addEventListener('change', function () {
                    renderFilteredRequests(userRequests, currentFilterStatus, labNameFilter.value, this.value);
                });

                // Renderiza pela primeira vez com os filtros atuais
                renderFilteredRequests(userRequests, currentFilterStatus, labNameFilter.value, dateFilter.value);
            } catch (error) {
                console.error(error);
                requestsList.innerHTML = '<p class="text-center text-red-500">Erro ao carregar as solicitações.</p>';
            }
        });
    }

    async function renderFilteredRequests(requests, status, labName, date) {
        const requestsList = document.getElementById('requestsList');
        let filteredRequests = requests;

        // Obter a hora atual de Brasília
        let currentDateTime;
        try {
            const response = await fetch('https://api-reserva-lab.vercel.app/time/brazilia');
            const data = await response.json();
            currentDateTime = new Date(data.datetime);
        } catch (error) {
            console.error('Erro ao buscar a hora de Brasília:', error);
            showModal('Erro ao obter a data e hora atual. Por favor, tente novamente mais tarde.');
            return;
        }

        // Filtrar por status se não for "todos"
        if (status !== 'todos') {
            filteredRequests = filteredRequests.filter(request => request.status === status);
        }

        // Filtrar por nome da sala se um valor específico for selecionado
        if (labName !== 'todos') {
            filteredRequests = filteredRequests.filter(request => request.lab_name === labName);
        }

        // Filtrar por data se uma data específica for selecionada
        if (date) {
            filteredRequests = filteredRequests.filter(request => request.date === date); // Supondo que o formato da data seja compatível
        }

        if (filteredRequests.length === 0) {
            requestsList.innerHTML = '<p class="text-center text-white">Nenhuma solicitação encontrada.</p>';
        } else {
            let isAscending = true;
            let isSortingById = false; // Adicionado para controlar a ordenação por ID

            const sortRequests = () => {
                if (isSortingById) {
                    // Ordena apenas por ID
                    filteredRequests.sort((a, b) => isAscending ? a.id - b.id : b.id - a.id);
                } else {
                    // Define a prioridade de status
                    const statusOrder = { 'utilizando': 1, 'pendente': 2, 'aprovado': 3, 'concluído': 4, 'rejeitado': 5, 'cancelado': 6 };

                    // Primeiro, ordena por status
                    filteredRequests.sort((a, b) => {
                        const statusComparison = statusOrder[a.status] - statusOrder[b.status];
                        if (statusComparison !== 0) {
                            return statusComparison; // Se os status forem diferentes, usa a ordem de status
                        }
                        // Se os status forem iguais, ordena por ID
                        return isAscending ? a.id - b.id : b.id - a.id;
                    });
                }
            };

            const renderRequests = async () => {
                const requestsHTML = await Promise.all(filteredRequests.map(async request => {
                    let motivoRejeicao = '';
                    if (request.status === 'rejeitado') {
                        try {
                            const response = await fetch(`https://api-reserva-lab.vercel.app/rejeicoes/${request.id}`);
                            if (response.ok) {
                                const data = await response.json();
                                motivoRejeicao = data.motivo;
                            }
                        } catch (error) {
                            console.error(`Erro ao buscar o motivo de rejeição: ${error}`);
                        }
                    }

                    // Função para verificar se o botão "Cancelar" deve estar invisível
                    function shouldHideCancel(requestDate, requestTime, requestStatus) {
                        const requestStartTime = new Date(`${requestDate}T${requestTime}`);
                        const timeDifference = (requestStartTime - currentDateTime) / (1000 * 60);
                        return requestStatus === 'aprovado' && timeDifference <= 60;
                    }

                    const softwareEspecificoHtml = request.software_nome !== null ?
                        `<p class="text-sm text-gray-600">Software específico: ${request.software_nome}</p>` : '';

                    // Criação do HTML da solicitação
                    return `
                    <div class="bg-white shadow-md bordas-redondas p-4 mb-4" tabindex="8">
                        <h3 class="font-bold text-lg mb-2">${request.lab_name}</h3>
                        <p class="text-sm text-gray-600">Solicitação: ${request.id}</p>
                        <p class="text-sm text-gray-600">Data: ${formatDate(request.date)}</p>
                        <p class="text-sm text-gray-600">Horário de Início: ${request.time}</p>
                        <p class="text-sm text-gray-600">Horário de Término: ${request.time_fim}</p>
                        <div class="max-w">
                            <p class="text-sm text-gray-600">
                                <span class="font-semibold">Finalidade:</span> 
                                <span class="break-normal">${request.purpose}</span>
                            </p>
                        </div>
                        ${softwareEspecificoHtml}
                        <h4 class="text-sm font-semibold mt-2 ${getStatusColor(request.status)}">${request.status}</h4>
                        ${request.status === 'rejeitado' ? `<h4 class="text-sm text-red-600">Motivo da rejeição: ${motivoRejeicao}</h4>` : ''}
                        ${(request.status === 'pendente' || (request.status === 'aprovado' && !shouldHideCancel(request.date, request.time, request.status))) ?
                            `<button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 bordas-redondas text-sm cancel-request" data-id="${request.id}">
                                Cancelar Solicitação
                            </button>` : ''}
                    </div>`;
                }));

                requestsList.innerHTML = requestsHTML.join('');

                // Adiciona eventos aos botões de cancelamento
                document.querySelectorAll('.cancel-request').forEach(button => {
                    button.addEventListener('click', function () {
                        const requestId = this.getAttribute('data-id');
                        showCancelConfirmation(requestId);
                    });
                });

                // Adiciona eventos de teclado ao div das solicitações
                const requestDivs = document.querySelectorAll('[tabindex="8"]');
                requestDivs.forEach(div => {
                    div.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter') {
                            const cancelButton = div.querySelector('.cancel-request');
                            if (cancelButton) {
                                // Aciona a ação de cancelar
                                showCancelConfirmation(cancelButton.getAttribute('data-id'));
                                // Foca no próximo elemento com tabindex 23
                                const nextElement = document.querySelector('[tabindex="9"]');
                                if (nextElement) {
                                    nextElement.focus();
                                }
                            }
                        }
                    });
                });
            };

            // Ordena por status inicialmente
            sortRequests();
            renderRequests();

            // Adiciona a lógica de ordenação por ID ao clicar no botão
            document.getElementById('sortByIdButton').addEventListener('click', function () {
                isAscending = !isAscending;  // Alterna a direção da ordenação
                this.textContent = isAscending ? 'Ordenar solicitação ▲' : 'Ordenar solicitação ▼';
                isSortingById = true; // Altera para ordenar por ID

                // Reaplica todos os filtros: status, nome do laboratório e data
                filteredRequests = requests.filter(request => {
                    const statusMatch = currentFilterStatus === 'todos' || request.status === currentFilterStatus;
                    const labNameMatch = labNameFilter.value === 'todos' || request.lab_name === labNameFilter.value;
                    const dateMatch = !dateFilter.value || request.date === dateFilter.value;

                    return statusMatch && labNameMatch && dateMatch;
                });

                // Ordena as solicitações novamente
                sortRequests();
                renderRequests();
            });

        }
    }

    function formatDate(dateString) {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    }

    function getStatusColor(status) {
        switch (status) {
            case 'aprovado':
                return 'text-green-600';
            case 'pendente':
                return 'text-yellow-600';
            case 'rejeitado':
                return 'text-red-600';
            case 'cancelado':
                return 'text-gray-400';
            case 'concluído':
                return 'status-concluido';
            case 'utilizando':
                return 'status-utilizando';
            default:
                return 'text-gray-600';
        }
    }

    function showCancelConfirmation(requestId) {
        const modal = document.getElementById('cancelConfirmationModal');
        const confirmButton = document.getElementById('confirmCancel');
        const cancelButton = document.getElementById('cancelCancelation');

        modal.classList.remove('hidden');
        modal.classList.add('flex', 'items-center', 'justify-center');

        confirmButton.onclick = function () {
            cancelRequest(requestId);
        };

        cancelButton.onclick = function () {
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'items-center', 'justify-center');
        };
    }

    function cancelRequest(requestId) {
        const modal = document.getElementById('cancelConfirmationModal');
        const confirmButton = document.getElementById('confirmCancel');

        // Altera o botão para estado de processamento
        confirmButton.classList.add('animate-pulse');
        confirmButton.textContent = 'Processando...';
        confirmButton.classList.remove('bg-red-500');
        confirmButton.classList.add('bg-gray-500');

        const token = localStorage.getItem('authToken'); // Recupera o token JWT

        if (!token) {
            showModal('Você não está autenticado. Faça login para continuar.');
            closeModalAndResetButton();
            return; // Impede que o cancelamento continue sem autenticação
        }

        fetch(`https://api-reserva-lab.vercel.app/reserve/cancelar/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Adiciona o token JWT ao cabeçalho
            },
            body: JSON.stringify({
                status: 'cancelado'
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(`Erro ${response.status}: ${errData.error || 'Falha ao cancelar a solicitação'}`);
                    });
                }
                return response.json();
            })
            .then(async _data => {
                showAnimatedConfirmation2('cancelar_solicitacao', requestId);
                await updateNotifications(); // Atualiza notificações
                closeModalAndResetButton();
            })
            .catch(error => {
                console.error('Erro:', error);
                confirmButton.classList.remove('animate-pulse');
                confirmButton.textContent = 'Erro ao Cancelar';
                confirmButton.classList.add('bg-red-500');

                // Restaura o botão após um tempo para feedback visual
                setTimeout(() => {
                    closeModalAndResetButton();
                }, 1500);
            });
    }

    function closeModalAndResetButton() {
        const modal = document.getElementById('cancelConfirmationModal');
        const confirmButton = document.getElementById('confirmCancel');

        // Reseta o botão de confirmação para o estado inicial
        confirmButton.classList.remove('animate-pulse', 'bg-gray-500');
        confirmButton.classList.add('bg-red-500');
        confirmButton.textContent = 'Confirmar Cancelamento';

        // Esconde o modal
        modal.classList.add('hidden');
    }

    let currentPedidosFilterStatus = 'todos';
    let currentLabFilter = 'todos';
    let currentDateFilter = '';

    async function fetchAndRenderPedidos() {
        const requestsList = document.getElementById('requestsList');
        const statusFilter = document.getElementById('statusFilter');
        const labNameFilter = document.getElementById('labNameFilter'); // Filtro de nome de laboratório
        const dateFilter = document.getElementById('dateFilter'); // Filtro de data

        // Verifica o token de autenticação
        await checkAuthToken(async () => {
            const token = localStorage.getItem('authToken'); // Recupera o token JWT

            requestsList.innerHTML = '<p class="text-center text-white">Carregando pedidos...</p>';

            try {
                const response = await fetch('https://api-reserva-lab.vercel.app/reserve/status/geral', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Envia o token JWT no cabeçalho
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar as solicitações');
                }

                const requests = await response.json();

                // Filtrar apenas as solicitações com status 'pendente' ou 'aprovado'
                const filteredRequests = requests.filter(request =>
                    request.status === 'utilizando' || request.status === 'pendente' || request.status === 'aprovado' || request.status === 'concluído' || request.status === 'rejeitado' || request.status === 'cancelado'
                );

                // Configura os listeners para os filtros
                statusFilter.addEventListener('change', function () {
                    currentPedidosFilterStatus = this.value;
                    renderFilteredPedidos(filteredRequests);
                });

                labNameFilter.addEventListener('change', function () {
                    currentLabFilter = this.value;
                    renderFilteredPedidos(filteredRequests);
                });

                dateFilter.addEventListener('change', function () {
                    currentDateFilter = this.value;
                    renderFilteredPedidos(filteredRequests);
                });

                renderFilteredPedidos(filteredRequests); // Renderiza pela primeira vez
            } catch (error) {
                console.error('Erro:', error);
                requestsList.innerHTML = '<p class="text-center text-red-500">Erro ao carregar os pedidos.</p>';
            }
        });
    }

    async function renderFilteredPedidos(requests) {
        const requestsList = document.getElementById('requestsList');
        let filteredRequests = requests;

        // Obter a hora atual de Brasília
        let currentDateTime;
        try {
            const response = await fetch('https://api-reserva-lab.vercel.app/time/brazilia');
            const data = await response.json();
            currentDateTime = new Date(data.datetime);
        } catch (error) {
            console.error('Erro ao buscar a hora de Brasília:', error);
            showModal('Erro ao obter a data e hora atual. Por favor, tente novamente mais tarde.');
            return;
        }

        // Filtrar os pedidos pelo status, exceto se for 'todos'
        if (currentPedidosFilterStatus !== 'todos') {
            filteredRequests = filteredRequests.filter(request => request.status === currentPedidosFilterStatus);
        }

        // Filtrar os pedidos pelo laboratório, exceto se for 'todos'
        if (currentLabFilter !== 'todos') {
            filteredRequests = filteredRequests.filter(request => request.lab_name === currentLabFilter);
        }

        // Filtrar os pedidos pela data, se uma data específica for selecionada
        if (currentDateFilter) {
            filteredRequests = filteredRequests.filter(request => request.date === currentDateFilter);
        }

        // Se não houver pedidos filtrados, exibir uma mensagem
        if (filteredRequests.length === 0) {
            requestsList.innerHTML = '<p class="text-center text-white">Nenhum pedido encontrado.</p>';
        } else {
            let isAscending = true;
            let sortByStatus = true;

            const sortRequests = () => {
                if (sortByStatus) {
                    filteredRequests.sort((a, b) => {
                        const statusOrder = { 'utilizando': 1, 'pendente': 2, 'aprovado': 3, 'concluído': 4, 'rejeitado': 5, 'cancelado': 6 };
                        return statusOrder[a.status] - statusOrder[b.status] || a.id - b.id;
                    });
                } else {
                    filteredRequests.sort((a, b) => {
                        return isAscending ? a.id - b.id : b.id - a.id;
                    });
                }
            };

            const renderRequests = () => {
                const requestsHTML = filteredRequests.map(request => {
                    let actionButtons = '';

                    // Função para verificar se o botão "Cancelar" deve estar invisível
                    function shouldHideCancel(requestDate, requestTime) {
                        const requestStartTime = new Date(`${requestDate}T${requestTime}`);
                        const timeDifference = (requestStartTime - currentDateTime) / (1000 * 60);
                        return timeDifference <= 0;
                    }

                    // Exibir botões de ação dependendo do status
                    if (request.status === 'pendente') {
                        actionButtons = `
                        <button class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 bordas-redondas text-sm approve-request" data-id="${request.id}">
                            Aprovar
                        </button>
                        <button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 bordas-redondas text-sm reject-request" data-id="${request.id}">
                            Rejeitar
                        </button>
                    `;
                    } else if (request.status === 'aprovado') {
                        // Verifica se o botão de cancelar deve ser oculto
                        if (!shouldHideCancel(request.date, request.time)) {
                            actionButtons = `
                            <button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 bordas-redondas text-sm cancel-request_Administrador" data-id="${request.id}">
                                Cancelar
                            </button>
                        `;
                        }
                    }

                    const softwareEspecificoHtml = request.software_nome !== null ?
                        `<p class="text-sm text-gray-600">Software específico: ${request.software_nome}</p>` : '';

                    return `
                    <div class="bg-white shadow-md bordas-redondas p-4 mb-4">
                        <h3 class="font-bold text-lg mb-2">${request.lab_name}</h3>
                        <p class="text-sm text-gray-600">Solicitação: ${request.id}</p>
                        <p class="text-sm text-gray-600">Solicitante: ${request.nome}</p>
                        <p class="text-sm text-gray-600">Matrícula: ${request.matricula}</p>
                        <p class="text-sm text-gray-600">Data: ${formatDate(request.date)}</p>
                        <p class="text-sm text-gray-600">Horário de Início: ${request.time}</p>
                        <p class="text-sm text-gray-600">Horário de Término: ${request.time_fim}</p>
                        ${softwareEspecificoHtml}
                        <div class="max-w">
                            <p class="text-sm text-gray-600">
                                <span class="font-semibold">Finalidade:</span> 
                                <span class="break-normal">${request.purpose}</span>
                            </p>
                        </div>
                        <h4 class="text-sm font-semibold mt-2 ${getStatusColor(request.status)}">${request.status}</h4>
                        ${actionButtons}
                    </div>
                `;
                }).join('');

                requestsList.innerHTML = requestsHTML;

                // Adicionar eventos aos botões de ação
                document.querySelectorAll('.approve-request').forEach(button => {
                    button.addEventListener('click', function () {
                        const pedidoId = this.getAttribute('data-id');
                        showConfirmationModal('aprovar', pedidoId);
                    });
                });

                document.querySelectorAll('.reject-request').forEach(button => {
                    button.addEventListener('click', function () {
                        const pedidoId = this.getAttribute('data-id');
                        showConfirmationModal('rejeitar', pedidoId);
                    });
                });

                document.querySelectorAll('.cancel-request_Administrador').forEach(button => {
                    button.addEventListener('click', function () {
                        const requestId = this.getAttribute('data-id');
                        showCancelConfirmation_Administrador(requestId);
                    });
                });
            };

            // Ordenação inicial por status
            sortRequests();
            renderRequests();

            // Adiciona a lógica de ordenação por ID
            document.getElementById('sortByIdButton').addEventListener('click', function () {
                if (sortByStatus) {
                    sortByStatus = false;
                    isAscending = true;
                } else {
                    isAscending = !isAscending;
                }
                this.textContent = isAscending ? 'Ordenar solicitação ▲' : 'Ordenar solicitação ▼';

                // Reaplica todos os filtros: status, nome do laboratório e data
                filteredRequests = requests.filter(request => {
                    const statusMatch = currentPedidosFilterStatus === 'todos' || request.status === currentPedidosFilterStatus;
                    const labNameMatch = currentLabFilter === 'todos' || request.lab_name === currentLabFilter;
                    const dateMatch = !currentDateFilter || request.date === currentDateFilter;

                    return statusMatch && labNameMatch && dateMatch;
                });

                // Ordena as solicitações novamente
                sortRequests();
                renderRequests();
            });
        }
    }

    function showCancelConfirmation_Administrador(requestId) {
        const modal = document.getElementById('cancelConfirmationModal_Administrador');
        const confirmButton = document.getElementById('confirmCancel_Administrador');
        const cancelButton = document.getElementById('cancelCancelation_Administrador');

        modal.classList.remove('hidden');
        modal.classList.add('flex', 'items-center', 'justify-center');

        confirmButton.onclick = function () {
            cancelRequest_Administrador(requestId);
        };

        cancelButton.onclick = function () {
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'items-center', 'justify-center');
        };
    }

    function cancelRequest_Administrador(requestId) {
        const modal_Administrador = document.getElementById('cancelConfirmationModal_Administrador');
        const confirmButton_Administrador = document.getElementById('confirmCancel_Administrador');

        // Estado de processamento do botão
        confirmButton_Administrador.classList.add('animate-pulse');
        confirmButton_Administrador.textContent = 'Processando...';
        confirmButton_Administrador.classList.remove('bg-red-500');
        confirmButton_Administrador.classList.add('bg-gray-500');

        // Recupera o token JWT
        const token = localStorage.getItem('authToken');

        if (!token) {
            showModal('Você não está autenticado. Faça login para continuar.');
            closeModalAndResetButton_Administrador();
            return; // Impede o cancelamento caso o usuário não esteja autenticado
        }

        fetch(`https://api-reserva-lab.vercel.app/reserve/cancelar/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Token JWT adicionado ao cabeçalho
            },
            body: JSON.stringify({
                status: 'cancelado'
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errData => {
                        throw new Error(`Erro ${response.status}: ${errData.error || 'Falha ao cancelar a reserva'}`);
                    });
                }
                return response.json();
            })
            .then(async _data => {
                showAnimatedConfirmation2('cancelar', requestId);
                await updateNotifications(); // Atualiza notificações imediatamente
                closeModalAndResetButton_Administrador(); // Fecha o modal e reseta o botão
            })
            .catch(error => {
                console.error('Erro:', error);
                confirmButton_Administrador.classList.remove('animate-pulse');
                confirmButton_Administrador.textContent = 'Erro ao Cancelar';
                confirmButton_Administrador.classList.add('bg-red-500');

                setTimeout(() => {
                    closeModalAndResetButton_Administrador(); // Fecha o modal e reseta o botão após erro
                }, 1500);
            });

        // Função para fechar o modal e resetar o botão
        function closeModalAndResetButton_Administrador() {
            modal_Administrador.classList.add('hidden');
            modal_Administrador.classList.remove('flex', 'items-center', 'justify-center');
            confirmButton_Administrador.classList.remove('animate-pulse', 'bg-gray-500');
            confirmButton_Administrador.classList.add('bg-red-500');
            confirmButton_Administrador.textContent = 'Confirmar Cancelamento';
        }
    }

    function showConfirmationModal(action, pedidoId) {
        const modal = document.getElementById('confirmationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalIcon = document.getElementById('modalIcon');
        const confirmButton = document.getElementById('confirmAction');
        const cancelButton = document.getElementById('cancelAction');

        modalTitle.innerHTML = `<h4 class="text">Confirmar ${action.charAt(0).toUpperCase() + action.slice(1)}</h4>`;

        if (action === 'rejeitar') {
            modalMessage.innerHTML = `
                <p>Tem certeza que deseja ${action} este pedido?</p>
                <textarea id="rejectReason" class="mt-2 w-full px-4 p-2 border bordas-redondas" placeholder="Motivo da rejeição (obrigatório)"></textarea>
            `;
        } else {
            modalMessage.textContent = `Tem certeza que deseja ${action} este pedido?`;
        }

        // Configurações do modal conforme a ação (aprovar ou rejeitar)
        modalIcon.innerHTML = action === 'aprovar' ? `
            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>` : `
            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>`;

        modalIcon.classList.toggle('bg-red-100', action !== 'aprovar');
        modalIcon.classList.toggle('bg-green-100', action === 'aprovar');

        // Configurando a cor do botão conforme a ação
        if (action === 'aprovar') {
            confirmButton.classList.remove('bg-red-500');
            confirmButton.classList.remove('hover:bg-red-600');
            confirmButton.classList.add('bg-green-500');
            confirmButton.classList.add('hover:bg-green-600');
        } else {
            confirmButton.classList.remove('bg-green-500');
            confirmButton.classList.remove('hover:bg-green-600');
            confirmButton.classList.add('bg-red-500');
            confirmButton.classList.add('hover:bg-red-600');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex', 'items-center', 'justify-center');

        confirmButton.onclick = () => {
            if (action === 'aprovar') {
                approvePedido(pedidoId).then(() => {
                    showAnimatedConfirmation2('aprovar', pedidoId);
                });
            } else {
                const rejectReason = document.getElementById('rejectReason').value.trim();
                if (!rejectReason) {
                    showModal('Por favor, forneça um motivo para a rejeição.');
                    return;
                }
                rejectPedido(pedidoId, rejectReason).then(() => {
                    showAnimatedConfirmation2('rejeitar', pedidoId);
                });
            }
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'items-center', 'justify-center');
        };

        cancelButton.onclick = () => {
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'items-center', 'justify-center');
        };
    }

    function approvePedido(pedidoId) {
        const token = localStorage.getItem('authToken'); // Recupera o token JWT
        if (!token) {
            showModal('Você não está autenticado. Faça login para continuar.');
            return;
        }

        return fetch(`https://api-reserva-lab.vercel.app/aprovar/pedido/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Inclui o token JWT no cabeçalho
            },
            body: JSON.stringify({ status: 'aprovado' })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao aprovar o pedido');
                }
                return response.json();
            })
            .then(async _data => {
                console.log(`Pedido ${pedidoId} aprovado!`);
                addNotification(`Pedido ${pedidoId} foi aprovado.`);
                await updateNotifications(); // Atualiza as notificações imediatamente
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    function rejectPedido(pedidoId, rejectReason) {
        const token = localStorage.getItem('authToken'); // Recupera o token JWT
        if (!token) {
            showModal('Você não está autenticado. Faça login para continuar.');
            return;
        }

        return fetch(`https://api-reserva-lab.vercel.app/rejeitar/pedido/${pedidoId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Inclui o token JWT nos cabeçalhos
            },
            body: JSON.stringify({ motivo: rejectReason })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao processar a rejeição');
                }
                console.log(`Pedido ${pedidoId} rejeitado com motivo: ${rejectReason}!`);
                addNotification(`Pedido ${pedidoId} foi rejeitado.`);
                return updateNotifications();
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    navMenu.addEventListener('click', function (e) {
        if (e.target.tagName === 'BUTTON') {
            activeSection = e.target.textContent;
            renderContent();

            // Update active button styles
            navMenu.querySelectorAll('button').forEach(btn => {
                if (btn === e.target) {
                    btn.classList.remove('text-gray-500', 'hover:text-blue-600');
                    btn.classList.add('text-blue-600', 'border-b-2', 'border-blue-600', 'pb-2');
                } else {
                    btn.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600', 'pb-2');
                    btn.classList.add('text-gray-500', 'hover:text-blue-600');
                }
            });
        }
    });

    // Initial render
    renderContent();
});

let currentLabName = '';
let currentFetchPromise = null;

function showReservationForm(labName) {
    const form = document.getElementById('reservationForm');
    const labNameSpan = document.getElementById('labName');
    const dateInput = document.getElementById('date');
    const timeInput = document.getElementById('time');
    const timeFimInput = document.getElementById('time_fim');
    const purposeInput = document.getElementById('purpose');
    const tableContainer = document.getElementById('unavailableTimesTable');

    // Exibe o formulário de reserva
    form.classList.remove('hidden');
    labNameSpan.textContent = labName;

    // Limpa o formulário ao alternar de laboratório
    dateInput.value = '';
    timeInput.value = '';
    timeFimInput.value = '';
    purposeInput.value = '';

    // Reinicializa o conteúdo da tabela de horários indisponíveis
    if (tableContainer) {
        tableContainer.innerHTML = '<p class="texto-mancha font-bold">Selecione uma data para ver os horários disponíveis.</p>';
    }

    // Atualiza o nome do laboratório atual
    currentLabName = labName;

    // Remove o listener de evento anterior antes de adicionar um novo
    dateInput.removeEventListener('change', updateTable);
    dateInput.addEventListener('change', updateTable);

    form.scrollIntoView({ behavior: 'smooth' });
}

async function fetchUnavailableTimes(labName) {
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(`https://api-reserva-lab.vercel.app/reserve/status/geral`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch reservations');
        }

        const reservations = await response.json();
        return reservations.filter(reservation =>
            reservation.lab_name === labName &&
            (reservation.status === 'aprovado' || reservation.status === 'pendente' || reservation.status === 'utilizando')
        );
    } catch (error) {
        console.error('Error fetching unavailable times:', error);
        return []; // Return an empty array on error
    }
}

async function fetchCurrentTime() {
    try {
        const response = await fetch('https://api-reserva-lab.vercel.app/time/brazilia');
        if (!response.ok) {
            throw new Error('Failed to fetch current time');
        }
        const data = await response.json();
        return data.datetime; // A resposta pode ser algo como { datetime: '2024-11-18T21:30:35' }
    } catch (error) {
        console.error('Error fetching current time:', error);
        return new Date().toISOString(); // Se falhar, usa a data/hora atual local
    }
}

function renderFixedTimeTable(expandedReservations, selectedDate, currentDateTime) {
    const tableContainer = document.getElementById('unavailableTimesTable');
    const startHour = 7;
    const endHour = 22;

    const timeSlots = Array.from({ length: endHour - startHour }, (_, i) => {
        const hour = startHour + i;
        return {
            start: `${hour}:00`,
            end: `${hour + 1}:00`
        };
    });

    const currentDate = new Date(currentDateTime);
    const currentHour = currentDate.getHours();
    const currentDateString = currentDate.toISOString().split('T')[0]; // Data no formato YYYY-MM-DD

    // Verifica se a data selecionada é o dia de hoje
    const isToday = selectedDate === currentDateString;

    const tableHTML = `
        <h3 class="texto-mancha text-lg font-bold mb-2">Horários para ${formatDate(selectedDate)}</h3>
        <table class="min-w-full divide-y divide-gray-200 bordas-redondas overflow-hidden">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário de Início</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário de Término</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${timeSlots.map((slot, index) => {
                    // Se for o dia de hoje, só exibe os horários que são no futuro
                    if (isToday) {
                        const slotStartHour = parseInt(slot.start.split(':')[0]);
                        if (slotStartHour < currentHour + 1) {
                            return ''; // Não exibe horários passados
                        }
                    }

                    let statusText = 'Disponível';
                    let statusClass = 'text-green-600 bg-green-200';

                    const reservation = expandedReservations.find(res =>
                        res.date === selectedDate &&
                        res.start === slot.start &&
                        res.end === slot.end
                    );

                    if (reservation) {
                        if (reservation.status === 'pendente') {
                            statusText = 'Pendente de Aprovação';
                            statusClass = 'text-yellow-600 bg-yellow-200';
                        } else if (reservation.status === 'aprovado') {
                            statusText = 'Reservado';
                            statusClass = 'text-red-600 bg-red-200';
                        } else if (reservation.status === 'utilizando') {
                            statusText = 'Em Uso';
                            statusClass = 'text-blue-600 bg-blue-200';
                        }
                    }

                    return `
                        <tr class="${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}">
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${slot.start}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${slot.end}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm ${statusClass}">${statusText}</td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
}

function updateReservedSlots(startTime, endTime) {
    const reservedSlots = [];
    const startHour = parseInt(startTime.split(':')[0]);
    const endHour = parseInt(endTime.split(':')[0]);

    for (let i = startHour; i < endHour; i++) {
        reservedSlots.push({
            start: `${i}:00`,
            end: `${i + 1}:00`
        });
    }

    return reservedSlots;
}

async function updateTable() {
    const dateInput = document.getElementById('date');
    const tableContainer = document.getElementById('unavailableTimesTable');
    const selectedDate = dateInput.value;

    if (selectedDate) {
        tableContainer.innerHTML = '<p class="texto-mancha font-bold">Carregando horários...</p>';

        try {
            let currentTime = await fetchCurrentTime(); // Busca o horário atual da API

            // Ajusta a data se for após as 21:00
            const currentDate = new Date(currentTime);
            if (currentDate.getHours() >= 21) {
                const yesterday = new Date(currentDate);
                yesterday.setDate(yesterday.getDate() - 1); // Subtrai um dia
                currentTime = yesterday.toISOString(); // Define o horário como o de ontem
            }

            fetchUnavailableTimes(currentLabName)
                .then(unavailableTimes => {
                    const expandedReservations = unavailableTimes.flatMap(res => {
                        const startHour = parseInt(res.time.split(':')[0]);
                        const endHour = parseInt(res.time_fim.split(':')[0]);
                        const slots = [];

                        for (let hour = startHour; hour < endHour; hour++) {
                            slots.push({
                                start: `${hour}:00`,
                                end: `${hour + 1}:00`,
                                status: res.status,
                                date: res.date
                            });
                        }
                        return slots;
                    });

                    renderFixedTimeTable(expandedReservations, selectedDate, currentTime);
                })
                .catch(error => {
                    console.error('Erro ao carregar horários:', error);
                    tableContainer.innerHTML = '<p class="texto-mancha font-bold">Erro ao carregar horários. Por favor, tente novamente.</p>';
                });
        } catch (error) {
            console.error('Erro ao buscar a hora atual:', error);
            tableContainer.innerHTML = '<p class="texto-mancha font-bold">Erro ao obter hora atual. Por favor, tente novamente.</p>';
        }
    } else {
        tableContainer.innerHTML = '<p class="texto-mancha font-bold">Por favor, selecione uma data para ver os horários disponíveis.</p>';
    }
}

//formata a data (YYYY-MM-DD pra DD/MM/YYYY)
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}