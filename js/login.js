document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado, iniciando script...');

    // Theme Toggle Logic
    const toggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.getElementById('sun-icon');
    const moonIcon = document.getElementById('moon-icon');
    const body = document.body;

    if(toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            body.classList.toggle('light-theme');
            if (body.classList.contains('light-theme')) {
                sunIcon.classList.add('hidden');
                moonIcon.classList.remove('hidden');
            } else {
                sunIcon.classList.remove('hidden');
                moonIcon.classList.add('hidden');
            }
        });
    }

    // Login Logic
    alert('DEBUG: Script login.js cargado desde archivo externo'); 

    const loginForm = document.getElementById('loginForm');
    if(loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const submitBtn = loginForm.querySelector('button[type="submit"]');

            // Alert debug
            alert('DEBUG: Submit detectado');
            alert('Email: ' + email);

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Verificando...';

                // Usar ruta absoluta relativa a la raíz del servidor web si es posible, 
                // o relativa al archivo HTML. 
                // Asumiendo que login.html está en root y auth_login.php en /php/
                const response = await fetch('php/auth_login.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                alert('DEBUG: Respuesta fetch recibida. Status: ' + response.status);

                const data = await response.json();
                
                if (data.success) {
                    alert('DEBUG: Login exitoso. Redireccionando...');
                    window.location.href = 'dashboard.html';
                } else {
                    alert('DEBUG: Login fallido. Server dice: ' + data.message);
                }
            } catch (error) {
                alert('DEBUG: Error grave: ' + error);
                console.error(error);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Iniciar Sesión';
            }
        });
    } else {
        alert('CRITICAL DEBUG: No se encontró el formulario con id="loginForm"');
    }
});
