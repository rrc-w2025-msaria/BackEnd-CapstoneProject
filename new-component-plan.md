## New Back-End Components to implement

I am currently deciding between two differnt components that I may want to implement in my project:

#### Nodemailer for Email Notifications

- Enables email functionality, such as user registration confirmations.
- This will be used to send a composed message to the user looking for their lost item, notifying them once it is found and confirmed to be theirs.
- Those who report they have lost an item and are trying to find it again, must provide an email to be contacted once it has been found.
- I would have to add a contact in my itemModel to add the person's contact when an item is lost or found.

#### Multer for File Uploads

- Allows users to upload files, such as images or documents, with validation and size restrictions.
- This will be used to upload a photo of the item that someone has found and reported to the facility. I will include a description section, so that the image and description can be used when a person is wanting to reclaim an item they had lost to confirm/verify they own it.
