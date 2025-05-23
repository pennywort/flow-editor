import React from 'react';
import './App.css';
import FlowEditor from "./components/FlowEditor/FlowEditor";
import { ReactFlowProvider } from "@xyflow/react";
import {SearchProvider} from "./context/SearchContext";

function App() {
  return (
    <div className="App">
        <ReactFlowProvider>
            <SearchProvider>
                <FlowEditor />
            </SearchProvider>
        </ReactFlowProvider>
    </div>
  );
}

export default App;
