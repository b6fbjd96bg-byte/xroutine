import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

import { applyTheme, getTheme } from "./lib/theme";
applyTheme(getTheme());
createRoot(document.getElementById("root")!).render(<HelmetProvider><App /></HelmetProvider>);

// Register service worker for notifications if supported
if ('serviceWorker' in navigator) {
	window.addEventListener('load', () => {
		navigator.serviceWorker.register('/sw.js').catch(() => {
			// ignore registration errors
		});
	});
}
