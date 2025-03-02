package handlers

import (
	"errors"
	"log"
	"net/http"
	"roamio/backend/api"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

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
