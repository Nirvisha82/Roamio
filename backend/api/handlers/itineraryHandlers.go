package handlers

import (
	"errors"
	"log"
	"net/http"
	"roamio/backend/api"
	"roamio/backend/api/services"
	_ "roamio/backend/docs"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// @Summary Get all itineraries
// @Description Retrieve all itineraries with user details.
// @Tags itineraries
// @Produce json
// @Success 200 {array} models.ItineraryResponse "List of itineraries"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /itineraries [get]
func GetAllItinerary(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		log.Fatal("failed to connect to Database")
	}
	type ItineraryResponse struct {
		models.Itinerary
		Username string `json:"username"`
	}

	var itineraries []ItineraryResponse

	result := database.Table("itineraries").
		Select("itineraries.*, users.username").
		Joins("LEFT JOIN users ON users.id = itineraries.userID").
		Scan(&itineraries)

	if result.Error != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}

	c.JSON(http.StatusOK, itineraries)
}

// @Summary Create a new itinerary
// @Description Create a new itinerary with required fields.
// @Tags itineraries
// @Accept json
// @Produce json
// @Param itinerary body models.CreateItineraryRequest true "Itinerary details"
// @Success 201 {object} models.SuccessResponse "Itinerary created successfully"
// @Failure 400 {object} models.ErrorResponse "Invalid input data or missing fields"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /itineraries [post]
func CreateItinerary(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		log.Fatal("failed to connect to Database")
	}
	var request models.ItineraryRequest
	// Bind the incoming JSON request body to the request struct
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	// Validate required fields
	if request.Title == "" || request.UserID == 0 || request.StateCode == "" || request.Size == 0 || request.Budget == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	// Look up the state ID using the state code sent by the frontend
	var state models.States
	err = database.Where("code = ?", request.StateCode).First(&state).Error
	if err != nil || state.ID == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "State not found"})
		return
	}

	// Now that we have the state ID, create the itinerary with that ID
	itinerary := models.Itinerary{
		UserID:      request.UserID,
		StateId:     state.ID, // Set the state ID based on the state code
		Title:       request.Title,
		Description: request.Description,
		NumDays:     request.NumDays,
		NumNights:   request.NumNights,
		Size:        request.Size,
		Budget:      request.Budget,
		Highlights:  request.Highlights,
		Suggestions: request.Suggestions,
		Images:      request.Images,
	}

	// Create the itinerary record in the database
	if err := database.Create(&itinerary).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create itinerary"})
		return
	}

	// Send success response
	c.JSON(http.StatusCreated, gin.H{"message": "Itinerary created successfully"})
}

// @Summary Get itineraries by user ID
// @Description Retrieve all itineraries created by a specific user.
// @Tags itineraries
// @Produce json
// @Param userID path int true "User ID"
// @Success 200 {array} models.responseItinerary "List of itineraries"
// @Failure 404 {object} models.ErrorResponse "User not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /itineraries/user/{userID} [get]
func GetItineraryByUserId(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		log.Fatal("failed to connect to Database")
	}

	userID := c.Param("userID")
	var itineraries []models.Itinerary

	if err := database.Where("userID = ?", userID).Find(&itineraries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve itineraries"})
		return
	}
	c.JSON(http.StatusOK, itineraries)
}

// @Summary Get itineraries by state ID
// @Description Retrieve all itineraries associated with a specific state.
// @Tags itineraries
// @Produce json
// @Param stateID path int true "State ID"
// @Success 200 {array} models.responseItinerary "List of itineraries"
// @Failure 404 {object} models.ErrorResponse "State not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /itineraries/state/{stateID} [get]
func GetItineraryByStateId(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	statecode := c.Param("statecode")

	// First verify the state exists and get its ID
	stateID, err := services.GetStateIDByCode(database, statecode)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "State not found in Database"})
		return
	}

	// Define response structure
	type ItineraryResponse struct {
		models.Itinerary
		Username  string `json:"username"`
		StateCode string `json:"state_code"`
	}

	var itineraries []models.Itinerary

	// First get all itineraries for this state
	if err := database.Where("stateID = ?", stateID).
		Order("id DESC").
		Find(&itineraries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve itineraries"})
		return
	}

	// Process each itinerary to add username and state code
	var response []ItineraryResponse
	for _, itinerary := range itineraries {
		username, err := services.GetUsernameByID(database, itinerary.UserID)
		if err != nil {
			username = "Unknown"
		}

		// Since we already have the state code from the URL, we can use it directly
		// Alternatively, you could fetch the state details again if needed
		response = append(response, ItineraryResponse{
			Itinerary: itinerary,
			Username:  username,
			StateCode: statecode, // Using the code from URL parameter
		})
	}

	c.JSON(http.StatusOK, gin.H{"itineraries": response})
}

// @Summary Get itinerary by post ID
// @Description Retrieve an itinerary by its post ID, including user details.
// @Tags itineraries
// @Produce json
// @Param postID path int true "Post ID"
// @Success 200 {object} models.responseItinerary "Itinerary details with user information"
// @Failure 404 {object} models.ErrorResponse "Itinerary not found"
// @Failure 500 {object} models.ErrorResponse "Internal server error"
// @Router /itineraries/post/{postID} [get]
func GetItineraryByPostId(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		log.Fatal("failed to connect to Database")
	}

	type Response struct {
		models.Itinerary
		Username string `json:"username"`
	}

	postID := c.Param("postID")
	var response Response

	// Get itinerary with username using JOIN
	err = database.Table("itineraries").
		Select("itineraries.*, users.username").
		Joins("LEFT JOIN users ON users.id = itineraries.userID").
		Where("itineraries.id = ?", postID).
		First(&response).
		Error

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			c.JSON(http.StatusNotFound, gin.H{"error": "Itinerary not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve itinerary"})
		}
		return
	}

	c.JSON(http.StatusOK, response)
}
