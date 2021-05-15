package main

import "math/rand"

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var fileTypes = map[string]string{"image/png": ".png", "image/jpeg": ".jpg", "text/plain": ".txt", "video/mp4": ".mp4", "image/gif": ".gif"}

func randomString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func getFileExtensionByType(fileType string) string {
	ext, ok := fileTypes[fileType]
	if ok {
		return ext
	}
	return ""
}
