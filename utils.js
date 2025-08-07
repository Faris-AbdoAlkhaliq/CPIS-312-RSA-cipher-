// utils.js

// Convert message (max 5 chars) to a BigInt string by ASCII codes
function packMessage(msg) {
    if (msg.length > 5) throw new Error("Message too long");
    return BigInt([...msg].map(c => c.charCodeAt(0).toString().padStart(3, '0')).join(''));
}

// Convert a BigInt string back to ASCII message
function unpackMessage(packed) {
    const str = packed.toString().padStart(15, '0');
    let msg = '';
    for (let i = 0; i < str.length; i += 3) {
        const code = parseInt(str.slice(i, i + 3), 10);
        if (code !== 0) msg += String.fromCharCode(code);
    }
    return msg;
}

// Hash password using SHA-256 (returns hex string)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// LocalStorage helpers
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '{}');
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getMessages() {
    return JSON.parse(localStorage.getItem('messages') || '[]');
}

function saveMessages(messages) {
    localStorage.setItem('messages', JSON.stringify(messages));
}

function getCurrentUser() {
    return localStorage.getItem('currentUser');
}

function setCurrentUser(username) {
    localStorage.setItem('currentUser', username);
}

function clearCurrentUser() {
    localStorage.removeItem('currentUser');
}