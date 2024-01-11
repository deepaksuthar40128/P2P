let form = document.getElementById('join-form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let inviteCodeInput = e.target.invite_link;
    if (inviteCodeInput) {
        let roomName = inviteCodeInput.value;
        window.location.href = `/room?room=${roomName}`;
    }
});

