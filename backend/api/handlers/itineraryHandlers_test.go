package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"os"
	"roamio/backend/api"
	"roamio/backend/models"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.Default()
	router.GET("/itineraries", GetAllItinerary)
	router.POST("/itineraries", CreateItinerary)
	router.GET("/itineraries/user/:userID", GetItineraryByUserId)
	router.GET("/itineraries/state/:stateID", GetItineraryByStateId)
	router.GET("/itineraries/top-states", GetTopKStatesByFollowers)
	router.GET("/itineraries/top-users", GetTopKStatesByFollowers)
	return router
}

func TestCreateItinerarySuccess(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	itinerary := models.Itinerary{
		UserID:      1,
		StateId:     1,
		Title:       "Test Trip",
		Description: "Test Description",
		NumDays:     3,
		NumNights:   2,
		Size:        4,
		Budget:      "$500",
	}

	body, _ := json.Marshal(itinerary)
	req, _ := http.NewRequest("POST", "/itineraries", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusCreated, w.Code)
}

func TestCreateItineraryMissingUserId(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	itinerary := models.Itinerary{
		StateId:     1,
		Title:       "Test Trip",
		Description: "Test Description",
		NumDays:     3,
		NumNights:   2,
		Size:        4,
		Budget:      "$500",
	}

	body, _ := json.Marshal(itinerary)
	req, _ := http.NewRequest("POST", "/itineraries", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateItineraryMissingStateId(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	itinerary := models.Itinerary{
		UserID:      1,
		Title:       "Test Trip",
		Description: "Test Description",
		NumDays:     3,
		NumNights:   2,
		Size:        4,
		Budget:      "$500",
	}

	body, _ := json.Marshal(itinerary)
	req, _ := http.NewRequest("POST", "/itineraries", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestCreateItineraryMissingFields(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	itinerary := models.Itinerary{
		UserID:      1,
		StateId:     1,
		Description: "Test Description",
		NumDays:     3,
		NumNights:   2,
		Budget:      "$500",
	}

	body, _ := json.Marshal(itinerary)
	req, _ := http.NewRequest("POST", "/itineraries", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestGetAllItinerary(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	req, _ := http.NewRequest("GET", "/itineraries", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetItineraryByUserId(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	req, _ := http.NewRequest("GET", "/itineraries/user/1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetTopKStatesByFollowersSuccess(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	req, _ := http.NewRequest("GET", "/itineraries/top-states?k=2", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}

func TestGetTopKStatesByFollowersMissingK(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	req, _ := http.NewRequest("GET", "/itineraries/top-states", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestGetTopKStatesByFollowersFailureInvalidK(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	req, _ := http.NewRequest("GET", "/itineraries/top-states?k=-1", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusBadRequest, w.Code)
}

func TestGetTopKUsersByFollowersSuccess(t *testing.T) {
	os.Setenv("TEST_MODE", "true")
	router := setupRouter()
	api.InitDatabase()

	req, _ := http.NewRequest("GET", "/itineraries/top-users?k=2", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)
}
