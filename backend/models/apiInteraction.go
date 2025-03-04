package models

type createUserInput struct {
	// Full name of the user
	// Example: Parth Patel
	Fullname string `json:"Fullname"`

	// Location of the user
	// Example: Kansas
	Location string `json:"Location"`

	// Date of birth of the user in YYYY-MM-DD format
	// Example: 2000-04-08
	DOB string `json:"DOB"`

	// Username for the user account
	// Example: ParthPatel
	Username string `json:"Username"`

	// Email address of the user
	// Example: ppatel@ufl.edu
	Email string `json:"Email"`

	// Password for the user account
	// Example: test123
	Password string `json:"Password"`
}

type loginUser struct {
	UsernameOrEmail string `json:"username_or_email" binding:"required"`
	Password        string `json:"password" binding:"required"`
}

type loginResponse struct {
	Message string `json:"message" example:"Login successful"`
	User    struct {
		ID       int    `json:"ID" example:"1"`
		Fullname string `json:"Fullname" example:"Nirvisha Soni"`
		Location string `json:"Location" example:"Gainesville"`
		DOB      string `json:"DOB" example:"2002-05-26"`
		Username string `json:"Username" example:"NirvishaSoni"`
		Email    string `json:"Email" example:"nsoni@ufl.edu"`
		Password string `json:"Password" example:""`
	} `json:"user"`
}

type GetFollowersRequest struct {
	TargetID uint   `json:"target_id" binding:"required" example:"1"`
	Type     string `json:"type" binding:"required" example:"user" enums:"user,page"`
}

type GetFollowingsRequest struct {
	UserID uint `json:"user_id" binding:"required" example:"1"`
}

type UnfollowRequest struct {
	FollowerID uint   `json:"follower_id" binding:"required" example:"1"`
	TargetID   uint   `json:"target_id" binding:"required" example:"2"`
	Type       string `json:"type" binding:"required,oneof=user page" example:"user"`
}

type IsFollowingRequest struct {
	FollowerID uint   `json:"follower_id" binding:"required" example:"1"`
	TargetID   uint   `json:"target_id" binding:"required" example:"2"`
	Type       string `json:"type" binding:"required,oneof=user page" example:"user"`
}

type IsFollowingResponse struct {
	IsFollowing bool `json:"isFollowing" example:"true"`
}

type Follower struct {
	ID       uint   `json:"id" example:"1"`
	FullName string `json:"full_name" example:"John Doe"`
}

type Following struct {
	ID       uint   `json:"id" example:"2"`
	FullName string `json:"full_name" example:"Jane Smith"`
}

type CreateItineraryRequest struct {
	Title     string `json:"title" binding:"required" example:"Trip to Florida"`
	UserID    uint   `json:"user_id" binding:"required" example:"1"`
	StateId   uint   `json:"state_id" binding:"required" example:"2"`
	NumDays   int    `json:"num_days" binding:"required" example:"5"`
	NumNights int    `json:"num_nights" binding:"required" example:"4"`
	Size      int    `json:"size" binding:"required" example:"3"`
	Budget    string `json:"budget" binding:"required" example:"$1000"`
}

type ItineraryResponse struct {
	Itinerary Itinerary `json:",inline"`
	Username  string    `json:"username" example:"john_doe"`
}

type ErrorResponse struct {
	Error string `json:"error" example:"An error occurred"`
}

type SuccessResponse struct {
	Message string `json:"message" example:"Operation successful"`
}
type responseItinerary struct {
	ID        uint   `json:"id" example:"1"`
	Title     string `json:"title" example:"Trip to Florida"`
	UserID    uint   `json:"user_id" example:"1"`
	StateId   uint   `json:"state_id" example:"2"`
	NumDays   int    `json:"num_days" example:"5"`
	NumNights int    `json:"num_nights" example:"4"`
	Size      int    `json:"size" example:"3"`
	Budget    string `json:"budget" example:"$1000"`
}
