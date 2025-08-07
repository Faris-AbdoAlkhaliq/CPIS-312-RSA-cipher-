RSA Encryption System - Web Application
This project is a web-based RSA encryption system that demonstrates public-key cryptography concepts in a user-friendly interface. It allows users to generate RSA key pairs, send encrypted messages, and decrypt received messages.

Features
User Authentication: Secure login system with password hashing

RSA Key Generation: Generates 32-bit RSA key pairs for each user

Encrypted Messaging: Send messages encrypted with recipient's public key

Message Decryption: Decrypt received messages with your private key

Admin Dashboard: Create and manage users (admin only)

Public Key Directory: View all users' public keys

Decryption Tool: Standalone tool for decrypting messages with any private key

File Structure
text
├── index.html            - Login page
├── user.html             - User dashboard
├── admin.html            - Admin dashboard
├── public_keys.html      - Public key directory
├── decrypt.html          - RSA decryption tool
├── style.css             - Global styling
├── rsa.js                - RSA cryptographic functions
├── utils.js              - Utility functions and storage helpers
├── auth.js               - Authentication logic
├── dashboard.js          - User dashboard functionality
├── admin.js              - Admin dashboard functionality
Setup and Usage
Clone the repository:

bash
git clone https://github.com/yourusername/rsa-web-app.git
cd rsa-web-app
Open index.html in a modern browser

Login credentials:

Admin: admin / admin

Regular users: Created via admin dashboard

Technical Details
RSA Implementation
32-bit prime generation using Miller-Rabin primality test

Key pair generation with modulus n = p*q

Public exponent e = 65537

Private exponent d = e⁻¹ mod φ(n)

Modular exponentiation for encryption/decryption

Message Handling
Messages limited to 5 characters

Packing: Each character converted to 3-digit ASCII code

Unpacking: BigInt converted back to ASCII characters

Storage
Uses browser's localStorage for:

User credentials (hashed passwords)

RSA key pairs

Encrypted messages

Security Considerations
This is an educational demonstration only:

Uses 32-bit keys (insecure for real-world use)

Passwords stored as SHA-256 hashes (without salt)

No transport security (use HTTPS in production)

All data stored locally in browser
