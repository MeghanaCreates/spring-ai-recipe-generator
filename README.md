# 🍽️ Kitchen In Your Hands — AI Powered Recipe Generator 

URL Link - https://spring-ai-recipe-generator-react.vercel.app/

A smart, modern web application that generates personalized recipes based on cuisine selection, ingredients, and dietary restrictions, powered by AI.
This personal project is to showcase full-stack development, AI integration, modern UI, and clean architecture using 
- Java 17
- SPRING BOOT 3.x
- SPRING AI 
- REST API
- MAVEN
- REACT
- CSS


# Provided Input

- Based on selected continent (e.g., African, Asian, European) You would have option to select the cuisine native to that continent
- You can also go with prepopulated cuisines and user can edit cuisine at any time
-	Accepts custom ingredients
- Supports dietary preferences: Vegetarian, Non-Vegetarian, Vegan and provides text field for optional preferences

<img width="1903" height="917" alt="Screenshot (2)" src="https://github.com/user-attachments/assets/479a1e48-346e-43c5-83c6-5a6446b71a01" />


# Expected Output

- Generated full recipe with step by step Instructions

<img width="1903" height="907" alt="Screenshot (3)" src="https://github.com/user-attachments/assets/663945a8-e989-4064-8600-4f7cd4ae9f3b" />


# Tech Stack

# Frontend

- React (Functional Components + Hooks) - Built using clean, component-based architecture to ensure maintainability and reusability.
- React State Management (useState, useEffect) - Lightweight state handling without external libraries.
-	Modern CSS - Custom gradients, overlays, responsive layout, and polished UI transitions.
- Fetch API Integration - Handles API calls for cuisine loading and recipe generation.
-	Responsive & Mobile-Friendly Design - Ensures a seamless experience across screens

# Backend

# Spring Boot (Java)

- REST API endpoints
- Environment-based API key handling

# Spring AI — Native Java AI Integration

- Uses Spring AI to seamlessly connect your backend with AI models.
- Fast, clean abstraction: no manual HTTP calls, headers, or JSON parsing.
- Built-in prompt templates and response parsing create structured, consistent recipe output.
- Ensures type-safe, maintainable AI communication — ideal for enterprise AI projects.

# Service-Layer Based Architecture

1.Clear separation of:

- Controller → handles API requests
- Service → AI / cuisine / recipe generation logic
- Config → Spring AI model configuration

2.Improves maintainability, testability, and code readability.

3.Fully scalable — ready to integrate DB or authentication in the future.

# Build & Tools

- VS Code – Frontend development
- Spring Tool Suite (STS) – Backend development
- Maven – Dependency management
- Git & GitHub – Version control and collaboration
- Railway – Cloud hosting for backend

# Future Enhancements

- Save recipes to user accounts
- Add image generation for recipe preview
- Multilingual support
- Mobile app (React Native)

# Thank You
MeghanaGadwal


