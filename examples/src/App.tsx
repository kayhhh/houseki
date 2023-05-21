import "./App.css";

import { Link, Route, useRoute } from "wouter";

import About from "./about/About";
import Basic from "./demos/basic/Basic";
import Gltf from "./demos/gltf/Gltf";
import Physics from "./demos/physics/Physics";
import Player from "./demos/player/Player";

function closeSidePanel() {
  document.querySelector(".sidepanel")?.classList.remove("open");
  document.body.removeEventListener("click", closeSidePanel);
}

function openSidePanel(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
  e.stopPropagation();
  document.querySelector(".sidepanel")?.classList.add("open");
  document.body.addEventListener("click", closeSidePanel);
}

export default function App() {
  return (
    <div className="layout">
      <button onClick={openSidePanel} className="hamburger">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </button>

      <div className="sidepanel">
        <h1>
          <Link href="/">💎</Link>
        </h1>

        <h3>Examples</h3>

        <RouteLink href="/basic">Basic</RouteLink>
        <RouteLink href="/gltf">glTF</RouteLink>
        <RouteLink href="/physics">Physics</RouteLink>
        <RouteLink href="/player">Player</RouteLink>

        <h3>Links</h3>

        <a href="https://github.com/lattice-engine/lattice" target="_blank">
          GitHub
        </a>
      </div>

      <Route path="/" component={About} />
      <Route path="/basic" component={Basic} />
      <Route path="/gltf" component={Gltf} />
      <Route path="/physics" component={Physics} />
      <Route path="/player" component={Player} />
    </div>
  );
}

function RouteLink({ href, children }: { href: string; children: string }) {
  const [isActive] = useRoute(href);
  const linkClass = isActive ? "active" : "";

  return (
    <Link href={href} className={linkClass}>
      {children}
    </Link>
  );
}
