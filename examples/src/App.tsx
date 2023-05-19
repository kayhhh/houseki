import "./App.css";

import { Link, Route } from "wouter";

import Basic from "./pages/Basic";
import Gltf from "./pages/Gltf";
import Physics from "./pages/Physics";

export default function App() {
  return (
    <div className="layout">
      <div className="sidepanel">
        <h1>
          <Link href="/">💎</Link>
        </h1>

        <h3>Examples</h3>

        <Link href="/basic">Basic</Link>
        <Link href="/gltf">glTF</Link>
        <Link href="/physics">Physics</Link>

        <h3>Links</h3>

        <a href="https://github.com/lattice-engine/lattice" target="_blank">
          GitHub
        </a>
      </div>

      <Route path="/basic" component={Basic} />
      <Route path="/gltf" component={Gltf} />
      <Route path="/physics" component={Physics} />
    </div>
  );
}
