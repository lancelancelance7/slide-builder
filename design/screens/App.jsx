// App.jsx — assemble all six screens into a DesignCanvas.

function App() {
  // Each artboard is the standard productivity-app size.
  const W = 1440, H = 900;

  return (
    <DesignCanvas>
      <DCSection
        id="flow"
        title="Slideline — Slide Builder"
        subtitle="Apple-flavored productivity app · six screens covering the prompt → plan → slides → PDF flow"
      >
        <DCArtboard id="dashboard" label="01 · Recent decks" width={W} height={H}>
          <Dashboard/>
        </DCArtboard>
        <DCArtboard id="brand-kit" label="02 · Brand kit editor" width={W} height={H}>
          <BrandKit/>
        </DCArtboard>
        <DCArtboard id="new-deck" label="03 · New deck · prompt" width={W} height={H}>
          <NewDeck/>
        </DCArtboard>
        <DCArtboard id="preprocess" label="04 · AI plan · review" width={W} height={H}>
          <Preprocess/>
        </DCArtboard>
        <DCArtboard id="editor" label="05 · Slide editor" width={W} height={H}>
          <Editor/>
        </DCArtboard>
        <DCArtboard id="template" label="06 · Template controls" width={W} height={H}>
          <TemplateControls/>
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
