package content

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"strings"
	"sync"
	"time"
)

// Aliases for convenience.
type (
	directory = string
	fileName  = string
	title     = string
)

var (
	unsupportedResourceType = fmt.Errorf("Unsupported resource type!")
	doesNotExist            = fmt.Errorf("Requested resource does not exist!")
)

var fsErrors = map[error]int{
	unsupportedResourceType: http.StatusBadRequest,
	doesNotExist:            http.StatusBadRequest,
	nil:                     http.StatusOK,
}

var contentMap = map[string]string{
	"articles": "Articles",
	"pdfs":     "PDFs",
}

// typeMap maps content types to file type extensions.
var typeMap = map[string]string{
	"articles": "md", // articles are markdown documents
}

// contentEnum is a content enumeration for a directory.
// It maps a directory to a map of the files stored in
// the directory to their titles. This is intended to
// be used to generate an index for the frontend.
type contentEnum struct {
	enum map[directory]map[fileName]title
	mu   sync.Mutex
}

// fsIndex returns an index of the content stored in the
// specified directory dir. This can be used directly by
// the frontend.
func (ce contentEnum) fsIndex(dir string) map[string]string {
	ce.mu.Lock()
	defer ce.mu.Unlock()

	return ce.enum[dir]
}

type indexEntry struct {
	FileName string `json:"fileName"`
	Title    string `json:"title"`
}

type contentIndex []indexEntry

func (ce contentEnum) indexAll() map[string]contentIndex {
	ce.mu.Lock()
	defer ce.mu.Unlock()

	fullIndex := make(map[string]contentIndex)
	for rType, rName := range contentMap {
		var contentList contentIndex
		for k, v := range ce.enum[rType] {
			contentList = append(contentList, indexEntry{k, v})
		}

		fullIndex[rName] = contentList
	}

	return fullIndex
}

// fs is the content enumeration for the core/content/fs
// directory.
// This should be the only copy as any other copies
// will mean that the mutex has been copied too.
var fs = contentEnum{
	enum: make(map[directory]map[fileName]title),
	mu:   sync.Mutex{},
}

// EnumerateContent is a function which fires off a routine to
// reload the fs contentEnum every 30s. This ensures that the index is
// mostly up to date with the file-system contents.
// For each directory, it attempts to locate an 'enum.txt' file
// which is maps filenames to titles. The delimiter is '%^%'.
func EnumerateContent() {
	go func() {
		for {
			contentRoot := "./core/content/fs"
			files, err := ioutil.ReadDir(contentRoot)
			if err != nil {
				log.Println("error: fs enumeration failed!", err)
				goto wait
			}

			fs.mu.Lock()
			for _, f := range files {
				if f.IsDir() {
					dirName := f.Name()
					dirEnum := make(map[fileName]title)

					// read 'enum.txt'
					if enumB, err := ioutil.ReadFile(fmt.Sprintf("%s/%s/enum.txt",
						contentRoot, f.Name())); err != nil {
						log.Printf("error: expected enum.txt in %s", dirName)
					} else {
						enumEntries := strings.Split(string(enumB), "\n")
						for i := 0; i < len(enumEntries); i++ {
							entry := strings.Split(enumEntries[i], "%^%")
							if len(entry) != 2 {
								log.Printf("error: invalid enum entry - line %d in %s",
									i, dirName)
								// ignore
								continue
							}
							// add entry
							dirEnum[entry[0]] = entry[1]
						}
					}
					fs.enum[dirName] = dirEnum
				}
			}
			fs.mu.Unlock()

		wait:
			time.Sleep(30 * time.Second)
		}
	}()
}

// getResource checks if the requested resource exists in the
func getResource(rType, rID string) ([]byte, error, int) {
	fileExt := typeMap[rType]
	if fileExt == "" {
		return nil, unsupportedResourceType, fsErrors[unsupportedResourceType]
	}
	path := fmt.Sprintf("core/content/fs/%s/%s.%s", rType, rID, fileExt)
	if f, err := ioutil.ReadFile(path); err != nil {
		return nil, doesNotExist, fsErrors[doesNotExist]
	} else {
		return f, nil, fsErrors[nil]
	}
}
