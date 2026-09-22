export default function AnimationStyles() {
  return (
    <style>{`
      @keyframes paneEnter { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      .pane-animate { animation: paneEnter 220ms ease-out; }
      @keyframes paneExit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(10px); } }
      .pane-closing { animation: paneExit 220ms ease-in; }
    `}</style>
  );
}
