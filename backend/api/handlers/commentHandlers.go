package handlers

import (
	"net/http"
	"roamio/backend/api"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
)

// CreateComment godoc
// @Summary Create a new comment
// @Description Creates a new comment with the provided data
// @Tags comments
// @Accept json
// @Produce json
// @Param comment body models.Comments true "Comment data"
// @Success 201 {object} map[string]string "message: Comment created successfully"
// @Failure 400 {object} map[string]string "error: Invalid request format or missing fields"
// @Failure 500 {object} map[string]string "error: Database connection failed or Failed to create comment"
// @Router /comments [post]
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

	if comment.UserId == 0 || comment.PostId == 0 || comment.Description == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
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

// GetAllComments godoc
// @Summary Get all comments
// @Description Retrieves a list of all comments
// @Tags comments
// @Produce json
// @Success 200 {object} map[string][]models.Comments "comments: List of comments"
// @Failure 500 {object} map[string]string "error: Database connection failed or Failed to get list of all comments"
// @Router /comments [get]
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
	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

// GetCommentsByPostId godoc
// @Summary Get comments by post ID
// @Description Retrieves a list of comments for a specific post
// @Tags comments
// @Produce json
// @Param postID path int true "Post ID"
// @Success 200 {object} map[string][]models.Comments "comments: List of comments for the post"
// @Failure 500 {object} map[string]string "error: Database connection failed or Failed to get list of all comments"
// @Router /comments/post/{postID} [get]
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

	c.JSON(http.StatusOK, gin.H{"comments": comments})
}

// UpdateComment godoc
// @Summary Update a comment
// @Description Updates an existing comment with the provided data
// @Tags comments
// @Accept json
// @Produce json
// @Param comment body models.Comments true "Updated comment data"
// @Success 200 {object} map[string]interface{} "message: Comment updated successfully, comment: Updated comment"
// @Failure 400 {object} map[string]string "error: Invalid request format"
// @Failure 404 {object} map[string]string "error: Comment not found"
// @Failure 500 {object} map[string]string "error: Database connection failed or Failed to update comment"
// @Router /comments [put]
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
