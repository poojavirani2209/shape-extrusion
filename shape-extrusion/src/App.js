import { useState } from "react";
import "./App.css";
import { SceneComponent } from "./view/components/SceneComponent";
import { OperationComponent } from "./view/components/OperationComponent";

function App() {
  let [operation, setOperation] = useState("");
  return (
    <>
      <OperationComponent setOperation={setOperation}></OperationComponent>
      <SceneComponent operation={operation} id="my-canvas" />
    </>
  );
}

export default App;
