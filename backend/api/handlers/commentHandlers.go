package handlers

import (
	"net/http"
	"roamio/backend/api"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
)

func CreateComment(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Database connection failed",
		})
		return
	}

	var comment models.Comments
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"details": err.Error(),
		})
		return
	}

	if err := database.Create(&comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to create comment",
			"details": err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"message": "Comment created successfully"})
}
