package models

type User struct {
	ID       uint   `gorm:"column:id;primaryKey"`
	Username string `gorm:"column:username;unique;not null"`
	Email    string `gorm:"column:email;unique;not null"`
	Password string `gorm:"column:password;not null"`
}
