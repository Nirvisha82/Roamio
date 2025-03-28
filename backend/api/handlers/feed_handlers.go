package handlers

import (
	"net/http"
	"roamio/backend/api"
	"roamio/backend/api/services"
	_ "roamio/backend/docs"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
)

func GetItineraryFeed(c *gin.Context) {
	database, err := api.DatabaseConnection()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
		return
	}

	// Get user ID from URL parameter
	userIDParam := c.Param("user_name")
	userID, err := services.GetUserIDByUsername(database, userIDParam)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Fetch users and pages the user follows
	followings, err := services.RetrieveFollowings(database, userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve followings"})
		return
	}

	var followedUserIDs, followedPageIDs []uint

	// Separate user and page IDs
	for _, following := range followings {
		if following.Type == "user" {
			followedUserIDs = append(followedUserIDs, following.ID)
		} else if following.Type == "page" {
			followedPageIDs = append(followedPageIDs, following.ID)
		}
	}

	var followedItineraries, suggestedItineraries []models.Itinerary

	// Fetch itineraries from users the person follows
	if len(followedUserIDs) > 0 {
		database.Where("userID IN (?)", followedUserIDs).
			Order("posted_at DESC").
			Find(&followedItineraries)
	}

	// Fetch itineraries from pages (states) the person follows
	if len(followedPageIDs) > 0 {
		var pageItineraries []models.Itinerary
		database.Where("stateID IN (?)", followedPageIDs).
			Order("posted_at DESC").
			Find(&pageItineraries)
		followedItineraries = append(followedItineraries, pageItineraries...)
	}

	// If there are still not enough itineraries, fetch all other posts
	if len(followedItineraries) < 10 {
		database.Not("userID IN (?) OR stateID IN (?)", followedUserIDs, followedPageIDs).
			Order("posted_at DESC").
			Limit(10 - len(followedItineraries)).
			Find(&suggestedItineraries)
	}

	// Return JSON with separate categories
	c.JSON(http.StatusOK, gin.H{
		"followed":  followedItineraries,
		"suggested": suggestedItineraries,
	})
}
