// 1. CONFIGURACIÓN DE SUPABASE (SIN LA LETRA 'N' INCORRECTA)
const SUPABASE_URL = "https://plrefeggtrovchvbdizw.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBscmVmZWdndHJvdmNodmJkaXp3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM2OTE2MzksImV4cCI6MjA4OTI2NzYzOX0.Qa0kDfBu0ofWOBPPZuYqBisfRNY9plkf6JqY4BneSu8"; 

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// REFERENCIAS DEL DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const btnLoadProducts = document.getElementById('btn-load-products');
const productsBody = document.getElementById('products-body');

// 1. REGISTRO DE USUARIOS
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const nombre = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const contrasena = document.getElementById('reg-password').value;

    try {
        const { data, error } = await supabaseClient
            .from('usuarios')
            .insert([{ nombre, email, contrasena }]);

        if (error) throw error;

        alert('Usuario registrado con éxito en la base de datos.');
        registerForm.reset();
    } catch (err) {
        console.error(err);
        alert('Error al registrar usuario: ' + err.message);
    }
});

// 2. INICIO DE SESIÓN (LOGIN)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const contrasena = document.getElementById('login-password').value;

    try {
        const { data, error } = await supabaseClient
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .eq('contrasena', contrasena)
            .single();

        if (error || !data) {
            alert('Credenciales incorrectas o usuario no encontrado.');
        } else {
            alert(`¡Bienvenido de nuevo, ${data.nombre}!`);
            loginForm.reset();
        }
    } catch (err) {
        console.error(err);
        alert('Error en el proceso de autenticación.');
    }
});

// 3. OBTENER Y MOSTRAR DATOS (PRODUCTOS)
async function loadProducts() {
    productsBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Cargando productos...</td></tr>';
    
    try {
        const { data, error } = await supabaseClient
            .from('productos')
            .select('*');

        if (error) throw error;

        productsBody.innerHTML = ''; 

        if (data.length === 0) {
            productsBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay productos registrados.</td></tr>';
            return;
        }

        data.forEach(prod => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${prod.id}</td>
                <td><strong>${prod.nombre}</strong></td>
                <td>${prod.descripcion}</td>
                <td>$${parseFloat(prod.precio).toFixed(2)}</td>
                <td>${prod.stock}</td>
            `;
            productsBody.appendChild(tr);
        });

    } catch (err) {
        console.error(err);
        productsBody.innerHTML = `<tr><td colspan="5" style="text-align: center; color: red;">Error: ${err.message}</td></tr>`;
    }
}

btnLoadProducts.addEventListener('click', loadProducts);
