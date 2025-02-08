package main

import (
	"roamio/backend/api"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/users", api.GetAllUsers)
	router.POST("/register", api.CreateUser)
	router.POST("/login", api.Login)

	router.Run(":8080")
}
