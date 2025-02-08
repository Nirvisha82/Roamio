package api

import (
	"log"
	"os"
	"roamio/backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func databaseConnection() (*gorm.DB, error) {
	var pathToDatabase string
	err := godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file") // Log error but continue if already loaded
	}

	// Get the database path from the environment variable
	pathToDatabase = os.Getenv("DATABASE_PATH")
	if pathToDatabase == "" {
		pathToDatabase = "../database/roamioDb.db" // Default path if not set
	}

	database, err := gorm.Open(sqlite.Open(pathToDatabase), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	// Automatically migrate the schema for the User model
	err = database.AutoMigrate(&models.User{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	return database, nil
}
