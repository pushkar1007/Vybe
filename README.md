# 📱 Vybe - Your Digital Social Circle

Vybe is a dynamic, Firebase-powered social media platform built with React and Chakra UI. It enables users to connect, create, and collaborate in vibrant community circles called **VybeCircles**. Whether you want to post your thoughts, join trending conversations, or message your connections — Vybe provides a modern, scalable, and real-time experience.

---

## 🚀 Features

- 🔐 **Authentication**
  - Firebase Auth with email/password
  - Secure user onboarding and session handling

- 👤 **User Profiles**
  - Avatar & banner image upload
  - Profile editing
  - Follow system via "VyBud" requests

- 💬 **Direct Messaging (DM)**
  - Send & receive DM requests
  - Realtime messaging after request approval

- 🧑‍🤝‍🧑 **VybeCircles**
  - Create or join interest-based communities
  - Upload custom logos and banners
  - Post and interact within circles

- 📣 **Explore Page**
  - Showcases:
    - 🔥 Trending keywords (from post content)
    - 🌐 Most active VybeCircles
    - 🧍 Random user discovery

- 🔔 **Notification System**
  - Centralized Firestore `notifications` collection
  - Persistent and event-driven
  - Covers: VyBud requests, DM requests, post interactions

- 🧠 **Trending System**
  - Analyzes keyword frequency from public posts
  - Auto-updates Explore content using real-time Firestore triggers

- 🎨 **UI/UX**
  - Built with Chakra UI
  - Fully themeable (light/dark mode)
  - Responsive and accessible components

---

## 🧰 Tech Stack

| Category            | Technology                 |
|---------------------|----------------------------|
| Frontend            | React, Chakra UI           |
| Authentication      | Firebase Auth              |
| Backend/Database    | Firebase Firestore         |
| File Storage(media) | Cloudinary                 |
| State Management    | React Context API          |

---

## 📁 Project Structure 
<pre lang="md">
 /src 
 ├── components # Reusable UI components 
 ├── pages # Page-level components 
 ├── context # AuthContext and global providers 
 ├── firebase # Firebase integrations (userdb, vybecircledb, dmdb) 
 ├── utils # Utility functions (e.g., image upload fn) 
 ├── theme # Chakra theme 
 ├── App.jsx # Root component with routes and layout 
 └── main.jsx # ReactDOM rendering entry point  </pre>

## ⚙️ Getting Started
### 🔧 Prerequisites
- Node.js ≥ 18.x
- Firebase project configured
- Firebase SDK config in .env or firebase/config.js

### 📦 Install Dependencies
    npm install

### ▶️ Run Locally
    npm run dev

## ✨ Future Scope
- 📲 Push Notifications (via FCM)

- 🛡️ End-to-End Encrypted Chats

- 🌍 Multi-language support

- 📱 Progressive Web App (PWA)

- 🔍 In-app search for posts & users

## 👨‍💻 Developers

| Name            | GitHub                                         |
| --------------- | ---------------------------------------------- |
| Pushkar Nanwani | [@pushkar1007](https://github.com/pushkar1007) |
| Aayush Chand    | [@Aayush974](https://github.com/Aayush974)     |

## 📄 License
This project is licensed under the MIT License.
   