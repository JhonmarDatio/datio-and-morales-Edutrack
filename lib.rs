use bcrypt::{hash, verify, DEFAULT_COST};
use rusqlite::{params, Connection};
use serde::Deserialize;

#[derive(Deserialize)]
pub struct LoginPayload {
    pub email: String,
    pub password: String,
    pub role: String,
}

#[derive(Deserialize)]
pub struct RegisterPayload {
    pub email: String,
    pub password: String,
    pub role: String,
}

#[tauri::command]
fn tauri_login(payload: LoginPayload) -> Result<String, String> {
    login_user(payload)
}

#[tauri::command]
fn tauri_register(payload: RegisterPayload) -> Result<(), String> {
    register_user(payload)
}


// Optional: Create users table if not exists
fn init_db() -> Result<(), String> {
    let conn = Connection::open("my_database.db").map_err(|e| e.to_string())?;

    conn.execute(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL
        )",
        [],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

fn register_user(payload: RegisterPayload) -> Result<(), String> {
    let hashed = hash(&payload.password, DEFAULT_COST).map_err(|e| e.to_string())?;
    let conn = Connection::open("my_database.db").map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO users (email, password, role) VALUES (?1, ?2, ?3)",
        params![payload.email, hashed, payload.role],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

fn login_user(payload: LoginPayload) -> Result<String, String> {
    println!("Login attempt with email: {}, role: {}", payload.email, payload.role);

    let conn = Connection::open("my_database.db").map_err(|e| e.to_string())?;

    let mut stmt = conn.prepare("SELECT password FROM users WHERE email = ? AND role = ?")
        .map_err(|e| e.to_string())?;

    let hashed_password: String = stmt
        .query_row(params![payload.email, payload.role], |row| row.get(0))
        .map_err(|_| "User not found or incorrect role".to_string())?;
    println!("Stored password hash: {}", hashed_password);

    if verify(&payload.password, &hashed_password).map_err(|e| e.to_string())? {
        Ok(payload.role)
    } else {
        Err("Invalid password".to_string())
    }
}

// This is the entry point for Tauri v2 (desktop or mobile)
pub fn run() {
    init_db().expect("Failed to initialize DB");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            tauri_login,
            tauri_register,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
