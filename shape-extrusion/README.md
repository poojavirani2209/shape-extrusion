# Overview
The aim of this project was to develop a Babylon.js application that allows users to:

* Create 2D Shapes
- Users can draw various 2D shapes directly on a ground plane using mouse interactions.
* Extrude Shapes: 
- Convert these 2D shapes into 3D objects with a fixed extrusion height.
* Move Objects: Users can move these 3D objects around on the ground plane.
* Edit Vertices: Modify the vertices of the 3D objects, allowing for free movement and adjustments in 3D space.
* UI Controls: Switch between different modes (draw, move, edit vertices) using dedicated buttons.
* Visual Cues: Clearly show which object is selected and which editing mode is active.

# Why Choose React with Babylon.js Instead of Vanilla JavaScript?
* Component-Based Architecture:

- React: React’s component-based structure allows us to build reusable, self-contained pieces of the UI, making the application easier to manage and maintain. For example, components like OperationButtonComponent handle button interactions, while SceneComponent manages the scene’s meshes, camera, and lighting. This modularity simplifies both development and future updates.
- Vanilla JavaScript: Without React, managing complex UIs requires more manual work. You’d need to manually handle UI updates and interactions, which can lead to a more tangled and less maintainable codebase.

* Reusability:

- React: The ability to reuse components is a major advantage. Multiple buttons with similar styles and functionality can be managed efficiently, and functionality can be split across components. For instance, OperationComponent updates the operation mode, and SceneComponent handles the scene display. This separation makes it easier to reuse and update components.
- Vanilla JavaScript: Achieving similar reusability requires additional effort and can lead to repetitive code.

* State Management:

- React: Uses hooks like useState and useRef to manage and update component states efficiently. This simplifies handling complex UI interactions and state updates.
- Vanilla JavaScript: Requires custom solutions for state management, often relying on global variables or passing state manually between components, which can become error-prone in larger applications.

* Declarative UI:

- React: Provides a declarative approach to building UIs, making it easier to describe what the UI should look like for any given state. This leads to more readable and maintainable code.
- Vanilla JavaScript: Often involves imperative code to directly manipulate the DOM, which can be more cumbersome and harder to manage.

# Reasons for Using the MVC Design Pattern

* Separation of Concerns:

- Model: Manages the data and business logic, keeping it separate from the UI and user interactions.
- View: Renders the UI and responds to user inputs based on the data provided by the model.
- Controller: Handles user inputs, updates the model and view, and ensures they remain loosely coupled. This clear separation makes the application more modular and easier to maintain or extend.

* Improved Maintainability:

- Changes in one part of the application, such as data management or UI presentation, can be made independently, reducing the risk of bugs when adding or modifying features.

* Scalability:
- As the application grows, the MVC pattern helps manage complexity by keeping different aspects of the application organized. This is particularly useful for applications with intricate business logic and UI requirements.

# Comparison with Component-Based Architecture:
- While React’s component-based architecture is effective and straightforward for many use cases, it can become unwieldy for complex applications where UI and logic are tightly coupled. MVC provides a clearer separation of concerns, making it easier to manage complex applications and maintain a clean codebase.
This approach ensures that the application remains well-organized, scalable, and maintainable, particularly as it grows in complexity.