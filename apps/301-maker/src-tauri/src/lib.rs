use dotenvy::dotenv;
use log::LevelFilter;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    dotenv().ok();

    let mut builder = tauri::Builder::default();
    // Initialize log plugin EARLY - before any other plugins
    builder = builder.plugin(
        tauri_plugin_log::Builder::default()
            // Explicitly configure stdout target
            .targets([tauri_plugin_log::Target::new(
                tauri_plugin_log::TargetKind::Stdout,
            )])
            // Set appropriate log level
            .level(LevelFilter::Debug)
            .build(),
    );
    builder = builder
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_window_state::Builder::new().build())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init());


    // Then initialize the store plugin
    builder = builder.plugin(tauri_plugin_store::Builder::new().build());

    // Run the application
    builder
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
