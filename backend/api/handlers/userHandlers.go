package handlers

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	"roamio/backend/api"
	"roamio/backend/api/services"
	"roamio/backend/models"

	_ "roamio/backend/docs"

	"github.com/gin-gonic/gin"
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

// @Summary Create a new user
// @Description Creates a new user with the provided information
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.createUserInput true "User information"
// @Success 200 "User registered"
// @Failure 400 "Invalid input data"
// @Failure 409  "Username or Email already exists"
// @Failure 500  "Internal server error"
// @Router /users/register [post]
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
	hashedPassword, err := services.HashPassword(user.Password)
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

// @Summary User login
// @Description Logs in the user with a username or email and password.
// @Tags users
// @Accept json
// @Produce json
// @Param user body models.loginUser true "Login credentials"
// @Success 200 {object} models.loginResponse "Login successful"
// @Failure 400 "Invalid input data"
// @Failure 401 "Unauthorized - Invalid credentials"
// @Failure 500 "Internal server error"
// @Router /users/login [post]
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
	if !services.CheckPasswordHash(loginRequest.Password, user.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid username/email or password"})
		return
	}

	// Retrieve user profile (excluding password)
	userProfile, err := services.GetUserProfile(database, loginRequest.UsernameOrEmail)
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

// @Summary Follow a user or page
// @Description Add a follow relationship between a follower and target.
// @Tags users
// @Accept json
// @Produce json
// @Param request body models.UnfollowRequest true "Follower ID, Target ID, and type"
// @Success 200 "{"message":"Successfully followed"}"
// @Failure 400 "{"message":"Invalid request body or type"}"
// @Failure 404 "{"message":"User or target not found"}"
// @Failure 409 "{"message":"Cannot follow self or already following"}"
// @Failure 500 "{"message":"Internal server error"}"
// @Router /users/follow [post]
func CreateFollow(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}
	var followReq struct {
		FollowerID string `json:"follower_id" binding:"required"`
		TargetID   string `json:"target_id" binding:"required"`
		Type       string `json:"type" binding:"required,oneof=user page"`
	}

	if err := c.ShouldBindJSON(&followReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if (followReq.Type == "user") && (followReq.TargetID == followReq.FollowerID) {
		// if (followReq.TargetID == followReq.FollowerID) {
		c.JSON(http.StatusConflict, gin.H{"error": "Cannot follow self"})
		return
	}

	var followerID uint
	var targetID uint

	followerID, err = services.GetUserIDByUsername(database, followReq.FollowerID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	switch followReq.Type {
	case "user":
		// Fetch the target ID using the GetUserIDByUsername service
		targetID, err = services.GetUserIDByUsername(database, followReq.TargetID)
		fmt.Printf("Found the users' ID : %d ", targetID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Target user not found"})
			return
		}

	case "page":
		// Fetch the target ID using the GetStateIDByCode service for pages
		targetID, err = services.GetStateIDByCode(database, followReq.TargetID)
		fmt.Printf("Found the states' ID : %d ", targetID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "State not found in Database"})
			return
		}
	}

	// Check if the follow relationship already exists
	var existingFollow models.Follows
	if err := database.Where("follower_id = ? AND target_id = ? AND type = ?", followerID, targetID, followReq.Type).
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
		FollowerID: followerID,
		TargetID:   targetID,
		Type:       followReq.Type,
	}

	if err := database.Create(&follow).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create follow relationship"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Follow created"})
}

// @Summary Retrieve followers
// @Description Get a list of followers for a user or page.
// @Tags users
// @Accept json
// @Produce json
// @Param type path string true "Target type (user or page)"
// @Param target_id path string true "Target identifier (username for user, state code for page)"
// @Success 200 {array} models.Follower "List of followers"
// @Failure 400 {object} map[string]string "{"error":"Invalid type. Must be 'user' or 'page'"}"
// @Failure 404 {object} map[string]string "{"error":"Target user not found"} or {"error":"State not found in Database"}"
// @Failure 500 {object} map[string]string "{"error":"Failed to retrieve followers"}"
// @Router /users/followers/{type}/{target_id} [get]
func GetFollowers(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	// Get parameters from URL
	targetIDParam := c.Param("target_id") // Fetch target identifier (username or state code)
	targetType := c.Param("type")         // Fetch type ("user" or "page")

	// Validate the type field
	if targetType != "user" && targetType != "page" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid type. Must be 'user' or 'page'"})
		return
	}

	var targetID uint

	switch targetType {
	case "user":
		// Fetch the target ID using the GetUserIDByUsername service
		targetID, err = services.GetUserIDByUsername(database, targetIDParam)
		fmt.Printf("Found the users' ID : %d ", targetID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Target user not found"})
			return
		}

	case "page":
		// Fetch the target ID using the GetStateIDByCode service for pages
		targetID, err = services.GetStateIDByCode(database, targetIDParam)
		fmt.Printf("Found the states' ID : %d ", targetID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "State not found in Database"})
			return
		}
	}

	followers, err := services.RetrieveFollowers(database, targetID, targetType)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve followers"})
		return
	}
	c.JSON(http.StatusOK, followers)
}

// @Summary Retrieve followings
// @Description Get a list of users or pages that a user is following.
// @Tags users
// @Accept json
// @Produce json
// @Param user_id path string true "User identifier (username)"
// @Success 200 {array} models.Following "List of followings"
// @Failure 400 {object} map[string]string "{"error":"Missing user_id in URL"}"
// @Failure 404 {object} map[string]string "{"error":"User not found"}"
// @Failure 500 {object} map[string]string "{"error":"Failed to retrieve followings"}"
// @Router /users/followings/{user_id} [get]
func GetFollowings(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	userIDParam := c.Param("user_id") // Fetching from URL param

	if userIDParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing user_id in URL"})
		return
	}

	// Convert username to user ID
	userID, err := services.GetUserIDByUsername(database, userIDParam)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	followings, err := services.RetrieveFollowings(database, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve followings"})
		return
	}

	c.JSON(http.StatusOK, followings)
}

// @Summary Unfollow a user or page
// @Description Remove a follow relationship between a follower and target.
// @Tags users
// @Accept json
// @Produce json
// @Param request body models.UnfollowRequest true "Follower ID, Target ID, and type"
// @Success 200 "{"message":"Successfully unfollowed"}"
// @Failure 400 "{"message":"Invalid request body or type"}"
// @Failure 404 "{"message":"Follow relationship not found"}"
// @Failure 500 "{"message":"Failed to unfollow"}"
// @Router /users/unfollow [post]
func Unfollow(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	var unfollowReq struct {
		FollowerID string `json:"follower_id" binding:"required"`
		TargetID   string `json:"target_id" binding:"required"`
		Type       string `json:"type" binding:"required,oneof=user page"`
	}

	if err := c.ShouldBindJSON(&unfollowReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	var unfollowerID uint
	var targetID uint

	unfollowerID, err = services.GetUserIDByUsername(database, unfollowReq.FollowerID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	switch unfollowReq.Type {
	case "user":
		// Fetch the target ID using the GetUserIDByUsername service
		targetID, err = services.GetUserIDByUsername(database, unfollowReq.TargetID)
		fmt.Printf("Found the users' ID : %d ", targetID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Target user not found"})
			return
		}

	case "page":
		// Fetch the target ID using the GetStateIDByCode service for pages
		targetID, err = services.GetStateIDByCode(database, unfollowReq.TargetID)
		fmt.Printf("Found the states' ID : %d ", targetID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "State not found in Database"})
			return
		}
	}

	// Delete the follow relationship
	result := database.Where("follower_id = ? AND target_id = ? AND type = ?", unfollowerID, targetID, unfollowReq.Type).
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

// @Summary Check follow status
// @Description Check if a follower is following a target (user or page).
// @Tags users
// @Accept json
// @Produce json
// @Param request body models.IsFollowingRequest true "Follower ID, Target ID, and type"
// @Success 200 "{"message":"true"}"
// @Failure 400 "{"message":"Invalid request body or type"}"
// @Failure 500 "{"message":"Database error"}"
// @Router /users/follow/check [post]
func IsFollowing(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	var requestBody struct {
		FollowerID string `json:"follower_id" binding:"required"`
		TargetID   string `json:"target_id" binding:"required"`
		Type       string `json:"type" binding:"required,oneof=user page"`
	}

	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	var followerID uint
	var targetID uint

	followerID, err = services.GetUserIDByUsername(database, requestBody.FollowerID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	switch requestBody.Type {
	case "user":
		// Fetch the target ID using the GetUserIDByUsername service
		targetID, err = services.GetUserIDByUsername(database, requestBody.TargetID)
		fmt.Printf("Found the users' ID : %d ", targetID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "Target user not found"})
			return
		}

	case "page":
		// Fetch the target ID using the GetStateIDByCode service for pages
		targetID, err = services.GetStateIDByCode(database, requestBody.TargetID)
		fmt.Printf("Found the states' ID : %d ", targetID)
		if err != nil {
			c.JSON(http.StatusNotFound, gin.H{"error": "State not found in Database"})
			return
		}
	}

	var follow models.Follows
	err = database.Where("follower_id = ? AND target_id = ? AND type = ?",
		followerID,
		targetID,
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

// @Summary Updates profile picture.
// @Description The API accepts url of the profile image on aws and stores into DB.
// @Tags users
// @Accept json
// @Produce json
// @Param request body models.ProfilePicUpdate true "Username, ImageURL"
// @Success 200 "{"message":"Profile picture updated successfully"}"
// @Failure 400 "{"message":"Invalid request body or type"}"
// @Failure 500 "{"message":"Database error"}"
// @Router /users/profile-pic [post]
func UpdateProfilePic(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	var req struct {
		Username string `json:"username" binding:"required"`
		ImageURL string `json:"image_url" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	// Find the user by username and update the profile picture URL
	result := database.Model(&models.User{}).Where("username = ?", req.Username).Update("profile_pic_url", req.ImageURL)
	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile picture"})
		return
	}

	if result.RowsAffected == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Profile picture updated successfully"})
}

// @Summary Retrieve user profile picture
// @Description Get the profile picture URL of a user by username.
// @Tags users
// @Accept json
// @Produce json
// @Param username path string true "Username of the user"
// @Success 200 {object} map[string]string "{"profile_pic_url": "https://example.com/profile.jpg"}"
// @Failure 404 {object} map[string]string "{"error":"User not found"}"
// @Failure 500 {object} map[string]string "{"error":"Database connection failed"}" or "{"error":"Database error"}"
// @Router /users/profile-pic/{username} [get]
func GetProfilePic(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	username := c.Param("username") // Get username from URL parameter

	var user models.User
	if err := database.Select("profile_pic_url").Where("username = ?", username).First(&user).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"profile_pic_url": user.ProfilePic})
}
