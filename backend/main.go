package main

import (
	"log"
	"os"
	"roamio/backend/api/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: No .env file found")
	}

	// Get FRONTEND_PORT from .env (default to 3000 if not set)
	frontendPort := os.Getenv("FRONTEND_PORT")
	if frontendPort == "" {
		frontendPort = "3000" // Default value
	}

	frontendURL := "http://localhost:" + frontendPort
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{frontendURL}, // Allow frontend
		AllowMethods:     []string{"GET", "POST", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))
	router.GET("/users", handlers.GetAllUsers)
	router.POST("/users/register", handlers.CreateUser)
	router.POST("/users/login", handlers.Login)
	router.GET("/itineraries", handlers.GetAllItinerary)
	router.POST("/itineraries", handlers.CreateItinerary)
	router.GET("/itineraries/user/:userID", handlers.GetItineraryByUserId)
	router.GET("/itineraries/state/:stateID", handlers.GetItineraryByStateId)
	router.POST("/users/follow", handlers.CreateFollow)
	router.GET("/users/followers", handlers.GetFollowers)
	router.GET("/users/followings", handlers.GetFollowings)
	router.POST("/users/unfollow", handlers.Unfollow)

	router.Run(":8080")
}
