import React from "react";
import { getRoute } from "./routes.jsx";

export default function App({ path }) {
  return getRoute(path).element;
}
