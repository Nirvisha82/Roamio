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

func GetAllComments(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Database connection failed",
		})
		return
	}

	var comments []models.Comments
	if err := database.Find(&comments).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to get list of all comments",
			"details": err.Error(),
		})
		return
	}
	c.JSON(http.StatusCreated, gin.H{"comments": comments})
}

func GetCommentsByPostId(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Database connection failed",
		})
		return
	}

	postID := c.Param("postID")
	var comments []models.Comments
	result := database.Where("postID = ?", postID).Find(&comments)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to get list of all comments",
			"details": result.Error.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"comments": comments})
}

func UpdateComment(c *gin.Context) {
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

	var existingComment models.Comments
	if err := database.First(&existingComment, comment.ID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error":   "Comment not found",
			"details": err.Error(),
		})
		return
	}
	if err := database.Model(&existingComment).Updates(comment).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to update comment",
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Comment updated successfully",
		"comment": existingComment,
	})

}
