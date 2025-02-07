package models

type User struct {
	ID       uint   `gorm:"column:id;primaryKey"`
	Fullname string `gorm:"column:fullname;not null"`
	Location string `gorm:"column:location;not null"`
	DOB      string `gorm:"column:dob;not null"` //DOB from ISO 8601 format yyy-mm-dd
	Username string `gorm:"column:username;unique;not null"`
	Email    string `gorm:"column:email;unique;not null"`
	Password string `gorm:"column:password;not null"`
}
