# 🧠 Solana Smart Contract with Anchor Framework

This project demonstrates how to build, test, and deploy a Solana smart contract using the [Anchor](https://book.anchor-lang.com/) framework. Anchor simplifies Solana development with Rust by providing a set of tools, macros, and patterns that speed up development.

---

## 📁 Project Structure

```
solana-project/
├── programs/
│   └── my_program/         # Rust-based Solana smart contract
├── tests/
│   └── my_program.js       # JavaScript test using Mocha
├── migrations/
│   └── deploy.js           # Deployment script (optional)
├── Anchor.toml             # Anchor configuration file
├── Cargo.toml              # Rust manifest
├── target/                 # Compiled output
└── README.md               # You're reading it!
```

---

## 📦 Prerequisites

Make sure you have the following tools installed:

### ✅ Required Tools

- **[Node.js](https://nodejs.org/)** (v16+ recommended)
- **[Rust](https://www.rust-lang.org/tools/install)**
- **[Solana CLI](https://docs.solana.com/cli/install-solana-cli)**
- **[Anchor CLI](https://github.com/coral-xyz/anchor)**

### ✅ Install Steps

```bash
# Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Install Rust
curl https://sh.rustup.rs -sSf | sh

# Add wasm target (required by Anchor)
rustup target add wasm32-unknown-unknown

# Install Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor anchor-cli --locked
```

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Build the Program

```bash
anchor build
```

### 3. Start a Local Solana Validator

In a separate terminal:

```bash
solana-test-validator
```

This will start a local blockchain network.

### 4. Deploy to Localnet

```bash
anchor deploy
```

---

## 🧪 Running Tests

To run the tests written in the `tests/` folder:

```bash
anchor test
```

This will:

- Build the program
- Deploy to localnet
- Run Mocha/JavaScript tests

---

## 🌐 Deploy to Devnet

If you want to deploy your program to the Solana devnet (public test network):

### 1. Set the Cluster to Devnet

```bash
solana config set --url https://api.devnet.solana.com
```

### 2. Fund Your Wallet

If you're using the default keypair:

```bash
solana airdrop 2
```

### 3. Deploy

```bash
anchor deploy
```

After successful deployment, you'll get a `Program Id`. Save this for frontend integration.

---

## 🔑 Using Custom Wallet

If you're using a custom keypair:

```bash
solana config set --keypair /path/to/your/keypair.json
```

Example:

```bash
solana config set --keypair ~/.config/solana/devnet.json
```

---

## 🧠 Anchor Key Concepts

- **`programs/`**: Contains your smart contract written in Rust.
- **`tests/`**: JavaScript test files using Anchor and Mocha.
- **`target/idl/`**: Contains the generated IDL (Interface Definition Language) files used in frontend.
- **`Anchor.toml`**: Anchor configuration file.

---

## 🖥️ Frontend Integration (Optional)

To connect your deployed Solana program to a frontend app (e.g., React):

- Use [`@coral-xyz/anchor`](https://www.npmjs.com/package/@coral-xyz/anchor)
- Import the IDL from `target/idl/your_program.json`
- Connect with Phantom Wallet or Solana Wallet Adapter

Example React connection:
```js
import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor';
import idl from './idl/your_program.json';

const programId = new web3.PublicKey('Your_Program_ID');
const provider = AnchorProvider.env();
const program = new Program(idl, programId, provider);
```

---

## 🔐 .gitignore Suggestions

Make sure your `.gitignore` file includes:

```
.DS_Store
node_modules/
target/
.env
.anchor/
solana-keypair.json
```

---

## 📄 License

This project is open-sourced under the MIT License.

---

## 🙋‍♂️ Author

Developed by [Your Name](https://github.com/your-username)
