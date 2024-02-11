
# Task 04 - Controlling Actuators

## Decisions

- We will use a wide spread pattern - control panel on the right (similar to Blender).
- Since our robot is simple, all of the actuators can fit on the small area.
- For a better user experience we will also steal number inputs from Blender (press and drag to change the value, step buttons on hover, click to edit).
- I had to hardcode some things to save the time.

## Future ideas

- If the robot was more complex, we could have an accordion with robot units.
- We might need to record a timeline of movements and replay them. We can borrow a timeline from video editing software.

## Log

- Tried TransformControls, realized it would take too much effort. It would require more visible joints + onboarding/explanation for the user.
- To start - making a simple control panel with native inputs.
- It became apparent that simplified Socket context is not enough. Finding a way to add `react-use-websocket`.
- Made inputs draggable, I'll skip the step buttons for now.
- Adding a simple connection indicator.
