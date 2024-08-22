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


## DEMO
[Shape Extrusion Demo](https://www.loom.com/share/ae78b6f1411d43b0908cf1769f28f380)

[Shape extrusion showing vertices are editable, once move create lines with new vertices](https://www.loom.com/share/342b9aa8a86748f982b7350ca45a7d8e)
[Showing extrusion with new vertices](https://www.loom.com/share/7d73ccda929f440db78946c4de8f5cb6)

# Getting Started with the Project

Follow these steps to set up and interact with the project:

## 1. Download and Extract the ZIP File

1. **Download** the ZIP file containing the project from the provided link.
2. **Extract** the contents of the ZIP file to a desired location on your computer.

## 2. Open the Project in an IDE

1. Open your preferred IDE (e.g., [VSCode](https://code.visualstudio.com/)).
2. **Open** the extracted project folder in the IDE.

## 3. Install Dependencies

1. Open a terminal or command prompt within the IDE or navigate to the project directory.
2. Run the following command to install the required dependencies:

    ```bash
    npm install
    ```

## 4. Start the Development Server

1. After the installation is complete, start the development server with:

    ```bash
    npm run start
    ```

2. This will launch the React application and automatically open it in your default web browser. If it doesn’t open automatically, you can manually navigate to `http://localhost:3000`.

## 5. Interact with the Application

### Drawing Shapes

1. **Click** the **"Draw"** button. The button will turn green, indicating that the drawing mode is active.
2. **Draw** on the ground plane by clicking to set vertices. The shape will be drawn in real-time.
3. **Right-click** to finish the drawing. If the shape is not a closed loop, it will be automatically closed.
4. **Click** the **"Draw"** button again to exit the drawing mode. The button will return to its original color.

### Extruding Shapes

1. **Click** the **"Extrude"** button. The button will turn green, and the shape you drew will be extruded into 3D.
2. **Click** the **"Extrude"** button again to exit the extruding mode. The button will return to its original color.

### Moving Shapes

1. **Click** the **"Move"** button. The button will turn green, indicating that the move mode is active.
2. **Click and drag** the extruded shape to move it in any direction.
3. **Click** the **"Move"** button again to exit the move mode. The button will return to its original color.

### Editing Vertices

1. **Click** the **"Edit"** button. The button will turn green, indicating that the edit mode is active.
2. **Left-click** on any vertex of the extruded shape. Drag the mouse to move the vertex.
3. **Right-click** to stop editing the vertex. The button will return to its original color.

## Troubleshooting

- **If the application doesn’t start**: Ensure that all dependencies are correctly installed and that there are no errors in the terminal.
- **If the browser doesn’t open automatically**: Manually navigate to `http://localhost:3000` in your web browser.

## License

This project is licensed under the [MIT License](./LICENSE).

## Contributing

If you want to contribute to this project, please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file for guidelines.
