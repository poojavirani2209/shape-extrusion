import { useState } from "react";
import "./App.css";
import { SceneComponent } from "./view/components/SceneComponent";
import { OperationComponent } from "./view/components/OperationComponent";

function App() {
  let [operation, setOperation] = useState("");
  //React uses component hierarchy. Here App is the root component, and as both the child components interact with the operation value,
  //the state is maintained in parent and shared with children as props. Different state management systems like Redux can also be used.
  return (
    <>
      <OperationComponent setOperation={setOperation}>
        {/* the component handles updating the state based on user interaction and button clicks. */}
      </OperationComponent>
      <SceneComponent operation={operation}>
        {/* This component renders on operation change. */}
      </SceneComponent>
    </>
  );
}

export default App;
