package main

import (
	"log"
	"os"
	"roamio/backend/api/handlers"

	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "roamio/backend/docs"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

// @title Roamio
// @version 0.2
// @description The api to Roamio's server.
// @host localhost:8080

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
	url := ginSwagger.URL("http://localhost:8080/swagger/doc.json")
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler, url))
	router.GET("/users", handlers.GetAllUsers)
	router.GET("/itineraries", handlers.GetAllItinerary)
	router.POST("/itineraries", handlers.CreateItinerary)
	router.GET("/itineraries/user/:userID", handlers.GetItineraryByUserId)
	router.GET("/itineraries/state/:stateID", handlers.GetItineraryByStateId)
	router.GET("/itineraries/post/:postID", handlers.GetItineraryByPostId)

	router.POST("/users/register", handlers.CreateUser)
	router.POST("/users/login", handlers.Login)
	router.POST("/users/follow", handlers.CreateFollow)
	router.GET("/users/followers", handlers.GetFollowers)
	router.GET("/users/followings", handlers.GetFollowings)
	router.POST("/users/unfollow", handlers.Unfollow)
	router.POST("/users/follow/check", handlers.IsFollowing)
	router.POST("/users/profile-pic", handlers.UpdateProfilePic)
	router.GET("/users/:username/profile-pic", handlers.GetProfilePic)

	router.POST("/comments", handlers.CreateComment)
	router.GET("/comments", handlers.GetAllComments)
	router.GET("/comments/:postID", handlers.GetCommentsByPostId)
	router.PUT("/comments", handlers.UpdateComment)

	router.Run(":8080")
}
