package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
)

const uploadPath = "./uploads"

var config appConfig

func main() {
	// Load config
	if err := loadConfig("config.json"); err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	// Create upload directory if it doesn't exist
	if err := os.MkdirAll(uploadPath, 0755); err != nil {
		log.Fatalf("failed to create upload directory: %v", err)
	}

	app := fiber.New()

	// Authentication middleware
	app.Use(authenticate)

	// Upload route
	app.Post("/", func(c *fiber.Ctx) error {
		user := c.Locals("user").(appUser)

		// Get file from form
		file, err := c.FormFile("data")
		if err != nil {
			return c.SendStatus(fiber.StatusBadRequest)
		}

		// Get file extension by Content-Type
		contentType := file.Header.Get(fiber.HeaderContentType)
		ext := getFileExtensionByType(contentType)
		if ext == "" {
			return c.SendStatus(fiber.StatusBadRequest)
		}

		// Build final file name
		fileName := user.Prefix + randomString(4) + ext

		// Save file
		if err := c.SaveFile(file, fmt.Sprintf("%s/%s", uploadPath, fileName)); err != nil {
			return c.SendStatus(fiber.StatusInternalServerError)
		}

		return c.SendString(fmt.Sprintf("%s/%s", config.BaseURL, fileName))
	})

	log.Fatal(app.Listen(":3000"))
}

func authenticate(c *fiber.Ctx) error {
	// Get Authorization header
	auth := c.Get(fiber.HeaderAuthorization)
	if len(auth) == 0 {
		return c.SendStatus(fiber.StatusUnauthorized)
	}

	// Find user
	for _, user := range config.Users {
		if user.Token == auth {
			c.Locals("user", user)
			return c.Next()
		}
	}

	return c.SendStatus(fiber.StatusUnauthorized)
}

func loadConfig(filename string) error {
	f, err := os.Open(filename)
	if err != nil {
		return err
	}
	defer f.Close()

	return json.NewDecoder(f).Decode(&config)
}
