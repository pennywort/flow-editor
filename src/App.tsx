import React from 'react';
import './App.css';
import FlowEditor from "./components/FlowEditor/FlowEditor";
import { ReactFlowProvider } from "@xyflow/react";

function App() {
  return (
    <div className="App">
        <ReactFlowProvider>
            <FlowEditor />
        </ReactFlowProvider>
    </div>
  );
}

export default App;
