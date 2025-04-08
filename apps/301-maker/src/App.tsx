import './App.css';
import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.min.css";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import { Splitter, SplitterPanel } from "primereact/splitter";
import Navigation from "./components/Navigation.tsx";
import { CommandEnabler } from "./framework/command/CommandEnabler.ts";
import { DocumentManager } from "./models/DocumentManager.ts";
import { CommandBus } from "./framework/command/CommandBus.ts";
import React, {useEffect, useMemo, useCallback} from "react";
import ClientArea from "./components/ClientArea.tsx";
import { CommandBusContext } from "./framework/command/CommandBusContext.ts";
import { eventToAccel, formatLabel } from "./ui/Accel.ts";
import { accelTable } from "./resources/accelerators.ts";
import {exit} from "@tauri-apps/plugin-process";
import {handler} from "./utils/handler";
import {debug} from "@tauri-apps/plugin-log";
import {FileDocumentRepository} from "./repository/FileDocumentRepository";

const App: React.FC = () => {
    let Wl: number = 20, Wr: number = 100 - Wl;

    const commandBus = useMemo(()=>new CommandBus(),[]);
    const documentManager = useMemo(()=>new DocumentManager(new FileDocumentRepository(), commandBus),[commandBus]);
    const enabler = useMemo(()=>{
        const e = new CommandEnabler(documentManager.getEnablements());
        e.setPredicate('FILE_QUIT', () => true);
        return e;
    },[documentManager]);

    const handleAccelerator = useCallback(handler(async (event: KeyboardEvent) => {
        const accel = eventToAccel(event);
        const label = formatLabel(accel);
        const commandKey = label.toLowerCase();
        const command = accelTable[commandKey];
        if (command && enabler.isCommandEnabled(command.id)) {
            await debug(label);
            commandBus.fireCommand(command);
        }
    }), [commandBus, enabler]);

    useEffect(() => {
        commandBus.addEventListener("FILE_QUIT", handler(async (_event: Event) => await exit(0)));
        window.addEventListener('keydown', handleAccelerator);
        return () => {
            window.removeEventListener('keydown', handleAccelerator);
        }
    }, [commandBus, handleAccelerator]);

    return (
        <PrimeReactProvider>
            <CommandBusContext.Provider value={commandBus}>
                <div className="flex flex-column align-items-stretch justify-content-center w-full h-full">
                    <Navigation style={{ padding: "0px" }} enabler={enabler} />
                    <Splitter className={"flex-grow-1"}>
                        <SplitterPanel className="flex align-items-center justify-content-center" size={Wl}>Panel 1</SplitterPanel>
                        <SplitterPanel className="flex align-items-center justify-content-center" size={Wr}>
                            <ClientArea documentManager={documentManager} />
                        </SplitterPanel>
                    </Splitter>
                </div>
            </CommandBusContext.Provider>
        </PrimeReactProvider>
    );
};

export default App;