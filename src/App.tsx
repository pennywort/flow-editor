import React from 'react';
import './App.css';
import FlowEditor from "./components/FlowEditor/FlowEditor";
import { ReactFlowProvider } from "@xyflow/react";
import {SearchProvider} from "./context/SearchContext";
import {DialogProvider} from "./context/DialogContext";

function App() {
  return (
    <div className="App">
        <ReactFlowProvider>
            <DialogProvider>
                <SearchProvider>
                    <FlowEditor />
                </SearchProvider>
            </DialogProvider>
        </ReactFlowProvider>
    </div>
  );
}

export default App;
