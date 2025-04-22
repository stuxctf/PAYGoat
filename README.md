# 🐐 PAYGoat
---
<p align="center">
  <img src="/images/logo.png" alt="Logo" />
</p>

![Node](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)
![Status](https://img.shields.io/badge/status-active_development-39FF14.svg?style=for-the-badge)
[![Contributors](https://img.shields.io/github/contributors/stuxctf/PAYGoat.svg?style=for-the-badge)](https://github.com/stuxctf/PAYGoat/graphs/contributors)
[![Forks](https://img.shields.io/github/forks/stuxctf/PAYGoat.svg?style=for-the-badge)](https://github.com/stuxctf/PAYGoat/network/members)
[![Stargazers](https://img.shields.io/github/stars/stuxctf/PAYGoat.svg?style=for-the-badge)](https://github.com/stuxctf/PAYGoat/stargazers)
[![Issues](https://img.shields.io/github/issues/stuxctf/PAYGoat.svg?style=for-the-badge)](https://github.com/stuxctf/PAYGoat/issues)

---
## 📜 Introduction

**PAYGoat** is a deliberately flawed banking application built for educational and research purposes.  
It allows developers, ethical hackers, and security researchers to explore and understand real-world **business logic vulnerabilities** in a safe, simulated financial environment.

---

## 🚀 Project Overview

PAYGoat focuses on vulnerabilities often overlooked by traditional scanners and static analysis tools — particularly **business logic flaws** such as:

- Improper balance handling
- Authorization bypasses
- Broken object-level access control (BOLAC)
- Negative balance manipulation
- Race conditions
- Tampering with exchange rates and account identifiers

The application includes typical banking features such as:

- User registration & login (JWT-based)
- Account balance management (USD & EUR)
- Fund transfers between users
- Profile updates
- Credit card data handling
- Multi-stage lessons for vulnerability learning

---

## 📚 Educational Use

PAYGoat is designed for:

- 🔍 Security researchers exploring logic flaws
- 🧑‍🏫 Instructors teaching real-world scenarios
- 🧪 Pentesters sharpening business logic exploitation
- 🧑‍💻 Developers learning secure backend design

---

## 📁 Example Scenarios

All practical examples are located in the [`lessons/`](./lessons/) directory.  


Each lesson includes:
- Description and impact
- OWASP/CWE mappings
- Reproduction steps
- Burp Suite automation tips

---

## ⚠️ Disclaimer

PAYGoat is for **educational purposes only**.  
It should **not** be deployed in production or exposed to the internet.

Use this project responsibly and only in controlled environments (e.g., local machines, isolated labs, or CTFs).

---

## 🔧 Requirements

- Node.js / Express (Backend)
- Burp Suite / HTTP Proxy (for interacting with logic flaws)

---

## 🛠️ Installation

> ⚠️ PAYGoat is intended for local use only. Do **not** expose it to the public internet.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/stuxctf/PAYGoat
   cd PAYGoat
   ```

2. **Run in windows**
   ```bash
   .\runner.bat
   ```

3. **Run in Linux**

   ```bash
   chmod +x ./runner.sh
   ./runner.sh
   ```
   
---

## 📜 License

MIT License — feel free to use, fork, and improve.  
Contributions welcome!

---

## 🙌 Author

Made with 💙 by security enthusiasts, for security enthusiasts.
