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

// Table for user-user & user-page Follow.
type Follows struct {
	ID         uint   `gorm:"primaryKey"`
	FollowerID uint   `gorm:"column:follower_id;index"` // User who is following
	TargetID   uint   `gorm:"column:target_id;index"`   // ID of target (user/page)
	Type       string `gorm:"column:type;not null"`
}

// Table for state and their IDs.
type Page struct {
	ID   uint   `gorm:"primaryKey"`
	Name string `gorm:"unique;not null"` // State Name
}
