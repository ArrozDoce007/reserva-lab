document.addEventListener('DOMContentLoaded', function () {
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

    let activeSection = 'RESERVAR';

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

    function renderNotifications(notifications) {
        if (notifications.length > 0) {
            notificationsList.innerHTML = notifications.map(notification => `
                <div class="mb-2 pb-2 border-b border-gray-200 last:border-b-0">
                    <p class="text-sm font-medium">${notification.message}</p>
                    <p class="text-xs text-gray-500">${new Date(notification.created_at).toLocaleString()}</p>
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

    function renderContent() {
        const userType = localStorage.getItem('userType');
        let content = '';

        // Mostrar ou esconder o botão "PEDIDOS" com base no tipo de usuário
        const pedidosButton = document.getElementById('btn-pedidos');
        if (pedidosButton) {
            pedidosButton.style.display = userType === 'adm' ? 'inline-block' : 'none';
        }

        // Ajustar o layout dos botões
        navMenu.classList.toggle('space-x-10', pedidosButton.style.display === 'none');
        navMenu.classList.toggle('space-x-4', pedidosButton.style.display !== 'none');
        navMenu.classList.toggle('md:space-x-8', pedidosButton.style.display !== 'none');

        switch (activeSection) {
            case 'RESERVAR':
                content = `
                    <h1 class="text-2xl font-bold mb-6">Reserva do Laboratório de Informática</h1>
        
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onclick="showReservationForm('Laboratório I')">
                            <img src="./img/labs 2.jpg" alt="Laboratório I" class="w-full h-60 object-cover mb-4 rounded">
                            <h2 class="text-xl font-bold text-center">Laboratório I</h2>
                            <p class="block text-gray-700 font-bold mb-2 text-center">42 lugares</p>
                            <p class="block text-gray-700 text-sm font-semibold mb-2 text-center">Ideal para aulas da area de inforfmática e afins</p>
                        </div>
                        <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onclick="showReservationForm('Laboratório II')">
                            <img src="./img/labs 2.jpg" alt="Laboratório II" class="w-full h-60 object-cover mb-4 rounded">
                            <h2 class="text-xl font-bold text-center">Laboratório II</h2>
                            <p class="block text-gray-700 font-bold mb-2 text-center">42 lugares</p>
                            <p class="block text-gray-700 text-sm font-semibold mb-2 text-center">Ideal para aulas da area de inforfmática e afins</p>
                        </div>
                        <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onclick="showReservationForm('Laboratório III')">
                            <img src="./img/labs.jpg" alt="Laboratório III" class="w-full h-60 object-cover mb-4 rounded">
                            <h2 class="text-xl font-bold text-center">Laboratório III</h2>
                            <p class="block text-gray-700 font-bold mb-2 text-center">24 lugares</p>
                            <p class="block text-gray-700 text-sm font-semibold mb-2 text-center">Ideal para consultas web, criacao de documentos e aulas não relacionadas a TI</p>
                        </div>
                        <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onclick="showReservationForm('Laboratório IV')">
                            <img src="./img/labs.jpg" alt="Laboratório IV" class="w-full h-60 object-cover mb-4 rounded">
                            <h2 class="text-xl font-bold text-center">Laboratório IV</h2>
                            <p class="block text-gray-700 font-bold mb-2 text-center">24 lugares</p>
                            <p class="block text-gray-700 text-sm font-semibold mb-2 text-center">Ideal para consultas web, criacao de documentos e aulas não relacionadas a TI</p>
                        </div>
                    </div>
        
                    <div id="reservationForm" class="hidden mt-8">
                        <h2 class="text-xl font-semibold mb-4">Reservar <span id="labName"></span></h2>
                        <div id="unavailableTimesTable" class="mt-4 mb-4"></div>
                        <form id="labReservationForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="date">
                                    Data
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="date" type="date" required>
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="time">
                                    Horário de Início
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time" type="time" required>
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="time_fim">
                                    Horário de Término
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="time_fim" type="time" required>
                            </div>
                            <div class="mb-4">
                                <label class="block text-gray-700 text-sm font-bold mb-2" for="purpose">
                                    Finalidade
                                </label>
                                <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="purpose" type="text" placeholder="Ex: Aula de Programação" required>
                            </div>
                            <div class="flex items-center justify-between">
                                <button id="reserveButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out" type="submit">
                                    Reservar
                                </button>
                            </div>
                        </form>
                        </div> 
                    </div>
        
                    <div id="confirmationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                            <div class="mt-3 text-center">
                                <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                    </svg>
                                </div>
                                <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5" id="modalTitle">Reserva Solicitada</h3>
                                <div class="mt-2 px-7 py-3">
                                    <p class="text-sm text-gray-500" id="modalMessage">
                                        Sua reserva foi solicitada com sucesso!
                                    </p>
                                </div>
                                <div class="items-center px-4 py-3">
                                    <button id="closeModal" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300">
                                        OK
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'SOLICITAÇÕES':
                content = `
                    <h1 class="text-2xl font-bold mb-6">Solicitações de Reserva</h1>
                    <div class="mb-4 centralizar">
                        <label for="statusFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrar por Status</label>
                        <select id="statusFilter" class="p-2 border rounded">
                            <option value="todos">Todos</option>
                            <option value="pendente">Pendente</option>
                            <option value="aprovado">Aprovado</option>
                            <option value="rejeitado">Rejeitado</option>
                            <option value="cancelado">Cancelado</option>
                        </select>
                    </div>
                    <div id="requestsList" class="bg-white rounded-lg shadow p-6">
                        <p class="text-center text-gray-500">Carregando solicitações...</p>
                    </div>

                    <div id="cancelConfirmationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                        <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
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
                                    <button id="confirmCancel" class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2">
                                        Confirmar Cancelamento
                                    </button>
                                    <button id="cancelCancelation" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                        Voltar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'PEDIDOS':
                if (userType === 'adm') {
                    content = `
                        <h1 class="text-2xl font-bold mb-6">Pedidos de Reserva</h1>
                        <div class="mb-4 centralizar">
                            <label for="statusFilter" class="block text-gray-700 text-sm font-bold mb-2">Filtrar por Status</label>
                            <select id="statusFilter" class="p-2 border rounded">
                                <option value="todos">Todos</option>
                                <option value="pendente">Pendente</option>
                                <option value="aprovado">Aprovado</option>
                            </select>
                        </div>
                        <div id="requestsList" class="bg-white rounded-lg shadow p-6">
                            <p class="text-center text-gray-500">Carregando pedidos...</p>
                        </div>
                        
                        <div id="cancelConfirmationModal_ADM" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
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
                                        <button id="confirmCancel_ADM" class="px-4 py-2 bg-red-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 mb-2">
                                            Confirmar Cancelamento
                                        </button>
                                        <button id="cancelCancelation_ADM" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">
                                            Voltar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div id="confirmationModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full hidden">
                            <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                                <div class="mt-3 text-center">
                                    <div id="modalIcon" class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                        <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                    <h3 class="text-lg leading-6 font-medium text-gray-900 mt-5" id="modalTitle">Confirmar Ação</h3>
                                    <div class="mt-2 px-7 py-3">
                                        <p class="text-sm text-gray-500" id="modalMessage"></p>
                                    </div>
                                    <div class="items-center px-4 py-3">
                                        <button id="confirmAction" class="px-4 py-2 bg-green-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-green-600 focus:outline-none mb-2">
                                            Confirmar
                                        </button>
                                        <button id="cancelAction" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none">
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                break;
        }

        mainContent.innerHTML = content;

        if (activeSection === 'RESERVAR') {
            setupReservationForm();
        } else if (activeSection === 'SOLICITAÇÕES') {
            fetchAndRenderRequests();
        } else if (activeSection === 'PEDIDOS' && userType === 'adm') {
            fetchAndRenderPedidos();
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
                    button.classList.remove('text-blue-600', 'border-b-2', 'border-blue-600', 'pb-2');
                    button.classList.add('text-gray-500', 'hover:text-blue-600');
                });
                clickedButton.classList.remove('text-gray-500', 'hover:text-blue-600');
                clickedButton.classList.add('text-blue-600', 'border-b-2', 'border-blue-600', 'pb-2');
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

    setInterval(updateNotifications, 3000);

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

        if (userName && userMatricula) {
            document.getElementById('user-name').textContent = userName;
            document.getElementById('user-matricula').textContent = `Matrícula: ${userMatricula}`;
            loginButton.classList.add('hidden');
            logoutButton.classList.remove('hidden');
        } else {
            loginButton.classList.remove('hidden');
            logoutButton.classList.add('hidden');
        }
    }

    updateUserProfile();

    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('userName');
        localStorage.removeItem('userMatricula');
        localStorage.removeItem('userType');
        window.location.href = '../index.html';
    });

    loginButton.addEventListener('click', function () {
        window.location.href = '../index.html';
    });

    function setupReservationForm() {
        const form = document.getElementById('labReservationForm');
        const modal = document.getElementById('confirmationModal');
        const closeModalButton = document.getElementById('closeModal');
        const reserveButton = document.getElementById('reserveButton');
        const reservationFormContainer = document.getElementById('reservationForm');
        const dateInput = document.getElementById('date');
        const timeInput = document.getElementById('time');
        const timeFimInput = document.getElementById('time_fim');

        dateInput.dispatchEvent(new Event('change'));
        // Função para buscar a data e hora de Brasília de uma API
        async function fetchBrasiliaTime() {
            try {
                const response = await fetch('https://api-reserva-lab.vercel.app/time/brazilia');
                const data = await response.json();
                const currentDateTime = new Date(data.datetime); // Data e hora atual de Brasília
                const today = currentDateTime.toISOString().split('T')[0]; // Formata a data como YYYY-MM-DD
                const currentTime = currentDateTime.toTimeString().split(' ')[0].substring(0, 5); // Formata o horário como HH:MM

                dateInput.min = today;
                timeInput.min = currentTime; // Define a hora mínima para o horário de início
                timeFimInput.min = currentTime; // Define a hora mínima para o horário de término

                // Remove o valor predefinido dos campos de horário
                timeInput.value = '';
                timeFimInput.value = '';

                // Adiciona event listeners para atualizar o horário de término e validar
                dateInput.addEventListener('change', updateDate);
                timeInput.addEventListener('change', updateTimeFimMin);
                timeFimInput.addEventListener('change', validateTimeFim);

            } catch (error) {
                console.error('Erro ao buscar a hora de Brasília:', error);
                alert('Erro ao obter a data e hora atual. Por favor, tente novamente mais tarde.');
            }
        }

        // Função para atualizar o valor mínimo do horário de término baseado na data e no horário de início
        function updateTimeFimMin() {
            const startTime = timeInput.value;
            const selectedDate = dateInput.value;
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
            const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // Hora atual no formato HH:MM

            if (selectedDate === currentDate) {
                timeInput.min = currentTime;
            } else {
                timeInput.min = '00:00'; // Se a data for futura, permite qualquer hora
            }

            if (startTime) {
                timeFimInput.min = startTime;
            }

            // Valida o horário de término quando o horário de início é alterado
            validateTimeFim();
        }

        // Função para validar o horário de término
        function validateTimeFim() {
            const startTime = timeInput.value;
            const endTime = timeFimInput.value;
            const selectedDate = dateInput.value;

            if (startTime && endTime) {
                // Converte os horários para objetos Date para facilitar a comparação
                const start = new Date(`${selectedDate}T${startTime}:00-03:00`); // Para horário de Brasília
                const end = new Date(`${selectedDate}T${endTime}:00-03:00`);

                // Calcula a diferença em horas
                const timeDifference = (end - start) / (1000 * 60 * 60);

                if (end < start) {
                    alert('O horário de término não pode ser anterior ao horário de início.');
                    const newEndTime = new Date(start.getTime() + (60 * 60 * 1000));
                    timeFimInput.value = newEndTime.toTimeString().split(' ')[0].substring(0, 5);
                } else if (timeDifference < 1) {
                    alert('A duração mínima da reserva deve ser de 1 hora.');
                    // Define o horário de término para 1 hora após o horário de início
                    const newEndTime = new Date(start.getTime() + (60 * 60 * 1000));
                    timeFimInput.value = newEndTime.toTimeString().split(' ')[0].substring(0, 5);
                }
            }
        }

        // Função para validar se a hora de início
        function validateStartTime() {
            const startTime = timeInput.value;
            const minTime = "06:59";
            const maxTime = "23:00";

            if (startTime < minTime) {
                alert('O horário de início não pode ser anterior a 07:00.');
                timeInput.value = ''; // Limpa o campo de hora de início
            } else if (startTime > maxTime) {
                alert('O horário de início não pode ser após 23:00.');
                timeInput.value = ''; // Limpa o campo de hora de início
            }
        }

        // Adiciona um listener para o campo de hora de início
        timeInput.addEventListener('change', function () {
            validateStartTime();
        });

        // Função para atualizar a hora mínima com base na data selecionada
        function updateDate() {
            const selectedDate = dateInput.value;
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0]; // Data atual no formato YYYY-MM-DD
            const currentTime = now.toTimeString().split(' ')[0].substring(0, 5); // Hora atual no formato HH:MM

            if (selectedDate === currentDate) {
                timeInput.min = currentTime;
            } else {
                timeInput.min = '00:00'; // Se a data for futura, permite qualquer hora
            }

            // Atualiza a hora mínima do campo de término quando a data é alterada
            updateTimeFimMin();
        }

        // Chama a função para buscar a data e hora de Brasília
        fetchBrasiliaTime();

        // Adiciona um listener para o botão de fechar o modal
        closeModalButton.addEventListener('click', function () {
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'items-center', 'justify-center');
            form.reset();
            reserveButton.textContent = 'Reservar';
            reserveButton.classList.remove('bg-green-500');
            reserveButton.classList.add('bg-blue-500');

            // Esconde o formulário de reserva
            reservationFormContainer.classList.add('hidden');

            // Volta ao topo da página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const userName = localStorage.getItem('userName');
            const userMatricula = localStorage.getItem('userMatricula');

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

            // Check if the selected time slot is available
            const unavailableTimes = await fetchUnavailableTimes(labName);
            const isTimeSlotAvailable = checkTimeSlotAvailability(unavailableTimes, date, time, timeFim);

            if (!isTimeSlotAvailable) {
                alert('O horário selecionado não está disponível. Por favor, escolha outro horário.');
                return;
            }

            const data = {
                labName,
                date,
                time,
                time_fim: timeFim,
                purpose,
                userName,
                userMatricula
            };

            // Inicia a animação de processamento
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
                    reserveButton.classList.add('bg-green-500');

                    // Mostra o modal de confirmação com um pequeno atraso
                    setTimeout(() => {
                        modal.classList.remove('hidden');
                        modal.classList.add('flex', 'items-center', 'justify-center');
                    }, 500);
                }
            }, 200);

            // Envia os dados para o backend
            try {
                const response = await fetch("https://api-reserva-lab.vercel.app/reserve", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    // Se a resposta foi bem-sucedida
                    reserveButton.textContent = 'Reservado com sucesso!';
                    reserveButton.classList.add('bg-green-500');
                } else {
                    // Se a resposta não foi bem-sucedida, tenta obter a mensagem de erro
                    const result = await response.json();
                    const errorMessage = result.error || "Erro ao processar a reserva.";
                    alert(errorMessage);

                    // Restora o estado do botão
                    reserveButton.textContent = 'Reservar';
                    reserveButton.classList.remove('bg-green-500');
                    reserveButton.classList.add('bg-blue-500');
                }
            } catch (error) {
                console.error("Erro ao enviar a reserva:", error);
                alert("Erro ao processar a reserva.");

                // Restora o estado do botão
                reserveButton.textContent = 'Reservar';
                reserveButton.classList.remove('bg-green-500');
                reserveButton.classList.add('bg-blue-500');
            }
        });

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

        document.addEventListener('DOMContentLoaded', function () {
            setupReservationForm();
        });
    }

    function fetchAndRenderRequests() {
        const requestsList = document.getElementById('requestsList');
        const userMatricula = localStorage.getItem('userMatricula');
        const statusFilter = document.getElementById('statusFilter');

        if (!userMatricula) {
            requestsList.innerHTML = '<p class="text-center text-gray-500">Por favor, faça o login para ver suas solicitações.</p>';
            return;
        }

        requestsList.innerHTML = '<p class="text-center text-gray-500">Carregando solicitações...</p>';

        fetch('https://api-reserva-lab.vercel.app/reserve/status')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar as solicitações');
                }
                return response.json();
            })
            .then(requests => {
                let userRequests = requests.filter(request => request.user_matricula === userMatricula);

                statusFilter.addEventListener('change', function () {
                    const selectedStatus = this.value;
                    renderFilteredRequests(userRequests, selectedStatus);
                });

                renderFilteredRequests(userRequests, 'todos');
            })
            .catch(error => {
                console.error(error);
                requestsList.innerHTML = '<p class="text-center text-red-500">Erro ao carregar as solicitações.</p>';
            });
    }

    async function renderFilteredRequests(requests, status) {
        const requestsList = document.getElementById('requestsList');
        let filteredRequests = requests;

        // Obter a hora atual de Brasília
        let currentDateTime;
        try {
            const response = await fetch('https://api-reserva-lab.vercel.app/time/brazilia');
            const data = await response.json();
            currentDateTime = new Date(data.datetime); // Data e hora atual de Brasília
        } catch (error) {
            console.error('Erro ao buscar a hora de Brasília:', error);
            alert('Erro ao obter a data e hora atual. Por favor, tente novamente mais tarde.');
            return; // Parar a execução caso haja erro
        }

        if (status !== 'todos') {
            filteredRequests = requests.filter(request => request.status === status);
        }

        if (filteredRequests.length === 0) {
            requestsList.innerHTML = '<p class="text-center text-gray-500">Nenhuma solicitação encontrada.</p>';
        } else {
            // Ajustando a ordem para que 'pendente' tenha maior prioridade
            filteredRequests.sort((a, b) => {
                const statusOrder = { 'pendente': 1, 'aprovado': 2, 'rejeitado': 3, 'cancelado': 4 };
                return statusOrder[a.status] - statusOrder[b.status] || b.id - a.id;
            });

            const requestsHTML = filteredRequests.map(request => {
                // Função para verificar se o botão "Cancelar" deve estar invisível
                function shouldHideCancel(requestDate, requestTime, requestStatus) {
                    const requestStartTime = new Date(`${requestDate}T${requestTime}`); // Combina data e hora do pedido
                    const timeDifference = (requestStartTime - currentDateTime) / (1000 * 60); // Diferença em minutos
                    return requestStatus === 'aprovado' && timeDifference <= 60; // Só esconder se status for 'aprovado' e faltar 1h ou menos
                }

                return `
                    <div class="bg-white shadow-md rounded-lg p-4 mb-4">
                        <h3 class="font-bold text-lg mb-2">${request.lab_name}</h3>
                        <p class="text-sm text-gray-600">Solicitação: ${request.id}</p>
                        <p class="text-sm text-gray-600">Data: ${formatDate(request.date)}</p>
                        <p class="text-sm text-gray-600">Horário de Início: ${request.time}</p>
                        <p class="text-sm text-gray-600">Horário de Término: ${request.time_fim}</p>
                        <p class="text-sm text-gray-600">Finalidade: ${request.purpose}</p>
                        <p class="text-sm font-semibold mt-2 ${getStatusColor(request.status)}">${request.status}</p>
                        ${(request.status === 'pendente' || (request.status === 'aprovado' && !shouldHideCancel(request.date, request.time, request.status))) ?
                        `<button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm cancel-request" data-id="${request.id}">
                            Cancelar Solicitação
                        </button>` : ''}
                    </div>`;
            }).join('');

            requestsList.innerHTML = requestsHTML;

            document.querySelectorAll('.cancel-request').forEach(button => {
                button.addEventListener('click', function () {
                    const requestId = this.getAttribute('data-id');
                    showCancelConfirmation(requestId);
                });
            });
        }
    }

    document.getElementById('statusFilter').addEventListener('change', fetchAndRenderRequests);

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
                return 'text-gray-600';
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

        // Inicia a animação e altera o texto do botão de confirmação
        confirmButton.classList.add('animate-pulse');
        confirmButton.textContent = 'Processando...';
        confirmButton.classList.remove('bg-red-500');
        confirmButton.classList.add('bg-gray-500');

        fetch(`https://api-reserva-lab.vercel.app/reserve/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'cancelado' // Define o status como 'cancelado'
            })
        })
            .then(response => {
                console.log('Resposta recebida:', response);
                if (!response.ok) {
                    return response.json().then(errData => {
                        console.error('Erro no corpo da resposta:', errData);
                        throw new Error(`Erro ${response.status}: ${errData.error || 'Falha ao cancelar a reserva'}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Resposta do servidor:', data);
                confirmButton.classList.remove('animate-pulse');
                confirmButton.textContent = 'Solicitação Cancelada';
                confirmButton.classList.add('bg-red-500');

                // Fecha o modal e atualiza a lista de solicitações após um atraso
                setTimeout(() => {
                    closeModalAndResetButton();
                    fetchAndRenderRequests();
                }, 1500);
            })
            .catch(error => {
                console.error('Erro:', error);
                confirmButton.classList.remove('animate-pulse');
                confirmButton.textContent = 'Erro ao Cancelar';
                confirmButton.classList.add('bg-red-500');

                // Fecha o modal após um atraso
                setTimeout(() => {
                    closeModalAndResetButton();
                }, 1500);
            });

        // Função para fechar o modal e resetar o botão
        function closeModalAndResetButton() {
            modal.classList.add('hidden');
            modal.classList.remove('flex', 'items-center', 'justify-center');
            confirmButton.classList.remove('bg-red-500', 'bg-red-500');
            confirmButton.classList.add('bg-red-500'); // Adiciona uma cor padrão
            confirmButton.textContent = 'Confirmar Cancelamento';
        }
    }

    function fetchAndRenderPedidos() {
        const requestsList = document.getElementById('requestsList');
        const statusFilter = document.getElementById('statusFilter');

        requestsList.innerHTML = '<p class="text-center text-gray-500">Carregando pedidos...</p>';

        fetch('https://api-reserva-lab.vercel.app/reserve/status/geral')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar as solicitações');
                }
                return response.json();
            })
            .then(requests => {
                // Filtrar apenas as solicitações com status 'pendente' ou 'aprovado'
                const filteredRequests = requests.filter(request =>
                    request.status === 'pendente' || request.status === 'aprovado'
                );

                statusFilter.addEventListener('change', function () {
                    const selectedStatus = this.value;
                    renderFilteredPedidos(filteredRequests, selectedStatus);
                });

                renderFilteredPedidos(filteredRequests, 'todos');
            })
            .catch(error => {
                console.error('Erro:', error);
                requestsList.innerHTML = '<p class="text-center text-red-500">Erro ao carregar os pedidos.</p>';
            });
    }

    async function renderFilteredPedidos(requests, status) {
        const requestsList = document.getElementById('requestsList');
        let filteredRequests = requests;

        // Obter a hora atual de Brasília
        let currentDateTime;
        try {
            const response = await fetch('https://api-reserva-lab.vercel.app/time/brazilia');
            const data = await response.json();
            currentDateTime = new Date(data.datetime); // Data e hora atual de Brasília
        } catch (error) {
            console.error('Erro ao buscar a hora de Brasília:', error);
            alert('Erro ao obter a data e hora atual. Por favor, tente novamente mais tarde.');
            return; // Parar a execução caso haja erro
        }

        // Filtrar os pedidos pelo status, exceto se for 'todos'
        if (status !== 'todos') {
            filteredRequests = requests.filter(request => request.status === status);
        }

        // Se não houver pedidos filtrados, exibir uma mensagem
        if (filteredRequests.length === 0) {
            requestsList.innerHTML = '<p class="text-center text-gray-500">Nenhum pedido encontrado.</p>';
        } else {
            // Ordenar os pedidos com base no status e depois pelo ID
            filteredRequests.sort((a, b) => {
                const statusOrder = ['pendente', 'aprovado'];
                const statusA = statusOrder.indexOf(a.status);
                const statusB = statusOrder.indexOf(b.status);

                if (statusA !== statusB) {
                    return statusA - statusB; // Ordenar pela prioridade de status
                }

                // Se os status forem iguais, ordenar por ID decrescente
                return b.id - a.id;
            });

            // Gerar o HTML dos pedidos filtrados
            const requestsHTML = filteredRequests.map(request => {
                let actionButtons = '';

                // Função para verificar se o botão "Cancelar" deve estar invisível
                function shouldHideCancel(requestDate, requestTime) {
                    const requestStartTime = new Date(`${requestDate}T${requestTime}`); // Combina data e hora do pedido
                    const timeDifference = (requestStartTime - currentDateTime) / (1000 * 60); // Diferença em minutos
                    return timeDifference < 60; // Esconde o botão
                }

                // Exibir botões de ação dependendo do status
                if (request.status === 'pendente') {
                    actionButtons = `
                        <button class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm approve-request" data-id="${request.id}">
                            Aprovar
                        </button>
                        <button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm reject-request" data-id="${request.id}">
                            Rejeitar
                        </button>
                    `;
                } else if (request.status === 'aprovado') {
                    // Verifica se o botão de cancelar deve ser oculto
                    if (!shouldHideCancel(request.date, request.time)) {
                        actionButtons = `
                            <button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm cancel-request_ADM" data-id="${request.id}">
                                Cancelar
                            </button>
                        `;
                    }
                }

                return `
                    <div class="bg-white shadow-md rounded-lg p-4 mb-4">
                        <h3 class="font-bold text-lg mb-2">${request.lab_name}</h3>
                        <p class="text-sm text-gray-600">Solicitação: ${request.id}</p>
                        <p class="text-sm text-gray-600">Solicitante: ${request.nome}</p>
                        <p class="text-sm text-gray-600">Matrícula: ${request.matricula}</p>
                        <p class="text-sm text-gray-600">Data: ${formatDate(request.date)}</p>
                        <p class="text-sm text-gray-600">Horário de Início: ${request.time}</p>
                        <p class="text-sm text-gray-600">Horário de Término: ${request.time_fim}</p>
                        <p class="text-sm text-gray-600">Finalidade: ${request.purpose}</p>
                        <p class="text-sm font-semibold mt-2 ${getStatusColor(request.status)}">${request.status}</p>
                        ${actionButtons}
                    </div>
                `;
            }).join('');

            // Renderizar os pedidos na página
            requestsList.innerHTML = requestsHTML;

            // Adicionar eventos aos botões de aprovação e rejeição
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

            // Adicionar eventos ao botão de cancelar apenas para status 'aprovado'
            document.querySelectorAll('.cancel-request_ADM').forEach(button => {
                button.addEventListener('click', function () {
                    const requestId = this.getAttribute('data-id');
                    showCancelConfirmation_ADM(requestId);
                });
            });
        }
    }

    function showCancelConfirmation_ADM(requestId) {
        const modal_ADM = document.getElementById('cancelConfirmationModal_ADM');
        const confirmButton_ADM = document.getElementById('confirmCancel_ADM');
        const cancelButton_ADM = document.getElementById('cancelCancelation_ADM');

        modal_ADM.classList.remove('hidden');
        modal_ADM.classList.add('flex', 'items-center', 'justify-center');

        confirmButton_ADM.onclick = function () {
            cancelRequest_ADM(requestId);
        };

        cancelButton_ADM.onclick = function () {
            modal_ADM.classList.add('hidden');
            modal_ADM.classList.remove('flex', 'items-center', 'justify-center');
        };
    }

    function cancelRequest_ADM(requestId) {
        const modal_ADM = document.getElementById('cancelConfirmationModal_ADM');
        const confirmButton_ADM = document.getElementById('confirmCancel_ADM');

        // Inicia a animação e altera o texto do botão de confirmação
        confirmButton_ADM.classList.add('animate-pulse');
        confirmButton_ADM.textContent = 'Processando...';
        confirmButton_ADM.classList.remove('bg-red-500');
        confirmButton_ADM.classList.add('bg-gray-500');

        fetch(`https://api-reserva-lab.vercel.app/reserve/${requestId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'cancelado' // Define o status como 'cancelado'
            })
        })
            .then(response => {
                console.log('Resposta recebida:', response);
                if (!response.ok) {
                    return response.json().then(errData => {
                        console.error('Erro no corpo da resposta:', errData);
                        throw new Error(`Erro ${response.status}: ${errData.error || 'Falha ao cancelar a reserva'}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log('Resposta do servidor:', data);
                confirmButton_ADM.classList.remove('animate-pulse');
                confirmButton_ADM.textContent = 'Solicitação Cancelada';
                confirmButton_ADM.classList.add('bg-red-500');

                // Fecha o modal e atualiza a lista de solicitações após um atraso
                setTimeout(() => {
                    closeModalAndResetButton_ADM();
                    fetchAndRenderPedidos();
                }, 1500);
            })
            .catch(error => {
                console.error('Erro:', error);
                confirmButton_ADM.classList.remove('animate-pulse');
                confirmButton_ADM.textContent = 'Erro ao Cancelar';
                confirmButton_ADM.classList.add('bg-red-500');

                // Fecha o modal após um atraso
                setTimeout(() => {
                    closeModalAndResetButton_ADM();
                }, 1500);
            });

        // Função para fechar o modal e resetar o botão
        function closeModalAndResetButton_ADM() {
            modal_ADM.classList.add('hidden');
            modal_ADM.classList.remove('flex', 'items-center', 'justify-center');
            confirmButton_ADM.classList.remove('bg-red-500', 'bg-red-500');
            confirmButton_ADM.classList.add('bg-red-500');
            confirmButton_ADM.textContent = 'Confirmar Cancelamento';
        }
    }

    function showConfirmationModal(action, pedidoId) {
        const modal = document.getElementById('confirmationModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalMessage = document.getElementById('modalMessage');
        const modalIcon = document.getElementById('modalIcon');
        const confirmButton = document.getElementById('confirmAction');
        const cancelButton = document.getElementById('cancelAction');

        modalTitle.textContent = `Confirmar ${action.charAt(0).toUpperCase() + action.slice(1)}`;
        modalMessage.textContent = `Tem certeza que deseja ${action} este pedido?`;

        if (action === 'aprovar') {
            modalIcon.innerHTML = `
                <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`;
            modalIcon.classList.remove('bg-red-100');
            modalIcon.classList.add('bg-green-100');
            confirmButton.classList.remove('bg-red-500', 'hover:bg-red-600');
            confirmButton.classList.add('bg-green-500', 'hover:bg-green-600');
        } else {
            modalIcon.innerHTML = `
                <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>`;
            modalIcon.classList.remove('bg-green-100');
            modalIcon.classList.add('bg-red-100');
            confirmButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            confirmButton.classList.add('bg-red-500', 'hover:bg-red-600');
        }

        modal.classList.remove('hidden');
        modal.classList.add('flex', 'items-center', 'justify-center');

        confirmButton.onclick = () => {
            if (action === 'aprovar') {
                approvePedido(pedidoId).then(() => {
                    fetchAndRenderPedidos(); // Chamar a função após a confirmação
                });
            } else {
                rejectPedido(pedidoId).then(() => {
                    fetchAndRenderPedidos(); // Chamar a função após a confirmação
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
        return fetch(`https://api-reserva-lab.vercel.app/reserve/pedido/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'aprovado' })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao aprovar o pedido');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Pedido ${pedidoId} aprovado!`);
                addNotification(`Pedido ${pedidoId} foi aprovado.`);
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    function rejectPedido(pedidoId) {
        return fetch(`https://api-reserva-lab.vercel.app/reserve/pedido/${pedidoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'rejeitado' })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao rejeitar o pedido');
                }
                return response.json();
            })
            .then(data => {
                console.log(`Pedido ${pedidoId} rejeitado!`);
                addNotification(`Pedido ${pedidoId} foi rejeitado.`);
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
        tableContainer.innerHTML = '<p class="text-gray-600 font-semibold">Selecione uma data para ver os horários indisponíveis.</p>';
    }

    // Atualiza o nome do laboratório atual
    currentLabName = labName;

    // Remove o listener de evento anterior antes de adicionar um novo
    dateInput.removeEventListener('change', updateTable);
    dateInput.addEventListener('change', updateTable);

    form.scrollIntoView({ behavior: 'smooth' });
}

async function fetchUnavailableTimes(labName) {
    try {
        const response = await fetch(`https://api-reserva-lab.vercel.app/reserve/status/geral`);
        if (!response.ok) {
            throw new Error('Failed to fetch reservations');
        }
        const reservations = await response.json();
        return reservations.filter(reservation =>
            reservation.lab_name === labName &&
            (reservation.status === 'aprovado' || reservation.status === 'pendente')
        );
    } catch (error) {
        console.error('Error fetching unavailable times:', error);
        return [];
    }
}

function updateTable() {
    const dateInput = document.getElementById('date');
    const tableContainer = document.getElementById('unavailableTimesTable');
    const selectedDate = dateInput.value;

    if (selectedDate) {
        tableContainer.innerHTML = '<p class="text-gray-600 font-semibold">Carregando horários indisponíveis...</p>';

        // Cancel any ongoing fetch
        if (currentFetchPromise) {
            currentFetchPromise.cancel();
        }

        // Create a new promise with cancellation capability
        currentFetchPromise = {
            promise: fetchUnavailableTimes(currentLabName),
            cancel: () => { } // This will be overwritten if needed
        };

        currentFetchPromise.promise
            .then(unavailableTimes => {
                // Check if this is still the current request
                if (currentFetchPromise.promise === currentFetchPromise.promise) {
                    renderUnavailableTimesTable(unavailableTimes, selectedDate);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                tableContainer.innerHTML = '<p class="text-red-600 font-semibold">Erro ao carregar horários indisponíveis. Por favor, tente novamente.</p>';
            });
    } else {
        tableContainer.innerHTML = '<p class="text-yellow-600 font-semibold">Por favor, selecione uma data para ver os horários indisponíveis.</p>';
    }
}

function renderUnavailableTimesTable(unavailableTimes, selectedDate) {
    const tableContainer = document.getElementById('unavailableTimesTable');

    // Filter unavailable times for the selected date
    const filteredTimes = unavailableTimes.filter(time => time.date === selectedDate);

    if (filteredTimes.length === 0) {
        tableContainer.innerHTML = '<p class="text-green-600 font-semibold">Todos os horários estão disponíveis para a data selecionada.</p>';
        return;
    }

    const tableHTML = `
        <h3 class="text-lg font-semibold mb-2">Horários já reservados para ${formatDate(selectedDate)}</h3>
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário de Início</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário de Término</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                ${filteredTimes.map((reservation, index) => `
                    <tr class="${index % 1 === 0 ? 'bg-white' : 'bg-white'}">
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${reservation.time}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${reservation.time_fim}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm ${reservation.status === 'aprovado' ? 'text-green-600 bg-green-200' : 'text-yellow-600 bg-yellow-200'}">${reservation.status}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
}

// Helper function to format date (YYYY-MM-DD to DD/MM/YYYY)
function formatDate(dateString) {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}
