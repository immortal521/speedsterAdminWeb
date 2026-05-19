package main

import (
  "crypto/aes"
  "crypto/cipher"
  "encoding/hex"
  "syscall/js"
)

var (
  key string
  iv  string
)

func encryptAES(_ js.Value, args []js.Value) interface{} {
  plaintext := []byte(args[0].String())

  block, err := aes.NewCipher([]byte(key))
  if err != nil {
    return err.Error()
  }

  mode := cipher.NewCBCEncrypter(block, []byte(iv))

  padLen := aes.BlockSize - len(plaintext)%aes.BlockSize
  for i := 0; i < padLen; i++ {
    plaintext = append(plaintext, byte(padLen))
  }

  ciphertext := make([]byte, len(plaintext))
  mode.CryptBlocks(ciphertext, plaintext)

  return hex.EncodeToString(ciphertext)
}

func decryptAES(_ js.Value, args []js.Value) interface{} {
  ciphertext, err := hex.DecodeString(args[0].String())
  if err != nil {
    return err.Error()
  }

  block, err := aes.NewCipher([]byte(key))
  if err != nil {
    return err.Error()
  }

  mode := cipher.NewCBCDecrypter(block, []byte(iv))

  plaintext := make([]byte, len(ciphertext))
  mode.CryptBlocks(plaintext, ciphertext)

  padLen := int(plaintext[len(plaintext)-1])
  plaintext = plaintext[:len(plaintext)-padLen]

  return string(plaintext)
}

func main() {
  c := make(chan struct{})

  js.Global().Set("encryptAES", js.FuncOf(encryptAES))
  js.Global().Set("decryptAES", js.FuncOf(decryptAES))

  <-c
}
