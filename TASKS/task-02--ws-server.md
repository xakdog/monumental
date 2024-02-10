# Task 02 - WebSocket Server

## Decisions

1. To move faster I will use Node.js, Typescript and WS.
2. For simplicity server will be stateful and will not have any persistence.
3. It accepts three types of messages:
   - `createRobot` - creates a robot with a random id. Replies with `robotCreated` message with the id.
   - `subscribeToRobot` - subscribes to a robot by id. Replies with `subscribed` message. Sends `jointUpdated` message for each joint.
   - `controlJoint` - updates a joint of a robot. Replies with `jointUpdated` message. Notifies all subscribers with `jointUpdated` message.
4. We do not handle any race conditions, like multiple clients trying to control the same joint at the same time.

## Log

- Created a an empty project in `ws` directory.
- Generated a boilerplate with GPT-4.
- Covered with tests, fixed minor bugs, made a better file structure.
