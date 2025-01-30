package main

import (
	"roamio/backend/api"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/users", api.GetAllUsers)
	router.POST("/users", api.CreateUser)
	router.Run(":8080")

	// http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
	// 	fmt.Fprintln(w, "Hello, this is Backend!")
	// })

	// fmt.Println("Server is running on http://localhost:8080")
	// http.ListenAndServe(":8080", nil)
}
