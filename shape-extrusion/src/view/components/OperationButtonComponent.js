/**
 * This component specifically handles showing of a button, and interacting with it.
 * The button has a specific style with word in 'black' and button color as 'white' at the start.
 * The props are destructed.
 *
 * OnClick function reference is sent by the caller component, specifying what needs to be done on click of button. This component's responsibility is to just call it at a proper time.
 * setOperation and operation are ultimately sent and used by the caller component.
 * children are whatever that needs to be printed between the tags.
 * @returns The button
 */
export function OperationButton({
  OnClick,
  setOperation,
  operation,
  key,
  children,
}) {
  return (
    <>
      <button
        key={key}
        style={{ color: "black", backgroundColor: "white" }} //inline stying is used as only basic styling is considered for the application.
        onClick={(evt) => {
          OnClick(evt, setOperation, operation);
        }}
      >
        {children}
      </button>
    </>
  );
}
