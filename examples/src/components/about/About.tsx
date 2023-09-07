import "./About.css";

import Phos from "./Phos.png";

export default function About() {
  return (
    <div className="container">
      <img src={Phos} alt="Phos" className="phos" />

      <div className="content">
        <h1>Reddo Engine</h1>

        <p>
          A lightweight, modular, and extendable 3D game engine built for the
          web.
        </p>
      </div>
    </div>
  );
}
