# 🌐 Full-Stack dApp Setup with React.js, Laravel, and Solana (Anchor)

This guide provides a complete walkthrough on how to set up and deploy a decentralized application (dApp) using:

- **Solana (Anchor framework)** for smart contracts
- **Laravel (PHP)** for backend services
- **React.js** for frontend user interface

---

## 📦 Prerequisites

Make sure you have the following tools installed on your system:

### ✅ System Requirements

- Node.js (v16+)
- PHP (8.0+)
- Composer
- Laravel CLI
- Rust & Cargo
- Solana CLI
- Anchor CLI
- MySQL or PostgreSQL (for Laravel)

---

## 🧱 1. Solana + Anchor Setup

### Install Rust and Solana CLI

```bash
# Install Rust
curl https://sh.rustup.rs -sSf | sh
rustup component add rustfmt
rustup target add wasm32-unknown-unknown

# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Confirm installation
solana --version
```

### Install Anchor

```bash
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
```

### Create Anchor Project

```bash
anchor init solana-program
cd solana-program
anchor build
```

### Run Local Validator & Deploy

```bash
solana-test-validator
# In another terminal:
anchor deploy
```

---

## ⚙️ 2. Laravel Backend Setup

### Install Laravel

```bash
composer create-project laravel/laravel backend
cd backend
```

### Setup Environment

```bash
cp .env.example .env
php artisan key:generate
```

### Configure Database

Edit `.env` and update your DB credentials:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dapp
DB_USERNAME=root
DB_PASSWORD=secret
```

### Run Migrations

```bash
php artisan migrate
```

### Run Laravel Server

```bash
php artisan serve
```

Your backend is now running at `http://127.0.0.1:8000`.

---

## 🖼️ 3. React Frontend Setup

### Create React App

```bash
npx create-react-app frontend
cd frontend
```

### Install Dependencies

```bash
npm install @coral-xyz/anchor @solana/web3.js
```

### Connect to Solana Program

Create a file like `config.js`:

```js
export const API_URL = 'https://api-voting.sagarroy.com';

import { PublicKey } from '@solana/web3.js';

export const PROGRAM_ID = new PublicKey('22CajwZNPM3JbcrCpdgPi4a2V3YQ4GF8EQiACkgTHsMg');

```

### Run React App

```bash
npm start
```

---

## 🌐 Deployment Overview

| Component | Deployment Method |
|----------|------------------|
| **Solana Program** | `anchor deploy` to devnet/mainnet |
| **Laravel Backend** | Use shared hosting / VPS / Laravel Forge |
| **React Frontend** | Deploy on Netlify / Vercel / GitHub Pages |

---

## 🔐 Environment Suggestions

### Laravel `.env` additions

```
SOLANA_PROGRAM_ID=YourSolanaProgramID
SOLANA_RPC_URL=https://api.devnet.solana.com
```

### React `.env` additions

```
REACT_APP_SOLANA_PROGRAM_ID=YourSolanaProgramID
REACT_APP_SOLANA_RPC_URL=https://api.devnet.solana.com
```

---

## 📄 License

MIT License

---

## 🙋 Author

Developed by [Your Name](https://github.com/your-username)
