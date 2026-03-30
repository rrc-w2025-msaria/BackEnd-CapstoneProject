## Lost and Found API

### Project Concept

- I chose the concept and theme of my API to be a Lost and Found API because it could help people to easier report lost items, search for and reclaim their lost items at specific locations. I think that this project is practical and can be a useful tool in the real world.

### Scope and Functionality

- This Lost and Found API will create, update, view, and delete lost or found items. This API will have users submit items they find, and those who are trying to find and reclaim their lost items at the location listed. Users will be able to browse through the item list by location, and status. Once claimed, the item will be visible for an additional 7 days in the system and labelled “reclaimed” with the date it has been reclaimed, before it is deleted from the system. Only admins will have permission to update and delete items.
- The endpoints of this project:
  - Items:
    - Create item: POST /items
    - View items: GET /items
    - Update item: PUT /items
    - Delete Item: DELETE /items
  - Locations:
    - Create locations: POST /locations
    - View locations: GET /locations
    - Update locations: PUT /locations
    - Delete locations: DELETE /locations
  - Status (claimed, unclaimed):
    - Get statuses: GET /status
    - Update status (lost, found, claimed or unclaimed): PUT /status

### Course Content Alignment

- This project aligns with using Node.js, typescript, and express in order to build a structured RESTful API along with Firebase Firestore for data storage and Authentication for management of actions. It will follow the routes, services and controllers’ architecture to ensure maintainability. Jest will be used to implement unit testing. For the new back-end component, I would like to implement an email notification for those who reported they lost their item. When the item is found they will be notified, and this will be done using nodemailer to send them emails.

#### By Marylen Saria
