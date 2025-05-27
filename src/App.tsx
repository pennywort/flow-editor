import React from 'react';
import './App.css';
import { ReactFlowProvider } from '@xyflow/react';

import FlowEditor from './components/FlowEditor/FlowEditor';
import { SearchProvider } from './context/SearchContext';
import { DialogProvider } from './context/DialogContext';

// @ts-expect-error: for debugging
window.debugChatBotEditor = true;
function App() {
	return (
		<div className="App">
			<ReactFlowProvider>
				<DialogProvider>
					<SearchProvider>
						<FlowEditor onSave={(...args) => console.log(args)} />
					</SearchProvider>
				</DialogProvider>
			</ReactFlowProvider>
		</div>
	);
}

export default App;
