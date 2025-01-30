package api

import (
	"log"
	"net/http"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
)

func GetAllUsers(c *gin.Context) {
	database, err := databaseConnection()
	if err != nil {
		log.Fatal("failed to connect to Database")
	}
	var users []models.User
	result := database.Find(&users)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
	}
	c.JSON(http.StatusOK, users)
}

func CreateUser(c *gin.Context) {
	database, err := databaseConnection()
	if err != nil {
		log.Fatal("failed to connect to Database")
	}
	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.Create(&user)
	c.JSON(http.StatusOK, user)
}
