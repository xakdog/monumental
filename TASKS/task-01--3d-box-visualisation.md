# Task 01 - 3D Box Visualisation

## Decisions

1. I will use Remix, it's quite lightweight comparatively to Next.JS and has a good developer experience. We can argue that it's a bit overkill for this home assignment, but I want to show how I would integrate a 3D visualization in a real-world application.
2. We will use Three.js for the 3D visualization.
3. For simplicity the robot will be represented by a set of BoxGeometry objects.

## Robot dimensions

I measured the robot from the provided image and came up with the following dimensions in pixels. I will use these to create the 3D model of the robot:

- base: 886 x 60 x 68
- boom: 250 x 112 x 68
- arm: 292 x 72 x 48
- effector: 170 x 42 x 42
