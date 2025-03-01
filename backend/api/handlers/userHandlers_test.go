package handlers

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
	"net/http/httptest"
	"os"
	"roamio/backend/api"
	"roamio/backend/models"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupUserRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/users", CreateUser)
	router.POST("/login", Login)
	router.POST("/followers", GetFollowers)
	router.POST("/followings", GetFollowings)
	return router
}

func TestCreateUserSuccess(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupUserRouter()

	user := models.User{
		Username: "testuser",
		Email:    "testuser@example.com",
		Password: "password123",
	}

	body, _ := json.Marshal(user)
	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestCreateUserConflict(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupUserRouter()

	// Get shared database connection
	database, _ := api.DatabaseConnection()

	// Setup: Insert an existing user into the database
	existingUser := models.User{
		Username: "testuser",
		Email:    "testuser@example.com",
		Password: "hashedpassword",
	}
	result := database.Create(&existingUser)
	if result.Error != nil {
		t.Fatalf("Failed to insert existing user: %v", result.Error)
	}
	log.Printf("Inserted user: %+v", existingUser)

	// Test: Attempt to create a user with the same username/email
	newUser := models.User{
		Username: "testuser",
		Email:    "testuser@example.com",
		Password: "password123",
	}
	body, _ := json.Marshal(newUser)
	req, _ := http.NewRequest("POST", "/users", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	// Assert: Expect 409 Conflict
	assert.Equal(t, http.StatusConflict, w.Code)

	// Teardown: Clean up the database
	database.Delete(&existingUser)
}

func TestLoginSuccess(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupUserRouter()

	loginRequest := map[string]string{
		"username_or_email": "testuser",
		"password":          "password123",
	}

	body, _ := json.Marshal(loginRequest)
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestLoginInvalidCredentials(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupUserRouter()

	loginRequest := map[string]string{
		"username_or_email": "wronguser",
		"password":          "wrongpassword",
	}

	body, _ := json.Marshal(loginRequest)
	req, _ := http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusUnauthorized, w.Code)
}

func TestGetFollowersSuccess(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupUserRouter()

	requestBody := map[string]interface{}{
		"id":   1,
		"type": "user",
	}

	body, _ := json.Marshal(requestBody)
	req, _ := http.NewRequest("POST", "/followers", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetFollowingsSuccess(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupUserRouter()

	requestBody := map[string]interface{}{
		"user_id": 1,
	}

	body, _ := json.Marshal(requestBody)
	req, _ := http.NewRequest("POST", "/followings", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
