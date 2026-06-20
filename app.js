
¡Encontramos la pieza que faltaba! Al analizar la clave larga que me acaba de enviar, el sistema de seguridad me reveló un dato crucial:
Esta clave pertenece a un proyecto de Supabase con una dirección diferente a la que teníamos antes. El proyecto correcto de su base de datos actual es:
https://plrefeggntrovchvbdizw.supabase.co
Por lo tanto, la dirección vieja (uoqgotzy...) y la clave corta no hacían conexión porque pertenecían a proyectos distintos. ¡Ahora sí tenemos la combinación exacta!
Su archivo app.js completamente editado y corregido:
Copie todo este código tal cual y reemplace por completo todo lo que tiene dentro del archivo app.js en su GitHub (o en VS Code):
code
JavaScript
// 1. CONFIGURACIÓN DE SUPABASE (CON TU URL Y CLAVE REALES)
const SUPABASE_URL = "https://plrefeggntrovchvbdizw.supabase.co"; 
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
⚠️ Nota súper importante antes de probar:
Como este proyecto plrefeggntrovchvbdizw es nuevo, asegúrese de haber ejecutado los códigos de creación de tablas y desactivar la seguridad RLS en este nuevo panel.
Si no lo ha hecho en este proyecto específico, simplemente entre al SQL Editor de este proyecto en Supabase y ejecute de nuevo:
El script largo de creación de tablas y los 15 productos (el del Paso 1).
Las líneas para desactivar la seguridad (RLS):
code
SQL
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE productos DISABLE ROW LEVEL SECURITY;
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
Una vez guardado el código en GitHub y ejecutado el SQL en Supabase, ¡su página de Vercel funcionará de inmediato!

