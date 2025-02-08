package api

import (
	"fmt"
	"log"
	"net/http"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// Check if username or email already exists
	var existingUser models.User
	if err := database.Where("username = ? OR email = ?", user.Username, user.Email).First(&existingUser).Error; err == nil {
		fmt.Print(("User found!"))
		c.JSON(http.StatusConflict, gin.H{"error": "Username or Email already exists"})
		return
	} else if err != gorm.ErrRecordNotFound {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
		return
	}

	// Create the new user in the database
	if err := database.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "UserName": user.Username})

}
