📍 Localizando App

🔗 Live Demo: https://localizando-app.vercel.app/


💼 Sobre o Projeto

O Localizando App é uma aplicação web full stack desenvolvida como projeto principal do meu portfólio, com foco em geolocalização, escalabilidade e experiência do usuário.

A plataforma conecta usuários e estabelecimentos locais, permitindo descoberta de lojas próximas, visualização em mapa e gerenciamento completo de dados em tempo real.

🧠 Problema Resolvido

Muitas aplicações locais falham em:

Mostrar estabelecimentos relevantes por proximidade
Oferecer uma experiência integrada entre mapa + busca
Gerenciar diferentes tipos de usuários

O Localizando App resolve isso com:

Geolocalização precisa
Interface intuitiva
Sistema de permissões por nível de usuário

🚀 Funcionalidades

🔐 Autenticação e Permissões
Firebase Authentication
Controle de acesso (RBAC):
🏪 Loja
👤 Cliente

🗺️ Mapa Interativo
Geolocalização do usuário
Lojas exibidas dinamicamente no mapa
Atualização em tempo real

🔎 Busca por Proximidade
Listagem de lojas próximas
Filtro baseado na localização

🏪 Gestão de Lojas
Criação e edição de estabelecimentos
Associação de usuários

📅 Eventos da Cidade
Criação de eventos
Exibição para usuários

📊 Dashboard
Painel administrativo
Controle e visualização de dados

📸 Upload de Imagens
Envio via API
Integração com Firebase Storage

👤 Perfil do Usuário
Atualização de dados
Configurações da conta

🛠️ Stack Tecnológica

Frontend

React.js / Next.js

Backend (BaaS)

Firebase
Authentication
Firestore (NoSQL em tempo real)
Storage

Infraestrutura

Vercel (deploy e hosting)

APIs

Geolocalização
Upload de arquivos
🧩 Arquitetura (Visão Geral)
Frontend (Next.js)
   ↓
Firebase Authentication → Controle de acesso
   ↓
Firestore → Dados em tempo real
   ↓
Storage → Upload de imagens
   ↓
Map API → Geolocalização e renderização
⚙️ Decisões Técnicas
🔥 Firebase como Backend

Escolhido para:

Reduzir complexidade de backend
Escalar rapidamente
Trabalhar com dados em tempo real

🗺️ Uso de Geolocalização
Permite experiência personalizada
Base para busca inteligente por proximidade

🔐 RBAC (Role-Based Access Control)
Separação clara entre loja e cliente
Facilita expansão futura (ex: admin)

☁️ Arquitetura Serverless
Deploy rápido
Alta disponibilidade
Baixo custo inicial

📄 Licença

MIT License

Este projeto foi desenvolvido com foco em demonstrar:

Capacidade de construir aplicações completas
Integração com serviços modernos (Firebase)
Boas práticas de arquitetura e organização
Pensamento voltado a produto real
