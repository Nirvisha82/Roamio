package handlers

import (
	"errors"
	"log"
	"net/http"
	"roamio/backend/api"
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
	var itinerary models.Itinerary
	if err := c.ShouldBindJSON(&itinerary); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data"})
		return
	}

	if itinerary.Title == "" || itinerary.UserID == 0 || itinerary.StateId == 0 || itinerary.NumDays == 0 || itinerary.NumNights == 0 || itinerary.Size == 0 || itinerary.Budget == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing required fields"})
		return
	}

	if err := database.Create(&itinerary).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

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
		log.Fatal("failed to connect to Database")
	}

	stateID := c.Param("stateID")
	var itineraries []models.Itinerary

	if err := database.Where("stateID = ?", stateID).Find(&itineraries).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve itineraries"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"itineraries": itineraries})
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
