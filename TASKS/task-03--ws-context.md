# Task 03 - WebSocket context

## Decisions

- Use a context to manage WebSocket connection and messages.
- When you visit / a new robot is created and you are redirected to /robot/:id.
- When you visit /robot/:id you subscribe to the robot with the id.
- In this task we will expose context to test controlling joints in the browser console.
- Goal: see how the robot moves in real-time in different browser tabs.

## Log

- Tried `react-use-websocket` but it has some issues with SSR and Remix.
- To create a robot I will use a redirect on the server side.
- Decided to write my own context and manage it inside of React (it's overly simplistic and doesn't handle all edge cases, ideally you want to keep this state outside React).
- Tested with multiple tabs and it works as expected.
