window.addEventListener('DOMContentLoaded', () => {
    const createUserForm = document.getElementById('createUserForm');
    const userList = document.getElementById('userList');

    function renderUsers() {
        const users = getUsers();
        userList.innerHTML = '';
        for (const username in users) {
            const user = users[username];
            const li = document.createElement('li');
            li.textContent = `${username} - Public Key: e=${user.publicKey.e}, n=${user.publicKey.n} `;

            const delBtn = document.createElement('button');
            delBtn.textContent = 'Delete';
            delBtn.onclick = () => {
                if (confirm(`Delete user ${username}?`)) {
                    delete users[username];
                    saveUsers(users);
                    renderUsers();
                }
            };

            li.appendChild(delBtn);
            userList.appendChild(li);
        }
    }

    createUserForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('newUsername').value.trim();
        const password = document.getElementById('newPassword').value.trim();
        if (!username || !password) return alert('Username and password required');

        const users = getUsers();
        if (users[username]) {
            alert('User already exists');
            return;
        }

        const keys = generateRSAKeyPair();
        const hashedPassword = await hashPassword(password);

        users[username] = {
            password: hashedPassword,
            publicKey: keys.publicKey,
            privateKey: keys.privateKey
        };

        saveUsers(users);
        renderUsers();
        createUserForm.reset();
        alert(`User ${username} created successfully`);
    });

    // Block access if not admin
    const currentUser = getCurrentUser();
    if (currentUser !== 'admin') {
        alert('Access denied');
        window.location.href = 'index.html';
        return;
    }

    renderUsers();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            clearCurrentUser();
            window.location.href = 'index.html';
        });
    }
});
