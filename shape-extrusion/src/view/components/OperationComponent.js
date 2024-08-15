import React from "react";

export function OperationComponent({ setOperation }) {
  return (
    <>
      <div
        style={{
          zIndex: 999,
          width: "100%",
          position: "absolute",
          top: "0px",
          left: "0px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        <button key='1'
          style={{ color: "black", backgroundColor: "white" }}
          onClick={(evt) => {
            changeColor(evt, setOperation, "draw");
          }}
        >
          Draw
        </button>
        <button key='3' style={{ color: "black", backgroundColor: "white" }}
          onClick={(evt) => {
            changeColor(evt, setOperation, "extrude");
          }}
        >
          Extrude
        </button>
        <button style={{ color: "black", backgroundColor: "white" }}
          onClick={(evt) => {
            changeColor(evt, setOperation, "move");
          }}
        >
          Move
        </button>
        <button style={{ color: "black", backgroundColor: "white" }}
          onClick={(evt) => {
            changeColor(evt, setOperation, "edit");
          }}
        >
          Edit Vertices
        </button>
      </div>
    </>
  );
}

function changeColor(evt, setOperation, operation) {
    console.log(operation)
    console.log(evt.target.style.backgroundColor)
  if (evt.target.style.backgroundColor == "white") {
    evt.target.style.backgroundColor = "green";
    setOperation(operation);
  } else {
    evt.target.style.backgroundColor = "white";
    setOperation("");
  }
}
