# Sociality Web App

Sociality is a modern social media web application built with **Next.js App Router**, **TypeScript**, and **TanStack Query**.  
This project demonstrates scalable frontend architecture, optimized state management, and modern UI development practices.

The application allows users to create posts, interact with other users, and explore content through a responsive and intuitive interface.

---

# Live Demo

Production Deployment:

https://your-vercel-url.vercel.app

---

# Project Goals

The purpose of this project is to demonstrate:

- Modern **Next.js App Router architecture**
- **Scalable frontend folder structure**
- API state management using **TanStack Query**
- Global state management with **Redux Toolkit**
- **Optimistic UI updates**
- Clean **component-based architecture**
- Robust **loading, empty, and error states**

---

# Core Features

## Authentication

- User registration
- User login
- JWT authentication
- Protected routes

---

## User Profile

- View profile
- Edit profile
- Upload avatar
- Followers and following list

---

## Posts

- Create post with image
- View post detail
- Delete own post
- Infinite scrolling feed

---

## Social Interaction

- Like / Unlike posts
- Comment on posts
- Delete own comments
- Follow / Unfollow users

---

## Content Discovery

- Explore public posts
- View posts from followed users
- Save / Unsave posts
- View saved posts

---

## User Experience

- Optimistic UI updates
- Infinite scrolling
- Loading states
- Error handling
- Empty states
- Fully responsive design

---

# Technology Stack

## Framework

- Next.js (App Router)
- React
- TypeScript

---

## State Management

### Redux Toolkit

Used for:

- Authentication state
- User session
- Global UI state

---

### TanStack Query

Used for:

- API data fetching
- Server state caching
- Optimistic updates
- Pagination and infinite queries

---

## UI & Styling

- Tailwind CSS
- shadcn/ui

---

## Form & Validation

- React Hook Form
- Zod

---

## Utilities

- Day.js
- Sonner (Toast Notifications)

---

# System Architecture

The project follows a layered frontend architecture to ensure scalability and maintainability.

All API requests are handled through a centralized **service layer**.

---

# Engineering Practices

## Optimistic UI Updates

Example: Like Post

1. User clicks like
2. UI updates instantly
3. API request is sent
4. TanStack Query cache updates

This ensures a smooth and responsive user experience.

---

## API Service Layer

All API calls are centralized in the **services layer**.

Example structure:


services/posts
services/comments
services/auth
services/me


This prevents API logic from leaking into UI components.

---

## Type Safety

All TypeScript types are centralized in:


src/types


Examples:

- Post
- Comment
- User
- Profile

This ensures type consistency across the project.

---

# Environment Variables

Create `.env.local` in the root folder.


NEXT_PUBLIC_API_BASE_URL=http://localhost:3000


Update the API URL when deploying to production.

---

# Installation

Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/sociality-webapp.git

Enter project directory

cd sociality-webapp

Install dependencies

npm install
Running the Project

Start development server

npm run dev

Open in browser

http://localhost:3000
Production Build

Build the project

npm run build

Start production server

npm start
Deployment

The project is optimized for deployment on Vercel.

Steps:

Push the project to GitHub

Import the repository in Vercel

Configure environment variables

Deploy

Performance Considerations

API caching with TanStack Query

Optimistic UI updates

Memoized components

Next.js image optimization

Reduced re-renders

Future Improvements

Potential future enhancements:

Real-time notifications

Post editing

Story feature

Dark / Light theme

Real-time updates via WebSocket

Image carousel support

User / hashtag search

Author

Andre Kurniawan
Frontend Developer

GitHub
https://github.com/Andrexxx01
