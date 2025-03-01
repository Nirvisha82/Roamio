package main

import (
	"log"
	"os"
	"roamio/backend/api"

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
	router.GET("/users", api.GetAllUsers)
	router.POST("/register", api.CreateUser)
	router.POST("/login", api.Login)
	router.POST("/follow", api.CreateFollow)
	router.GET("/followers", api.GetFollowers)
	router.GET("/followings", api.GetFollowings)

	router.Run(":8080")
}
