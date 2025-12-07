import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

// Usa tu URL y la nueva publishable key
const supabaseUrl = "https://neswgqikcsxspwdrxqdj.supabase.co"
const supabaseKey = "sb_publishable_nfU_SI8z2NhLMVevbEF0Rw_AsnoSTK4"

// Inicializa Supabase sin configuración de auth
const supabase = createClient(supabaseUrl, supabaseKey)

async function cargarUsuarios() {
  const container = document.getElementById("data-container")

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
