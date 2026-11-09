import React from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App.jsx";

const path = window.location.pathname;
hydrateRoot(document.getElementById("root"), <App path={path} />);
