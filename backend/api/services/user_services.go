package services

import (
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

// Get state ID by given code
func GetStateIDByCode(database *gorm.DB, stateCode string) (uint, error) {
	var state struct {
		ID uint
	}

	err := database.Model(&models.States{}).
		Select("id").
		Where("code = ?", stateCode).
		Scan(&state).Error

	return state.ID, err
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

	err := database.Model(&models.States{}).
		Select("id, code, name").
		Where("id = ?", stateID).
		Scan(&state).Error

	return state, err
}
