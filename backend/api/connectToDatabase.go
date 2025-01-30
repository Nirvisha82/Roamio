package api

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func databaseConnection() (*gorm.DB, error) {
	var pathToDatabase string = "../database/roamioDb.db"
	database, err := gorm.Open(sqlite.Open(pathToDatabase), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return database, nil
}
