package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"roamio/backend/models"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupRouterComments() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.POST("/comments", CreateComment)
	router.GET("/comments", GetAllComments)
	router.GET("/comments/post/:postID", GetCommentsByPostId)
	router.PUT("/comments", UpdateComment)
	return router
}

// Test CreateComment
func TestCreateCommentSuccess(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouterComments()

	comment := models.Comments{
		ID:          1,
		UserId:      1,
		PostId:      1,
		Description: "Test comment",
	}

	body, _ := json.Marshal(comment)
	req, _ := http.NewRequest("POST", "/comments", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
	assert.Contains(t, w.Body.String(), `"message":"Comment created successfully"`)
}

func TestGetAllComments(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouterComments()

	req, _ := http.NewRequest("GET", "/comments", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestCreateCommentMissingPostId(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouterComments()

	comment := models.Comments{
		ID:          1,
		UserId:      1,
		Description: "Test comment",
	}

	body, _ := json.Marshal(comment)
	req, _ := http.NewRequest("POST", "/comments", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), `"error":"Missing required fields"`)
}

func TestCreateCommentMissingUserId(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouterComments()

	comment := models.Comments{
		ID:          1,
		PostId:      1,
		Description: "Test comment",
	}

	body, _ := json.Marshal(comment)
	req, _ := http.NewRequest("POST", "/comments", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), `"error":"Missing required fields"`)
}

func TestCreateCommentMissingDescription(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouterComments()

	comment := models.Comments{
		ID:     1,
		PostId: 1,
		UserId: 1,
	}

	body, _ := json.Marshal(comment)
	req, _ := http.NewRequest("POST", "/comments", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.Contains(t, w.Body.String(), `"error":"Missing required fields"`)
}

func TestGetCommentsByPostId(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouterComments()

	req, _ := http.NewRequest("GET", "/comments/post/1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
