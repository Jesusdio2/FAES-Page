import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm"

const supabaseUrl = "https://neswgqikcsxspwdrxqdj.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lc3dncWlrY3N4c3B3ZHJ4cWRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMDUwNTEsImV4cCI6MjA3OTg4MTA1MX0.Fmf9_nFRPxZ9Srg409REF4JNhfdP-gCXpNnfIvS4SW4"
const supabase = createClient(supabaseUrl, supabaseKey)

async function cargarUsuarios() {
  const { data, error } = await supabase
    .from("usuarios")
    .select("*")

  if (error) {
    console.error("Error:", error.message)
    document.getElementById("data-container").innerText = "Error: " + error.message
  } else {
    console.log("Usuarios:", data)
    document.getElementById("data-container").innerHTML =
      "<pre>" + JSON.stringify(data, null, 2) + "</pre>"
  }
}

cargarUsuarios()
