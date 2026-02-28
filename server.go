package main

import (
	"fmt"
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v3"
	"github.com/gofiber/fiber/v3/extractors"
	"github.com/gofiber/fiber/v3/middleware/keyauth"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

var baseUrl string
var hashedApiKey string
var maxBodySize int = 50 // default to 50MB

var fileTypeMap = map[string]string{"image/png": ".png", "image/jpeg": ".jpg", "text/plain": ".txt", "video/mp4": ".mp4", "image/gif": ".gif"}

const uploadBasePath = "./uploads"

func init() {
	baseUrl = strings.TrimSuffix(strings.TrimSpace(os.Getenv("BASE_URL")), "/")
	hashedApiKey = strings.TrimSpace(os.Getenv("API_KEY"))
	maxBodySizeStr := strings.TrimSpace(os.Getenv("MAX_BODY_SIZE"))

	if baseUrl == "" || hashedApiKey == "" {
		log.Fatalln("API_KEY or BASE_URL not set")
	}

	if maxBodySizeStr != "" {
		parsedMaxBodySize, err := strconv.Atoi(maxBodySizeStr)
		if err != nil {
			log.Fatalf("failed to parse MAX_BODY_SIZE: %v", err)
		}

		maxBodySize = parsedMaxBodySize
	}
}

func main() {
	// Create upload directory if it doesn't exist
	if err := os.MkdirAll(uploadBasePath, 0755); err != nil {
		log.Fatalf("failed to create upload directory: %v", err)
	}

	app := fiber.New(fiber.Config{
		BodyLimit: maxBodySize * 1024 * 1024,
	})

	// Set up auth
	app.Use(keyauth.New(keyauth.Config{
		Extractor: extractors.FromAuthHeader("Bearer"),
		Validator: func(c fiber.Ctx, key string) (bool, error) {
			if bcrypt.CompareHashAndPassword([]byte(hashedApiKey), []byte(key)) == nil {
				return true, nil
			}

			return false, keyauth.ErrMissingOrMalformedAPIKey
		},
	}))

	// Upload route
	app.Post("/", func(c fiber.Ctx) error {
		// Get file from form
		file, err := c.FormFile("data")
		if err != nil {
			log.Printf("failed to resolve file: %v\n", err)
			return c.SendStatus(fiber.StatusBadRequest)
		}

		// Get file extension by Content-Type
		contentTypeHeader := file.Header.Get(fiber.HeaderContentType)
		fileExtension, ok := fileTypeMap[contentTypeHeader]
		if !ok {
			log.Printf("failed to resolve content type '%s'\n", contentTypeHeader)
			return c.SendStatus(fiber.StatusBadRequest)
		}

		// Build file name
		fileName := uuid.NewString() + fileExtension

		// Save file
		if err := c.SaveFile(file, fmt.Sprintf("%s/%s", uploadBasePath, fileName)); err != nil {
			log.Printf("failed to write to file: %v\n", err)
			return c.SendStatus(fiber.StatusInternalServerError)
		}

		return c.SendString(fmt.Sprintf("%s/%s", baseUrl, fileName))
	})

	log.Fatal(app.Listen(":3000"))
}
