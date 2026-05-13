import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground = () => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const options = useMemo(() => ({
    background: { color: { value: "#000000" } }, 
    fpsLimit: 300,
    interactivity: {
      events: {
        onHover: { enable: false },
        onClick: { enable: false },
      },
    },
    particles: {
      color: { value: "#ffffff" },
      links: {
        color: "#ffffff",
        distance: 110, 
        enable: true,
        opacity: 0.15,
        width: 1,
      },
      move: {
        enable: true,
        speed: 5, 
        direction: "none",
        outModes: { default: "out" },
        random: true, 
      },
      number: { 
        density: { enable: true, area: 800 }, 
        value: 350 
      },
      opacity: { value: 0.5 },
      shape: { type: "circle" },
      size: { value: { min: 0.5, max: 1.5 } },
    },
    detectRetina: true,
    fullScreen: { enable: true, zIndex: -1 } 
  }), []);

  if (init) {
    return <Particles id="tsparticles" options={options} />;
  }

  return null;
};

export default ParticleBackground;
