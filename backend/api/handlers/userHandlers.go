package handlers

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"roamio/backend/api"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func GetAllUsers(c *gin.Context) {
	database, err := api.DatabaseConnection()
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

func GetUserProfile(database *gorm.DB, usernameOrEmail string) (*models.User, error) {
	var user models.User

	// Query the database for the user by username or email
	err := database.Select("id, fullname, location, dob, username, email").
		Where("username = ? OR email = ?", usernameOrEmail, usernameOrEmail).
		First(&user).Error

	if err != nil {
		return nil, err
	}

	return &user, nil
}

// HashPassword hashes a plain-text password using bcrypt
func hashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash compares a plain-text password with a hashed password
func checkPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// register a user/account
func CreateUser(c *gin.Context) {
	database, err := api.DatabaseConnection()
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
	// Before saving user in CreateUser:
	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}
	user.Password = hashedPassword
	// Create the new user in the database
	if err := database.Create(&user).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "UserName": user.Username})

}

// User Login
func Login(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		log.Fatal("failed to connect to Database")
	}

	var loginRequest struct {
		UsernameOrEmail string `json:"username_or_email" binding:"required"`
		Password        string `json:"password" binding:"required"`
	}

	// Bind JSON input to loginRequest struct
	if err := c.ShouldBindJSON(&loginRequest); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	var user models.User

	// Check if the user exists by username or email
	if err := database.Where("username = ? OR email = ?", loginRequest.UsernameOrEmail, loginRequest.UsernameOrEmail).First(&user).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User does not exist."})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Verify the password (for simplicity, assuming plain text comparison here)
	if !checkPasswordHash(loginRequest.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/email or password"})
		return
	}

	// Retrieve user profile (excluding password)
	userProfile, err := GetUserProfile(database, loginRequest.UsernameOrEmail)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve user profile"})
		return
	}

	// Successful login response
	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"user":    userProfile,
	})
}

// To follow page/ User
func CreateFollow(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	var followReq struct {
		FollowerID uint   `json:"follower_id" binding:"required"`
		TargetID   uint   `json:"target_id" binding:"required"`
		Type       string `json:"type" binding:"required,oneof=user page"`
	}

	if err := c.ShouldBindJSON(&followReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if followReq.TargetID == followReq.FollowerID {
		c.JSON(http.StatusConflict, gin.H{"error": "Cannot follow self"})
		return
	}

	// Check if target exists
	var exists bool
	switch followReq.Type {
	case "user":
		exists = database.Where("id = ?", followReq.TargetID).First(&models.User{}).Error == nil
	case "page":
		exists = database.Where("id = ?", followReq.TargetID).First(&models.Page{}).Error == nil
	}

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Target not found"})
		return
	}

	user_exists := database.Where("id = ?", followReq.FollowerID).First(&models.User{}).Error == nil

	if !user_exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Check iif the follow relationship already exists
	var existingFollow models.Follows
	if err := database.Where("follower_id = ? AND target_id = ? AND type = ?", followReq.FollowerID, followReq.TargetID, followReq.Type).
		First(&existingFollow).Error; err == nil {
		// Follow relationship already exists
		c.JSON(http.StatusConflict, gin.H{"error": "Already following"})
		return
	} else if err != gorm.ErrRecordNotFound {
		// Handle unexpected errors
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Create new follow relationship
	follow := models.Follows{
		FollowerID: followReq.FollowerID,
		TargetID:   followReq.TargetID,
		Type:       followReq.Type,
	}

	if err := database.Create(&follow).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create follow relationship"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Follow created"})
}

// Retrieve Followers/following func
func RetrieveFollowers(database *gorm.DB, targetID uint, followType string) ([]struct {
	ID       uint
	Username string
}, error) {
	var followers []struct {
		ID       uint
		Username string
	}

	err := database.Model(&models.User{}).
		Select("users.id, users.username").
		Joins("JOIN follows ON follows.follower_id = users.id").
		Where("follows.target_id = ? AND follows.type = ?", targetID, followType).
		Scan(&followers).Error

	return followers, err
}

// Retrieve following
func RetrieveFollowings(database *gorm.DB, followerID uint) ([]struct {
	Type string `json:"type"` // Either "user" or "page"
	ID   uint   `json:"id"`
	Name string `json:"name"`
}, error) {
	var followings []struct {
		Type string `json:"type"` // Either "user" or "page"
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}

	// Query for users being followed
	err := database.Table("follows").
		Select("'user' as type, users.id, users.username as name").
		Joins("JOIN users ON users.id = follows.target_id").
		Where("follows.follower_id = ? AND follows.type = 'user'", followerID).
		Scan(&followings).Error
	if err != nil {
		return nil, err
	}

	// Query for pages being followed
	err = database.Table("follows").
		Select("'page' as type, pages.id, pages.name").
		Joins("JOIN pages ON pages.id = follows.target_id").
		Where("follows.follower_id = ? AND follows.type = 'page'", followerID).
		Scan(&followings).Error
	if err != nil {
		return nil, err
	}

	return followings, nil
}

// Retrieve followers api route
func GetFollowers(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	var requestBody struct {
		TargetID uint   `json:"id" binding:"required"`
		Type     string `json:"type" binding:"required"`
	}
	// Bind JSON body to the struct
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Validate the type field
	if requestBody.Type != "user" && requestBody.Type != "page" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid type. Must be 'user' or 'page'"})
		return
	}

	var exists bool
	switch requestBody.Type {
	case "user":
		exists = database.Where("id = ?", requestBody.TargetID).First(&models.User{}).Error == nil
	case "page":
		exists = database.Where("id = ?", requestBody.TargetID).First(&models.Page{}).Error == nil
	}

	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "Target not found"})
		return
	}

	followers, err := RetrieveFollowers(database, requestBody.TargetID, requestBody.Type)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve followers"})
		return
	}
	c.JSON(http.StatusOK, followers)
}

func GetFollowings(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	var requestBody struct {
		UserID uint `json:"user_id" binding:"required"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	user_exists := database.Where("id = ?", requestBody.UserID).First(&models.User{}).Error == nil

	if !user_exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	followings, err := RetrieveFollowings(database, requestBody.UserID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve followings"})
		return
	}

	c.JSON(http.StatusOK, followings)
}

// Unfollowing logic
func Unfollow(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	var unfollowReq struct {
		FollowerID uint   `json:"follower_id" binding:"required"`
		TargetID   uint   `json:"target_id" binding:"required"`
		Type       string `json:"type" binding:"required,oneof=user page"`
	}

	if err := c.ShouldBindJSON(&unfollowReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Delete the follow relationship
	result := database.Where("follower_id = ? AND target_id = ? AND type = ?", unfollowReq.FollowerID, unfollowReq.TargetID, unfollowReq.Type).
		Delete(&models.Follows{})

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unfollow"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Follow relationship not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully unfollowed"})
}

func IsFollowing(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	var requestBody struct {
		FollowerID uint   `json:"follower_id" binding:"required"`
		TargetID   uint   `json:"target_id" binding:"required"`
		Type       string `json:"type" binding:"required,oneof=user page"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	var follow models.Follows
	err = database.Where("follower_id = ? AND target_id = ? AND type = ?",
		requestBody.FollowerID,
		requestBody.TargetID,
		requestBody.Type).
		First(&follow).Error

	if errors.Is(err, gorm.ErrRecordNotFound) {
		c.JSON(http.StatusOK, gin.H{"isFollowing": false})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"isFollowing": true})
}
