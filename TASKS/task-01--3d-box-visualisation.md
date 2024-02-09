# Task 01 - 3D Box Visualisation

## Decisions

1. I will use Remix, it's quite lightweight comparatively to Next.JS and has a good developer experience. We can argue that it's a bit overkill for this home assignment, but I want to show how I would integrate a 3D visualization in a real-world application.
2. We will use Three.js for the 3D visualization.
3. For simplicity the robot will be represented by a set of BoxGeometry objects.

## Robot dimensions

I measured the robot from the provided image and came up with the following dimensions in pixels. I will use these to create the 3D model of the robot:

- base: 68 x 886 x 60
- boom: 112 x 68 x 250
- arm: 292 x 72 x 48
- effector: 170 x 42 x 42

## Log

- Looked into https://github.com/RobotWebTools/ros3djs, but it's not maintained and it requires running a ROS server.
- Looked into https://github.com/openrr/urdf-viz, but it's only for desktop and failed to install from brew. So I will be modeling a robot myself.
- Built a simple HTML page and Three.js to create a 3D scene with a lift in it. Dealing with raw numbers is annoying.
- Quickly realized that I don't want to deal with all the edge cases like retina screen, controls on mobile, window resizing, etc.
- Found `@react-three/fiber`, which is very well maintained and has a good developer experience.
- Modelled the robot with boxes in [Triplex](https://triplex.dev/)
- I've split the 3D scene into separate components: `Lift`, `Arm`, `Gripper`. All the values, except rotations and grip width are hardcoded in components. Ideally you need a serializable way to describe a robot configuration. But due to time constraints it's not possible.
