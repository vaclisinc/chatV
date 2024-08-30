# [ChatV](https://chatv-vaclis.web.app/) - Real-time Chatroom Website

[ChatV](https://chatv-vaclis.web.app/) is a real-time chatroom application that allows users to communicate in public and private rooms. It's built with modern web technologies and Firebase for real-time database and authentication. This project was developed as part of the Software Studio 2024 Spring course.

[![Demo GIF](https://raw.githubusercontent.com/vaclisinc/chatV/9ec8a4c7bcebd2eee8e3f1c2400ea85cb876d578/preview.jpg)](https://youtu.be/36w4gmY6Cdo)
*Click on the picture to see demo video*


## Usage

1. Login using email/password or Google authentication.
2. Navigate the public chatroom or create private rooms.
3. Add friends to private rooms using their UIDs.
4. Send messages and enjoy real-time communication!

## Getting Started

### Prerequisites

- Node.js
- npm
- Firebase account

### Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/your-username/chatv.git
   cd chatv
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory and add your Firebase configuration:
   ```
   APIKEY=your_api_key
   DATABASE=your_database_url
   ```

4. Build the project:
   ```
   npm run build
   ```

5. Set up Firebase:
   - If you haven't already, install the Firebase CLI globally:
     ```
     npm install -g firebase-tools
     ```
   - Log in to Firebase:
     ```
     firebase login
     ```
   - Initialize Firebase in your project directory:
     ```
     firebase init
     ```
     Follow the prompts to set up Firebase Hosting for your project.

6. For local testing:
   ```
   firebase serve
   ```

   Note: For improved development experience, a watch mode has been implemented:
   - Run `npm run build` once at the start of your development session.
   - After that, any changes to the project files will automatically trigger a refresh, allowing you to see your changes immediately without manual rebuilding.

7. To deploy:
   ```
   firebase deploy
   ```

## Development

This project includes a practical feature for local testing:
- After running `npm run build` once, any subsequent changes to the project files will automatically refresh the build.
- This allows you to see your changes immediately without manually rebuilding the project each time.

This feature significantly speeds up the development process and makes it easier to iterate on your changes.

## Features

- **User Authentication**: Supports email/password and Google sign-in
- **Public Chatroom**: A space where all logged-in users can interact
- **Private Chatrooms**: Create and manage private conversations
- **Real-time Messaging**: Instant message delivery and updates
- **Responsive Design**: Fully responsive web design for various devices
- **User Profiles**: Display user profile pictures in chats
- **CSS Animations**: Smooth transitions for enhanced user experience
- **Security**: Environment variable configuration for secure deployment


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- Firebase for providing the backend infrastructure
- All contributors and testers who helped shape this project

