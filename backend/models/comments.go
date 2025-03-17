package models

type Comments struct {
	ID          uint   `gorm:"column:id;primaryKey"`
	UserId      uint   `gorm:"column:userID;not null"`
	PostId      uint   `gorm:"column:postID;not null"`
	Description string `gorm:"column:description;not null"`
}
