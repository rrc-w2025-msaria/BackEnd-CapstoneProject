## Lost and Found API

### Project Concept

- I chose the concept and theme of my API to be a Lost and Found API because it could help people to easier report lost items, search for and reclaim their lost items at specific locations. I think that this project is practical and can be a useful tool in the real world.

### Scope and Functionality

- This Lost and Found API will create, update, view, and delete lost or found items. This API will have users submit items they find, and those who are trying to find and reclaim their lost items at the location listed. Users will be able to browse through the item list by location, and status. Once claimed, the item will be visible for an additional 7 days in the system and labelled “reclaimed” with the date it has been reclaimed, before it is deleted from the system. Only admins will have permission to update and delete items.
- The endpoints of this project:
  - Items:
    - Create item: POST /items
    - View all items: GET /items
    - View one item by id: GET /items/:id
    - Update item: PUT /items/:id
    - Delete Item: DELETE /items/:id
  - Locations:
    - Create locations: POST /locations
    - View locations: GET /locations
    - View one location by id: GET /locations/:id
    - Update locations: PUT /locations/:id
    - Delete locations: DELETE /locations/:id
    - (advanced feature) View all items at location
  - Location Contact:
    - Create locationContact: POST /locationContacts
    - View locationContacts: GET /locationContacts
    - Update locationContact: PUT /locationContacts/:id
    - Delete locationContact: DELETE /locationContacts/:id

### Course Content Alignment

- This project aligns with using Node.js, typescript, and express in order to build a structured RESTful API along with Firebase Firestore for data storage and Authentication for management of actions. It will follow the routes, services and controllers’ architecture to ensure maintainability. Jest will be used to implement unit testing. For the new back-end component, I would like to implement an email notification for those who reported they lost their item. When the item is found they will be notified, and this will be done using nodemailer to send them emails.

#### By Marylen Saria
