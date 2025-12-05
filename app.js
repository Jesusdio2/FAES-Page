import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "https://neswgqikcsxspwdrxqdj.supabase.co"
const supabaseKey = "TU_ANON_KEY"

// Inicializa Supabase con opciones seguras
let supabase = null
try {
  supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: window.sessionStorage,   // usa sessionStorage
      autoRefreshToken: false,
      persistSession: false
    }
  })
} catch (err) {
  console.error("Error inicializando Supabase:", err)
}

async function cargarUsuarios() {
  const container = document.getElementById("data-container")

  if (!supabase) {
    container.innerText = "Error: Supabase no se inicializó correctamente."
    return
  }

  try {
    const { data, error } = await supabase
      .from("usuarios")
      .select("*")

    if (error) {
      console.error("Error:", error.message)
      container.innerText = "Error: " + error.message
    } else if (!data || data.length === 0) {
      container.innerText = "No hay usuarios registrados."
    } else {
      console.log("Usuarios:", data)
      container.innerHTML = "<pre>" + JSON.stringify(data, null, 2) + "</pre>"
    }
  } catch (err) {
    console.error("Error inesperado:", err)
    container.innerText = "Error inesperado: " + err.message
  }
}

cargarUsuarios()
