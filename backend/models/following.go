package models

type Following struct {
	Type string `json:"type"` // "user" or "page"
	ID   uint   `json:"id"`
	Name string `json:"name"`
	Code string `json:"code,omitempty"` // Code is optional
}
