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
	UserID      uint   `json:"UserID"`
	StateCode   string `json:"StateCode"` // Frontend sends the state code, not state ID
	Title       string `json:"Title"`
	Description string `json:"Description"`
	NumDays     uint   `json:"NumDays"`
	NumNights   uint   `json:"NumNights"`
	Size        uint   `json:"Size"`
	Budget      string `json:"Budget"`
	Highlights  string `json:"Highlights"`
	Suggestions string `json:"Suggestions"`
	Images      string `json:"Images"`
}
