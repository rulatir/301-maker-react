import React, { useEffect, useState } from 'react';
import { attachConsole, info, error, trace, debug, warn } from '@tauri-apps/plugin-log';

interface LogEntry {
    time: string;
    message: string;
}

const LogDiagnostics: React.FC = () => {
    const [logStatus, setLogStatus] = useState<LogEntry[]>([]);

    // Add a log entry to our visible state
    const addLog = (message: string): void => {
        setLogStatus(prev => [...prev, {
            time: new Date().toISOString(),
            message
        }]);
    };

    useEffect(() => {
        async function testLogging(): Promise<void> {
            // Start diagnostics
            addLog("Starting log diagnostics");

            // Test 1: Basic console.log
            console.log("Direct console.log test");
            addLog("Direct console.log executed");

            // Test 2: Import verification
            try {
                addLog(`attachConsole type: ${typeof attachConsole}`);
                addLog(`info type: ${typeof info}`);
            } catch (e) {
                addLog(`Import check error: ${(e as Error).message}`);
            }

            // Test 3: Try attaching console
            try {
                addLog("About to call attachConsole()");
                await attachConsole();
                addLog("attachConsole() completed");
            } catch (e) {
                addLog(`attachConsole error: ${(e as Error).message}`);
            }

            // Test 4: Try each log level
            try {
                addLog("Testing log functions");

                trace("TRACE message from React component");
                addLog("trace() called");

                debug("DEBUG message from React component");
                addLog("debug() called");

                info("INFO message from React component");
                addLog("info() called");

                warn("WARN message from React component");
                addLog("warn() called");

                error("ERROR message from React component");
                addLog("error() called");
            } catch (e) {
                addLog(`Log function error: ${(e as Error).message}`);
            }

            // Test 5: Delayed logging to check for timing issues
            try {
                addLog("Setting up delayed log test");
                setTimeout(() => {
                    try {
                        info("DELAYED INFO message (after 2 seconds)");
                        addLog("Delayed info() called");
                    } catch (e) {
                        addLog(`Delayed log error: ${(e as Error).message}`);
                    }
                }, 2000);
            } catch (e) {
                addLog(`Delayed setup error: ${(e as Error).message}`);
            }
        }

        testLogging();
    }, []);

    return (
        <div style={{
            padding: '15px',
            margin: '15px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#f8f8f8',
            maxHeight: '400px',
            overflowY: 'auto',
            fontFamily: 'monospace'
        }}>
            <h3>Log Diagnostics</h3>
            <div>
                {logStatus.map((log, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                        <span style={{ color: '#666', fontSize: '0.8em' }}>{log.time}: </span>
                        <span>{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LogDiagnostics;