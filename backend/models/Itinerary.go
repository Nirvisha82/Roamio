package models

type Itinerary struct {
	ID          uint   `gorm:"column:id;primaryKey"`
	UserID      uint   `gorm:"column:userID;not null"`
	StateId     uint   `gorm:"column:stateID;not null"`
	Title       string `gorm:"column:title;not null"`
	Description string `gorm:"column:description;not null"`
	NumDays     uint   `gorm:"column:numdays;not null"`
	NumNights   uint   `gorm:"column:numnights;not null"`
	Size        uint   `gorm:"column:size;not null"`
	Budget      string `gorm:"column:budget;not null"`
	Highlights  string `gorm:"column:highlights"`
	Suggestions string `gorm:"column:suggestions"`
	Images      string `gorm:"column:images"`
}
