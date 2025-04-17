package api

import (
	"log"
	"os"
	"roamio/backend/models"

	"github.com/joho/godotenv"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

// func DatabaseConnection() (*gorm.DB, error) {
// 	var database *gorm.DB
// 	err := godotenv.Load()
// 	if err != nil {
// 		log.Println("Error loading .env file") // Log error but continue if already loaded
// 	}

// 	// Get the database path from the environment variable
// 	if os.Getenv("TEST_MODE") == "true" {
// 		database, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{}) // In-memory database for tests
// 	} else {
// 		pathToDatabase := os.Getenv("DATABASE_PATH")
// 		if pathToDatabase == "" {
// 			pathToDatabase = "../database/roamioDb.db"
// 		}
// 		database, err = gorm.Open(sqlite.Open(pathToDatabase), &gorm.Config{})
// 	}

// 	if err != nil {
// 		return nil, err
// 	}
// 	// Automatically migrate the schema for the User model
// 	err = database.AutoMigrate(&models.User{},
// 		&models.Itinerary{},
// 		&models.States{},
// 		&models.Follows{},
// 		&models.Comments{},
// 	)
// 	if err != nil {
// 		log.Fatalf("Failed to migrate database: %v", err)
// 	}

// 	return database, nil
// }

var database *gorm.DB

func InitDatabase() {
	var err error

	err = godotenv.Load()
	if err != nil {
		log.Println("Error loading .env file")
	}

	if os.Getenv("TEST_MODE") == "true" {
		database, err = gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	} else {
		pathToDatabase := os.Getenv("DATABASE_PATH")
		if pathToDatabase == "" {
			pathToDatabase = "../database/roamioDb.db"
		}
		database, err = gorm.Open(sqlite.Open(pathToDatabase), &gorm.Config{})
	}

	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// Only migrate ONCE during server start
	err = database.AutoMigrate(
		&models.User{},
		&models.Itinerary{},
		&models.States{},
		&models.Follows{},
		&models.Comments{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	log.Println("Database connection successfully initialized")
}

func DatabaseConnection() (*gorm.DB, error) {
	if database == nil {
		return nil, gorm.ErrInvalidDB
	}
	return database, nil
}

func CloseDatabase() {
	sqlDB, err := database.DB()
	if err == nil {
		sqlDB.Close()
	}
}
