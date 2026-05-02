# Notification System Design

## Overview
A campus notification microservice that delivers real-time updates to students regarding Placements, Events, and Results.

## Architecture
- REST API backend built with Node.js + Express
- Logging Middleware integrated for observability
- Stateless design — no database required

## API Endpoints
- GET /notifications — Fetch all notifications
- POST /notifications — Create a new notification
- GET /notifications/:id — Fetch a specific notification

## Notification Types
- Placement updates
- Event announcements  
- Result declarations

## Logging Strategy
Every significant event is logged using the logging middleware with appropriate stack, level, package, and message fields.

## Tech Stack
- Runtime: Node.js
- Framework: Express.js
- Logging: Custom logging middleware (POST to evaluation-service/logs)