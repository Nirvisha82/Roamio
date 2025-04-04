package services

import (
	"fmt"
	"roamio/backend/models"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

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

func GetUserIDByUsername(database *gorm.DB, username string) (uint, error) {
	var user struct {
		ID uint
	}

	// Query the database for the user with the given username
	err := database.Model(&models.User{}).
		Select("id").
		Where("username = ?", username).
		Scan(&user).Error

	// Check if any error occurred during the query
	if err != nil {
		return 0, err
	}

	// If no user found (ID is 0), return an error
	if user.ID == 0 {
		return 0, fmt.Errorf("user with username '%s' not found", username)
	}

	return user.ID, nil
}

func GetUsernameByID(database *gorm.DB, userID uint) (string, error) {
	var user struct {
		Username string
	}

	// Query the database for the user with the given ID
	err := database.Model(&models.User{}).
		Select("username").
		Where("id = ?", userID).
		Scan(&user).Error

	// Check if any error occurred during the query
	if err != nil {
		return "", err
	}

	// If no user found (Username is empty), return an error
	if user.Username == "" {
		return "", fmt.Errorf("user with ID %d not found", userID)
	}

	return user.Username, nil
}

// HashPassword hashes a plain-text password using bcrypt
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPasswordHash compares a plain-text password with a hashed password
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
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
		Type string `json:"type"`
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}

	// Temporary slice to store results before appending
	var userFollowings []struct {
		Type string `json:"type"`
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}

	// Query for users being followed
	err := database.Table("follows").
		Select("'user' as type, users.id, users.username as name").
		Joins("JOIN users ON users.id = follows.target_id").
		Where("follows.follower_id = ? AND follows.type = 'user'", followerID).
		Scan(&userFollowings).Error
	if err != nil {
		return nil, err
	}

	// Append user followings to main slice
	followings = append(followings, userFollowings...)

	// Temporary slice for pages
	var pageFollowings []struct {
		Type string `json:"type"`
		ID   uint   `json:"id"`
		Name string `json:"name"`
	}

	// Query for pages being followed
	err = database.Table("follows").
		Select("'page' as type, states.id, states.name").
		Joins("JOIN states ON states.id = follows.target_id").
		Where("follows.follower_id = ? AND follows.type = 'page'", followerID).
		Scan(&pageFollowings).Error
	if err != nil {
		return nil, err
	}

	// Append page followings to main slice
	followings = append(followings, pageFollowings...)

	return followings, nil
}

// Get state ID by given code
func GetStateIDByCode(database *gorm.DB, stateCode string) (uint, error) {
	var state struct {
		ID uint
	}

	// Query the database for the state with the given code
	err := database.Model(&models.States{}).
		Select("id").
		Where("code = ?", stateCode).
		Scan(&state).Error

	// Check if any error occurred during the query
	if err != nil {
		return 0, err
	}

	// If no state found (ID is 0), return an error
	if state.ID == 0 {
		return 0, fmt.Errorf("state with code '%s' not found", stateCode)
	}

	return state.ID, nil
}

// Get state details by given ID
func GetStateDetailsByID(database *gorm.DB, stateID uint) (struct {
	ID   uint
	Code string
	Name string
}, error) {
	var state struct {
		ID   uint
		Code string
		Name string
	}

	// Query the database for the state with the given ID
	err := database.Model(&models.States{}).
		Select("id, code, name").
		Where("id = ?", stateID).
		Scan(&state).Error

	// Check if any error occurred during the query
	if err != nil {
		return state, err
	}

	// If no state found (ID is 0), return an error
	if state.ID == 0 {
		return state, fmt.Errorf("state with ID %d not found", stateID)
	}

	return state, nil
}
