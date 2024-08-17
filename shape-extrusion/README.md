# Overview

The aim of this project was to develop a Babylon.js application that allows users to:

1. **Create 2D Shapes**: Users can draw various 2D shapes directly on a ground plane using mouse interactions.
2. **Extrude Shapes**: Convert these 2D shapes into 3D objects with a fixed extrusion height.
3. **Move Objects**: Users can move these 3D objects around on the ground plane.
4. **Edit Vertices**: Modify the vertices of the 3D objects, allowing for free movement and adjustments in 3D space.
5. **UI Controls**: Switch between different modes (draw,extrude, move, edit vertices) using dedicated buttons.
6. **Visual Cues**: Clearly show which object is selected and which editing mode is active.

# Why Choose React with Babylon.js Instead of Vanilla JavaScript?

1. **Component-Based Architecture**:
   React: React’s component-based structure allows us to build reusable, self-contained pieces of the UI, making the application easier to manage and maintain. For example, components like OperationButtonComponent handle button interactions, while SceneComponent manages the scene’s meshes, camera, and lighting. This modularity simplifies both development and future updates.

Vanilla JavaScript: Without React, managing complex UIs requires more manual work. We need to manually handle UI updates and interactions, which can lead to a more tangled and less maintainable codebase.

2. **Reusability**:
   React: Reusability can be seen, with multiple buttons[Draw, Extrude, Move, Edit] with same styles, and similar things happening on click. Components could be divided based on functionalities like OperaationButtonComponent is just responsible for showing and interacting with the buttons, OperationComponent is responsible for updating the operation value to be performed in the scene, and SceneComponent is used to handle working and showing the scene, the meshes, camera view, lightning.

Vanilla JavaScript: Achieving similar reusability requires additional effort and can lead to repetitive code.

3. **State Management**:
   React: Uses hooks like useState and useRef to manage and update component states efficiently. This simplifies handling complex UI interactions and state updates.

Vanilla JavaScript: Requires custom solutions for state management, often relying on global variables or passing state manually between components, which can become error-prone in larger applications.

4. **Declarative UI**:
   React: Provides a declarative approach to building UIs, making it easier to describe what the UI should look like for any given state. This leads to more readable and maintainable code.

Vanilla JavaScript: Often involves imperative code to directly manipulate the DOM, which can be more cumbersome and harder to manage.

# Reasons for Using the MVC Design Pattern

1. **Separation of Concerns**:
   **Model**: Manages the data logic, keeping it separate from the UI and user interactions. In this project, the ShapeModel class is responsible for managing shape data and interactions.
   **View**: Renders the UI and responds to user inputs based on the data provided by the model. The SceneComponent in React acts as the view, rendering the Babylon.js scene and handling user interactions.
   **Controller**: Handles user inputs, updates the model and view, and ensures they remain loosely coupled. This clear separation makes the application more modular and easier to maintain or extend. The ShapeController is responsible for interacting with the model and updating shape data.

2. **Improved Maintainability**: Changes in one part of the application, such as data management (ShapeModel), UI rendering (SceneComponent), or user interactions (ShapeController), can be made independently. This reduces the risk of bugs and simplifies updates.

For example, updating the shape rendering logic in RenderingEngine does not affect how shapes are managed in ShapeModel or how user interactions are handled in ShapeController.

3. **Scalability**:The MVC pattern helps manage complexity by keeping different aspects of the application organized. For instance:

Adding new features like different shape types or more complex interactions can be managed by extending the ShapeModel or adding new controllers.
The SceneComponent can be updated to render new types of objects or interactions without changing the core data logic.

# Comparison with Component-Based Architecture:

While React’s component-based architecture is effective and straightforward, it may become unwieldy for complex applications where UI and logic are tightly coupled. For instance:
**React Components**: The SceneComponent handles both rendering and user interactions, which can make it challenging to manage as the complexity grows.
**MVC**: Provides a clearer separation of concerns. The ShapeModel handles data, ShapeController manages interactions, and SceneComponent is responsible for rendering. This separation makes it easier to manage, scale, and maintain complex applications.
This approach ensures that the application remains well-organized, scalable, and maintainable, particularly as it grows in complexity.
