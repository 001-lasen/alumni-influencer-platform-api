(function () {
    const token = localStorage.getItem('accessToken');
    if (!token && !window.location.pathname.includes('/login')) {
        window.location.href = '/dashboard/login';
        return;
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            try {
                await fetch('/api/users/logout', {
                    method: 'POST',
                    headers: {'Authorization': `Bearer ${token}`},
                    credentials: 'include'
                });
            } finally {
                localStorage.removeItem('accessToken');
                window.location.href = '/dashboard/login';
            }
        });
    }
})();
