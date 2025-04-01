package services

import (
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// User model for the test
type User struct {
	ID       uint `gorm:"primaryKey"`
	Fullname string
	Location string
	Dob      string
	Username string `gorm:"unique"`
	Email    string `gorm:"unique"`
	Password string
}

// State model for the test
type State struct {
	ID   uint   `gorm:"primaryKey"`
	Code string `gorm:"unique"`
	Name string `gorm:"unique"`
}

// Helper function to generate unique usernames/emails for tests
func generateUniqueUsername() string {
	return fmt.Sprintf("user%d", time.Now().UnixNano())
}

func generateUniqueEmail() string {
	return fmt.Sprintf("user%d@example.com", time.Now().UnixNano())
}

func generateUniqueStateName() string {
	return fmt.Sprintf("State%d", time.Now().UnixNano())
}

// Test setup for initializing the test database
func setupTestDB() (*gorm.DB, error) {
	// Read database URL from environment variable, or default to an in-memory SQLite DB
	dbURL := os.Getenv("TEST_DATABASE_URL")
	if dbURL == "" {
		dbURL = "file::memory:?cache=shared" // In-memory SQLite for isolation
	}

	// Connect to the database
	db, err := gorm.Open(sqlite.Open(dbURL), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %v", err)
	}

	// Migrate the schema (i.e., create tables)
	err = db.AutoMigrate(&User{}, &State{})
	if err != nil {
		return nil, fmt.Errorf("failed to migrate database: %v", err)
	}

	return db, nil
}

// Clean up the database after each test
func cleanupDatabase(db *gorm.DB) {
	// Delete all records from the relevant tables to ensure isolation
	db.Exec("DELETE FROM users")
	db.Exec("DELETE FROM states")
}

// Test function example
func TestGetUserProfile(t *testing.T) {
	// Set up the test database
	db, err := setupTestDB()
	if err != nil {
		t.Fatalf("Failed to set up test database: %v", err)
	}
	defer cleanupDatabase(db) // Clean up the DB after the test

	// Generate unique test data
	username := generateUniqueUsername()
	email := generateUniqueEmail()

	// Insert user for this test
	user := User{
		Fullname: "Test User",
		Location: "Location",
		Dob:      "1990-01-01",
		Username: username,
		Email:    email,
		Password: "hashedPassword", // Example hashed password
	}
	result := db.Create(&user)
	if result.Error != nil {
		t.Fatalf("Failed to insert user: %v", result.Error)
	}

	// Fetch the user from the database
	var fetchedUser User
	err = db.First(&fetchedUser, "username = ?", username).Error
	if err != nil {
		t.Fatalf("Failed to fetch user: %v", err)
	}

	// Verify the user's data matches
	assert.Equal(t, username, fetchedUser.Username)
	assert.Equal(t, email, fetchedUser.Email)
}

// Test function example for unique constraint
func TestUniqueUsernameAndEmail(t *testing.T) {
	// Set up the test database
	db, err := setupTestDB()
	if err != nil {
		t.Fatalf("Failed to set up test database: %v", err)
	}
	defer cleanupDatabase(db)

	// Generate unique test data
	username := generateUniqueUsername()
	email := generateUniqueEmail()

	// Insert first user
	user1 := User{
		Fullname: "Test User 1",
		Location: "Location 1",
		Dob:      "1990-01-01",
		Username: username,
		Email:    email,
		Password: "hashedPassword",
	}
	db.Create(&user1)

	// Try inserting second user with the same username/email
	user2 := User{
		Fullname: "Test User 2",
		Location: "Location 2",
		Dob:      "1992-02-02",
		Username: username, // Duplicate username
		Email:    email,    // Duplicate email
		Password: "hashedPassword",
	}
	result := db.Create(&user2)
	if result.Error == nil {
		t.Fatal("Expected UNIQUE constraint error, but got none")
	}
}

// Test setup for the state example
func TestGetStateIDByCode(t *testing.T) {
	// Set up the test database
	db, err := setupTestDB()
	if err != nil {
		t.Fatalf("Failed to set up test database: %v", err)
	}
	defer cleanupDatabase(db)

	// Generate unique state data
	stateCode := "CA"
	stateName := generateUniqueStateName()

	// Insert state into the database
	state := State{
		Code: stateCode,
		Name: stateName,
	}
	db.Create(&state)

	// Fetch the state by code
	var fetchedState State
	err = db.First(&fetchedState, "code = ?", stateCode).Error
	if err != nil {
		t.Fatalf("Failed to fetch state: %v", err)
	}

	// Verify the state data
	assert.Equal(t, stateCode, fetchedState.Code)
	assert.Equal(t, stateName, fetchedState.Name)
}
