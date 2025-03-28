package models

import "time"

type Itinerary struct {
	ID          uint      `gorm:"column:id;primaryKey"`
	UserID      uint      `gorm:"column:userID;not null"`
	StateId     uint      `gorm:"column:stateID;not null"`
	Title       string    `gorm:"column:title;not null"`
	Description string    `gorm:"column:description;not null"`
	NumDays     uint      `gorm:"column:numdays;not null"`
	NumNights   uint      `gorm:"column:numnights;not null"`
	Size        uint      `gorm:"column:size;not null"`
	Budget      string    `gorm:"column:budget;not null"`
	Highlights  string    `gorm:"column:highlights"`
	Suggestions string    `gorm:"column:suggestions"`
	Images      string    `gorm:"column:images"`
	PostedAt    time.Time `gorm:"column:posted_at;autoCreateTime"`
	UpdatedAt   time.Time `gorm:"column:updated_at;autoUpdateTime"`
}

type ItineraryRequest struct {
	UserID      uint   `json:"user_id"`
	StateCode   string `json:"state_code"` // Frontend sends the state code, not state ID
	Title       string `json:"title"`
	Description string `json:"description"`
	NumDays     uint   `json:"num_days"`
	NumNights   uint   `json:"num_nights"`
	Size        uint   `json:"size"`
	Budget      string `json:"budget"`
	Highlights  string `json:"highlights"`
	Suggestions string `json:"suggestions"`
	Images      string `json:"images"`
}
