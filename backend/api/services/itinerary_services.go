package services

import "gorm.io/gorm"

// TopKStatesByFollowers returns the top K states based on the number of followers.
func TopKStatesByFollowers(database *gorm.DB, k int) ([]struct {
	StateID       uint   `json:"state_id"`
	StateName     string `json:"state_name"`
	StateCode     string `json:"state_code"`
	FollowerCount int    `json:"follower_count"`
}, error) {
	var results []struct {
		StateID       uint   `json:"state_id"`
		StateName     string `json:"state_name"`
		StateCode     string `json:"state_code"`
		FollowerCount int    `json:"follower_count"`
	}

	err := database.Table("follows").
		Select("states.id as state_id, states.name as state_name, states.code as state_code, COUNT(follows.id) as follower_count").
		Joins("JOIN states ON states.id = follows.target_id").
		Where("follows.type = ?", "page").
		Group("states.id").
		Order("follower_count DESC").
		Limit(k).
		Scan(&results).Error

	return results, err
}

func TopKUserByFollowers(database *gorm.DB, k int) ([]struct {
	UserID        uint   `json:"user_id"`
	UserName      string `json:"username"`
	FollowerCount int    `json:"follower_count"`
}, error) {
	var results []struct {
		UserID        uint   `json:"user_id"`
		UserName      string `json:"username"`
		FollowerCount int    `json:"follower_count"`
	}

	err := database.Table("follows").
		Select("users.id as user_id, users.username as username, COUNT(follows.id) as follower_count").
		Joins("JOIN users ON users.id = follows.target_id").
		Where("follows.type = ?", "user").
		Group("users.id").
		Order("follower_count DESC").
		Limit(k).
		Scan(&results).Error

	return results, err
}
