package main

import "math/rand"

const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var allowedMIMETypes = []string{"image/png", "image/jpeg", "text/plain", "video/mp4", "image/gif"}

func randomString(n int) string {
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[rand.Intn(len(letters))]
	}
	return string(b)
}

func allowedMIME(mime string) bool {
	for _, m := range allowedMIMETypes {
		if m == mime {
			return true
		}
	}
	return false
}
