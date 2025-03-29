package handlers

import (
	"fmt"
	"net/http"
	"roamio/backend/api"
	"roamio/backend/api/services"
	_ "roamio/backend/docs"
	"roamio/backend/models"

	"github.com/gin-gonic/gin"
)

// func GetItineraryFeed(c *gin.Context) {
// 	database, err := api.DatabaseConnection()
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
// 		return
// 	}

// 	// Get user ID from URL parameter
// 	userIDParam := c.Param("user_name")
// 	userID, err := services.GetUserIDByUsername(database, userIDParam)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
// 		return
// 	}

// 	// Fetch users and pages the user follows
// 	followings, err := services.RetrieveFollowings(database, userID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve followings"})
// 		return
// 	}

// 	var followedUserIDs, followedPageIDs []uint

// 	// Separate user and page IDs
// 	for _, following := range followings {
// 		if following.Type == "user" {
// 			followedUserIDs = append(followedUserIDs, following.ID)
// 		} else if following.Type == "page" {
// 			followedPageIDs = append(followedPageIDs, following.ID)
// 		}
// 	}

// 	var followedItineraries, suggestedItineraries []models.Itinerary

// 	// Fetch itineraries from users the person follows
// 	if len(followedUserIDs) > 0 {
// 		database.Where("userID IN (?)", followedUserIDs).
// 			Order("posted_at DESC").
// 			Find(&followedItineraries)
// 	}

// 	// Fetch itineraries from pages (states) the person follows
// 	if len(followedPageIDs) > 0 {
// 		var pageItineraries []models.Itinerary
// 		database.Where("stateID IN (?)", followedPageIDs).
// 			Order("posted_at DESC").
// 			Find(&pageItineraries)
// 		followedItineraries = append(followedItineraries, pageItineraries...)
// 	}

// 	// If there are still not enough itineraries, fetch all other posts
// 	if len(followedItineraries) < 10 {
// 		database.Not("userID IN (?) OR stateID IN (?)", followedUserIDs, followedPageIDs).
// 			Order("posted_at DESC").
// 			Limit(10 - len(followedItineraries)).
// 			Find(&suggestedItineraries)
// 	}

// 	// Return JSON with separate categories
// 	c.JSON(http.StatusOK, gin.H{
// 		"followed":  followedItineraries,
// 		"suggested": suggestedItineraries,
// 	})
// }

// func GetItineraryFeed(c *gin.Context) {
// 	database, err := api.DatabaseConnection()
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection failed"})
// 		return
// 	}

// 	// Get user ID from URL parameter
// 	userIDParam := c.Param("user_name")
// 	userID, err := services.GetUserIDByUsername(database, userIDParam)
// 	if err != nil {
// 		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
// 		return
// 	}

// 	// Fetch users and pages the user follows
// 	followings, err := services.RetrieveFollowings(database, userID)
// 	if err != nil {
// 		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve followings"})
// 		return
// 	}

// 	var followedUserIDs, followedPageIDs []uint

// 	// Separate user and page IDs
// 	for _, following := range followings {
// 		if following.Type == "user" {
// 			followedUserIDs = append(followedUserIDs, following.ID)
// 		} else if following.Type == "page" {
// 			followedPageIDs = append(followedPageIDs, following.ID)
// 		}
// 	}

// 	var followedItineraries, suggestedItineraries []models.Itinerary

// 	// Fetch itineraries from users the person follows with StateCode
// 	if len(followedUserIDs) > 0 {
// 		database.Joins("JOIN states ON itineraries.stateID = states.id").
// 			Select("itineraries.*, states.code as state_code").
// 			Where("userID IN (?)", followedUserIDs).
// 			Order("itineraries.posted_at DESC").
// 			Find(&followedItineraries)
// 	}

// 	// Fetch itineraries from pages (states) the person follows with StateCode
// 	if len(followedPageIDs) > 0 {
// 		var pageItineraries []models.Itinerary
// 		database.Joins("JOIN states ON itineraries.stateID = states.id").
// 			Select("itineraries.*, states.code as state_code").
// 			Where("stateID IN (?)", followedPageIDs).
// 			Order("itineraries.posted_at DESC").
// 			Find(&pageItineraries)
// 		followedItineraries = append(followedItineraries, pageItineraries...)
// 	}
// 	fmt.Printf("Followed Itineraries: %d\n", len(followedItineraries))

// 	// If there are still not enough itineraries, fetch all other posts with StateCode
// 	if len(followedItineraries) < 10 {
// 		database.Joins("JOIN states ON itineraries.stateID = states.id").
// 			Select("itineraries.*, states.code as state_code").
// 			Not("userID IN (?) OR stateID IN (?)", followedUserIDs, followedPageIDs).
// 			Order("itineraries.posted_at DESC").
// 			Limit(10 - len(followedItineraries)).
// 			Find(&suggestedItineraries)
// 		fmt.Printf(("Suggested: %d"), len(suggestedItineraries))
// 	}
// 	type ItineraryResponse struct {
// 		models.Itinerary        // Embed the original Itinerary struct
// 		Username         string `json:"username"`
// 		StateCode        string `json:"state_code"`
// 	}

// 	// Convert to response struct with username and state_code
// 	var followedResponse, suggestedResponse []ItineraryResponse

// 	// Process followed itineraries
// 	for _, itinerary := range followedItineraries {
// 		username, err := services.GetUsernameByID(database, itinerary.UserID)
// 		if err != nil {
// 			username = "Unknown" // Fallback if username fetch fails
// 		}

// 		stateDetails, err := services.GetStateDetailsByID(database, itinerary.StateId)
// 		if err != nil {
// 			stateDetails.Code = "Unknown" // Fallback if state fetch fails
// 		}

// 		followedResponse = append(followedResponse, ItineraryResponse{
// 			Itinerary: itinerary,
// 			Username:  username,
// 			StateCode: stateDetails.Code,
// 		})
// 	}

// 	// Process suggested itineraries
// 	for _, itinerary := range suggestedItineraries {
// 		username, err := services.GetUsernameByID(database, itinerary.UserID)
// 		if err != nil {
// 			username = "Unknown" // Fallback if username fetch fails
// 		}

// 		stateDetails, err := services.GetStateDetailsByID(database, itinerary.StateId)
// 		if err != nil {
// 			stateDetails.Code = "Unknown" // Fallback if state fetch fails
// 		}

// 		suggestedResponse = append(suggestedResponse, ItineraryResponse{
// 			Itinerary: itinerary,
// 			Username:  username,
// 			StateCode: stateDetails.Code,
// 		})
// 	}
// 	// Return JSON with separate categories and state codes
// 	c.JSON(http.StatusOK, gin.H{
// 		"followed":  followedResponse,
// 		"suggested": suggestedResponse,
// 	})
// }

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
	for _, following := range followings {
		if following.Type == "user" {
			followedUserIDs = append(followedUserIDs, following.ID)
		} else if following.Type == "page" {
			followedPageIDs = append(followedPageIDs, following.ID)
		}
	}
	fmt.Printf("Followed User IDs: %v\n", followedUserIDs)
	fmt.Printf("Followed Page IDs: %v\n", followedPageIDs)

	var followedItineraries, suggestedItineraries []models.Itinerary

	// Fetch followed itineraries (users)
	if len(followedUserIDs) > 0 {
		err = database.Joins("JOIN states ON itineraries.stateID = states.id").
			Select("itineraries.*, states.code as state_code").
			Where("userID IN (?)", followedUserIDs).
			Order("itineraries.posted_at DESC").
			Limit(10).
			Find(&followedItineraries).Error
		if err != nil {
			fmt.Printf("Error fetching followed user itineraries: %v\n", err)
		}
	}

	// Fetch followed itineraries (pages)
	if len(followedPageIDs) > 0 {
		var pageItineraries []models.Itinerary
		err = database.Joins("JOIN states ON itineraries.stateID = states.id").
			Select("itineraries.*, states.code as state_code").
			Where("stateID IN (?)", followedPageIDs).
			Order("itineraries.posted_at DESC").
			Limit(10 - len(followedItineraries)).
			Find(&pageItineraries).Error
		if err != nil {
			fmt.Printf("Error fetching followed page itineraries: %v\n", err)
		}
		followedItineraries = append(followedItineraries, pageItineraries...)
	}
	fmt.Printf("Followed Itineraries: %d\n", len(followedItineraries))

	// Fetch suggested itineraries
	query := database.Joins("JOIN states ON itineraries.stateID = states.id").
		Select("itineraries.*, states.code as state_code").
		Order("itineraries.posted_at DESC").
		Limit(5)

	if len(followedUserIDs) > 0 {
		query = query.Where("userID NOT IN (?)", followedUserIDs)
	} // Else: No WHERE clause, fetch all itineraries

	err = query.Find(&suggestedItineraries).Error
	if err != nil {
		fmt.Printf("Error fetching suggested itineraries: %v\n", err)
	}
	fmt.Printf("Suggested Itineraries: %d\n", len(suggestedItineraries))

	// Response struct
	type ItineraryResponse struct {
		models.Itinerary
		Username  string `json:"username"`
		StateCode string `json:"state_code"`
	}

	var followedResponse, suggestedResponse []ItineraryResponse

	// Process followed itineraries
	for _, itinerary := range followedItineraries {
		username, err := services.GetUsernameByID(database, itinerary.UserID)
		if err != nil {
			username = "Unknown"
		}
		stateDetails, err := services.GetStateDetailsByID(database, itinerary.StateId)
		if err != nil {
			stateDetails.Code = "Unknown"
		}
		followedResponse = append(followedResponse, ItineraryResponse{
			Itinerary: itinerary,
			Username:  username,
			StateCode: stateDetails.Code,
		})
	}

	// Process suggested itineraries
	for _, itinerary := range suggestedItineraries {
		username, err := services.GetUsernameByID(database, itinerary.UserID)
		if err != nil {
			username = "Unknown"
		}
		stateDetails, err := services.GetStateDetailsByID(database, itinerary.StateId)
		if err != nil {
			stateDetails.Code = "Unknown"
		}
		suggestedResponse = append(suggestedResponse, ItineraryResponse{
			Itinerary: itinerary,
			Username:  username,
			StateCode: stateDetails.Code,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"followed":  followedResponse,
		"suggested": suggestedResponse,
	})
}
