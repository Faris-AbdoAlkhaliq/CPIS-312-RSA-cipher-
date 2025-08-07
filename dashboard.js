window.addEventListener('DOMContentLoaded', () => {
            const publicKeySpan = document.getElementById('publicKey');
            const privateKeySpan = document.getElementById('privateKey');
            const recipientSelect = document.getElementById('recipient');
            const sendMessageForm = document.getElementById('sendMessageForm');
            const receivedMessagesList = document.getElementById('receivedMessages');
            const sentMessagesList = document.getElementById('sentMessages');

            const currentUser = getCurrentUser();
            if (!currentUser || currentUser === 'admin') {
                alert('Access denied');
                window.location.href = 'index.html';
                return;
            }

            const users = getUsers();
            const user = users[currentUser];
            if (!user) {
                alert('User not found');
                window.location.href = 'index.html';
                return;
            }

            publicKeySpan.textContent = `e=${user.publicKey.e}, n=${user.publicKey.n}`;
            privateKeySpan.textContent = `d=${user.privateKey.d}, n=${user.privateKey.n}`;

            recipientSelect.innerHTML = '';
            for (const username in users) {
                if (username !== currentUser) {
                    const option = document.createElement('option');
                    option.value = username;
                    option.textContent = username;
                    recipientSelect.appendChild(option);
                }
            }

            function renderMessages() {
                const messages = getMessages();
                const received = messages.filter(msg => msg.recipient === currentUser);
                const sent = messages.filter(msg => msg.sender === currentUser);

                receivedMessagesList.innerHTML = '';
                if (received.length === 0) {
                    receivedMessagesList.textContent = 'No messages received.';
                } else {
                    received.forEach(msg => {
                        const li = document.createElement('li');
                        try {
                            const cipherBigInt = BigInt(msg.ciphertext);
                            const plainBigInt = rsaDecrypt(cipherBigInt, user.privateKey);
                            const message = unpackMessage(plainBigInt);
                            li.innerHTML = `From ${msg.sender}: ${message} <button onclick="alert('Encrypted: ${msg.ciphertext}')">View Encrypted</button>`;
                        } catch {
                            li.innerHTML = `From ${msg.sender}: [Unable to decrypt] <button onclick="alert('Encrypted: ${msg.ciphertext}')">View Encrypted</button>`;
                        }
                        receivedMessagesList.appendChild(li);
                    });
                }

                sentMessagesList.innerHTML = '';
                if (sent.length === 0) {
                    sentMessagesList.textContent = 'No messages sent.';
                } else {
                    sent.forEach(msg => {
                        const li = document.createElement('li');
                        li.innerHTML = `To ${msg.recipient}: [Message Sent] <button onclick="alert('Encrypted: ${msg.ciphertext}')">View Encrypted</button>`;
                        sentMessagesList.appendChild(li);
                    });
                }
            }

            renderMessages();

            sendMessageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const recipient = recipientSelect.value;
                const message = document.getElementById('message').value;

                if (message.length > 5) {
                    alert('Message must be 5 characters or less.');
                    return;
                }
                if (!recipient) {
                    alert('Please select a recipient.');
                    return;
                }

                try {
                    const messageBigInt = packMessage(message);
                    const recipientPubKey = users[recipient].publicKey;
                    const cipherBigInt = rsaEncrypt(messageBigInt, recipientPubKey);

                    const messages = getMessages();
                    messages.push({
                        sender: currentUser,
                        recipient,
                        ciphertext: cipherBigInt.toString()
                    });
                    saveMessages(messages);

                    alert('Message sent!');
                    sendMessageForm.reset();
                    renderMessages();
                } catch (err) {
                    alert('Encryption error: ' + err.message);
                }
            });

            document.getElementById('logoutBtn').addEventListener('click', () => {
                clearCurrentUser();
                window.location.href = 'index.html';
            });
        });