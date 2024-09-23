<!DOCTYPE html>
<html lang="pt-BR" data-theme="light">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>||Reserva laboratório de infornática||</title>
    <link rel="shortcut icon" href="https://logo.uninassau.edu.br/img/svg/favicon_uninassau.svg" type="icon">
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="./home.css">
</head>

<body class="min-h-screen bg-gray-50">
    <canvas id="canvas"></canvas>
    <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-wrap">
            <!-- Logo, Nome e Notificação -->
            <div class="flex items-center space-x-4">
                <img src="https://logo.uninassau.edu.br/img/svg/favicon_uninassau.svg" alt="UNINASSAU logo"
                    class="h-10 w-auto">
                <span class="text-xl font-bold">UNINASSAU</span>
                <!-- Símbolo de Notificação -->
                <div class="relative">
                    <button id="notification-button" class="relative text-gray-700 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 7.165 6 9.388 6 12v2.159c0 .538-.214 1.055-.595 1.437L4 17h5m0 0v1a3 3 0 006 0v-1m-6 0h6" />
                        </svg>
                        <!-- Contador de notificações -->
                        <span id="notification-count"
                            class="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0 text-xs leading-none text-white bg-red-600 rounded-full"></span>
                    </button>
                    <!-- Menu de Notificações -->
                    <div id="notification-menu"
                        class="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg hidden">
                        <div class="p-4">
                            <div id="notifications-list" class="text-gray-700">
                                <p>Nenhuma nova notificação.</p>
                            </div>
                            <button id="clear-notifications"
                                class="w-full mt-2 bg-red-500 text-white py-1 px-1 rounded-lg hover:bg-red-700">Limpar
                                Notificações</button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Navegação -->
            <nav class="flex flex-wrap space-x-4 md:space-x-8 mt-4 md:mt-0" id="nav-menu">
                <button class="font-medium text-blue-600 border-b-2 border-blue-600 pb-2">RESERVAR</button>
                <button class="font-medium text-gray-500 hover:text-blue-600 transition-colors">SOLICITAÇÕES</button>
                <button id="btn-pedidos"
                    class="font-medium text-gray-500 hover:text-blue-600 transition-colors">PEDIDOS</button>
            </nav>
            <!-- Perfil do Usuário -->
            <div class="relative">
                <button id="profile-button" class="flex items-center space-x-2 text-gray-700">
                    <img src="./img/log.png" alt="Profile Icon" class="h-10 w-10 rounded-full">
                </button>
                <!-- Menu Suspenso -->
                <div id="profile-menu"
                    class="absolute right-0 mt-2 w-max bg-white border border-gray-300 rounded-lg shadow-lg hidden">
                    <div class="px-4 py-2 text-gray-800">
                        <div id="user-name" class="font-medium text-base md:text-lg">Nome do Usuário</div>
                        <div id="user-matricula" class="text-sm text-gray-500">Matrícula</div>
                    </div>
                    <button id="login-button"
                        class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Entrar</button>
                    <button id="logout-button"
                        class="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Sair</button>
                </div>
            </div>
        </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="main-content">
        <!-- Conteúdo principal aqui -->
    </main>

    <script src="./home.js"></script>
</body>

</html>
