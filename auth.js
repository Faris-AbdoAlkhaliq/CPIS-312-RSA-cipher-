// auth.js

window.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const hashed = await hashPassword(password);

        // Admin login
        if (username === 'admin' && password === 'admin') {
            setCurrentUser('admin');
            window.location.href = 'admin.html';
            return;
        }

        const users = getUsers();
        if (users[username] && users[username].password === hashed) {
            setCurrentUser(username);
            window.location.href = 'user.html';
        } else {
            alert('Invalid credentials');
        }
    });

    // Auto-redirect if already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
        if (currentUser === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }
    }
});