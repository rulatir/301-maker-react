import './App.css'

import "primereact/resources/themes/nano/theme.css";
import "primereact/resources/primereact.min.css";
import "primeflex/primeflex.min.css";
import "primeicons/primeicons.css";
import {PrimeReactProvider} from "primereact/api";
import {Splitter, SplitterPanel} from "primereact/splitter";
import Navigation from "./components/Navigation.tsx";
import {CommandEnabler} from "./framework/command/CommandEnabler.ts";
import {DocumentManager} from "./models/DocumentManager.ts";
import {DummyDocumentRepository} from "./repository/DummyDocumentRepository.ts";
import {CommandBus} from "./framework/command/CommandBus.ts";
import React from "react";
import ClientArea from "./components/ClientArea.tsx";
import {CommandBusContext} from "./framework/command/CommandBusContext.ts";

const App: React.FC = () => {
    let Wl: number = 20, Wr: number = 100-Wl;

    const commandBus = new CommandBus();
    const documentManager = new DocumentManager(new DummyDocumentRepository(), commandBus);
    const enabler = new CommandEnabler(documentManager.getEnablements());

    return (

        <PrimeReactProvider>
            <CommandBusContext.Provider value={commandBus}>
            <div className="flex flex-column align-items-stretch justify-content-center w-full h-full">
                <Navigation style={{padding: "0px"}} enabler={enabler}/>
                <Splitter className={"flex-grow-1"}>
                    <SplitterPanel className="flex align-items-center justify-content-center" size={Wl}>Panel 1</SplitterPanel>
                    <SplitterPanel className="flex align-items-center justify-content-center" size={Wr}>
                        <ClientArea documentManager={documentManager}/>
                    </SplitterPanel>
                </Splitter>
            </div>
            </CommandBusContext.Provider>
        </PrimeReactProvider>
    )
}

export default App;