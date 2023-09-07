import "./App.css";

import { Link, Route, useRoute } from "wouter";

import About from "./components/about/About";
import Basic from "./demos/basic/Basic";
import CSM from "./demos/csm/CSM";
import Gltf from "./demos/gltf/Gltf";
import Mesh from "./demos/mesh/Mesh";
import Physics from "./demos/physics/Physics";
import Player from "./demos/player/Player";
import Portal from "./demos/portal/Portal";
import Text from "./demos/text/Text";
import Transform from "./demos/transform/Transform";
import VRM from "./demos/vrm/VRM";

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
        <RouteLink href="/cascading-shadow-maps">CSM</RouteLink>
        <RouteLink href="/gltf">glTF</RouteLink>
        <RouteLink href="/mesh">Mesh</RouteLink>
        <RouteLink href="/physics">Physics</RouteLink>
        <RouteLink href="/player">Player</RouteLink>
        <RouteLink href="/portal">Portal</RouteLink>
        <RouteLink href="/text">Text</RouteLink>
        <RouteLink href="/transform">Transform</RouteLink>
        <RouteLink href="/vrm">VRM</RouteLink>

        <h3>Links</h3>

        <a href="https://github.com/unavi-xyz/houseki" target="_blank">
          GitHub
        </a>
      </div>

      <Route path="/" component={About} />
      <Route path="/basic" component={Basic} />
      <Route path="/cascading-shadow-maps" component={CSM} />
      <Route path="/gltf" component={Gltf} />
      <Route path="/mesh" component={Mesh} />
      <Route path="/physics" component={Physics} />
      <Route path="/player" component={Player} />
      <Route path="/portal" component={Portal} />
      <Route path="/text" component={Text} />
      <Route path="/transform" component={Transform} />
      <Route path="/vrm" component={VRM} />
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
