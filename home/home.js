document.addEventListener('DOMContentLoaded', function () {
    const navMenu = document.getElementById('nav-menu');
    const mainContent = document.getElementById('main-content');
    const navButtons = document.querySelectorAll('.nav-button');
    const profileButton = document.getElementById('profile-button');
    const profileMenu = document.getElementById('profile-menu');
    const logoutButton = document.getElementById('logout-button');
    const loginButton = document.getElementById('login-button');

    let activeSection = 'RESERVAR';

    function renderContent() {
        const userType = localStorage.getItem('userType'); // Assume que o tipo de usuário é armazenado no localStorage
        let content = '';

        // Mostrar ou esconder o botão "PEDIDOS" com base no tipo de usuário
        const pedidosButton = document.getElementById('btn-pedidos');
        const navMenu = document.getElementById('nav-menu');

        if (pedidosButton) {
            if (userType === 'adm') {
                pedidosButton.style.display = 'inline-block'; // Mostra o botão
            } else {
                pedidosButton.style.display = 'none'; // Esconde o botão
            }
        }

        // Ajustar o layout dos botões se o botão "PEDIDOS" estiver oculto
        if (pedidosButton.style.display === 'none') {
            navMenu.classList.add('space-x-14');
            navMenu.classList.remove('space-x-4', 'md:space-x-8');
        } else {
            navMenu.classList.add('space-x-4', 'md:space-x-8');
            navMenu.classList.remove('space-x-6');
        }

        switch (activeSection) {
            case 'RESERVAR':
                content = `
                    <h1 class="text-2xl font-bold mb-6">Reserva do Laboratório de Informática</h1>
        
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onclick="showReservationForm('Laboratório I')">
                            <img src="/placeholder.svg?height=200&width=300" alt="Laboratório I" class="w-full h-40 object-cover mb-4 rounded">
                            <h2 class="text-xl font-semibold text-center">Laboratório I</h2>
                        </div>
                        <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onclick="showReservationForm('Laboratório II')">
                            <img src="/placeholder.svg?height=200&width=300" alt="Laboratório II" class="w-full h-40 object-cover mb-4 rounded">
                            <h2 class="text-xl font-semibold text-center">Laboratório II</h2>
                        </div>
                        <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onclick="showReservationForm('Laboratório III')">
                            <img src="/placeholder.svg?height=200&width=300" alt="Laboratório III" class="w-full h-40 object-cover mb-4 rounded">
                            <h2 class="text-xl font-semibold text-center">Laboratório III</h2>
                        </div>
                        <div class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300" onclick="showReservationForm('Laboratório IV')">
                            <img src="/placeholder.svg?height=200&width=300" alt="Laboratório IV" class="w-full h-40 object-cover mb-4 rounded">
                            <h2 class="text-xl font-semibold text-center">Laboratório IV</h2>
                        </div>
                    </div>
        
                    <div id="reservationForm" class="hidden mt-8">
                        <h2 class="text-xl font-semibold mb-4">Reservar <span id="labName"></span></h2>
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
                        <div id="requestsList" class="bg-white rounded-lg shadow p-6">
                            <p class="text-center text-gray-500">Carregando pedidos...</p>
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
        const section = event.target.getAttribute('data-section');
        if (section) {
            activeSection = section;
            renderContent();
            navButtons.forEach(button => button.classList.remove('border-blue-600', 'text-blue-600'));
            event.target.classList.add('border-blue-600', 'text-blue-600');
        }
    }

    // Inicializa o conteúdo da seção ativa
    renderContent();

    // Adiciona event listeners para os botões de navegação
    navButtons.forEach(button => button.addEventListener('click', handleNavClick));

    // Mostrar/Esconder o menu de perfil ao clicar no botão
    profileButton.addEventListener('click', function () {
        profileMenu.classList.toggle('hidden');
    });

    // Atualiza o perfil do usuário
    const userName = localStorage.getItem('userName');
    const userMatricula = localStorage.getItem('userMatricula');

    if (userName && userMatricula) {
        document.getElementById('user-name').textContent = userName;
        document.getElementById('user-matricula').textContent = `Matrícula: ${userMatricula}`;
        loginButton.classList.add('hidden'); // Oculta o botão de "Entrar"
        logoutButton.classList.remove('hidden'); // Mostra o botão de "Sair"
    } else {
        loginButton.classList.remove('hidden'); // Mostra o botão de "Entrar"
        logoutButton.classList.add('hidden'); // Oculta o botão de "Sair"
    }

    // Adiciona um listener ao botão de sair
    logoutButton.addEventListener('click', function () {
        // Limpa os dados do usuário do localStorage
        localStorage.removeItem('userName');
        localStorage.removeItem('userMatricula');
        // Redireciona para a página de login
        window.location.href = '../login.html'; // Altere para a URL da sua página de login
    });

    loginButton.addEventListener('click', function () {
        window.location.href = '../login.html'; // Altere para a URL da sua página de login
    });

    // Fechar o menu se clicar fora dele
    document.addEventListener('click', function (event) {
        if (!profileButton.contains(event.target) && !profileMenu.contains(event.target)) {
            profileMenu.classList.add('hidden');
        }
    });

    function setupReservationForm() {
        const form = document.getElementById('labReservationForm');
        const modal = document.getElementById('confirmationModal');
        const closeModalButton = document.getElementById('closeModal');
        const reserveButton = document.getElementById('reserveButton');
        const reservationFormContainer = document.getElementById('reservationForm');

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
        });

        form.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Verifica se o usuário está logado
            const userName = localStorage.getItem('userName');
            const userMatricula = localStorage.getItem('userMatricula');

            if (!userName || !userMatricula) {
                // Armazena uma mensagem temporária e redireciona para a página de login
                localStorage.setItem('loginMessage', 'Por favor, faça o login para continuar.');
                window.location.href = '../login.html'; // URL da sua página de login
                return;
            }

            const data = {
                labName: document.getElementById("labName").textContent,
                date: document.getElementById("date").value,
                time: document.getElementById("time").value,
                time_fim: document.getElementById("time_fim").value, // Inclui o horário de término
                purpose: document.getElementById("purpose").value,
                userName: userName,         // Inclui o nome do usuário
                userMatricula: userMatricula // Inclui a matrícula do usuário
            };

            // Start the interactive animation
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
                }
            } catch (error) {
                console.error("Erro ao enviar a reserva:", error);
                alert("Erro ao processar a reserva.");
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        fetchAndRenderRequests();
    });

    function fetchAndRenderRequests() {
        const requestsList = document.getElementById('requestsList');
        const userMatricula = localStorage.getItem('userMatricula');

        if (!userMatricula) {
            requestsList.innerHTML = '<p class="text-center text-gray-500">Por favor, faça o login para ver suas solicitações.</p>';
            return;
        }

        requestsList.innerHTML = '<p class="text-center text-gray-500">Carregando solicitações...</p>'; // Indicador de carregamento

        fetch('https://api-reserva-lab.vercel.app/reserve/status')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar as solicitações');
                }
                return response.json();
            })
            .then(requests => {
                const userRequests = requests.filter(request => request.user_matricula === userMatricula);

                if (userRequests.length === 0) {
                    requestsList.innerHTML = '<p class="text-center text-gray-500">Nenhuma solicitação encontrada.</p>';
                } else {
                    const requestsHTML = userRequests.map(request =>
                        `<div class="bg-white shadow-md rounded-lg p-4 mb-4">
                            <h3 class="font-bold text-lg mb-2">${request.lab_name}</h3>
                            <p class="text-sm text-gray-600">Solicitação: ${request.id}</p>
                            <p class="text-sm text-gray-600">Data: ${formatDate(request.date)}</p>
                            <p class="text-sm text-gray-600">Horário de Inicio: ${request.time}</p>
                            <p class="text-sm text-gray-600">Horário de Termino: ${request.time_fim}</p>
                            <p class="text-sm text-gray-600">Finalidade: ${request.purpose}</p>
                            <p class="text-sm font-semibold mt-2 ${getStatusColor(request.status)}">${request.status}</p>
                            ${(request.status === 'pendente' || request.status === 'aprovado') ?
                            `<button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm cancel-request" data-id="${request.id}">
                                Cancelar Solicitação
                            </button>` : ''}
                        </div>`
                    ).join('');

                    requestsList.innerHTML = requestsHTML;

                    document.querySelectorAll('.cancel-request').forEach(button => {
                        button.addEventListener('click', function () {
                            const requestId = this.getAttribute('data-id');
                            console.log(`ID da solicitação no clique: ${requestId}`);
                            showCancelConfirmation(requestId);
                        });
                    });
                }
            })
            .catch(error => {
                console.error(error);
                requestsList.innerHTML = '<p class="text-center text-red-500">Erro ao carregar as solicitações.</p>';
            });
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


        console.log(`Tentando cancelar a reserva com ID: ${requestId}`);

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

                if (filteredRequests.length === 0) {
                    requestsList.innerHTML = '<p class="text-center text-gray-500">Nenhuma solicitação encontrada.</p>';
                } else {
                    const requestsHTML = filteredRequests.map(request => {
                        let actionButtons = '';
                        if (request.status === 'pendente') {
                            actionButtons = `
                            <button class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm approve-request" data-id="${request.id}">
                                Aprovar
                            </button>
                            <button class="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-sm reject-request" data-id="${request.id}">
                                Rejeitar
                            </button>
                        `;
                        }

                        return `
                        <div class="bg-white shadow-md rounded-lg p-4 mb-4">
                            <h3 class="font-bold text-lg mb-2">${request.lab_name}</h3>
                            <p class="text-sm text-gray-600">Solicitação: ${request.id}</p>
                            <p class="text-sm text-gray-600">Solicitante: ${request.nome}</p>
                            <p class="text-sm text-gray-600">Matricula: ${request.matricula}</p>
                            <p class="text-sm text-gray-600">Data: ${formatDate(request.date)}</p>
                            <p class="text-sm text-gray-600">Horário de Inicio: ${request.time}</p>
                            <p class="text-sm text-gray-600">Horário de Termino: ${request.time_fim}</p>
                            <p class="text-sm text-gray-600">Finalidade: ${request.purpose}</p>
                            <p class="text-sm font-semibold mt-2 ${getStatusColor(request.status)}">${request.status}</p>
                            ${actionButtons}
                        </div>
                    `;
                    }).join('');

                    requestsList.innerHTML = requestsHTML;

                    // Adicionar eventos aos botões de aprovação e rejeição, se existirem
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
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                requestsList.innerHTML = '<p class="text-center text-gray-500">Erro ao carregar as solicitações.</p>';
            });
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
                approvePedido(pedidoId);
            } else {
                rejectPedido(pedidoId);
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
        fetch(`https://api-reserva-lab.vercel.app/reserve/pedido/${pedidoId}`, {
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
                fetchAndRenderPedidos(); // Atualiza a lista
            })
            .catch(error => {
                console.error('Erro:', error);
            });
    }

    function rejectPedido(pedidoId) {
        fetch(`https://api-reserva-lab.vercel.app/reserve/pedido/${pedidoId}`, {
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
                fetchAndRenderPedidos(); // Atualiza a lista
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

function showReservationForm(labName) {
    const form = document.getElementById('reservationForm');
    const labNameSpan = document.getElementById('labName');

    form.classList.remove('hidden');
    labNameSpan.textContent = labName;

    form.scrollIntoView({ behavior: 'smooth' });
}