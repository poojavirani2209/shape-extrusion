import React from "react";
import { OperationButton } from "./OperationButtonComponent";

/**
 * This component manages the state of the operation to be performed.
 * Tells the child component, about what to do when the button is clicked by the user.
 * 
 * @returns multiple buttons specifying the operations that can be performed.
 */
export function OperationComponent({ setOperation }) {
  return (
    <>
      <div //like a navbar having the buttons
        style={{
          zIndex: 999,
          //the navbar should fit the whole width of window
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
          position: "absolute",
          top: "0px",
          left: "0px",
        }}
      >
        {["draw", "extrude", "move", "edit"].map((operation, index) => {
          //Can add more operations in the array, whenever requirement comes in. So less code updation required.
          return (
            <OperationButton
              setOperation={setOperation}
              OnClick={changeBgColorOnClick}
              operation={operation}
              key={index} //allows react to uniquely identify the elements.
            >
              {operation.toUpperCase()}
            </OperationButton>
          );
        })}
      </div>
    </>
  );
}

/**
 * On button click change background color from white to green, to let user know which operation they are performing now. 
 * @param {*} evt 
 * @param {*} setOperation 
 * @param {*} operation 
 */
function changeBgColorOnClick(evt, setOperation, operation) {
  if (evt.target.style.backgroundColor == "white") {
    evt.target.style.backgroundColor = "green";
    setOperation(operation);
  } else {
    evt.target.style.backgroundColor = "white";
    setOperation("");
  }
}
